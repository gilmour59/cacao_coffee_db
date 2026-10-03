# V1 Submission Payload Contract

This document defines the staged payload used by the Apps Script submission workflow.

The key rule is:

> Respondent/Encoder input is first stored as a **PENDING submission payload**. Canonical Farmer/Farm/Profile rows are only materialized after Validator approval.

## New farmer

```json
{
  "submission_type": "NEW_PROFILE",
  "reference_year": 2026,
  "farmer": {
    "rsbsa_registration_status": "REGISTERED_ID_AVAILABLE",
    "rsbsa_no": "example",
    "rsbsa_capture_method": "ID_OCR",
    "rsbsa_info_confirmed": true,
    "first_name": "Juan",
    "middle_name": "Santos",
    "last_name": "Dela Cruz",
    "suffix": "",
    "sex": "MALE",
    "marital_status_code": "MARRIED",
    "contact_no": "09171234567",
    "alternate_contact_no": "",
    "email": "",
    "association_name": "",
    "residence_province_code": "...",
    "residence_lgu_code": "...",
    "residence_barangay_code": "...",
    "residence_sitio_purok_zone": "Purok 3",
    "residence_street_road": "",
    "residence_house_lot_block": "",
    "residence_landmark_detail": ""
  },
  "farms": [
    {
      "farm_name_local_id": "",
      "tenure_code": "OWNED",
      "total_farm_area_ha": 2.0,
      "farm_address": "Sitio Example",
      "province_code": "...",
      "lgu_code": "...",
      "barangay_code": "...",
      "latitude": 10.7,
      "longitude": 122.5,
      "location_capture_method": "MAP_PIN",
      "topography_code": "HILLY",
      "road_distance_km": 1.5,
      "water_sources": [
        { "water_source_code": "SPRING", "is_primary": true }
      ],
      "crops": [
        {
          "commodity_code": "COFFEE",
          "trees_newly_planted": 25,
          "trees_non_bearing": 80,
          "trees_bearing": 300,
          "mortality_count": 8,
          "area_planted_ha": 1.2,
          "plantings": [
            { "variety_code": "COFFEE_ROBUSTA", "year_planted": 2021 }
          ],
          "production": [
            {
              "harvest_date": "2026-02-15",
              "production_year": 2026,
              "production_volume_kg": 450,
              "selling_price_per_kg": 130
            }
          ]
        }
      ]
    }
  ],
  "facilities": [],
  "interventions_received": [],
  "intervention_needs": []
}
```

## Existing farmer

The client does **not** choose the canonical farmer ID for a secure-link submission. The raw invitation token is resolved server-side and supplies:

- canonical `farmer_id`;
- reference year;
- purpose;
- optional target farm.

The client sends the editable profiling payload to:

```text
submitExistingFarmerProfile(token, payload)
```

For staff-assisted encoding, an authorized Encoder can call:

```text
submitEncoderProfile(payload)
```

## Staging and approval

```text
Input
  ↓
sanitize transient media
  ↓
validate payload
  ↓
identity + change/anomaly checks
  ↓
Submissions.status = PENDING
  ↓
Validator
  ├─ RETURNED → correct/resubmit
  └─ APPROVED
        ↓
        canonical Farmer/Farm/Profile rows
```

The staged payload intentionally stores no RSBSA ID image. Keys suggesting image/photo/base64/blob data are removed before the payload is serialized.

## Canonical write behavior

On approval:

- a genuinely new farmer receives a new `FMR-...` ID;
- a duplicate may be linked to an existing farmer only after Identity Review resolution;
- existing farmer non-identity master data may be updated after validation;
- protected name/RSBSA changes require explicit `IDENTITY_CORRECTION_APPROVED`;
- new farms receive a stable `FRM-...` ID;
- annual/expansion data creates a new `Profiling_Rounds` row;
- tree counts, mortality, and planted area are stored per commodity per farm in `Planting_Observations`;
- production is stored per harvest in kilograms with optional price/kg;
- previous approved profiling rounds are preserved.
