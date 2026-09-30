# Release, Update, and Rollback Guide

This guide is intentionally optimized for a small HVCP/Cacao maintenance team.

Production is not automatically deployed from GitHub. A human verifies TEST and deliberately promotes a version.

The repository pins `@google/clasp` so commands remain predictable.

---

## 1. Update categories

### Type A — Reference-data update

Examples:

- add approved Coffee variety;
- add Cacao variety;
- add intervention type;
- deactivate obsolete facility type.

Usually **no code deployment**.

Handled by authorized Data Admin using reference Sheets.

### Type B — Application fix

Examples:

- fix validation;
- fix dropdown;
- improve form wording;
- correct map behavior.

Requires TEST and versioned PROD release.

### Type C — New application feature

Examples:

- add new validation screen;
- add report;
- add new workflow.

Requires TEST, regression check, and versioned PROD release.

### Type D — Schema change

Examples:

- new required column;
- new transaction Sheet;
- relationship change.

Requires:

- TEST migration;
- documented schema update;
- production backup;
- compatible code release;
- post-release verification.

---

## 2. Normal TEST update

```bash
git checkout main
git pull origin main
npm install
npm run auth:whoami
npm run test:status
npm run test:push
npm run test:open
```

Run the required test cases.

If a defect is found, fix it locally, commit/push, and repeat TEST.

---

## 3. Normal PROD release

### A. Verify repository

```bash
git status
git log -1 --oneline
```

The working tree should be clean.

### B. Verify account and deployment

```bash
npm run auth:whoami
npm run prod:status
npm run prod:deployments
npm run prod:versions
```

### C. Push approved source

```bash
npm run prod:push
```

### D. Create immutable version

```bash
npm run prod:version -- "v1.2.0 - Description"
```

Record the returned Apps Script version number.

### E. Update the existing deployment

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V VERSION_NUMBER -d "v1.2.0 - Description"
```

Using the same deployment ID preserves the existing production web-app URL.

### F. Smoke test

Verify:

- app opens;
- correct environment/database;
- key navigation works;
- approved workflow works;
- dashboard still connects.

### G. Optional Git tag

```bash
git tag v1.2.0
git push origin v1.2.0
```

---

## 4. Rollback

Use when the new release causes a production issue.

### A. Identify versions

```bash
npm run prod:versions
npm run prod:deployments
```

Find the previous known-good version number.

### B. Redeploy previous version

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V PREVIOUS_VERSION -d "Rollback to previous known-good version"
```

### C. Verify PROD

Open the same production URL and smoke-test.

### D. Correct Git source

Prefer a safe Git revert:

```bash
git revert BAD_COMMIT_SHA
git push origin main
```

Then fix/test/release a new version.

Do not force-push or rewrite shared `main` history during normal recovery.

---

## 5. Schema rollback warning

Apps Script rollback only changes code.

It does not automatically reverse:

- Sheet column changes;
- reference-data changes;
- altered production records.

Before a schema-changing release, make a restricted production Sheet backup and document the migration.

Where possible, make schema changes additive and backward-compatible.

---

## 6. Hotfix procedure

Use only for urgent production defects.

```text
Issue identified
   ↓
reproduce in TEST
   ↓
smallest safe fix
   ↓
TEST
   ↓
commit to main
   ↓
versioned PROD release
```

If production is unusable, rollback first, then investigate.

Do not bypass source control unless there is a true emergency.

---

## 7. Emergency direct Apps Script edit

Discouraged.

If unavoidable:

1. record what was changed;
2. restore service;
3. pull the remote project locally;
4. inspect `git diff`;
5. commit the emergency change;
6. test and normalize the deployment through the standard flow.

GitHub must become the source of truth again immediately.

---

## 8. Release record

For every production release record:

- application version;
- Git commit SHA;
- Apps Script version number;
- deployment ID;
- date/time;
- released by;
- short description;
- TEST result;
- rollback target (previous known-good version).

This record can be maintained in an internal release log Sheet or approved documentation location.
