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

The system intentionally uses only two environments:

```text
GitHub main
   ├── TEST Apps Script → TEST Google Sheet
   └── PROD Apps Script → HVCP Google Sheet
```

Development and testing may initially happen under the developer's Google account. Production is recreated/deployed under HVCP ownership after UAT.

Environment-specific IDs and settings are stored in Apps Script Script Properties and local clasp project files. They must never be hard-coded into the application source.

## Maintenance and CI/CD philosophy

The turnover workflow is intentionally simple:

```text
Change source
    ↓
GitHub main
    ↓
TEST push
    ↓
human verification
    ↓
immutable Apps Script version
    ↓
update existing PROD deployment
    ↓
same production URL
```

Production is **not automatically deployed from GitHub**. An authorized maintainer deliberately promotes a tested version. This keeps the process understandable and reduces credential/automation overhead for HVCP/Cacao staff.

The project pins `@google/clasp` in `package.json` and provides short npm commands for TEST, PROD, releases, and rollback.

See:

- [Operations and Handover Runbook](docs/OPERATIONS_RUNBOOK.md)
- [Quick Command Reference](docs/QUICK_COMMANDS.md)
- [Release and Rollback Guide](docs/RELEASE_AND_ROLLBACK.md)
- [Configuration and Environments](docs/CONFIGURATION_AND_ENVIRONMENTS.md)
- [Role Workflows](docs/ROLE_WORKFLOWS.md)
- [Secure Link Profiling Flow](docs/SECURE_LINK_PROFILING_FLOW.md)
- [Profiling Swimlane Diagrams](docs/PROFILING_SWIMLANE.md)
- [HVCP Requirements Questionnaire](docs/HVCP_REQUIREMENTS_QUESTIONNAIRE.md)

## Repository structure

```text
.
├── README.md
├── package.json
├── .gitignore
├── .clasp.json.example
├── .clasp.test.json.example
├── .clasp.prod.json.example
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── LOCATION_REFERENCE.md
│   ├── RSBSA_OCR.md
│   ├── ROADMAP.md
│   ├── TODO.md
│   ├── MIGRATION_TO_HVCP.md
│   ├── OPERATIONS_RUNBOOK.md
│   ├── ROLE_WORKFLOWS.md
│   ├── HVCP_REQUIREMENTS_QUESTIONNAIRE.md
│   ├── CONFIGURATION_AND_ENVIRONMENTS.md
│   ├── RELEASE_AND_ROLLBACK.md
│   └── QUICK_COMMANDS.md
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

## Important operations rules

1. **GitHub `main` is the source of truth.**
2. **TEST before PROD.**
3. **Keep TEST and PROD databases separate.**
4. **Do not request or share the HVCP Google password.**
5. **HVCP owns the final production Apps Script deployment and Google Sheet.**
6. **Use the existing production deployment ID for updates so the live URL stays unchanged.**
7. **Use Apps Script versions for rollback.**
8. **Reference-data-only changes normally do not require a code deployment.**
9. **Back up the production Sheet before schema-changing releases.**
10. **Never store RSBSA ID photos.**

## Status

Project foundation and V1 data model are being established. See [docs/ROADMAP.md](docs/ROADMAP.md) and [docs/TODO.md](docs/TODO.md).
