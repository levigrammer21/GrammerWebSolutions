(() => {
  const PUBLIC_KEY="pZXYHk_x0rmq9Wsl4";
  const SERVICE_ID="service_ls823cb";
  const OWNER_TEMPLATE_ID="template_2tjzwar";
  const REPLY_TEMPLATE_ID="template_gr9j9dm";
  const form=document.getElementById("quote-form");
  const status=document.getElementById("form-status");
  if(!form||!status||!window.emailjs)return;
  emailjs.init({publicKey:PUBLIC_KEY});
  form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    if(form.website?.value)return;
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');
    const original=button.textContent;
    button.disabled=true;button.textContent="Sending…";
    status.className="form-status sending";status.textContent="Sending your message…";
    const data=Object.fromEntries(new FormData(form).entries());
    const params={
      name:data.name||"", business:data.business||"", email:data.email||"",
      phone:data.phone||"Not provided", project:data.project||"", message:data.message||"",
      reply_to:data.email||"", to_email:"levigrammer@gmail.com"
    };
    try{
      await emailjs.send(SERVICE_ID,OWNER_TEMPLATE_ID,params);
      await emailjs.send(SERVICE_ID,REPLY_TEMPLATE_ID,params);
      form.reset();status.className="form-status success";status.textContent="Message sent. Check your inbox for confirmation.";
    }catch(error){
      console.error("EmailJS error",error);status.className="form-status error";status.textContent="The message could not be sent. Please email levigrammer@gmail.com directly.";
    }finally{button.disabled=false;button.textContent=original;}
  });
})();
