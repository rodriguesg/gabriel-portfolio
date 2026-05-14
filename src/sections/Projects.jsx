import { useEffect, useRef } from "react";
import "./Projects.css";

const PROJECTS = [
  {
    id: 1,
    featured: true,
    name: "EventMesh Platform",
    desc: "Enterprise-grade event streaming platform built on Apache Kafka with a Kubernetes operator for declarative topic management, schema registry, and multi-tenant access control.",
    tags: ["Kafka", "Kubernetes", "Go", "Terraform", "Prometheus"],
    metrics: [{ val: "500k", label: "events/sec" }, { val: "99.99%", label: "uptime" }, { val: "3", label: "regions" }],
    link: "https://github.com",
    year: "2024",
  },
  {
    id: 2,
    name: "CloudDrift CLI",
    desc: "Open source CLI tool for detecting infrastructure drift between Terraform state and live AWS resources, with automated remediation suggestions.",
    tags: ["Go", "AWS SDK", "Terraform", "CLI"],
    link: "https://github.com",
    year: "2023",
  },
  {
    id: 3,
    name: "ObserveKit",
    desc: "Opinionated Grafana dashboard toolkit and Terraform module for bootstrapping full-stack observability in new AWS environments in under 10 minutes.",
    tags: ["Terraform", "Grafana", "Prometheus", "Python"],
    link: "https://github.com",
    year: "2023",
  },
  {
    id: 4,
    name: "API Sentinel",
    desc: "Kong Gateway plugin written in Lua for intelligent rate limiting using a sliding window algorithm backed by Redis Cluster, with real-time analytics.",
    tags: ["Kong", "Lua", "Redis", "Python", "Docker"],
    link: "https://github.com",
    year: "2022",
  },
];

export default function Projects() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const featured = PROJECTS.find(p => p.featured);
  const others = PROJECTS.filter(p => !p.featured);

  return (
    <div className="projects container" ref={ref}>
      <p className="section-label reveal">05. projects</p>
      <h2 className="section-title reveal">Things I've <span className="accent">built</span></h2>

      {/* Featured */}
      <div className="featured-project card reveal">
        <div className="featured-label">
          <span className="glow-dot" />
          <span>featured project</span>
        </div>
        <div className="featured-content">
          <div className="featured-left">
            <span className="project-year accent">{featured.year}</span>
            <h3 className="project-name">{featured.name}</h3>
            <p className="project-desc">{featured.desc}</p>
            <div className="project-tags">
              {featured.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="project-actions">
              <a href={featured.link} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                view project ↗
              </a>
              <a href={featured.link} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                github ⌥
              </a>
            </div>
          </div>
          <div className="featured-metrics">
            {featured.metrics.map(m => (
              <div key={m.label} className="metric-card">
                <span className="metric-val">{m.val}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other projects */}
      <div className="other-projects">
        {others.map((p, i) => (
          <a
            key={p.id}
            href={p.link}
            className="other-card card reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="other-card-header">
              <span className="project-year accent">{p.year}</span>
              <span className="other-arrow">→</span>
            </div>
            <h3 className="other-name">{p.name}</h3>
            <p className="other-desc">{p.desc}</p>
            <div className="project-tags" style={{ marginTop: "auto", paddingTop: "1rem" }}>
              {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
