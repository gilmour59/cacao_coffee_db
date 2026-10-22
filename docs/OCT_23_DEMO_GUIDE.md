# October 23 farmer presentation guide

## Open these TEST links

- [Farmer landing page](https://script.google.com/macros/s/AKfycbxXQYYjRgumA18liMmxwUSbj_K_A0Lm4f9-n3kYVSU5Z22otMyFI51KzHvFYTrWnAWX/exec): public new-farmer entry. A personal invitation link opens its permitted profile context directly.
- [Staff app](https://script.google.com/macros/s/AKfycbwWozzUZEtZmYuX4gP9KQgZRc-fPmNwDyqU-wwcKdOlUl0NnW0z-0ZfUp6uwZ7VxDiR/exec): Google sign-in for authorized staff. Open **Live Dashboard** from Home.

Both URLs use TEST version 27. The private TEST Sheet holds the records. PROD was not changed.

## Suggested five-minute walkthrough

1. Open the farmer landing page. Explain that new farmers can start a profile; existing farmers use a personal secure link and do not create an account.
2. Show the visible demo notice. Say: **“This is a testing version. The displayed demo records are fictional, and the system still needs further testing before official use.”**
3. Open the staff app as an authorized staff member. Explain that submissions wait for validation before becoming approved records.
4. Open **Live Dashboard**. Show the 2025/2026 trend, coffee/cacao split, barangay production, and support needs. The dashboard reads approved records in the private TEST Sheet and refreshes about every 30 seconds while open; **Refresh** updates it immediately.
5. If a fresh rehearsal passes, submit a fictional new profile, show it in the Validator Queue, approve it, and refresh the dashboard. Explain that pending submissions stay out of approved totals until approval. Do not enter a real farmer's details for this demonstration.

## What was checked on October 22

- Local tests passed for dashboard scope, latest-round counting, authorization, TEST-only synthetic seeding, and the staff bridge.
- Both published TEST URLs loaded the new Home view; the signed-in admin saw the staff dashboard tab.
- The live staff dashboard read the TEST Sheet: 25 farmers, 16.9 ha, 2,232 bearing trees, and 5,140 kg in 2026 after seeding. Of the 25, **24 are synthetic demo profiles** and one was already in TEST. These figures are not field statistics.
- The 24-profile seed ran successfully in TEST. It can be rerun without duplicating its deterministic records.

The new pending → approval → dashboard count change, anonymous dashboard denial, and validator/encoder sessions have **not** been live checked in this release. Rehearse these before presenting them as verified behavior.

## Friendlier address

For tomorrow, print a QR code or use a short, institution-controlled address that redirects to the **base farmer TEST URL**. This makes the entry link easier to share, though the browser will still show `script.google.com` after redirecting. Do not put personal invitation tokens into a third-party short-link service.

For the eventual official system, have HVCP own the domain (for example, a subdomain under its institutional domain), hosting, Google project, and Sheet. A hosted front end can keep that branded address visible and call a protected backend that reads the private Sheet. Staff would use institutional Google sign-in; farmers would still use secure invitation links. This needs a planned build and security test before replacing the Apps Script interface. Vercel can host the front end under HVCP ownership, but a redirect alone cannot provide a persistent branded address.
