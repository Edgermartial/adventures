import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const data = JSON.parse(event.body);
  const adminEmail = "yobbyadventures@gmail.com";

  const emailBody = `
    New Chat Message:
    Name: ${data.name || "Guest"}
    Email: ${data.email || "N/A"}
    Message: ${data.message}
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Yobby Adventures <onboarding@resend.dev>",
      to: adminEmail,
      subject: "New Chat Message",
      text: emailBody,
    }),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Message received!" }),
  };
}
