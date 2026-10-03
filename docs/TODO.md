# Project TODO

## A. Requirements and data model

- [x] Select Apps Script + Google Sheets for V1.
- [x] Define RSBSA states and client-side OCR direction.
- [x] Do not retain RSBSA ID images.
- [x] Use PSGC Province → Municipality/City → Barangay references.
- [x] Add approximate farm latitude/longitude.
- [x] Define permanent Farmer Master + Farm Master + time-series profiling direction.
- [x] Finalize V1 farmer access model: public intake link for new farmers; personalized secure links for existing farmers.
- [x] Define one secure link = one farmer + one profiling cycle/purpose.
- [x] Define annual profiling with additional update when there is an expansion.
- [x] Preserve previous approved yearly observations rather than overwriting them.
- [x] Define backend change classifications: NO_CHANGE, MODIFICATION, NEW_ENTRY, EXPANSION, ANOMALY.
- [x] Define secure deduplication and identity-review rules.
- [x] Review final operational workflow with HVCP.
- [x] All new/annual/expansion submissions require Validator review.
- [x] Data Administrator, Validator, and authorized Encoder may generate/resend/revoke personalized profiling links.
- [x] Link delivery may use SMS/text, Messenger, email, or assisted staff delivery.
- [x] Links remain valid until end of profiling period unless revoked; returned submissions may reuse the same link or receive a new correction link.
- [x] Expansion means additional area and/or newly planted trees.
- [ ] Private-sector data access/export policy remains TBD; do not implement direct external access until formal policy exists.
- [x] Coffee varieties: Robusta, Native.
- [x] Cacao varieties: BR25, UF18, K1, K2.
- [x] Topography: Hilly, Semi-Rolling.
- [x] Intervention types: Training, Planting Materials, Fertilizer.
- [x] No controlled facility/equipment categories in V1; capture free-text details plus utilization.
- [x] Production volume is per harvest in kilograms; capture selling price per kg. No product-form list is locked for V1.
- [ ] Confirm which fields are mandatory vs optional.
- [x] Source of water is a required farm input.
- [x] One farm may have multiple water sources.
- [x] Water sources: Shallow Well, Spring, River.
- [x] Use structured residence address: Province → Municipality/City → Barangay + local address detail.
- [x] Residence local details: Sitio/Purok/Zone, Street/Road, House/Lot/Block, Landmark/additional detail.
- [x] Add email, alternate contact, cooperative/registered-association membership, tenure, total farm area, and farm name/local ID.
- [x] Store total farm area separately from Coffee/Cacao planted area.
- [x] Tree counts are per commodity per farm.
- [x] Use kg as the V1 production volume unit; no separate product-form list is locked.
- [ ] Confirm policy for `Other + specify` on controlled reference lists.
- [x] Preserve approved historical yearly records except through audited correction.
- [x] Development team may propose initial anomaly thresholds for HVCP review/UAT.
- [x] Unavailable profiling values may use None/N/A where appropriate.

## B. Repository and local development

- [x] Initialize GitHub repository.
- [x] Add architecture/roadmap/schema docs.
- [x] Add TEST/PROD clasp configuration templates.
- [x] Pin clasp and add simple npm maintenance commands.
- [x] Document environment, role, release, rollback, and turnover procedures.
- [x] Document secure identity/deduplication rules.
- [x] Document secure link-based profiling flow.
- [x] Add profiling swimlane documentation.
- [ ] Install/configure clasp locally.
- [ ] Create TEST Apps Script project.
- [ ] Add TEST script ID to local `.clasp.test.json`.
- [ ] Verify TEST push/pull workflow.
- [ ] Create PROD clasp mapping after HVCP production project exists.

## B1. V1 domain-flow restructure

- [x] Create non-destructive schema bootstrap for V1 sheets and core reference data.
- [x] Stage respondent/Encoder input in Submissions before canonical writes.
- [x] Disable direct public canonical Farmer/Farm creation.
- [x] Add secure Profiling_Invitations with hashed bearer tokens.
- [x] Add server-side staff roles and geographic-scope checks.
- [x] Add identity/duplicate review service without exposing candidate PII publicly.
- [x] Add protected identity-correction review path.
- [x] Add Validator pending-list, review, Approve, and Return workflow.
- [x] Materialize canonical Farmer/Farm/Profile rows only after approval.
- [x] Add Profiling_Rounds and commodity-per-farm Planting_Observations.
- [x] Add per-harvest kg production + price/kg materialization.
- [x] Add farmer-level facilities, interventions received, and intervention needs.
- [x] Add change/expansion/anomaly comparison service.
- [x] Add append-only audit events for critical workflow actions.
- [x] Wire the browser UI to the new staged-submission APIs for the first single-farm vertical slice.
- [x] Build Validator UI for pending review, identity-resolution, Approve, and Return.
- [ ] Run Apps Script TEST deployment smoke tests against the new schema.
- [ ] Extend the UI from the first single-farm vertical slice to add/manage multiple farms in one farmer profiling cycle.
- [ ] Add public-endpoint rate/abuse protection before production deployment.
- [ ] Load the required PSGC location reference data into TEST.

## C. TEST Google Sheet / data model

- [x] Create TEST spreadsheet and initialize V1 sheet tabs/headers/reference values.
- [ ] Add Farmers.
- [ ] Add Farms.
- [ ] Add Profiling_Rounds.
- [ ] Add Plantings.
- [ ] Add Planting_Observations or equivalent time-bound planting snapshot structure.
- [ ] Add Production.
- [ ] Add Facilities / facility observations as finalized.
- [ ] Add Interventions.
- [ ] Add Intervention_Needs.
- [ ] Add Submissions.
- [ ] Add Profiling_Invitations.
- [ ] Add Identity_Reviews.
- [ ] Add Users.
- [ ] Add Audit_Log.
- [ ] Add all reference sheets, including Ref_Water_Sources.
- [ ] Format IDs/PSGC codes as Plain text.
- [ ] Protect system-generated and canonical identity columns.
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
- [ ] Implement geographic-scope checks if required.
- [ ] Ensure browser/client values cannot bypass server authorization.
- [ ] Implement server-side identity/deduplication service.
- [ ] Implement secure invitation token generation and hashing.
- [ ] Implement invitation status/expiry/revocation handling.
- [ ] Use LockService for identity review resolution, canonical merges, and critical link/submission transitions.

## E. New farmer public intake

- [ ] Public generic intake page for NEW farmers.
- [ ] RSBSA registration-state selector.
- [ ] Manual RSBSA entry.
- [ ] Mobile image capture/file picker.
- [ ] Browser Canvas preprocessing.
- [ ] Tesseract.js OCR.
- [ ] Parse RSBSA number and farmer name.
- [ ] User verification/edit step.
- [ ] Confirm image is never uploaded/retained.
- [ ] Capture farmer/farm/profile data.
- [ ] Save as PENDING submission; do not immediately create an ACTIVE canonical farmer.
- [ ] Run server-side duplicate detection before validation.
- [ ] Never expose existing farmer candidate PII to public respondents.
- [ ] Add public endpoint rate/abuse protections.

## F. Existing farmer secure-link profiling

- [ ] Staff search/select approved existing farmer.
- [ ] Generate personalized profiling invitation.
- [ ] Link invitation to farmer_id + reference period + purpose.
- [ ] Purpose support: ANNUAL_PROFILE, EXPANSION_UPDATE, CORRECTION, NEW_FARM.
- [ ] Store token hash rather than raw token where practical.
- [ ] Support ACTIVE, SUBMITTED, RETURNED, EXPIRED, REVOKED statuses.
- [ ] Allow safe resume while ACTIVE.
- [ ] Lock/invalidate after final submission.
- [ ] Staff can resend/revoke/regenerate according to HVCP-approved policy.
- [ ] Existing farmer link loads only the permitted farmer/profile context.
- [ ] No username/password required for farmer V1.
- [ ] Encoder-assisted path available when farmer cannot use the link.

## G. Time-series profiling and farm changes

- [ ] Create new Profiling_Round for each annual cycle.
- [ ] Additional Profiling_Round/event for expansion when required.
- [ ] Preserve previous approved yearly values.
- [ ] Separate master-data correction from new time-series observation.
- [ ] Commodity/variety/year planted.
- [ ] Newly planted/non-bearing/bearing tree counts per commodity per farm.
- [ ] Mortality count per commodity per farm, updateable during the active profiling period.
- [ ] Area planted.
- [ ] Per-harvest production volume in kg and selling price per kg.
- [ ] Farmer-level facilities/equipment: free-text item, quantity, capacity, model/description, condition/status, utilization.
- [ ] Farmer-level interventions received: Training, Planting Materials, Fertilizer + provider/source + year.
- [ ] Farmer-level intervention needs using the same three categories + Low/Medium/High priority.
- [ ] New farm/expansion structural workflow.
- [ ] Review screen and submit.

## H. Change detection, anomaly detection, and validation

- [ ] Compare incoming submission to latest approved relevant record.
- [ ] Classify NO_CHANGE.
- [ ] Classify MODIFICATION.
- [ ] Classify NEW_ENTRY.
- [ ] Classify EXPANSION.
- [ ] Classify ANOMALY.
- [ ] Duplicate/RSBSA conflict flags.
- [ ] Identity correction flags.
- [ ] Farm-area change flags.
- [ ] Tree-count change flags.
- [ ] Production-change flags.
- [ ] New farm/commodity/variety flags.
- [ ] Thresholds/rules configurable and documented.
- [ ] Anomaly flag must not auto-reject.
- [ ] Validator sees prior vs submitted values and reasons.
- [ ] Approve.
- [ ] Return for correction.
- [ ] Confirm expansion/new farm.
- [ ] Route identity/duplicate cases for additional review.
- [ ] Protected identity corrections remain audited.
- [ ] Canonical duplicate merges remain Admin-controlled and non-destructive.

## I. Farm and location

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
- [ ] Source of water (multiple allowed): Shallow Well, Spring, River.

## J. Dashboard/reporting

- [ ] Flattened reporting views.
- [ ] Looker Studio connection.
- [ ] Canonical active farmer totals.
- [ ] Coffee/Cacao area.
- [ ] Tree counts by reference year.
- [ ] Production by reference year.
- [ ] Province/LGU/Barangay filters.
- [ ] Variety and year filters.
- [ ] Farm-point map.
- [ ] Intervention-needs summaries.
- [ ] Annual/change/expansion indicators where useful.
- [ ] Export-friendly view.
- [ ] Do not expose RSBSA, phone, precise address, token data, or unnecessary PII.

## K. Testing

- [ ] New-farmer public intake.
- [ ] Existing-farmer secure invitation.
- [ ] Invalid/expired/revoked token.
- [ ] Token tampering / guessed IDs.
- [ ] Reuse after submission.
- [ ] Returned-correction access.
- [ ] Wrong farmer cannot access another farmer's link/context.
- [ ] Duplicate RSBSA.
- [ ] RSBSA typo/collision.
- [ ] Same-name different-farmer cases.
- [ ] Annual time-series preservation.
- [ ] Expansion flow.
- [ ] Normal modification vs anomaly classification.
- [ ] Large area/tree/production changes.
- [ ] Encoder-assisted submission audit.
- [ ] Concurrent submissions/link actions.
- [ ] Mobile Android.
- [ ] Desktop.
- [ ] Slow network.
- [ ] Invalid/blank inputs.
- [ ] OCR lighting/large-image/manual-correction tests.
- [ ] PSGC/map accuracy.
- [ ] Sheet write collision tests.
- [ ] Direct Apps Script authorization-bypass tests.

## L. HVCP production handover

- [ ] Obtain HVCP institutional contact/access—not password.
- [ ] Confirm Shared Drive availability.
- [ ] Create production resources under HVCP.
- [ ] Configure production Script Properties.
- [ ] HVCP authorizes required Google scopes.
- [ ] HVCP creates production web-app deployment.
- [ ] Connect production Looker Studio.
- [ ] Production smoke test.
- [x] Administrator/operations runbook.
- [x] Technical maintainer command guide.
- [x] Role workflow documentation.
- [x] Release and rollback documentation.
- [x] Configuration/environment documentation.
- [ ] Admin guide for generating/revoking links and reviewing anomalies.
- [ ] Encoder quick user guide based on final UI.
- [ ] Record final production deployment/version.


## M. Backlog / Post-V1

- [ ] Coordinate with RSBSA on parcel/geospatial boundary data availability, identifiers, format, and update process.
- [ ] Define future parcel-data integration once RSBSA coordination is completed.
- [ ] Confirm exact RSBSA number format from a privacy-safe sample ID for OCR tuning when coordination resumes.
- [ ] Revisit RSBSA parcel visualization/reference in the application after V1; do not build parcel digitizing/geotagging in the current MVP.
