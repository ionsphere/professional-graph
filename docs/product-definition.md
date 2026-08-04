# Product Definition

## 1. Purpose

Professional Graph helps a person discover patterns in the kinds of work they find attractive. It combines an explorable occupational graph with an interest assessment and renders the result directly on the graph.

The product differs from a conventional career quiz in two ways:

1. It does not reduce the result to a small ranked list.
2. It shows how professions, specializations, activities, skills, and work contexts relate to one another.

The central artifact is the user's professional preference landscape.

## 2. User problem

Existing occupational directories are comprehensive but difficult to explore. Existing career tests are approachable but usually hide their occupational model and return a narrow list of recommendations.

A user may know that they enjoy debugging, teaching, organizing physical systems, negotiating, or designing visual experiences without knowing which professions contain those activities. They may also dislike an aspect of an otherwise attractive occupation. A useful product should preserve both signals.

## 3. Product promise

After completing the assessment, a user should be able to:

- see broad areas of professional attraction;
- inspect specific occupations and specializations;
- understand which answers contributed to a match;
- distinguish affinity from confidence;
- identify attractive activities shared across unrelated industries;
- discover neighboring careers and plausible transitions;
- notice conflicts, such as liking the core work but disliking the typical environment.

## 4. Non-goals

The first version will not:

- determine whether the user has the required ability or credentials;
- guarantee career satisfaction or employment success;
- replace a psychologist, career counselor, educator, or labor-market expert;
- rank people for employment;
- infer protected traits;
- optimize for salary, job availability, or training cost unless those become separate explicit filters;
- claim that the graph contains every title used by every employer.

## 5. Primary users

### Explorers

People who do not yet have a clear occupational direction and want a broad, visual way to discover possibilities.

### Career changers

People who understand their current role but want to identify adjacent professions that preserve preferred activities while changing industry or environment.

### Students

People choosing areas of study who need to connect interests to families of work rather than to one job title.

### Curious professionals

People who already have a career but want a structured map of related fields, specializations, and transferable interests.

## 6. Core user journey

### Phase A: Neutral exploration

The user sees the complete graph in a muted state. Major clusters are visible, but detail appears progressively through zoom, search, and selection.

### Phase B: Assessment

The user answers activity- and environment-oriented questions using a graded response scale. Progress can be saved. Questions should measure attraction rather than perceived competence.

### Phase C: Projection

The user's preference profile is compared with occupation profiles. Matching nodes become more saturated. Confidence and evidence completeness are represented separately from affinity.

### Phase D: Explanation

Selecting a node shows:

- overall affinity;
- confidence in the estimate;
- strongest matching preferences;
- strongest mismatches or uncertainties;
- contributing answers;
- related occupations and specializations;
- source taxonomy identifiers.

### Phase E: Comparison

The user can compare two or more occupations across activities, environments, interpersonal demands, and preferred work styles.

## 7. Visual semantics

The visualization should keep stable meanings:

- **Hue:** permanent occupational cluster identity.
- **Saturation:** user affinity.
- **Opacity or glow:** confidence and amount of supporting evidence.
- **Node size:** taxonomy level or structural importance, not preference.
- **Edge emphasis:** relationship relevance to the selected node or user profile.
- **Muted or patterned state:** insufficient evidence, unresolved mapping, or mixed signals.

Parent nodes must not receive higher scores merely because they contain more children. Aggregation should be normalized, such as a weighted mean or average of the strongest child matches.

## 8. Product language

Prefer language such as:

- “appears attractive”;
- “matches your stated preferences”;
- “supported by 12 answers”;
- “evidence is limited”;
- “possible mismatch”;
- “related area worth exploring.”

Avoid language such as:

- “you are meant to be”;
- “perfect career”;
- “you will succeed”;
- “you are not suited for”;
- “scientifically proven career.”

## 9. Success criteria for the first usable release

The first usable release succeeds when a test user can:

1. understand the graph without instruction;
2. complete or partially complete the assessment;
3. see visibly differentiated preference regions;
4. open an occupation and understand why it matched;
5. discover at least one relevant occupation they had not considered;
6. distinguish a strong match with weak evidence from a strong match with broad evidence;
7. resume a saved session without losing prior answers.

## 10. Open product questions

- Should the initial experience begin with the graph or the assessment?
- How much graph detail can be visible before the visualization becomes overwhelming?
- Should users be allowed to state explicit dislikes or exclusions separately from assessment answers?
- Should salary, geography, education, licensing, physical demands, and remote-work availability be filters or later overlays?
- How should the product represent occupations whose real-world conditions vary greatly by employer or country?
- Should users be able to create and compare multiple profiles, such as “what I enjoy” and “what I currently do”?
