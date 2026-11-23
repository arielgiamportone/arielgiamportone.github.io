// Serves private images from a third-party API to browsers that have no session there.
//
// The service token stays server-side. The proxy only fetches from an allow-list of
// hosts (anti-SSRF), re-checks every redirect hop against that list, and refuses to
// pass through anything that isn't an image: an expired upstream session typically
// answers with an HTML login page, which an <img> would silently render as broken.

const MAX_REDIRECTS = 3;

export function checkTarget(raw, allowedHosts) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "malformed url" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "https only" };
  if (url.username || url.password) return { ok: false, reason: "credentials in url" };
  if (url.port) return { ok: false, reason: "non-default port" };
  if (!allowedHosts.includes(url.hostname.toLowerCase())) {
    return { ok: false, reason: "host not allowed" };
  }
  return { ok: true, url };
}

export async function handlePhoto(req, { fetchImpl = fetch, token, allowedHosts, timeoutMs = 15000 }) {
  const raw = req.query?.u;
  if (!raw) return text(400, "missing parameter u");

  let check = checkTarget(raw, allowedHosts);
  if (!check.ok) return text(400, check.reason);

  let res;
  try {
    for (let hop = 0; ; hop++) {
      res = await fetchImpl(check.url.href, {
        headers: { Authorization: `Bearer ${token}` },
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status < 300 || res.status >= 400) break;
      if (hop >= MAX_REDIRECTS) return text(502, "too many redirects");
      // An allowed host must not be able to bounce us somewhere else.
      check = checkTarget(new URL(res.headers.get("location") ?? "", check.url).href, allowedHosts);
      if (!check.ok) return text(502, `redirect refused: ${check.reason}`);
    }
  } catch (err) {
    if (err.name === "TimeoutError") return text(504, "upstream timeout");
    return text(502, "upstream unreachable");
  }

  if (res.status === 404) return text(404, "not found");
  if (res.status === 401 || res.status === 403) return text(502, "upstream rejected credentials");
  if (!res.ok) return text(502, `upstream status ${res.status}`);

  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return text(502, "upstream did not return an image");

  return {
    status: 200,
    headers: {
      "Content-Type": type,
      // private: authenticated content must never land in a shared cache.
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
    body: Buffer.from(await res.arrayBuffer()),
  };
}

function text(status, message) {
  return { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }, body: message };
}
