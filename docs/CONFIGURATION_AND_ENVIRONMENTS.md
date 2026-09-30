# Configuration and Environments

The project intentionally uses only two runtime environments:

- **TEST**
- **PROD**

This keeps turnover and maintenance understandable for HVCP/Cacao staff.

---

## 1. TEST environment

Purpose:

- development;
- feature testing;
- OCR tuning;
- regression testing;
- demo/sanitized data;
- schema experiments before production.

Resources:

```text
TEST Apps Script project
TEST Google Sheet
TEST web-app deployment
```

Ownership during initial development may be the developer account.

TEST must never be pointed at the PROD database.

---

## 2. PROD environment

Purpose:

- real operational use;
- real farmer profiles;
- official validation;
- official reporting/dashboard.

Resources:

```text
HVCP-owned Apps Script project
HVCP-owned Google Sheet
HVCP-owned web-app deployment
HVCP Looker Studio dashboard
```

Preferred owner:

- DA/HVCP Shared Drive or institutional Workspace account.

---

## 3. Configuration layers

There are three separate configuration layers.

### A. Git-tracked application source

Stored in GitHub:

```text
src/
docs/
package.json
*.example files
```

Must contain no secrets or production farmer data.

### B. Local clasp project mapping

Local files:

```text
.clasp.test.json
.clasp.prod.json
```

Example:

```json
{
  "scriptId": "REPLACE_WITH_SCRIPT_ID",
  "rootDir": "src"
}
```

These files are ignored by Git.

### C. Apps Script Script Properties

TEST:

```text
ENVIRONMENT=TEST
DATABASE_SPREADSHEET_ID=<TEST ID>
APP_NAME=Coffee and Cacao Farmer Profiling - TEST
```

PROD:

```text
ENVIRONMENT=PRODUCTION
DATABASE_SPREADSHEET_ID=<PROD ID>
APP_NAME=Coffee and Cacao Farmer Profiling
```

The same source code must run in both environments without changing hard-coded IDs.

---

## 4. Local setup

Install dependencies:

```bash
npm install
```

Authenticate:

```bash
npx clasp login
npm run auth:whoami
```

Create project config files from examples.

macOS/Linux:

```bash
cp .clasp.test.json.example .clasp.test.json
cp .clasp.prod.json.example .clasp.prod.json
```

Windows:

```bat
copy .clasp.test.json.example .clasp.test.json
copy .clasp.prod.json.example .clasp.prod.json
```

Fill each local file with the correct Apps Script ID.

---

## 5. Environment safety checks

Before TEST command:

```bash
npm run test:status
```

Before PROD command:

```bash
npm run prod:status
npm run prod:deployments
```

Before any production release:

```bash
npm run auth:whoami
```

Verify that the account shown is authorized for the HVCP production project.

---

## 6. What must not be shared between environments

Do not reuse:

- production spreadsheet as TEST;
- real farmer data as casual TEST data;
- production operational exports in GitHub;
- production clasp project mapping on an unauthorized computer.

The source code may be the same; runtime resources must remain separate.

---

## 7. Configuration changes

### Script Property change only

Examples:

- app display name;
- switch a TEST spreadsheet ID;
- production Sheet replacement after a controlled migration.

No Git commit is necessary if source code does not change.

Document significant production property changes internally.

### Source-code configuration change

If a new required Script Property is introduced:

1. add safe lookup/validation to source;
2. document the property here;
3. configure TEST;
4. test;
5. configure PROD;
6. deploy approved version.

---

## 8. Future properties

Do not add configuration keys merely because they might be useful someday.

Only add a new property when code actually requires it.

Potential future examples may include domain/access settings, but these must be documented at implementation time rather than silently assumed.
