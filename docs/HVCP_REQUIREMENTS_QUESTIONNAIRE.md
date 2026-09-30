# HVCP Coffee and Cacao Farmer Profiling System
## Requirements Clarification Questionnaire for MVP Development

**Target MVP Presentation:** October 22, 2026

This questionnaire is intended to confirm the remaining operational and data requirements needed to finalize the first version of the Coffee and Cacao Farmer Profiling and Information Management System.

---

## 1. Coverage

Should V1 cover:

- [ ] Entire Western Visayas
- [ ] Selected provinces/LGUs only

If selected only, please specify:

```text
____________________________________________________________
```

---

## 2. RSBSA

Should farmers who are **not yet registered in RSBSA** still be allowed to be profiled?

- [ ] Yes
- [ ] No

For registered farmers, should the **RSBSA number be mandatory**?

- [ ] Yes
- [ ] No

Can HVCP provide a **sample or anonymized RSBSA ID** for testing the ID scanner/OCR?

- [ ] Yes
- [ ] No

Is it acceptable for the system to:

1. use the RSBSA ID image temporarily for OCR;
2. allow the encoder/farmer to verify and correct the extracted text; and
3. save only the verified text, while **not storing the ID image**?

- [ ] Yes
- [ ] No

---

## 3. Required Farmer Information

Please mark the fields that must be mandatory before a farmer profile can be submitted:

- [ ] Farmer Name
- [ ] Sex/Gender
- [ ] Contact Number
- [ ] Residence Address
- [ ] RSBSA Number, when applicable
- [ ] Other: ____________________________________________

---

## 4. Farm Structure

Can one farmer have **more than one farm**?

- [ ] Yes
- [ ] No

Can one farm contain **both Coffee and Cacao**?

- [ ] Yes
- [ ] No

---

## 5. Coffee and Cacao Reference Lists

Please provide or confirm the official/current values for the following:

**Coffee varieties/types**

```text
____________________________________________________________
____________________________________________________________
```

**Cacao varieties/types**

```text
____________________________________________________________
____________________________________________________________
```

**Topography classifications**

```text
____________________________________________________________
____________________________________________________________
```

**Post-harvest facilities/equipment**

```text
____________________________________________________________
____________________________________________________________
```

**Assistance/interventions received**

```text
____________________________________________________________
____________________________________________________________
```

**Intervention needs**

```text
____________________________________________________________
____________________________________________________________
```

---

## 6. Production Data

What production unit should be used?

- [ ] Kilograms
- [ ] Metric tons
- [ ] Bags
- [ ] Other: ____________________________________________

How should production be recorded?

- [ ] Annual
- [ ] Per harvest
- [ ] Per season
- [ ] Other: ____________________________________________

Does HVCP need the **product form** recorded, such as fresh, dried, fermented, parchment, etc.?

- [ ] Yes
- [ ] No

If yes, please provide the required categories:

```text
____________________________________________________________
____________________________________________________________
```

---

## 7. Farm Location

Is an **approximate farm point on the map** sufficient for V1?

- [ ] Yes
- [ ] No

Is **parcel boundary mapping** required?

- [ ] Yes
- [ ] No

If additional GPS/location requirements apply, please specify:

```text
____________________________________________________________
```

---

## 8. User Roles and Validation

Current proposed roles:

- Encoder
- Validator
- Admin

Are these sufficient?

- [ ] Yes
- [ ] No

Additional role/s, if any:

```text
____________________________________________________________
```

Current proposed approval workflow:

```text
Encoder
   ↓
Validator
   ↓
Approved / Returned
```

Is this acceptable?

- [ ] Yes
- [ ] No

If no, please specify the required approval/validation flow:

```text
____________________________________________________________
____________________________________________________________
```

---

## 9. Who Will Use the System?

Please select all that apply:

- [ ] Regional HVCP staff
- [ ] Provincial staff
- [ ] LGU personnel
- [ ] Farmers
- [ ] Others: ____________________________________________

---

## 10. Production Ownership / Turnover

What institutional Google account or Shared Drive should own the final production system?

```text
____________________________________________________________
```

Will intended users have:

- [ ] DA/HVCP Google Workspace accounts
- [ ] Personal Gmail accounts
- [ ] Both

Who will be the designated **HVCP/Cacao focal person** for system administration and turnover?

**Name / Office:**

```text
____________________________________________________________
```

---

## 11. Dashboard / Reports

Please mark the indicators that should be prioritized in the dashboard:

- [ ] Number of farmers
- [ ] Coffee area
- [ ] Cacao area
- [ ] Bearing trees
- [ ] Non-bearing trees
- [ ] Newly planted trees
- [ ] Production
- [ ] Varieties
- [ ] Interventions received
- [ ] Intervention needs
- [ ] Farm location map
- [ ] Other: ____________________________________________

Should dashboard/reporting support filters by:

- [ ] Province
- [ ] Municipality/City
- [ ] Barangay
- [ ] Commodity
- [ ] Variety
- [ ] Year
- [ ] Other: ____________________________________________

Required export format/s:

- [ ] Excel/CSV
- [ ] PDF
- [ ] Both
- [ ] Other: ____________________________________________

---

## 12. Testing / User Acceptance

Can HVCP provide a few **dummy or anonymized farmer records** for system testing?

- [ ] Yes
- [ ] No

Who will participate in user acceptance testing before deployment?

```text
____________________________________________________________
____________________________________________________________
```

---

## Development Notes

The following design decisions are currently assumed unless HVCP requests otherwise:

- Google Apps Script + Google Sheets for V1
- Client-side RSBSA OCR using Tesseract.js
- No RSBSA ID image retention
- One farmer may have multiple farms
- Approximate farm point using Leaflet/OpenStreetMap
- PSA PSGC codes for Province → Municipality/City → Barangay
- TEST and PROD environments kept separate
- Production owned by HVCP/institutional account
- GitHub as source of truth for application code
- Human-approved production releases with versioned rollback

Any answer that differs from these assumptions should be reflected in the database schema, UI, workflow, or deployment configuration before final production release.
