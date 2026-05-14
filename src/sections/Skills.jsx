import { useEffect, useRef } from "react";
import "./Skills.css";

const SKILL_GROUPS = [
  {
    category: "Cloud & Infrastructure",
    icon: "☁",
    skills: [
      { name: "AWS (Lambda, API GW)", level: 90 },
      { name: "Cloud Migration", level: 88 },
      { name: "Linux / Servidores", level: 85 },
      { name: "CI/CD Pipelines", level: 82 },
    ],
  },
  {
    category: "APIs & Backend",
    icon: "⚡",
    skills: [
      { name: "API Management", level: 92 },
      { name: "API Gateway", level: 90 },
      { name: "REST / Microservices", level: 88 },
      { name: "ASP.NET / MVC", level: 75 },
    ],
  },
  {
    category: "Linguagens & Tools",
    icon: "{ }",
    skills: [
      { name: "Bash / Shell Scripting", level: 88 },
      { name: "JavaScript / HTML / CSS", level: 80 },
      { name: "Mainframe / COBOL", level: 72 },
      { name: "Python", level: 78 },
    ],
  },
  {
    category: "AI & Inovação",
    icon: "◎",
    skills: [
      { name: "AI Engineering (MBA)", level: 65 },
      { name: "Multi-agents", level: 60 },
      { name: "Cloud Computing", level: 85 },
      { name: "Sistemas Distribuídos", level: 82 },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);

  useEffect(() => {
    const sectionEl = ref.current;
    const bars = sectionEl.querySelectorAll(".skill-bar-fill");
    const revealEls = sectionEl.querySelectorAll(".reveal");

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          const bar = e.target.querySelector(".skill-bar-fill");
          if (bar) {
            setTimeout(() => {
              bar.style.width = bar.dataset.level + "%";
            }, 200);
          }
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => obs.observe(el));

    // Also observe the bars container
    const barsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          bars.forEach(bar => {
            setTimeout(() => { bar.style.width = bar.dataset.level + "%"; }, 300);
          });
          barsObs.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (sectionEl) barsObs.observe(sectionEl);
    return () => { obs.disconnect(); barsObs.disconnect(); };
  }, []);

  return (
    <div className="skills container" ref={ref}>
      <p className="section-label reveal">03. skills</p>
      <h2 className="section-title reveal">
        Tools of the <span className="accent">trade</span>
      </h2>

      <div className="skills-grid">
        {SKILL_GROUPS.map((group, gi) => (
          <div
            key={group.category}
            className="skill-card card reveal"
            style={{ transitionDelay: `${gi * 0.1}s` }}
          >
            <div className="skill-card-header">
              <span className="skill-icon">{group.icon}</span>
              <span className="skill-category">{group.category}</span>
            </div>

            <div className="skill-list">
              {group.skills.map(skill => (
                <div key={skill.name} className="skill-row">
                  <div className="skill-row-top">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level accent">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      data-level={skill.level}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tech strip */}
      <div className="tech-strip reveal">
        <span className="strip-label">also worked with</span>
        <div className="strip-tags">
          {["AWS Lambda", "API Gateway", "Terraform", "Docker", "Linux", "Bash",
            "Git", "GitHub Actions", "ASP.NET", "SQL", "Cloud OnPremises", "Mainframe"].map(t => (
            <span key={t} className="strip-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
