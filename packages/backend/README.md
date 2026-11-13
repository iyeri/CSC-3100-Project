# Backend setup

The Express API reads its Supabase configuration from a local environment file.

1. Copy `.env.example` to `.env` in this directory.
2. In the Supabase Dashboard, open **Project Settings → API** and copy the project URL and the **publishable** key into that file.
3. Never put a Supabase `service_role`/secret key in the mobile frontend or commit it to Git.

```dotenv
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`packages/backend/.env` is ignored by Git. The frontend should make requests to this Express API; it should not receive backend-only credentials.
