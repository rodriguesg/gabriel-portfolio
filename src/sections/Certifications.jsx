import { useEffect, useRef } from "react";
import "./Certifications.css";

const CERTS = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    badge: "☁",
    level: "Foundational",
    color: "accent",
  },
];

const EDUCATION = [
  {
    degree: "MBA — AI Engineering & Multi-agents",
    school: "FIAP",
    period: "Abr 2026 — Dez 2026",
    status: "Em andamento",
    icon: "◎",
  },
  {
    degree: "Bacharelado — Ciência da Computação",
    school: "Universidade Presbiteriana Mackenzie",
    period: "2016 — 2020",
    status: "Concluído",
    icon: "▣",
  },
];

export default function Certifications() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="certs container" ref={ref}>
      <p className="section-label reveal">04. credentials</p>
      <h2 className="section-title reveal">
        Certificações & <span className="accent">Formação</span>
      </h2>

      <div className="certs-grid">
        {/* Certificações */}
        <div className="certs-col reveal">
          <h3 className="col-title">
            <span className="col-icon accent">⬡</span>
            Certificações
          </h3>
          {CERTS.map(cert => (
            <div key={cert.name} className="cert-card card">
              <div className="cert-badge">{cert.badge}</div>
              <div className="cert-info">
                <span className="cert-level tag">{cert.level}</span>
                <h4 className="cert-name">{cert.name}</h4>
                <p className="cert-issuer">{cert.issuer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Formação */}
        <div className="edu-col reveal" style={{ transitionDelay: "0.1s" }}>
          <h3 className="col-title">
            <span className="col-icon accent-2">▣</span>
            Formação Acadêmica
          </h3>
          {EDUCATION.map(edu => (
            <div key={edu.degree} className="edu-card card">
              <div className="edu-icon">{edu.icon}</div>
              <div className="edu-info">
                <div className="edu-header">
                  <span className={`edu-status ${edu.status === "Em andamento" ? "active" : ""}`}>
                    {edu.status === "Em andamento" && <span className="glow-dot" />}
                    {edu.status}
                  </span>
                  <span className="edu-period">{edu.period}</span>
                </div>
                <h4 className="edu-degree">{edu.degree}</h4>
                <p className="edu-school">{edu.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
