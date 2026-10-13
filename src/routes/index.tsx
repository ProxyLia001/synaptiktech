import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import neuralImage from "@/assets/neural-network.webp";
import { pageHead } from "@/components/site/metadata";
import { AboutPreview, ConnectSection, DisciplineStrip, ProductFeature } from "@/components/site/sections";
import { publicProductsQuery } from "@/lib/products.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
export const Route = createFileRoute("/")({
  component: Index,
  loader: ({ context }) => context.queryClient.ensureQueryData(publicProductsQuery),
  head: () => pageHead("Synaptik | Neuroscience meets possibility", "Synaptik is an early-stage neuroscience and technology venture exploring EEG analysis, machine learning, and the possibilities of the brain."),
});
function Index() {
  const { data: products } = useSuspenseQuery(publicProductsQuery);
  const lead = products[0];
  return <><section className="hero"><img className="hero-image" src={neuralImage} alt="Artistic visualization of interconnected neural pathways in the human brain" width={1920} height={1024} fetchPriority="high"/><div className="container hero-inner"><p className="eyebrow"><span/>NEUROSCIENCE. TECHNOLOGY. POSSIBILITY.</p><h1><span className="hero-name">Synaptik</span>Understanding<br/>the brain.<br/><em>Expanding possibility.</em></h1><p className="hero-description">Bridging neuroscience and technology to explore the brain, build meaningful tools, and move human understanding forward.</p><div className="hero-actions"><Button asChild variant="editorial" size="editorial"><Link to="/projects">Explore our projects <ArrowUpRight/></Link></Button><Button asChild variant="quiet" size="editorial"><Link to="/about">Discover Synaptik <ArrowUpRight/></Link></Button></div><div className="hero-foot"><a href="#vision">SCROLL TO EXPLORE <ArrowDown size={13}/></a><span>AN EARLY-STAGE VENTURE. A LONG-TERM VISION.</span></div></div></section><DisciplineStrip/><div id="vision"><AboutPreview/></div>{lead && <ProductFeature product={lead} />}<ConnectSection/></>;
}
