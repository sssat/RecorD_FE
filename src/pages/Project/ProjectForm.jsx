import { useEffect, useMemo, useState } from "react";
import {
  PROJECT_COLOR_THEMES,
  PROJECT_STATUS_META,
} from "../../data/projectApi";
import { isDateRangeValid } from "../../utils/dateUtils";

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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[2.2]"
    >
      <path d="m5 12.5 4.2 4.2L19 7.3" />
    </svg>
  );
}

function createInitialFormValues(project) {
  if (project) {
    return {
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      tags: project.tags.join(", "),
      status: project.status,
      colorKey: project.colorKey,
      meetingIds: project.meetingIds,
      todoIds: project.todoIds,
      scheduleIds: project.scheduleIds,
    };
  }

  return {
    name: "",
    description: "",
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    tags: "",
    status: "inProgress",
    colorKey: "green",
    meetingIds: [],
    todoIds: [],
    scheduleIds: [],
  };
}

function SelectionCard({
  checked,
  title,
  meta,
  onToggle,
  toneClassName = "text-slate-500",
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition ${
        checked
          ? "border-slate-900 bg-slate-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
        style={{
          borderColor: checked ? "#454545" : "#cbd5e1",
          backgroundColor: checked ? "#454545" : "transparent",
          color: checked ? "#ffffff" : "#94a3b8",
        }}
      >
        {checked ? <CheckIcon /> : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-slate-900">
          {title}
        </span>
        <span className={`mt-1 block text-sm ${toneClassName}`}>{meta}</span>
      </span>
    </button>
  );
}

function ProjectForm({
  mode,
  project,
  meetingOptions,
  todoOptions,
  scheduleOptions,
  onClose,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState(() =>
    createInitialFormValues(project),
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormValues(createInitialFormValues(project));
    setErrorMessage("");
  }, [project]);

  const currentTheme =
    PROJECT_COLOR_THEMES[formValues.colorKey] ?? PROJECT_COLOR_THEMES.green;

  const completedTodoCount = useMemo(
    () =>
      todoOptions.filter(
        (todo) => formValues.todoIds.includes(todo.id) && todo.completed,
      ).length,
    [formValues.todoIds, todoOptions],
  );

  const toggleSelection = (fieldName, itemId) => {
    setFormValues((currentValues) => {
      const hasItem = currentValues[fieldName].includes(itemId);

      return {
        ...currentValues,
        [fieldName]: hasItem
          ? currentValues[fieldName].filter((currentId) => currentId !== itemId)
          : [...currentValues[fieldName], itemId],
      };
    });
  };

  const handleChange = (fieldName, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formValues.name.trim()) {
      setErrorMessage("프로젝트 이름을 입력해주세요.");
      return;
    }

    if (!isDateRangeValid(formValues.startDate, formValues.endDate)) {
      setErrorMessage("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }

    setErrorMessage("");

    onSubmit({
      ...formValues,
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      tags: formValues.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[36px] bg-white shadow-[0_40px_100px_-35px_rgba(15,23,42,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full border border-slate-200 bg-white p-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="프로젝트 폼 닫기"
        >
          <XIcon />
        </button>

        <form
          onSubmit={handleSubmit}
          className="max-h-[92vh] overflow-y-auto px-6 pb-8 pt-8 sm:px-8 lg:px-10"
        >
          <div className="max-w-none pr-20">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-semibold text-slate-500">
              {mode === "edit" ? "프로젝트 수정" : "새 프로젝트 생성"}
            </span>
            <h2 className="mt-5 text-[2.2rem] font-black tracking-tight text-slate-900 sm:text-[2.05rem]">
              {mode === "edit"
                ? "기존 프로젝트 정보를 정리하고 보완하세요"
                : "회의록과 할 일을 묶어 프로젝트 폴더를 만드세요"}
            </h2>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="space-y-7">
              <section className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                <h3 className="text-xl font-bold text-slate-900">기본 정보</h3>
                <div className="mt-5 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-500">
                      프로젝트 이름
                    </span>
                    <input
                      value={formValues.name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                      className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                      placeholder="예: 포트폴리오 관리 시스템"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-500">
                      설명
                    </span>
                    <textarea
                      value={formValues.description}
                      onChange={(event) =>
                        handleChange("description", event.target.value)
                      }
                      rows={4}
                      className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                      placeholder="프로젝트 목적과 맥락을 입력해주세요"
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-500">
                        시작일
                      </span>
                      <input
                        type="date"
                        value={formValues.startDate}
                        onChange={(event) =>
                          handleChange("startDate", event.target.value)
                        }
                        className="picker-field-input w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-500">
                        종료일
                      </span>
                      <input
                        type="date"
                        value={formValues.endDate}
                        onChange={(event) =>
                          handleChange("endDate", event.target.value)
                        }
                        className="picker-field-input w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-500">
                      태그
                    </span>
                    <input
                      value={formValues.tags}
                      onChange={(event) =>
                        handleChange("tags", event.target.value)
                      }
                      className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                      placeholder="예: 웹개발, React, 디자인"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-500">
                      상태
                    </span>
                    <select
                      value={formValues.status}
                      onChange={(event) =>
                        handleChange("status", event.target.value)
                      }
                      className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-slate-400"
                    >
                      {Object.entries(PROJECT_STATUS_META).map(
                        ([statusKey, statusMeta]) => (
                          <option key={statusKey} value={statusKey}>
                            {statusMeta.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  프로젝트 색상
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  회의록, 프로젝트 카드, 포트폴리오 배지에 동일한 색상이
                  연동됩니다.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {Object.entries(PROJECT_COLOR_THEMES).map(
                    ([colorKey, theme]) => {
                      const isSelected = formValues.colorKey === colorKey;

                      return (
                        <button
                          key={colorKey}
                          type="button"
                          onClick={() => handleChange("colorKey", colorKey)}
                          className={`rounded-[24px] border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-slate-900 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.45)]"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className="block h-12 rounded-[16px]"
                            style={{ background: theme.heroGradient }}
                          />
                          <span className="mt-3 block text-base font-semibold text-slate-900">
                            {theme.name}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
              </section>
            </div>

            <div className="space-y-7">
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      연결할 회의록
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      프로젝트에 포함할 회의 기록을 선택하세요.
                    </p>
                  </div>
                  <span className="inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded-full bg-[#454545] px-4 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    {formValues.meetingIds.length}개 선택
                  </span>
                </div>

                <div className="mt-5 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                  {meetingOptions.map((meetingNote) => (
                    <SelectionCard
                      key={meetingNote.id}
                      checked={formValues.meetingIds.includes(meetingNote.id)}
                      title={meetingNote.title}
                      meta={`${meetingNote.date} · ${meetingNote.source}`}
                      accentColor={currentTheme.accent}
                      onToggle={() =>
                        toggleSelection("meetingIds", meetingNote.id)
                      }
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      연결할 할 일
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      완료된 할 일은 STAR 포트폴리오 생성의 핵심 근거 데이터가
                      됩니다.
                    </p>
                  </div>
                  <span className="inline-flex min-w-[102px] items-center justify-center whitespace-nowrap rounded-full bg-[#454545] px-4 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    완료 {completedTodoCount}개
                  </span>
                </div>

                <div className="mt-5 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                  {todoOptions.map((todo) => (
                    <SelectionCard
                      key={todo.id}
                      checked={formValues.todoIds.includes(todo.id)}
                      title={todo.title}
                      meta={`${todo.dueDate} · ${todo.completed ? "완료" : "진행중"} · ${todo.estimate}`}
                      accentColor={currentTheme.accent}
                      toneClassName={
                        todo.completed ? "text-emerald-600" : "text-slate-500"
                      }
                      onToggle={() => toggleSelection("todoIds", todo.id)}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      참고 일정
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      상세 페이지에서 함께 보여줄 일정을 선택할 수 있습니다.
                    </p>
                  </div>
                  <span className="inline-flex min-w-[96px] items-center justify-center whitespace-nowrap rounded-full bg-[#454545] px-4 py-1.5 text-xs font-semibold text-white sm:text-sm">
                    {formValues.scheduleIds.length}개 선택
                  </span>
                </div>

                <div className="mt-5 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                  {scheduleOptions.map((schedule) => (
                    <SelectionCard
                      key={schedule.id}
                      checked={formValues.scheduleIds.includes(schedule.id)}
                      title={schedule.title}
                      meta={`${schedule.date} · ${schedule.timeLabel}`}
                      accentColor={currentTheme.accent}
                      onToggle={() =>
                        toggleSelection("scheduleIds", schedule.id)
                      }
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[22px] border border-slate-200 px-6 py-4 text-base font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-[22px] bg-[#454545] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#363636]"
            >
              {mode === "edit" ? "저장하기" : "프로젝트 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
