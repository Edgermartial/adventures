import fetch from "node-fetch";

let storedMessages = []; // Basic in-memory store (resets on each deploy)

export async function handler(event) {
  const adminPass = process.env.ADMIN_PASS || "admin123";

  // Login check
  if (event.queryStringParameters?.check) {
    const ok = event.queryStringParameters.pass === adminPass;
    return { statusCode: 200, body: JSON.stringify({ success: ok }) };
  }

  // List messages/bookings
  if (event.queryStringParameters?.action === "list") {
    return { statusCode: 200, body: JSON.stringify({ items: storedMessages }) };
  }

  // Send reply
  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body);

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Yobby Adventures <onboarding@resend.dev>",
        to: data.email,
        subject: "Reply from Yobby Adventures",
        text: data.message,
      }),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true, message: "Reply sent!" }) };
  }

  return { statusCode: 400, body: "Invalid request" };
}
