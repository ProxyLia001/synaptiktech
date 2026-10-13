import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/site/metadata";
import { PageIntro, ProjectFeature, ConnectSection } from "@/components/site/sections";
export const Route = createFileRoute("/projects")({ component: Projects, head: () => pageHead("Neura & Projects | Synaptik", "Meet Neura, Synaptik’s first project: an EEG analysis application exploring machine learning for seizure-related patterns.") });
function Projects() {
  return <><PageIntro eyebrow="OUR PROJECTS" title="Turning curiosity into tools." description="Our work begins with Neura: an exploration of brain signals, machine learning, and the questions they can help us ask."/><ProjectFeature full/><ConnectSection/></>;
}