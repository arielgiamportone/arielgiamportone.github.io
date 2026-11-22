---
title: "fisheries-sustainability-mlops"
proyecto: fisheries_mlops
translationKey: "proyecto-fisheries-mlops"
url: "/en/projects/fisheries-sustainability-mlops/"
description: "Bayesian networks, Bayesian neural networks and a full MLOps stack to estimate the sustainability of fishing operations with uncertainty."
subtitulo: "What happens to a fishery's sustainability if effort, price or the sea change? A system that answers with probabilities, not with a yes or no."
indicadores:
  - { v: "9", e: "variables in the domain causal network" }
  - { v: "3", e: "model families: Bayesian network, BNN and Causal VAE" }
  - { v: "5", e: "completed phases, from foundations to MLOps" }
  - { v: "MLflow", e: "experiment tracking and model registry" }
  - { v: "Optuna", e: "automatic hyperparameter tuning" }
  - { v: "FastAPI", e: "prediction, training and model API" }
demo:
  parcial: "bn"
  titulo: "Try it: the project's Bayesian network"
  nota: "Fix any variable and watch how the others and the probability of a sustainable operation change. Try fixing fishing effort: if you observe it, what you know about sea temperature, its cause, also changes; if you intervene, it does not, because you cut that arrow."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/fisheries-sustainability-mlops" }
galeria:
  - { src: "app-dashboard.png", pie: "Web dashboard: system status, quick prediction and recent experiments." }
  - { src: "app-model-registry.png", pie: "MLflow model registry: the production version served by the API." }
  - { src: "app-api-docs.png", pie: "Interactive documentation of the prediction API." }
  - { src: "bnn.jpg", pie: "The Bayesian neural network: a prediction and its epistemic uncertainty." }
---

## The problem

Fisheries decisions are made with noisy data and a lot of uncertainty: sea temperature, fleet effort, costs and fish prices change together and influence each other. A model that only says "sustainable" or "not sustainable" hides what matters most: **how confident** it is and **what would happen if** you acted on a variable.

## What I built

- **A Bayesian network with a domain causal structure** (pgmpy): environmental, operational and economic variables leading to sustainability, with structure learning (BIC, K2, BDeu), cross-validation and method comparison.
- **Causal analysis**: an explicit DAG and the *do*-operator to separate "what I observe" from "what would happen if I intervene", which is the question a regulator asks.
- **Deep learning with uncertainty**: a Bayesian neural network (BNN), an MLP and a Causal VAE in PyTorch, with counterfactuals.
- **End-to-end MLOps**: experiment tracking and model registry with MLflow, tuning with Optuna, a FastAPI API, a web dashboard, Docker and CI/CD with deployment ready for AWS ECS.

## About the data

The project uses **synthetic data** generated with ranges calibrated from the literature on Patagonian crustacean fisheries, because its goal is to demonstrate the methodology. Validation with real data is the first phase of the proposed 2026-2027 R&D agenda. The demo on this page uses the same network and data: it is there to understand the method, not to draw conclusions about a specific fishery.

## Why it matters

Bayesian neural networks are almost absent from the fisheries literature. Combining them with causal Bayesian networks gives decision-makers a probability with its uncertainty, and answers to scenarios such as "if I reduce effort, what changes?".
