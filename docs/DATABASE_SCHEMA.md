# V1 Google Sheets Data Model

This document is the baseline schema for the October 2026 MVP.

Google Sheets is used as the operational data store, but the structure is intentionally relational so it can later migrate to PostgreSQL.

## General rules

- IDs and PSGC codes are **Plain text**.
- Dates use `YYYY-MM-DD`.
- Timestamps use ISO-style date/time where practical.
- Boolean fields use `TRUE/FALSE`.
- Do not use row number as an identifier.
- Do not store RSBSA ID images.
- Do not delete historical reference rows solely because a code becomes inactive.
- Application writes should use headers, not hard-coded column numbers.
- Candidate duplicate matching is server-side; public/respondent views must not receive other farmers' PII.
- Fuzzy similarity is a review signal, never proof of identity.
- Farmer merges must preserve the source record and audit trail.

## ID formats

| Entity | Example |
|---|---|
| Farmer | FMR-2026-000001 |
| Farm | FRM-2026-000001 |
| Planting | PLT-2026-000001 |
| Production | PRD-2026-000001 |
| Facility | FAC-2026-000001 |
| Intervention received | INT-2026-000001 |
| Intervention need | NED-2026-000001 |
| Submission | SUB-2026-000001 |
| Audit log | AUD-2026-000001 |
| Identity review | IDR-2026-000001 |

RSBSA numbers are external identifiers and must **not** replace `farmer_id`.

---

# Transaction sheets

## Farmers

One row per farmer.

| Column | Type | Required | Notes |
|---|---|---:|---|
| farmer_id | text | yes | Internal stable ID |
| rsbsa_registration_status | enum | yes | REGISTERED_ID_AVAILABLE, REGISTERED_NO_ID, NOT_REGISTERED |
| rsbsa_no | text | conditional | Required when registered |
| rsbsa_capture_method | enum | yes | ID_OCR, MANUAL, NOT_APPLICABLE |
| rsbsa_info_confirmed | boolean | yes | User confirmed RSBSA-derived/manual info |
| first_name | text | yes | |
| middle_name | text | no | |
| last_name | text | yes | |
| suffix | text | no | Jr., Sr., III, etc. |
| sex | enum | yes | MALE, FEMALE |
| marital_status_code | text | yes | FK → Ref_Marital_Status |
| contact_no | text | yes | Store as text |
| alternate_contact_no | text | no | Store as text |
| email | text | no | |
| association_name | text | no | Cooperative or registered association membership, when applicable |
| residence_province_code | text | yes | PSGC FK → Ref_Provinces |
| residence_lgu_code | text | yes | PSGC FK → Ref_LGUs |
| residence_barangay_code | text | yes | PSGC FK → Ref_Barangays |
| residence_sitio_purok_zone | text | no | |
| residence_street_road | text | no | |
| residence_house_lot_block | text | no | |
| residence_landmark_detail | text | no | Additional local address detail |
| created_from_submission_id | text | no | Initial intake submission |
| merged_into_farmer_id | text | no | Canonical farmer when this record has been merged |
| record_status | enum | yes | PENDING, ACTIVE, INACTIVE, MERGED |
| created_at | timestamp | yes | |
| created_by | text | no | Email/user ID where available |
| updated_at | timestamp | yes | |
| updated_by | text | no | |

### Identity and duplicate rules

1. `farmer_id` is the canonical internal identity; RSBSA remains an external identifier.
2. Exact normalized `rsbsa_no` is a strong signal but must be corroborated before it is treated as a confirmed identity.
3. Similar name/contact/location combinations may create duplicate-review candidates but must never auto-link or auto-merge.
4. A public/self-service respondent must never receive a candidate list or another farmer's PII.
5. An authenticated Encoder may use strong matches only after secondary confirmation and within authorized scope.
6. Ambiguous matches create an `Identity_Reviews` record for Validator review.
7. Protected identity corrections and canonical merges are role-restricted and audited.
8. A merged farmer is retained with `record_status=MERGED` and `merged_into_farmer_id`; it is not physically deleted.

See `FARMER_IDENTITY_AND_DEDUPLICATION.md`.

---

## Farms

One farmer may have multiple farms.

| Column | Type | Required | Notes |
|---|---|---:|---|
| farm_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| submission_id | text | no | Submission that created this farm |
| farm_name_local_id | text | no | Farm name or local identifier |
| tenure_code | text | yes | FK → Ref_Tenure |
| total_farm_area_ha | decimal | yes | Total farm area, separate from commodity planted area |
| farm_address | text | yes | Sitio/Purok/local description |
| province_code | text | yes | PSGC FK → Ref_Provinces |
| lgu_code | text | yes | PSGC FK → Ref_LGUs |
| barangay_code | text | yes | PSGC FK → Ref_Barangays |
| latitude | decimal | yes | Approximate farm point |
| longitude | decimal | yes | Approximate farm point |
| location_capture_method | enum | yes | MAP_PIN or DEVICE_GPS |
| topography_code | text | yes | FK → Ref_Topographies |
| road_distance_km | decimal | yes | Distance of farm area to road access |
| remarks | text | no | |
| record_status | enum | yes | ACTIVE, INACTIVE |
| created_at | timestamp | yes | |
| created_by | text | no | |
| updated_at | timestamp | yes | |
| updated_by | text | no | |

The latitude/longitude point is for approximate spatial orientation only.

Parcel-boundary drawing/GPS-walking is **not a V1 feature**. Parcel/geospatial boundary data will be coordinated with RSBSA as an external data source and may be linked later through RSBSA-provided identifiers/data.

---

## Farm_Water_Sources

Source of water is a required farm profiling input. It is modeled as a repeatable controlled value so the system can support either one primary source or multiple sources without redesigning the database.

| Column | Type | Required | Notes |
|---|---|---:|---|
| farm_water_source_id | text | yes | Stable internal ID |
| farm_id | text | yes | FK → Farms |
| submission_id | text | no | Submission/profile event that supplied the value |
| water_source_code | text | yes | FK → Ref_Water_Sources |
| is_primary | boolean | no | Useful if HVCP permits multiple sources |
| remarks | text | no | Optional details |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

A farm may report multiple water sources. V1 controlled values are Shallow Well, Spring, and River.

---

## Plantings

A farm may contain multiple coffee/cacao plantings or varieties.

| Column | Type | Required | Notes |
|---|---|---:|---|
| planting_id | text | yes | Stable internal ID |
| farm_id | text | yes | FK → Farms |
| submission_id | text | no | |
| commodity_code | text | yes | COFFEE or CACAO in V1 |
| variety_code | text | yes | FK → Ref_Varieties |
| year_planted | integer/year | yes | |
| remarks | text | no | |
| record_status | enum | yes | ACTIVE, INACTIVE |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

Tree counts are time-varying and are stored in `Planting_Observations` per commodity per farm and profiling round, not on the stable Plantings master row.

---

## Profiling_Rounds

One row per farmer/farm profiling event.

| Column | Type | Required | Notes |
|---|---|---:|---|
| profiling_round_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| farm_id | text | yes | FK → Farms |
| submission_id | text | yes | FK → Submissions |
| reference_year | integer/year | yes | |
| profiling_type | enum | yes | ANNUAL_PROFILE, EXPANSION_UPDATE, CORRECTION |
| profiling_date | date | yes | |
| status | enum | yes | PENDING, APPROVED, RETURNED |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

Approved prior rounds are preserved as history.

---

## Planting_Observations

Yearly/current-period Coffee/Cacao tree and planted-area observations.

| Column | Type | Required | Notes |
|---|---|---:|---|
| observation_id | text | yes | Stable internal ID |
| profiling_round_id | text | yes | FK → Profiling_Rounds |
| farm_id | text | yes | FK → Farms |
| commodity_code | text | yes | COFFEE or CACAO |
| trees_newly_planted | integer | yes | Less than 1 year |
| trees_non_bearing | integer | yes | |
| trees_bearing | integer | yes | |
| mortality_count | integer | yes | Current number of dead/mortality trees during the profiling period |
| area_planted_ha | decimal | yes | Commodity planted area in hectares |
| updated_at | timestamp | yes | Allows current-period updates before approval |

Tree counts and mortality are recorded separately per commodity per farm.

---

## Production

Production is time-varying and is recorded per commodity per farm and per harvest.

| Column | Type | Required | Notes |
|---|---|---:|---|
| production_id | text | yes | Stable internal ID |
| profiling_round_id | text | yes | FK → Profiling_Rounds |
| farm_id | text | yes | FK → Farms |
| commodity_code | text | yes | COFFEE or CACAO |
| submission_id | text | no | |
| harvest_date | date | no | Use when exact harvest date is available |
| production_year | integer/year | yes | Reporting/history year |
| production_volume_kg | decimal | yes | Volume in kilograms |
| selling_price_per_kg | decimal | no | Price sold per kilogram when available |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

No product-form reference list is locked for V1 unless HVCP later supplies one.

---

## Facilities

Repeatable farmer-level existing post-harvest facility/equipment records. V1 does not use controlled facility/equipment categories.

| Column | Type | Required | Notes |
|---|---|---:|---|
| facility_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| submission_id | text | no | |
| description | text | yes | Free-text facility/equipment name/details |
| quantity | integer | no | |
| capacity | text | no | Capacity/value + unit as supplied |
| model_description | text | no | Model or additional description |
| condition_status | text | no | Condition/status |
| utilization_status | enum | no | FULLY_UTILIZED, PARTIALLY_UTILIZED, NOT_UTILIZED |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

If a farmer has no facility/equipment, the UI should allow an explicit **None** state.

---

## Interventions

Assistance/interventions already received.

| Column | Type | Required | Notes |
|---|---|---:|---|
| intervention_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| submission_id | text | no | |
| intervention_type_code | text | yes | FK → Ref_Intervention_Types |
| provider | text | no | DA/LGU/other |
| year_received | integer/year | no | |
| details | text | no | |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

---

## Intervention_Needs

Requested/needed interventions.

| Column | Type | Required | Notes |
|---|---|---:|---|
| need_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| submission_id | text | no | |
| intervention_type_code | text | yes | FK → Ref_Intervention_Types |
| priority | enum | yes | LOW, MEDIUM, HIGH |
| details | text | no | |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

---

## Submissions

Tracks the validation state of one intake/update package.

| Column | Type | Required | Notes |
|---|---|---:|---|
| submission_id | text | yes | Stable internal ID |
| farmer_id | text | no | May be assigned after farmer creation |
| submission_type | enum | yes | NEW_PROFILE, UPDATE_PROFILE, ADD_FARM, etc. |
| status | enum | yes | DRAFT, PENDING, APPROVED, RETURNED |
| submitted_at | timestamp | no | |
| submitted_by | text | no | |
| validated_at | timestamp | no | |
| validated_by | text | no | |
| validation_remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

This sheet lets validation happen at submission-package level rather than trying to approve individual cells.

---

## Identity_Reviews

Tracks ambiguous identity matches, typo/correction requests, and duplicate-resolution decisions.

| Column | Type | Required | Notes |
|---|---|---:|---|
| identity_review_id | text | yes | Stable ID, e.g. IDR-2026-000001 |
| submission_id | text | yes | FK → Submissions |
| subject_farmer_id | text | no | Pending/current farmer being reviewed |
| candidate_farmer_id | text | no | Existing possible canonical farmer |
| match_tier | enum | yes | STRONG, POSSIBLE, WEAK |
| match_reasons | text | yes | Human-readable reasons, not just a numeric score |
| review_status | enum | yes | PENDING, IN_REVIEW, RESOLVED |
| resolution | enum | no | LINK_TO_EXISTING, CREATE_NEW, CONFIRMED_DIFFERENT, IDENTITY_CORRECTION_APPROVED, MERGE_REQUIRED, MERGED |
| requested_by | text | no | User/email when available |
| resolved_by | text | no | Validator/Admin |
| resolved_at | timestamp | no | |
| resolution_notes | text | no | Required for protected correction/merge |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

Public/self-service users must never receive candidate PII from this sheet. Duplicate-resolution and merge operations are server-side and role-restricted.

---

## Users

Application authorization/reference list for managed access.

| Column | Type | Required | Notes |
|---|---|---:|---|
| user_email | text | yes | Primary lookup |
| full_name | text | yes | |
| role | enum | yes | ADMIN, VALIDATOR, ENCODER |
| province_code | text | no | Optional scope |
| lgu_code | text | no | Optional scope |
| is_active | boolean | yes | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

Final authentication behavior depends on how the HVCP production web app is deployed.

---

## Audit_Log

Append-only important action history.

| Column | Type | Required | Notes |
|---|---|---:|---|
| audit_id | text | yes | Stable ID |
| actor | text | no | Email/user ID |
| action | text | yes | CREATE, UPDATE, APPROVE, RETURN, etc. |
| entity_type | text | yes | FARMER, FARM, SUBMISSION, etc. |
| entity_id | text | yes | |
| details_json | text | no | Compact change/context JSON |
| created_at | timestamp | yes | |

---

# Reference sheets

## Ref_Provinces

`province_code, province_name, region_code, is_active, sort_order, valid_from, valid_to, source_version`

## Ref_LGUs

`lgu_code, province_code, lgu_name, lgu_type, is_active, sort_order, valid_from, valid_to, replaced_by_code, source_version`

## Ref_Barangays

`barangay_code, lgu_code, province_code, barangay_name, urban_rural, is_active, sort_order, valid_from, valid_to, replaced_by_code, source_version`

See `LOCATION_REFERENCE.md`.

## Ref_Commodities

| commodity_code | commodity_name | is_active | sort_order |
|---|---|---:|---:|
| COFFEE | Coffee | TRUE | 1 |
| CACAO | Cacao | TRUE | 2 |

## Ref_Varieties

`variety_code, commodity_code, variety_name, is_active, sort_order`

Initial V1 values:
- Coffee: Robusta, Native
- Cacao: BR25, UF18, K1, K2

An explicit OTHER value may be supported only where the approved workflow allows Other + specify.

## Ref_Topographies

`topography_code, topography_name, is_active, sort_order`

V1 values:
- HILLY — Hilly
- SEMI_ROLLING — Semi-Rolling

## Ref_Intervention_Types

`intervention_type_code, intervention_type_name, is_active, sort_order`

V1 values used for both interventions received and intervention needs:
- TRAINING — Training
- PLANTING_MATERIALS — Planting Materials
- FERTILIZER — Fertilizer

Do not hard-code the labels directly in client JavaScript; load them from reference data.

## Ref_Production_Units

`unit_code, unit_name, unit_symbol, is_active, sort_order`

V1 production volume unit is kilograms (kg).

## Ref_Tenure

`tenure_code, tenure_name, is_active, sort_order`

V1 values:
- OWNED — Owned
- LEASED_RENTED — Leased/Rented
- TENANTED — Tenanted
- USUFRUCT — Usufruct
- FAMILY_OWNED — Family-owned

No OTHER value is used for V1.

## Ref_Marital_Status

`marital_status_code, marital_status_name, is_active, sort_order`

V1 values:
- SINGLE — Single
- MARRIED — Married
- WIDOWED — Widowed
- SEPARATED — Separated
- OTHER — Other

## Ref_Water_Sources

`water_source_code, water_source_name, is_active, sort_order`

V1 values:
- SHALLOW_WELL — Shallow Well
- SPRING — Spring
- RIVER — River

---

# Minimum HVCP fields covered

The schema includes all current requested collection fields:

- Name of farmer
- Gender
- Contact details
- Alternate contact number and email
- Marital status
- Cooperative/registered-association membership
- Residence address
- Farm address
- Municipality/City
- Province
- Barangay (added)
- Approximate latitude/longitude (added)
- Farm name/local identifier
- Farm tenure
- Total farm area
- Year planted
- Variety
- Newly planted trees / less than 1 year
- Non-bearing trees
- Bearing trees
- Mortality count
- Total area planted
- Volume of production per harvest in kg
- Selling price per kg
- Topography
- Assistance/intervention received
- Existing post-harvest facility/equipment
- Distance of farm area to road access (km)
- Source of water
- Interventions needed
- RSBSA status/number and verification flow (added)

