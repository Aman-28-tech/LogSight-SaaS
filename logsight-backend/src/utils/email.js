const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing. Simulating email:", options);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "LogSight <onboarding@resend.dev>",
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Resend Error: ${JSON.stringify(errorData)}`);
  }
};

export default sendEmail;

