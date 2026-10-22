# October 23 farmer presentation: final script and flow

**Audience:** farmers and project stakeholders
**Length:** about 8 minutes, then questions
**Environment:** TEST, with fictional demo profiles. This is not an official rollout.

## The story in one line

**New farmer form or existing farmer's private link → pending submission → Validator review → approved record → live dashboard.** A returned submission goes back for correction. The Encoder helps collect or update information but does not approve it.

## Set up before people arrive

1. Open the [TEST farmer page](https://script.google.com/macros/s/AKfycbxXQYYjRgumA18liMmxwUSbj_K_A0Lm4f9-n3kYVSU5Z22otMyFI51KzHvFYTrWnAWX/exec) in a private/incognito window to show the public view without a Google account. Open the [TEST staff app](https://script.google.com/macros/s/AKfycbwWozzUZEtZmYuX4gP9KQgZRc-fPmNwDyqU-wwcKdOlUl0NnW0z-0ZfUp6uwZ7VxDiR/exec) in a separate window signed in as Admin. A third browser profile is needed only if you want to show the Encoder or Validator account separately; Admin can show both staff functions.
2. In the staff app, search for synthetic farmer `DEMO-F-2026-002` under **Existing Farmer Links**. If showing the prefilled form, generate an **Annual Profile** link for that farmer and choose **Synthetic farm 002**. Keep the full link private and open it in a separate tab before presenting. The base farmer URL cannot load a particular existing farmer by itself.
3. Open **Live Dashboard**, select 2026, and let its first load finish. Check the map and section navigation. The dashboard reads the private TEST Sheet and refreshes every two minutes while open; **Refresh** requests a new read. The progress display shows elapsed seconds, not a percentage.
4. Check projector, internet, browser zoom, and the test notice. Use only fictional records. Keep invitation tokens, personal contact details, and exact farm coordinates off the projector. A QR code may point to the **base** farmer TEST URL, never a personal link.
5. Rehearse any live submission and approval on this computer shortly before the event. If that sequence fails, use the safe walkthrough below without submitting.

## On-stage script and click path

| Time | Show / click | Say |
| --- | --- | --- |
| 0:00–0:45 | Farmer Home; leave the yellow test notice visible | “Good day. This is a test version of our coffee and cacao farmer profiling system. Today we will show how a profile moves from data collection to staff review and a community-level dashboard. The demo records are fictional. We still need testing and institutional approval before official use.” |
| 0:45–1:45 | **Start New Farmer Profile**; show identity, RSBSA status, location cascade, crops, and farm map; return Home | “A new farmer can start here without creating an account. The form records RSBSA status, farm location, coffee or cacao details, production, facilities, and support needs. We will not enter real personal or farm details during this demo.” |
| 1:45–2:15 | Show **Review Summary** and **Submit for Validation** | “Review Summary helps the farmer check answers, but it is optional. Submit for Validation checks required fields and sends the profile to staff. Submission does not make the record approved.” |
| 2:15–3:30 | Staff **Existing Farmer Links**; search `DEMO-F-2026-002`; show year, purpose, and farm controls. Optionally show the prepared synthetic form with its URL hidden. | “For a farmer already in the system, an Encoder or other authorized staff member searches for that specific farmer and creates a private link for an annual profile, correction, expansion, or new farm. The farmer needs the link, not a Google account. The form loads permitted existing details, such as water source, crop profile, and facilities, for review and updating. The Encoder can assist, then submit it for validation.” |
| 3:30–4:15 | Staff **Validator Queue**, without exposing personal details | “The Validator checks pending information and possible duplicates. They can approve it or return it with a reason for correction. The Encoder cannot approve their own update. Until approval, the change stays out of approved dashboard totals.” |
| 4:15–6:45 | **Live Dashboard**: Overview → Geography map → Crops & production → Farm profile → Support / Data quality. Demonstrate Crop → Province → Municipality → Barangay filters and one map metric. | “The dashboard reads approved records from the private TEST Sheet. We can narrow results by crop and location. The map colors whole municipalities according to the selected measure; it does not plot individual farms. The charts summarize production, trees, facilities, and support needs. These numbers include synthetic records prepared for this presentation; they are not official field statistics.” |
| 6:45–7:20 | Show **Refresh** and loading state, if quick | “After a Validator approves a submission, staff can refresh the dashboard to see the new approved totals. Loading can take a little time, so the page shows that it is still working.” |
| 7:20–8:00 | Return to Home or keep dashboard and test notice visible | “This is a connected TEST workflow, not an official rollout. We want your feedback on the questions, phone experience, and reports. The next steps are broader role testing, data checks, and transfer to institution-owned hosting and accounts.” |

## Optional live proof, only after a successful rehearsal

Use a fresh **fictional** profile in TEST. Submit it, show its **Pending** state in the Validator Queue, approve it with an authorized TEST Validator, then click **Refresh** on the dashboard and point out the changed total. Do not claim this exact sequence worked during the presentation unless the screen shows it. Do not approve or alter a real farmer record for the demo.

## If the live app stalls

- **Farmer page asks for Google sign-in:** The TEST farmer URL was corrected to allow anonymous access. Confirm you opened the farmer URL above, not the staff URL. Use the private window prepared before the session.
- **Staff sign-in or role is wrong:** Stay on the public farmer page and explain staff review verbally. Do not change accounts or permissions on stage.
- **Dashboard is slow or shows a storage error:** Wait for the loader, retry **Refresh** once, then use the visible sections. If needed, switch to the offline synthetic preview and clearly call it an offline mockup.
- **A personal link or private data appears on the projector:** Switch back to Home immediately. Continue with the spoken description.

## Questions to answer plainly

**Does a farmer need an account?** No. A new farmer uses the public farmer page; an existing farmer uses a private link generated by authorized staff. Staff sign in with Google accounts.

**How does an Encoder update one farmer?** In **Existing Farmer Links**, search by farmer ID, RSBSA, name, or contact; select the farmer, year, purpose, and farm; generate the link; help complete or share the form; submit it for Validator review. The search is limited to the Encoder's assigned area.

**Must Review Summary be clicked before submitting?** No. It is recommended, but **Submit for Validation** performs its own checks.

**Is a submission already approved?** No. A Validator must review it first.

**Are these real statistics?** No. This TEST dashboard includes fictional profiles. Do not use its totals as official field data.

**Why is the address `script.google.com`?** Apps Script hosts the TEST version. A QR code or short redirect can make the base entry link easier to share. A persistent branded address needs institution-owned hosting and a protected backend.

## Final reminder

Say aloud: **“This is a demonstration and testing version. The records shown today are fictional and are not official farmer submissions or field statistics. The system needs more testing and institutional approval before operational use.”**
