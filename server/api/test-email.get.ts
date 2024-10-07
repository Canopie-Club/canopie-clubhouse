import { defineEventHandler } from 'h3'
import { sendEmail } from '#common/server/utils/email'
import dotenv from 'dotenv'

dotenv.config()

export default defineEventHandler(async () => {
  //   return {
  //     pass: process.env.SMTP_PASSWORD,
  //     user: process.env.SMTP_USERNAME,
  //   }
  
  const body = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .content {
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              font-size: 0.9em;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Canopie Club</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>This is a test email from the Canopie Club. We are excited to have you on board!</p>
              <p>Best regards,<br/>The Canopie Club Team</p>
            </div>
            <div class="footer">
              <p>&copy; 2023 Canopie Club. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

  return await sendEmail('canopie.club@gmail.com', 'This is a test from the clubhouse!', body)
})
