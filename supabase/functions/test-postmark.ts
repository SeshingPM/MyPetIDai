// supabase/functions/test-postmark.ts
Deno.env.set("POSTMARK_API_TOKEN", "61dbce8c-8e0d-4ece-94a7-70b167ff108f");

import { ServerClient } from "https://esm.sh/postmark";

const apiToken = Deno.env.get("POSTMARK_API_TOKEN");

if (!apiToken) {
  console.error("❌ Missing POSTMARK_API_TOKEN in environment");
  Deno.exit(1);
}

const postmarkClient = new ServerClient(apiToken);

const testEmail = async () => {
  try {
    const result = await postmarkClient.sendEmail({
      From: "support@petdocument.com", // must be verified in Postmark
      To: "vinny@petdocument.com", // <-- replace with your actual inbox for testing
      Subject: "✅ Postmark Test Email",
      HtmlBody: `
        <h1>This is a test email from Postmark</h1>
        <p>If you're seeing this, Postmark is working!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      MessageStream: "outbound",
    });

    console.log("✅ Email sent successfully:", result);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

testEmail();
