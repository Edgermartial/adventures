import fetch from "node-fetch";

export async function handler(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  const data = JSON.parse(event.body);
  const adminEmail = "yobbyadventures@gmail.com";

  // Email via Resend API
  const emailBody = `
    New Booking Received!
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Package: ${data.package}
    Date: ${data.date}
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
      subject: "New Booking Received",
      text: emailBody,
    }),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Booking received!" }),
  };
}
