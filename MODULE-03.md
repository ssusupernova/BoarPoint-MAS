# Module 03 — Alternate outcomes

Copy the included `src` folder into your existing BoardPoint project and replace the matching screens.tsx file. This update does not replace your Git settings, package files, or ESLint configuration.

## Preview

Log in as a renter, open Negotiations, and use Alternate outcome previews. O1: no matching rooms. O2: deadline reached without agreement. O3: agreement rejected at validation. O4: room booked by another request. Each is an independent branch, not a sequence.

Search with no eligible rooms opens O1. The O4 sample refresh removes the sample conflicting room from results. Editing criteria preserves entered preferences. Demo previews do not confirm, delete, or overwrite a booking.

## Integration

The route keys are no-matches, no-agreement, validation-failed, and booking-conflict. Outcomes O2–O4 currently use sample data. Connect these to authoritative backend responses and replace sample terms and reasons with returned values. A real O4 refresh must fetch current availability. The frontend does not decide availability or commit reservations.

## Checks

TypeScript and ESLint pass. On your phone check each preview, back navigation, edit criteria, offer history, and the conflict refresh. Confirm Module 02 success previews remain accessible. Physical device verification is still required.
