# Project TODO

## Current status — 2026-10-05

**Active milestone:** TEST smoke testing of the first end-to-end single-farm vertical slice.

Completed/working in TEST:
- [x] TEST Google Sheet, Apps Script project, Script Properties, local clasp mapping, and push workflow.
- [x] Public/new-farmer single-farm intake UI with responsive mobile-first styling.
- [x] Manual RSBSA flow; OCR removed.
- [x] Exact and conservative near-duplicate RSBSA identity checks.
- [x] PENDING submission staging before canonical writes.
- [x] Double-submit safeguards in both client and server.
- [x] Human-readable Farmer review and Validator review; raw payload is TEST Admin/developer-only.
- [x] Validator Queue, Approve, Return, and Identity Review UI/backend are implemented.
- [x] Validator can void duplicate/spam submissions without hard-deleting the audit trail.
- [x] Canonical materialization services for Farmer, Farm, Profiling Round, Planting/Observation, Production, Facilities, Interventions, and Needs are implemented.
- [x] Change classification service exists for NEW_ENTRY, NO_CHANGE, MODIFICATION, EXPANSION, and ANOMALY.
- [x] Secure invitation backend exists for ANNUAL_PROFILE, EXPANSION_UPDATE, CORRECTION, and NEW_FARM.
- [x] PSGC pilot references loaded for Iloilo → Pototan → 50 barangays.

In progress now:
- [ ] Finish Smoke Test #12: approve `SUB-2026-000001` and verify canonical rows + Audit_Log.
- [ ] Run Return-for-Correction smoke test.
- [ ] Run exact/near-duplicate RSBSA tests.
- [ ] Test existing-farmer secure-link flow: annual profile, same-year correction, same-year expansion, and new-year round.
- [ ] Extend browser UI from one farm to multiple farms.
- [ ] Add staff-facing invitation generation/search/resend workflow.
- [ ] Add public endpoint rate/abuse protection.
- [ ] Prepare reporting/Looker Studio views.
- [ ] Run role-isolation, mobile, concurrency, and security UAT.
- [ ] Prepare PROD resources under HVCP ownership.


## A. Requirements and data model

- [x] Select Apps Script + Google Sheets for V1.
- [x] Define RSBSA registration states with manual number entry only; OCR removed from V1 to reduce capture/error risk.
- [x] Do not capture or retain RSBSA ID images.
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
- [x] Install/configure clasp locally.
- [x] Create TEST Apps Script project.
- [x] Add TEST script ID to local `.clasp.test.json`.
- [x] Verify TEST push/pull workflow.
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
- [x] Load the initial official PSGC pilot references: Iloilo → Pototan → 50 barangays.

## C. TEST Google Sheet / data model

- [x] Create TEST spreadsheet and initialize V1 sheet tabs/headers/reference values.
- [x] Add Farmers.
- [x] Add Farms.
- [x] Add Profiling_Rounds.
- [x] Add Plantings.
- [x] Add Planting_Observations.
- [x] Add Production.
- [x] Add Facilities.
- [x] Add Interventions.
- [x] Add Intervention_Needs.
- [x] Add Submissions.
- [x] Add Profiling_Invitations.
- [x] Add Identity_Reviews.
- [x] Add Users.
- [x] Add Audit_Log.
- [x] Add all V1 reference sheets, including Ref_Water_Sources.
- [x] Format IDs, PSGC codes, RSBSA/contact numbers, and related keys as Plain text.
- [ ] Protect system-generated and canonical identity columns.
- [ ] Expand PSGC reference data beyond the Pototan pilot when needed.
- [x] Load initial Coffee/Cacao, topography, water-source, tenure, marital-status, intervention, and production-unit references.

## D. Apps Script core

- [x] Configure Script Properties.
- [x] Implement repository helpers.
- [x] Implement batch reads/writes.
- [x] Implement ID generation under LockService.
- [ ] Implement standardized responses/errors.
- [x] Implement reference-data bootstrap.
- [x] Implement audit logging.
- [x] Implement role/authorization checks server-side.
- [x] Implement geographic-scope checks if required.
- [x] Ensure browser/client values cannot bypass server authorization.
- [x] Implement server-side identity/deduplication service.
- [x] Implement secure invitation token generation and hashing.
- [x] Implement invitation status/expiry/revocation handling.
- [ ] Use LockService for identity review resolution, canonical merges, and critical link/submission transitions.

## E. New farmer public intake

- [x] Public generic intake page for NEW farmers.
- [x] RSBSA registration-state selector.
- [x] Manual RSBSA entry.
- [x] Manual RSBSA number entry only; no ID image capture or OCR in V1.
- [x] User verification/edit step for manually entered RSBSA number.
- [x] Add conservative near-duplicate RSBSA detection for one-character typos or adjacent transpositions.
- [x] Capture farmer/farm/profile data.
- [x] Save as PENDING submission; do not immediately create an ACTIVE canonical farmer.
- [x] Run server-side duplicate detection before validation.
- [x] Never expose existing farmer candidate PII to public respondents.
- [ ] Add public endpoint rate/abuse protections.

## F. Existing farmer secure-link profiling

- [ ] Staff search/select approved existing farmer.
- [ ] Generate personalized profiling invitation.
- [ ] Link invitation to farmer_id + reference period + purpose.
- [ ] Purpose support: ANNUAL_PROFILE, EXPANSION_UPDATE, CORRECTION, NEW_FARM.
- [x] Store token hash rather than raw token where practical.
- [x] Support ACTIVE, SUBMITTED, RETURNED, EXPIRED, REVOKED statuses.
- [ ] Allow safe resume while ACTIVE.
- [ ] Lock/invalidate after final submission.
- [ ] Staff can resend/revoke/regenerate according to HVCP-approved policy.
- [x] Existing farmer link loads only the permitted farmer/profile context.
- [x] No username/password required for farmer V1.
- [ ] Encoder-assisted path available when farmer cannot use the link.

## G. Time-series profiling and farm changes

- [x] Create new Profiling_Round for each annual cycle.
- [ ] Additional Profiling_Round/event for expansion when required.
- [x] Preserve previous approved yearly values.
- [ ] Separate master-data correction from new time-series observation.
- [x] Commodity/variety/year planted.
- [x] Newly planted/non-bearing/bearing tree counts per commodity per farm.
- [x] Mortality count per commodity per farm, updateable during the active profiling period.
- [x] Area planted.
- [x] Per-harvest production volume in kg and selling price per kg.
- [x] Farmer-level facilities/equipment: free-text item, quantity, capacity, model/description, condition/status, utilization.
- [x] Farmer-level interventions received: Training, Planting Materials, Fertilizer + provider/source + year.
- [x] Farmer-level intervention needs using the same three categories + Low/Medium/High priority.
- [ ] New farm/expansion structural workflow.
- [x] Review screen and submit.

## H. Change detection, anomaly detection, and validation

- [x] Compare incoming submission to latest approved relevant record.
- [x] Classify NO_CHANGE.
- [x] Classify MODIFICATION.
- [x] Classify NEW_ENTRY.
- [x] Classify EXPANSION.
- [x] Classify ANOMALY.
- [x] Duplicate/RSBSA conflict flags.
- [x] Identity correction flags.
- [x] Farm-area change flags.
- [x] Tree-count change flags.
- [x] Production-change flags.
- [ ] New farm/commodity/variety flags.
- [ ] Thresholds/rules configurable and documented.
- [x] Anomaly flag must not auto-reject.
- [x] Validator sees prior vs submitted values and reasons.
- [x] Approve.
- [x] Return for correction.
- [ ] Confirm expansion/new farm.
- [x] Route identity/duplicate cases for additional review.
- [x] Protected identity corrections remain audited.
- [ ] Canonical duplicate merges remain Admin-controlled and non-destructive.

## I. Farm and location

- [x] Province dropdown.
- [x] Municipality/City cascading dropdown.
- [x] Barangay cascading dropdown.
- [x] Build client-side lookup maps.
- [x] Leaflet map.
- [x] Map pin selection.
- [x] Optional device-GPS button if feasible.
- [x] Save latitude/longitude.
- [x] Topography.
- [x] Road distance.
- [x] Source of water (multiple allowed): Shallow Well, Spring, River.

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
- [ ] Manual RSBSA entry and typo/transposition duplicate-detection tests.
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
- [ ] Confirm exact RSBSA number format from a privacy-safe sample when RSBSA coordination resumes; no OCR tuning is planned for V1.
- [ ] Revisit RSBSA parcel visualization/reference in the application after V1; do not build parcel digitizing/geotagging in the current MVP.
