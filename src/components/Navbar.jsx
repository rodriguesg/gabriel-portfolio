import "./Navbar.css";

const NAV_LINKS = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#skills", label: "skills" },
  { href: "#certifications", label: "certs" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

export default function Navbar({ activeSection, scrollY }) {
  const scrolled = scrollY > 40;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-bracket">[</span>
          <span className="logo-name">gabriel.r</span>
          <span className="logo-bracket">]</span>
          <span className="logo-cursor" />
        </a>

        <ul className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`nav-link ${activeSection === href.slice(1) ? "active" : ""}`}
              >
                <span className="link-num">
                  {String(NAV_LINKS.indexOf({ href, label }) + 1).padStart(2, "0")}.
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="nav-cta btn btn-primary">
          contato →
        </a>
      </div>
    </nav>
  );
}
