import React, { useState } from "react";

const ContactMe = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!contactName.trim() || !contactMsg.trim()) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Let the form submit naturally to Netlify, but add visual feedback
      const formData = new FormData(e.target);
      
      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Clear form on successful submission
        setContactName("");
        setContactMsg("");
        // Auto-close form after success
        setTimeout(() => {
          setContactOpen(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.warn('Form submission error:', error);
      setSubmitStatus('error');
      // Clear error status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="submit-success" style={{ 
              color: '#10b981', 
              textAlign: 'center', 
              margin: '10px 0',
              padding: '8px',
              backgroundColor: '#ecfdf5',
              borderRadius: '4px',
              border: '1px solid #10b981'
            }}>
              ✅ تم إرسال رسالتك بنجاح! شكراً لك
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="submit-error" style={{ 
              color: '#ef4444', 
              textAlign: 'center', 
              margin: '10px 0',
              padding: '8px',
              backgroundColor: '#fef2f2',
              borderRadius: '4px',
              border: '1px solid #ef4444'
            }}>
              ❌ حدث خطأ. تأكد من ملء جميع الحقول وحاول مرة أخرى
            </div>
          )}

          <button
            type="submit"
            className="contact-submit-btn"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactMe;
