import nodemailer from 'nodemailer'
import CONFIG from '../config'

export const sendMail = async (from, to, subject, html) => {
    try {
        const transporter = await nodemailer.createTransport({
            service: 'Mailgun',
            auth: {
                pass: CONFIG.SMTP_PASS,
                user: CONFIG.SMTP_USER
            }
        })
        const mailOpts = {
            from: from,
            to: to,
            subject: subject,
            html: html
        }
    try {
        const result = await transporter.sendMail(mailOpts)
        return result.response && result.response.split(' ')[0]==='250'?true:false
    }
    catch (error) {
        console.log(error)
        return { error }
    }
}
    catch (error) {
        console.log(error)
        return { error }
    }
}

