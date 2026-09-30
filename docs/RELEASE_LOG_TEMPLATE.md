# Production Release Log Template

Use this template for each production deployment.

Do not place credentials, passwords, farmer data, or sensitive operational secrets in the release log.

---

## Release

**Application version:**  
**Date/time:**  
**Released by:**  
**Git commit SHA:**  
**Apps Script version number:**  
**Production deployment ID:**  
**Previous known-good Apps Script version:**  

### Change summary

- 
- 
- 

### Type

- [ ] Reference-data only
- [ ] Bug fix
- [ ] New feature
- [ ] Schema change
- [ ] Hotfix
- [ ] Rollback

### TEST verification

- [ ] TEST deployment verified
- [ ] Farmer workflow verified
- [ ] RSBSA workflow verified where affected
- [ ] PSGC/location workflow verified where affected
- [ ] Submission/validation workflow verified where affected
- [ ] Dashboard/reporting verified where affected
- [ ] Regression checks completed

**TEST notes:**

### Database/schema impact

- [ ] No schema change
- [ ] Additive schema change
- [ ] Reference-data change
- [ ] Production backup created

**Backup/reference:**

### Production deployment

Command pattern:

```bash
npm run prod:push
npm run prod:version -- "VERSION - Description"
npm run prod:deploy -- -i DEPLOYMENT_ID -V VERSION_NUMBER -d "VERSION - Description"
```

### Post-release smoke test

- [ ] Existing production URL loads
- [ ] Correct PROD environment/database confirmed
- [ ] Critical workflow verified
- [ ] Looker Studio/report connection checked
- [ ] No unexpected errors observed

### Rollback plan

**Rollback target version:**  
**Rollback command prepared:**  

```bash
npm run prod:deploy -- -i DEPLOYMENT_ID -V PREVIOUS_VERSION -d "Rollback to known-good version"
```

### Result

- [ ] Successful
- [ ] Rolled back
- [ ] Follow-up required

**Notes:**
