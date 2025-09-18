"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AuthForm from "../components/AuthForm";
import ScheduleForm from "../components/ScheduleForm";
import ScheduleList from "../components/ScheduleList";
import Header from "@/components/Header";

export default function Home() {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <Header user={user} onSignOut={() => supabase.auth.signOut()} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <ScheduleForm />
        <ScheduleList />
      </main>
    </div>
  );
}
