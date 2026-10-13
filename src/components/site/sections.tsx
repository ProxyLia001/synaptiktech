import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Brain, Code2, CircuitBoard, Bot, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}</p>;
}

export function DisciplineStrip() {
  return <div className="discipline-strip"><div className="container disciplines">{[{ icon: Brain, text: "Neuroscience" }, { icon: Code2, text: "Programming" }, { icon: CircuitBoard, text: "Engineering" }, { icon: Bot, text: "Robotics" }, { icon: Activity, text: "Brain–computer interfaces" }].map(({ icon: Icon, text }) => <span key={text}><Icon size={17} strokeWidth={1.4}/>{text}</span>)}</div></div>;
}

export function AboutPreview() {
  return <section className="section container about-preview"><div><SectionLabel number="01">THE VISION</SectionLabel><h2>Different disciplines.<br/>One shared curiosity.</h2></div><div className="about-copy"><p>We believe the most meaningful discoveries happen where disciplines meet.</p><p className="muted-copy">Synaptik is an early-stage venture bringing neuroscience and technology together. Our ambition is to build thoughtful tools that advance healthcare, scientific discovery, and our understanding of the brain—and beyond.</p><Link to="/about" className="text-link">Meet Synaptik <ArrowUpRight size={17}/></Link></div></section>;
}

export function EEGVisual() {
  return <div className="eeg-visual" role="img" aria-label="Illustrative EEG waveforms, not research data"><div className="eeg-top"><span><Activity size={17}/> NEURA</span><span className="eeg-caption">EEG EXPLORATION</span></div><div className="eeg-chart">{Array.from({ length: 5 }, (_, row) => <div className="eeg-channel" key={row}><span>{["Fp1", "Fp2", "F3", "F4", "C3"][row]}</span><svg viewBox="0 0 600 52" preserveAspectRatio="none" aria-hidden="true"><path d={Array.from({ length: 301 }, (_, i) => { const x = i * 2; const peak = Math.exp(-Math.pow((x - 330 - row * 7) / 28, 2)); const y = 26 + Math.sin(i * .66 + row * 2) * (3 + peak * 15) + Math.sin(i * .21 + row) * 4 + Math.sin(i * 1.7) * 2; return `${i === 0 ? "M" : "L"}${x},${y.toFixed(2)}`; }).join(" ")} fill="none" stroke="currentColor" strokeWidth="1.1"/></svg></div>)}</div><div className="eeg-bottom"><span>EXPLORING SIGNAL. FINDING POSSIBILITY.</span><span>Illustrative visualization</span></div></div>;
}

export function ProjectFeature({ full = false }: { full?: boolean }) {
  return <section className="project-section"><div className="container"><div className="section-heading"><SectionLabel number="02">{full ? "OUR FIRST PROJECT" : "FROM VISION TO EXPLORATION"}</SectionLabel>{!full && <Link to="/projects" className="text-link">All projects <ArrowUpRight size={17}/></Link>}</div><div className="project-feature"><EEGVisual/><div className="project-copy"><span className="status"><span/> EARLY-STAGE PROJECT</span><h2>Neura<span className="accent-period">.</span></h2><p className="project-subtitle">A closer look at the brain’s signals.</p><p className="muted-copy">An EEG analysis application exploring how machine learning can help identify seizure-related patterns in brain activity.</p><div className="project-tags"><span>EEG analysis</span><span>Machine learning</span><span>Neuroscience</span></div>{!full ? <Button asChild variant="quiet" size="editorial"><Link to="/projects">Explore Neura <ArrowUpRight size={17}/></Link></Button> : <p className="project-disclaimer">An exploratory project, not a clinically validated diagnostic tool. No research outcomes or performance claims are presented.</p>}</div></div></div></section>;
}

export function ConnectSection() {
  return <section className="connect-section container"><div><SectionLabel number="03">START A CONVERSATION</SectionLabel><h2>Curiosity is better shared.</h2><p className="muted-copy">Interested in our work, or have a perspective to share?</p></div><Button asChild variant="editorial" size="editorial"><Link to="/contact">Let’s connect <ArrowRight size={17}/></Link></Button></section>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro container"><p className="eyebrow"><span/>{eyebrow}</p><h1>{title}</h1><p>{description}</p></section>;
}