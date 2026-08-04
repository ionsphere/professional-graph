# Assessment and Scoring Methodology

## 1. Objective

The assessment estimates which kinds of work activities, environments, interpersonal roles, and problem types a user finds attractive. It then projects those preferences onto occupation profiles in the graph.

The assessment is an interest and work-preference instrument. It is not an aptitude test, personality diagnosis, clinical instrument, or hiring screen.

## 2. Research foundation

The first model should build on established vocational-interest research rather than inventing a career theory from scratch.

The initial high-level framework is Holland's RIASEC model:

- **Realistic:** building, operating, repairing, handling objects, and working physically;
- **Investigative:** analyzing, researching, diagnosing, and solving complex problems;
- **Artistic:** creating, designing, expressing, and working with ambiguity;
- **Social:** teaching, supporting, caring, and developing people;
- **Enterprising:** persuading, leading, negotiating, and initiating action;
- **Conventional:** organizing, processing, maintaining records, and applying structured procedures.

RIASEC is useful as a compact summary but is too coarse to drive the complete graph by itself. Professional Graph should retain lower-level dimensions such as debugging, counseling, visual design, physical construction, quantitative modeling, conflict negotiation, routine processing, and emergency response.

O*NET interest and work descriptors can provide an initial occupation-side reference where suitable mappings and license terms allow. Product-specific questions and mappings still require validation.

## 3. Measurement model

Use a layered preference vector.

```ts
interface PreferenceProfile {
  riasec: Record<RiasecDimension, number>;
  activities: Record<ActivityDimension, number>;
  environments: Record<EnvironmentDimension, number>;
  interpersonalRoles: Record<InterpersonalDimension, number>;
  workStyles: Record<WorkStyleDimension, number>;
  constraints: Record<ConstraintDimension, number>;
}
```

The initial version should focus most heavily on activities because users can evaluate enjoyment of an activity without already knowing whether they are skilled at it.

### Example dimensions

Activities:

- diagnose failures;
- build physical objects;
- write software;
- model quantitatively;
- design visual experiences;
- teach concepts;
- care for people;
- persuade or negotiate;
- organize records;
- coordinate complex operations;
- perform under time pressure;
- investigate evidence;
- write or edit language;
- operate vehicles or machinery.

Environments:

- indoors versus outdoors;
- predictable versus rapidly changing;
- solitary versus highly social;
- physical versus digital;
- local versus travel-heavy;
- quiet focus versus interruption-heavy;
- low versus high consequence of error.

Interpersonal roles:

- helping;
- teaching;
- directing;
- persuading;
- serving;
- competing;
- collaborating;
- confronting conflict.

## 4. Question design

Questions should describe concrete activities or situations rather than job titles.

Prefer:

> How much would you enjoy finding why a complex system occasionally fails?

Avoid:

> Would you like to be a software engineer?

The first measures an underlying preference. The second is contaminated by salary expectations, prestige, prior knowledge, stereotypes, and confidence.

### Response scale

Use a five-point response scale:

1. Strongly dislike
2. Dislike
3. Neutral or unsure
4. Like
5. Strongly like

Optionally include “I cannot judge this activity” as missing evidence rather than forcing a neutral answer.

### Question bank composition

A first full bank may contain approximately 100 questions:

- 55–65 activity-interest questions;
- 15–20 environment questions;
- 10–15 interpersonal-role questions;
- 5–10 forced-choice or trade-off questions.

The exact number should be determined by coverage, reliability, and user fatigue rather than by a fixed marketing target.

## 5. Question representation

Each question contributes to several latent dimensions.

```ts
interface AssessmentQuestion {
  id: string;
  version: number;
  prompt: string;
  responseType: "likert5" | "forced_choice";
  weights: DimensionWeights;
  reverseScored?: boolean;
  tags: string[];
  status: "draft" | "pilot" | "active" | "retired";
}
```

Example:

```json
{
  "id": "q-diagnose-intermittent-failure",
  "version": 1,
  "prompt": "How much would you enjoy finding why a complex system occasionally fails?",
  "responseType": "likert5",
  "weights": {
    "riasec.investigative": 0.9,
    "riasec.realistic": 0.25,
    "activities.diagnose_failures": 1.0,
    "activities.analyze_systems": 0.85,
    "activities.test_hypotheses": 0.75,
    "workStyles.persistence": 0.35
  },
  "tags": ["systems", "debugging", "diagnosis"],
  "status": "draft"
}
```

Question weights are hypotheses until supported by pilot data.

## 6. User profile calculation

Map the five-point scale to a centered numeric response, for example:

```text
Strongly dislike  = -1.0
Dislike           = -0.5
Neutral           =  0.0
Like              =  0.5
Strongly like     =  1.0
Cannot judge      = missing
```

For each dimension:

```text
weighted_sum = Σ(response × question_weight)
weight_total = Σ(abs(question_weight)) for answered questions
preference   = weighted_sum / weight_total
```

Track evidence independently:

```text
evidence = answered_relevant_weight / total_relevant_weight
```

This yields both a preference estimate and a confidence input.

## 7. Occupation profiles

Each occupation and specialization receives a vector using the same dimensions as the user profile.

```ts
interface OccupationProfile {
  nodeId: string;
  dimensions: Record<string, number>;
  evidence: Record<string, number>;
  provenance: ProfileSource[];
  modelVersion: string;
}
```

Occupation profiles may combine:

- imported occupational descriptors;
- mappings from tasks, skills, and activities;
- expert editorial mappings;
- validated aggregate user data in later versions.

Imported facts and product inferences must remain distinguishable.

## 8. Occupation affinity

The first scoring implementation can use weighted cosine similarity or another normalized vector similarity measure.

```text
affinity = similarity(user_preference_vector, occupation_vector)
```

The similarity should be modified by evidence coverage, but affinity and confidence must remain separate outputs.

```ts
interface OccupationScore {
  nodeId: string;
  affinity: number;
  confidence: number;
  positiveContributors: Contribution[];
  negativeContributors: Contribution[];
  unansweredDimensions: string[];
}
```

Do not score a question directly as “+3 software engineer, +2 data scientist.” Direct occupation scoring is difficult to maintain, double-counts neighboring occupations, and provides weak explanations.

## 9. Negative evidence and conflicts

Dislikes are informative. An occupation may match several preferred activities while conflicting strongly with a disliked environment.

The explanation should preserve this shape instead of hiding it inside one number:

```text
Emergency physician
High match: diagnosis, rapid decisions, direct human impact
Possible conflict: frequent interruption, high consequence of error, irregular hours
Evidence: strong across 18 relevant answers
```

Hard constraints, such as inability or unwillingness to travel, should initially be shown as explicit conflicts rather than silently forcing an occupation score to zero. Later versions may allow users to choose whether a constraint is a preference or an exclusion.

## 10. Parent and cluster scoring

Never sum child occupation scores. Large clusters would gain artificial advantage.

Possible aggregation strategies include:

- weighted mean of child scores;
- mean of the top-k child scores;
- percentile score within the cluster;
- separate “breadth” and “peak affinity” measures.

Recommended initial display:

```text
cluster_affinity = mean(top 5 sufficiently evidenced child affinities)
cluster_breadth  = proportion of children above a relevance threshold
```

This distinguishes a cluster with one excellent specialization from a cluster that is broadly attractive.

## 11. Adaptive assessment

The first version can present a fixed bank or stable subset for reproducibility. A later adaptive mode can choose questions that most reduce uncertainty among plausible occupation regions.

Adaptive selection should optimize information gain, not merely ask more questions from the user's currently strongest cluster. Otherwise the test may reinforce early noise and fail to discover unrelated interests.

Possible strategy:

1. Start with balanced anchor questions.
2. Estimate preference dimensions and uncertainty.
3. Identify dimensions that best separate currently plausible graph regions.
4. Ask an unused question covering those dimensions.
5. Stop when confidence gain becomes small or the user chooses to finish.

## 12. Explainability requirements

Every displayed occupation score should support:

- strongest positive dimensions;
- strongest negative dimensions;
- exact assessment answers that contributed most;
- evidence completeness;
- occupation profile provenance;
- scoring model version.

A user must be able to distinguish:

- “This matched because of my answers”;
- “This matched because the occupation is modeled this way”;
- “This result is uncertain because I have not answered relevant questions.”

## 13. Validation plan

The initial instrument is not validated merely because it uses RIASEC vocabulary. Validate the complete question bank, mappings, and scoring behavior.

### Content review

Have vocational-psychology or career-assessment expertise review whether questions adequately cover intended constructs and avoid obvious bias.

### Cognitive interviews

Ask pilot users what they thought each question meant and whether they answered enjoyment, skill, prestige, familiarity, or expected compensation.

### Reliability

Measure internal consistency for dimensions and test-retest stability over an appropriate interval.

### Structural validity

Test whether responses produce the intended latent structure and whether dimensions are excessively redundant.

### Criterion and convergent checks

Compare results with established interest measures, stated occupational interests, and current work satisfaction while avoiding circular claims.

### Fairness checks

Evaluate differential item behavior and result distributions across demographic groups. Do not collect sensitive attributes without a clear, ethical validation purpose and appropriate privacy controls.

### Product validity

Measure whether users understand explanations, discover plausible occupations, and regard conflicts as accurate rather than simply liking the result.

## 14. Versioning

Store the following with every completed or partial profile:

- question-bank version;
- question versions shown;
- raw responses;
- preference-model version;
- occupation-profile version;
- graph version;
- scoring-code version;
- completion timestamp.

Never reinterpret an old result under a new model without labeling it as a recalculation.

## 15. Privacy and safety

- Do not use results for employment screening in the initial product.
- Do not infer medical, psychiatric, political, religious, or protected-trait conclusions.
- Allow profile deletion and local-only use where practical.
- Keep raw answers separate from public or shareable result views.
- Make sharing opt-in and previewable.
- Avoid persuasive dark patterns that imply the test is authoritative or complete.

## 16. Open research questions

- Which established interest instrument or public item bank can legally and practically seed the first questionnaire?
- How should O*NET descriptors be transformed into the product's lower-level dimensions?
- How many questions are required for stable cluster-level results versus specialization-level results?
- Which dimensions best distinguish nearby occupations without measuring aptitude?
- How should novelty and user unfamiliarity be handled when users cannot imagine an activity?
- Can adaptive questioning materially shorten the assessment without reducing discovery of unexpected clusters?
