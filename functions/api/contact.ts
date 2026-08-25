// @ts-ignore - cloudflare:email is available in Cloudflare Workers runtime
import { EmailMessage } from "cloudflare:email";

export async function onRequestPost(context: { request: Request, env: any }) {
  try {
    const { request, env } = context;
    const body = (await request.json()) as any;
    
    // Basic validation
    if (!body.name || !body.mobile || !body.email || !body.subject || !body.message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Insert into D1 (If D1 is bound in production)
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO contacts (name, mobile, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
        ).bind(body.name, body.mobile, body.email, body.subject, body.message).run();
      } catch (dbError) {
        console.error("D1 Insert failed", dbError);
      }
    }


    // Store in Google Sheets via Apps Script Webhook (Free & Unlimited)
    const webhookUrl = env.GOOGLE_SHEET_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbxqg8Mqrz-5EqmRZbb5_ziG0-XZEFyh4STiIdTsMalDZ1Bmb9Z0GRmWW2y2D5HvyP_O0Q/exec";
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: body.name,
            mobile: body.mobile,
            email: body.email,
            subject: body.subject,
            message: body.message,
            date: new Date().toISOString()
          }),
        });
      } catch (sheetError) {
        console.error("Google Sheet webhook failed:", sheetError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
