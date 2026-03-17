interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500">{description}</p>
    </div>
  );
}
