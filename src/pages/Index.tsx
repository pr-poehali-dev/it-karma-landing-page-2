import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/4c1eac84-5b55-46d1-a8b3-d6669bf4f714/files/21e7c10d-33ab-414b-8ba9-84844fd8514b.jpg";

/* ────────────────────────────────────────────────
   Animated counter hook
──────────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ────────────────────────────────────────────────
   Data Flow SVG Diagram
──────────────────────────────────────────────── */
function DataFlowDiagram() {
  const edges = [
    { x1: 70, y1: 80,  x2: 230, y2: 140, dur: "1.5s" },
    { x1: 70, y1: 200, x2: 230, y2: 140, dur: "1.8s" },
    { x1: 70, y1: 200, x2: 230, y2: 260, dur: "2.1s" },
    { x1: 70, y1: 320, x2: 230, y2: 260, dur: "1.6s" },
    { x1: 250, y1: 140, x2: 410, y2: 80,  dur: "1.4s" },
    { x1: 250, y1: 140, x2: 410, y2: 200, dur: "1.9s" },
    { x1: 250, y1: 260, x2: 410, y2: 200, dur: "2.2s" },
    { x1: 250, y1: 260, x2: 410, y2: 320, dur: "1.7s" },
  ];

  const chaosNodes = [
    { cx: 60, cy: 80,  label: "Input"    },
    { cx: 60, cy: 200, label: "Events"   },
    { cx: 60, cy: 320, label: "Requests" },
  ];

  const procNodes = [
    { cx: 240, cy: 140, label: "Queue"  },
    { cx: 240, cy: 260, label: "Router" },
  ];

  const orderNodes = [
    { cx: 420, cy: 80,  label: "Cache" },
    { cx: 420, cy: 200, label: "DB"    },
    { cx: 420, cy: 320, label: "API"   },
  ];

  return (
    <svg viewBox="0 0 480 400" className="w-full max-w-[520px] mx-auto" style={{ height: "300px" }}>
      <defs>
        <filter id="glow-c">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-g">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="eg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#00F2FF" stopOpacity="0.7"/>
        </linearGradient>
        <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="rgba(0,242,255,0.5)"/>
        </marker>
      </defs>

      {/* Zone backgrounds */}
      <rect x="30" y="50" width="60" height="290" rx="2" fill="rgba(212,175,55,0.04)"/>
      <rect x="390" y="50" width="60" height="290" rx="2" fill="rgba(0,242,255,0.03)"/>

      {/* Zone labels */}
      <text x="60" y="40" textAnchor="middle" fill="rgba(212,175,55,0.35)" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="2">CHAOS</text>
      <text x="420" y="40" textAnchor="middle" fill="rgba(0,242,255,0.35)" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="2">ORDER</text>
      <text x="240" y="40" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="2">PROCESSING</text>

      {/* Edges */}
      {edges.map((e, i) => (
        <g key={i}>
          <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="url(#eg)" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.4" markerEnd="url(#arr)"/>
          <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#00F2FF" strokeWidth="1.2" strokeDasharray="5 18" opacity="0.65" filter="url(#glow-c)">
            <animate attributeName="stroke-dashoffset" from="0" to="-23" dur={e.dur} repeatCount="indefinite"/>
          </line>
        </g>
      ))}

      {/* Chaos nodes */}
      {chaosNodes.map((n, i) => (
        <g key={i} filter="url(#glow-g)">
          <circle cx={n.cx} cy={n.cy} r="16" fill="rgba(26,29,36,0.95)" stroke="#D4AF37" strokeWidth="0.8" opacity="0.75"/>
          <circle cx={n.cx} cy={n.cy} r="3.5" fill="#D4AF37" opacity="0.9">
            <animate attributeName="r" values="2.5;4.5;2.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.cx} y={n.cy + 28} textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="8" fontFamily="IBM Plex Mono">{n.label}</text>
        </g>
      ))}

      {/* Processing nodes */}
      {procNodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.cx} cy={n.cy} r="18" fill="rgba(26,29,36,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
          <circle cx={n.cx} cy={n.cy} r="4" fill="rgba(255,255,255,0.4)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.cx} y={n.cy + 30} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="IBM Plex Mono">{n.label}</text>
        </g>
      ))}

      {/* Order nodes */}
      {orderNodes.map((n, i) => (
        <g key={i} filter="url(#glow-c)">
          <circle cx={n.cx} cy={n.cy} r="16" fill="rgba(26,29,36,0.95)" stroke="#00F2FF" strokeWidth="0.8"/>
          <circle cx={n.cx} cy={n.cy} r="3.5" fill="#00F2FF" opacity="0.9">
            <animate attributeName="r" values="2.5;5;2.5" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.cx} y={n.cy + 28} textAnchor="middle" fill="rgba(0,242,255,0.55)" fontSize="8" fontFamily="IBM Plex Mono">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────
   Floating background nodes
──────────────────────────────────────────────── */
function BgNodes() {
  const pts = [
    { x: 8,  y: 15, c: "gold", s: 2,   d: 0   },
    { x: 25, y: 65, c: "cyan", s: 1.5, d: 1.2 },
    { x: 45, y: 30, c: "gold", s: 3,   d: 0.5 },
    { x: 70, y: 80, c: "cyan", s: 2,   d: 2   },
    { x: 88, y: 20, c: "gold", s: 1.5, d: 1.8 },
    { x: 92, y: 55, c: "cyan", s: 2.5, d: 0.8 },
    { x: 15, y: 85, c: "cyan", s: 2,   d: 3   },
    { x: 60, y: 10, c: "gold", s: 1.5, d: 2.5 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s}px`,
            height: `${p.s}px`,
            background: p.c === "gold" ? "#D4AF37" : "#00F2FF",
            boxShadow: p.c === "gold" ? "0 0 10px #D4AF37" : "0 0 10px #00F2FF",
            animation: `pulse-cyan ${2.5 + p.d}s ease-in-out infinite`,
            animationDelay: `${p.d}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main page
──────────────────────────────────────────────── */
export default function Index() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const uptime  = useCounter(9998, 2000, statsVisible);
  const rps     = useCounter(24,   2500, statsVisible);
  const latency = useCounter(12,   1500, statsVisible);
  const clients = useCounter(47,   1800, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const services = [
    {
      icon: "LineChart",
      number: "01",
      title: "Consulting",
      subtitle: "Системный аудит и стратегия",
      desc: "Диагностируем узкие места вашей инфраструктуры. Строим дорожную карту масштабирования с точными метриками и измеримыми результатами.",
      tags: ["Performance Audit", "Capacity Planning", "SLA Design"],
      accent: "gold",
    },
    {
      icon: "Network",
      number: "02",
      title: "Architecture Design",
      subtitle: "Проектирование высоконагруженных систем",
      desc: "Разрабатываем отказоустойчивые распределённые архитектуры. Каждое решение обосновано причинно-следственной логикой — без избыточности, без слабых звеньев.",
      tags: ["Microservices", "Event-Driven", "Zero-Downtime"],
      accent: "cyan",
    },
    {
      icon: "Cpu",
      number: "03",
      title: "AI-Powered Development",
      subtitle: "Разработка с интеграцией ИИ",
      desc: "Встраиваем AI-компоненты в production-системы. Авторазмасштабирование, предиктивный мониторинг, интеллектуальная балансировка нагрузки.",
      tags: ["ML Pipelines", "Auto-Scaling", "Predictive Ops"],
      accent: "gold",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white relative" style={{fontFamily: "'IBM Plex Sans', sans-serif"}}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[rgba(212,175,55,0.07)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border border-[#D4AF37] flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#D4AF37]" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}/>
            </div>
            <span style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 800, letterSpacing: "0.15em"}} className="text-[17px] text-white">
              IT<span className="text-[#D4AF37]">—</span>KARMA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "УСЛУГИ",     href: "#услуги"      },
              { label: "ТЕХНОЛОГИЯ", href: "#технология"  },
              { label: "КОНТАКТЫ",   href: "#контакты"    },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono-brand text-[11px] tracking-[0.18em] text-[rgba(255,255,255,0.4)] hover:text-[#D4AF37] transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button className="cta-btn border border-[#D4AF37] px-5 py-2 text-[#D4AF37] font-mono-brand text-[11px] tracking-[0.2em] hover:bg-[rgba(212,175,55,0.08)] transition-all duration-300">
            СВЯЗАТЬСЯ
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden grid-bg">
        <BgNodes />

        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="Distributed Architecture" className="w-full h-full object-cover opacity-15"/>
          <div className="absolute inset-0" style={{background: "linear-gradient(to right, #0B0E14 40%, rgba(11,14,20,0.8) 70%, rgba(11,14,20,0.35) 100%)"}}/>
          <div className="absolute inset-0" style={{background: "linear-gradient(to top, #0B0E14 0%, transparent 40%)"}}/>
        </div>

        {/* Vertical accent line */}
        <div className="absolute right-1/3 top-0 bottom-0 w-px hidden xl:block" style={{background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.08), transparent)"}}/>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-3xl">

            <div className="animate-fade-up flex items-center gap-3 mb-8">
              <div className="node-dot-gold"/>
              <span className="font-mono-brand text-[11px] tracking-[0.28em] text-[rgba(212,175,55,0.65)] uppercase">
                AI-Driven High-Load Systems
              </span>
            </div>

            <h1 className="animate-fade-up delay-100 leading-[0.93] tracking-[-0.025em] mb-6"
              style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem, 6vw, 5.5rem)"}}>
              <span className="text-white">Precise</span><br/>
              <span className="text-white">Engineering</span><br/>
              <span className="text-gold-gradient">for High-Load</span><br/>
              <span className="text-white">Systems.</span>
            </h1>

            <p className="animate-fade-up delay-200 text-[rgba(255,255,255,0.45)] text-lg leading-relaxed mb-10 font-light max-w-xl">
              Каждое архитектурное решение — следствие точной причины.
              Мы проектируем системы, которые не просто работают — они работают
              безупречно под любой нагрузкой.
            </p>

            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4">
              <button className="cta-btn animate-pulse-gold border border-[#D4AF37] px-8 py-4 text-[#D4AF37] text-[13px] tracking-[0.22em] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-300"
                style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 700}}>
                НАЧАТЬ ПРОЕКТ
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-[rgba(255,255,255,0.4)] font-mono-brand text-[11px] tracking-[0.2em] hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-px bg-[rgba(255,255,255,0.2)] group-hover:bg-[#00F2FF] transition-colors duration-300"/>
                УЗНАТЬ БОЛЬШЕ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="relative border-y border-[rgba(212,175,55,0.07)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(212,175,55,0.05)]">
            {[
              { value: `${(uptime / 100).toFixed(2)}%`, label: "Uptime SLA",   sub: "production-систем"  },
              { value: `${rps}M RPS`,                   label: "Пиковая нагр.", sub: "запросов в секунду" },
              { value: `${latency}ms`,                  label: "P99 Latency",  sub: "медианная задержка" },
              { value: `${clients}+`,                   label: "Проектов",     sub: "запущено в prod"    },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0B0E14] p-8 md:p-10 text-center">
                <div className="text-gold-gradient text-3xl md:text-4xl mb-1 tracking-tight"
                  style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900}}>
                  {stat.value}
                </div>
                <div className="font-mono-brand text-[11px] tracking-[0.15em] text-white mb-1">{stat.label}</div>
                <div className="font-mono-brand text-[10px] text-[rgba(255,255,255,0.28)]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="услуги" className="relative py-32 grid-bg">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-20">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-[#D4AF37]"/>
              <span className="font-mono-brand text-[11px] tracking-[0.28em] text-[rgba(212,175,55,0.55)] uppercase">Services</span>
            </div>
            <h2 style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)"}} className="leading-tight tracking-tight">
              <span className="text-white">Три вектора</span><br/>
              <span className="text-[rgba(255,255,255,0.25)]">точного воздействия</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-[rgba(212,175,55,0.05)]">
            {services.map((s, i) => (
              <div
                key={s.number}
                className="service-card glass-cyan p-8 lg:p-10 cursor-pointer group"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="font-mono-brand text-[64px] leading-none mb-6 select-none"
                  style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, color: "rgba(255,255,255,0.03)"}}>
                  {s.number}
                </div>

                <div className={`w-11 h-11 border flex items-center justify-center mb-6 transition-all duration-300 ${
                  s.accent === "gold"
                    ? "border-[rgba(212,175,55,0.25)] group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    : "border-[rgba(0,242,255,0.25)] group-hover:border-[#00F2FF] group-hover:shadow-[0_0_20px_rgba(0,242,255,0.15)]"
                }`}>
                  <Icon
                    name={s.icon}
                    size={18}
                    className={s.accent === "gold" ? "text-[#D4AF37]" : "text-[#00F2FF]"}
                  />
                </div>

                <h3 className="text-white text-xl mb-1 tracking-tight"
                  style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 700}}>
                  {s.title}
                </h3>
                <p className="font-mono-brand text-[11px] text-[rgba(255,255,255,0.3)] mb-5 tracking-wide">
                  {s.subtitle}
                </p>
                <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed mb-8 font-light">
                  {s.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono-brand text-[10px] px-3 py-1 border tracking-wider ${
                        s.accent === "gold"
                          ? "border-[rgba(212,175,55,0.18)] text-[rgba(212,175,55,0.55)]"
                          : "border-[rgba(0,242,255,0.18)] text-[rgba(0,242,255,0.55)]"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-8 h-px ${s.accent === "gold" ? "bg-[#D4AF37]" : "bg-[#00F2FF]"}`}/>
                  <Icon name="ArrowRight" size={13} className={s.accent === "gold" ? "text-[#D4AF37]" : "text-[#00F2FF]"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNICAL KARMA ── */}
      <section id="технология" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full" style={{background: "radial-gradient(circle, rgba(0,242,255,0.025) 0%, transparent 70%)"}}/>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-[#00F2FF]"/>
              <span className="font-mono-brand text-[11px] tracking-[0.28em] text-[rgba(0,242,255,0.55)] uppercase">Technical Karma</span>
            </div>
            <h2 style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)"}} className="leading-tight tracking-tight mb-6">
              <span className="text-white">Хаос становится</span><br/>
              <span className="text-cyan-gradient">совершенным порядком</span>
            </h2>
            <p className="text-[rgba(255,255,255,0.4)] text-base leading-relaxed font-light">
              Карма в IT — это архитектурный принцип. Каждое правильное решение
              порождает устойчивость. Каждый компромисс возвращается техдолгом.
              Мы строим системы, где причина всегда порождает правильное следствие.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Diagram */}
            <div className="glass p-6 md:p-8 animate-border-glow relative overflow-hidden">
              <div className="absolute top-4 left-4 font-mono-brand text-[10px] text-[rgba(0,242,255,0.35)] tracking-[0.2em]">
                SYSTEM_FLOW_v3.2
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00F2FF]" style={{animation: "pulse-cyan 1.5s ease-in-out infinite"}}/>
                <span className="font-mono-brand text-[10px] text-[rgba(0,242,255,0.45)]">LIVE</span>
              </div>
              <div className="pt-8">
                <DataFlowDiagram />
              </div>
            </div>

            {/* Principles */}
            <div className="space-y-5">
              {[
                {
                  num: "①",
                  title: "Причина формирует архитектуру",
                  desc: "Бизнес-требования — единственный источник архитектурных решений. Никакой технологии ради технологии.",
                  metric: "100% requirements traceability",
                  accent: "gold",
                },
                {
                  num: "②",
                  title: "Следствие измеримо",
                  desc: "Каждое решение имеет конкретные метрики успеха. SLA, SLO, SLI — не лозунги, а контракты.",
                  metric: "SLA → SLO → SLI",
                  accent: "cyan",
                },
                {
                  num: "③",
                  title: "Масштаб без боли",
                  desc: "Правильная архитектура масштабируется горизонтально без переписывания. Закладываем x100 запас на старте.",
                  metric: "×100 capacity by design",
                  accent: "gold",
                },
              ].map((p) => (
                <div
                  key={p.num}
                  className={`glass-cyan p-6 border transition-all duration-300 group cursor-default ${
                    p.accent === "gold"
                      ? "border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.28)]"
                      : "border-[rgba(0,242,255,0.1)] hover:border-[rgba(0,242,255,0.28)]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`font-mono-brand text-2xl leading-none mt-0.5 ${
                      p.accent === "gold" ? "text-[#D4AF37]" : "text-[#00F2FF]"
                    }`}>{p.num}</span>
                    <div>
                      <h4 className="text-white mb-2 tracking-tight"
                        style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 600}}>
                        {p.title}
                      </h4>
                      <p className="text-[rgba(255,255,255,0.4)] text-sm leading-relaxed font-light mb-3">{p.desc}</p>
                      <span className={`font-mono-brand text-[11px] tracking-[0.12em] ${
                        p.accent === "gold" ? "text-[rgba(212,175,55,0.65)]" : "text-[rgba(0,242,255,0.65)]"
                      }`}>
                        → {p.metric}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="контакты" className="relative py-32 border-t border-[rgba(212,175,55,0.07)]">
        <div className="absolute inset-0 grid-bg opacity-40"/>
        <div className="absolute top-0 left-0 right-0 h-px" style={{background: "linear-gradient(to right, transparent, rgba(212,175,55,0.25), transparent)"}}/>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-14 h-px" style={{background: "linear-gradient(to right, transparent, #D4AF37)"}}/>
            <div className="node-dot-gold"/>
            <div className="w-14 h-px" style={{background: "linear-gradient(to left, transparent, #D4AF37)"}}/>
          </div>

          <h2 style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 5vw, 4.5rem)"}} className="leading-tight tracking-tight mb-6">
            <span className="text-white">Готовы к </span>
            <span className="text-gold-gradient">точному</span>
            <br/>
            <span className="text-white">инженерингу?</span>
          </h2>

          <p className="text-[rgba(255,255,255,0.38)] text-lg mb-12 font-light max-w-2xl mx-auto">
            Расскажите о вашей системе. Мы проведём бесплатный архитектурный
            аудит и предложим конкретный план в течение 48 часов.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="cta-btn animate-pulse-gold border border-[#D4AF37] px-10 py-5 text-[#D4AF37] text-[13px] tracking-[0.22em] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-300"
              style={{fontFamily: "'Montserrat', sans-serif", fontWeight: 700}}>
              БЕСПЛАТНЫЙ АУДИТ
            </button>
            <button className="border border-[rgba(255,255,255,0.08)] px-10 py-5 text-[rgba(255,255,255,0.4)] font-mono-brand text-[13px] tracking-[0.15em] hover:border-[rgba(255,255,255,0.22)] hover:text-white transition-all duration-300">
              ПОСМОТРЕТЬ КЕЙСЫ
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row gap-6 justify-center items-center">
            {[
              { icon: "Mail",   label: "hello@itkarma.io"   },
              { icon: "Phone",  label: "+7 (495) 000-00-00" },
              { icon: "MapPin", label: "Москва, Россия"     },
            ].map((c) => (
              <div key={c.icon} className="flex items-center gap-3 text-[rgba(255,255,255,0.28)] hover:text-[rgba(255,255,255,0.55)] transition-colors duration-300 cursor-pointer">
                <Icon name={c.icon} size={13} className="text-[#D4AF37]" />
                <span className="font-mono-brand text-[11px] tracking-[0.1em]">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[rgba(255,255,255,0.04)] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 border border-[rgba(212,175,55,0.35)] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#D4AF37]" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}/>
            </div>
            <span className="font-mono-brand text-sm text-[rgba(255,255,255,0.3)] tracking-[0.15em]">
              IT<span className="text-[rgba(212,175,55,0.4)]">—</span>KARMA
            </span>
          </div>

          <p className="font-mono-brand text-[11px] text-[rgba(255,255,255,0.18)] tracking-wide">
            © 2026 IT-Karma. Precise Engineering for High-Load Systems.
          </p>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FF]" style={{boxShadow: "0 0 6px #00F2FF", animation: "pulse-cyan 2s ease-in-out infinite"}}/>
            <span className="font-mono-brand text-[10px] text-[rgba(0,242,255,0.35)] tracking-wider">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
