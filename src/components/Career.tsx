import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <h2>
          My <span>Experience</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI Engineer</h4>
                <h5>Sav.com</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Designed the multi-agent architecture behind Vibe — an agentic platform
              that ships deployable web apps from prompts. Own the backend: FastAPI,
              async pipelines, distributed workers. Built the Intent Agent, bounded
              ReAct loops, and exception handling layer.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>GenAI Engineer</h4>
                <h5>Muks Robotics</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Integrated text, vision, and speech LLM agents into humanoid platforms.
              Built a multilingual speech-to-intent pipeline with interrupt model for
              ISRO-aligned missions. Engineered a 6-axis diamond-polishing robot
              using CV-based defect detection.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Science Intern</h4>
                <h5>Excellarate Infotech</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Full-stack dev on an internal platform (Python, Java, SQL) deployed
              on AWS. Built a data validation layer using statistical anomaly
              detection under the Associate Director of Engineering.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>NLP Engineer Intern</h4>
                <h5>Genpact - Genworth LTC Insurance</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Compared PPO network datasets using FuzzyWuzzy, Levenshtein Distance,
              and BLEU Score. Built a recommendation engine (Matrix Factorization)
              for provider–user matching. Cleaned up the data validation pipeline
              end-to-end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
