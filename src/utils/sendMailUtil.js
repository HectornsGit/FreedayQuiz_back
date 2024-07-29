import nodemailer from 'nodemailer'
import dotenv from 'dotenv/config'
import { generateError } from './index.js'
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env

//Conexión al encargado de enviar los correos:
const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
})

//Efectuar el envío al correo del usuario:
const sendMailUtil = async (email, subject, body) => {
    const mailOptions = {
        from: SMTP_USER,
        to: email,
        subject: subject,
        text: body,
    }
    try {
        const info = await transport.sendMail(mailOptions) //Esto es incorporado, como res.send() en los endpoints
        console.log('Mensaje enviado al usuario', info.messageId)
    } catch (error) {
        console.error('Error enviando el email:', error)
        generateError(error.message)
    }
}
export default sendMailUtil
