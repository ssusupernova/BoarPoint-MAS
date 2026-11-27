# BoardPoint module 01

This update adds six connected account-access screens using the supplied prototype images as references. It uses BoardPoint branding, the existing palette and boarding-house photo, and Feather icons. Layouts adapt to device width and keyboard visibility.

## Install on your Windows laptop

1. Stop Expo with Ctrl+C in its terminal.
2. Make a backup copy of your current BoardPoint folder.
3. Extract this ZIP. Copy everything inside `BoardPoint-update` into your existing BoardPoint folder, beside its package.json. Merge the src folders and replace matching files when Windows asks.
4. In a terminal opened in your BoardPoint folder, run `npm ci`.
5. Run `npx expo start --go --tunnel --clear` and scan the new QR code.

The app opens directly at Login. The ZIP is an update for your existing project. It includes changed files and the existing login image. Your original repository supplies the remaining starter files and assets.

## What to test on iPhone

- Login with empty fields shows a validation message.
- Show/hide changes password visibility.
- Create account opens a separate screen. Select Renter or Provider.
- Try a password shorter than eight characters, then mismatched passwords.
- Enter sample@example.com and matching sample passwords of eight or more characters. Create account opens Stay updated.
- Not now opens Account, showing the email and chosen role.
- Log out opens confirmation. Cancel keeps the account screen, and confirming returns to Login.
- Login with any valid sample email and nonempty password enters the renter preview.
- Forgot password validates the email and shows preview feedback. Its Preview reset-password screen button opens Reset password.
- Reset password validates minimum length and matching values. Back to log in returns to Login.
- Enable notifications requests OS permission. Denial presents feedback and keeps Not now available.
- Account reads actual device permission and refreshes when returning from device settings.
- Test with the keyboard open and on a small display. Every field and action should remain reachable by scrolling.

## Integration status

Authentication runs as a labelled, temporary frontend preview. Entering sample form data opens an in-memory session. Passwords are cleared on submission and are never saved to disk. Session state resets on app restart. Supabase login, account creation, recovery-link verification, session persistence, backend role authorization, and email delivery still need implementation with your project configuration.

The reset screen is directly accessible for prototype testing. Before production, require a valid Supabase recovery session for password updates.

Notification permission is implemented with expo-notifications. Remote push token registration and backend delivery still need integration. In Expo Go, OS permission and device settings belong to the Expo Go host. Validate BoardPoint-specific permission and remote delivery in its development build.

Account is the endpoint of this module preview. The renter/provider home destinations and bottom navigation from later modules are pending. The supplied Figma account screen shows Provider. This update also includes the corresponding Renter account state.

## Validation performed

- TypeScript `npx tsc --noEmit` passed.
- ESLint `npm run lint` passed.
- Expo iOS JavaScript/Hermes export passed.
- Expo web export passed.
- Interactive browser verification was blocked by this environment's browser-launch restriction.
- Real-device layout, keyboard, notification prompts, and tap-through testing remain for the iPhone checklist above. Android device testing is deferred as requested.

## Supporting changes

The package files add Expo-compatible expo-notifications and @expo/vector-icons. ESLint configuration and dependencies support the repository's required lint check. The lint script uses ESLint directly because the installed Expo lint wrapper reported a version-detection error. The app config registers the notification plugin.

Two existing web starter components received TypeScript/hydration compatibility corrections. expo-env.d.ts supplies Expo's CSS import types. Existing unrelated routes and assets remain in your original project.

## Main files

- src/app/index.tsx redirects to auth/login.
- src/app/auth contains login, signup, forgot-password, and reset-password routes.
- src/app/notifications.tsx and src/app/account.tsx provide the shared screens.
- src/components/access/ui.tsx contains shared inputs, buttons, page layout, and feedback.
- src/features/access/auth-screen.tsx contains form layouts and validation.
- src/features/access/preview-session.tsx contains temporary preview session state.
- src/features/access/use-notifications.ts reads and requests device permission.
