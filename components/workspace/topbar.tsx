export function TopBar({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex h-[57px] shrink-0 items-center justify-between gap-4 border-b border-rule px-4 lg:px-6">
      <div className="flex min-w-0 items-baseline gap-3">
        <h1 className="shrink-0 text-[15px] font-semibold tracking-[-0.01em]">{title}</h1>
        {meta ? (
          <span className="truncate font-mono text-[11px] text-faint">{meta}</span>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </header>
  );
}
