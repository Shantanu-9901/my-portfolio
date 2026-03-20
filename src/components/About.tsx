import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I work on multi-agent AI systems — the kind that take a text prompt
          and actually produce working software from it. Currently the engineer
          behind agent orchestration at Sav.com's Vibe Platform, where I designed
          intent classification, pipeline routing, and exception handling for
          production. Previously built multilingual speech-to-intent systems and
          LLM-driven robotics at Muks Robotics for ISRO-aligned space missions.
          AWS Solutions Architect certified.
        </p>
      </div>
    </div>
  );
};

export default About;
