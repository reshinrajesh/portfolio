---
description: How to deploy the portfolio website to Vercel or Netlify
---

# Deploying Your Portfolio

Since this is a Next.js application, the easiest and recommended way to deploy is using **Vercel** (the creators of Next.js). Netlify is also a great option.

## Option 1: Vercel (Recommended)

1.  **Push to GitHub**:
    -   Make sure your project is pushed to a GitHub repository.
    -   If you haven't initialized git yet:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        # Then follow GitHub's instructions to push to a new repo
        ```

2.  **Deploy**:
    -   Go to [Vercel.com](https://vercel.com) and sign up/login.
    -   Click **"Add New..."** -> **"Project"**.
    -   Import your GitHub repository.
    -   Vercel will detect it's a Next.js project automatically.
    -   Click **"Deploy"**.

3.  **Done!** Vercel will give you a live URL (e.g., `reshin-portfolio.vercel.app`).

## Option 2: Netlify

1.  **Push to GitHub** (same as above).
2.  **Deploy**:
    -   Go to [Netlify.com](https://netlify.com) and sign up/login.
    -   Click **"Add new site"** -> **"Import from Git"**.
    -   Choose GitHub and select your repository.
    -   Netlify should detect the build settings (Build command: `npm run build`, Publish directory: `.next`). *Note: You might need to install the "Next.js on Netlify" plugin if it doesn't auto-detect.*
    -   Click **"Deploy"**.

## Manual Build (for other hosts)

If you are hosting on a traditional VPS or other platform:

4.  Run `npm start` to start the production server.

## Connecting a GoDaddy Domain (Recommended)

If you own a domain on GoDaddy (e.g., `reshinrajesh.in`), the best way is to host the site on **Vercel** and point your domain to it.

1.  Follow **Option 1** above to deploy your site to Vercel.
2.  In your Vercel Project Dashboard:
    -   Go to **Settings** > **Domains**.
    -   Enter your domain (e.g., `reshinrajesh.in`) and click **Add**.
    -   Vercel will give you a list of DNS records (usually an **A Record** or **CNAME**).
3.  Go to **GoDaddy**:
    -   Login and go to **My Products** > **Domains**.
    -   Click **DNS** or **Manage DNS** next to your domain.
    -   **Add/Edit the records** to match what Vercel provided.
        -   Type: `A` | Name: `@` | Value: `76.76.21.21` (Example, check Vercel for exact IP).
        -   Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`.
4.  Wait for propagation (usually 5-30 mins). Your GoDaddy domain will now show your Vercel site!
