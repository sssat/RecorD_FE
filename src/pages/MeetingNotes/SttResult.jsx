function SttResult({
  label = '회의 내용 (전사)',
  value = '',
  editable = false,
  onChange,
  placeholder = '회의 내용을 입력해주세요.',
  rows = 10,
}) {
  if (editable) {
    return (
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-800">
          {label}
        </label>
        <textarea
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#67b6a7] focus:bg-white focus:ring-4 focus:ring-[#d8f2eb]"
        />
      </div>
    );
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900">
        {label}
      </h2>
      <div className="mt-5 rounded-[24px] bg-slate-50 px-5 py-5 text-base leading-8 text-slate-700">
        {value ? (
          <p className="whitespace-pre-line">{value}</p>
        ) : (
          <p className="text-slate-400">전사된 회의 내용이 아직 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default SttResult;
