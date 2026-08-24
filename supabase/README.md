# OneMap address proxy

`functions/onemap-search/index.ts` is the server-side Singapore address lookup for HelpingHands.

## Configure secrets

Set these secrets in the Supabase project. Do not put them in the Expo app or commit them:

```bash
supabase secrets set ONEMAP_EMAIL="your-onemap-email" ONEMAP_PASSWORD="your-onemap-password"
```

The OneMap access token is short-lived, approximately 72 hours. The Edge Function caches it server-side, refreshes it with a 15-minute safety margin, and retries once after a 401 response. The token and credentials never reach the phone.

## Deploy

Keep JWT verification enabled so only authenticated HelpingHands sessions can use the proxy:

```bash
supabase functions deploy onemap-search
```

The mobile client should send its Supabase access token in the `Authorization` header after authentication is implemented. Until then, leave `EXPO_PUBLIC_ONEMAP_PROXY_URL` unset and use the local fixtures for UI testing.

Configure the mobile app with the public function URL in `mobile-app/.env`:

```bash
EXPO_PUBLIC_ONEMAP_PROXY_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/onemap-search
```

The app currently uses local Singapore fixtures when this URL is absent, which is suitable for UI testing only. Production requests should require a deployed proxy and real OneMap results.

## Mobile password reset

Enable Email provider authentication in Supabase, then configure the app with the public project URL and anon key in `mobile-app/.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

The login screen sends the entered account email to Supabase Auth when the user chooses Forgot password. Supabase sends the reset link; no password is sent through the mobile app. Restart Expo after changing `.env`.

## Mobile email verification codes

The mobile app requests Supabase email OTPs at `/auth/v1/otp` and verifies them at `/auth/v1/verify`. In Supabase Dashboard, enable the Email provider and update the confirmation email template so it includes the six-digit token placeholder:

```text
Your HelpingHands verification code is {{ .Token }}
```

For confirmation links, add these redirect URLs in Supabase Dashboard under Authentication > URL Configuration:

```text
helpinghands://auth/callback
http://localhost:8081/auth/callback
```

In `mobile-app/.env`, set the redirect that matches how you are running the app. For a native Expo build, use:

```bash
EXPO_PUBLIC_AUTH_REDIRECT_URL=helpinghands://auth/callback
```

For Expo web, use the exact URL and port shown by Expo, for example:

```bash
EXPO_PUBLIC_AUTH_REDIRECT_URL=http://localhost:8081/auth/callback
```

The confirmation email template must use `{{ .ConfirmationURL }}`. Do not hardcode `localhost` or the Supabase Site URL in the template. After changing `.env`, restart Expo and request a new verification email; old links keep their original redirect.

Regular user registration is open. Keep the administrator-only `EXPO_PUBLIC_ADMIN_EMAILS` list configured in `mobile-app/.env`; Supabase Auth settings still control delivery, rate limits, and the sending domain.

## Shared elder and volunteer requests

Run `supabase/migrations/001_assistance_requests.sql` in the Supabase SQL Editor once. The mobile app then publishes elder requests to `assistance_requests`, polls pending requests for volunteers, and updates the same row when a volunteer accepts it. Users who were signed in before this integration should sign out and sign in again once to obtain a Supabase access token.
