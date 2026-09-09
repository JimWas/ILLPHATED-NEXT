This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Full forum

The `/boards` area is backed by Supabase Auth, Postgres, Realtime, and a private Storage bucket. Apply `supabase/migrations/20260909010000_full_forum.sql` before deploying the forum UI. The migration:

- creates public boards, topics, replies, member profiles, moderation roles, attachments, and legacy redirects;
- creates the private `/releases/` software forum;
- copies the original single-table Supabase board posts into archived topics without disrupting the live site during preview;
- replaces anonymous writes with authenticated, row-level-secured access;
- keeps software files in the non-public `forum-files` bucket.

After the site owner creates an account, run this once in the Supabase SQL editor:

```sql
select public.grant_forum_admin('OWNER_EMAIL_HERE');
```

To allow another registered member into the private software forum:

```sql
select public.grant_private_forum_access('MEMBER_EMAIL_HERE');
```

Both administrative helpers are unavailable to web clients and can only be run with database-owner privileges.

After the new forum is deployed to production and verified, run `supabase/post-deploy/retire_legacy_posts.sql` to disable and archive the obsolete anonymous feed. It is deliberately excluded from automatic migrations so a preview cannot interrupt the current production boards.

### Legacy forum imports

Convert any recovered forum database into the structure shown in `scripts/forum/normalized-forum.example.json`, then inspect the counts with a dry run:

```bash
npm run forum:import -- path/to/normalized-forum.json
```

To perform the import, provide `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the shell and add `--commit`. Never place the service-role key in a `NEXT_PUBLIC_` variable or commit it.

### Private Vercel previews

Set `PREVIEW_ACCESS_PASSWORD` only in Vercel's Preview environment. Preview deployments will require HTTP Basic authentication; production remains unaffected. For stronger team-level deployment protection, Vercel's own Deployment Protection can be enabled as well.
