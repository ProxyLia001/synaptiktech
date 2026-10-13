import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/components/site/metadata";
import { PageIntro, SectionLabel } from "@/components/site/sections";
import { CONTACT_EMAIL } from "@/components/site/contact-details";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () =>
    pageHead(
      "Contact Synaptik | Start a conversation",
      `Get in touch about Synaptik, Neura, neuroscience, and technology — write to ${CONTACT_EMAIL}.`,
    ),
});

function Contact() {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function copyMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const message = `Hello Synaptik,\n\n${values.get("message")}\n\n${values.get("name")}\n${values.get("email")}`;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setFeedback("Message copied. Nothing has been sent.");
    } catch {
      setFeedback("Copying is unavailable in this browser. You can select and copy your message manually.");
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="LET’S CONNECT"
        title="Curiosity is better shared."
        description="Interested in Neura, exploring a related idea, or simply want to talk about the brain and technology? We welcome the conversation."
      />
      <section className="content-band">
        <div className="container content-grid">
          <div>
            <SectionLabel number="01">GET IN TOUCH</SectionLabel>
            <h2>A conversation<br />starts with an idea.</h2>
            <p className="contact-note">
              The quickest way to reach us is email.{" "}
              <a className="footer-mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p className="contact-note">
              Or prepare your message below and copy it — this form does not send or store anything.
            </p>
          </div>
          <form className="contact-form" onSubmit={copyMessage} onChange={() => { setCopied(false); setFeedback(""); }}>
            <label>Your name<input name="name" autoComplete="name" required maxLength={100} /></label>
            <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label>Your message<textarea name="message" required maxLength={5000} /></label>
            <Button type="submit" variant="editorial" size="editorial">
              {copied ? <Check /> : <Copy />}
              {copied ? "Message copied" : "Copy message"}
            </Button>
            <p className="form-feedback" role="status">{feedback}</p>
            <a className="contact-note" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={14} aria-hidden="true" /> Prefer email? {CONTACT_EMAIL}
            </a>
          </form>
        </div>
      </section>
    </>
  );
}
