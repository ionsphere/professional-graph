# Mapping validation

The prototype now separates the model into three explicit layers:

1. Questions measure preference dimensions.
2. Profession nodes carry dimension profiles.
3. The renderer compares the accumulated user profile with each node profile.

This is safer and easier to audit than assigning every question directly to a hand-written list of professions, but the current dimension profiles are still prototype judgments rather than a validated psychometric instrument.

## What automated checks can prove

Run:

```bash
node scripts/validate-model.mjs
```

The structural validator checks:

- exactly 100 questions exist;
- question IDs and wording are unique;
- every question references known dimensions;
- every sector contains families and professions;
- every dimension has repeated questions;
- every dimension reaches a meaningful number of professions;
- no profession family or question is disconnected.

These checks catch implementation mistakes. They do not prove psychological validity.

## What evidence should replace invented mappings

### Occupation hierarchy

Use ISCO-08 as the global upper hierarchy and ESCO occupations below it. ESCO maps every occupation to one ISCO-08 unit group and associates occupations with expert-curated essential and optional skills.

### Occupation characteristics

Use O*NET occupation ratings where a crosswalk exists. Relevant datasets include:

- Interests;
- Generalized Work Activities;
- Work Context;
- Knowledge;
- Skills;
- Work Styles;
- Abilities.

ESCO skill links can extend coverage beyond O*NET and help map international titles and specializations.

### Questions

Use a licensed or permitted established instrument as the validated core, such as the O*NET Interest Profiler, then add experimental lower-level questions separately. Do not present experimental dimensions as equivalent to validated RIASEC scales until tested.

## Validation stages

### 1. Expert content review

For every question, ask at least two independent reviewers to assign dimensions without seeing the current answer. For every occupation, ask reviewers to rate the importance of each dimension. Measure agreement and resolve low-agreement mappings.

### 2. Reference-data comparison

Compare our occupation vectors with O*NET and ESCO-derived vectors. Flag professions whose nearest neighbors or strongest dimensions disagree substantially with reference data.

### 3. Synthetic tests

Create archetypal answer profiles such as quantitative-investigative, social-care, artistic-design, and realistic-building. Verify that expected occupations rank highly and obviously unrelated occupations rank low.

### 4. Human pilot

Collect test-retest data and ask participants to rate the relevance of their top and bottom recommendations. Analyze reliability by dimension and inspect whether questions discriminate among nearby occupations.

### 5. Outcome validation

For consenting users with known satisfying careers, test whether relevant occupation families rank above unrelated families. This should evaluate groups and work activities, not merely exact job-title matching.

## Required provenance fields

Every production mapping should eventually include:

- source dataset and version;
- source occupation or skill identifier;
- mapping method: direct, crosswalk, expert, or inferred;
- reviewer and review date;
- confidence score;
- validation status.

The current `model.js` should therefore be treated as a deliberately inspectable prototype dataset, not as a final scientific scoring model.
