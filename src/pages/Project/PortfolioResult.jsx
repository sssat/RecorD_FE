import { formatCompactKoreanDate } from '../../utils/dateUtils';

const SECTION_META = {
  situation: {
    label: 'Situation (상황)',
    accent: '#a8d45f',
    surface: '#f4f9e8',
    icon: SituationIcon,
  },
  task: {
    label: 'Task (과제)',
    accent: '#7da5ee',
    surface: '#eef4ff',
    icon: TaskIcon,
  },
  action: {
    label: 'Action (행동)',
    accent: '#8fd97a',
    surface: '#eef9ec',
    icon: ActionIcon,
  },
  result: {
    label: 'Result (결과)',
    accent: '#efd74e',
    surface: '#fff8dd',
    icon: ResultIcon,
  },
};

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m14.5 5.5-6 6 6 6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m4.75 16.75 8.8-8.8 3.5 3.5-8.8 8.8-3.9.4.4-3.9Z" />
      <path d="m12.75 8.75 2.25-2.25a1.6 1.6 0 0 1 2.25 0l.25.25a1.6 1.6 0 0 1 0 2.25l-2.25 2.25" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M4.75 7.5h14.5" />
      <path d="M9.25 3.75h5.5" />
      <path d="M8 7.5V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7.5" />
      <path d="M10.5 11v5" />
      <path d="M13.5 11v5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M12 4.5v10" />
      <path d="m8 11.5 4 4 4-4" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

function StarSparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
      <path d="m18.5 3 .6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
      <path d="m5.5 14 .7 1.9 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.9Z" />
    </svg>
  );
}

function SituationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="3.25" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M7 3.75h6.5L19.25 9.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z" />
      <path d="M13 3.75V9.5h5.75" />
      <path d="M8.5 13h7" />
      <path d="M8.5 16.5h7" />
    </svg>
  );
}

function ActionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M6 17.5 18 5.5" />
      <path d="M8 5.5h10v10" />
    </svg>
  );
}

function ResultIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M8.5 18.5h7" />
      <path d="M12 5.5a3 3 0 0 1 3 3c0 1.33-.87 2.44-2.06 2.82L14.5 18h-5l1.56-6.68A2.97 2.97 0 0 1 9 8.5a3 3 0 0 1 3-3Z" />
    </svg>
  );
}

function ActionButton({ children, tone = 'default', onClick }) {
  const className =
    tone === 'danger'
      ? 'border-rose-300 text-rose-500 hover:border-rose-400 hover:bg-rose-50'
      : tone === 'dark'
        ? 'border-[#454545] bg-[#454545] text-white hover:bg-[#363636]'
      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[22px] border px-5 py-3 text-sm font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}

function renderSectionBody(sectionKey, value) {
  if (sectionKey === 'action' && Array.isArray(value)) {
    return (
      <ol className="space-y-2.5 text-[1.05rem] leading-8 text-slate-700">
        {value.map((item, index) => (
          <li key={item}>{`${index + 1}) ${item}`}</li>
        ))}
      </ol>
    );
  }

  return <p className="text-[1.05rem] leading-8 text-slate-700">{value}</p>;
}

function PortfolioResult({
  projectName,
  portfolio,
  accentColor = '#a8d45f',
  onBack,
  onEdit,
  onDelete,
  onExport,
}) {
  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-base font-medium text-slate-400 transition hover:text-slate-700"
          >
            <ChevronLeftIcon />
            포트폴리오 목록으로
          </button>

          <div className="mt-7">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[0.78rem]">
              {projectName}
            </p>
            <div className="mt-2.5 flex items-center gap-4">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] text-white shadow-[0_18px_30px_-24px_rgba(15,23,42,0.28)]"
                style={{ backgroundColor: accentColor }}
              >
                <span className="scale-90">
                  <StarSparkleIcon />
                </span>
              </span>
              <div>
                <h2 className="text-[2.1rem] font-black tracking-tight text-slate-900 sm:text-[2.55rem]">
                  {portfolio.title}
                </h2>
                <p className="mt-2 text-base text-slate-400 sm:text-[1.05rem]">
                  작성일: {formatCompactKoreanDate(portfolio.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton onClick={onEdit}>
            <EditIcon />
            수정
          </ActionButton>
          <ActionButton tone="danger" onClick={onDelete}>
            <TrashIcon />
            삭제
          </ActionButton>
          <ActionButton tone="dark" onClick={onExport}>
            <DownloadIcon />
            내보내기
          </ActionButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {portfolio.keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500"
          >
            {keyword}
          </span>
        ))}
      </div>

      {Object.entries(SECTION_META).map(([sectionKey, sectionMeta]) => {
        const Icon = sectionMeta.icon;
        const sectionValue = portfolio[sectionKey];

        return (
          <section
            key={sectionKey}
            className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <span
              className="absolute left-0 top-5 h-[calc(100%-2.5rem)] w-1 rounded-r-full"
              style={{ backgroundColor: sectionMeta.accent }}
            />

            <div className="flex items-start gap-4">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px]"
                style={{
                  backgroundColor: sectionMeta.surface,
                  color: sectionMeta.accent,
                }}
              >
                <Icon />
              </span>

              <div className="min-w-0 flex-1">
                <h3
                  className="text-[1.7rem] font-black tracking-tight sm:text-[1.85rem]"
                  style={{ color: sectionMeta.accent }}
                >
                  {sectionMeta.label}
                </h3>
                <div className="mt-4.5">
                  {renderSectionBody(sectionKey, sectionValue)}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default PortfolioResult;
