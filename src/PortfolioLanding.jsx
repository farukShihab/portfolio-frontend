import { useState, useEffect } from "react";

import { useCpStats } from "./useCpStats";

/* -------------------------------------------------------------------------
   PLACEHOLDER CONTENT — swap for your real data. Once the Django API is up,
   these become fetches to /api/skills/, /api/projects/, /api/stats/,
   /api/experience/ instead of hardcoded arrays.

   NAME is taken directly from your example syntax — change it if the
   casing/handle isn't exactly what you want everywhere below.
   ------------------------------------------------------------------------- */

const NAME = "faruk_shihab";

const BOOT_LINES = [
  { type: "call", text: `std::cout << ${NAME}.whoami();` },
  {
    type: "comment",
    size: "display",
    text: "Software engineer. Competitive programmer. I build things and occasionally break production.",
  },
  { type: "call", text: `${NAME}.status();` },
  { type: "comment", text: "Currently building this site instead of sleeping." },
];

const SKILLS = ["python", "javascript", "react", "django", "postgresql", "c++", "docker", "git"];

const PROJECTS = [
  {
    name: "project-one",
    desc: "One line on what it does and who it's for. Keep it short.",
    stack: ["react", "django", "postgresql"],
  },
  {
    name: "project-two",
    desc: "A second project — replace with something you actually shipped.",
    stack: ["python", "flask"],
  },
  {
    name: "project-three",
    desc: "A third one. Three is enough to make the archive feel real.",
    stack: ["c++", "sfml"],
  },
];

const CP_STATS = [
  { platform: "codeforces", rating: "1400", solved: 210 },
  { platform: "leetcode", rating: "—", solved: 340 },
  { platform: "codechef", rating: "1600", solved: 95 },
  { platform: "atcoder", rating: "1100", solved: 60 },
  { platform: "tbd", rating: "—", solved: 0 },
];

const RECENT_SOLVES = [
  { date: "2026-09-10", platform: "codeforces", problem: "1987B - Interesting Permutation" },
  { date: "2026-09-08", platform: "leetcode", problem: "2214. Minimum Health to Beat Game" },
  { date: "2026-09-05", platform: "codeforces", problem: "1985H - Maximize the Largest Component" },
  { date: "2026-09-02", platform: "codechef", problem: "TREEDIST - Tree Distance Queries" },
];

const RECENT_CONTESTS = [
  { date: "2026-09-07", platform: "codeforces", name: "Codeforces Round 987 (Div. 2)", rank: 1423, delta: 38 },
  { date: "2026-08-24", platform: "codeforces", name: "Educational Codeforces Round 172", rank: 2110, delta: -12 },
  { date: "2026-08-10", platform: "atcoder", name: "AtCoder Beginner Contest 371", rank: 890, delta: 15 },
];

/* -------------------------------------------------------------------------
   Typewriter hook — the ONE orchestrated motion moment on the page.
   Everything else appears instantly, no scroll-fade spam.
   ------------------------------------------------------------------------- */
function useTypewriter(lines, speed = 26, startDelay = 350) {
  const [rendered, setRendered] = useState(lines.map((l) => ({ ...l, text: "" })));
  const [activeIndex, setActiveIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];
    const wait = (ms) => new Promise((r) => timeouts.push(setTimeout(r, ms)));

    (async () => {
      await wait(startDelay);
      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        setActiveIndex(i);
        const { text } = lines[i];
        for (let c = 1; c <= text.length; c++) {
          if (cancelled) return;
          await wait(speed);
          setRendered((prev) => {
            const next = prev.slice();
            next[i] = { ...next[i], text: text.slice(0, c) };
            return next;
          });
        }
        await wait(220);
      }
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rendered, activeIndex, done };
}

/* ---- shared pieces ------------------------------------------------------ */

function Nav({ page, onNavigate }) {
  const links = [
    { key: "projects", label: "projects" },
    { key: "cp-stats", label: "cp_stats" },
    { key: "experience", label: "experience" },
  ];
  return (
    <nav className="nav">
      <button className="nav-brand" onClick={() => onNavigate("home")}>
        {`#include "${NAME}.h"`}
      </button>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.key}
            className={`nav-link ${page === l.key ? "active" : ""}`}
            onClick={() => onNavigate(l.key)}
          >
            {NAME}::{l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function Breadcrumb({ page, onNavigate }) {
  const calls = {
    projects: "get_projects()",
    "cp-stats": "get_cp_stats()",
    experience: "get_experience()",
  };
  return (
    <div className="breadcrumb container">
      <button onClick={() => onNavigate("home")}>{NAME}::home</button>
      <span className="crumb-sep">::</span>
      <span>{calls[page]}</span>
    </div>
  );
}

function SectionHeader({ call }) {
  return (
    <div className="section-header">
      <p className="section-cmd">{call}</p>
      <div className="rule" aria-hidden="true">{"─".repeat(200)}</div>
    </div>
  );
}

function TeaserLink({ call, onClick, more, children }) {
  return (
    <button className="teaser-link" onClick={onClick}>
      <SectionHeader call={call} />
      {children}
      {more && <p className="teaser-more">{more}</p>}
    </button>
  );
}

function ProjectCard({ project, index }) {
  return (
    <article className="project-card">
      <div className="project-head">
        <span className="project-index">{`projects[${index}]`}</span>
        <h3 className="project-name">{project.name}</h3>
      </div>
      <p className="project-desc">{project.desc}</p>
      <div className="project-stack">
        {project.stack.map((s) => <span className="stack-tag" key={s}>{s}</span>)}
      </div>
    </article>
  );
}

/* ---- pages ---------------------------------------------------------------- */

function HomePage({ onNavigate, cp }) {
  const { rendered, activeIndex, done } = useTypewriter(BOOT_LINES);
  const total = cp.error ? "ERR" : cp.data ? cp.data.total_solved : "…";
  const moreCount = PROJECTS.length - 1;

  return (
    <>
      <header className="hero container">
        {rendered.map((line, i) => (
          <p key={i} className={`boot-line ${line.type} ${line.size === "display" ? "out-display" : ""}`}>
            {line.type === "call" ? line.text : <>{"// "}{line.text}</>}
            {!done && i === activeIndex && <span className="cursor" />}
          </p>
        ))}
        {done && <span className="cursor" />}
      </header>

      <section className="section container" id="skills">
        <SectionHeader call={`${NAME}.get_skills();`} />
        <ul className="skills-list">
          {SKILLS.map((s) => <li key={s} className="skill-tag">{s}</li>)}
        </ul>
      </section>

      <section className="section container">
        <TeaserLink
          call={`${NAME}.get_projects();`}
          onClick={() => onNavigate("projects")}
          more={moreCount > 0 ? `+ ${moreCount} more in projects/` : null}
        >
          <ProjectCard project={PROJECTS[0]} index={0} />
        </TeaserLink>
      </section>

      <section className="section container">
        <TeaserLink
          call={`${NAME}.get_cp_stats();`}
          onClick={() => onNavigate("cp-stats")}
          more="rating breakdown, recent solves & contests inside"
        >
          <div className="stats-total">
            <span className="num">{total}</span>
            <span className="label">problems solved, across all platforms</span>
          </div>
        </TeaserLink>
      </section>

      <section className="section container">
        <TeaserLink call={`${NAME}.get_experience();`} onClick={() => onNavigate("experience")}>
          <div className="empty-state">
            <p>{"// std::vector<Experience>{} — empty."}</p>
          </div>
        </TeaserLink>
      </section>
    </>
  );
}

function ProjectsPage() {
  return (
    <section className="section page-section container">
      <SectionHeader call={`${NAME}.get_projects();`} />
      <div className="projects-list">
        {PROJECTS.map((p, i) => <ProjectCard project={p} index={i} key={p.name} />)}
      </div>
    </section>
  );
}

function CPStatsPage({ cp }) {
  const { data, error } = cp;
  const lastUpdated =
    data && data.platforms.length
      ? new Date(Math.max(...data.platforms.map((p) => new Date(p.updated_at)))).toLocaleString()
      : null;

  return (
    <section className="section page-section container">
      <SectionHeader call={`${NAME}.get_cp_stats();`} />

      {error && (
        <div className="empty-state"><p>{"// ERR: stats unavailable"}</p></div>
      )}
      {!error && !data && (
        <div className="empty-state">
          <p>loading stats<span className="cursor" /></p>
        </div>
      )}

      {data && (
        <>
          <div className="stats-total">
            <span className="num">{data.total_solved}</span>
            <span className="label">problems solved, across all platforms</span>
          </div>
          <div className="stats-wrap">
            <table className="stats-table">
              <thead>
                <tr><th>platform</th><th>rating</th><th>max</th><th>solved</th></tr>
              </thead>
              <tbody>
                {data.platforms.map((p) => (
                  <tr key={p.platform}>
                    <td><a href={p.url} target="_blank" rel="noreferrer">{p.platform}</a></td>
                    <td>{p.rating ?? "—"}</td>
                    <td>{p.max_rating ?? "—"}</td>
                    <td>{p.solved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {lastUpdated && <p className="teaser-more">{`// last updated ${lastUpdated}`}</p>}
        </>
      )}
    </section>
  );
}

function ExperiencePage() {
  return (
    <section className="section page-section container">
      <SectionHeader call={`${NAME}.get_experience();`} />
      <div className="empty-state">
        <p>{"// std::vector<Experience>{}"}</p>
        <p>{"// empty — first entry expected after day one."}</p>
      </div>
    </section>
  );
}

/* ---- app shell ------------------------------------------------------------- */

export default function PortfolioApp() {
  const [page, setPage] = useState("home");
  const cp = useCpStats();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;700&display=swap');

        :root {
          --color-bg: #0d0d0d;
          --color-panel: #161513;
          --color-fg: #ece8de;
          --color-fg-dim: #86807a;
          --color-border: #3a362f;
          --color-accent: #33ff66;
          --color-accent-dim: #1a7a35;
          --color-shadow: #000000;
          --font-mono: 'JetBrains Mono', 'IBM Plex Mono', 'Space Mono', ui-monospace, 'Courier New', monospace;
          --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-md: 1.125rem;
          --text-lg: 1.5rem; --text-xl: 2rem; --text-2xl: 2.75rem;
          --text-3xl: clamp(2.1rem, 5vw + 1rem, 3.75rem);
          --leading-tight: 1.15; --leading-snug: 1.35; --leading-normal: 1.6;
          --space-1: .25rem; --space-2: .5rem; --space-3: 1rem; --space-4: 1.5rem;
          --space-5: 2rem; --space-6: 3rem; --space-7: 4.5rem; --space-8: 6rem;
          --border-thin: 2px; --border-thick: 4px; --shadow-offset: 4px;
          --content-width: 46rem;
        }

        .page * { box-sizing: border-box; }
        .page {
          background: var(--color-bg);
          color: var(--color-fg);
          font-family: var(--font-mono);
          font-size: var(--text-base);
          line-height: var(--leading-normal);
          min-height: 100vh;
        }
        .page h1, .page h2, .page h3 { margin: 0; font-weight: 700; line-height: var(--leading-tight); }
        .page p { margin: 0; }
        .page a { color: inherit; text-decoration: none; }
        .page button { font-family: inherit; background: none; border: 0; padding: 0; color: inherit; cursor: pointer; }
        .page ::selection { background: var(--color-accent); color: var(--color-bg); }
        .page :focus-visible { outline: var(--border-thin) solid var(--color-accent); outline-offset: 2px; }

        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .cursor {
          display: inline-block; width: .55em; height: 1em; vertical-align: text-bottom;
          background: var(--color-accent); animation: blink 1s steps(1) infinite;
        }

        .container { max-width: var(--content-width); margin: 0 auto; padding: 0 var(--space-4); }

        .frame-edge {
          display: flex; color: var(--color-border); user-select: none;
          font-size: var(--text-sm); overflow: hidden; white-space: nowrap;
        }
        .frame-edge .fill { overflow: hidden; min-width: 0; flex: 1 1 auto; }

        /* ---- nav (sticky) ---- */
        .nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; align-items: center; gap: var(--space-4);
          background: var(--color-bg);
          border-bottom: var(--border-thick) solid var(--color-fg);
          padding: var(--space-3) var(--space-4);
        }
        .nav-brand { font-size: var(--text-sm); color: var(--color-fg-dim); }
        .nav-brand:hover, .nav-brand:focus-visible { color: var(--color-accent); }
        .nav-links { display: flex; gap: var(--space-4); margin-left: auto; font-size: var(--text-sm); }
        .nav-link { padding-bottom: 2px; border-bottom: var(--border-thin) solid transparent; }
        .nav-link:hover, .nav-link:focus-visible, .nav-link.active { color: var(--color-accent); border-color: var(--color-accent); }

        /* ---- breadcrumb ---- */
        .breadcrumb { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); color: var(--color-fg-dim); padding: var(--space-4) 0 0; }
        .breadcrumb button:hover, .breadcrumb button:focus-visible { color: var(--color-accent); }
        .crumb-sep { color: var(--color-border); }

        /* ---- hero ---- */
        .hero { padding: var(--space-8) 0 var(--space-7); }
        .boot-line { min-height: 1.6em; }
        .boot-line.call { color: var(--color-fg-dim); font-size: var(--text-md); margin-bottom: var(--space-2); }
        .boot-line.comment { font-size: var(--text-md); color: var(--color-fg-dim); margin-bottom: var(--space-3); }
        .boot-line.comment.out-display {
          font-size: var(--text-3xl); font-weight: 700; color: var(--color-fg);
          margin-bottom: var(--space-5); line-height: var(--leading-tight);
        }

        /* ---- section shell ---- */
        .section { padding: var(--space-8) 0; border-top: var(--border-thin) solid var(--color-border); }
        .section.page-section { border-top: none; padding: var(--space-5) 0 var(--space-8); }
        .section-header { margin-bottom: var(--space-5); }
        .section-cmd { font-size: var(--text-md); color: var(--color-fg-dim); margin-bottom: var(--space-2); }
        .rule { color: var(--color-border); font-size: var(--text-sm); overflow: hidden; white-space: nowrap; }

        /* ---- teaser (home page, clickable section) ---- */
        .teaser-link { display: block; width: 100%; text-align: left; }
        .teaser-link:hover .section-cmd, .teaser-link:focus-visible .section-cmd { color: var(--color-accent); }
        .teaser-more { color: var(--color-fg-dim); font-size: var(--text-sm); margin-top: var(--space-3); }
        .teaser-link:hover .teaser-more, .teaser-link:focus-visible .teaser-more { color: var(--color-accent); }

        /* ---- skills ---- */
        .skills-list { display: flex; flex-wrap: wrap; gap: var(--space-3); list-style: none; margin: 0; padding: 0; }
        .skill-tag {
          border: var(--border-thin) solid var(--color-fg); padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm); background: var(--color-panel);
          transition: background 80ms steps(1), color 80ms steps(1);
        }
        .skill-tag:hover { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); }

        /* ---- projects ---- */
        .projects-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .project-card {
          border: var(--border-thin) solid var(--color-fg); background: var(--color-panel);
          padding: var(--space-4); box-shadow: var(--shadow-offset) var(--shadow-offset) 0 var(--color-shadow);
          transition: box-shadow 70ms steps(1), transform 70ms steps(1);
        }
        .teaser-link:hover .project-card, .teaser-link:focus-visible .project-card {
          box-shadow: 0 0 0 var(--color-shadow);
          transform: translate(var(--shadow-offset), var(--shadow-offset));
        }
        .project-head { display: flex; align-items: baseline; gap: var(--space-2); margin-bottom: var(--space-2); flex-wrap: wrap; }
        .project-index { color: var(--color-fg-dim); }
        .project-name { font-size: var(--text-lg); }
        .project-desc { color: var(--color-fg-dim); margin-bottom: var(--space-3); }
        .project-stack { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .stack-tag { font-size: var(--text-xs); color: var(--color-fg-dim); border: 1px solid var(--color-border); padding: 2px 8px; white-space: nowrap; }

        /* ---- cp stats ---- */
        .stats-total { margin-bottom: var(--space-4); }
        .stats-total .num { font-size: var(--text-2xl); font-weight: 700; display: block; }
        .stats-total .label { color: var(--color-fg-dim); font-size: var(--text-sm); }
        .stats-wrap { overflow-x: auto; border: var(--border-thin) solid var(--color-fg); }
        .stats-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); min-width: 420px; }
        .stats-table th { text-align: left; color: var(--color-fg-dim); font-weight: 400; padding: var(--space-2) var(--space-3); border-bottom: var(--border-thin) solid var(--color-fg); }
        .stats-table td { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--color-border); }
        .stats-table tr:last-child td { border-bottom: none; }
        .stats-table a:hover, .stats-table a:focus-visible { color: var(--color-accent); }

        /* ---- recent activity ---- */
        .sub-section { margin-top: var(--space-7); }
        .activity-list { display: flex; flex-direction: column; }
        .activity-row {
          display: grid; grid-template-columns: 7em auto 1fr; gap: var(--space-3); align-items: center;
          padding: var(--space-2) 0; border-bottom: 1px solid var(--color-border); font-size: var(--text-sm);
        }
        .activity-row.contests { grid-template-columns: 7em auto 1fr auto; }
        .activity-row:last-child { border-bottom: none; }
        .activity-date { color: var(--color-fg-dim); }
        .activity-meta { color: var(--color-fg-dim); text-align: right; }

        /* ---- experience / empty state ---- */
        .empty-state { color: var(--color-fg-dim); }
        .empty-state p { margin-bottom: var(--space-1); }

        /* ---- footer ---- */
        .footer { padding: var(--space-6) 0 var(--space-8); }
        .footer p { color: var(--color-fg-dim); margin-bottom: var(--space-1); }
        .footer a:hover, .footer a:focus-visible { color: var(--color-accent); }

        @media (max-width: 640px) {
          .nav-links { gap: var(--space-3); font-size: var(--text-xs); }
          .hero { padding: var(--space-6) 0 var(--space-5); }
          .section { padding: var(--space-6) 0; }
          .activity-row, .activity-row.contests { grid-template-columns: 1fr; gap: var(--space-1); padding: var(--space-3) 0; }
          .activity-meta { text-align: left; }
        }
      `}</style>

      <Nav page={page} onNavigate={setPage} />

      <div className="frame-edge container" aria-hidden="true">
        <span>┌</span><span className="fill">{"─".repeat(200)}</span><span>┐</span>
      </div>

      {page !== "home" && <Breadcrumb page={page} onNavigate={setPage} />}

      {page === "home" && <HomePage onNavigate={setPage} cp={cp} />}
      {page === "projects" && <ProjectsPage />}
      {page === "cp-stats" && <CPStatsPage cp={cp} />}
      {page === "experience" && <ExperiencePage />}

      <footer className="footer container">
        <p className="section-cmd">{`${NAME}.contact();`}</p>
        <p>{"// email:  "}<a href="mailto:faruk.aka.shihab@gmail.com">faruk.aka.shihab@gmail.com</a></p>
        <p>{"// github: "}<a href="https://github.com/farukShihab">github.com/farukShihab</a></p>
      </footer>

      <div className="frame-edge container" aria-hidden="true">
        <span>└</span><span className="fill">{"─".repeat(200)}</span><span>┘</span>
      </div>
    </div>
  );
}