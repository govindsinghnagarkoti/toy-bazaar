This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (MongoDB Atlas):
   Create a `.env.local` file in the project root with:

```bash
MONGODB_URI="your-mongodb-atlas-connection-string"
MONGODB_DB="your-database-name"
```

- Example connection string:
  `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<yourAppName>`

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Editing Toys

- Navigate to `/toys/{id}/edit` to update a toy.
- Fields: name, description, price, categories (comma-separated), images.
- Images: either paste public URLs or use the file input to upload directly to Supabase Storage.

### Required Environment Variables

Set these in your environment (e.g., `.env.local`):

- `NEXT_PUBLIC_SUPABASE_REST_URL` — e.g., `https://YOUR-PROJECT.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon public key
- `NEXT_PUBLIC_SUPABASE_STORAGE_URL` — e.g., `https://YOUR-PROJECT.supabase.co/storage/v1/object/public`
- `NEXT_PUBLIC_CONTACT_PHONE` — phone number for WhatsApp contact (e.g., `+91987xxxxxxx`)

### How uploads work

- Files are sent to Supabase Storage via the REST endpoint using the anon key with `x-upsert`.
- Files are stored under the `toys` path; the resulting public URL is appended to the form.
- On save, the form sends a `PATCH /api/toys/{id}` to store updated fields (including `images`) in MongoDB.
