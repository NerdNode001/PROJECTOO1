import { HelpCircle, Undo2, Redo2, UserRound } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex h-[68px] items-center justify-between border-b border-[var(--trace-border)] bg-[var(--trace-surface)] px-4 md:px-6">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--trace-text-secondary)]">TRACE</p>
          <p className="text-sm font-semibold text-white">Workspace / Untitled Asset</p>
        </div>
        <span className="hidden rounded-full border border-[var(--trace-border)] px-2 py-1 text-xs text-[var(--trace-text-secondary)] sm:inline-block">
          Saved locally
        </span>
      </div>
      <div className="flex items-center gap-1 text-[var(--trace-text-secondary)]">
        <button aria-label="Undo" className="trace-icon-btn">
          <Undo2 className="h-4 w-4" />
        </button>
        <button aria-label="Redo" className="trace-icon-btn">
          <Redo2 className="h-4 w-4" />
        </button>
        <button aria-label="Help" className="trace-icon-btn">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button aria-label="User menu" className="trace-icon-btn">
          <UserRound className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
