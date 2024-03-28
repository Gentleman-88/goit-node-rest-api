import nodemailer from "nodemailer";

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.UKR_NET_FROM,
    pass: process.env.UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: process.env.UKR_NET_FROM };
  return transport.sendMail(email);
};

export default sendEmail;
