# Email Configuration Issues - Fixed

## Issues Identified and Fixed

### 1. **Order Validation Issue** ✅ FIXED
**File:** `backend/src/routes/orders.ts` (Line 18)

**Problem:** 
- Email was marked as **required** in validation schema
- But database and logic treated it as **optional**
- This prevented customers from placing orders without email

**Solution:**
```typescript
// Before:
email: z.string().email("Merci de saisir une adresse email valide"),

// After:
email: z.string().email("Merci de saisir une adresse email valide").optional().or(z.literal("")),
```

---

### 2. **Email Encoding Issue** ✅ FIXED
**File:** `backend/src/lib/email.ts` (Lines 50-62)

**Problem:**
- HTML body was **NOT properly base64-encoded** in RFC 822 format
- Variable `utf8Html` was created but never used
- Raw HTML was being sent instead of base64-encoded content
- Missing `Content-Transfer-Encoding: base64` header

**Impact:**
- Emails would fail to send or display incorrectly
- Gmail API might reject improperly formatted messages
- Special characters (French accents, etc.) would break

**Solution:**
```typescript
// Before:
const utf8Html = Buffer.from(html, 'utf-8').toString('base64');
const rawMessage = [
    `From: \"${emailSenderName || 'Store'}\" <${emailGmailUser}>`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${subjectEncoded}?=`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    html,  // ❌ Raw HTML instead of base64
].join('\n');

// After:
const htmlBase64 = Buffer.from(html, 'utf-8').toString('base64');
const rawMessage = [
    `From: \"${emailSenderName || 'Store'}\" <${emailGmailUser}>`,
    `To: ${to}`,
    `Subject: =?utf-8?B?${subjectEncoded}?=`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',  // ✅ Added
    'MIME-Version: 1.0',
    '',
    htmlBase64,  // ✅ Properly encoded
].join('\n');
```

---

## Email System Configuration Checklist

To enable email notifications, configure these settings in **Admin → Settings → Email**:

### Required Fields:
1. ✅ **Email Enabled** - Toggle ON
2. ✅ **Sender Name** - e.g., "MKARIM Store"
3. ✅ **Gmail User** - Your Gmail address (e.g., store@gmail.com)
4. ✅ **Admin Receiver** - Email to receive order notifications
5. ✅ **Client ID** - From Google Cloud Console
6. ✅ **Client Secret** - From Google Cloud Console
7. ✅ **Refresh Token** - OAuth2 refresh token

### How to Get OAuth2 Credentials:

1. **Google Cloud Console** (https://console.cloud.google.com)
   - Create a new project
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **Get Refresh Token**
   - Use OAuth Playground (https://developers.google.com/oauthplayground)
   - Select Gmail API v1 → https://www.googleapis.com/auth/gmail.send
   - Authorize and get refresh token

---

## Testing Email Functionality

### Test Script Available:
Run the test email script:
```bash
cd backend
npx tsx test-email.ts
```

This will:
- Check if settings exist
- Verify all credentials are present
- Attempt to send a test email
- Show detailed error messages if it fails

---

## Email Flow

### When Order is Created:
1. **Customer Email** (if provided):
   - Sends order confirmation
   - Includes order details, items, total
   - Delivery information

2. **Admin Email** (if configured):
   - Sends new order notification
   - Includes all order details
   - Link to admin dashboard

### Email is Skipped When:
- Email system is disabled (`emailEnabled = false`)
- Missing OAuth2 credentials
- Customer didn't provide email (for customer confirmation)
- Admin receiver not configured (for admin notification)

---

## Common Issues & Solutions

### Issue: "Email configuration is missing credentials"
**Solution:** Ensure all 4 OAuth2 fields are filled in settings

### Issue: "Email system is disabled"
**Solution:** Toggle "Activer les emails" switch in settings

### Issue: "Invalid credentials" or "401 Unauthorized"
**Solution:** Refresh token may be expired, generate a new one

### Issue: Emails not arriving
**Solution:** 
- Check spam folder
- Verify Gmail account has "Less secure app access" or proper OAuth setup
- Check backend console logs for errors

---

## Next Steps

1. ✅ **Restart Backend** - Changes applied, restart to take effect
2. ⚠️ **Configure OAuth2** - Set up Gmail API credentials
3. ⚠️ **Test Email** - Run test script or place a test order
4. ⚠️ **Monitor Logs** - Check console for email sending status

---

## Files Modified

1. `backend/src/routes/orders.ts` - Fixed email validation
2. `backend/src/lib/email.ts` - Fixed email encoding

Both fixes are **critical** for email functionality to work properly.
