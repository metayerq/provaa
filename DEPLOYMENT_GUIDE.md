# Production Deployment Guide for Provaa.co

## Overview

This guide will help you deploy your Provaa event booking platform to production using Vercel. The setup includes proper environment variables, build optimization, and future deployment commands.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel`
3. **Environment Variables**: Gather all required keys (listed below)

## Required Environment Variables

### Frontend Variables (VITE_ prefix)
```bash
VITE_SUPABASE_URL=https://vsianzkmvbbaahoeivnx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaWFuemttdmJiYWFob2Vpdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg2MDYsImV4cCI6MjA2MzU3NDYwNn0.wWx7pSYfUJTIMuSvBluxPDgqU8SuKuGI4TQTUOEAKh0
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51RT5oUG1voxjmvkzfaNCQUczawjeKpl2ZLckcmzEvLKKgxBLShSCnmtXbiuebqAXmcJtZKyD54iNmvA2axTk80wt00hZtoyIpn
```

### Edge Function Variables (Set in Supabase)
These are already configured in your Supabase project:
- `STRIPE_SECRET_KEY` - Your live Stripe secret key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_URL` - Your Supabase URL
- `RESEND_API_KEY` - For email functionality

## Step-by-Step Deployment

### 1. Initial Setup

```bash
# Log in to Vercel (if not already logged in)
vercel login

# Deploy for the first time (from your project root)
vercel

# Follow the prompts:
# ? Set up and deploy "~/tastee-event-gatherings-main"? [Y/n] y
# ? Which scope do you want to deploy to? [Your account]
# ? Link to existing project? [Y/n] n
# ? What's your project's name? provaa
# ? In which directory is your code located? ./
```

### 2. Configure Custom Domain

After initial deployment:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain: `provaa.co`
5. Follow DNS configuration instructions

### 3. Set Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add each variable:
   - `VITE_SUPABASE_URL` = `https://vsianzkmvbbaahoeivnx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaWFuemttdmJiYWFob2Vpdm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTg2MDYsImV4cCI6MjA2MzU3NDYwNn0.wWx7pSYfUJTIMuSvBluxPDgqU8SuKuGI4TQTUOEAKh0`
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_51RT5oUG1voxjmvkzfaNCQUczawjeKpl2ZLckcmzEvLKKgxBLShSCnmtXbiuebqAXmcJtZKyD54iNmvA2axTk80wt00hZtoyIpn`

3. Select environments: Production, Preview, Development

## Future Deployment Commands

### Quick Deploy (Recommended)
```bash
# Deploy to production (from your project root)
vercel --prod
```

### Alternative Methods

#### Git-based Deployment (Automatic)
- Connect your GitHub repo to Vercel
- Every push to `main` branch auto-deploys
- Pull requests create preview deployments

#### CLI Deployment
```bash
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Deploy specific environment
vercel --target production
```

## Build Commands Reference

```bash
# Local development
npm run dev

# Production build (test locally)
npm run build
npm run preview

# Check build before deployment
npm run build && npm run preview
```

## Deployment Checklist

Before each deployment:

- [ ] Test locally with `npm run build && npm run preview`
- [ ] Verify all environment variables are set in Vercel
- [ ] Check Supabase edge functions are deployed
- [ ] Verify domain configuration
- [ ] Test payment system in production
- [ ] Check email functionality

## Troubleshooting

### Build Failures
```bash
# Check dependencies
npm install

# Verify build locally
npm run build

# Check for TypeScript errors
npm run lint
```

### Environment Variable Issues
- Ensure all `VITE_` prefixed variables are set in Vercel
- Check Supabase edge function environment variables
- Verify Stripe keys are for live/production mode

### Domain Issues
- Check DNS configuration in your domain provider
- Wait for DNS propagation (up to 24 hours)
- Verify SSL certificate is issued

## Monitoring & Analytics

After deployment:
1. Enable Vercel Analytics in dashboard
2. Monitor Core Web Vitals
3. Set up error tracking
4. Configure performance monitoring

## Backup Strategy

- Environment variables are backed up in this guide
- Database is managed by Supabase (automatic backups)
- Code is in Git repository
- Static assets are served by Vercel CDN

## Support

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Support: [supabase.com/support](https://supabase.com/support)
- This deployment guide: Keep updated with any changes 