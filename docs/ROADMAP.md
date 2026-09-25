# V1 Roadmap

Target presentation: **October 22, 2026**

The project follows a TEST → UAT → HVCP Production workflow.

## Phase 0 — Foundation — Sep 25–28

- [x] Select Google Apps Script + Google Sheets architecture.
- [x] Establish GitHub repository.
- [x] Define TEST and HVCP production ownership strategy.
- [x] Define Province → Municipality/City → Barangay reference model using PSGC codes.
- [x] Include approximate farm point using latitude/longitude.
- [x] Include RSBSA status and client-side OCR in V1 scope.
- [ ] Lock complete V1 Google Sheets schema.
- [ ] Confirm Coffee/Cacao varieties and intervention/facility reference values with HVCP.
- [ ] Obtain a privacy-safe sample of the actual RSBSA ID layout for OCR tuning.

## Phase 1 — Core registry — Sep 29–Oct 4

- [ ] Create TEST Google Sheet.
- [ ] Create Apps Script TEST project.
- [ ] Configure clasp.
- [ ] Implement farmer registration.
- [ ] Implement RSBSA status flow.
- [ ] Implement RSBSA duplicate detection.
- [ ] Implement farm registration.
- [ ] Implement PSGC cascading dropdowns.
- [ ] Implement approximate map pin capture.

Milestone: **Farmer → Farm → Location can be saved end-to-end.**

## Phase 2 — Coffee/Cacao profiling — Oct 5–9

- [ ] Commodity and variety selection.
- [ ] Year planted.
- [ ] Newly planted, non-bearing, and bearing tree counts.
- [ ] Area planted.
- [ ] Production records.
- [ ] Existing post-harvest facilities/equipment.
- [ ] Assistance/interventions received.
- [ ] Intervention needs.

Milestone: **Complete HVCP minimum profiling requirements can be submitted.**

## Phase 3 — OCR + validation workflow — Oct 10–13

- [ ] Camera/file capture via mobile file input.
- [ ] Client-side image preprocessing.
- [ ] Tesseract.js OCR.
- [ ] Extract RSBSA number and farmer name.
- [ ] User verification screen.
- [ ] Ensure source image is not uploaded or retained.
- [ ] Pending/Approved/Returned workflow.
- [ ] Validator view and remarks.
- [ ] Audit log.

Milestone: **RSBSA-assisted registration and validation work on mobile.**

## Phase 4 — Dashboard/reporting — Oct 14–16

- [ ] Prepare flattened reporting views.
- [ ] Connect Looker Studio.
- [ ] Farmer totals.
- [ ] Coffee/Cacao area.
- [ ] Tree counts.
- [ ] Production.
- [ ] Province/Municipality/Barangay filters.
- [ ] RSBSA registration/verification indicators.
- [ ] Farm point map.
- [ ] Export-friendly views.

## Phase 5 — UAT — Oct 17–18

- [ ] Android/mobile browser testing.
- [ ] Desktop browser testing.
- [ ] Slow-network testing.
- [ ] Invalid/blank input testing.
- [ ] Duplicate RSBSA testing.
- [ ] Concurrent submission testing.
- [ ] OCR testing with multiple sample images.
- [ ] Map and PSGC validation.
- [ ] Realistic demo dataset.

## Feature freeze — Oct 19

No new major features after feature freeze. Only migration, defects, data/reference corrections, and presentation-critical fixes.

## Phase 6 — HVCP production migration — Oct 19–20

- [ ] HVCP creates/owns production resources.
- [ ] Create production Google Sheet structure.
- [ ] Create production Apps Script project.
- [ ] Configure Script Properties.
- [ ] HVCP authorizes required scopes.
- [ ] HVCP creates production web-app deployment.
- [ ] Connect production Looker Studio dashboard.

## Phase 7 — Final verification — Oct 20–21

- [ ] Production smoke test.
- [ ] Test using HVCP account.
- [ ] Test encoder access.
- [ ] Demo rehearsal.
- [ ] Final administrator/encoder guides.

## Oct 22 — Presentation

Demonstrate:

```text
RSBSA/Farmer
    ↓
Farm + PSGC Location + Map Pin
    ↓
Coffee/Cacao Profile
    ↓
Production + Facilities + Interventions
    ↓
Review / Submit
    ↓
Validation
    ↓
Google Sheets
    ↓
Regional Dashboard
```
