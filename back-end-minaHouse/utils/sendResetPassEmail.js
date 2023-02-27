const {sendEmail} = require('./sendEmail')

const resetPassEmail = async ({name,email,token})=>{
        
      const resetURL = `${process.env.RESET_PASS_URL_FRONT}/users/recover-password/reset-password?token=${token}&email=${email}`
      /*  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`; 
        
      the origin stands for the link that will direct us to the frontend reset pass page and we can get the token and email from the param to give to the back end as headers 
      notice that the FRONTEND URL in the process.env is the base URL of the frontend project after being hosted so we have to specify our routes like in teh first line in this comment  */
      sendEmail( name,email,'Reset Password',`<p>Please click on the following link to go to the reset password page.</p>
      <a href="${resetURL}">Reset Password</a>`)
    }
    module.exports = {resetPassEmail};
