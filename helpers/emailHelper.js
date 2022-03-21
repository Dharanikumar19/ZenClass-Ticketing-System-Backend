const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

const send = (info) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const emailProcessor = ({ email, pin, type }) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: process.env.USER, // sender address
        to: email, // list of receivers
        subject: "Password Reset", // Subject line
        text:
          "Here is your password rest pin" +
          pin +
          "Use this pin to update your password. This pin will expires in One day", // plain text body
        html: `<b>Hello User</b>
        Here is your Password Reset Pin 
        <b>${pin} </b>
        ,This pin will expires in One day
        <p></p>`, // html body
      };

      send(info);
      break;

    case "update-password-success":
      info = {
        from: process.env.USER, // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: "Your new password has been updated successfully", // plain text body
        html: `<b>Hello </b>
         
        <p>Your new password has been updated successfully</p>`, // html body
      };

      send(info);
      break;

    default:
      break;
  }
};



module.exports = { emailProcessor }