const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

const EMAIL = "<from_email_address>";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/sendEmail", async (req, res) => {
  let { name, email, companyname, tel, comments } = req.body;
  name = (name || "").trim();
  email = (email || "").trim();
  companyname = (companyname || "").trim();

  if (!name)
    return res.send(
      '<div class="error_message">You must enter your name.</div>'
    );
  if (!email)
    return res.send(
      '<div class="error_message">Please enter a valid email address.</div>'
    );
  if (!companyname)
    return res.send(
      '<div class="error_message">You must enter company name.</div>'
    );

  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com", //aws SES service hostname
    port: 587,
    auth: {
      user: "<user_name>",
      pass: "<pass>",
    },
  });
  const info = await transporter.sendMail({
    from: EMAIL,
    to: EMAIL,
    subject: `You have been contacted by ${name}`,
    html: `
      You have been contacted by ${name} with the following message:<br/><br/>
      ${comments}<br/>
      Company Name: ${companyname}<br/>
      Telephone: ${tel}<br/>
      <br/>
      You can contact ${name} at ${email}
    `,
  });
  console.log("Message sent: ", info.messageId);

  let r = `<fieldset align="center">`;
  r += "<div id='success_page'>";
  r += "<h3 class='succes_message'>Email Sent Successfully.</h3>";
  r += `<p>Thank you <strong>${name}</strong>, your message has been submitted to us.</p>`;
  r += "</div>";
  r += "</fieldset>";
  res.send(r);
});

app.listen(3035, function () {
  console.log("App listening on port 3035!");
});
