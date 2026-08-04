# Professional Graph

Professional Graph is a browser application that visualizes the world of work as an explorable graph and projects a user's professional interests onto it.

The base graph is rendered in muted gray. Occupational clusters retain stable hues, while the user's answers increase the saturation of matching occupations, specializations, activities, and neighboring career paths. The result is not a single career verdict, but a map of professional attraction: where interest is strong, where evidence is weak, and which adjacent professions may be worth exploring.

## Product premise

Most career tests collapse a person into a short list of suggested jobs. Professional Graph preserves the structure behind the result:

- broad occupational families;
- occupations and specializations;
- work activities and skills;
- industries and work contexts;
- relationships between nearby or transferable careers;
- evidence showing which answers affected each result.

The application should help answer:

> Which kinds of work, environments, problems, and professional roles appear attractive to me?

It must not claim to diagnose aptitude, guarantee success, or prescribe a career.

## Core experience

1. The user explores a neutral graph of occupations.
2. The user answers an interest assessment, initially targeting roughly 100 questions.
3. Answers contribute to a multidimensional preference profile.
4. Occupation nodes are scored by similarity to that profile.
5. Relevant nodes become more saturated while confidence is represented separately.
6. Selecting a node explains why it matched, what may conflict, and which neighboring occupations are related.

## Documentation

- [Product definition](docs/product-definition.md)
- [Knowledge graph and taxonomy](docs/knowledge-graph.md)
- [Assessment and scoring methodology](docs/assessment-methodology.md)
- [MVP plan](docs/mvp-plan.md)

## Initial principles

- Reuse recognized occupational classifications instead of inventing a complete profession list manually.
- Keep occupation, industry, specialization, skill, context, and employment mode as distinct concepts.
- Base the assessment on established vocational-interest research, then preserve more detail than a six-number result.
- Score latent preferences first and occupations second; do not hard-code each question directly to a list of professions.
- Make every recommendation explainable.
- Version the source data, question bank, mappings, and scoring model.
- Treat the graph as many-to-many rather than forcing every profession into one tree.

## Status

The project is in the product and research-definition stage. No implementation stack has been selected yet.
