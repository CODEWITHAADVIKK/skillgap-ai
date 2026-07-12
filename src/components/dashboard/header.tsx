interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      {subtitle ? (
        <p className="mt-2 max-w-3xl font-body-md text-body-md text-on-surface-variant">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
