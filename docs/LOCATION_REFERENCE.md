# Location Reference Design

Use **PSA Philippine Standard Geographic Code (PSGC)** 10-digit codes as canonical geographic identifiers.

All geographic code columns in Google Sheets must be formatted as **Plain text** so leading zeroes are never lost.

## Ref_Provinces

| Column | Purpose |
|---|---|
| province_code | 10-digit PSGC primary key |
| province_name | Official name |
| region_code | Parent region PSGC |
| is_active | TRUE/FALSE |
| sort_order | UI order |
| valid_from | Optional effective date |
| valid_to | Blank while current |
| source_version | PSGC release/version |

Example rows:

| province_code | province_name | region_code |
|---|---|---|
| 0600400000 | Aklan | 0600000000 |
| 0600600000 | Antique | 0600000000 |
| 0601900000 | Capiz | 0600000000 |
| 0603000000 | Iloilo | 0600000000 |
| 0607900000 | Guimaras | 0600000000 |

## Ref_LGUs

Use LGU rather than Municipality internally because the system must support cities and municipalities.

| Column | Purpose |
|---|---|
| lgu_code | 10-digit PSGC primary key |
| province_code | Parent province |
| lgu_name | Official name |
| lgu_type | MUNICIPALITY, CITY, etc. |
| is_active | TRUE/FALSE |
| sort_order | UI order |
| valid_from | Optional effective date |
| valid_to | Optional |
| replaced_by_code | Future PSGC changes |
| source_version | PSGC release/version |

Example:

| lgu_code | province_code | lgu_name | lgu_type |
|---|---|---|---|
| 0603023000 | 0603000000 | Janiuay | MUNICIPALITY |

## Ref_Barangays

| Column | Purpose |
|---|---|
| barangay_code | 10-digit PSGC primary key |
| lgu_code | Parent LGU |
| province_code | Parent province; redundant for reporting/filtering |
| barangay_name | Official name |
| urban_rural | Optional |
| is_active | TRUE/FALSE |
| sort_order | UI order |
| valid_from | Optional |
| valid_to | Optional |
| replaced_by_code | Future PSGC changes |
| source_version | PSGC release/version |

Example:

| barangay_code | lgu_code | province_code | barangay_name |
|---|---|---|---|
| 0603023019 | 0603023000 | 0603000000 | Damires |

## Cascading lookup logic

The browser loads all active Region VI references once.

```text
Province selection
    ↓
filter Ref_LGUs by province_code
    ↓
Municipality/City selection
    ↓
filter Ref_Barangays by lgu_code
    ↓
Barangay selection
```

Build browser lookup maps:

```javascript
lgusByProvince = {
  "0603000000": [
    { code: "0603023000", name: "Janiuay", type: "MUNICIPALITY" }
  ]
};

barangaysByLgu = {
  "0603023000": [
    { code: "0603023019", name: "Damires" }
  ]
};
```

This avoids another server request every time the user changes a dropdown.

## Farm map behavior

After administrative location selection:

1. Center/zoom the map to an appropriate known area where possible.
2. Allow the user to tap/drag one marker to the approximate farm location.
3. Store latitude and longitude.
4. Do not imply that the point is a cadastral or parcel boundary.

Recommended capture methods:

- `MAP_PIN`
- `DEVICE_GPS`

The V1 map point is for spatial orientation and management analysis only.
