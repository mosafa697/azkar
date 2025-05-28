import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactMe = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  const handleContactSubmit = () => {
    setTimeout(() => {
      setContactName("");
      setContactMsg("");
      setContactOpen(false);
    }, 100);
  };

  return (
    <div className="contact-section">
      <button
        className="contact-collapse-btn"
        onClick={() => setContactOpen((prev) => !prev)}
      >
        {contactOpen ? "إغلاق" : "تواصل معي للشكاوى والمقترحات"}
      </button>
      {contactOpen && (
        <form
          className="contact-form"
          netlify 
          netlify-honeypot="bot-field"
          name="contact"
          method="POST"
          onSubmit={handleContactSubmit}
        >
          {/* Required hidden input for Netlify */}
          <input type="hidden" name="form-name" value="contact" />

          {/* Honeypot field (invisible to users, used to catch bots) */}
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          <label>
            الاسم
            <input
              type="text"
              name="name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="contact-input"
            />
          </label>
          <label>
            الرسالة
            <textarea
              name="message"
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              required
              className="contact-textarea"
            />
          </label>
          <div className="contact-github-link">
            <a
              href="https://github.com/mosafa697/azkar"
              target="_blank"
              rel="noopener noreferrer"
            >
              للمطورين: يمكنكم أيضًا المساهمة في تنفيذ المشروع على مستودع GitHub
            </a>
          </div>
          <button
            type="submit"
            className="contact-submit-btn"
          >
            إرسال
          </button>
        </form>
      )}
      <ToastContainer rtl position="top-center" />
    </div>
  );
};

export default ContactMe;
