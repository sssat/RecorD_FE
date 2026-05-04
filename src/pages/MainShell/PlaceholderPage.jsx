function PlaceholderPage({ title, description }) {
  return (
    <section className="min-h-[calc(100vh-4rem)] rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm lg:px-8">
      <div className="max-w-xl">
        <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Coming Soon
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
}

export default PlaceholderPage;
