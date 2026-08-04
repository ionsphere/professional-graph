# Knowledge Graph and Taxonomy

## 1. Objective

The graph must cover the world of work without pretending that every employer title belongs to one perfect tree. The model therefore separates classification, specialization, skills, activities, industries, and work contexts while allowing many-to-many relationships.

The goal is practical completeness:

- every common occupation should map to a canonical occupation or occupation family;
- alternate and emerging titles should resolve through aliases;
- specializations should be representable without changing the canonical taxonomy;
- country-specific classifications should be attachable without becoming the product's only structure.

## 2. Source strategy

Use established sources as layers rather than selecting one source for every purpose.

### ISCO

Use the International Standard Classification of Occupations as the global backbone and stable top-level hierarchy. It provides internationally recognizable occupational groups.

### ESCO

Use the European classification of occupations, skills, and competences for detailed occupation concepts, labels, aliases, descriptions, skills, and multilingual support. Map its occupations back to ISCO where available.

### O*NET

Use O*NET as a rich enrichment source for occupations that can be crosswalked. Relevant data includes interests, work activities, work styles, abilities, knowledge, tasks, and work context. O*NET is US-oriented and must not define global completeness by itself.

### Product-owned layer

Maintain a versioned product layer for:

- missing or emerging specializations;
- aliases used in practice;
- corrections and merges;
- platform or employment contexts;
- graph layout metadata;
- crosswalk confidence;
- editorial explanations.

Product-owned concepts must retain provenance and must never silently overwrite imported source records.

## 3. Concept model

### Node types

```ts
type NodeType =
  | "occupation_group"
  | "occupation"
  | "specialization"
  | "skill"
  | "work_activity"
  | "work_style"
  | "knowledge_area"
  | "industry"
  | "work_context"
  | "employment_mode"
  | "credential";
```

### Core node shape

```ts
interface GraphNode {
  id: string;
  type: NodeType;
  preferredLabel: string;
  description?: string;
  aliases: string[];
  sourceRefs: SourceReference[];
  status: "active" | "deprecated" | "proposed";
  validFrom?: string;
  validTo?: string;
}
```

### Edge types

```ts
type EdgeType =
  | "broader_than"
  | "specialization_of"
  | "requires_skill"
  | "performs_activity"
  | "uses_knowledge"
  | "expresses_work_style"
  | "common_in_industry"
  | "works_in_context"
  | "supports_employment_mode"
  | "requires_credential"
  | "similar_to"
  | "transition_to"
  | "source_equivalent_to";
```

Every edge should support provenance, confidence, direction, and optional regional applicability.

## 4. Why the graph is not a tree

A strict tree creates false choices. For example, a machine learning engineer belongs near software engineering, data engineering, statistics, and applied artificial intelligence. A technical writer connects writing, education, product development, and technical knowledge.

The graph may still expose a tree-like navigation view through one selected hierarchy, but the underlying model must preserve cross-links.

## 5. Separating frequently confused concepts

### Occupation versus industry

“Software engineer” is an occupation. “Healthcare” is an industry. A software engineer may work in healthcare, finance, entertainment, manufacturing, or government.

### Occupation versus employer or platform

“Ride-hailing driver” is an occupation or occupational specialization. “Uber” is a company and platform context. The graph should not use one company as a permanent occupational branch.

### Occupation versus employment mode

“Self-employed,” “contractor,” and “employee” describe work arrangements. They can apply to many occupations.

### Occupation versus specialization

“Registered nurse” can be a canonical occupation while “pediatric nurse,” “operating-room nurse,” and “oncology nurse” are specializations. Some source taxonomies may classify them differently, so the graph must preserve source mappings rather than assuming one universal boundary.

### Skill versus activity

A skill is a capacity, such as negotiation or programming. An activity is something performed, such as negotiating contracts or debugging software. Assessment questions should generally describe activities because users can judge whether they enjoy them without claiming current competence.

## 6. Example subgraphs

### Drivers

```text
Transport occupations
├── Passenger vehicle drivers
│   ├── Taxi driver
│   ├── Ride-hailing driver
│   └── Chauffeur
├── Bus and coach drivers
├── Heavy truck drivers
└── Delivery drivers

Ride-hailing driver --works_in_context--> App-based dispatch
Ride-hailing driver --supports_employment_mode--> Independent contractor
Chauffeur --works_in_context--> Private household
Heavy truck driver --performs_activity--> Long-distance freight transport
```

### Computing

```text
Digital and computing occupations
├── Software development
│   ├── Frontend developer
│   ├── Backend developer
│   ├── Mobile developer
│   └── Embedded software engineer
├── Data
│   ├── Data analyst
│   ├── Data engineer
│   └── Data scientist
├── Machine learning
│   ├── Machine learning engineer
│   ├── Applied scientist
│   └── Machine learning researcher
├── Infrastructure and operations
├── Cybersecurity
└── Product and experience design

Machine learning engineer --similar_to--> Software engineer
Machine learning engineer --similar_to--> Data scientist
Machine learning engineer --requires_skill--> Software development
Machine learning engineer --uses_knowledge--> Statistics
```

## 7. Identity and aliases

Canonical node IDs must not be generated from display labels. Labels change, translations differ, and multiple concepts can share similar names.

Recommended ID pattern:

```text
pg:occupation:<uuid>
pg:specialization:<uuid>
esco:<source-id>
onet:<source-id>
===
```

Imported source IDs belong in source references. A product-owned ID remains stable when sources are updated or crosswalks change.

Aliases should include:

- spelling variants;
- abbreviations;
- historical titles;
- employer titles;
- regional names;
- translated labels;
- common informal names.

Aliases are search aids, not automatically separate nodes.

## 8. Provenance and versioning

Every imported record and relationship should include:

```ts
interface SourceReference {
  source: "ISCO" | "ESCO" | "ONET" | "PRODUCT" | string;
  sourceId: string;
  sourceVersion: string;
  importedAt: string;
  license?: string;
  url?: string;
}
```

A build manifest should record:

- source versions;
- import date;
- transformation code version;
- crosswalk version;
- number of accepted and rejected records;
- unresolved mappings;
- product overrides.

This allows a result to remain reproducible after source data changes.

## 9. Completeness policy

“All professions” is an operational target, not a mathematically closed list. Completion should be measured through coverage:

- coverage of all ISCO unit groups;
- coverage of all active ESCO occupation concepts selected for the release;
- mapping rate for O*NET enrichment;
- percentage of user searches resolving to a canonical node or alias;
- count and age of unresolved title submissions;
- geographic and language coverage;
- coverage of emerging occupations identified through editorial review.

The product should expose the taxonomy version and allow users to report a missing or incorrectly mapped title.

## 10. Import pipeline

```text
Download source release
        ↓
Validate license and version
        ↓
Parse source-specific records
        ↓
Normalize labels and identifiers
        ↓
Create canonical candidates
        ↓
Apply source crosswalks
        ↓
Run duplicate and conflict detection
        ↓
Apply product overrides
        ↓
Generate graph build manifest
        ↓
Publish immutable graph version
```

The initial implementation can use generated JSON or a relational database. A dedicated graph database should only be selected after query and scale requirements demonstrate a need.

## 11. Layout metadata

Graph topology and visual layout are related but different. The data model should store semantic edges independently from coordinates.

A generated graph release may include:

- cluster assignment;
- level of detail;
- default position;
- minimum zoom for labels;
- collision radius;
- edge display priority;
- semantic zoom rules.

Changing the layout must not change occupational identity or assessment scoring.

## 12. Open research tasks

- Confirm licenses and redistribution requirements for every source release.
- Select and evaluate available crosswalks among ISCO, ESCO, O*NET, and national taxonomies.
- Define when a title becomes a specialization rather than an alias.
- Design a process for editorial review of emerging occupations.
- Determine how regional differences in credentials and working conditions attach to globally shared occupations.
- Measure whether graph neighborhoods remain understandable after importing the full taxonomy.
