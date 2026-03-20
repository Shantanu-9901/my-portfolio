import { MdArrowOutward } from "react-icons/md";
import { smoother } from "./Navbar";
import "./styles/Footer.css";

const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (window.innerWidth > 1024 && smoother) {
      e.preventDefault();
      smoother.scrollTo(section, true, "top top");
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-container section-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo"><span className="logo-s">S</span><span className="logo-p">P</span></span>
            <p>AI Engineer crafting intelligent systems and seamless experiences.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Navigate</h4>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about")}>About</a>
              <a href="#experience" onClick={(e) => handleNavClick(e, "#experience")}>Experience</a>
              <a href="#work" onClick={(e) => handleNavClick(e, "#work")}>Work</a>
              <a href="#blog" onClick={(e) => handleNavClick(e, "#blog")}>Blog</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>Contact</a>
            </div>
            <div className="footer-col">
              <h4>Social</h4>
              <a href="https://github.com/Shantanu-9901" target="_blank" rel="noopener noreferrer">
                Github <MdArrowOutward />
              </a>
              <a href="https://www.linkedin.com/in/shantanupatil" target="_blank" rel="noopener noreferrer">
                LinkedIn <MdArrowOutward />
              </a>
              <a href="https://www.instagram.com/_shantanu_9901/1/" target="_blank" rel="noopener noreferrer">
                Instagram <MdArrowOutward />
              </a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:shantanupatil7@protonmail.com">shantanupatil7@protonmail.com</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Shantanu Patil. All rights reserved.</p>
          <p>Designed & Developed by <span>Shantanu Patil</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
