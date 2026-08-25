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

    // Send email using Cloudflare Email Routing bindings (Free & Unlimited up to Worker limits)
    if (env.SEND_EMAIL) {
      const emailText = `New Contact Form Submission:

Name: ${body.name}
Mobile: ${body.mobile}
Email: ${body.email}
Subject: ${body.subject}

Message:
${body.message}
`;

      try {
        const msg = new EmailMessage(
          "noreply@techilyfly.com",
          env.EMAIL_ALERTS_TO || "support@techilyfly.com",
          "New Contact Form Lead: " + body.subject,
          emailText
        );
        
        await env.SEND_EMAIL.send(msg);
      } catch (e) {
        console.error("Email send failed:", e);
      }
    }

    // Store in Google Sheets via Apps Script Webhook (Free & Unlimited)
    if (env.GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await fetch(env.GOOGLE_SHEET_WEBHOOK_URL, {
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
