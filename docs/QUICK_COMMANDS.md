# Quick Command Reference

For trained HVCP/Cacao technical maintainers.

Run commands from the repository root.

---

## First-time setup

```bash
git clone https://github.com/gilmour59/cacao_coffee_db.git
cd cacao_coffee_db
npm install
npx clasp login
npm run auth:whoami
```

Create local project mappings.

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

Edit each file and replace the placeholder Script ID.

---

## Start of work

```bash
git checkout main
git pull origin main
npm install
git status
npm run auth:whoami
```

---

## TEST

See files to push:

```bash
npm run test:status
```

Push:

```bash
npm run test:push
```

Open Apps Script:

```bash
npm run test:open
```

List deployments:

```bash
npm run test:deployments
```

Pull remote TEST code only when intentionally reconciling browser-editor changes:

```bash
npm run test:pull
```

---

## PROD preflight

```bash
git status
npm run auth:whoami
npm run prod:status
npm run prod:deployments
npm run prod:versions
```

---

## PROD release

Push approved code:

```bash
npm run prod:push
```

Create version:

```bash
npm run prod:version -- "v1.2.0 - Description"
```

Deploy returned version to the existing deployment:

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V VERSION_NUMBER -d "v1.2.0 - Description"
```

---

## PROD rollback

Find previous version:

```bash
npm run prod:versions
npm run prod:deployments
```

Redeploy previous version:

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V PREVIOUS_VERSION -d "Rollback to known-good version"
```

Revert bad source commit:

```bash
git revert BAD_COMMIT_SHA
git push origin main
```

---

## Open PROD Apps Script

```bash
npm run prod:open
```

Do not edit PROD directly unless handling an exceptional emergency.

---

## Git basics

Save work:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

Check latest commit:

```bash
git log -1 --oneline
```

Check current changes:

```bash
git status
git diff
```

---

## Rules to remember

1. TEST first.
2. GitHub `main` is the source of truth.
3. Never commit real farmer data or credentials.
4. Confirm the Google account before PROD.
5. Use the existing PROD deployment ID so the URL stays unchanged.
6. Roll back by version, not by deleting production.
7. Reference-data updates usually do not need a deployment.
