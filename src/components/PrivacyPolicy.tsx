import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import "./styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-section">
      <div className="privacy-container">
        <Link to="/" className="privacy-back">
          <MdArrowBack /> Back to Home
        </Link>

        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-updated">Last updated: March 20, 2026</p>

        <div className="privacy-content">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Shantanu Patil's portfolio website. Your privacy is important to me. 
            This Privacy Policy explains how I collect, use, and protect your information when 
            you visit this website or use the contact form.
          </p>

          <h2>2. Information I Collect</h2>
          <h3>Contact Form Data</h3>
          <p>
            When you submit the contact form, I collect the following information:
          </p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number (optional)</li>
            <li>Message content</li>
          </ul>
          <p>
            This data is processed through <a href="https://formspree.io" target="_blank" rel="noopener noreferrer">Formspree</a>, 
            a third-party form handling service. Please refer to Formspree's privacy policy for details on how they handle your data.
          </p>

          <h3>Analytics Data</h3>
          <p>
            This website uses Vercel Analytics to collect anonymous usage data such as page views 
            and visitor counts. No personally identifiable information is collected through analytics.
          </p>

          <h2>3. How I Use Your Information</h2>
          <p>The information collected through the contact form is used solely to:</p>
          <ul>
            <li>Respond to your inquiries</li>
            <li>Communicate about potential collaborations or opportunities</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>
            I do not sell, trade, or share your personal information with third parties, except as 
            necessary to process your contact form submission through Formspree.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            Contact form submissions are retained only as long as necessary to respond to your 
            inquiry. You may request deletion of your data at any time by emailing me at{" "}
            <a href="mailto:shantanupatil7@protonmail.com">shantanupatil7@protonmail.com</a>.
          </p>

          <h2>6. Cookies</h2>
          <p>
            This website does not use cookies for tracking or advertising purposes. Vercel Analytics 
            operates without cookies.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            This website contains links to external sites (GitHub, LinkedIn, Instagram). I am not 
            responsible for the privacy practices of these external sites.
          </p>

          <h2>8. Security</h2>
          <p>
            I take reasonable measures to protect the information you provide. However, no method of 
            transmission over the internet is 100% secure. I cannot guarantee absolute security of your data.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            I may update this Privacy Policy from time to time. Any changes will be reflected on this 
            page with an updated revision date.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact me at{" "}
            <a href="mailto:shantanupatil7@protonmail.com">shantanupatil7@protonmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
