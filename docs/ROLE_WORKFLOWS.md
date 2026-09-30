# Role Workflows

This document defines what each human role does in the Coffee and Cacao Farmer Profiling and Information Management System.

Application roles and technical-maintenance roles are deliberately separated.

---

## 1. Farmer / Respondent

The farmer is the subject of the profile and may be assisted by an encoder.

### Flow

```text
RSBSA status
   ↓
RSBSA ID scan OR manual RSBSA number OR not registered
   ↓
verify farmer details
   ↓
farm details
   ↓
Province → Municipality/City → Barangay
   ↓
approximate farm map point
   ↓
Coffee/Cacao details
   ↓
production / facilities / interventions
   ↓
review
   ↓
submit
```

### RSBSA cases

**Registered — ID available**

- take/select ID image;
- OCR runs locally;
- verify/correct text;
- image is discarded;
- confirmed information is submitted.

**Registered — no ID available**

- manually enter RSBSA number;
- verify farmer information;
- continue.

**Not registered**

- no RSBSA number required;
- continue normal profiling.

The system must never require storage of the RSBSA ID image.

---

## 2. Encoder

Application role:

```text
ENCODER
```

Typical users:

- HVCP field personnel;
- authorized LGU personnel;
- designated data collectors.

### Encoder may

- create farmer profiles;
- encode RSBSA information;
- register farms;
- select PSGC locations;
- place approximate farm map points;
- add Coffee/Cacao planting details;
- add production;
- add facilities/equipment;
- add received interventions;
- add intervention needs;
- review a draft;
- submit for validation;
- correct a submission returned by a Validator.

### Encoder should not

- approve their own submission unless HVCP explicitly changes policy;
- modify system code;
- deploy production;
- edit stable reference codes;
- delete historical records;
- access GitHub deployment credentials.

---

## 3. Validator

Application role:

```text
VALIDATOR
```

Typical users:

- designated HVCP personnel;
- authorized provincial/regional reviewer.

### Validation flow

```text
Pending submissions
     ↓
open submission
     ↓
review farmer + RSBSA information
     ↓
review location/farm data
     ↓
review Coffee/Cacao production profile
     ↓
choose action
 ┌──────┼────────┐
approve return  reject
```

### Approve

Use when the submission is acceptable.

System records:

- validator;
- validation date/time;
- status;
- remarks if applicable.

### Return

Use when the encoder can correct the submission.

Return must include useful remarks.

Example:

```text
Please verify the RSBSA number and the production unit.
```

### Reject

Use only where HVCP policy requires a rejected state.

Rejection should not silently delete submitted information.

### Validator should not

- deploy code;
- modify clasp configuration;
- modify GitHub;
- alter production schema;
- change official reference codes without Admin approval.

---

## 4. HVCP Data Administrator

Application role:

```text
ADMIN
```

This is an operational/data role, not automatically a software developer role.

### Admin responsibilities

- manage authorized Users;
- activate/deactivate reference values;
- oversee data corrections;
- monitor duplicates;
- oversee validation queues;
- review audit history;
- maintain Looker Studio/report access;
- coordinate PSGC/reference updates;
- approve schema/reference policy changes.

### Reference update flow

```text
approved new value
    ↓
add stable code + description
    ↓
set is_active=TRUE
    ↓
verify TEST if structurally significant
    ↓
verify dropdown/report
```

For obsolete values:

```text
is_active=FALSE
```

Do not delete historical reference rows already used by records.

---

## 5. Technical Maintainer

This is **not necessarily an application role**.

The Technical Maintainer is the person authorized to maintain source code and release Apps Script versions.

Possible holder:

- ICT personnel;
- trained HVCP/Cacao technical focal;
- formally designated support person.

### Technical Maintainer responsibilities

- maintain GitHub source;
- maintain TEST Apps Script;
- troubleshoot application defects;
- perform TEST releases;
- create production versions;
- update the existing production deployment;
- perform rollbacks;
- document changes;
- preserve configuration separation;
- ensure production remains HVCP-owned.

### Technical Maintainer should not

- use a personal Sheet as production;
- store production credentials in GitHub;
- request HVCP passwords;
- bypass TEST for normal releases;
- directly rewrite real farmer data as part of a code release.

---

## 6. Dashboard / Management Viewer

This role may exist only in Looker Studio/Google sharing and does not need application write permission.

May:

- view authorized management dashboards;
- filter regional data;
- review aggregate farmer/production/intervention indicators.

Should not see unnecessary personal information.

---

## 7. Separation of duties

Preferred access model:

| Capability | Encoder | Validator | Data Admin | Technical Maintainer |
|---|---:|---:|---:|---:|
| Encode farmer/farm data | Yes | Optional | Yes | Only for testing |
| Submit profiles | Yes | Optional | Yes | Only for testing |
| Approve/return submissions | No | Yes | Yes | No |
| Manage reference values | No | No | Yes | Technical support only |
| Correct operational data | Limited | Limited | Yes | No by default |
| View audit logs | Limited | Yes | Yes | For troubleshooting |
| Modify GitHub source | No | No | No by default | Yes |
| Deploy TEST | No | No | No by default | Yes |
| Deploy PROD | No | No | Authorized only | Yes |
| Roll back PROD | No | No | Authorize/coordinate | Yes |

One person may hold more than one role in a small team, but permissions should still be understood separately.

---

## 8. Typical operational scenarios

### New farmer with RSBSA ID

```text
Encoder
  ↓
select Registered — ID available
  ↓
scan ID
  ↓
farmer verifies OCR result
  ↓
encode farm/profile
  ↓
submit
  ↓
Validator
  ↓
approve/return
```

### Registered farmer without physical ID

```text
Encoder
  ↓
select Registered — ID not available
  ↓
manually encode RSBSA number
  ↓
encode profile
  ↓
submit
  ↓
Validator review
```

### Farmer not registered in RSBSA

```text
Encoder
  ↓
select Not yet registered
  ↓
no fake RSBSA number
  ↓
continue profiling
  ↓
submission can later support registration follow-up
```

### Reference list update

```text
HVCP Data Admin
  ↓
approved reference change
  ↓
update reference Sheet
  ↓
verify app
```

No code deployment is required if the structure is unchanged.

### Application bug fix

```text
Technical Maintainer
  ↓
fix source
  ↓
GitHub
  ↓
TEST
  ↓
verification
  ↓
versioned PROD update
```
