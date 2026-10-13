import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, LogOut, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, saveProduct, type Product } from "@/lib/products.functions";
import { ownerProductsQuery } from "@/lib/products.queries";
import { useSignOut } from "@/lib/owner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: Admin,
  loader: ({ context }) => context.queryClient.ensureQueryData(ownerProductsQuery),
  head: () => ({
    meta: [
      { title: "Manage products | Synaptik" },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: AdminProblem,
});

type FormState = {
  id: string | null;
  name: string;
  slug: string;
  tagline: string;
  summary: string;
  stage: string;
  tagsText: string;
  link: string;
  link_label: string;
  disclaimer: string;
  is_published: boolean;
  sort_order: string;
};

const blankForm = (sort_order: number): FormState => ({
  id: null,
  name: "",
  slug: "",
  tagline: "",
  summary: "",
  stage: "Early-stage project",
  tagsText: "",
  link: "",
  link_label: "Open project",
  disclaimer: "",
  is_published: true,
  sort_order: String(sort_order),
});

const formFromProduct = (product: Product): FormState => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  tagline: product.tagline ?? "",
  summary: product.summary ?? "",
  stage: product.stage ?? "",
  tagsText: (product.tags ?? []).join(", "),
  link: product.link ?? "",
  link_label: product.link_label ?? "",
  disclaimer: product.disclaimer ?? "",
  is_published: product.is_published,
  sort_order: String(product.sort_order ?? 0),
});

function AdminProblem({ error }: { error: unknown }) {
  return (
    <section className="auth-band">
      <div className="container auth-panel">
        <p className="auth-alert" data-kind="error">
          {error instanceof Error ? error.message : "This page could not be loaded."}
        </p>
        <Button asChild variant="quiet" size="editorial">
          <Link to="/">Back to the site</Link>
        </Button>
      </div>
    </section>
  );
}

function Admin() {
  const { data: products } = useSuspenseQuery(ownerProductsQuery);
  const queryClient = useQueryClient();
  const save = useServerFn(saveProduct);
  const remove = useServerFn(deleteProduct);
  const signOut = useSignOut();

  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["products"] });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    setFeedback("");
    try {
      await save({
        data: {
          id: form.id,
          name: form.name,
          slug: form.slug,
          tagline: form.tagline,
          summary: form.summary,
          stage: form.stage,
          tags: form.tagsText,
          link: form.link,
          link_label: form.link_label,
          disclaimer: form.disclaimer,
          is_published: form.is_published,
          sort_order: form.sort_order,
        },
      });
      await refresh();
      setForm(null);
      setFeedback(form.id ? "Saved. The site now shows the update." : "Added. It is on your site now.");
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "The product could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(product: Product) {
    if (!window.confirm(`Remove ${product.name} from the site?`)) return;
    setFeedback("");
    try {
      await remove({ data: { id: product.id } });
      await refresh();
      if (form?.id === product.id) setForm(null);
      setFeedback(`${product.name} has been removed.`);
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "The product could not be removed.");
    }
  }

  const field = (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(current => (current ? { ...current, [key]: event.target.value } : current));

  return (
    <>
      <section className="container owner-head">
        <div>
          <p className="eyebrow"><span />PRODUCT MANAGER</p>
          <h1>Your products<span className="accent-period">.</span></h1>
        </div>
        <div className="owner-actions">
          <Button asChild variant="quiet" size="editorial">
            <Link to="/projects">View site <ExternalLink size={15} /></Link>
          </Button>
          <Button variant="ghost" size="editorial" onClick={signOut}>
            <LogOut size={15} /> Sign out
          </Button>
        </div>
      </section>

      <section className="container">
        <div className="owner-list">
          {products.map(product => (
            <article className="owner-item" key={product.id}>
              <div>
                <h3>{product.name}</h3>
                <p>{product.tagline || product.summary}</p>
              </div>
              <div className="owner-actions">
                <span className="owner-tag" data-live={product.is_published}>
                  {product.is_published ? "VISIBLE" : "HIDDEN"}
                </span>
                {product.link && (
                  <a className="owner-tag" href={product.link} target="_blank" rel="noopener noreferrer">
                    OPEN LINK
                  </a>
                )}
                <Button variant="quiet" size="sm" onClick={() => { setForm(formFromProduct(product)); setFeedback(""); }}>
                  <Pencil size={14} /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
                  <Trash2 size={14} /> Remove
                </Button>
              </div>
            </article>
          ))}
          {products.length === 0 && (
            <p className="contact-note" style={{ paddingBlock: 24 }}>
              Nothing here yet — add your first product below.
            </p>
          )}
        </div>
      </section>

      <section className="container">
        {form ? (
          <div className="owner-panel">
            <div className="section-heading" style={{ marginBottom: 24 }}>
              <p className="section-label"><span>—</span>{form.id ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
              <button
                type="button"
                className="text-link"
                onClick={() => { setForm(null); setFeedback(""); }}
              >
                CLOSE <X size={14} />
              </button>
            </div>
            <form className="owner-form" onSubmit={onSubmit}>
              <div className="owner-row">
                <label>Name
                  <input required maxLength={80} value={form.name} onChange={field("name")} placeholder="Neura" />
                </label>
                <label>Web address (optional)
                  <input maxLength={60} value={form.slug} onChange={field("slug")} placeholder="auto from name" />
                </label>
              </div>
              <label>One-line description
                <input maxLength={160} value={form.tagline} onChange={field("tagline")} placeholder="An EEG analysis application." />
              </label>
              <label>Full description
                <textarea maxLength={2000} value={form.summary} onChange={field("summary")} placeholder="What it does, who it is for, where it stands." />
              </label>
              <div className="owner-row">
                <label>Stage
                  <input maxLength={60} value={form.stage} onChange={field("stage")} placeholder="Early-stage project" />
                </label>
                <label>Order (lower shows first)
                  <input type="number" value={form.sort_order} onChange={field("sort_order")} />
                </label>
              </div>
              <label>Tags (comma separated)
                <input maxLength={240} value={form.tagsText} onChange={field("tagsText")} placeholder="EEG, Machine Learning, Healthcare" />
              </label>
              <div className="owner-row">
                <label>Link
                  <input maxLength={500} value={form.link} onChange={field("link")} placeholder="https://…" />
                </label>
                <label>Link label
                  <input maxLength={40} value={form.link_label} onChange={field("link_label")} placeholder="Open project" />
                </label>
              </div>
              <label>Disclaimer (optional)
                <textarea maxLength={600} style={{ minHeight: 70 }} value={form.disclaimer} onChange={field("disclaimer")} placeholder="Exploratory work. Not clinically validated." />
              </label>
              <label className="owner-check">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={event => setForm(current => (current ? { ...current, is_published: event.target.checked } : current))}
                />
                Show this product on the website
              </label>
              <div className="owner-actions-row">
                <Button type="submit" variant="editorial" size="editorial" disabled={busy}>
                  <Save size={15} /> {busy ? "Saving…" : form.id ? "Save changes" : "Add product"}
                </Button>
                <Button type="button" variant="quiet" size="editorial" onClick={() => { setForm(null); setFeedback(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ paddingBlock: 34 }}>
            <Button variant="editorial" size="editorial" onClick={() => { setForm(blankForm(products.length + 1)); setFeedback(""); }}>
              <Plus size={16} /> Add a product
            </Button>
          </div>
        )}
        {feedback && <p className="owner-feedback" role="status">{feedback}</p>}
      </section>
    </>
  );
}
