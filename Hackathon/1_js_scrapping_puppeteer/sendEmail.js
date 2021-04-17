let nodemailer= require("nodemailer");

//step-1
let transporter= nodemailer.createTransport({
  service:'gmail',
  auth:{
      user:'heathledgerakajoker@gmail.com',
      pass:'ledger2008'
  }
});

//step-2
let mailOptions={
  from:'heathledgerakajoker@gmail.com',
  to:'tommycruise1997@gmail.com',
  subject:'TesTing and Test',
  text:'Mail Send',
  attachments:[
    { filename: 'satya niketan.pdf', path:'./satya niketan.pdf'}
  ]
}

//step-3
transporter.sendMail(mailOptions,function(err,data){
  if(err){
    console.log("error "+err);
  }else{
    console.log("Mail sent successfully!!");
  }
})
