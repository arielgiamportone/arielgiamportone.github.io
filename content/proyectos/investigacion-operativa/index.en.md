---
title: "Simplex vs ML in operations research"
proyecto: investigacion_operativa_ml
translationKey: "proyecto-investigacion-operativa"
url: "/en/projects/operations-research/"
description: "Teaching material on how operations research evolved from the simplex method to machine learning, with a fishing-fleet case. Interactive linear programming demo in the browser."
subtitulo: "Optimising and predicting answer different questions. A fishing-fleet model to see what the simplex decides, what limits each plan and where prediction comes in."
indicadores:
  - { v: "3 × 3", e: "boat types and resources in the teaching model" }
  - { v: "45", e: "cases of the demo solver checked against SciPy (HiGHS)" }
  - { v: "2025", e: "material from the CONIPE data literacy course" }
demo:
  parcial: "simplex"
  titulo: "Try it: plan the fleet and see what limits it"
  nota: "The model coefficients are the repository's and are for teaching, not real data from any fleet."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/Investigacion_Operativa" }
---

## The idea

The repository supports a class on how operations research has changed since Dantzig published the simplex method in 1947: from solving well-defined linear problems to working with abundant data, uncertainty and models that learn. The common thread is a fishing case: how many boats of each type should go out given the fuel, crew and fleet available.

## What the demo shows

- **The optimal solution and why it is optimal.** The bars show which resource runs out and which is spare. The binding resource is the one that matters.
- **The value of one more unit of each resource** (the shadow price). If one more litre of fuel does not raise the profit, buying fuel is not the answer.
- **Alternative optima.** In the repository's model, types 1 and 2 yield exactly the same per litre, so several plans tie: a sign that the model needs more information to decide.
- **Whole boats.** The simplex returns fractions; requiring whole boats can cost profit, and the demo quantifies it.
- **Where machine learning comes in.** The simplex does not get captures right or wrong: it decides with the coefficients it is given. Prediction is useful upstream, to estimate them when they depend on the weather or the price. The control for the expected yield of type 3 shows the point at which that estimate changes the decision.

## A correction in progress

The repository's original comparative analysis measured the simplex with prediction metrics (R² and capture error) and put it in the same table as the ML models. They are different problems, so that comparison makes no sense; the repository is being revised to separate the two questions. This page focuses on the optimisation part, which is sound. The material itself is in Spanish.
