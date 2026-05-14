import { useEffect, useRef } from "react";
import "./Contact.css";

export default function Contact() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="contact container" ref={ref}>
      <p className="section-label reveal">05. contact</p>
      <h2 className="section-title reveal">
        Let's <span className="accent">connect</span>
      </h2>
      <p className="contact-sub reveal">
        Whether you have a project in mind, an opportunity to discuss, or just want to talk
        about distributed systems — my inbox is always open.
      </p>

      <div className="contact-channels reveal">
        {[
          { icon: "✉", label: "Email", value: "gabrielr_s@outlook.com", href: "mailto:gabrielr_s@outlook.com" },
          { icon: "in", label: "LinkedIn", value: "gabriel-rodrigues-de-souza", href: "https://www.linkedin.com/in/gabriel-rodrigues-de-souza-40a051110/" },
          { icon: "⌥", label: "GitHub", value: "github.com/rodriguesg", href: "https://github.com/rodriguesg" },
        ].map(ch => (
          <a key={ch.label} href={ch.href} className="channel-card" target="_blank" rel="noopener noreferrer">
            <span className="channel-icon accent">{ch.icon}</span>
            <div>
              <p className="channel-label">{ch.label}</p>
              <p className="channel-value">{ch.value}</p>
            </div>
            <span className="channel-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
