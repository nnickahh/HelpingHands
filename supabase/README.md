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
