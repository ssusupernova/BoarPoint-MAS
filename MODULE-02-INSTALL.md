# BoardPoint Module 02 — Figma implementation pass

Extract this ZIP into the root of your existing BoardPoint Expo project, replacing the matching files. Keep your existing package.json, package-lock.json, and node_modules. The ZIP includes the earlier navigation fix in src/components/access/ui.tsx as well as the complete renter screen replacement and three new room photo assets.

Run `npm install` only if your local project does not have dependencies installed, then `npx expo start -c`. Sign in as a renter in the preview flow and follow Find a room → Preferences → Matches → Room → Review → Negotiation → Validation → Confirmation → Booking. Negotiation and validation advance automatically after a short preview delay.

The source Figma frames are flat screenshot images. The three room photographs in this package are generated replacements based on those reference photos, because the original standalone photo assets were not present. Colors, copy, components, layout and behavior have been recreated as native UI; exact pixel matching remains dependent on the original photos and checking the app on the target device.
