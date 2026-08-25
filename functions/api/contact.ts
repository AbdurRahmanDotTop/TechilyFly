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

    // Since we don't have a real Turnstile secret right now, we skip the turnstile fetch 
    // in this scaffold. In production, uncomment and use it.
    /*
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: `secret=${env.TURNSTILE_SECRET}&response=${body['cf-turnstile-response']}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return new Response(JSON.stringify({ error: "Captcha verification failed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    */

    // Insert into D1 (If D1 is bound in production)
    if (env.DB) {
      try {
        await env.DB.prepare(
          "INSERT INTO contacts (name, mobile, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
        ).bind(body.name, body.mobile, body.email, body.subject, body.message).run();
      } catch (dbError) {
        console.error("D1 Insert failed", dbError);
        // Continue anyway to try sending email
      }
    }

    // Send email using a service like Resend or Mailchannels (Mocked here for scaffold)
    // Production should wire up Resend API or similar using fetch()
    
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
