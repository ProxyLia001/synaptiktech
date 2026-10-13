import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/components/site/metadata";
import { PageIntro } from "@/components/site/sections";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({
    meta: [
      ...pageHead("Owner sign in | Synaptik", "Sign in to manage the products shown on the Synaptik website.").meta,
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  async function afterAuth() {
    const { data: isAdmin } = await supabase.rpc("current_user_is_admin");
    navigate({ to: isAdmin ? "/admin" : "/" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setAlert(null);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) setAlert({ kind: "error", text: error.message });
        else if (data.session) await afterAuth();
        else setAlert({ kind: "ok", text: "We sent a confirmation link to your inbox. Open it, then sign in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAlert({ kind: "error", text: "We couldn’t sign you in. Check the address and password." });
        else await afterAuth();
      }
    } catch {
      setAlert({ kind: "error", text: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageIntro
        eyebrow="OWNER ACCESS"
        title="Manage your products."
        description="Sign in to add, update or hide the projects shown on this site. Only the owner account can make changes."
      />
      <section className="auth-band">
        <div className="container auth-panel">
          <div className="auth-tabs" role="tablist" aria-label="Sign in or create an account">
            <button type="button" role="tab" aria-selected={mode === "in"} onClick={() => { setMode("in"); setAlert(null); }}>SIGN IN</button>
            <button type="button" role="tab" aria-selected={mode === "up"} onClick={() => { setMode("up"); setAlert(null); }}>CREATE ACCOUNT</button>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <label>Email address
              <input name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            <label>Password
              <input name="password" type="password" autoComplete={mode === "up" ? "new-password" : "current-password"} required minLength={6} maxLength={200} value={password} onChange={event => setPassword(event.target.value)} />
            </label>
            <Button type="submit" variant="editorial" size="editorial" disabled={busy}>
              {busy ? "One moment…" : mode === "up" ? "Create account" : "Sign in"}
            </Button>
          </form>
          {alert && <p className="auth-alert" data-kind={alert.kind} role="status">{alert.text}</p>}
          <p className="auth-note">Passwords are never stored on this site — sign in is handled by the secure backend.</p>
        </div>
      </section>
    </>
  );
}
