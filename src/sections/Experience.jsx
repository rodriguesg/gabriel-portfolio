import { useEffect, useRef, useState } from "react";
import "./Experience.css";

const EXPERIENCES = [
  {
    id: "job1",
    role: "Engenheiro de Software Sênior",
    company: "Itaú Unibanco",
    period: "Nov 2024 — Presente",
    type: "Híbrido",
    color: "accent",
    items: [
      "Liderança técnica na evolução de APIs e serviços críticos para o maior banco privado da América Latina, impactando milhões de clientes",
      "Arquitetura e governança de APIs em ambientes Cloud e OnPremises, garantindo alta disponibilidade e conformidade com padrões corporativos",
      "Condução de iniciativas de modernização de plataforma, orquestrando migração de serviços legados para AWS com zero downtime",
      "Mentoria de engenheiros juniores e plenos, promovendo boas práticas de engenharia de software e code review",
    ],
    tags: ["AWS", "API Gateway", "Cloud", "Bash", "Lambda", "Arquitetura"],
  },
  {
    id: "job2",
    role: "Engenheiro de Software Pleno",
    company: "Itaú Unibanco",
    period: "Jun 2022 — Dez 2024",
    type: "Full-time",
    color: "accent-2",
    items: [
      "Protagonismo na migração de serviços OnPremises para AWS, redesenhando APIs para arquitetura cloud-native com ganhos de performance e redução de custos operacionais",
      "Governança end-to-end de APIs legadas em Cloud OnPremises, assegurando estabilidade e SLAs para aplicações de missão crítica do banco",
      "Automação de pipelines de deploy e provisionamento de infraestrutura com Bash e AWS Lambda, reduzindo intervenções manuais significativamente",
      "Colaboração com times de segurança e compliance para adequação de APIs às políticas regulatórias do setor financeiro",
    ],
    tags: ["AWS", "API Management", "Bash", "Lambda", "Cloud Migration", "CI/CD"],
  },
  {
    id: "job3",
    role: "Analista de Sistemas Jr",
    company: "Itaú Unibanco",
    period: "Dez 2018 — Jun 2022",
    type: "Full-time",
    color: "accent-warm",
    items: [
      "Desenvolvimento e manutenção de sistemas de alta e baixa plataforma, atuando em ambientes de Mainframe e aplicações distribuídas",
      "Participação no ciclo completo de desenvolvimento — do pré-projeto à pós-entrega — em soluções de Cloud Computing",
      "Experiência prática com Linux e administração de ambientes, sustentando aplicações críticas do ecossistema bancário",
      "Atuação cross-functional com equipes de negócio e tecnologia para traduzir requisitos em soluções técnicas escaláveis",
    ],
    tags: ["Linux", "Mainframe", "Cloud Computing", "Sistemas Distribuídos"],
  },
  {
    id: "job4",
    role: "Estagiário de Desenvolvimento",
    company: "Itaú Unibanco",
    period: "Jun 2018 — Dez 2018",
    type: "Estágio",
    color: "accent",
    items: [
      "Primeiros passos em desenvolvimento corporativo dentro de um dos maiores bancos do mundo",
      "Suporte ao time de desenvolvimento em manutenção e evolução de sistemas internos",
    ],
    tags: ["Desenvolvimento", "Sistemas Internos"],
  },
  {
    id: "job5",
    role: "Estagiário",
    company: "FIESP",
    period: "Mai 2017 — Jun 2018",
    type: "Estágio",
    color: "accent-2",
    items: [
      "Desenvolvimento e manutenção de plataformas web, atuando tanto no front-end quanto no back-end com arquitetura MVC",
      "Construção de interfaces e serviços utilizando ASP.NET, participando de todo o ciclo de vida das aplicações",
      "Primeira experiência profissional em engenharia de software, desenvolvendo base sólida em desenvolvimento web",
    ],
    tags: ["ASP.NET", "MVC", "HTML", "CSS", "JavaScript", "Web"],
  },
];

export default function Experience() {
  const [active, setActive] = useState("job1");
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const current = EXPERIENCES.find(e => e.id === active);

  return (
    <div className="experience container" ref={ref}>
      <p className="section-label reveal">02. experience</p>
      <h2 className="section-title reveal">Where I've worked</h2>

      <div className="exp-layout reveal">
        <div className="exp-tabs">
          {EXPERIENCES.map(exp => (
            <button
              key={exp.id}
              className={`exp-tab ${active === exp.id ? "active" : ""}`}
              onClick={() => setActive(exp.id)}
            >
              <span className="tab-company">{exp.company}</span>
              <span className="tab-period">{exp.period}</span>
            </button>
          ))}
        </div>

        <div className="exp-detail">
          <div className="exp-header">
            <div>
              <h3 className="exp-role">{current.role}</h3>
              <span className="exp-company-name">@ {current.company}</span>
            </div>
            <div className="exp-meta">
              <span className="tag">{current.type}</span>
              <span className="exp-period">{current.period}</span>
            </div>
          </div>

          <ul className="exp-items">
            {current.items.map((item, i) => (
              <li key={i} className="exp-item">
                <span className="item-arrow accent">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="exp-tags">
            {current.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
