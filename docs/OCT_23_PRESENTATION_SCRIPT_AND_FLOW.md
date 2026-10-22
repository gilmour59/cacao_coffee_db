# October 23 farmer presentation: script and flow

**Audience:** farmers and project stakeholders  
**Length:** about 7 minutes, then questions  
**System shown:** TEST only; the dashboard includes fictional demo profiles

**Flow to remember:** New farmer form or existing farmer's personal link → pending submission → staff validation → approved record → dashboard. A returned submission goes back for correction.

## Before people arrive

1. Use **two browser windows**: open the [farmer landing page](https://script.google.com/macros/s/AKfycbxXQYYjRgumA18liMmxwUSbj_K_A0Lm4f9-n3kYVSU5Z22otMyFI51KzHvFYTrWnAWX/exec) in a private/incognito window so the audience sees the public farmer view; open the [staff app](https://script.google.com/macros/s/AKfycbwWozzUZEtZmYuX4gP9KQgZRc-fPmNwDyqU-wwcKdOlUl0NnW0z-0ZfUp6uwZ7VxDiR/exec) in your regular signed-in window with the TEST admin account. The admin account can show the Validator Queue and dashboard. A third profile is needed only if you choose to demonstrate the Validator or Encoder account separately; this script does not require it.
2. In the staff app, open **Live Dashboard** and select **2026**. Confirm the numbers and charts load. Leave the testing notice visible when introducing the app.
3. Check the projector, internet, browser zoom, and that personal invitation links or real farmer details are not on screen. Keep the existing [demo guide](OCT_23_DEMO_GUIDE.md) available as a backup reference.
4. Use a QR code only for the base farmer TEST URL if one is ready. Do not display or shorten a personal secure link.

## On-stage click path and words to say

| Time | Show / click | Presenter script |
| --- | --- | --- |
| 0:00–0:45 | Farmer landing page, with the yellow testing notice visible | “Good day. This is our coffee and cacao farmer profiling system. Today I’m showing a **testing version** so you can see how information can move from a farmer profile to review and then to a useful community summary. The demo records are fictional. This still needs further testing before official use.” |
| 0:45–1:45 | **Start New Farmer Profile**; show the first part of the form, then return Home | “A new farmer can begin here. The form asks for identity, farm location, crops, production, and support needs. It guides the user through the questions before submission. Please do not enter your real personal or farm details in this demo unless project staff invite you to a supervised test.” |
| 1:45–2:30 | Home card **Already profiled?** | “Farmers who already have a profile do not need to create an account. Authorized staff can issue a personal secure link for a specific update. That link opens only the permitted farmer context. We will keep personal links private, so I’m showing the explanation rather than someone’s link.” |
| 2:30–3:30 | Switch to staff app; point to **Validator Queue** without opening private records | “Submitted information waits for an authorized validator. The validator can check it, return it for correction, or approve it. A pending submission does not enter the approved farmer totals.” |
| 3:30–5:45 | Open **Live Dashboard**; narrow Crop → Province → Municipality / city → Barangay. Use the sidebar to show Overview, the municipality choropleth and table in Geography, the labeled production trend and production mix in Crops, farm and tree charts, farmer summaries, support, and data quality. | “Once records are approved, they contribute to this dashboard. It reads the private TEST Sheet and refreshes while open. We can see how many farmers have been profiled, planted area, bearing trees, and reported production. We can narrow the view to a crop, province, municipality, or barangay. The map colors whole municipalities by the chosen measure and does not show farm locations. These figures include fictional profiles made for this presentation; they are **not actual field statistics**.” |
| 5:45–6:30 | Stay on dashboard; optionally click **Refresh** | “The goal is to help staff see patterns without displaying farmer names, phone numbers, personal links, or exact farm coordinates here. If a submission is approved, the dashboard can be refreshed to include it.” |
| 6:30–7:00 | Return to farmer Home or leave dashboard with notice in view | “This is a preview of a connected workflow, not an official rollout. Next we need more testing with the different staff roles and real-world conditions, and the final hosting and domain should be owned by the institution. We would welcome your feedback on whether the questions and reports are useful.” |

## Optional live submission, only after a successful rehearsal

Use an obviously fictional profile in TEST. Submit it, show that it appears in **Validator Queue** as pending, approve it with the authorized TEST validator, then return to **Live Dashboard** and click **Refresh**. Explain the before/after count. Do this only if the complete sequence worked on the presentation computer shortly before the session; the pending → approval → dashboard change has not been live verified for this release. Do not use a real farmer record to make the demonstration more dramatic.

## If something fails on stage

- **App or internet does not load:** Continue with the spoken flow above and the offline synthetic dashboard preview if available on the presentation computer. Say clearly that the preview is offline and uses fictional data; it is not connected to the Sheet.
- **Dashboard is slow:** Wait briefly, then click **Refresh** once. Continue with the visible sections; do not claim a new submission has appeared unless you can see the changed total.
- **Sign-in or role access blocks the staff view:** Stay on the farmer landing page. Explain the validation and dashboard steps verbally; do not change staff permissions during the presentation.
- **A question asks whether the numbers are real:** “No. This TEST dashboard includes fictional demo profiles. The purpose today is to show the workflow and what reports the system could produce after testing and official deployment.”

## Questions you may get

**Does a farmer need a Google account?** No for the public new-farmer form. Existing farmers use a personal secure link issued by staff. Staff sign in with authorized Google accounts.

**Can we use this officially now?** Not yet. This is a TEST demonstration, and the remaining workflows and staff roles need more testing before official use.

**Why does the link say `script.google.com`?** Apps Script hosts this TEST version. A QR code or institution-controlled short address can make the entry easier to share, but the browser will still show the Apps Script address after redirecting. A lasting branded domain requires a hosted front end and protected backend under institutional ownership.

**Where does the dashboard get its figures?** From approved records in the private TEST Sheet. The dashboard refreshes about every 30 seconds while open; **Refresh** requests an immediate update. Today's seeded profiles are fictional.
