import { createTransport } from 'nodemailer'

const transport = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})

const FROM = process.env.SMTP_FROM

if (process.env.NODE_ENV !== 'test') {
  transport.verify()
    .then(() => console.log("mailer conncted"))
    .catch(() => console.log("mailer error: make sure you have SMTP_ env vars set"))
}


const sendMail = async (to, subject, text) => {
  const msg = { from: FROM, to, subject, text }
  await transport.sendMail(msg)
}
