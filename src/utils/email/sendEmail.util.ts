import * as nodemailer from 'nodemailer';

export function sendEmail(userEmail: string, subject: string, text: string, html: string) {
	const transporter = nodemailer.createTransport({
		service: 'Outlook',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: userEmail,
		subject: subject,
		text: text,
		html: html,
	}
	
	return transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error', error)
		} else {
			console.log('Email sent', info.response)
		}
	})
}