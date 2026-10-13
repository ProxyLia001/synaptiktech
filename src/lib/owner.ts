import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type OwnerSession = { email: string | null; isAdmin: boolean; ready: boolean };

const idle: OwnerSession = { email: null, isAdmin: false, ready: false };

// Drives the header/footer affordance so a successful sign-in is visibly reflected.
export function useOwnerSession(): OwnerSession {
  const [session, setSession] = useState<OwnerSession>(idle);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session) return setSession({ email: null, isAdmin: false, ready: true });
      const [{ data: user }, { data: isAdmin }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.rpc("current_user_is_admin"),
      ]);
      if (!active) return;
      setSession({ email: user.user?.email ?? null, isAdmin: Boolean(isAdmin), ready: true });
    };

    load();
    const { data: subscription } = supabase.auth.onAuthStateChange(event => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load();
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return session;
}

// Four ordered steps so cached owner data never outlives the session.
export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
}
