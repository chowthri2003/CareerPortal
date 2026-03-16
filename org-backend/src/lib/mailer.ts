import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendApplicationMail = async (
  to: string,
  name: string,
  jobTitle: string
) => {
  await transporter.sendMail({
    from: `"HR Team" <${process.env.MAIL_USER}>`,
    to,
    subject: "Application Received",
    html: `
      <h2>Hi ${name},</h2>
      <p>Thank you for applying for the position of <b>${jobTitle}</b>.</p>
      <p>Our team will review your application and contact you soon.</p>
      <br/>
      <p>Regards,<br/>HR Team</p>
    `,
  });
};

export const sendStatusUpdateMail = async (
  to: string,
  name: string,
  jobTitle: string,
  status: string
) => {
  let message = "";

  if (status === "Rejected") {
    message = `
      <p>We appreciate your interest in <b>${jobTitle}</b>.</p>
      <p>After careful review, we regret to inform you that you were not selected.</p>
      <p>We encourage you to apply for future opportunities.</p>
    `;
  }

  if (status === "Offered") {
    message = `
      <p>Congratulations </p>
      <p>You have been selected for the role of <b>${jobTitle}</b>.</p>
      <p>Our HR team will contact you with next steps.</p>
    `;
  }

  await transporter.sendMail({
    from: `"HR Team" <${process.env.MAIL_USER}>`,
    to,
    subject: `Application Status Update - ${jobTitle}`,
    html: `
      <h2>Hi ${name},</h2>
      ${message}
      <br/>
      <p>Regards,<br/>HR Team</p>
    `,
  });
};