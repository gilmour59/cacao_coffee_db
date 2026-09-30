# Secure Link-Based Farmer Profiling Flow

This document defines the recommended V1 profiling flow for both new and existing Coffee/Cacao farmers.

## Core rule

Use two different entry paths:

1. **Public intake link for new farmers**
2. **Personalized secure profiling link for existing farmers**

The public link is not tied to any farmer record. Personalized links are always tied server-side to exactly one farmer and one profiling purpose/cycle.

---

## 1. New farmer flow — public intake link

New farmers may access a public profiling link distributed by HVCP/LGU staff, posted through official channels, or opened during assisted data collection.

```text
PUBLIC NEW FARMER LINK
        ↓
Farmer / Encoder opens form
        ↓
Enter farmer identity + RSBSA status
        ↓
Enter farm + Coffee/Cacao details
        ↓
Submit
        ↓
Backend normalization + duplicate detection
        ↓
 ┌───────────────────────────────┐
 │ No meaningful existing match  │
 │ → NEW_ENTRY candidate         │
 └───────────────────────────────┘

 ┌───────────────────────────────┐
 │ Possible/strong existing match│
 │ → POSSIBLE_DUPLICATE / REVIEW │
 └───────────────────────────────┘
        ↓
Validator review
        ↓
 ┌───────────────┬────────────────┬─────────────────┐
 │ Approve new   │ Link existing  │ Return for fix  │
 └───────────────┴────────────────┴─────────────────┘
        ↓
Create/confirm canonical farmer_id
        ↓
Save first approved profiling record
```

### Security rules for the public link

- It must **not** expose existing farmer records.
- It must **not** let a respondent browse possible duplicate farmers.
- It must **not** create an ACTIVE canonical farmer immediately on submit.
- New submissions enter a pending/review state.
- Duplicate detection and identity matching run server-side.
- Fuzzy matching may flag a record but must never auto-link or auto-merge.
- Exact RSBSA alone is not sufficient proof of identity when other fields conflict.
- Rate limiting / abuse controls should be applied to public submission endpoints.

---

## 2. Existing farmer flow — personalized secure link

For an already approved farmer, use a unique secure link for a specific profiling cycle or purpose.

Recommended rule:

```text
1 secure link
= 1 farmer
+ 1 profiling cycle/purpose
```

Example:

```text
FMR-2026-000123
2027 Annual Profiling
→ unique invitation token
```

The URL contains only an opaque random token, not the farmer ID.

```text
https://.../profile?t=<random-token>
```

Server-side:

```text
token
  ↓
Profiling_Invitations
  ↓
farmer_id
reference_year
purpose
status
```

### Existing farmer process

```text
HVCP/Admin/Encoder
        ↓
Select existing farmer
        ↓
Generate secure profiling link
        ↓
Send through SMS / Messenger / email / other channel
        ↓
Farmer opens link
        ↓
Backend resolves token
        ↓
Load only that farmer's permitted profiling context
        ↓
Farmer reviews/enters current-period information
        ↓
Submit
        ↓
Backend compares against last approved records
        ↓
Classify changes
        ↓
Validator review
        ↓
Approved as new time-series observation
```

The farmer is not re-enrolled every year. The existing `farmer_id` remains permanent.

---

## 3. Profiling purposes

Suggested invitation purposes:

- `ANNUAL_PROFILE`
- `EXPANSION_UPDATE`
- `CORRECTION`
- `NEW_FARM`

For the current HVCP process, annual profiling is the default. Expansion may trigger an additional profiling/update event during the year.

---

## 4. Time-series behavior

Annual profiling must create a new observation rather than overwrite the previous year's values.

```text
Farmer FMR-2026-000123
│
├── Farm 1
│   ├── Profiling 2026
│   ├── Profiling 2027
│   └── Profiling 2028
│
└── Farm 2
    ├── Profiling 2027
    └── Profiling 2028
```

Examples of time-varying observations:

- bearing trees
- non-bearing trees
- newly planted trees
- area under production, where applicable
- production
- facilities/equipment status
- interventions received
- intervention needs

Identity corrections such as an RSBSA typo or name typo are handled separately through the correction/audit workflow.

---

## 5. Backend change classification

On submission, compare the incoming data with the latest approved record and classify changes.

Suggested classifications:

- `NO_CHANGE`
- `MODIFICATION`
- `NEW_ENTRY`
- `EXPANSION`
- `ANOMALY`

Example:

```text
Previous approved:
Area = 1.20 ha
Bearing trees = 300

Current submission:
Area = 1.20 ha
Bearing trees = 345

→ normal MODIFICATION / new annual observation
```

Example anomaly:

```text
Area:
1.20 ha → 12.00 ha

→ ANOMALY flag
→ Validator reviews
```

An anomaly flag must **not automatically reject** the submission.

---

## 6. Validator review

The Validator sees both the submitted values and relevant prior approved values.

```text
2027 Submission

Bearing trees
300 → 345

Production
1,200 kg → 1,410 kg

⚠ Area
1.20 ha → 12.00 ha
Large change detected
```

Validator actions may include:

- approve;
- return for correction;
- confirm expansion/new farm;
- route identity/duplicate issue for further review.

---

## 7. Secure link lifecycle

Recommended `Profiling_Invitations` fields:

```text
invitation_id
farmer_id
farm_id
reference_year
purpose
token_hash
status
expires_at
first_opened_at
last_opened_at
submitted_at
created_by
created_at
revoked_at
```

Suggested statuses:

- `ACTIVE`
- `SUBMITTED`
- `RETURNED`
- `EXPIRED`
- `REVOKED`

### Token rules

- Generate a cryptographically strong random token.
- Store only the token hash server-side where practical.
- Never place `farmer_id` in the authorization portion of the URL.
- The token determines server-side which farmer/cycle may be accessed.
- Allow resume while the invitation is ACTIVE.
- Lock or invalidate it after final submission.
- Reactivate or issue a new correction link when a submission is returned.
- Allow staff to revoke and regenerate links.
- Audit link generation, revocation, submission, and re-issue actions.

---

## 8. Assisted entry

A farmer does not need to personally operate the link.

If assistance is required:

```text
Farmer
   ↓
Authorized Encoder
   ↓
Encoder authenticates using staff account
   ↓
Search/create farmer as permitted
   ↓
Encode profiling on behalf of farmer
   ↓
Submit
   ↓
Audit records the Encoder as the actor
```

Staff should not impersonate the farmer or require a farmer password.

---

## 9. V1 process summary

```text
                         START
                           │
               ┌───────────┴───────────┐
               │                       │
          NEW FARMER             EXISTING FARMER
               │                       │
        Public intake link       Secure personal link
               │                       │
        Submit profile           Annual / expansion update
               │                       │
        Duplicate checks         Compare with prior data
               │                       │
               └───────────┬───────────┘
                           │
                    Backend analysis
                           │
             NEW / MODIFIED / EXPANSION
                  / ANOMALY / DUPLICATE
                           │
                           ▼
                     Validator Review
                           │
                ┌──────────┼──────────┐
                │          │          │
             Approve     Return     Review
                │
                ▼
          Approved time-series
              data/history
```

## Recommended V1 decision

- New farmers: **public generic intake link**
- Existing farmers: **one secure personalized link per farmer per profiling cycle/purpose**
- No farmer username/password required for V1
- No Google/Facebook/mobile authentication required for farmer profiling
- Encoder-assisted profiling remains available
- Validator confirms legitimacy
- Backend performs duplicate, change, expansion, and anomaly checks
- Previous approved yearly records are preserved
