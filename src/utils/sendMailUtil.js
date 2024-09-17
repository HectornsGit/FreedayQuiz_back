import nodemailer from 'nodemailer'
import dotenv from 'dotenv/config'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env
const { API_KEY, SECRET_KEY } = process.env

const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: API_KEY,
        pass: SECRET_KEY,
    },
})

const sendMailUtil = async (email, subject, body) => {
    const mailOptions = {
        from: SMTP_USER,
        to: email,
        subject: subject,
        text: body,
    }
    try {
        const info = await transport.sendMail(mailOptions)
        console.log('Mensaje enviado:', info.messageId)
    } catch (error) {
        console.error('Error enviando el email:', error)
    }
}

export default sendMailUtil
