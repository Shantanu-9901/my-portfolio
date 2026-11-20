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
                <h4>AI GTM Strategist</h4>
                <h5>QAD | Redzone</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              AI engineering for Revenue Operations. Built Salesforce lead-to-contact
              matching with Apex and the Claude API, cutting conversion turnaround
              from 90 to 7 minutes at 98% match accuracy across 600K leads.
              Connected Claude and Marketo through MCP, taking campaign
              build-to-send from 3 days to 1–2 hours.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI Engineer</h4>
                <h5>Sav.com</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Designed core components of Vibe — an agentic platform that ships
              live websites from prompts in under 2 minutes. Owned the LangGraph
              Intent Agent (~95% routing accuracy) and a recovery framework that
              lifted build success from ~70% to ~97%. Led the async backend:
              FastAPI, distributed Celery workers, streaming.
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
