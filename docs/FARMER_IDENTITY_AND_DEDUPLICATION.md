# Farmer Identity, Return-User, and Deduplication Security Plan

This document defines the V1 identity-resolution rules for the Coffee and Cacao Farmer Profiling and Information Management System.

The goal is to prevent duplicate farmers and accidental access to the wrong farmer record while still allowing legitimate corrections when RSBSA numbers, names, contact details, or other identity fields contain encoding errors.

## Core security principles

1. **`farmer_id` is the canonical internal identity.** RSBSA is an important external identifier but is never the database primary key.
2. **Do not trust a single field as proof of identity.** An exact RSBSA match can still be caused by a typo that happens to equal another farmer's number.
3. **Fuzzy matching is for detection, not authentication.**
4. **Never auto-merge farmer records.**
5. **A farmer/respondent must never be shown a list of similar farmers or another farmer's PII.**
6. **High-impact identity changes are role-restricted and audited.**
7. **Pending duplicate resolution must not silently overwrite an active farmer master record.**
8. **Merged records are retained for traceability; they are not deleted.**

---

## Identity match tiers

### Tier A — strong candidate

Examples:

- exact normalized RSBSA **plus** corroborating name/contact/location information;
- RSBSA read from the ID OCR flow, confirmed by the user, plus a compatible existing farmer name;
- another combination approved by HVCP after UAT.

A Tier A result is still not an automatic merge.

For an authenticated Encoder, the system may offer an existing-profile workflow after secondary confirmation.

For a public/self-service farmer, a Tier A result must not reveal the existing profile unless a separate approved authentication/verification mechanism exists.

### Tier B — possible duplicate

Examples:

- exact RSBSA but conflicting name/contact;
- very similar name plus same contact number;
- very similar name plus same barangay/farm location;
- RSBSA differing by a small number of characters/digits.

Action:

- flag for Validator review;
- do not expose candidate PII to the farmer;
- do not automatically bind the submission to the candidate farmer.

### Tier C — weak/fuzzy similarity

Examples:

- similar name only;
- same barangay with a common name;
- partial contact/location similarity.

Action:

- use only as a duplicate-warning signal;
- never treat as proof of identity;
- Validator may review if the configured threshold is met.

---

## Role-based behavior

### Farmer / public respondent

May:

- enter or verify their own RSBSA/name/contact/location information;
- submit a new or update request.

Must not:

- browse farmer records;
- see close-match candidate lists;
- see another farmer's RSBSA, phone number, address, or farm information;
- directly select a fuzzy match;
- merge records;
- change an approved master identity directly.

If a possible existing profile is detected, show only a neutral message such as:

```text
A possible existing profile was detected.
Your submission will be reviewed before a new farmer record is created or an existing profile is updated.
```

### Authenticated Encoder

May:

- search authorized farmer records within their assigned scope;
- use an exact/strong match to open an existing farmer after secondary confirmation;
- submit a possible-new-farmer record when identity remains uncertain;
- propose corrections to identity information.

Must not:

- auto-merge records;
- approve their own identity correction;
- see records outside their assigned scope;
- convert a fuzzy candidate into a confirmed identity without review.

Candidate previews should expose only the minimum information required for work and should be masked where practical.

### Validator

May:

- review duplicate flags and candidate comparisons within authorized scope;
- decide whether an incoming submission belongs to an existing farmer or represents a new farmer;
- approve or return proposed identity corrections;
- mark candidate pairs as same person / different people / needs Admin action.

Should not perform irreversible deletion.

### Data Admin

May:

- execute approved canonical-record merges;
- correct protected identity fields on approved farmer master records;
- restore/undo an incorrect linkage where technically possible;
- review full audit and merge history.

A production merge or protected RSBSA correction should be treated as a high-impact action.

---

## New-farmer flow

```text
Enter farmer identity
      ↓
Normalize inputs
      ↓
Server-side duplicate detection
      ↓
┌───────────────────────┐
│ no meaningful match   │ → create PENDING farmer → validation
└───────────────────────┘

┌───────────────────────┐
│ strong candidate      │ → secondary verification / authorized review
└───────────────────────┘

┌───────────────────────┐
│ possible/fuzzy match  │ → duplicate-review queue
└───────────────────────┘
```

The browser must not make the final identity decision from client-side matching alone.

---

## Returning-farmer flow

For an authenticated Encoder:

```text
Find existing farmer
      ↓
exact/strong match + secondary confirmation
      ↓
open canonical farmer
      ↓
create UPDATE_PROFILE / ADD_FARM / new annual production submission
      ↓
validation according to HVCP policy
```

For a farmer using a public/self-service form, V1 must **not** expose an existing record unless HVCP provides an approved authentication mechanism such as an authenticated account or verified OTP flow.

Without such authentication, a returning farmer submits an update request and the Validator links it to the correct canonical farmer.

---

## Typo and correction handling

Normalize before comparison:

- trim whitespace;
- apply the confirmed RSBSA formatting rules;
- standardize case where relevant;
- normalize phone formatting;
- normalize name spacing/punctuation for comparison only.

Keep the originally submitted value where useful for audit.

A correction to protected identity information should capture:

- old value;
- new value;
- reason;
- requested/submitted by;
- approved/resolved by;
- timestamp;
- related submission/review ID.

Never use fuzzy similarity to silently change an RSBSA number.

---

## Merge policy

A merge means two farmer records were confirmed to represent the same real farmer.

Rules:

1. choose one canonical `farmer_id`;
2. re-parent approved child records to the canonical farmer where appropriate;
3. mark the duplicate farmer `MERGED`;
4. set `merged_into_farmer_id`;
5. preserve the merged source record and its audit history;
6. record who approved/executed the merge and why;
7. ensure dashboards count only the canonical active farmer;
8. never physically delete the merged farmer as part of normal operations.

Merge execution should run server-side under `LockService` so concurrent updates cannot partially re-parent records.

---

## Incorrect match recovery

If an Encoder, Validator, or Admin links a submission to the wrong farmer:

1. stop further edits if the conflict is detected;
2. create an identity-resolution incident/review;
3. determine the correct canonical farmer or create a new farmer;
4. re-link only the affected submission/child records;
5. restore incorrect master values if they were changed;
6. record the correction in the audit trail.

The system should make incorrect linkage recoverable without deleting history.

---

## Proposed identity-review record

Add an `Identity_Reviews` sheet.

Recommended fields:

```text
identity_review_id
submission_id
subject_farmer_id
candidate_farmer_id
match_tier
match_reasons
review_status
resolution
requested_by
resolved_by
resolved_at
resolution_notes
created_at
updated_at
```

Suggested statuses:

- `PENDING`
- `IN_REVIEW`
- `RESOLVED`

Suggested resolutions:

- `LINK_TO_EXISTING`
- `CREATE_NEW`
- `CONFIRMED_DIFFERENT`
- `IDENTITY_CORRECTION_APPROVED`
- `MERGE_REQUIRED`
- `MERGED`

Do not store a magic fuzzy-match score as if it were proof. If a numeric score is used internally, also store human-readable `match_reasons`.

---

## Data exposure rules

- Duplicate detection runs server-side.
- Public/respondent responses never include candidate PII.
- Encoder search results are limited by role/geographic scope.
- Validator/Admin views should display only fields needed for identity review.
- Dashboard/reporting layers should not expose RSBSA or unnecessary PII.
- RSBSA ID images remain browser-only and are discarded after OCR/verification.

---

## Concurrency and integrity

Use `LockService` for:

- farmer ID creation;
- identity-review resolution;
- protected identity correction;
- merges/re-parenting;
- final approval transactions that affect canonical identity.

Each merge/correction must either complete fully or fail without leaving a partially updated identity state.

---

## Open HVCP policy decisions

Before final implementation, confirm:

1. Will farmers directly use the application, or will profiling be encoder-assisted only?
2. If farmers directly return to update their profile, what approved authentication/verification method is available?
3. Who may approve protected RSBSA/name corrections?
4. Who may execute a duplicate merge?
5. Should updates to an approved farmer profile always return to validation?
6. What fields HVCP considers sufficient secondary confirmation for a strong match?

Until those decisions are confirmed, use the conservative rule: **possible duplicate = Validator review; merge/protected identity correction = Admin-controlled and audited.**
