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
    <div className="text-center">
      <button
        className="bg-[var(--slider-bg-active)] text-[var(--icon-color-active)] rounded-xl px-4 py-3 text-base cursor-pointer transition-colors duration-200 hover:bg-[var(--icon-color)] hover:text-[var(--button-bg-color)]"
        onClick={() => setContactOpen((prev) => !prev)}
      >
        {contactOpen ? "إغلاق" : "تواصل معي للشكاوى والمقترحات"}
      </button>
      {contactOpen && (
        <form
          className="mt-4 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-2xl p-4 flex flex-col gap-4 animate-fadeIn"
          netlify 
          netlify-honeypot="bot-field"
          name="contact"
          method="POST"
          onSubmit={handleContactSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>

          <label className="flex flex-col gap-2 text-[var(--text-color)]">
            الاسم
            <input
              type="text"
              name="name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--button-border-color)] bg-[var(--card-bg-color)] px-3 py-2 text-base text-[var(--text-color)] outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-[var(--text-color)]">
            الرسالة
            <textarea
              name="message"
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              required
              className="w-full min-h-[100px] resize-y rounded-lg border border-[var(--button-border-color)] bg-[var(--card-bg-color)] px-3 py-2 text-base text-[var(--text-color)] outline-none"
            />
          </label>
          <div className="text-left text-sm text-[var(--icon-color)]">
            <a
              href="https://github.com/mosafa697/azkar"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              للمطورين: يمكنكم أيضًا المساهمة في تنفيذ المشروع على مستودع GitHub
            </a>
          </div>
          {submitStatus === 'success' && (
            <div className="rounded-lg border border-[#10b981] bg-[#ecfdf5] p-3 text-center text-[#047857]">
              ✅ تم إرسال رسالتك بنجاح! شكراً لك
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-3 text-center text-[#b91c1c]">
              ❌ حدث خطأ. تأكد من ملء جميع الحقول وحاول مرة أخرى
            </div>
          )}
          <button
            type="submit"
            className="rounded-lg bg-[var(--slider-bg-active)] px-4 py-3 text-base font-semibold text-[var(--icon-color-active)] transition-colors duration-200 hover:bg-[var(--icon-color)] disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactMe;
