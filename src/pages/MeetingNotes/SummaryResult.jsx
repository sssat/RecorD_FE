function normalizeTextList(values) {
  if (Array.isArray(values)) {
    return values.filter(Boolean);
  }

  return String(values ?? "")
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeActionItemChecks(actionItems, actionItemChecks = []) {
  return actionItems.map((_, index) => Boolean(actionItemChecks[index]));
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[2]"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[2]"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function SummaryResult({
  summary = "",
  keyPoints = [],
  actionItems = [],
  actionItemChecks = [],
  editable = false,
  summaryTitle = "AI 요약",
  onSummaryChange,
  onKeyPointsChange,
  onActionItemChange,
  onAddActionItem,
  onRemoveActionItem,
  onToggleActionItem,
}) {
  const keyPointList = normalizeTextList(keyPoints);
  const actionItemList = normalizeTextList(actionItems);
  const checkedActionItems = normalizeActionItemChecks(
    actionItemList,
    actionItemChecks,
  );
  const editableActionItems = Array.isArray(actionItems) ? actionItems : [];
  const editableActionItemChecks = normalizeActionItemChecks(
    editableActionItems,
    actionItemChecks,
  );

  if (editable) {
    return (
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-800">
            {summaryTitle}
          </label>
          <textarea
            value={summary}
            onChange={(event) => onSummaryChange?.(event.target.value)}
            rows={5}
            placeholder="회의 요약 내용을 입력해주세요."
            className="w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#67b6a7] focus:bg-white focus:ring-4 focus:ring-[#d8f2eb]"
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-800">
              주요 논의 사항 (한 줄당 하나씩)
            </label>
            <textarea
              value={
                Array.isArray(keyPoints) ? keyPoints.join("\n") : keyPoints
              }
              onChange={(event) => onKeyPointsChange?.(event.target.value)}
              rows={7}
              placeholder="회의의 핵심 논의 사항을 입력해주세요."
              className="w-full rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#67b6a7] focus:bg-white focus:ring-4 focus:ring-[#d8f2eb]"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-800">
              체크리스트
            </label>
            <div className="space-y-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              {editableActionItems.length > 0 ? (
                editableActionItems.map((item, index) => (
                  <div
                    key={`editable-action-item-${index}`}
                    className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={editableActionItemChecks[index]}
                      onChange={() => onToggleActionItem?.(index)}
                      className="h-5 w-5 shrink-0 rounded border-slate-300 text-[#6d8bdf] focus:ring-[#d9e3ff]"
                    />
                    <input
                      type="text"
                      value={item}
                      onChange={(event) =>
                        onActionItemChange?.(index, event.target.value)
                      }
                      placeholder="담당자와 기한이 있다면 함께 적어주세요."
                      className="flex-1 bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveActionItem?.(index)}
                      className="rounded-full p-2 text-slate-300 transition hover:bg-slate-50 hover:text-slate-500"
                      aria-label="체크리스트 삭제"
                    >
                      <MinusIcon />
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">
                  체크리스트를 추가해 주세요.
                </div>
              )}

              <button
                type="button"
                onClick={() => onAddActionItem?.()}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#67b6a7] hover:text-[#2b7a6c]"
              >
                <PlusIcon />
                체크리스트 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#b6e6dc] bg-gradient-to-r from-[#e8faf7] via-[#effaf4] to-[#f4fbdd] shadow-sm">
        <div className="px-6 py-5">
          <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900">
            AI 요약
          </h2>
          <p className="mt-4 whitespace-pre-line text-lg leading-9 text-slate-800">
            {summary || "저장된 요약 내용이 없습니다."}
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900">
          주요 논의 사항
        </h2>

        {keyPointList.length > 0 ? (
          <div className="mt-5 space-y-3">
            {keyPointList.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-[20px] bg-slate-50 px-5 py-5 text-base text-slate-700"
              >
                {index + 1}. {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-[20px] bg-slate-50 px-5 py-5 text-slate-400">
            저장된 논의 사항이 없습니다.
          </p>
        )}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900">
          체크리스트
        </h2>

        {actionItemList.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {actionItemList.map((item, index) => (
              <label
                key={`${item}-${index}`}
                className="flex cursor-pointer items-start gap-4 rounded-[20px] border border-slate-100 bg-slate-50 px-5 py-4 text-base text-slate-700 transition hover:border-slate-200 hover:bg-white"
              >
                <input
                  type="checkbox"
                  checked={checkedActionItems[index]}
                  readOnly={!onToggleActionItem}
                  onChange={() => onToggleActionItem?.(index)}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-[#6d8bdf] focus:ring-[#d9e3ff]"
                />
                <span
                  className={`leading-7 ${
                    checkedActionItems[index]
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-[20px] bg-slate-50 px-5 py-5 text-slate-400">
            저장된 체크리스트가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}

export default SummaryResult;
