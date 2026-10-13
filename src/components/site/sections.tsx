import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Brain, Code2, CircuitBoard, Bot, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products.functions";

export function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <p className="section-label">
      <span>{number}</span>
      {children}
    </p>
  );
}

export function DisciplineStrip() {
  return (
    <div className="disciplines" aria-label="Fields Synaptik works across">
      <span><Brain aria-hidden="true" />NEUROSCIENCE</span>
      <span><CircuitBoard aria-hidden="true" />ENGINEERING</span>
      <span><Code2 aria-hidden="true" />PROGRAMMING</span>
      <span><Bot aria-hidden="true" />ROBOTICS</span>
      <span><Activity aria-hidden="true" />BRAIN–COMPUTER INTERFACES</span>
    </div>
  );
}

export function AboutPreview() {
  return (
    <section className="section about-preview">
      <div className="container about-preview">
        <div>
          <SectionLabel number="01">WHO WE ARE</SectionLabel>
          <h2>Early-stage, deliberately.</h2>
        </div>
        <div className="about-copy">
          <p>Synaptik explores how intelligent systems and the brain can inform one another — and turns those
            explorations into working tools. We are a small, independent venture: no announcements, no claims,
            just the first careful steps.</p>
          <Link to="/about" className="text-link">OUR APPROACH <ArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function EEGVisual({ product }: { product: Product }) {
  if (!product) return null;
  return (
    <div className="eeg-visual" role="img" aria-label={`Illustrative waveform panel for ${product.name}. Not research data.`}>
      <div className="eeg-top">
        <span><Activity aria-hidden="true" /> {product.name.toUpperCase()}</span>
        <span className="eeg-caption">{product.stage.toUpperCase()}</span>
      </div>
      <div className="eeg-screen">
        {[
          "M0,20 C10,5 16,35 26,20 C34,8 40,30 52,18 C62,8 70,32 82,20 C92,10 100,28 112,18 C124,6 132,32 144,20 C154,10 162,28 172,18",
          "M0,24 C14,24 18,10 28,24 C38,38 44,12 56,24 C66,34 74,10 86,24 C98,36 104,14 116,24 C128,34 136,12 148,24 C158,34 166,18 172,24",
          "M0,18 C12,30 18,6 30,18 C42,28 48,8 60,18 C70,26 78,10 90,18 C100,24 108,12 120,18 C132,26 140,10 152,18 C162,24 168,14 172,18",
          "M0,22 C8,22 14,14 22,22 C30,30 36,16 46,22 C56,28 62,18 72,22 C82,26 90,16 100,22 C110,28 118,18 128,22 C138,26 146,18 156,22 C164,25 168,20 172,22"
        ].map((d, i) => (
          <div className="eeg-channel" key={i}>
            <span className="eeg-label">CH{i + 1}</span>
            <svg viewBox="0 0 172 40" preserveAspectRatio="none" aria-hidden="true"><path d={d} /></svg>
          </div>
        ))}
      </div>
      <div className="eeg-bottom">
        <span>ILLUSTRATIVE VISUALIZATION</span><span>NOT RESEARCH DATA</span>
      </div>
    </div>
  );
}

export function ProductFeature({
  product,
  full = false,
  label,
}: {
  product: Product;
  full?: boolean;
  label?: string;
}) {
  if (!product) return null;
  return (
    <section className="project-section">
      <div className="container">
        <div className="section-heading">
          <SectionLabel number="02">{label ?? (full ? "OUR PROJECTS" : "FROM VISION TO EXPLORATION")}</SectionLabel>
          {!full && <Link to="/projects" className="text-link">ALL PROJECTS <ArrowUpRight /></Link>}
        </div>
        <div className="project-feature">
          <EEGVisual product={product} />
          <div className="project-copy">
            <span className="status"><span />{product.stage.toUpperCase()}</span>
            <h2>{product.name}<span className="accent-period">.</span></h2>
            {product.tagline && <p className="project-subtitle">{product.tagline}</p>}
            <p className="muted-copy">{product.summary}</p>
            {product.tags.length > 0 && (
              <div className="project-tags">{product.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            )}
            {product.link && (
              <Button asChild variant="quiet" size="editorial">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  {product.link_label} <ArrowUpRight />
                </a>
              </Button>
            )}
            {full && product.disclaimer && <p className="project-disclaimer">{product.disclaimer}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductRow({ product }: { product: Product }) {
  if (!product) return null;
  return (
    <article className="product-row">
      <div>
        <h3>{product.name}</h3>
        <p className="muted-copy">{product.tagline || product.summary}</p>
        {product.tags.length > 0 && (
          <div className="project-tags">{product.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        )}
        {product.disclaimer && <p className="project-disclaimer">{product.disclaimer}</p>}
      </div>
      {product.link ? (
        <a className="text-link" href={product.link} target="_blank" rel="noopener noreferrer">
          {product.link_label} <ArrowUpRight />
        </a>
      ) : null}
    </article>
  );
}

export function ConnectSection() {
  return (
    <section className="section connect-section">
      <div className="container">
        <div>
          <SectionLabel number="03">CONNECT</SectionLabel>
          <h2>Early conversations are welcome.</h2>
        </div>
        <p>If you work in neuroscience, engineering, clinical research or machine learning and would like to
          compare notes about projects like Neura, write to us.</p>
        <Button asChild variant="quiet" size="editorial">
          <Link to="/contact">GET IN TOUCH <ArrowUpRight /></Link>
        </Button>
      </div>
    </section>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="page-intro">
      <div className="container">
        <SectionLabel number="—">{eyebrow}</SectionLabel>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
