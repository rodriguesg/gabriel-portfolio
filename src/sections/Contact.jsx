import { useEffect, useRef, useState } from "react";
import "./Contact.css";

export default function Contact() {
  const ref = useRef(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const els = ref.current.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to API / email service
    setSent(true);
  };

  return (
    <div className="contact container" ref={ref}>
      <p className="section-label reveal">06. contact</p>
      <h2 className="section-title reveal">
        Let's <span className="accent">connect</span>
      </h2>
      <p className="contact-sub reveal">
        Whether you have a project in mind, an opportunity to discuss, or just want to talk
        about distributed systems — my inbox is always open.
      </p>

      <div className="contact-grid">
        <div className="contact-left reveal">
          <div className="contact-channels">
            {[
              { icon: "✉", label: "Email", value: "gabriel@email.com", href: "mailto:gabriel@email.com" },
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

          <div className="avail-block">
            <span className="glow-dot" />
            <div>
              <p className="avail-title">Available for opportunities</p>
              <p className="avail-sub">Open to full-time, contract & consulting roles</p>
            </div>
          </div>
        </div>

        <div className="contact-right reveal">
          {sent ? (
            <div className="success-state">
              <div className="success-icon accent">✓</div>
              <h3>Message sent!</h3>
              <p>I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    className="field-input"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Message</label>
                <textarea
                  className="field-input field-textarea"
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary submit-btn">
                send message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
