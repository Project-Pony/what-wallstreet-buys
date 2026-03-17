import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-2xl bg-sidebar px-6 py-6 text-white shadow-panel">
          <p className="text-[10px] uppercase tracking-widest text-blue-300 font-medium">
            Manufacturing Internal Tool
          </p>
          <h1 className="mt-2 text-2xl font-bold">
            Sales Sampling Workflow Control Center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Track every step from lead enquiry to PI dispatch while strictly masking
            client identity from operations teams.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
