# Migration to HVCP Production

The developer may build and test under a personal/development Google account, but **HVCP should own production**.

Do not request or share the HVCP Google account password.

## Pre-migration checklist

- [ ] Feature freeze completed.
- [ ] UAT passed.
- [ ] No personal Google Sheet/Drive IDs are hard-coded.
- [ ] No credentials or real farmer data are committed to GitHub.
- [ ] Production schema version is documented.
- [ ] Reference data is ready.
- [ ] TEST data is separated from production data.

## Recommended production ownership

Preferred:

```text
HVCP / DA Shared Drive
└── Coffee and Cacao Information System
    ├── Database
    ├── Application
    ├── Reports
    └── Documentation
```

If a suitable Shared Drive is unavailable, use an HVCP institutional Google Workspace account.

## Step 1 — Create production resources

HVCP creates/owns:

- production Google Sheet;
- Apps Script project;
- Looker Studio report;
- documentation folder.

RSBSA ID photos are not stored, so no RSBSA image folder is required.

## Step 2 — Create Google Sheet tabs

Create the tabs defined in `DATABASE_SCHEMA.md`.

Copy reference data only. Do not migrate fake/demo farmer records unless explicitly needed for a demo environment.

## Step 3 — Create production Apps Script project

Push/copy the same GitHub source to the HVCP-owned Apps Script project.

Use a separate local `.clasp.json` for production. `.clasp.json` is ignored by Git.

## Step 4 — Configure Script Properties

Set values such as:

```text
ENVIRONMENT=PRODUCTION
DATABASE_SPREADSHEET_ID=<HVCP sheet id>
APP_NAME=Coffee and Cacao Farmer Profiling
```

The source code must not require account-specific edits.

## Step 5 — Authorization

The HVCP owner signs in and approves the Google scopes needed by the application.

The developer guides the process; HVCP never gives the developer its password.

## Step 6 — Production deployment

The HVCP account creates the final web-app deployment.

The HVCP deployment URL becomes the official application URL. The developer's TEST deployment remains separate.

## Step 7 — Dashboard

Connect Looker Studio to the HVCP production reporting views/sheets rather than TEST sheets.

## Step 8 — Smoke test

Verify end-to-end:

```text
Farmer / RSBSA
    ↓
Farm + map point
    ↓
Coffee/Cacao profile
    ↓
Production / interventions / facilities
    ↓
Submit
    ↓
Validate
    ↓
Google Sheets
    ↓
Dashboard
```

Test with:

- HVCP administrator;
- encoder account;
- mobile browser;
- desktop browser.

## Step 9 — Handover

HVCP should retain ownership/control of:

- Google Sheet;
- Apps Script project;
- web-app deployment;
- Looker Studio dashboard;
- source repository access or source snapshot;
- data dictionary;
- deployment/admin guide.

Developer access can later be removed without breaking production.
