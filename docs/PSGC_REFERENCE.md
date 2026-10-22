# PSGC Reference Data

The application stores official PSA 10-digit Philippine Standard Geographic Codes as text.

## TEST pilot scope

The initial TEST data is limited to the confirmed Pototan pilot:

```text
Region VI (Western Visayas)
  → Iloilo
      → Pototan
          → 50 barangays
```

Source used for the TEST reference rows:

- https://psa.gov.ph/classification/psgc/provinces/0600000000
- https://psa.gov.ph/classification/psgc/citimuni/0603000000
- https://psa.gov.ph/classification/psgc/barangays/0603037000

The TEST rows use the PSA publication/version label `PSGC 2026-06-30`.

## Expansion rule

Do not invent or manually assign PSGC codes. When the application expands beyond the Pototan pilot, load the required official PSA reference rows into:

- `Ref_Provinces`
- `Ref_LGUs`
- `Ref_Barangays`

Version or deactivate changed references rather than deleting historical codes.
