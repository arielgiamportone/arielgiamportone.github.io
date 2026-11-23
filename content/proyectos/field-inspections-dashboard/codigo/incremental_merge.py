"""Incremental refresh over a cached history, with authority-window deletions.

The refresh only asks the source for a recent window (e.g. the last 3 months).
Rows in the response are upserted by key. Rows that did NOT come back are
deleted only if their date falls inside that window: outside it, we never
asked, so absence means nothing. Child tables follow their parent in cascade.

A safety threshold aborts the run if too much of the window would disappear,
which almost always means a partial response rather than real deletions.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd


class SuspiciousDeletion(RuntimeError):
    """Raised when a run would delete more of the window than the threshold allows."""


@dataclass
class MergeResult:
    table: pd.DataFrame
    inserted: int
    updated: int
    deleted_keys: set = field(default_factory=set)


def merge_with_authority_window(
    history: pd.DataFrame,
    fresh: pd.DataFrame,
    key: str,
    date_col: str,
    window_start: pd.Timestamp,
    window_end: pd.Timestamp,
    max_delete_ratio: float = 0.10,
) -> MergeResult:
    """Upsert `fresh` into `history` and delete rows the source no longer has.

    `fresh` must be the COMPLETE response for [window_start, window_end].
    """
    if fresh[key].duplicated().any():
        raise ValueError(f"duplicate keys in fresh data: column {key!r}")

    hist_dates = pd.to_datetime(history[date_col])
    in_window = (hist_dates >= window_start) & (hist_dates <= window_end)
    window_keys = set(history.loc[in_window, key])
    fresh_keys = set(fresh[key])

    to_delete = window_keys - fresh_keys
    if window_keys and len(to_delete) / len(window_keys) > max_delete_ratio:
        raise SuspiciousDeletion(
            f"{len(to_delete)} of {len(window_keys)} rows in the window would be deleted "
            f"(> {max_delete_ratio:.0%}). Refusing: the response is probably incomplete."
        )

    existing = set(history[key])
    kept = history[~history[key].isin(fresh_keys | to_delete)]
    table = (pd.concat([kept, fresh], ignore_index=True)
               .sort_values(key, ignore_index=True))

    return MergeResult(
        table=table,
        inserted=len(fresh_keys - existing),
        updated=len(fresh_keys & existing),
        deleted_keys=to_delete,
    )


def cascade_delete(child: pd.DataFrame, parent_key: str, deleted: set) -> pd.DataFrame:
    """Drop child rows (photos, checklist items...) whose parent was just deleted.

    Only rows tied to THIS run's deletions are removed; pre-existing orphans are
    left alone on purpose, so an unexplained inconsistency is investigated, not
    silently erased.
    """
    return child[~child[parent_key].isin(deleted)].reset_index(drop=True)
