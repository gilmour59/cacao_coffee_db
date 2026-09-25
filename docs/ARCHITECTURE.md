# Architecture

## V1 objective

Deliver a low-cost, maintainable Coffee and Cacao Farmer Profiling and Information Management System that HVCP personnel can own after development without maintaining an in-house server.

## Logical architecture

```text
Farmer / LGU / HVCP Encoder
            │
            ▼
Google Apps Script Web App
HTML + JavaScript + Bulma + Alpine.js
Leaflet + OpenStreetMap
Tesseract.js OCR
            │
            │ google.script.run
            ▼
Google Apps Script Services
Validation / ID generation / duplicate checks
Reference loading / Sheet repository
            │
            ▼
Google Sheets
Operational data store
            │
            ├──────────────► Looker Studio
            │                Management dashboard
            │
            └──────────────► CSV/Excel exports
```

## Key architecture decisions

### Google Sheets is the V1 operational data store

The schema is normalized across multiple tabs rather than one giant row-per-farmer sheet. This improves maintainability and makes a future migration to PostgreSQL possible.

### Apps Script owns server-side business logic

The browser should make coarse-grained calls such as:

- load bootstrap/reference data once;
- check an RSBSA number;
- submit a farmer;
- submit a farm;
- submit a complete profile.

Avoid one Apps Script call per field.

### RSBSA OCR stays in the browser

When an RSBSA ID is available:

```text
Camera/file picker
    ↓
Browser memory
    ↓
Canvas preprocessing
    ↓
Tesseract.js OCR
    ↓
Extract candidate text
    ↓
User verifies/corrects
    ↓
Text values only are submitted
    ↓
Image object is discarded
```

No RSBSA ID image is stored in Google Sheets, Google Drive, GitHub, or Apps Script.

### Approximate farm points, not parcel polygons

V1 records one approximate farm location:

- Province (PSGC)
- Municipality/City (PSGC)
- Barangay (PSGC)
- Farm address/Sitio/Purok
- Latitude
- Longitude
- Capture method

The user selects the administrative location first, then places a pin on a Leaflet map.

### Reference data is controlled

Province, LGU, barangay, commodity, variety, topography, facility, intervention, and production-unit values come from reference sheets.

### Production ownership belongs to HVCP

The production Google Sheet, Apps Script project, deployment, and dashboard should be created/owned by the HVCP institutional Google account or Shared Drive.

## Environment configuration

Account-specific values belong in Apps Script Script Properties:

```text
ENVIRONMENT
DATABASE_SPREADSHEET_ID
PHOTO_FOLDER_ID          # reserved; not required for RSBSA images
APP_NAME
```

Do not commit real IDs, tokens, OAuth credentials, or production exports.

## Scaling principles

- Load reference data once per application session.
- Perform cascading location filtering in the browser.
- Batch Sheet reads/writes.
- Use LockService for ID generation and critical writes.
- Avoid scanning entire sheets repeatedly when indexes/cache maps can be built.
- Keep reporting calculations out of submission transactions where possible.
- Use a future repository abstraction to make Google Sheets replaceable by PostgreSQL.

## Future migration path

```text
V1
Apps Script HTML → Apps Script → Google Sheets

Possible Phase 2
React/TypeScript → Apps Script/API → Google Sheets

Long-term
React/TypeScript → API → PostgreSQL/PostGIS
```

The V1 data model intentionally uses stable IDs and normalized relationships to support this migration.
