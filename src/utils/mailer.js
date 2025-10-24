import nodemailer from 'nodemailer';
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js';


let transporter;


export async function getTransporter() {
    if(transporter) return transporter;

    if(env.smtpHost && env.smtpUser && env.smtpPass) {
        transporter = nodemailer.createTransport({
            host: env.smtpHost,
            port: env.smtpPort,
            secure: env.smtpPort === 465,
            auth: { user: env.smtpUser, pass: env.smtpPass }
        });
        return transporter;
    }

    const test = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user: test.user, pass: test.pass }
    }); 
    logger.warn('Using Ethereal SMTP (dev). Emails are not delivered to real inbox.');
    return transporter;
}

export async function sendMail({ to, subject, html }) {
    const tx = await (await getTransporter()).sendMail({
        from: env.smtpFrom,
        to, subject, html
    });
    if(nodemailer.getTestMessageUrl(tx)) {
        console.log('Email preview:', nodemailer.getTestMessageUrl(tx))
    }
    return tx;
}
