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
| sex | text/ref | yes | Final values to be confirmed with HVCP |
| contact_no | text | yes | Store as text |
| residence_address | text | yes | Residential address |
| created_from_submission_id | text | no | Initial intake submission |
| record_status | enum | yes | ACTIVE, INACTIVE, MERGED |
| created_at | timestamp | yes | |
| created_by | text | no | Email/user ID where available |
| updated_at | timestamp | yes | |
| updated_by | text | no | |

### Duplicate rules

1. Exact normalized `rsbsa_no` match → strong duplicate warning.
2. No RSBSA number → soft warning using name + contact/location where possible.
3. Duplicate warning must allow authorized review/correction rather than blindly discarding the submission.

---

## Farms

One farmer may have multiple farms.

| Column | Type | Required | Notes |
|---|---|---:|---|
| farm_id | text | yes | Stable internal ID |
| farmer_id | text | yes | FK → Farmers |
| submission_id | text | no | Submission that created this farm |
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

The latitude/longitude point is for approximate spatial orientation only and is not a parcel boundary.

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
| trees_newly_planted | integer | yes | Less than 1 year |
| trees_non_bearing | integer | yes | |
| trees_bearing | integer | yes | |
| area_planted_ha | decimal | yes | Hectares |
| remarks | text | no | |
| record_status | enum | yes | ACTIVE, INACTIVE |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

`total_trees` is derived:

```text
trees_newly_planted + trees_non_bearing + trees_bearing
```

Do not require a separate stored total unless reporting performance later justifies it.

---

## Production

Production is time-varying and must not be stored as a single permanent field on the farmer/farm.

| Column | Type | Required | Notes |
|---|---|---:|---|
| production_id | text | yes | Stable internal ID |
| planting_id | text | yes | FK → Plantings |
| submission_id | text | no | |
| production_year | integer/year | yes | |
| production_volume | decimal | yes | |
| production_unit_code | text | yes | FK → Ref_Production_Units |
| product_form | text/ref | no | e.g. fresh/dried form if HVCP requires |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

HVCP must confirm the exact production basis/unit expected for Coffee and Cacao.

---

## Facilities

Repeatable existing post-harvest facility/equipment records.

| Column | Type | Required | Notes |
|---|---|---:|---|
| facility_id | text | yes | Stable internal ID |
| farm_id | text | yes | FK → Farms |
| submission_id | text | no | |
| facility_type_code | text | yes | FK → Ref_Facility_Types |
| description | text | no | Details/model/capacity if relevant |
| quantity | integer | no | |
| remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

If a farmer has no facility/equipment, the UI should allow an explicit **None** state rather than forcing a fake record.

---

## Interventions

Assistance/interventions already received.

| Column | Type | Required | Notes |
|---|---|---:|---|
| intervention_id | text | yes | Stable internal ID |
| farm_id | text | yes | FK → Farms |
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
| farm_id | text | yes | FK → Farms |
| submission_id | text | no | |
| intervention_type_code | text | yes | FK → Ref_Intervention_Types |
| priority | enum | no | LOW, MEDIUM, HIGH if HVCP wants prioritization |
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
| status | enum | yes | DRAFT, PENDING, APPROVED, RETURNED, REJECTED |
| submitted_at | timestamp | no | |
| submitted_by | text | no | |
| validated_at | timestamp | no | |
| validated_by | text | no | |
| validation_remarks | text | no | |
| created_at | timestamp | yes | |
| updated_at | timestamp | yes | |

This sheet lets validation happen at submission-package level rather than trying to approve individual cells.

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

HVCP should confirm the official/current list. Include an explicit OTHER option only if the workflow captures the corresponding free-text detail.

## Ref_Topographies

`topography_code, topography_name, is_active, sort_order`

Values require HVCP confirmation.

## Ref_Intervention_Types

`intervention_type_code, intervention_type_name, is_active, sort_order`

Do not hard-code intervention choices in JavaScript.

## Ref_Facility_Types

`facility_type_code, facility_type_name, is_active, sort_order`

Do not hard-code facility/equipment choices in JavaScript.

## Ref_Production_Units

`unit_code, unit_name, unit_symbol, is_active, sort_order`

HVCP must confirm whether production should be recorded in kg, metric tons, or another commodity-specific basis.

---

# Minimum HVCP fields covered

The schema includes all current requested collection fields:

- Name of farmer
- Gender
- Contact details
- Residence address
- Farm address
- Municipality/City
- Province
- Barangay (added)
- Approximate latitude/longitude (added)
- Year planted
- Variety
- Newly planted trees / less than 1 year
- Non-bearing trees
- Bearing trees
- Total area planted
- Volume of production
- Topography
- Assistance/intervention received
- Existing post-harvest facility/equipment
- Distance of farm area to road access (km)
- Interventions needed
- RSBSA status/number and verification flow (added)

