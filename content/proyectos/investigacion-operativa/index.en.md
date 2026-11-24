---
title: "Simplex vs ML in operations research"
proyecto: investigacion_operativa_ml
translationKey: "proyecto-investigacion-operativa"
url: "/en/projects/operations-research/"
description: "Teaching material on how operations research evolved from the simplex method to machine learning, with a fishing-fleet case. Interactive linear programming demo in the browser."
subtitulo: "Optimizing and predicting answer different questions. A fishing-fleet model to see what the simplex decides, what limits each plan and where prediction comes in."
indicadores:
  - { v: "91 → 99.8%", e: "of the optimum reached when deciding with ML-estimated yields instead of nominal ones" }
  - { v: "38 → 93%", e: "scenarios where the decision is the optimal one" }
  - { v: "0.89 / 0.97", e: "R² of the best model against the ceiling of the formula that generated the data" }
  - { v: "45", e: "cases of the demo solver checked against SciPy (HiGHS)" }
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
- **The value of one more unit of each resource** (the shadow price). If one more liter of fuel does not raise the profit, buying fuel is not the answer.
- **Alternative optima.** In the repository's model, types 1 and 2 yield exactly the same per liter, so several plans tie: a sign that the model needs more information to decide.
- **Whole boats.** The simplex returns fractions; requiring whole boats can cost profit, and the demo quantifies it.
- **Where machine learning comes in.** The simplex does not get catches right or wrong: it decides with the coefficients it is given. Prediction is useful upstream, to estimate them when they depend on the weather or the price. The control for the expected yield of type 3 shows the point at which that estimate changes the decision.

## What the analysis shows

The repository's analysis separates three questions in a synthetic world in which wind affects each boat type differently:

- **Deciding.** Linear programming gives the optimal plan (20, 6 and 10 small, medium and large boats, 3,720 kg), says what binds (the crew: 24 kg per extra person) and what is spare (fuel and budget). It is judged on that, not on R².
- **Predicting.** For total catch, gradient boosting reaches an R² of 0.89 against 0.79 for a linear regression and −0.003 for the mean, with a ceiling of 0.97: the true formula without noise. No model exceeds it; a high R² on synthetic data only says the model recovers the formula.
- **Predict, then optimize.** Deciding with nominal yields reaches 91% of the optimum on average and finds the best decision in 38% of the scenarios. With yields estimated by ML from the weather it rises to 99.7–99.8% and 90–93%. And a linear regression does almost as well as gradient boosting: deciding well does not require the most accurate model.

This version of the material corrects an earlier one that put the simplex and the ML models in the same accuracy table. The figures come from running the scripts (seed 42) and nine tests check them in CI against both the minimum and the latest dependency versions. The material itself is in Spanish.
