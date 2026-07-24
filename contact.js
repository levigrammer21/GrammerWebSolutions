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

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const errorMessage = (error) => {
    const code = error?.status ? `EmailJS ${error.status}` : "EmailJS error";
    const detail = error?.text || error?.message || String(error || "Unknown error");
    return `${code}: ${detail}`;
  };

  if (window.emailjs) {
    emailjs.init({ publicKey: PUBLIC_KEY });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.elements.website?.value) return;
    if (!form.reportValidity()) return;

    if (!window.emailjs) {
      showStatus("error", "EmailJS failed to load. Check your connection and reload the page.");
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
      owner_name: "Levi Grammer",
      owner_email: "levigrammer@gmail.com",
      to_name: "Levi Grammer",
      to_email: "levigrammer@gmail.com"
    };

    button.disabled = true;
    button.textContent = "Sending…";
    showStatus("sending", "Sending your message…");

    try {
      const ownerResponse = await emailjs.send(
        SERVICE_ID,
        OWNER_TEMPLATE_ID,
        params,
        { publicKey: PUBLIC_KEY }
      );

      if (ownerResponse.status !== 200) {
        throw new Error(`Owner notification returned ${ownerResponse.status}: ${ownerResponse.text}`);
      }

      // EmailJS allows one request per second. Waiting prevents the auto-reply
      // from being rejected with HTTP 429 immediately after the owner email.
      await wait(1200);

      try {
        await emailjs.send(
          SERVICE_ID,
          REPLY_TEMPLATE_ID,
          {
            ...params,
            to_name: data.name || "Customer",
            to_email: data.email || ""
          },
          { publicKey: PUBLIC_KEY }
        );
      } catch (replyError) {
        console.warn("Customer auto-reply failed:", replyError);
      }

      form.reset();
      showStatus("success", "Message sent successfully. We’ll be in touch soon.");
    } catch (error) {
      const detail = errorMessage(error);
      console.error(detail, error);
      showStatus("error", `${detail}. Please email levigrammer@gmail.com directly.`);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
})();
