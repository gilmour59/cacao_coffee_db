# HVCP Coffee and Cacao Farmer Profiling System
## Requirements Clarification Questionnaire for MVP Development

**Target MVP Presentation:** October 22, 2026

This questionnaire is intended to confirm the remaining operational, data-capture, validation, reporting, and record-structure requirements needed to finalize the first version of the Coffee and Cacao Farmer Profiling and Information Management System.

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

Please provide or confirm the official/current values for:

- Coffee varieties/types
- Cacao varieties/types
- Topography classifications
- Post-harvest facilities/equipment categories
- Assistance/interventions received categories
- Intervention needs categories

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

## 13. Additional Data Capture and Record Structure

These questions confirm how HVCP wants farmer, farm, planting, production, facility, intervention, user-access, and update records organized.

### Farmer details

How should the farmer's name be recorded?

- [ ] Separate fields: First Name, Middle Name, Last Name, Suffix
- [ ] One Full Name field only
- [ ] Other: ____________________________________________

What official Sex/Gender choices should be available?

```text
____________________________________________________________
```

### Planting and crop profile

Should the following all be captured for each Coffee/Cacao planting?

- variety
- year planted
- newly planted trees (less than 1 year)
- non-bearing trees
- bearing trees
- area planted

- [ ] Yes, capture all of them
- [ ] No, some should be changed or removed

If any should be changed, removed, or added:

```text
____________________________________________________________
```

What unit should be used for area planted?

- [ ] Hectares (ha)
- [ ] Square meters (m²)
- [ ] Other: ____________________________________________

Can one farm have multiple varieties of Coffee and/or multiple varieties of Cacao?

- [ ] Yes
- [ ] No

### Production history and level of detail

How should production be recorded in relation to the farm?

- [ ] Per variety/planting
- [ ] Per commodity per farm
- [ ] Total per farmer
- [ ] Other: ____________________________________________

Should the system keep production records for multiple years?

- [ ] Keep multiple years / historical production
- [ ] Current reporting year only
- [ ] Other: ____________________________________________

### Facilities and equipment

Which additional facility/equipment details should be recorded?

- [ ] Quantity
- [ ] Capacity
- [ ] Model/Description
- [ ] Condition/Status
- [ ] No additional details needed
- [ ] Other: ____________________________________________

Should the system allow an explicit **None** when a farmer/farm has no post-harvest facility or equipment?

- [ ] Yes
- [ ] No

### Interventions

For assistance/interventions already received, should the system record:

- [ ] Both provider/source and year received
- [ ] Provider/source only
- [ ] Year received only
- [ ] Neither

Should intervention needs have a priority level?

- [ ] Yes — Low / Medium / High
- [ ] Yes — another priority scale
- [ ] No priority level needed

If another priority scale is preferred:

```text
____________________________________________________________
```

Should facilities, interventions received, and intervention needs be recorded:

- [ ] Per farm
- [ ] Once per farmer
- [ ] It depends on the item/type
- [ ] Other: ____________________________________________

### Farm access and location capture

Should distance from the farm area to road access be recorded in kilometers?

- [ ] Yes, kilometers (km)
- [ ] No, use another unit
- [ ] This field is not needed

Should encoders be allowed to use device GPS in addition to manually placing the farm point on the map?

- [ ] Yes — allow both device GPS and map pin
- [ ] Map pin only
- [ ] Device GPS only

### Duplicate, update, and validation behavior

If an RSBSA number already exists in the system, what should happen?

- [ ] Show the existing farmer record and allow authorized review/update
- [ ] Block creation of another record
- [ ] Allow a new record but flag it as a possible duplicate
- [ ] Other: ____________________________________________

After a profile has been approved, should later updates go through validation again?

- [ ] Yes, updates should be validated again
- [ ] No, authorized users may update approved records directly
- [ ] Other: ____________________________________________

Should the validation workflow include a separate **Rejected** status?

- [ ] Approved / Returned only
- [ ] Include Rejected
- [ ] Other: ____________________________________________

### User access and record history

Should user access be limited by assigned geographic area?

- [ ] Yes — restrict by Province and/or Municipality/City
- [ ] No — authorized users may access all Region VI records
- [ ] Depends on the user role
- [ ] Other: ____________________________________________

Should the system retain a history/audit trail of important profile changes and validation actions?

- [ ] Yes
- [ ] No
- [ ] Not sure / please recommend

Will the same farmer/farm profile be updated over succeeding years?

- [ ] Updated regularly over succeeding years
- [ ] One-time profiling only
- [ ] Not yet decided
- [ ] Other: ____________________________________________

---

The technical implementation details such as internal IDs, timestamps, foreign keys, audit IDs, PSGC storage rules, and system-generated fields are intentionally **not asked of HVCP respondents**. They will be derived from the confirmed operational answers and maintained in the technical data model.


---

## 14. Recommended V1 Farmer Profiling and Identity Workflow

**Recommended V1 workflow for HVCP review**

1. The farmer provides information to an authorized Encoder.
2. Before creating a new farmer, the Encoder/system checks whether a matching farmer already exists.
3. RSBSA, name, contact, and location may be used to detect possible matches.
4. A strong match still requires secondary confirmation before an existing profile is used.
5. If the match is uncertain, the farmer is **not shown other farmer records**. The case goes to a Validator for review.
6. The Validator decides whether to link the submission to an existing farmer, create a new farmer, or return it for correction.
7. Confirmed duplicate-record merges or protected identity corrections are handled only by an authorized Data Administrator and are recorded in the audit trail.

This approach is intended to reduce duplicate records, prevent accidental access to another farmer's profile, and preserve correction history.

Do you agree with the recommended V1 farmer profiling and identity workflow described above?

- [ ] Yes — adopt the recommended workflow
- [ ] Yes, but with revisions
- [ ] No — use a different workflow

If revisions or a different workflow are preferred, please describe them:

```text
____________________________________________________________
____________________________________________________________
```

How will farmers normally use the system?

- [ ] Farmers provide information to an authorized Encoder; farmers do not directly access existing profiles
- [ ] Farmers may submit data themselves, but should not directly view an existing profile
- [ ] Farmers should be able to securely return and view/update their existing profile
- [ ] Combination of the above
- [ ] Other: ____________________________________________

If farmers should be able to view/update an existing profile directly, what approved verification method is available?

- [ ] Verified mobile number / OTP
- [ ] Authenticated Google/DA account
- [ ] Assisted verification by authorized staff
- [ ] No mechanism decided yet
- [ ] Other: ____________________________________________

Before an existing farmer profile is opened or linked, which information should be used as secondary confirmation in addition to the RSBSA number?

- [ ] Farmer name
- [ ] Contact number
- [ ] Residence/farm location
- [ ] RSBSA ID presented during assisted profiling
- [ ] Other: ____________________________________________

Who should approve corrections to key identity information such as an RSBSA number or farmer name after the profile has already been approved?

- [ ] Validator
- [ ] Data Administrator
- [ ] Encoder may propose; Validator/Admin must approve
- [ ] Other: ____________________________________________

Who should be authorized to merge two farmer records confirmed to represent the same person?

- [ ] Data Administrator only
- [ ] Validator or Data Administrator
- [ ] Other: ____________________________________________
