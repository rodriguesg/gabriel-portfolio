import { useEffect, useRef, useState } from "react";
import "./Hero.css";

const ROLES = ["Software Engineer", "Cloud Engineer", "API Architect", "Backend Developer", "Tech Lead"];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const canvasRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    const current = ROLES[roleIdx];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < current.length) {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setIsDeleting(false);
          setRoleIdx(r => (r + 1) % ROLES.length);
        }
      }
    }, isDeleting ? 45 : 80);
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, roleIdx]);

  // Grid/particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const COLS = 24, ROWS = 14;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      const cw = W() / COLS, ch = H() / ROWS;

      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const x = c * cw, y = r * ch;
          const dx = mouse.x - x, dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          const influence = Math.max(0, 1 - dist / maxDist);

          const alpha = 0.06 + influence * 0.35;
          const size = 1.2 + influence * 2.5;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = influence > 0.4
            ? `rgba(90,200,180,${alpha})`
            : `rgba(255,255,255,${alpha * 0.5})`;
          ctx.fill();
        }
      }

      // Lines connecting close dots to mouse
      for (let r = 0; r <= ROWS; r++) {
        for (let c = 0; c <= COLS; c++) {
          const x = c * cw, y = r * ch;
          const dx = mouse.x - x, dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(90,200,180,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-grid-label top-left">
        <span>sys.status</span>
        <span className="glow-dot" />
        <span className="accent">online</span>
      </div>
      <div className="hero-grid-label top-right">
        <span className="text-muted">v2.4.1</span>
        <span>—</span>
        <span>São Paulo, BR</span>
      </div>

      <div className="container hero-content">
        <div className="hero-eyebrow">
          <span className="mono-label">// portfolio.jsx</span>
        </div>

        <h1 className="hero-name">
          <span className="name-line-1">Hello, I'm</span>
          <span className="name-line-2">
            <span className="name-first">Gabriel</span>
            <span className="name-last"> Rodrigues</span>
          </span>
        </h1>

        <div className="hero-role">
          <span className="role-prefix">$ whoami →</span>
          <span className="role-text accent">{displayed}</span>
          <span className="role-cursor" />
        </div>

        <p className="hero-bio">
          Engenheiro de Software Sênior no Itaú Unibanco com 8 anos de experiência.
          Especialista em APIs, migração cloud e sistemas distribuídos no maior banco
          privado da América Latina.
          <br />
          <span className="text-muted">São Paulo, SP · Cursando MBA em AI Engineering — FIAP</span>
        </p>

        <div className="hero-actions">
          <a href="#experience" className="btn btn-primary">minha trajetória →</a>
          <a href="#contact" className="btn btn-ghost">entrar em contato</a>
          <a href="https://github.com/rodriguesg" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            github ↗
          </a>
        </div>

        <div className="hero-stats">
          {[
            { label: "anos no Itaú", value: "8" },
            { label: "de carreira", value: "8+" },
            { label: "AWS certified", value: "CCP" },
            { label: "MBA em andamento", value: "AI" },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
}
