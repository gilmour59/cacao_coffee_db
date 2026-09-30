# Project TODO

## A. Requirements and data model

- [x] Select Apps Script + Google Sheets for V1.
- [x] Add RSBSA registration states.
- [x] Make RSBSA OCR mandatory in V1 when an ID is available.
- [x] Do not retain RSBSA ID images.
- [x] Add PSGC Province → Municipality/City → Barangay references.
- [x] Add approximate farm latitude/longitude via map pin.
- [x] Draft complete V1 schema.
- [x] Define secure farmer identity/deduplication design.
- [ ] Review schema with HVCP.
- [ ] Confirm whether farmers directly use the app or profiling is encoder-assisted only.
- [ ] If farmers directly return to the app, confirm approved authentication/verification method before allowing access to an existing profile.
- [ ] Confirm who may approve protected RSBSA/name corrections.
- [ ] Confirm who may execute duplicate-record merges.
- [ ] Confirm what HVCP accepts as secondary confirmation for a strong identity match.
- [ ] Confirm whether approved profile updates must pass validation again.
- [ ] Confirm exact RSBSA number format from a sample ID.
- [ ] Confirm official Coffee variety list.
- [ ] Confirm official Cacao variety list.
- [ ] Confirm topography choices.
- [ ] Confirm intervention choices.
- [ ] Confirm facility/equipment choices.
- [ ] Confirm production units/product forms.
- [ ] Confirm which fields are mandatory vs optional in field operations.

## B. Repository and local development

- [x] Initialize GitHub repository.
- [x] Add architecture/roadmap/schema docs.
- [x] Add TEST/PROD clasp configuration templates.
- [x] Pin clasp and add simple npm maintenance commands.
- [x] Document environment, role, update, release, rollback, and turnover procedures.
- [x] Document secure farmer identity, return-user, typo-correction, duplicate-review, and merge rules.
- [ ] Install/configure clasp locally.
- [ ] Create TEST Apps Script project.
- [ ] Add TEST script ID to local `.clasp.test.json` only.
- [ ] Verify TEST push/pull workflow.
- [ ] Create PROD clasp mapping only after HVCP production project exists.

## C. TEST Google Sheet

- [ ] Create TEST spreadsheet.
- [ ] Add Farmers.
- [ ] Add Farms.
- [ ] Add Plantings.
- [ ] Add Production.
- [ ] Add Facilities.
- [ ] Add Interventions.
- [ ] Add Intervention_Needs.
- [ ] Add Submissions.
- [ ] Add Identity_Reviews.
- [ ] Add Users.
- [ ] Add Audit_Log.
- [ ] Add all reference sheets.
- [ ] Format PSGC/ID columns as Plain text.
- [ ] Protect system/ID columns.
- [ ] Protect canonical identity/merge columns from direct staff edits.
- [ ] Load Region VI PSGC reference data.
- [ ] Load initial Coffee/Cacao reference data.

## D. Apps Script core

- [ ] Configure Script Properties.
- [ ] Implement repository helpers.
- [ ] Implement batch reads/writes.
- [ ] Implement ID generation under LockService.
- [ ] Implement standardized responses/errors.
- [ ] Implement reference-data bootstrap.
- [ ] Implement audit logging.
- [ ] Implement role/authorization checks server-side.
- [ ] Implement geographic-scope checks if required by HVCP.
- [ ] Ensure the browser cannot bypass role checks by directly calling Apps Script functions.
- [ ] Implement server-side identity-resolution service.
- [ ] Use LockService for identity review resolution, protected corrections, and merges.

## E. Farmer identity + RSBSA + deduplication

### Intake and normalization

- [ ] RSBSA registration-state selector.
- [ ] Manual RSBSA entry.
- [ ] Normalize RSBSA values using confirmed official format.
- [ ] Normalize phone number for comparison.
- [ ] Normalize name spacing/case/punctuation for comparison only.
- [ ] Preserve original submitted identity values where needed for audit.
- [ ] Mobile image capture/file picker.
- [ ] Browser Canvas preprocessing.
- [ ] Tesseract.js OCR.
- [ ] Parse RSBSA number.
- [ ] Parse farmer name.
- [ ] User verification/edit screen.
- [ ] Confirm image is never uploaded/retained.

### Duplicate detection

- [ ] Exact normalized RSBSA lookup.
- [ ] Add corroborating-field checks so exact RSBSA alone is not treated as unquestionable proof.
- [ ] Add possible-match rules using name + contact + location.
- [ ] Add conservative fuzzy-name matching for duplicate warnings only.
- [ ] Define Tier A strong candidate / Tier B possible duplicate / Tier C weak similarity.
- [ ] Store human-readable match reasons.
- [ ] Do not auto-merge on any match tier.
- [ ] Do not use a fuzzy score as proof of identity.

### Farmer/respondent privacy

- [ ] Never return candidate farmer PII to a public/self-service respondent.
- [ ] Show only a neutral "possible existing profile" message when a public duplicate is detected.
- [ ] Prevent farmers from choosing among close/fuzzy duplicate candidates.
- [ ] Do not expose an existing profile to a public returning farmer without approved authentication/verification.
- [ ] Limit authenticated Encoder candidate previews to minimum necessary information.

### Return-user flow

- [ ] Authenticated Encoder can search authorized existing farmers.
- [ ] Require secondary confirmation before opening/linking a strong existing match.
- [ ] Returning farmer update creates UPDATE_PROFILE / ADD_FARM / new annual-data submission rather than a second farmer master.
- [ ] Public/self-service returning farmer submits an update request for Validator linkage unless approved authentication exists.
- [ ] Keep historical production/year records instead of overwriting prior years.

### Identity review and correction

- [ ] Generate Identity_Reviews record for ambiguous matches.
- [ ] Validator can resolve incoming submission as LINK_TO_EXISTING / CREATE_NEW / CONFIRMED_DIFFERENT.
- [ ] Encoder can propose but not self-approve protected identity corrections.
- [ ] Protected RSBSA/name correction requires approved role and audit entry.
- [ ] Record old value, new value, reason, requester, approver, and timestamps for protected corrections.
- [ ] Test typo in RSBSA that accidentally equals another farmer's valid RSBSA.
- [ ] Test common-name collisions within the same barangay.

### Merge and recovery

- [ ] Add `merged_into_farmer_id` to Farmers.
- [ ] Mark duplicate master record MERGED instead of deleting it.
- [ ] Implement canonical-farmer merge transaction under LockService.
- [ ] Re-parent affected approved child records safely during a merge.
- [ ] Exclude merged farmer records from active counts.
- [ ] Audit merge initiator/approver/executor/reason.
- [ ] Implement recovery procedure for an incorrect farmer linkage.
- [ ] Never physically delete a farmer record as normal deduplication behavior.

### Final farmer creation

- [ ] Create/save PENDING farmer when identity is unresolved.
- [ ] Activate canonical farmer only after applicable validation/identity resolution.
- [ ] Non-RSBSA farmer path.

## F. Farm and location

- [ ] Province dropdown.
- [ ] Municipality/City cascading dropdown.
- [ ] Barangay cascading dropdown.
- [ ] Build client-side lookup maps.
- [ ] Leaflet map.
- [ ] Map pin selection.
- [ ] Optional device-GPS button if feasible.
- [ ] Save latitude/longitude.
- [ ] Topography.
- [ ] Road distance.
- [ ] Save farm.

## G. Coffee/Cacao profile

- [ ] Commodity selector.
- [ ] Variety selector.
- [ ] Year planted.
- [ ] Newly planted trees.
- [ ] Non-bearing trees.
- [ ] Bearing trees.
- [ ] Area planted.
- [ ] Production year/volume/unit.
- [ ] Facilities/equipment.
- [ ] Interventions received.
- [ ] Intervention needs.
- [ ] Review screen.
- [ ] Submit.

## H. Validation

- [ ] Pending submission list.
- [ ] Submission details.
- [ ] Duplicate/identity-review queue.
- [ ] Show match reasons and relevant candidate comparison only to authorized reviewers.
- [ ] Validator action: link submission to existing farmer.
- [ ] Validator action: confirm new farmer.
- [ ] Validator action: confirm candidate is a different person.
- [ ] Validator action: request protected identity correction.
- [ ] Admin action: execute approved merge/protected canonical correction.
- [ ] Approve.
- [ ] Return for correction.
- [ ] Reject if required by HVCP.
- [ ] Validator remarks.
- [ ] Audit trail.

## I. Dashboard/reporting

- [ ] Flattened reporting view(s).
- [ ] Looker Studio connection.
- [ ] Farmer totals based on canonical ACTIVE farmers only.
- [ ] Exclude MERGED/PENDING duplicates from normal farmer totals.
- [ ] RSBSA registration indicators.
- [ ] Coffee/Cacao area.
- [ ] Tree counts.
- [ ] Production.
- [ ] Province/LGU/Barangay filters.
- [ ] Variety filters.
- [ ] Farm-point map.
- [ ] Intervention-needs summaries.
- [ ] Export-friendly view.
- [ ] Confirm dashboards do not expose RSBSA, phone, precise address, or unnecessary PII.

## J. Testing

- [ ] Mobile Android.
- [ ] Desktop.
- [ ] Slow network.
- [ ] Invalid/blank inputs.
- [ ] Duplicate RSBSA.
- [ ] Exact RSBSA + conflicting name.
- [ ] One-digit RSBSA typo.
- [ ] RSBSA typo that collides with another valid farmer.
- [ ] Same/similar name + same barangay.
- [ ] Same name but genuinely different farmers.
- [ ] Changed contact number for returning farmer.
- [ ] Returning farmer with prior-year production.
- [ ] Farmer cannot see fuzzy candidate list/PII.
- [ ] Encoder cannot access out-of-scope farmer records.
- [ ] Encoder cannot merge or approve own protected correction.
- [ ] Validator can resolve candidate without deleting history.
- [ ] Incorrect farmer linkage recovery.
- [ ] Merge preserves source record and child relationships.
- [ ] Concurrent duplicate-review/merge attempts.
- [ ] Concurrent submissions.
- [ ] OCR under different lighting.
- [ ] Large image OCR performance.
- [ ] Incorrect OCR/manual correction.
- [ ] PSGC cascading accuracy.
- [ ] Map coordinates.
- [ ] Sheet write collision tests.
- [ ] Authorization-bypass tests against direct Apps Script calls.

## K. HVCP production handover

- [ ] Obtain HVCP institutional email/contact for access—not password.
- [ ] Confirm Shared Drive availability.
- [ ] Create production resources under HVCP.
- [ ] Configure production Script Properties.
- [ ] HVCP authorizes Google scopes.
- [ ] HVCP creates production web-app deployment.
- [ ] Connect production Looker Studio.
- [ ] Production smoke test.
- [x] Administrator/operations runbook.
- [x] Technical maintainer quick command guide.
- [x] Role workflow documentation.
- [x] Release and rollback documentation.
- [x] Configuration/environment documentation.
- [x] Handover/source documentation.
- [ ] Add identity-review/merge procedure to final Admin guide.
- [ ] Encoder quick user guide based on final UI.
- [ ] Record final production deployment/version in internal handover record.
