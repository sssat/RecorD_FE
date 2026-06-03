import { useMemo, useState } from "react";

const EXPORT_FORMATS = [
  {
    key: "txt",
    label: "TXT",
    description: "문서 제출용으로 가장 단순한 텍스트 파일",
  },
  {
    key: "md",
    label: "Markdown",
    description: "노션, GitHub, 블로그 초안으로 옮기기 쉬운 형식",
  },
  {
    key: "json",
    label: "JSON",
    description: "추후 API나 자동화 파이프라인에 연결하기 좋은 구조",
  },
];

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
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

function normalizeActionValue(action) {
  if (Array.isArray(action)) {
    return action.map((item, index) => `${index + 1}. ${item}`).join("\n");
  }

  return action;
}

function buildExportPayload(portfolio, projectName) {
  return {
    projectName,
    title: portfolio.title,
    createdAt: portfolio.createdAt,
    keywords: portfolio.keywords,
    situation: portfolio.situation,
    task: portfolio.task,
    action: normalizeActionValue(portfolio.action),
    result: portfolio.result,
  };
}

function buildTextContent(payload) {
  return [
    `${payload.projectName} · ${payload.title}`,
    `작성일: ${payload.createdAt}`,
    `역량 키워드: ${payload.keywords.join(", ")}`,
    "",
    "[Situation]",
    payload.situation,
    "",
    "[Task]",
    payload.task,
    "",
    "[Action]",
    payload.action,
    "",
    "[Result]",
    payload.result,
  ].join("\n");
}

function buildMarkdownContent(payload) {
  return [
    `# ${payload.title}`,
    "",
    `- 프로젝트: ${payload.projectName}`,
    `- 작성일: ${payload.createdAt}`,
    `- 역량 키워드: ${payload.keywords.join(", ")}`,
    "",
    "## Situation",
    payload.situation,
    "",
    "## Task",
    payload.task,
    "",
    "## Action",
    payload.action,
    "",
    "## Result",
    payload.result,
  ].join("\n");
}

function buildJsonContent(payload) {
  return JSON.stringify(payload, null, 2);
}

function getFileContent(formatKey, payload) {
  if (formatKey === "md") {
    return buildMarkdownContent(payload);
  }

  if (formatKey === "json") {
    return buildJsonContent(payload);
  }

  return buildTextContent(payload);
}

function getMimeType(formatKey) {
  if (formatKey === "md") {
    return "text/markdown;charset=utf-8";
  }

  if (formatKey === "json") {
    return "application/json;charset=utf-8";
  }

  return "text/plain;charset=utf-8";
}

function PortfolioExport({ portfolio, projectName, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState("txt");

  const exportPayload = useMemo(
    () => buildExportPayload(portfolio, projectName),
    [portfolio, projectName],
  );

  const previewContent = useMemo(
    () => getFileContent(selectedFormat, exportPayload),
    [exportPayload, selectedFormat],
  );

  const handleDownload = () => {
    const blob = new Blob([previewContent], {
      type: getMimeType(selectedFormat),
    });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = downloadUrl;
    anchor.download = `${portfolio.title.replace(/\s+/g, "_")}.${selectedFormat}`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative w-full max-w-5xl rounded-[36px] bg-white p-6 shadow-[0_40px_100px_-35px_rgba(15,23,42,0.45)] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full border border-slate-200 bg-white p-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="내보내기 모달 닫기"
        >
          <XIcon />
        </button>

        <div className="max-w-none pr-20">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-semibold text-slate-500">
            Portfolio Export
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-[2.2rem] lg:whitespace-nowrap">
            STAR 포트폴리오를 원하는 형식으로 내보내기
          </h2>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-4">
            {EXPORT_FORMATS.map((format) => {
              const isSelected = selectedFormat === format.key;

              return (
                <button
                  key={format.key}
                  type="button"
                  onClick={() => setSelectedFormat(format.key)}
                  className={`w-full rounded-[26px] border px-5 py-5 text-left transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-lg font-bold text-slate-900">
                    {format.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {format.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Preview
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {portfolio.title}
                </h3>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-500">
                {selectedFormat.toUpperCase()}
              </span>
            </div>

            <pre className="mt-5 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-[24px] bg-white px-5 py-5 text-sm leading-7 text-slate-700">
              {previewContent}
            </pre>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[22px] border border-slate-200 px-6 py-4 text-base font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-[#454545] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#363636]"
          >
            <DownloadIcon />
            내보내기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioExport;
