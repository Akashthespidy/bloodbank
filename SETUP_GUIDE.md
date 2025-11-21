# Blood Bank System - Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Clerk account (free tier available)
- (Optional) Gmail account for email notifications

## Step 1: Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Clerk Authentication

### 2.1 Create a Clerk Account
1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application
4. Choose your preferred authentication methods (Email, Google, etc.)

### 2.2 Get Your API Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

### 2.3 Configure Environment Variables
1. Create a `.env.local` file in the project root:

```bash
touch .env.local
```

2. Add your Clerk keys to `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Optional: Customize Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Important:** Replace `pk_test_your_key_here` and `sk_test_your_key_here` with your actual Clerk keys!

## Step 3: (Optional) Configure Email Notifications

If you want to send actual email notifications for contact requests:

### 3.1 Set Up Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to **Security** → **App passwords**
4. Generate a new app password for "Mail"
5. Copy the generated password

### 3.2 Add Email Configuration to `.env.local`

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
```

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Features

### Test Authentication
1. Click "Sign Up" in the header
2. Create a new account using email or social login
3. Verify you're redirected and see the user button in the header

### Test Dynamic Area Selection
1. Go to "Register" or "Find Donors"
2. Select a city from the dropdown
3. Verify that the area dropdown updates with areas specific to that city
4. Try changing cities and see areas update dynamically

### Test Contact Donor Form
1. Sign in to your account
2. Go to "Find Donors"
3. Search for donors
4. Click "Contact" on any donor
5. Fill in the structured form:
   - Hospital Name
   - Hospital Address
   - Contact Number
   - Required Time
   - Additional Message
6. Submit and verify success

### Test Bulk Messaging
1. Sign in to your account
2. Go to "Find Donors"
3. Search for donors (e.g., by blood group)
4. Click "Message All" button
5. Enter your message
6. Click "Send to X Donor(s)"
7. Verify success message

## Troubleshooting

### Issue: "Clerk is not configured"
- **Solution:** Make sure you've added your Clerk keys to `.env.local` and restarted the dev server

### Issue: Areas not showing after selecting city
- **Solution:** Clear your browser cache and reload the page

### Issue: Email notifications not sending
- **Solution:** 
  - Verify your Gmail app password is correct
  - Check that 2FA is enabled on your Google account
  - Make sure `EMAIL_USER` and `EMAIL_PASS` are in `.env.local`
  - Check the server console for error messages

### Issue: TypeScript errors in IDE
- **Solution:** These are likely drizzle-orm version conflicts and won't affect functionality. You can:
  - Ignore them (they're type-only errors)
  - Run `npm install` to try resolving dependencies
  - Delete `node_modules` and `package-lock.json`, then run `npm install`

## Features Overview

### ✅ Implemented Features

1. **Clerk Authentication**
   - Sign up / Sign in with email or social providers
   - Protected routes (dashboard, contact pages)
   - User profile management

2. **Dynamic City-Area Selection**
   - 12 major cities of Bangladesh
   - 100+ areas mapped to specific cities
   - Prevents invalid city-area combinations

3. **Structured Contact Form**
   - Hospital name
   - Hospital address
   - Contact number
   - Required time (datetime picker)
   - Additional message
   - Professional email template

4. **Bulk Messaging**
   - Message all donors of a specific blood group
   - Shows donor count before sending
   - Only available to authenticated users

5. **Professional UI**
   - Modern gradient designs
   - Responsive layouts
   - Loading states
   - Error handling
   - Smooth animations

## Next Steps

### Recommended Enhancements

1. **Database Integration**
   - The app currently uses a local database
   - Consider migrating to PostgreSQL or MySQL for production

2. **SMS Notifications**
   - Integrate Twilio or similar service for SMS alerts
   - Add phone number verification

3. **Dashboard**
   - Create a user dashboard showing:
     - Contact request history
     - Donation history
     - Profile management

4. **Admin Panel**
   - User management
   - Donor verification
   - Analytics and reports

5. **Mobile App**
   - React Native app for iOS/Android
   - Push notifications for urgent requests

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure you're using Node.js 18 or higher
4. Try clearing `node_modules` and reinstalling

## Security Notes

- Never commit `.env.local` to version control
- Keep your Clerk secret key private
- Use environment variables for all sensitive data
- Enable rate limiting for production deployment

## Deployment

When ready to deploy:

1. **Vercel (Recommended)**
   ```bash
   npm install -g vercel
   vercel
   ```
   - Add environment variables in Vercel dashboard
   - Connect your GitHub repository for automatic deployments

2. **Other Platforms**
   - Make sure to set all environment variables
   - Use Node.js 18+ runtime
   - Set build command: `npm run build`
   - Set start command: `npm start`

---

**Congratulations! Your Blood Bank Management System is ready to save lives! 🩸❤️**
