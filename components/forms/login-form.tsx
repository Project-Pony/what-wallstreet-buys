"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DEMO_COOKIE_NAMES, ROLE_HOME_PATHS } from "@/lib/constants";
import { DEMO_PASSWORD, MOCK_USERS } from "@/lib/mock-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function setDemoCookies(role: string, userId: string) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${DEMO_COOKIE_NAMES.role}=${role}; Max-Age=${maxAge}; path=/`;
  document.cookie = `${DEMO_COOKIE_NAMES.userId}=${userId}; Max-Age=${maxAge}; path=/`;
}

export function LoginForm() {
  const [email, setEmail] = useState<string>(MOCK_USERS[1].email);
  const [password, setPassword] = useState<string>(DEMO_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const hasSupabase = useMemo(
    () =>
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!email || !password) {
        throw new Error("Enter both email and password.");
      }

      if (!hasSupabase) {
        const user = MOCK_USERS.find(
          (candidate) => candidate.email.toLowerCase() === email.toLowerCase()
        );

        if (!user || password !== DEMO_PASSWORD) {
          throw new Error("Use one of the demo accounts and the shared demo password.");
        }

        setDemoCookies(user.role, user.id);
        toast.success(`Signed in as ${user.fullName}.`);
        router.push(ROLE_HOME_PATHS[user.role]);
        router.refresh();
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Signed in successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel lg:p-8">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-blue-600 font-medium">
            Secure Access
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">
            Sign in to manage the sampling pipeline
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Access is role-gated. Client identity stays hidden from operations
            users throughout the workflow.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input
                className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </span>
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <LockKeyhole className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <input
                className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </label>

          <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl bg-sidebar p-6 text-white shadow-panel lg:p-8">
        <p className="text-[10px] uppercase tracking-widest text-blue-300 font-medium">
          Demo Access
        </p>
        <h2 className="mt-2 text-xl font-bold">
          Preview each permission model without provisioning Supabase first.
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          If Supabase env vars are missing, the app falls back to seeded demo users
          and sample leads so you can validate the UX and role restrictions locally.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-bold text-white">Shared demo password</p>
          <p className="mt-1.5 rounded-xl bg-white/10 px-3 py-2.5 font-mono text-sm text-blue-100">
            {DEMO_PASSWORD}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
              type="button"
              onClick={() => {
                setEmail(user.email);
                setPassword(DEMO_PASSWORD);
              }}
            >
              <p className="text-sm font-bold text-white">{user.fullName}</p>
              <p className="mt-0.5 text-xs text-slate-300 truncate">{user.email}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-blue-200 font-medium">
                {user.role.replaceAll("_", " ")}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
