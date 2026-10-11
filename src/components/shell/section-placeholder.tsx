type Props = {
  title: string;
  description: string;
};

export function SectionPlaceholder({ title, description }: Props) {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--trace-border)] bg-[var(--trace-panel)] p-6">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-[var(--trace-text-secondary)]">{description}</p>
      </div>
    </main>
  );
}
