const nodemailer = require("nodemailer")
let debug = require("debug-levels")("NodeMailer")
const AppConfig = require('./AppConfig')


const NodeMailer = {

  async sendEmail () {
    const transporter = await nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      ecure: false,
      requireTLS: true,
      auth: {
        user: AppConfig.Email,
        pass: AppConfig.PASSWORD
      }
    })
    
    const mailOptions = {
      from: AppConfig.Email,
      to: 'ahsan_awan343@yahoo.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    }
    
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        debug.info(error)
      } else {
        debug.info('Email sent: ' + info.response)
      }
    })
  },

  async createPackageEmail (data) {

  },

  async createHotelEmail (data) {
    
  }

}

module.exports = NodeMailer