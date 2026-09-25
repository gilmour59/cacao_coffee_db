# RSBSA Intake and OCR

RSBSA-assisted intake is a V1 feature.

## Registration states

```text
REGISTERED_ID_AVAILABLE
REGISTERED_NO_ID
NOT_REGISTERED
```

### Registered — ID available

1. User chooses/takes an RSBSA ID image using a mobile file input.
2. The image remains in browser memory.
3. Resize/crop/preprocess with Canvas.
4. Run Tesseract.js OCR locally in the browser.
5. Extract candidate RSBSA number and farmer name.
6. Show extracted values in editable fields.
7. User verifies/corrects the information.
8. Submit confirmed text values only.
9. Release/discard the image and object URL.

**The RSBSA ID image must not be uploaded or retained.**

### Registered — no ID available

Allow manual input:

- RSBSA number
- farmer name
- confirmation checkbox

### Not registered

RSBSA number is not required. Continue normal farmer profiling.

## Stored fields

- `rsbsa_registration_status`
- `rsbsa_no`
- `rsbsa_capture_method`
- `rsbsa_info_confirmed`

Recommended capture methods:

- `ID_OCR`
- `MANUAL`
- `NOT_APPLICABLE`

No image path, image URL, Drive file ID, or image blob should exist in the database.

## Duplicate check

After the user confirms the RSBSA number:

```text
normalize RSBSA number
    ↓
exact RSBSA lookup
    ↓
found?
 ┌──┴──┐
yes    no
 ↓      ↓
show    continue
existing registration
```

An RSBSA match is a strong duplicate signal, but authorized personnel should still be able to review/correct records.

For farmers without an RSBSA number, use a softer duplicate warning based on available identity/contact/location fields.

## OCR implementation notes

Use a mobile-friendly file input:

```html
<input type="file" accept="image/*" capture="environment">
```

Suggested preprocessing:

```text
image
  ↓
orientation correction
  ↓
resize
  ↓
crop/region selection if needed
  ↓
grayscale
  ↓
contrast enhancement
  ↓
OCR
```

Do not save OCR output without a user confirmation step.

The extraction rules must be tuned against a privacy-safe sample of the actual RSBSA ID/card format before production.
