const sgMail = require('@sendgrid/mail')


const sendEmail = async (receiverName,receiverEmail,emailSubject,emailBodyInHtml)=>{
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)       
        const msg = {
          to: `${receiverEmail}`, // email which we are sending to 
          from: {   //this object is to specify a name to the sender instead of the actual email appearing to users
                name:'MINA HOUSE',
                email:'mohammad.talaat555@gmail.com'// sender Email and will be changed  to your verified sender from send grid on production 
            },
          subject: emailSubject,
        //   text: 'Please hit the following link to go to the rest page ',
          html: `
          <img src="https://res.cloudinary.com/dzwysoql5/image/upload/v1648065553/Mina_1_ftuilj.png"  />

          <h4>Hello, ${receiverName}</h4>
          ${emailBodyInHtml}`,
        }
          await sgMail.send(msg)
}
 
    module.exports = {sendEmail};
