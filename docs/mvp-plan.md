# MVP Plan

## 1. MVP objective

Build the smallest technically complete version that proves the product loop:

```text
occupational graph
    + assessment answers
    + explainable scoring
    = visible professional preference landscape
```

The MVP should validate the interaction and scoring model before importing the entire global occupational universe.

## 2. Scope

### Included

- 8–12 broad occupational clusters;
- approximately 150 canonical occupations;
- approximately 300–500 specializations and aliases;
- 60–100 assessment questions;
- five-point answers with optional “cannot judge”;
- persistent user progress;
- affinity and confidence scoring;
- graph search, zoom, selection, and filtering;
- occupation explanation panel;
- comparison of two occupations;
- versioned source data and scoring artifacts;
- anonymous local profile by default.

### Excluded from the first release

- complete worldwide taxonomy import;
- labor-market forecasts;
- live salary data;
- educational-program recommendations;
- employer matching;
- hiring or candidate screening;
- social network features;
- automated use of sensitive personal data;
- claims of psychological validation beyond evidence actually collected.

## 3. Proposed vertical slice

Select clusters that create meaningful contrast and cross-cluster overlap:

1. Computing and digital systems
2. Healthcare and care work
3. Engineering and physical systems
4. Skilled trades and construction
5. Transportation and logistics
6. Education and human development
7. Business, sales, and administration
8. Arts, design, and communication
9. Science and research
10. Public safety and public service

The slice should include occupations that expose modeling challenges:

- machine learning engineer;
- data scientist;
- software engineer;
- nurse and nursing specializations;
- physician and medical specializations;
- electrician;
- construction manager;
- taxi or ride-hailing driver;
- truck driver;
- teacher;
- counselor;
- salesperson;
- operations manager;
- graphic designer;
- technical writer;
- laboratory scientist;
- firefighter.

## 4. Delivery phases

## Phase 0: Research decisions

Deliverables:

- confirmed source licenses and attribution obligations;
- selected taxonomy source versions;
- initial source crosswalk strategy;
- assessment construct list;
- first question-writing guide;
- definition of affinity, confidence, and evidence;
- explicit ethical and product claims policy.

Exit criteria:

- no critical source or licensing uncertainty blocks prototyping;
- product-owned dimensions have stable names and definitions;
- the team can explain how one answer reaches one occupation score.

## Phase 1: Static graph prototype

Deliverables:

- hand-curated or generated graph dataset for 150 occupations;
- stable node and edge schemas;
- browser visualization with pan, zoom, search, and selection;
- semantic zoom and label rules;
- fixed cluster hues and neutral gray baseline;
- details panel with occupation description and relationships.

Exit criteria:

- users can locate known occupations;
- users understand clusters and cross-links;
- graph remains interactive on target devices;
- the visualization is readable without showing every label simultaneously.

## Phase 2: Assessment engine

Deliverables:

- versioned question bank;
- response storage;
- preference-vector calculation;
- occupation vectors;
- affinity and evidence calculations;
- deterministic scoring tests;
- developer view showing dimension-level contributions.

Exit criteria:

- repeated identical answers produce identical results;
- negative answers reduce relevant dimensions correctly;
- unanswered questions reduce confidence rather than becoming neutral answers;
- large clusters do not gain artificial score advantages.

## Phase 3: Visual projection and explanation

Deliverables:

- node saturation driven by affinity;
- separate visual confidence signal;
- cluster aggregation;
- explanation panel with positive and negative contributors;
- direct links from explanations to contributing questions;
- occupation comparison view.

Exit criteria:

- users can tell why a node is colorful;
- users can distinguish affinity from evidence;
- users can identify at least one mismatch;
- users do not consistently interpret node size as preference.

## Phase 4: Pilot and correction

Deliverables:

- structured pilot protocol;
- cognitive interviews;
- telemetry for question completion and abandonment;
- scoring anomaly reports;
- missing-title and bad-mapping feedback flow;
- revised question weights and occupation profiles;
- published limitations.

Exit criteria:

- no widespread misunderstanding of the product's claims;
- major result clusters are reasonably stable on retest;
- explanations are judged plausible more often than generic;
- the graph produces discoveries beyond obvious current-job matches.

## Phase 5: Taxonomy expansion

Deliverables:

- repeatable import pipeline;
- source build manifest;
- crosswalk confidence tracking;
- duplicate and conflict review tools;
- substantially expanded occupation coverage;
- graph-performance benchmarks at realistic scale.

Exit criteria:

- source updates can be reproduced;
- unresolved mappings are visible rather than silently discarded;
- performance remains acceptable with the expanded graph;
- search resolves common aliases and regional titles.

## 5. Architecture boundaries

Keep these modules independent:

```text
/source-import
  source parsers, normalization, crosswalks, manifests

/graph-model
  canonical nodes, edges, aliases, provenance

/assessment
  question bank, responses, preference calculation

/scoring
  occupation profiles, similarity, confidence, explanations

/web
  graph rendering, assessment UI, result exploration

/validation
  schema checks, mapping reports, scoring fixtures
```

Do not bind the scoring model to the graph-rendering library. The same profile should be computable in tests or a command-line tool without a browser.

## 6. Initial data contracts

### Graph release

```ts
interface GraphRelease {
  version: string;
  generatedAt: string;
  sourceManifest: SourceManifest[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout?: LayoutRecord[];
}
```

### Assessment release

```ts
interface AssessmentRelease {
  version: string;
  dimensions: DimensionDefinition[];
  questions: AssessmentQuestion[];
}
```

### Scoring release

```ts
interface ScoringRelease {
  version: string;
  graphVersion: string;
  assessmentVersion: string;
  occupationProfiles: OccupationProfile[];
  parameters: ScoringParameters;
}
```

This separation allows the graph, questions, and scoring mappings to evolve independently while remaining reproducible.

## 7. Testing strategy

### Schema tests

- every node has a stable ID and type;
- every edge references existing nodes;
- aliases do not silently become duplicate canonical records;
- source references include versions;
- deprecated nodes have replacement or migration information where possible.

### Scoring tests

- all-positive and all-negative synthetic profiles;
- focused profiles for each major dimension;
- contradictory profiles;
- sparse-answer profiles;
- identical occupation vectors;
- occupations with missing dimensions;
- parent clusters with very different child counts.

### Golden profiles

Create a small set of named synthetic profiles, such as:

- systems debugger;
- hands-on builder;
- caregiver and teacher;
- visual creator;
- persuader and organizer;
- field investigator;
- logistics operator.

Expected output should be expressed as relative invariants rather than brittle exact ranks:

```text
For systems-debugger profile:
- software reliability engineer scores above recruiter;
- industrial maintenance technician scores above copywriter;
- investigative cluster affinity is positive;
- confidence is low when environment questions are unanswered.
```

### UI tests

- keyboard navigation;
- reduced-motion mode;
- color-blind-safe cluster distinctions;
- mobile graph fallback;
- screen-reader alternative to visual-only results;
- saved-progress restoration;
- explanation trace from node to answers.

## 8. Performance targets

Initial targets should be measurable but revisable:

- first meaningful render under 2 seconds on a typical modern laptop after assets are cached;
- graph interactions remain responsive at the MVP node count;
- answer submission updates visible results in under 150 milliseconds locally;
- search responds in under 100 milliseconds for the local MVP dataset;
- no graph relayout on every answer;
- complete result can be represented in a non-visual accessible view.

For the full graph, use level-of-detail rendering, clustering, viewport culling, and precomputed layout rather than drawing every node and edge at once.

## 9. Key risks

### False completeness

Risk: presenting a finite source import as every profession in existence.

Mitigation: publish taxonomy versions, coverage metrics, aliases, and a missing-title workflow.

### Attractive but arbitrary scoring

Risk: a beautiful graph gives unvalidated weights an appearance of scientific authority.

Mitigation: distinguish research-backed inputs from product hypotheses, expose explanations, and publish limitations.

### Graph overload

Risk: thousands of nodes become an unreadable hairball.

Mitigation: semantic zoom, progressive disclosure, cluster summaries, search, focus mode, and prioritized edges.

### Source mismatch

Risk: ISCO, ESCO, O*NET, and product concepts disagree on occupational boundaries.

Mitigation: preserve provenance and crosswalk confidence instead of forcing silent merges.

### Question fatigue

Risk: users abandon a 100-question assessment.

Mitigation: save progress, show early provisional results, use balanced short forms, and investigate adaptive selection later.

### Prestige and familiarity bias

Risk: users answer based on known job titles or social status rather than activity preferences.

Mitigation: ask concrete activity questions and avoid profession names in the primary bank.

## 10. First implementation backlog

### Research

- verify source licenses and current release formats;
- enumerate candidate public vocational-interest item banks;
- define initial latent dimensions;
- draft a question-writing standard;
- construct 10–20 occupation mappings manually as a scoring experiment.

### Data

- define TypeScript or JSON schemas;
- create stable IDs;
- curate the vertical-slice occupation list;
- model driver and computing example subgraphs;
- create provenance and build-manifest formats.

### Scoring

- implement centered Likert conversion;
- compute dimension scores and evidence;
- implement occupation similarity;
- implement normalized parent aggregation;
- generate positive and negative explanations;
- create golden-profile tests.

### Web

- render static graph;
- add zoom, pan, search, and selection;
- implement assessment flow;
- update node saturation without relayout;
- add occupation explanation panel;
- provide accessible list and comparison views.

## 11. Decision gates before full-scale build

Do not import the complete taxonomy until:

- the graph remains understandable at 150 occupations;
- the scoring model can explain every result;
- affinity and confidence are visually distinguishable;
- at least one pilot group finds unexpected but plausible occupations;
- the source and licensing strategy is documented;
- graph rendering has a credible scale plan.

Do not describe the assessment as validated until the complete instrument and scoring pipeline have appropriate evidence. Reusing an established high-level model does not automatically validate new questions or mappings.
