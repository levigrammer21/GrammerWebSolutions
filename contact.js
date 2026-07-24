(() => {
  const PUBLIC_KEY = "pZXYHk_x0rmq9Wsl4";
  const SERVICE_ID = "service_ls823cb";
  const OWNER_TEMPLATE_ID = "template_2tjzwar";
  const REPLY_TEMPLATE_ID = "template_gr9j9dm";

  const form = document.getElementById("quote-form");
  const status = document.getElementById("form-status");

  if (!form || !status) return;

  const showStatus = (type, message) => {
    status.className = `form-status full-field ${type}`;
    status.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.website?.value) return;
    if (!form.reportValidity()) return;

    if (!window.emailjs) {
      showStatus("error", "The contact service did not load. Please try again or email levigrammer@gmail.com.");
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    const data = Object.fromEntries(new FormData(form).entries());

    const params = {
      name: data.name || "",
      user_name: data.name || "",
      from_name: data.name || "",
      business: data.business || "",
      business_name: data.business || "",
      email: data.email || "",
      user_email: data.email || "",
      from_email: data.email || "",
      reply_to: data.email || "",
      phone: data.phone || "Not provided",
      phone_number: data.phone || "Not provided",
      project: data.project || "",
      project_type: data.project || "",
      message: data.message || "",
      to_name: data.name || "",
      to_email: data.email || "",
      owner_email: "levigrammer@gmail.com"
    };

    button.disabled = true;
    button.textContent = "Sending…";
    showStatus("sending", "Sending your message…");

    try {
      emailjs.init({ publicKey: PUBLIC_KEY });

      // The owner notification is the required send.
      await emailjs.send(SERVICE_ID, OWNER_TEMPLATE_ID, {
        ...params,
        to_name: "Levi Grammer",
        to_email: "levigrammer@gmail.com"
      });

      // A confirmation failure should not make a successfully delivered inquiry look failed.
      try {
        await emailjs.send(SERVICE_ID, REPLY_TEMPLATE_ID, params);
      } catch (replyError) {
        console.warn("EmailJS customer confirmation failed:", replyError);
      }

      form.reset();
      showStatus("success", "Message sent successfully. We’ll be in touch soon.");
    } catch (error) {
      console.error("EmailJS owner notification failed:", error);
      const detail = error?.text || error?.message || "Unknown EmailJS error";
      console.error("EmailJS detail:", detail);
      showStatus("error", "The message could not be sent. Please email levigrammer@gmail.com directly.");
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
})();
