export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const { name, email, message, 'cf-turnstile-response': turnstileToken } = data;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Verify Turnstile (Mocked for local dev if secret is not set)
    const SECRET_KEY = context.env.TURNSTILE_SECRET_KEY;
    if (SECRET_KEY && turnstileToken) {
      const formData = new FormData();
      formData.append('secret', SECRET_KEY);
      formData.append('response', turnstileToken);

      const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      });

      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        return new Response(JSON.stringify({ error: 'Turnstile verification failed' }), { status: 400 });
      }
    }

    // Save to D1 Database if bound
    if (context.env.DB) {
      const stmt = context.env.DB.prepare(
        "INSERT INTO contact_submissions (name, email, message, created_at) VALUES (?, ?, ?, datetime('now'))"
      ).bind(name, email, message);
      await stmt.run();
    }

    // Send Email (Using native Cloudflare send_email binding if available, or just log it)
    if (context.env.SEND_EMAIL) {
      // In a real environment, use the send_email binding
      // Example implementation depends on the exact binding spec
      console.log('Would send email via binding to TechilyFly@gmail.com', { name, email, message });
    } else {
      console.log('Email not sent (SEND_EMAIL binding not configured). Submission:', { name, email, message });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
