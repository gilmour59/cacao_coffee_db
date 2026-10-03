# V1 Roadmap

Target presentation: **October 22, 2026**

The project follows a TEST → UAT → HVCP Production workflow.

## Phase 0 — Foundation — Sep 25–30

- [x] Select Google Apps Script + Google Sheets architecture.
- [x] Establish GitHub repository.
- [x] Define TEST and HVCP production ownership strategy.
- [x] Define PSGC Province → Municipality/City → Barangay references.
- [x] Include approximate farm point capture.
- [x] Keep parcel-boundary digitizing/geotagging out of V1; coordinate parcel-boundary data with RSBSA.
- [x] Include RSBSA status and client-side OCR in V1 scope.
- [x] Define permanent Farmer Master + time-series profiling model.
- [x] Finalize V1 farmer access model:
  - public generic intake link for new farmers;
  - personalized secure profiling link for existing farmers;
  - one secure link per farmer per profiling cycle/purpose;
  - yearly profiling with additional update when there is an expansion;
  - Encoder-assisted fallback.
- [x] Define backend change classifications: NO_CHANGE, MODIFICATION, NEW_ENTRY, EXPANSION, ANOMALY.
- [x] Confirm core operational questions with HVCP through the questionnaire and follow-up clarifications.
- [ ] Lock final V1 Google Sheets schema.
- [x] Confirm Coffee/Cacao varieties, topography, interventions, facility-detail approach, water sources, and kg production basis.
- [ ] Obtain a privacy-safe RSBSA ID sample for OCR tuning.

## Phase 1 — Core intake + secure-link infrastructure — Oct 1–5

- [ ] Create TEST Google Sheet.
- [ ] Create TEST Apps Script project.
- [ ] Configure clasp.
- [ ] Implement public NEW-farmer intake flow.
- [ ] Implement PENDING new-farmer submission state.
- [ ] Implement server-side duplicate/identity checks.
- [ ] Implement Profiling_Invitations.
- [ ] Implement secure random token generation + token-hash lookup.
- [ ] Implement ACTIVE / SUBMITTED / RETURNED / EXPIRED / REVOKED invitation states.
- [ ] Implement staff link generation/resend/revoke actions.
- [ ] Implement Encoder-assisted intake path.
- [ ] Implement farm registration, PSGC cascading dropdowns, and approximate map pin.

Milestone: **New farmer public intake and existing farmer personalized link can both reach a valid pending submission safely.**

## Phase 2 — Time-series Coffee/Cacao profiling — Oct 6–10

- [ ] Implement Profiling_Rounds.
- [ ] Create a new annual observation instead of overwriting previous-year values.
- [ ] Support expansion/update profiling events.
- [ ] Commodity and variety selection.
- [ ] Year planted.
- [ ] Newly planted, non-bearing, bearing, and mortality counts per commodity per farm.
- [ ] Area planted.
- [ ] Per-harvest production records in kg, including selling price per kg.
- [ ] Farmer-level post-harvest facility/equipment details with utilization.
- [ ] Assistance/interventions received.
- [ ] Intervention needs.
- [ ] Source of water.
- [ ] Review screen.

Milestone: **A farmer can accumulate multiple approved yearly profiling records while preserving history.**

## Phase 3 — OCR + change/anomaly + validation — Oct 11–14

- [ ] Camera/file capture via mobile file input.
- [ ] Client-side image preprocessing.
- [ ] Tesseract.js OCR.
- [ ] Extract RSBSA number and farmer name.
- [ ] User verification screen.
- [ ] Ensure source image is not uploaded or retained.
- [ ] Compare current submission with latest approved record.
- [ ] Classify NO_CHANGE / MODIFICATION / NEW_ENTRY / EXPANSION / ANOMALY.
- [ ] Flag duplicate/RSBSA conflicts.
- [ ] Flag identity corrections.
- [ ] Flag significant farm-area/tree-count/production changes.
- [ ] Validator sees previous vs submitted values and reasons.
- [ ] Approve / Return / Confirm Expansion / Route Identity Review.
- [ ] Audit log.

Milestone: **Validator can safely distinguish routine annual change from expansion, correction, duplicate risk, and anomaly.**

## Phase 4 — Dashboard/reporting — Oct 15–16

- [ ] Prepare flattened reporting views.
- [ ] Connect Looker Studio.
- [ ] Farmer totals based on canonical active farmers.
- [ ] Coffee/Cacao area.
- [ ] Tree counts by year.
- [ ] Production by year.
- [ ] Province/Municipality/Barangay filters.
- [ ] Variety/year filters.
- [ ] RSBSA registration indicators.
- [ ] Farm point map.
- [ ] Intervention-needs summaries.
- [ ] Optional annual change/expansion indicators.
- [ ] Export-friendly views.

## Phase 5 — UAT + security testing — Oct 17–18

- [ ] Public new-farmer intake test.
- [ ] Personalized link test.
- [ ] Invalid/expired/revoked/tampered link tests.
- [ ] Reuse-after-submit test.
- [ ] Returned-correction flow.
- [ ] Wrong farmer/context access test.
- [ ] Duplicate/RSBSA typo/collision tests.
- [ ] Annual time-series preservation test.
- [ ] Expansion workflow test.
- [ ] Anomaly classification test.
- [ ] Encoder-assisted audit test.
- [ ] Android/mobile browser testing.
- [ ] Desktop browser testing.
- [ ] Slow-network testing.
- [ ] Concurrent submission tests.
- [ ] OCR tests with sample images.
- [ ] Map and PSGC validation.
- [ ] Realistic demo dataset.

## Feature freeze — Oct 19

No new major features after feature freeze. Only migration, defects, data/reference corrections, security fixes, and presentation-critical changes.

## Phase 6 — HVCP production migration — Oct 19–20

- [ ] HVCP creates/owns production resources.
- [ ] Create production Google Sheet structure.
- [ ] Create production Apps Script project.
- [ ] Configure Script Properties.
- [ ] HVCP authorizes required scopes.
- [ ] HVCP creates production web-app deployment.
- [ ] Connect production Looker Studio dashboard.
- [ ] Configure authorized staff roles for link generation/validation.

## Phase 7 — Final verification — Oct 20–21

- [ ] Production smoke test.
- [ ] Test public new-farmer link.
- [ ] Test personalized existing-farmer link.
- [ ] Test Encoder-assisted path.
- [ ] Test Validator workflow.
- [ ] Test anomaly/change display.
- [ ] Demo rehearsal.
- [ ] Final administrator/encoder guides.

## Oct 22 — Presentation

Demonstrate:

```text
NEW FARMER
Public Intake Link
      ↓
Duplicate / Identity Check
      ↓
Validator
      ↓
Approved Farmer + First Profiling Record

EXISTING FARMER
Personalized Secure Link
      ↓
Annual / Expansion Profiling
      ↓
Compare with Prior Approved Record
      ↓
Normal Change / Expansion / Anomaly
      ↓
Validator
      ↓
New Approved Time-Series Record
      ↓
Google Sheets
      ↓
Regional Dashboard
```
