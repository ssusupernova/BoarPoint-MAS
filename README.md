# BoardPoint mobile frontend

React Native, Expo Router, and TypeScript prototype for the account access and renter success path. This package contains UI and local preview state. It does not authenticate with Supabase or create a database booking.

## Run

1. Install Node.js and npm.
2. In this directory run `npm ci`.
3. Start with `npx expo start --go --tunnel --clear` when the phone is on an iPhone hotspot or a different network. Otherwise `npx expo start -c` is sufficient when the phone can reach the laptop over LAN.
4. Scan the QR code using Expo Go. Use `npx tsc --noEmit` and `npm run lint` for local checks.

## Preview route

Log in or sign up with a valid sample email and any password to enter the local preview. Choose renter to use the search path. Notification permission may be skipped. Search → preferences → results → room → review → negotiation → agreement → confirmation → booking. The final two negotiation transitions are explicit preview actions; they do not represent a backend result. Account and bottom navigation are available throughout the renter path.

The Negotiations tab shows a sample active session (R6). Its Finished segment opens the sample agreement (R7) and booking outcome (R8). The Bookings tab also links directly to the sample booking outcome and detail view. These `?preview=1` routes are separate from the current local flow and do not update booking state. Actual local flow activity is shown above the sample cards.

## Code layout

- `src/app/`: Expo Router screens and URL entry points.
- `src/features/access/`: account forms, preview session, notification permission.
- `src/features/renter/`: renter screens and local prototype state.
- `src/components/access/`: shared UI pieces for account screens.
- `src/constants/`: palette and theme constants.
- `assets/images/`: locally bundled imagery.

## Backend integration boundaries

Replace `preview-session.tsx` with Supabase Auth session handling, `state.tsx` sample rooms with REST responses, and the preview negotiation buttons with backend status events. Render R6 from offer/session JSON, R7 from an agreed terms plus validation response, and R8 from a confirmed booking response. Keep the status driven by returned data rather than the demonstration route parameter. Enforce role authorization and validate booking/availability on the backend. Do not interpret the sample confirmation as a real reservation.
