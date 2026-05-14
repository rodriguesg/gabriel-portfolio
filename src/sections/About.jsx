import { useEffect, useRef } from "react";
import "./About.css";

export default function About() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="about container" ref={ref}>
      <div className="about-grid">
        <div className="about-left">
          <p className="section-label reveal">01. about</p>
          <h2 className="section-title reveal">
            Building systems that<br />
            <span className="accent">actually scale.</span>
          </h2>
          <div className="about-text reveal">
            <p>
              Sou <strong>Engenheiro de Software Sênior</strong> no Itaú Unibanco, onde construí
              minha carreira inteira ao longo de 8 anos — de estagiário a liderança técnica.
              Atuo na governança e evolução de APIs em ambientes Cloud e OnPremises.
            </p>
            <p>
              Minha expertise está na migração de serviços legados para AWS, arquitetura de
              APIs escaláveis e automação de infraestrutura. Trabalho diariamente com sistemas
              que impactam milhões de clientes do maior banco privado da América Latina.
            </p>
            <p>
              Atualmente cursando MBA em AI Engineering &amp; Multi-agents na FIAP, explorando
              como inteligência artificial pode transformar engenharia de plataforma. Bacharel
              em Ciência da Computação pela Universidade Presbiteriana Mackenzie.
            </p>
          </div>

          <div className="about-links reveal">
            <a href="https://github.com/rodriguesg" className="about-link" target="_blank" rel="noopener noreferrer">
              <span className="link-icon">⌥</span> GitHub
            </a>
            <a href="https://www.linkedin.com/in/gabriel-rodrigues-de-souza-40a051110/" className="about-link" target="_blank" rel="noopener noreferrer">
              <span className="link-icon">in</span> LinkedIn
            </a>
          </div>
        </div>

        <div className="about-right reveal">
          <div className="avatar-block">
            <div className="avatar-frame">
              <div className="avatar-placeholder">
                <span>GR</span>
              </div>
              <div className="avatar-border" />
            </div>
          </div>

          <div className="about-facts">
            {[
              { label: "Location", value: "São Paulo, SP — Brazil" },
              { label: "Company", value: "Itaú Unibanco · 8 anos" },
              { label: "MBA", value: "AI Engineering — FIAP (2026)" },
              { label: "Graduação", value: "Ciência da Computação — Mackenzie" },
            ].map(({ label, value }) => (
              <div key={label} className="fact-row">
                <span className="fact-label">{label}</span>
                <span className="fact-sep">→</span>
                <span className="fact-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
