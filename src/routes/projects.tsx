import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pageHead } from "@/components/site/metadata";
import { ConnectSection, PageIntro, ProductFeature, ProductRow } from "@/components/site/sections";
import { publicProductsQuery } from "@/lib/products.queries";

export const Route = createFileRoute("/projects")({
  component: Projects,
  loader: ({ context }) => context.queryClient.ensureQueryData(publicProductsQuery),
  head: () =>
    pageHead(
      "Projects | Synaptik",
      "The products Synaptik is building today, led by Neura, an EEG analysis application exploring machine learning and seizure-related patterns.",
    ),
});

function Projects() {
  const { data: products } = useSuspenseQuery(publicProductsQuery);
  const [lead, ...rest] = products;

  return (
    <>
      <PageIntro
        eyebrow="WHAT WE ARE BUILDING"
        title="Projects, in progress."
        description="Everything here is early by design. We publish the tools we are actively exploring, and say plainly what is still being learned."
      />

      {lead ? (
        <ProductFeature product={lead} full label="OUR FIRST PROJECT" />
      ) : (
        <section className="content-band">
          <div className="container">
            <p className="contact-note">No published projects yet — check back soon.</p>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container product-list" aria-label="More projects">
          <p className="section-label"><span>—</span>MORE PROJECTS</p>
          {rest.map(product => (
            <ProductRow key={product.id} product={product} />
          ))}
        </section>
      )}

      <ConnectSection />
    </>
  );
}
