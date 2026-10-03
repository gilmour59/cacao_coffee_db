# HVCP Requirements Decisions

Last updated: 2026-10-03

This document records the decisions confirmed from the HVCP requirements questionnaire and follow-up clarifications. It is the business-rule source of truth for the V1 schema unless a later HVCP instruction supersedes it.

## Confirmed V1 decisions

### Farmer and access
- New farmers use the public intake link.
- Existing farmers use one personalized secure link per farmer per profiling cycle/purpose.
- Encoder-assisted profiling is allowed.
- All new, annual, and expansion submissions go through Validator review.
- Updates to approved records are validated again.
- Approved yearly records are preserved as history.
- Submission outcomes for V1 are Approved or Returned; no separate Rejected status is required.
- Personalized links may be generated/resend/revoked by Data Administrator, Validator, or authorized Encoder.
- Link validity runs until the end of the profiling period unless revoked.
- Returned submissions may either reuse the same secure link or receive a new correction link.

### Farmer profile
- Name is stored as First Name, Middle Name, Last Name, and Suffix.
- Sex values: Male, Female.
- Marital status values: Single, Married, Widowed, Separated, Other.
- Include email address and alternate contact number.
- Include cooperative/registered-association membership information.
- Residence address is structured:
  Province → Municipality/City → Barangay → Sitio/Purok/Zone → Street/Road → House/Lot/Block → Landmark/additional detail.

### Farm
- One farmer may have multiple farms.
- One farm may contain both Coffee and Cacao.
- Include farm name/local identifier.
- Include ownership/tenure.
- Tenure values: Owned, Leased/Rented, Tenanted, Usufruct, Family-owned. No Other value for V1.
- Store total farm area separately from Coffee/Cacao planted area.
- Area unit: hectare (ha).
- Capture approximate farm point using either device GPS or map pin.
- Road-access distance is in kilometers.

### Parcel boundary
- Do not build parcel-boundary drawing, GPS walking, or geotagging as a V1 feature.
- Parcel/geospatial boundary data will be coordinated with RSBSA as an external data source.
- Any later parcel integration should use RSBSA-provided identifiers/data rather than asking farmers/encoders to digitize boundaries.

### Coffee/Cacao crop data
- A farm may contain multiple varieties.
- Initial Coffee varieties: Robusta, Native.
- Initial Cacao varieties: BR25, UF18, K1, K2.
- Tree counts are recorded separately per commodity per farm.
- Tree-count fields: newly planted (<1 year), non-bearing, bearing, mortality.
- Mortality means the current number of dead/mortality trees during the profiling period.
- Mortality is separate for Coffee and Cacao and may be updated during the active profiling period.
- Expansion is based on additional area and/or newly planted trees.
- Profiling is yearly, with additional update when expansion occurs.

### Production
- Production is recorded per commodity per farm.
- Production is recorded per harvest.
- Production volume uses kilograms (kg).
- Price sold per kilo is captured with the harvest record.
- No product-form reference list is locked for V1 unless HVCP later supplies one.
- Historical/multi-year production is retained.

### Source of water
- A farm may have multiple water sources.
- Controlled values for V1:
  - Shallow Well
  - Spring
  - River

### Topography
- Controlled values for V1:
  - Hilly
  - Semi-Rolling

### Facilities / equipment
- Do not use facility/equipment categories in V1.
- Capture free-text facility/equipment details when present.
- Include quantity, capacity, model/description, condition/status, and utilization.
- An explicit None state is allowed when there is no facility/equipment.

### Interventions
- Use one controlled list for both interventions received and interventions needed:
  - Training
  - Planting Materials
  - Fertilizer
- Interventions received record provider/source and year received.
- Intervention needs use priority: Low, Medium, High.
- Facilities, interventions received, and intervention needs are recorded once per farmer, not per farm.

### Reporting
- Dashboard includes farmer counts, Coffee/Cacao area, tree counts, production, varieties, interventions received, intervention needs, and farm map.
- Filters: Province, Municipality/City, Barangay, Commodity, Variety, Year.
- Export: Excel/CSV and PDF.

### Production ownership
- The DA HVCDP Coffee and Cacao Staff email/account will be used for production ownership.

## Open policy item

### Private-sector data requests
No formal policy has been set yet for private-sector access or copies of the data.

Until a formal HVCP/DA policy is approved:
- do not provide private-sector direct access to the operational farmer database;
- do not expose farmer PII by default;
- treat any external distribution/export behavior as a future policy-controlled requirement.
