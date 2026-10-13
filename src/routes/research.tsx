import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/site/metadata";
import { PageIntro, ConnectSection } from "@/components/site/sections";
const areas = [
  ["Neuroscience & brain signals", "Exploring how electrical activity in the brain can be analyzed and interpreted, beginning with EEG and seizure-related patterns."],
  ["Machine learning & programming", "Investigating computational approaches to brain-signal analysis, with Neura as our first exploratory application."],
  ["Engineering & robotics", "A longer-term interest in how engineering and robotics can connect scientific ideas with practical tools for healthcare and discovery."],
  ["Brain–computer interfaces", "A future-facing area of curiosity: exploring the relationship between neural activity, technology, and human interaction."],
];
export const Route = createFileRoute("/research")({ component: Research, head: () => pageHead("Research & Innovation | Synaptik", "Explore Synaptik’s interests in brain signals, machine learning, engineering, robotics, and brain-computer interfaces.") });
function Research() {
  return <><PageIntro eyebrow="RESEARCH & INNOVATION" title="Questions worth exploring." description="Our interests span the connections between neuroscience and technology. These are directions for exploration—not a catalogue of completed research."/><section className="container research-list">{areas.map(([title, description], index) => <article className="research-item" key={title}><span>0{index + 1}</span><h2>{title}</h2><p className="muted-copy">{description}</p></article>)}</section><ConnectSection/></>;
}