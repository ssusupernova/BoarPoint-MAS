# Module 04 — Provider / Listing Setup & Monitoring

## Apply this update

This is an overlay for BoardPoint with Modules 01–03 already installed.
1. Stop Expo with Ctrl+C.
2. Extract this ZIP. Copy the contents of its BoardPoint folder into your existing project folder, replacing matching files. Keep your existing .git folder.
3. No new dependencies are required.
4. In PowerShell in the project folder, run:

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
node --test tests/provider-validation.cjs
npx.cmd expo start --go --tunnel --clear
```

Log out of any existing preview session. At login select **Provider**, enter a valid email and a nonempty password, then continue through notifications. This is demo authentication; use sample credentials, not a real password.

## Included flow

- Provider role selection at login and signup, notifications redirect to provider listings.
- Provider navigation: Listings, Negotiations, Bookings, Account.
- Three sample listings with existing project images.
- Add/edit listing: room information, photo sample choice, inclusions, house rules.
- Rental terms: rent, deposit, lease, move-in, availability and negotiable fields.
- Agent settings: private price floors, lease boundaries, move-in window and priority weights.
- Review with links back to each setup section; save updates local state without duplicating edited listings.
- Listing details with public terms, private agent settings and monitoring links.
- Active/finished negotiation samples and offer history.
- Confirmed booking sample, terms, checks and negotiation history.
- Provider account shares existing notifications and logout controls; logout resets preview data.
- Existing renter and Module 03 preview screens are preserved.

## Try these paths on your phone

1. Log in as Provider → Your listings → View listing → Edit listing.
2. Change room details → continue through rental terms and agent settings → Review listing → Save listing. Verify the revised card appears.
3. Add listing → leave required fields blank → Continue. Verify error feedback.
4. Enter a move-in outside availability, a private price floor above listed rent, or weights totaling 90. Verify each is rejected.
5. Save a new listing → open its negotiations and bookings. It should have empty states rather than borrowing another listing's records.
6. Open Sunny Private Room negotiations → Active and Finished → sample negotiation details.
7. Open Bookings → sample booking details → negotiation history.
8. Use all four bottom tabs, then log out and log in as Renter. Check Modules 01–03 still work.
9. Check scrolling and keyboard behavior on your iPhone; repeat Android testing later.

## Frontend versus backend

This package is suitable for frontend review, with explicitly labeled fixtures. It is not live authentication, publishing, agent execution or booking processing. Listings and draft edits are in memory and reset on app reload/logout. Monitoring samples are fixed records, independent of listing edits. Account role selection is only a preview convenience; production role and access must come from verified backend identity.

Public and private fields are logically separate in review, but remain in the same local Listing type for the demo. Before API integration, separate public listing DTOs from authorized provider-only agent settings. Enforce ownership and all validation server-side. Do not return private limits to renter APIs.

Backend work: authenticated listing CRUD and image storage/upload; server-generated IDs; durable draft/save handling and network error states; owner-scoped negotiation and booking APIs; status events/polling; transaction-backed availability checks and booking creation. Confirm status names and endpoint contracts with the backend teammate. Do not infer confirmed booking from agreement alone. No manual booking acceptance was added because that business rule has not been established.

The existing room images are selectable sample photos. Device photo upload is not implemented. Dates/times and priority percentages use labeled text/number inputs, rather than the prototype's dropdowns/sliders. The design follows the reference hierarchy and palette; exact pixel parity has not been verified on device.

## Validation performed

- TypeScript: passed.
- ESLint: passed.
- Six automated provider validation tests: passed.
- iOS export: not verified; automated approval review blocked the Expo export because it may send project metadata to cdp.expo.dev.
- Physical phone walkthrough: pending user testing.

## Files in the overlay

New: src/features/provider/state.tsx, screens.tsx; src/app/provider/index.tsx, [stage].tsx; tests/provider-validation.cjs; this document.
Updated: src/app/_layout.tsx (provider store), account.tsx (provider tabs/reset), notifications.tsx (provider redirect), src/features/access/auth-screen.tsx (provider preview login selection).
No package, lockfile, Git configuration, or existing renter screen changes are included.

Suggested commit title after phone testing:
feat(frontend): add provider listing setup and monitoring previews
