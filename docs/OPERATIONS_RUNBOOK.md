# Operations and Handover Runbook

Last updated: 2026-09-30

This runbook is the primary technical operations document for the **Coffee and Cacao Farmer Profiling and Information Management System**.

It is written for turnover to HVCP/Cacao personnel who may not be full-time software developers. The release process is intentionally simple:

```text
GitHub main
   ↓
TEST Apps Script
   ↓
TEST verification
   ↓
Versioned PROD release
   ↓
Same PROD URL
```

The system uses only two environments: **TEST** and **PROD**.

---

## 1. Ownership model

### GitHub

Repository:

```text
gilmour59/cacao_coffee_db
```

For turnover, HVCP should have at least one institutional/authorized GitHub maintainer or receive a repository transfer/mirror according to office policy.

### Google TEST environment

Initially owned by the developer account.

Contains:

- TEST Apps Script project
- TEST Google Sheet
- TEST web-app deployment
- fake/anonymized test data only

### Google PROD environment

Must be owned by:

1. HVCP/DA Shared Drive, where possible; or
2. an HVCP institutional Google Workspace account.

Contains:

- PROD Apps Script project
- PROD Google Sheet
- PROD web-app deployment
- PROD Looker Studio dashboard

The production deployment must not depend on the developer's personal Google account.

---

## 2. Source-of-truth rule

**GitHub `main` is the approved source of application code.**

Normal rule:

```text
Edit locally
  ↓
Commit to Git
  ↓
Push GitHub
  ↓
Push to TEST
  ↓
Verify
  ↓
Push/version PROD
```

Avoid editing production code directly in the Apps Script browser editor.

If an emergency direct edit is unavoidable:

1. document the emergency;
2. pull the production code immediately afterward;
3. review the Git diff;
4. commit the recovered change to GitHub;
5. restore GitHub as the source of truth.

---

## 3. Software required on a maintainer computer

Required:

- Git
- Node.js **22 or newer**
- npm
- a browser
- access to the GitHub repository
- access to the required Google account/resources

The repository pins `@google/clasp` to version `3.4.1` in `package.json` so maintainers use a known CLI version.

Initial setup:

```bash
git clone https://github.com/gilmour59/cacao_coffee_db.git
cd cacao_coffee_db
npm install
```

Check:

```bash
node -v
npm -v
npx clasp --version
```

Expected clasp version for this documented workflow:

```text
3.4.1
```

---

## 4. Google Apps Script API setup

The Google account used by clasp must have Apps Script API access enabled.

Then authenticate:

```bash
npx clasp login
```

Confirm the active account:

```bash
npm run auth:whoami
```

Do not copy/share the local clasp authentication file.

Do not commit OAuth credentials, tokens, or service-account files.

---

## 5. Local environment files

Two local clasp configuration files are used:

```text
.clasp.test.json
.clasp.prod.json
```

They are intentionally ignored by Git.

Create them from the templates.

macOS/Linux:

```bash
cp .clasp.test.json.example .clasp.test.json
cp .clasp.prod.json.example .clasp.prod.json
```

Windows Command Prompt:

```bat
copy .clasp.test.json.example .clasp.test.json
copy .clasp.prod.json.example .clasp.prod.json
```

Each file contains:

```json
{
  "scriptId": "APPS_SCRIPT_ID",
  "rootDir": "src"
}
```

TEST points to the TEST Apps Script project.

PROD points to the HVCP-owned production Apps Script project.

---

## 6. Script Properties

Environment-specific application settings belong in **Apps Script Script Properties**, not GitHub.

### TEST

```text
ENVIRONMENT=TEST
DATABASE_SPREADSHEET_ID=<TEST spreadsheet ID>
APP_NAME=Coffee and Cacao Farmer Profiling - TEST
```

### PROD

```text
ENVIRONMENT=PRODUCTION
DATABASE_SPREADSHEET_ID=<HVCP production spreadsheet ID>
APP_NAME=Coffee and Cacao Farmer Profiling
```

Rules:

- never hard-code spreadsheet IDs in source files;
- never commit account credentials;
- keep production and test Sheet IDs separate;
- do not point TEST at the production database.

---

## 7. Routine developer/maintainer flow

Before starting work:

```bash
git checkout main
git pull origin main
npm install
npm run auth:whoami
```

Check repository state:

```bash
git status
```

Make changes locally.

Commit clearly:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

For more complex work, a short-lived feature branch may be used, but GitFlow is intentionally not required.

Recommended optional pattern:

```text
feature/rsbsa-ocr
feature/farm-map
fix/barangay-filter
```

Merge approved work back to `main`.

---

## 8. Deploying to TEST

Always verify which Google account is active:

```bash
npm run auth:whoami
```

Review which files will be pushed:

```bash
npm run test:status
```

Push to TEST:

```bash
npm run test:push
```

Open TEST Apps Script:

```bash
npm run test:open
```

Do not promote the change until the TEST checklist passes.

### Minimum TEST checklist

- web app loads;
- farmer form loads;
- RSBSA paths behave correctly;
- location references load;
- Province → LGU → Barangay cascades correctly;
- farm map works;
- submission writes to TEST Sheet;
- no write reaches production;
- existing working features still work.

Feature-specific tests must also be completed.

---

## 9. Production release policy

Production deployments are **deliberate human actions**.

There is no automatic deploy-to-production when code is pushed to GitHub.

This means:

```text
CI = checks/source control discipline
CD = authorized human release
```

Only an authorized technical maintainer should release PROD.

### Pre-release checklist

Before a production release:

- TEST passed;
- Git working tree is clean;
- `main` contains the approved code;
- the maintainer is logged into the correct Google account;
- the production Sheet is healthy;
- any schema/reference changes are documented;
- a backup exists if the release changes the Sheet schema;
- the current production Apps Script version is recorded.

Check:

```bash
git status
git log -1 --oneline
npm run auth:whoami
npm run prod:status
npm run prod:deployments
npm run prod:versions
```

### Push source to PROD project

```bash
npm run prod:push
```

### Create an immutable Apps Script version

Example:

```bash
npm run prod:version -- "v1.2.0 - Improve RSBSA validation"
```

Record the version number returned by clasp.

### Update the existing production deployment

Use the existing deployment ID so the production URL stays the same.

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V VERSION_NUMBER -d "v1.2.0 - Improve RSBSA validation"
```

Do **not** create a new public production URL for every ordinary release.

### Verify

After deployment:

- open the existing production URL;
- verify the home page loads;
- verify critical read-only functions;
- perform an approved production smoke test;
- verify Looker Studio still connects;
- record the release in the release log.

---

## 10. Release naming and history

Recommended semantic version pattern:

```text
v1.0.0
v1.1.0
v1.1.1
```

General convention:

- major: significant architecture/behavior change;
- minor: new feature;
- patch: defect fix.

Example release descriptions:

```text
v1.0.0 - Initial HVCP production release
v1.1.0 - Add RSBSA OCR verification
v1.1.1 - Fix barangay cascading lookup
```

Optionally tag the same Git commit:

```bash
git tag v1.1.1
git push origin v1.1.1
```

---

## 11. Rollback procedure

Rollback should preserve the same production URL.

### Step 1 — Identify known-good version

```bash
npm run prod:versions
npm run prod:deployments
```

Record:

- deployment ID;
- current version;
- previous known-good version.

### Step 2 — Point deployment back to known-good version

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V PREVIOUS_VERSION -d "Rollback to known-good version"
```

### Step 3 — Verify production

Check the existing PROD URL.

Verify critical workflows.

### Step 4 — Fix Git history safely

Do not rewrite shared Git history.

Prefer:

```bash
git revert BAD_COMMIT_SHA
git push origin main
```

Then test and release a new fixed version normally.

### Important

A code rollback does **not** automatically undo Google Sheet schema/data changes.

For schema-changing releases, follow the schema backup rules before deployment.

---

## 12. Schema-change policy

Routine releases should avoid destructive spreadsheet migrations.

Preferred changes are additive:

- add a new column;
- add a new reference sheet;
- add a new optional value;
- preserve old fields until migration is complete.

Avoid:

- renaming/removing production columns without a migration plan;
- changing PSGC codes manually;
- deleting old reference rows;
- reordering/rewriting production data without backup.

Before a schema-changing release:

1. document the schema change;
2. duplicate/export the production Sheet as a restricted backup;
3. test migration on TEST;
4. release code compatible with the new schema;
5. verify production;
6. retain the backup according to office retention policy.

---

## 13. Reference-data-only updates

Many HVCP updates should **not require a code deployment**.

Examples:

- add a Coffee variety;
- add a Cacao variety;
- update intervention types;
- update facility types;
- deactivate an obsolete reference value.

Authorized Admin workflow:

```text
Reference Sheet
    ↓
add/update approved row
    ↓
keep stable code
    ↓
set is_active appropriately
    ↓
verify app dropdown
```

Rules:

- do not change stable codes after records already use them;
- do not delete reference rows used historically;
- use `is_active=FALSE` instead;
- PSGC updates must follow documented reference-update procedures.

---

## 14. Production data corrections

Production records are not source-code changes.

Normal corrections should happen through application workflows where available.

If controlled direct Sheet correction is necessary:

1. restrict correction to authorized Admin/Data personnel;
2. record who changed the record;
3. record why;
4. preserve IDs;
5. do not reorder/delete rows simply for cosmetic reasons;
6. make an audit entry where required.

Never fix production data by modifying the GitHub repository.

---

## 15. Backups

### Source code

GitHub provides source history.

Use release tags for important releases.

### Apps Script

Apps Script versions provide immutable code snapshots for deployed versions.

### Google Sheets

Google Sheets version history is available, but major schema changes should also have a restricted pre-change backup copy/export.

Suggested backup name:

```text
Coffee_Cacao_PROD_Backup_YYYYMMDD_HHMM
```

Do not place production backups in GitHub.

---

## 16. Security rules

Never commit:

- real farmer data;
- RSBSA ID images;
- phone numbers;
- residential addresses;
- GPS coordinates from actual farmers;
- OAuth tokens;
- service account JSON;
- passwords;
- clasp authentication files;
- production exports.

RSBSA ID images are processed only temporarily in the browser for OCR and are not retained.

Production Google resources should follow least privilege.

Technical maintainers do not need unrestricted access to unrelated HVCP files.

Encoders do not need code deployment access.

Validators do not need GitHub write access.

---

## 17. Emergency production incident

If a release breaks production:

1. stop additional deployments;
2. record the current deployment/version;
3. rollback to the known-good Apps Script version;
4. verify service restoration;
5. investigate in TEST;
6. use `git revert` for the faulty source change;
7. test the corrected build;
8. issue a new production version.

If data integrity may be affected:

1. notify the HVCP data administrator;
2. temporarily pause encoding if necessary;
3. preserve the affected Sheet/version history;
4. identify the impacted rows/transactions;
5. do not mass-delete records;
6. correct using a documented recovery plan.

---

## 18. Handover minimum package

HVCP should receive/control:

- production Apps Script project;
- production Google Sheet;
- production web-app deployment;
- Looker Studio dashboard;
- GitHub repository access or institutional repository copy;
- Script Properties/configuration reference;
- this operations runbook;
- database schema;
- location reference guide;
- RSBSA OCR guide;
- migration guide;
- role workflow guide;
- release/rollback guide;
- current production deployment ID and version recorded in a secure internal document.

The deployment ID is operational configuration; do not publish internal operational details unnecessarily.

---

## 19. Maintenance principle

The system is intentionally designed so most day-to-day HVCP maintenance is **data/reference maintenance**, not code deployment.

Expected frequency:

```text
Farmer records                daily operational use
Reference data                occasional Admin update
Dashboard/reporting           occasional
Application code              infrequent
Production deployment         only after TEST approval
Schema migration              rare
```

This is the preferred turnover model because Cacao/HVCP staff should not need DevOps expertise to operate the system.
