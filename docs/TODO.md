# Project TODO

## A. Requirements and data model

- [x] Select Apps Script + Google Sheets for V1.
- [x] Add RSBSA registration states.
- [x] Make RSBSA OCR mandatory in V1 when an ID is available.
- [x] Do not retain RSBSA ID images.
- [x] Add PSGC Province → Municipality/City → Barangay references.
- [x] Add approximate farm latitude/longitude via map pin.
- [x] Draft complete V1 schema.
- [ ] Review schema with HVCP.
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
- [x] Add clasp configuration example.
- [ ] Install/configure clasp locally.
- [ ] Create TEST Apps Script project.
- [ ] Add TEST script ID to local .clasp.json only.
- [ ] Verify push/pull workflow.

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
- [ ] Add Users.
- [ ] Add Audit_Log.
- [ ] Add all reference sheets.
- [ ] Format PSGC/ID columns as Plain text.
- [ ] Protect system/ID columns.
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

## E. Farmer + RSBSA

- [ ] RSBSA registration-state selector.
- [ ] Manual RSBSA entry.
- [ ] Normalize RSBSA numbers.
- [ ] Exact RSBSA duplicate lookup.
- [ ] Mobile image capture/file picker.
- [ ] Browser Canvas preprocessing.
- [ ] Tesseract.js OCR.
- [ ] Parse RSBSA number.
- [ ] Parse farmer name.
- [ ] User verification/edit screen.
- [ ] Confirm image is never uploaded/retained.
- [ ] Save farmer.
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
- [ ] Approve.
- [ ] Return for correction.
- [ ] Reject if required by HVCP.
- [ ] Validator remarks.
- [ ] Audit trail.

## I. Dashboard/reporting

- [ ] Flattened reporting view(s).
- [ ] Looker Studio connection.
- [ ] Farmer totals.
- [ ] RSBSA registration indicators.
- [ ] Coffee/Cacao area.
- [ ] Tree counts.
- [ ] Production.
- [ ] Province/LGU/Barangay filters.
- [ ] Variety filters.
- [ ] Farm-point map.
- [ ] Intervention-needs summaries.
- [ ] Export-friendly view.

## J. Testing

- [ ] Mobile Android.
- [ ] Desktop.
- [ ] Slow network.
- [ ] Invalid/blank inputs.
- [ ] Duplicate RSBSA.
- [ ] Concurrent submissions.
- [ ] OCR under different lighting.
- [ ] Large image OCR performance.
- [ ] Incorrect OCR/manual correction.
- [ ] PSGC cascading accuracy.
- [ ] Map coordinates.
- [ ] Sheet write collision tests.

## K. HVCP production handover

- [ ] Obtain HVCP institutional email/contact for access—not password.
- [ ] Confirm Shared Drive availability.
- [ ] Create production resources under HVCP.
- [ ] Configure production Script Properties.
- [ ] HVCP authorizes Google scopes.
- [ ] HVCP creates production web-app deployment.
- [ ] Connect production Looker Studio.
- [ ] Production smoke test.
- [ ] Administrator guide.
- [ ] Encoder quick guide.
- [ ] Handover/source documentation.
