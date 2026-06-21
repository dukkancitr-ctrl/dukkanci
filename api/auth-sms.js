// MOVED. The Supabase "Send SMS" Auth Hook (WhatsApp OTP via Meta) is now handled
// inside api/notify-order.js as `?action=auth-sms`, to stay within the Vercel
// Hobby-plan limit of 12 Serverless Functions.
//
// Configure the Supabase hook URL as:
//   https://www.dukkanci.com.tr/api/notify-order?action=auth-sms
//
// This file is excluded from deployment via .vercelignore and is kept only as a
// pointer. It intentionally exports nothing.
module.exports = {};
