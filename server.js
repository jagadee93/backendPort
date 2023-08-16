require('dotenv').config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 3500;

// server used to send send emails


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);
app.use(express.static("dist"));


const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});



router.post("/api/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  console.log(phone)
  const mail = {
    from: name,
    to: "********@gmail.com",
    subject: "Contact Form Submission - Portfolio",
    html: ` <div style="max-width: 600px; margin: auto; padding: 10px; background-color: #f2f2f2;">
    <h2 style="text-align: center; color: #007bff; margin-top: 0;">Contact Form Submission</h2>
    <p style="font-size: 18px; margin-bottom: 10px;">Name: ${name}</p>
    <p style="font-size: 18px; margin-bottom: 10px;">Email: ${email}</p>
    <p style="font-size: 18px; margin-bottom: 10px;">Phone: ${phone}</p>
    <p style="font-size: 18px; margin-bottom: 20px;">Message: ${message}</p>
    <hr style="border: none; border-top: 2px solid #007bff; margin-top: 30px; margin-bottom: 30px;">
    <p style="text-align: center; font-size: 16px; color: #888;">This message was sent from the portfolio website.</p>
  </div>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      console.log("Message Sent")
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});


app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`));
