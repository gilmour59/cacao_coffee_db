# TEST Vertical Slice Setup

This document covers the first end-to-end TEST path:

```text
New Farmer Form
    ↓
PENDING Submission
    ↓
Validator Queue
    ↓
Approve
    ↓
Canonical Farmer / Farm / Profiling Round / Observations
```

## Current TEST database

A Google Sheets TEST database has been created separately from the repository. It contains the V1 transaction/reference tabs, header structure, confirmed Coffee/Cacao reference values, and the initial Pototan pilot PSGC reference data.

Do not commit the live spreadsheet ID into this public repository. Configure it through Apps Script Script Properties instead.

## Create the TEST Apps Script project

Create one standalone Apps Script project under the development account, then copy its Script ID into a local file:

```text
.clasp.test.json
```

using:

```json
{
  "scriptId": "YOUR_TEST_SCRIPT_ID",
  "rootDir": "src"
}
```

The local file is ignored by Git.

## Required Script Properties

Set:

```text
DATABASE_SPREADSHEET_ID=<TEST Google Sheet ID>
BOOTSTRAP_ADMIN_EMAIL=<development/admin Google account>
APP_NAME=Coffee and Cacao Farmer Profiling
ENVIRONMENT=TEST
```

The database setup function requires the active user to match `BOOTSTRAP_ADMIN_EMAIL`.

## Push and initialize

```bash
npm install
npm run auth:whoami
npm run test:push
```

In the Apps Script editor, run:

```text
setupDatabaseSchema
```

This function is non-destructive: it creates missing tabs/headers and seeds confirmed domain references without replacing existing rows.

## Deployment behavior

Deploy the TEST project as a web app using the account/access settings appropriate for TEST.

The first vertical slice exposes:

- public new-farmer profiling;
- local-only RSBSA OCR with manual confirmation;
- structured residence and farm location;
- Leaflet map pin and device GPS capture;
- Coffee/Cacao tree counts per commodity per farm;
- mortality;
- varieties/year planted;
- per-harvest production in kg + price/kg;
- facilities/equipment + utilization;
- interventions received/needed;
- PENDING staged submission;
- Validator queue;
- identity-review resolution;
- Approve / Return.

## Smoke test

1. Submit a new farmer with no duplicate signals.
2. Confirm one row appears in `Submissions` with `status=PENDING`.
3. Confirm no canonical `Farmers` row exists yet.
4. Sign in as the bootstrap/admin user and open Validator Queue.
5. Review and Approve the submission.
6. Confirm:
   - canonical Farmer row exists;
   - Farm row exists;
   - Profiling_Rounds row exists;
   - Planting_Observations rows exist per selected commodity;
   - per-harvest Production rows exist;
   - Submissions status becomes APPROVED;
   - Audit_Log contains SUBMIT and APPROVE events.
7. Repeat with a likely duplicate RSBSA and confirm approval is blocked until Identity Review is resolved.
8. Repeat with Return and confirm canonical tables remain unchanged.

## Known first-slice limitation

The browser UI currently profiles **one farm per form submission**. The server model already supports multiple farms. Multi-farm add/edit UI is the next expansion after the first end-to-end TEST path is verified.

## Backlog

RSBSA parcel/geospatial coordination and parcel visualization remain post-V1 backlog items.
