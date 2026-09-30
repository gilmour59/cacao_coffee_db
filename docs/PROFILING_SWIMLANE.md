# Farmer Profiling Swimlane Diagram

This document shows the finalized V1 operational flow across the main actors: Farmer, Encoder/Admin, System/Backend, and Validator.

## Swimlane — New farmer

```mermaid
flowchart LR
  subgraph F[Farmer]
    F1[Open public new-farmer link]
    F2[Enter identity, RSBSA, farm and profile data]
    F3[Submit]
  end

  subgraph E[Encoder / Admin]
    E1[Assist farmer if needed]
  end

  subgraph S[System / Backend]
    S1[Normalize submitted identity]
    S2[Run duplicate / RSBSA checks]
    S3[Classify NEW_ENTRY or possible duplicate]
    S4[Create pending submission]
  end

  subgraph V[Validator]
    V1[Review submission and match reasons]
    V2{Decision}
    V3[Approve new farmer]
    V4[Link to existing farmer]
    V5[Return for correction]
  end

  F1 --> F2 --> F3 --> S1 --> S2 --> S3 --> S4 --> V1 --> V2
  E1 -. assists .-> F2
  V2 -->|New legitimate farmer| V3
  V2 -->|Existing farmer found| V4
  V2 -->|Needs correction| V5
```

### Result

If approved as new:

```text
Pending submission
   ↓
Canonical farmer_id
   ↓
Farm record(s)
   ↓
First approved Profiling_Round
```

A public respondent must never see candidate farmer records or another farmer's PII.

---

## Swimlane — Existing farmer annual profiling

```mermaid
flowchart LR
  subgraph A[Encoder / Admin]
    A1[Select approved existing farmer]
    A2[Generate personalized secure profiling link]
    A3[Send link by SMS / Messenger / Email or assist directly]
  end

  subgraph F[Farmer]
    F1[Open secure link]
    F2[Review / enter current-year information]
    F3[Submit]
  end

  subgraph S[System / Backend]
    S1[Resolve token to farmer + cycle + purpose]
    S2[Load only permitted farmer context]
    S3[Compare with latest approved record]
    S4[Classify NO_CHANGE / MODIFICATION / NEW_ENTRY / EXPANSION / ANOMALY]
    S5[Prepare prior-vs-current comparison]
  end

  subgraph V[Validator]
    V1[Review changes and flags]
    V2{Decision}
    V3[Approve]
    V4[Return for correction]
    V5[Confirm expansion / route identity issue]
  end

  A1 --> A2 --> A3 --> F1 --> S1 --> S2 --> F2 --> F3 --> S3 --> S4 --> S5 --> V1 --> V2
  V2 -->|Accept| V3
  V2 -->|Correction needed| V4
  V2 -->|Structural / identity issue| V5
```

### Result

```text
2026 approved profiling
      remains unchanged

2027 approved profiling
      becomes a new time-series record

2028 approved profiling
      becomes another new record
```

The annual flow does not overwrite previous approved profiling observations.

---

## Swimlane — Expansion update

```mermaid
flowchart LR
  subgraph F[Farmer]
    F1[Reports expansion / additional farm / planting]
    F2[Completes expansion update]
  end

  subgraph A[Encoder / Admin]
    A1[Generate EXPANSION_UPDATE link or assist farmer]
  end

  subgraph S[System / Backend]
    S1[Resolve secure invitation]
    S2[Compare with current approved farm structure]
    S3[Flag structural additions / unusual changes]
  end

  subgraph V[Validator]
    V1[Review expansion evidence/data]
    V2{Valid expansion?}
    V3[Approve new/expanded structure]
    V4[Return / investigate]
  end

  F1 --> A1 --> S1 --> F2 --> S2 --> S3 --> V1 --> V2
  V2 -->|Yes| V3
  V2 -->|No / unclear| V4
```

Expansion is a new dated structural/profile event, not a silent overwrite of the previous annual observation.

---

## Swimlane — Returned submission

```mermaid
flowchart LR
  subgraph V[Validator]
    V1[Return submission with remarks]
  end

  subgraph S[System / Backend]
    S1[Set submission RETURNED]
    S2[Reactivate same link or issue correction link according to HVCP policy]
  end

  subgraph A[Encoder / Admin]
    A1[Resend / assist if needed]
  end

  subgraph F[Farmer]
    F1[Open correction access]
    F2[Correct information]
    F3[Resubmit]
  end

  V1 --> S1 --> S2 --> A1 --> F1 --> F2 --> F3 --> V
```

---

## Responsibility summary

| Actor | Main responsibilities |
|---|---|
| Farmer | Provide current and accurate profiling information; use public intake if new or personalized link if existing |
| Encoder | Assist farmers who cannot complete profiling independently; encode on behalf of farmer using staff access |
| Data Administrator | Generate/revoke links if authorized, manage operational access/reference data, handle protected corrections/merges |
| System / Backend | Resolve secure links, enforce scope, preserve history, compare prior/current data, flag duplicates/changes/anomalies |
| Validator | Confirm legitimacy, review flagged changes, approve/return submissions, confirm expansions, route identity issues |

## Security boundaries

- Public new-farmer link never exposes existing farmer data.
- Existing-farmer link resolves server-side to exactly one farmer and profiling purpose.
- The URL should use an opaque random token, not a visible farmer ID as authorization.
- Token status, expiry, revocation, and submission state are enforced server-side.
- Anomaly flags assist human review; they do not automatically reject a submission.
- Previous approved yearly records are immutable historical observations except through an explicit audited correction process.
