# HVCP Requirements-to-Schema Coverage Map

This internal planning document maps the HVCP questionnaire to the V1 data model. It is not intended as a staff-facing questionnaire.

## Purpose

Use questionnaire responses to confirm operational inputs and relational structure before freezing the MVP schema.

| Data model area | Questionnaire coverage | Key decisions obtained |
|---|---|---|
| Farmers | Sections 2, 3, 13, 14 | RSBSA rules, name structure, sex/gender values, required identity/contact fields, duplicate behavior, return-user verification |
| Farms | Sections 4, 7, 13 | multi-farm support, farm address/location behavior, topography, road distance, map/GPS capture |
| Plantings | Sections 4, 5, 13 | Coffee/Cacao coexistence, multiple varieties, year planted, tree-count groups, area unit |
| Production | Sections 6, 13 | unit, reporting basis, product form, granularity, multi-year history |
| Facilities | Sections 5, 13 | facility categories, quantity/capacity/details, explicit None, farmer-vs-farm ownership |
| Interventions received | Sections 5, 13 | intervention categories, provider/source, year received, farmer-vs-farm ownership |
| Intervention needs | Sections 5, 13 | categories, priority, farmer-vs-farm ownership |
| Submissions | Sections 8, 13, 14 | validation flow, revalidation after updates, Rejected status, identity-correction/duplicate-review routing |
| Users | Sections 8, 9, 10, 13, 14 | roles, intended users, account types, farmer direct-access model, geographic access scope, production focal, correction/merge authority |
| Audit Log | Sections 13, 14 | change/validation history plus protected identity correction and merge accountability |
| Identity Reviews | Sections 13, 14 | possible-duplicate review, return-user linkage, correction approval, merge decision |
| Reference tables | Sections 5, 6, 13 | varieties, topography, intervention types, facility types, production units, sex/gender values |
| Dashboard/reporting | Section 11 | KPIs, filters, export requirements |
| UAT/turnover | Sections 10, 12 | owner account/Shared Drive, focal person, sample data, UAT participants |

## System-generated fields that do not require HVCP questionnaire decisions

The following remain implementation responsibilities and should not be presented to staff as business questions:

- internal stable IDs such as `farmer_id`, `farm_id`, and `planting_id`;
- foreign-key relationships;
- `created_at`, `updated_at`, `created_by`, and `updated_by`;
- audit IDs and internal action codes;
- PSGC codes stored as plain text;
- normalized RSBSA values and internal capture-method codes;
- Apps Script environment properties;
- GitHub/clasp deployment configuration.

## Schema review after questionnaire

After HVCP responses are received:

1. compare every answer against `DATABASE_SCHEMA.md`;
2. change field required/optional rules;
3. finalize reference lists;
4. finalize table granularity for Production, Facilities, and Interventions;
5. finalize validation states and user scopes;
6. record any schema deltas before TEST Sheet creation;
7. keep stable IDs and timestamps even if they are not visible to field encoders;
8. preserve historical/time-varying records where HVCP confirms recurring annual updates.

## Future data warehouse readiness

The normalized operational model is intended to feed a future DA data warehouse. Stable IDs, PSGC codes, commodity/variety references, year-based production records, validation status, timestamps, and retained history should be preserved so the data can later be transformed into analytical dimensions and fact tables without redesigning the collection system.
