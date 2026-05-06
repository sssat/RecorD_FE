import { useEffect, useMemo, useState } from "react";
import ProjectForm from "./ProjectForm";
import PortfolioResult from "./PortfolioResult";
import PortfolioExport from "./PortfolioExport";
import {
  getProjectWorkspace,
  PROJECT_COLOR_THEMES,
  PROJECT_STATUS_META,
} from "../../data/projectApi";
import {
  formatCompactKoreanDate,
  formatDateRange,
  formatKoreanDate,
  getDurationDays,
} from "../../utils/dateUtils";

const PROJECTS_PER_PAGE = 6;

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[2]"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function SparkleIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} fill-none stroke-current stroke-[1.8]`}
    >
      <path d="m12 4 1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4Z" />
      <path d="m18.5 3 .6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
    </svg>
  );
}

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

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m9.5 5.5 6 6-6 6" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h3.5l1.7 1.75H17.75A2.25 2.25 0 0 1 20 9v8.75A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75V7.25Z" />
      <path d="M4 9.75h16" />
    </svg>
  );
}

function PencilIcon() {
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

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" />
      <path d="M8 3.75v4" />
      <path d="M16 3.75v4" />
      <path d="M3.75 9.5h16.5" />
    </svg>
  );
}

function CheckCircleIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <circle cx="12" cy="12" r="8.5" />
      {filled ? <path d="m8.7 12 2.1 2.2 4.7-4.9" /> : null}
    </svg>
  );
}

function ArrowNarrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M5 12h13" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

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

function clampText(value, length = 150) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length).trim()}...`;
}

function createPortfolioFormValues(portfolio) {
  if (portfolio) {
    return {
      title: portfolio.title,
      keywords: portfolio.keywords.join(", "),
      situation: portfolio.situation,
      task: portfolio.task,
      action: Array.isArray(portfolio.action)
        ? portfolio.action.join("\n")
        : portfolio.action,
      result: portfolio.result,
    };
  }

  return {
    title: "",
    keywords: "",
    situation: "",
    task: "",
    action: "",
    result: "",
  };
}

function getProjectTheme(colorKey) {
  return PROJECT_COLOR_THEMES[colorKey] ?? PROJECT_COLOR_THEMES.green;
}

function hexToRgb(hexColor) {
  const normalizedColor = hexColor.replace("#", "");
  const safeColor =
    normalizedColor.length === 3
      ? normalizedColor
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalizedColor;
  const parsedValue = Number.parseInt(safeColor, 16);

  return {
    red: (parsedValue >> 16) & 255,
    green: (parsedValue >> 8) & 255,
    blue: parsedValue & 255,
  };
}

function mixColorWithWhite(hexColor, whiteRatio) {
  const { red, green, blue } = hexToRgb(hexColor);
  const blendChannel = (channel) =>
    Math.round(channel + (255 - channel) * whiteRatio);

  return `rgb(${blendChannel(red)} ${blendChannel(green)} ${blendChannel(blue)})`;
}

function getRelatedMeetingNotes(project, workspace) {
  const noteIdSet = new Set(project.meetingIds);
  return workspace.meetingNotes.filter((meetingNote) =>
    noteIdSet.has(meetingNote.id),
  );
}

function getRelatedTodos(project, workspace) {
  const todoIdSet = new Set(project.todoIds);
  return workspace.todos.filter((todo) => todoIdSet.has(todo.id));
}

function getRelatedSchedules(project, workspace) {
  const scheduleIdSet = new Set(project.scheduleIds);
  return workspace.schedules.filter((schedule) =>
    scheduleIdSet.has(schedule.id),
  );
}

function getProjectMetrics(project, workspace) {
  const relatedTodos = getRelatedTodos(project, workspace);

  return {
    meetingCount: project.meetingIds.length,
    todoCount: project.todoIds.length,
    completedTodoCount: relatedTodos.filter((todo) => todo.completed).length,
    remainingTodoCount: relatedTodos.filter((todo) => !todo.completed).length,
    portfolioCount: workspace.portfolios.filter(
      (portfolio) => portfolio.projectId === project.id,
    ).length,
  };
}

function buildGeneratedPortfolio(project, workspace) {
  const relatedMeetingNotes = getRelatedMeetingNotes(project, workspace);
  const relatedTodos = getRelatedTodos(project, workspace);
  const relatedSchedules = getRelatedSchedules(project, workspace);
  const completedTodos = relatedTodos.filter((todo) => todo.completed);
  const theme = getProjectTheme(project.colorKey);
  const firstMeetingTitle = relatedMeetingNotes[0]?.title ?? "프로젝트 킥오프";

  return {
    id: `portfolio-${Date.now()}`,
    projectId: project.id,
    title: `${project.name} 경험 정리`,
    createdAt: new Date().toISOString().slice(0, 10),
    summary: `${project.name}에서 쌓인 회의록과 완료된 할 일을 기반으로 생성한 STAR 포트폴리오 초안입니다.`,
    keywords: [...project.tags.slice(0, 3), "문제 해결", theme.name].filter(
      (keyword, index, allKeywords) => allKeywords.indexOf(keyword) === index,
    ),
    situation: `${project.description} 프로젝트를 진행하며 ${relatedMeetingNotes.length}개의 회의록과 ${relatedSchedules.length}개의 일정을 축적했습니다. 특히 ${firstMeetingTitle} 이후 역할과 산출물을 명확히 정리할 필요가 있었습니다.`,
    task: `프로젝트 내 회의 요약과 완료된 할 일을 하나의 경험 서술로 재구성해, 취업 포트폴리오에 바로 활용할 수 있는 STAR 초안을 만드는 역할을 맡았습니다.`,
    action: [
      `${relatedMeetingNotes.length}개의 회의록에서 핵심 논의와 개인 역할을 추려 프로젝트 맥락을 정리했습니다.`,
      `완료된 할 일 ${completedTodos.length}개를 기준으로 실질적으로 수행한 작업과 기여도를 구조화했습니다.`,
      `${relatedSchedules.length}개의 일정 흐름을 반영해 문제 정의부터 결과 검증까지의 과정을 시간 순서대로 정리했습니다.`,
    ],
    result: `완료된 할 일 ${completedTodos.length}건과 회의 요약 데이터를 바탕으로, ${project.name} 경험을 면접 답변과 이력서에 바로 활용할 수 있는 STAR 포트폴리오 초안을 빠르게 확보했습니다.`,
  };
}

function ActionButton({ children, onClick, tone = "primary", className = "" }) {
  const toneClassName =
    tone === "secondary"
      ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      : tone === "dark"
        ? "bg-[#454545] text-white shadow-[0_18px_35px_-24px_rgba(69,69,69,0.62)] hover:bg-[#363636]"
        : tone === "outline-accent"
          ? "border border-[#a8d45f] bg-white text-[#7baa3a] hover:bg-[#f4f9e8]"
          : "bg-[#a8d45f] text-white hover:brightness-95";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[22px] px-5 py-3 text-sm font-semibold transition ${toneClassName} ${className}`}
    >
      {children}
    </button>
  );
}

function SectionCard({
  title,
  children,
  rightSlot,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            {title}
          </h3>
        </div>
        {rightSlot}
      </div>
      <div className={`mt-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

function ProjectCard({ project, metrics, onSelect }) {
  const theme = getProjectTheme(project.colorKey);
  const statusMeta =
    PROJECT_STATUS_META[project.status] ?? PROJECT_STATUS_META.inProgress;

  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className="flex h-full w-full flex-col rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_45px_-30px_rgba(15,23,42,0.3)] sm:px-6 sm:py-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: theme.accent }}
            />
            <h2 className="truncate text-[1.45rem] font-black tracking-tight text-slate-900 sm:text-[1.6rem]">
              {project.name}
            </h2>
          </div>
          <p className="mt-3 text-lg leading-8 text-slate-400">
            {clampText(project.description, 44)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-[18px] px-4 py-1.5 text-sm font-semibold ${statusMeta.toneClassName}`}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-lg text-slate-400">
        <span>
          회의록{" "}
          <strong className="ml-1 text-slate-900">
            {metrics.meetingCount}
          </strong>
        </span>
        <span>
          할일{" "}
          <strong className="ml-1 text-slate-900">
            {metrics.completedTodoCount}/{metrics.todoCount}
          </strong>
        </span>
        <span>
          포트폴리오{" "}
          <strong className="ml-1 text-slate-900">
            {metrics.portfolioCount}
          </strong>
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-[14px] bg-slate-50 px-4 py-1.5 text-sm font-semibold text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 text-lg text-slate-400">
        {formatDateRange(project.startDate, project.endDate)}
      </div>
    </button>
  );
}

function InfoMetricCard({ label, value, subtleValue, theme }) {
  const surfaceTopColor = mixColorWithWhite(theme.accent, 0.28);
  const surfaceBottomColor = mixColorWithWhite(theme.accent, 0.2);

  return (
    <div
      className="rounded-[22px] border px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_18px_35px_-30px_rgba(91,122,26,0.26)] sm:px-6 sm:py-5"
      style={{
        background: `linear-gradient(180deg, ${surfaceTopColor} 0%, ${surfaceBottomColor} 100%)`,
        borderColor: "rgba(255, 255, 255, 0.2)",
      }}
    >
      <p className="text-sm font-medium text-white/80 sm:text-[15px]">
        {label}
      </p>
      <p className="mt-3 text-[2.15rem] font-black tracking-tight text-white sm:text-[2.5rem]">
        {value}
      </p>
      {subtleValue ? (
        <p className="mt-2 text-xs text-white/75 sm:text-sm">{subtleValue}</p>
      ) : null}
    </div>
  );
}

function OverviewTab({ project, workspace }) {
  const theme = getProjectTheme(project.colorKey);
  const metrics = getProjectMetrics(project, workspace);
  const relatedMeetingNotes = getRelatedMeetingNotes(project, workspace);
  const relatedSchedules = getRelatedSchedules(project, workspace);
  const completedTodos = getRelatedTodos(project, workspace).filter(
    (todo) => todo.completed,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="프로젝트 정보">
          <dl className="space-y-5 text-lg">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <dt className="text-slate-400">시작일</dt>
              <dd className="font-semibold text-slate-900">
                {formatKoreanDate(project.startDate)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <dt className="text-slate-400">종료일</dt>
              <dd className="font-semibold text-slate-900">
                {formatKoreanDate(project.endDate)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <dt className="text-slate-400">기간</dt>
              <dd className="font-semibold text-slate-900">
                {getDurationDays(project.startDate, project.endDate)}일
              </dd>
            </div>
            <div className="pt-2">
              <dt className="text-slate-400">태그</dt>
              <dd className="mt-4 flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{
                      backgroundColor: theme.accentSoft,
                      color: theme.accentStrong,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="진행 현황">
          <dl className="space-y-6 text-lg">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">전체 태스크</dt>
              <dd className="font-semibold text-slate-900">
                {metrics.todoCount}개
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">완료된 태스크</dt>
              <dd className="font-semibold text-slate-900">
                {metrics.completedTodoCount}개
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-400">남은 태스크</dt>
              <dd className="font-semibold text-slate-900">
                {metrics.remainingTodoCount}개
              </dd>
            </div>
            <div className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-6">
              <p className="text-sm font-semibold text-slate-500">
                STAR 참고 자료
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  회의록 {metrics.meetingCount}개
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  완료 할 일 {metrics.completedTodoCount}개
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                  포트폴리오 {metrics.portfolioCount}개
                </span>
              </div>
            </div>
          </dl>
        </SectionCard>
      </div>

      <SectionCard title="관련 회의록">
        <div className="space-y-4">
          {relatedMeetingNotes.slice(0, 4).map((meetingNote) => (
            <article
              key={meetingNote.id}
              className="rounded-[24px] bg-slate-50 px-5 py-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-xl font-semibold text-slate-900">
                  {meetingNote.title}
                </h4>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: theme.accentSoft,
                    color: theme.accentStrong,
                  }}
                >
                  프로젝트 연결
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                {formatCompactKoreanDate(meetingNote.date)} · Whisper AI 요약
                저장
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {meetingNote.summary}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="관련 일정">
        <div className="space-y-4">
          {relatedSchedules.map((schedule) => (
            <article
              key={schedule.id}
              className="rounded-[24px] bg-slate-50 px-5 py-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500">
                  <CalendarIcon />
                </span>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900">
                    {schedule.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-400">
                    {formatCompactKoreanDate(schedule.date)} ·{" "}
                    {schedule.timeLabel}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="포트폴리오 작성 참고 자료">
        <div className="grid gap-4 md:grid-cols-2">
          {completedTodos.slice(0, 6).map((todo) => (
            <article
              key={todo.id}
              className="rounded-[24px] border border-slate-200 bg-white px-5 py-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-500">
                  <CheckCircleIcon filled />
                </span>
                <div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {todo.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-400">
                    {todo.dueDate} · {todo.estimate}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function PortfolioList({
  project,
  portfolios,
  workspace,
  onOpenAiDialog,
  onOpenCreateDialog,
  onSelectPortfolio,
}) {
  const theme = getProjectTheme(project.colorKey);
  const metrics = getProjectMetrics(project, workspace);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-4xl font-black tracking-tight text-slate-900">
            STAR 포트폴리오 목록
          </h3>
          <p className="mt-3 text-lg leading-8 text-slate-400">
            회의록과 완료된 할 일을 바탕으로 직접 작성하거나 AI 초안을 생성할 수
            있습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ActionButton tone="secondary" onClick={onOpenAiDialog}>
            <SparkleIcon />
            AI 생성
          </ActionButton>
          <ActionButton tone="dark" onClick={onOpenCreateDialog}>
            <PlusIcon />새 포트폴리오
          </ActionButton>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap gap-4">
          <span
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: theme.accentSoft,
              color: theme.accentStrong,
            }}
          >
            회의록 {metrics.meetingCount}개
          </span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            완료 할 일 {metrics.completedTodoCount}개
          </span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
            현재 포트폴리오 {portfolios.length}개
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {portfolios.map((portfolio, index) => (
          <button
            key={portfolio.id}
            type="button"
            onClick={() => onSelectPortfolio(portfolio.id)}
            className={`w-full rounded-[32px] border bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-28px_rgba(15,23,42,0.28)] sm:p-8 ${
              index === 0 ? "border-[#b8dd7f]" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <h4 className="text-3xl font-black tracking-tight text-slate-900">
                  {portfolio.title}
                </h4>
                <p className="mt-3 text-lg text-slate-400">
                  작성일: {formatCompactKoreanDate(portfolio.createdAt)}
                </p>
                <p className="mt-5 text-lg leading-9 text-slate-500">
                  {clampText(portfolio.situation, 180)}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {["Situation", "Task", "Action", "Result"].map(
                    (label, labelIndex) => {
                      const chipClassName =
                        labelIndex === 1
                          ? "bg-[#eef4ff] text-[#698bdd]"
                          : labelIndex === 3
                            ? "bg-[#fff8dd] text-[#cfb630]"
                            : "bg-[#f4f9e8] text-[#82b83f]";

                      return (
                        <span
                          key={label}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${chipClassName}`}
                        >
                          {label}
                        </span>
                      );
                    },
                  )}
                </div>
              </div>
              <span className="self-start text-slate-300 lg:mt-4">
                <ArrowNarrowRightIcon />
              </span>
            </div>
          </button>
        ))}

        {portfolios.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-600">
              아직 생성된 STAR 포트폴리오가 없습니다.
            </p>
            <p className="mt-3 text-base text-slate-400">
              AI 생성으로 초안을 만들거나 직접 작성해 첫 포트폴리오를
              시작해보세요.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PortfolioEditorDialog({
  mode,
  initialValues,
  projectName,
  accentColor,
  onClose,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState(() =>
    createPortfolioFormValues(initialValues),
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormValues(createPortfolioFormValues(initialValues));
    setErrorMessage("");
  }, [initialValues]);

  const handleChange = (fieldName, nextValue) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formValues.title.trim() ||
      !formValues.situation.trim() ||
      !formValues.task.trim() ||
      !formValues.action.trim() ||
      !formValues.result.trim()
    ) {
      setErrorMessage("제목과 STAR 모든 항목을 입력해주세요.");
      return;
    }

    onSubmit({
      title: formValues.title.trim(),
      keywords: formValues.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      situation: formValues.situation.trim(),
      task: formValues.task.trim(),
      action: formValues.action
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      result: formValues.result.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-[0_40px_100px_-35px_rgba(15,23,42,0.45)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full border border-slate-200 bg-white p-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="포트폴리오 폼 닫기"
        >
          <XIcon />
        </button>

        <form
          onSubmit={handleSubmit}
          className="max-h-[92vh] overflow-y-auto px-6 pb-8 pt-8 sm:px-8 lg:px-10"
        >
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-semibold text-slate-500">
              {projectName}
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-[2.35rem]">
              {mode === "edit"
                ? "STAR 포트폴리오 수정"
                : "새 STAR 포트폴리오 작성"}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              Situation, Task, Action, Result 흐름으로 경험을 정리하면 이력서와
              면접 답변에 바로 활용하기 쉬운 구조를 만들 수 있습니다.
            </p>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                포트폴리오 제목
              </span>
              <input
                value={formValues.title}
                onChange={(event) => handleChange("title", event.target.value)}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="예: 프론트엔드 개발 역량"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                역량 키워드
              </span>
              <input
                value={formValues.keywords}
                onChange={(event) =>
                  handleChange("keywords", event.target.value)
                }
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="예: React, UI/UX, 협업"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                Situation (상황)
              </span>
              <textarea
                value={formValues.situation}
                onChange={(event) =>
                  handleChange("situation", event.target.value)
                }
                rows={6}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg leading-8 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="프로젝트 배경과 상황을 설명하세요"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                Task (과제)
              </span>
              <textarea
                value={formValues.task}
                onChange={(event) => handleChange("task", event.target.value)}
                rows={6}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg leading-8 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="맡은 역할과 과제를 설명하세요"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                Action (행동)
              </span>
              <textarea
                value={formValues.action}
                onChange={(event) => handleChange("action", event.target.value)}
                rows={8}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg leading-8 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="구체적인 행동과 노력을 한 줄씩 작성하세요"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-semibold text-slate-500">
                Result (결과)
              </span>
              <textarea
                value={formValues.result}
                onChange={(event) => handleChange("result", event.target.value)}
                rows={6}
                className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-lg leading-8 text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="달성한 성과와 결과를 설명하세요"
              />
            </label>
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
              {mode === "edit" ? "저장하기" : "포트폴리오 저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AiGenerationDialog({
  project,
  workspace,
  isGenerating,
  onClose,
  onGenerate,
}) {
  const theme = getProjectTheme(project.colorKey);
  const metrics = getProjectMetrics(project, workspace);
  const canGenerate =
    metrics.completedTodoCount > 0 || metrics.meetingCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-[2px]">
      <div className="relative w-full max-w-4xl rounded-[36px] bg-white p-6 shadow-[0_40px_100px_-35px_rgba(15,23,42,0.45)] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full border border-slate-200 bg-white p-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          aria-label="AI 생성 모달 닫기"
        >
          <XIcon />
        </button>

        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-[2.2rem]">
            AI 포트폴리오 생성 준비
          </h2>
        </div>

        <div
          className="mt-8 rounded-[28px] border px-5 py-5"
          style={{
            borderColor: theme.border,
            background: `linear-gradient(135deg, ${theme.accentSoft} 0%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-start gap-4">
            <span className="mt-1 text-[#7da5ee]">
              <SparkleIcon />
            </span>
            <div>
              <p className="text-xl font-bold text-slate-900">
                AI가 데이터를 분석 중입니다...
              </p>
              <p className="mt-3 text-base leading-7 text-slate-600">
                회의록 {metrics.meetingCount}개와 완료된 할 일{" "}
                {metrics.completedTodoCount}개, 일정{" "}
                {project.scheduleIds.length}개를 기반으로 {project.name}
                경험을 STAR 포트폴리오로 정리합니다.
              </p>
            </div>
          </div>
        </div>

        {!canGenerate ? (
          <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-700">
            포트폴리오를 생성하려면 최소 1개 이상의 회의록 또는 완료된 할 일이
            필요합니다.
          </div>
        ) : null}

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
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="rounded-[22px] bg-[#454545] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#363636] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectPage() {
  const [workspace, setWorkspace] = useState(() => getProjectWorkspace());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [projectFormState, setProjectFormState] = useState(null);
  const [portfolioFormState, setPortfolioFormState] = useState(null);
  const [exportPortfolioId, setExportPortfolioId] = useState(null);
  const [aiDialogProjectId, setAiDialogProjectId] = useState(null);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);

  const totalPages = Math.max(
    1,
    Math.ceil(workspace.projects.length / PROJECTS_PER_PAGE),
  );

  const pagedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
    return workspace.projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);
  }, [currentPage, workspace.projects]);

  const selectedProject =
    selectedProjectId != null
      ? (workspace.projects.find(
          (project) => project.id === selectedProjectId,
        ) ?? null)
      : null;

  const selectedProjectPortfolios = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    return workspace.portfolios.filter(
      (portfolio) => portfolio.projectId === selectedProject.id,
    );
  }, [selectedProject, workspace.portfolios]);

  const selectedPortfolio =
    selectedPortfolioId != null
      ? (workspace.portfolios.find(
          (portfolio) => portfolio.id === selectedPortfolioId,
        ) ?? null)
      : null;

  const editingProject =
    projectFormState?.projectId != null
      ? (workspace.projects.find(
          (project) => project.id === projectFormState.projectId,
        ) ?? null)
      : null;

  const editingPortfolio =
    portfolioFormState?.portfolioId != null
      ? (workspace.portfolios.find(
          (portfolio) => portfolio.id === portfolioFormState.portfolioId,
        ) ?? null)
      : null;

  const exportPortfolio =
    exportPortfolioId != null
      ? (workspace.portfolios.find(
          (portfolio) => portfolio.id === exportPortfolioId,
        ) ?? null)
      : null;

  const aiDialogProject =
    aiDialogProjectId != null
      ? (workspace.projects.find(
          (project) => project.id === aiDialogProjectId,
        ) ?? null)
      : null;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleOpenProject = (projectId) => {
    setSelectedProjectId(projectId);
    setSelectedPortfolioId(null);
    setActiveTab("overview");
  };

  const handleBack = () => {
    if (selectedPortfolioId) {
      setSelectedPortfolioId(null);
      setActiveTab("portfolios");
      return;
    }

    setSelectedProjectId(null);
    setActiveTab("overview");
  };

  const handleSubmitProject = (formValues) => {
    if (projectFormState?.mode === "edit" && editingProject) {
      setWorkspace((currentWorkspace) => ({
        ...currentWorkspace,
        projects: currentWorkspace.projects.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...formValues }
            : project,
        ),
      }));
      setProjectFormState(null);
      return;
    }

    const nextProjectId = `project-${Date.now()}`;

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      projects: [
        {
          id: nextProjectId,
          ...formValues,
        },
        ...currentWorkspace.projects,
      ],
    }));

    setProjectFormState(null);
    setSelectedProjectId(nextProjectId);
    setSelectedPortfolioId(null);
    setActiveTab("overview");
    setCurrentPage(1);
  };

  const handleDeleteProject = () => {
    if (!selectedProject) {
      return;
    }

    const shouldDelete = window.confirm(
      `${selectedProject.name} 프로젝트와 연결된 포트폴리오를 삭제할까요?`,
    );

    if (!shouldDelete) {
      return;
    }

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      projects: currentWorkspace.projects.filter(
        (project) => project.id !== selectedProject.id,
      ),
      portfolios: currentWorkspace.portfolios.filter(
        (portfolio) => portfolio.projectId !== selectedProject.id,
      ),
    }));
    setSelectedProjectId(null);
    setSelectedPortfolioId(null);
    setActiveTab("overview");
  };

  const handleSubmitPortfolio = (formValues) => {
    if (!selectedProject) {
      return;
    }

    if (portfolioFormState?.mode === "edit" && editingPortfolio) {
      setWorkspace((currentWorkspace) => ({
        ...currentWorkspace,
        portfolios: currentWorkspace.portfolios.map((portfolio) =>
          portfolio.id === editingPortfolio.id
            ? {
                ...portfolio,
                ...formValues,
                summary: clampText(formValues.situation, 120),
              }
            : portfolio,
        ),
      }));
      setSelectedPortfolioId(editingPortfolio.id);
      setPortfolioFormState(null);
      return;
    }

    const nextPortfolioId = `portfolio-${Date.now()}`;

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      portfolios: [
        {
          id: nextPortfolioId,
          projectId: selectedProject.id,
          createdAt: new Date().toISOString().slice(0, 10),
          summary: clampText(formValues.situation, 120),
          ...formValues,
        },
        ...currentWorkspace.portfolios,
      ],
    }));

    setSelectedPortfolioId(nextPortfolioId);
    setPortfolioFormState(null);
    setActiveTab("portfolios");
  };

  const handleDeletePortfolio = () => {
    if (!selectedPortfolio) {
      return;
    }

    const shouldDelete = window.confirm(
      `${selectedPortfolio.title} 포트폴리오를 삭제할까요?`,
    );

    if (!shouldDelete) {
      return;
    }

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      portfolios: currentWorkspace.portfolios.filter(
        (portfolio) => portfolio.id !== selectedPortfolio.id,
      ),
    }));
    setSelectedPortfolioId(null);
    setActiveTab("portfolios");
  };

  const handleGeneratePortfolio = () => {
    if (!aiDialogProject) {
      return;
    }

    setIsGeneratingPortfolio(true);

    window.setTimeout(() => {
      const generatedPortfolio = buildGeneratedPortfolio(
        aiDialogProject,
        workspace,
      );

      setWorkspace((currentWorkspace) => ({
        ...currentWorkspace,
        portfolios: [generatedPortfolio, ...currentWorkspace.portfolios],
      }));
      setSelectedProjectId(aiDialogProject.id);
      setSelectedPortfolioId(generatedPortfolio.id);
      setActiveTab("portfolios");
      setAiDialogProjectId(null);
      setIsGeneratingPortfolio(false);
    }, 850);
  };

  const listView = (
    <section className="space-y-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            프로젝트
          </h1>
          <p className="mt-3 text-lg leading-8 text-slate-400 sm:text-xl">
            프로젝트를 관리하고 STAR 기법으로 포트폴리오를 작성하세요
          </p>
        </div>
        <ActionButton
          tone="dark"
          onClick={() => setProjectFormState({ mode: "create" })}
        >
          <PlusIcon />새 프로젝트
        </ActionButton>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {pagedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            metrics={getProjectMetrics(project, workspace)}
            onSelect={handleOpenProject}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            className="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="이전 프로젝트 페이지"
          >
            <ChevronLeftIcon />
          </button>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-500 shadow-sm">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            className="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            aria-label="다음 프로젝트 페이지"
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}

      <SectionCard
        title="STAR 기법으로 자동 포트폴리오 생성"
        className="p-5 sm:p-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-slate-900 text-white shadow-[0_20px_30px_-26px_rgba(15,23,42,0.7)]">
            <SparkleIcon className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base leading-8 text-slate-400 sm:text-lg">
              AI가 회의록, 일정, 할 일 목록을 분석하여 STAR(Situation, Task,
              Action, Result) 기법에 맞춘 포트폴리오 초안을 자동으로 작성합니다.
              한 프로젝트에서 여러 관점의 포트폴리오를 만들 수 있도록
              구성했습니다.
            </p>
            <div className="mt-6 grid gap-3 lg:grid-cols-4">
              {[
                {
                  title: "Situation",
                  description: "프로젝트 배경과 상황",
                  titleClassName: "text-[#8abf43]",
                },
                {
                  title: "Task",
                  description: "맡은 역할과 과제",
                  titleClassName: "text-[#6b90df]",
                },
                {
                  title: "Action",
                  description: "구체적인 행동과 노력",
                  titleClassName: "text-[#7bbd64]",
                },
                {
                  title: "Result",
                  description: "달성한 성과와 결과",
                  titleClassName: "text-[#d0b72f]",
                },
              ].map((section) => (
                <div
                  key={section.title}
                  className="rounded-[20px] border border-slate-200 bg-white px-5 py-5"
                >
                  <p
                    className={`text-[2rem] font-black tracking-tight ${section.titleClassName}`}
                  >
                    {section.title}
                  </p>
                  <p className="mt-3 text-sm text-slate-500 sm:text-[15px]">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </section>
  );

  const detailView =
    selectedProject != null ? (
      <section className="space-y-6">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-lg font-medium text-slate-400 transition hover:text-slate-700"
        >
          <ChevronLeftIcon />
          프로젝트 목록으로
        </button>

        <section
          className="overflow-hidden rounded-[32px] px-5 py-4 shadow-sm sm:px-6 sm:py-5"
          style={{
            backgroundColor: getProjectTheme(selectedProject.colorKey).accent,
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-white/14 text-white backdrop-blur-[2px]">
                  <FolderIcon />
                </span>
                <div className="min-w-0">
                  <h1 className="text-[2rem] font-black tracking-tight text-white sm:text-[2.35rem]">
                    {selectedProject.name}
                  </h1>
                  <p className="mt-2 text-base leading-7 text-white/80 sm:text-[1.1rem]">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 text-white">
                <button
                  type="button"
                  onClick={() =>
                    setProjectFormState({
                      mode: "edit",
                      projectId: selectedProject.id,
                    })
                  }
                  className="rounded-2xl border border-white/25 bg-white/10 p-2 transition hover:bg-white/20"
                  aria-label="프로젝트 수정"
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="rounded-2xl border border-white/25 bg-white/10 p-2 transition hover:bg-white/20"
                  aria-label="프로젝트 삭제"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoMetricCard
                label="회의록"
                value={
                  getProjectMetrics(selectedProject, workspace).meetingCount
                }
                theme={getProjectTheme(selectedProject.colorKey)}
              />
              <InfoMetricCard
                label="할일"
                value={`${getProjectMetrics(selectedProject, workspace).completedTodoCount}/${getProjectMetrics(selectedProject, workspace).todoCount}`}
                theme={getProjectTheme(selectedProject.colorKey)}
              />
              <InfoMetricCard
                label="포트폴리오"
                value={
                  getProjectMetrics(selectedProject, workspace).portfolioCount
                }
                theme={getProjectTheme(selectedProject.colorKey)}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("overview");
              setSelectedPortfolioId(null);
            }}
            className={`rounded-[28px] border px-6 py-5 text-2xl font-semibold transition ${
              activeTab === "overview"
                ? "border-transparent text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
            style={
              activeTab === "overview"
                ? {
                    backgroundColor: getProjectTheme(selectedProject.colorKey)
                      .accent,
                  }
                : undefined
            }
          >
            프로젝트 개요
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("portfolios");
              setSelectedPortfolioId(null);
            }}
            className={`rounded-[28px] border px-6 py-5 text-2xl font-semibold transition ${
              activeTab === "portfolios"
                ? "border-transparent text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
            style={
              activeTab === "portfolios"
                ? {
                    backgroundColor: getProjectTheme(selectedProject.colorKey)
                      .accent,
                  }
                : undefined
            }
          >
            STAR 포트폴리오 ({selectedProjectPortfolios.length})
          </button>
        </div>

        {activeTab === "overview" ? (
          <OverviewTab project={selectedProject} workspace={workspace} />
        ) : selectedPortfolio ? (
          <PortfolioResult
            projectName={selectedProject.name}
            portfolio={selectedPortfolio}
            accentColor={getProjectTheme(selectedProject.colorKey).accent}
            onBack={() => {
              setSelectedPortfolioId(null);
              setActiveTab("portfolios");
            }}
            onEdit={() =>
              setPortfolioFormState({
                mode: "edit",
                projectId: selectedProject.id,
                portfolioId: selectedPortfolio.id,
              })
            }
            onDelete={handleDeletePortfolio}
            onExport={() => setExportPortfolioId(selectedPortfolio.id)}
          />
        ) : (
          <PortfolioList
            project={selectedProject}
            portfolios={selectedProjectPortfolios}
            workspace={workspace}
            onOpenAiDialog={() => setAiDialogProjectId(selectedProject.id)}
            onOpenCreateDialog={() =>
              setPortfolioFormState({
                mode: "create",
                projectId: selectedProject.id,
              })
            }
            onSelectPortfolio={setSelectedPortfolioId}
          />
        )}
      </section>
    ) : null;

  return (
    <>
      {selectedProject ? detailView : listView}

      {projectFormState ? (
        <ProjectForm
          mode={projectFormState.mode}
          project={editingProject}
          meetingOptions={workspace.meetingNotes}
          todoOptions={workspace.todos}
          scheduleOptions={workspace.schedules}
          onClose={() => setProjectFormState(null)}
          onSubmit={handleSubmitProject}
        />
      ) : null}

      {portfolioFormState && selectedProject ? (
        <PortfolioEditorDialog
          mode={portfolioFormState.mode}
          initialValues={editingPortfolio}
          projectName={selectedProject.name}
          accentColor={getProjectTheme(selectedProject.colorKey).accent}
          onClose={() => setPortfolioFormState(null)}
          onSubmit={handleSubmitPortfolio}
        />
      ) : null}

      {aiDialogProject ? (
        <AiGenerationDialog
          project={aiDialogProject}
          workspace={workspace}
          isGenerating={isGeneratingPortfolio}
          onClose={() => {
            if (!isGeneratingPortfolio) {
              setAiDialogProjectId(null);
            }
          }}
          onGenerate={handleGeneratePortfolio}
        />
      ) : null}

      {exportPortfolio && selectedProject ? (
        <PortfolioExport
          portfolio={exportPortfolio}
          projectName={selectedProject.name}
          onClose={() => setExportPortfolioId(null)}
        />
      ) : null}
    </>
  );
}

export default ProjectPage;
