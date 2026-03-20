import { useState, FormEvent } from "react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Contact.css";

const FORMSPREE_URL = "https://formspree.io/f/xgonqeeq";

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:shantanupatil7@protonmail.com" data-cursor="disable">
                shantanupatil7@protonmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>Bachelor of Data Science — Symbiosis University</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/Shantanu-9901"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/shantanupatil"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/_shantanu_9901/1/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <div className="form-header">
            <span className="form-label">Get In Touch</span>
            <h4>Let's work together</h4>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="New Portfolio Inquiry" />
            <input type="hidden" name="_template" value="table" />
            <div className="form-row">
              <div className="form-group">
                <input type="text" name="Name" id="cf-name" placeholder=" " required data-cursor="disable" />
                <label htmlFor="cf-name">Name</label>
              </div>
              <div className="form-group">
                <input type="email" name="Email" id="cf-email" placeholder=" " required data-cursor="disable" />
                <label htmlFor="cf-email">Email</label>
              </div>
            </div>
            <div className="form-group">
              <input type="tel" name="Phone" id="cf-phone" placeholder=" " data-cursor="disable" />
              <label htmlFor="cf-phone">Phone</label>
            </div>
            <div className="form-group">
              <textarea name="Message" id="cf-message" placeholder=" " rows={5} required data-cursor="disable" />
              <label htmlFor="cf-message">Message</label>
            </div>
            <button type="submit" disabled={status === "sending"} data-cursor="disable">
              <span>{status === "sending" ? "Sending..." : "Send Message"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            {status === "sent" && (
              <div className="form-status success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Message sent! I'll get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="form-status error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
