export default function PageHeader({
  title,
  kicker,
}: {
  title: string;
  kicker?: string;
}) {
  return (
    <section className="pt-32 pb-12 px-6">
      <div className="max-w-page mx-auto">
        {kicker && (
          <p className="text-xs uppercase tracking-wide2 text-wine mb-4">
            {kicker}
          </p>
        )}
        <h1 className="heading text-4xl md:text-6xl text-ink">{title}</h1>
        <div className="gold-rule w-24 mt-8" />
      </div>
    </section>
  );
}
