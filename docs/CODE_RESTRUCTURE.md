# V1 Code Restructure

Branch: `refactor/v1-domain-flow`

## Why the restructure is needed

The initial shell directly created active Farmer/Farm rows. Final HVCP requirements instead require staged submissions, Validator approval, yearly profiling history, secure existing-farmer links, identity review, and change/anomaly classification.

The V1 code is therefore organized around three boundaries:

1. **Public/staff intake** creates PENDING submissions.
2. **Validator workflow** decides whether a submission becomes canonical.
3. **Canonical services** materialize Farmer/Farm/Profile records only after approval.

## Server structure

```text
Code.gs
  └─ web entry only

BootstrapService.gs
Schema.gs
Config.gs
SheetRepository.gs
IdService.gs
ValidationService.gs

AuthorizationService.gs
AuditService.gs
IdentityService.gs
InvitationService.gs
SubmissionService.gs
ValidatorService.gs
ChangeDetectionService.gs

FarmerService.gs
FarmService.gs
ProfilingService.gs
ProductionService.gs
InterventionService.gs
ReferenceService.gs
```

## Public RPC surface

Farmer/respondent:
- `getBootstrapData()`
- `submitNewFarmerProfile(payload)`
- `getInvitationContext(token)`
- `submitExistingFarmerProfile(token, payload)`

Authorized Encoder:
- `submitEncoderProfile(payload)`
- `createProfilingInvitation(...)`
- `revokeProfilingInvitation(...)`
- staff Farmer lookup helpers

Validator/Admin:
- `listPendingSubmissions()`
- `getSubmissionForReview(submissionId)`
- `resolveIdentityReview(...)`
- `approveSubmission(...)`
- `returnSubmission(...)`

Maintenance:
- `setupDatabaseSchema()`

## Deferred from current V1

RSBSA parcel/geospatial coordination and parcel visualization are post-V1 backlog items. The MVP does not digitize parcel boundaries.
