# Coffee and Cacao Farmer Profiling and Information Management System

A mobile-first Google Apps Script + Google Sheets MVP for the High Value Crops Program (HVCP), designed for farmer profiling, farm geolocation, coffee/cacao production data collection, validation, and management reporting.

## V1 target

Working MVP for the October 22, 2026 presentation.

### Core workflow

1. Capture farmer identity and RSBSA status.
2. If an RSBSA ID is available, allow temporary client-side image capture and OCR.
3. Show extracted RSBSA information for user verification.
4. Do **not** store the RSBSA ID image.
5. Support manual RSBSA number entry when the ID is unavailable.
6. Allow profiling of farmers who are not yet RSBSA-registered.
7. Register one or more farms for a farmer.
8. Select Province → Municipality/City → Barangay using PSA PSGC reference codes.
9. Let the encoder place an approximate farm point on a map and save latitude/longitude.
10. Capture coffee/cacao planting, tree counts, area, production, facilities, interventions, and intervention needs.
11. Submit for validation.
12. Use Google Sheets as the operational data store and Looker Studio for management dashboards.

## Technology stack

- **Frontend:** Apps Script HTML Service, HTML5, JavaScript, Bulma, Alpine.js
- **Maps:** Leaflet + OpenStreetMap
- **OCR:** Tesseract.js in the browser; source image is discarded after verification
- **Backend:** Google Apps Script
- **Operational data store:** Google Sheets
- **Dashboard:** Looker Studio
- **Source control:** GitHub + clasp
- **Production ownership:** HVCP institutional Google account or Shared Drive

## Environment strategy

Development and testing happen under the developer's Google account. Production will be recreated/deployed under the HVCP account after UAT.

```text
GitHub source
   ├── TEST Apps Script → TEST Google Sheet
   └── PROD Apps Script → HVCP Google Sheet
```

Environment-specific IDs and settings must be stored in Apps Script Properties and must never be committed to GitHub.

## Repository structure

```text
.
├── README.md
├── .gitignore
├── .clasp.json.example
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── LOCATION_REFERENCE.md
│   ├── RSBSA_OCR.md
│   ├── ROADMAP.md
│   ├── TODO.md
│   └── MIGRATION_TO_HVCP.md
└── src/
    ├── appsscript.json
    ├── Code.gs
    ├── Config.gs
    ├── SheetRepository.gs
    ├── ReferenceService.gs
    ├── IdService.gs
    ├── ValidationService.gs
    ├── FarmerService.gs
    ├── FarmService.gs
    ├── Index.html
    ├── Styles.html
    └── Scripts.html
```

## Important data rule

This repository must contain **source code and documentation only**. Never commit real farmer records, RSBSA ID images, contact details, addresses, GPS coordinates, OAuth credentials, tokens, API keys, or production exports.

## Status

Project foundation and V1 data model are being established. See [docs/ROADMAP.md](docs/ROADMAP.md) and [docs/TODO.md](docs/TODO.md).
