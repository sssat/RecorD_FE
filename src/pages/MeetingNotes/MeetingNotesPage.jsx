import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createMeetingNote,
  deleteMeetingNote,
  generateMeetingDraftFromAudio,
  getMeetingNotes,
  getMeetingProjects,
  updateMeetingNote,
} from "../../data/meetingApi";
import SttResult from "./SttResult";
import SummaryResult from "./SummaryResult";
import VoiceUploader from "./VoiceUploader";

const ALL_PROJECTS_OPTION = "전체 프로젝트";
const PAGE_SIZE = 10;

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <circle cx="11" cy="11" r="6.75" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M12 16V5.5" />
      <path d="m7.5 10 4.5-4.5 4.5 4.5" />
      <path d="M5.25 18.5v.25A2.25 2.25 0 0 0 7.5 21h9a2.25 2.25 0 0 0 2.25-2.25v-.25" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m7 10 5 5 5-5" />
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

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M12 4.75v10.5" />
      <path d="m7.75 11.75 4.25 4.25 4.25-4.25" />
      <path d="M5.25 18.75v.5A1.75 1.75 0 0 0 7 21h10a1.75 1.75 0 0 0 1.75-1.75v-.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M4.75 7.25h14.5" />
      <path d="M9.25 4.75h5.5" />
      <path d="M8.25 7.25V18A2.25 2.25 0 0 0 10.5 20.25h3A2.25 2.25 0 0 0 15.75 18V7.25" />
      <path d="M10 10v6" />
      <path d="M14 10v6" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      <path d="m11.75 3 .9 3.1a2 2 0 0 0 1.35 1.35L17.1 8.35l-3.1.9a2 2 0 0 0-1.35 1.35l-.9 3.1-.9-3.1A2 2 0 0 0 9.5 9.25l-3.1-.9 3.1-.9a2 2 0 0 0 1.35-1.35l.9-3.1Z" />
      <path d="M18.5 13.75 19 15.5l1.75.5-1.75.5-.5 1.75-.5-1.75-1.75-.5 1.75-.5.5-1.75Z" />
      <path d="M5.5 13.75 6 15.5l1.75.5-1.75.5-.5 1.75-.5-1.75-1.75-.5 1.75-.5.5-1.75Z" />
    </svg>
  );
}

function sortMeetingNotes(notes) {
  return [...notes].sort((firstNote, secondNote) => {
    const firstDate = new Date(firstNote.date).getTime();
    const secondDate = new Date(secondNote.date).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    return (
      new Date(secondNote.updatedAt).getTime() -
      new Date(firstNote.updatedAt).getTime()
    );
  });
}

function toDateParts(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return {
    year,
    month,
    day,
  };
}

function formatListDate(dateString) {
  const { year, month, day } = toDateParts(dateString);
  return `${year}. ${month}. ${day}.`;
}

function formatDetailDate(dateString) {
  const { year, month, day } = toDateParts(dateString);
  return `${year}년 ${month}월 ${day}일`;
}

function formatDuration(durationMinutes) {
  return `${durationMinutes}분`;
}

function formatMeetingMeta(meetingNote, longDate = false) {
  const dateLabel = longDate
    ? formatDetailDate(meetingNote.date)
    : formatListDate(meetingNote.date);

  return `${dateLabel} • ${formatDuration(meetingNote.durationMinutes)} • ${meetingNote.participants.length}명 참석`;
}

function parseCommaSeparatedValue(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLineSeparatedValue(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildDefaultDateValue() {
  return new Date().toISOString().slice(0, 10);
}

function buildFormState(meetingNote, defaultProject) {
  const actionItems = meetingNote?.actionItems ?? [];

  return {
    project: meetingNote?.project ?? defaultProject,
    title: meetingNote?.title ?? "",
    date: meetingNote?.date ?? buildDefaultDateValue(),
    durationMinutes: String(meetingNote?.durationMinutes ?? 45),
    participantsText: (meetingNote?.participants ?? []).join(", "),
    summary: meetingNote?.summary ?? "",
    tagsText: (meetingNote?.tags ?? []).join(", "),
    transcript: meetingNote?.transcript ?? "",
    keyPointsText: (meetingNote?.keyPoints ?? []).join("\n"),
    actionItems: actionItems.length > 0 ? actionItems : [""],
    actionItemChecks:
      meetingNote?.actionItemChecks ?? actionItems.map(() => false),
    sourceType: meetingNote?.sourceType ?? "manual",
    audioFileName: meetingNote?.audioFileName ?? "",
  };
}

function buildPayloadFromForm(values) {
  const actionItems = (values.actionItems ?? [])
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    project: values.project,
    title: values.title,
    date: values.date,
    durationMinutes: values.durationMinutes,
    participants: parseCommaSeparatedValue(values.participantsText),
    summary: values.summary,
    tags: parseCommaSeparatedValue(values.tagsText),
    transcript: values.transcript,
    keyPoints: parseLineSeparatedValue(values.keyPointsText),
    actionItems,
    actionItemChecks: actionItems.map((_, index) =>
      Boolean(values.actionItemChecks?.[index]),
    ),
    sourceType: values.sourceType,
    audioFileName: values.audioFileName,
  };
}

function buildPayloadFromMeetingNote(meetingNote, overrides = {}) {
  return {
    project: meetingNote.project,
    title: meetingNote.title,
    date: meetingNote.date,
    durationMinutes: meetingNote.durationMinutes,
    participants: meetingNote.participants,
    summary: meetingNote.summary,
    tags: meetingNote.tags,
    transcript: meetingNote.transcript,
    keyPoints: meetingNote.keyPoints,
    actionItems: meetingNote.actionItems,
    actionItemChecks: meetingNote.actionItemChecks ?? [],
    sourceType: meetingNote.sourceType,
    audioFileName: meetingNote.audioFileName,
    ...overrides,
  };
}

function buildMeetingDownloadText(meetingNote) {
  return [
    meetingNote.title,
    "",
    `프로젝트: ${meetingNote.project}`,
    `날짜: ${formatDetailDate(meetingNote.date)}`,
    `소요 시간: ${formatDuration(meetingNote.durationMinutes)}`,
    `참석자: ${meetingNote.participants.join(", ")}`,
    `태그: ${meetingNote.tags.map((tag) => `#${tag}`).join(", ")}`,
    "",
    "[AI 요약]",
    meetingNote.summary,
    "",
    "[주요 논의 사항]",
    ...meetingNote.keyPoints.map((item, index) => `${index + 1}. ${item}`),
    "",
    "[체크리스트]",
    ...meetingNote.actionItems.map((item) => `- ${item}`),
    "",
    "[회의 내용]",
    meetingNote.transcript,
  ].join("\n");
}

function downloadMeetingNoteFile(meetingNote) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([buildMeetingDownloadText(meetingNote)], {
    type: "text/plain;charset=utf-8",
  });
  const downloadUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeTitle = meetingNote.title.replace(/[\\/:*?"<>|]/g, "-");

  anchor.href = downloadUrl;
  anchor.download = `${safeTitle || "meeting-note"}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

function ActionButton({
  children,
  tone = "green",
  type = "button",
  className = "",
  ...props
}) {
  const toneClassName =
    tone === "charcoal"
      ? "bg-[#3A3A3A] text-white hover:bg-[#000000]"
      : tone === "slate"
        ? "bg-[#767676] text-white hover:bg-[#565656]"
        : tone === "teal"
          ? "bg-[#67b6a7] text-white hover:bg-[#559f90]"
          : tone === "light"
            ? "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            : tone === "danger"
              ? "bg-[#e7645b] text-white hover:bg-[#d9534a]"
              : "bg-[#a8d25d] text-white hover:bg-[#97c147]";

  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName} ${className}`}
    >
      {children}
    </button>
  );
}

function TagChip({ children, tone = "soft" }) {
  const toneClassName =
    tone === "project"
      ? "bg-[#eef6cd] text-[#607a27]"
      : "bg-slate-50 text-[#172554]";

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${toneClassName}`}
    >
      {children}
    </span>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  size = "lg",
  panelClassName = "",
}) {
  const maxWidthClassName =
    size === "sm"
      ? "max-w-[460px]"
      : size === "md"
        ? "max-w-[520px]"
        : size === "xl"
          ? "max-w-[980px]"
          : "max-w-[760px]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-[92vh] w-full overflow-hidden rounded-[28px] bg-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.4)] ${maxWidthClassName} ${panelClassName}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-7">
          <h2 className="text-[2rem] font-black tracking-tight text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="닫기"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
            >
              <path d="m6 6 12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(92vh-5.5rem)] overflow-y-auto px-6 py-6 sm:px-7">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#67b6a7] focus:bg-white focus:ring-4 focus:ring-[#d8f2eb] ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-base text-slate-700 outline-none transition focus:border-[#67b6a7] focus:bg-white focus:ring-4 focus:ring-[#d8f2eb] ${className}`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
        <ChevronDownIcon />
      </span>
    </div>
  );
}

function HelperBanner({ children, className = "" }) {
  return (
    <div
      className={`rounded-[24px] border border-[#b6e6dc] bg-gradient-to-r from-[#e8faf7] to-[#f4fbdd] px-5 py-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-[#67b6a7]">
          <SparklesIcon />
        </span>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-[#0f3a35]">AI 자동 처리</p>
          <p className="text-sm leading-6 text-slate-700">{children}</p>
        </div>
      </div>
    </div>
  );
}

function MeetingNoteCard({ meetingNote }) {
  return (
    <Link
      to={`/records/${meetingNote.id}`}
      className="group block rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d6e7b3] hover:shadow-[0_20px_50px_-40px_rgba(15,23,42,0.45)] sm:px-7 sm:py-7"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-[2rem] font-black tracking-tight text-[#172554]">
            {meetingNote.title}
          </h2>
          <p className="mt-3 text-base text-slate-400">
            {formatListDate(meetingNote.date)} •{" "}
            {formatDuration(meetingNote.durationMinutes)} •{" "}
            {meetingNote.participants.length}명
          </p>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            {meetingNote.summary}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <TagChip tone="project">{meetingNote.project}</TagChip>
            {meetingNote.tags.map((tag) => (
              <TagChip key={tag}>#{tag}</TagChip>
            ))}
          </div>
        </div>

        <span className="hidden rounded-full p-3 text-slate-300 transition group-hover:bg-slate-50 group-hover:text-slate-500 sm:inline-flex">
          <ChevronRightIcon />
        </span>
      </div>
    </Link>
  );
}

function MeetingNoteFormDialog({
  mode,
  projects,
  values,
  error,
  isSaving,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <ModalShell
      title={mode === "edit" ? "회의록 수정" : "새 회의록 작성"}
      onClose={onClose}
      size="xl"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormField label="프로젝트 선택">
              <Select
                value={values.project}
                onChange={(event) => onChange("project", event.target.value)}
              >
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="제목">
              <Input
                value={values.title}
                onChange={(event) => onChange("title", event.target.value)}
                placeholder="회의 제목을 입력해주세요."
              />
            </FormField>
          </div>

          <FormField label="날짜">
            <Input
              type="date"
              value={values.date}
              onChange={(event) => onChange("date", event.target.value)}
            />
          </FormField>

          <FormField label="소요 시간">
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={values.durationMinutes}
                onChange={(event) =>
                  onChange(
                    "durationMinutes",
                    event.target.value.replace(/\D/g, ""),
                  )
                }
                placeholder="예: 45"
                className="pr-14"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-medium text-slate-500">
                분
              </span>
            </div>
          </FormField>

          <div className="md:col-span-2">
            <FormField label="참석자 (쉼표로 구분)">
              <Input
                value={values.participantsText}
                onChange={(event) =>
                  onChange("participantsText", event.target.value)
                }
                placeholder="예: 김철수, 이영희, 박민수"
              />
            </FormField>
          </div>

          <div className="md:col-span-2">
            <FormField label="태그 (쉼표로 구분)">
              <Input
                value={values.tagsText}
                onChange={(event) => onChange("tagsText", event.target.value)}
                placeholder="예: 기획, 요구사항"
              />
            </FormField>
          </div>
        </div>

        <SummaryResult
          editable
          summary={values.summary}
          keyPoints={values.keyPointsText}
          actionItems={values.actionItems}
          actionItemChecks={values.actionItemChecks}
          onSummaryChange={(nextValue) => onChange("summary", nextValue)}
          onKeyPointsChange={(nextValue) =>
            onChange("keyPointsText", nextValue)
          }
          onActionItemChange={(actionItemIndex, nextValue) =>
            onChange("actionItem", { actionItemIndex, nextValue })
          }
          onAddActionItem={() => onChange("actionItemAdd")}
          onRemoveActionItem={(actionItemIndex) =>
            onChange("actionItemRemove", { actionItemIndex })
          }
          onToggleActionItem={(actionItemIndex) =>
            onChange("actionItemToggle", { actionItemIndex })
          }
        />

        <SttResult
          editable
          value={values.transcript}
          onChange={(nextValue) => onChange("transcript", nextValue)}
        />

        {values.audioFileName ? (
          <p className="rounded-[18px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
            업로드 파일: {values.audioFileName}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <ActionButton tone="light" onClick={onClose}>
            취소
          </ActionButton>
          <ActionButton type="submit" tone="charcoal" disabled={isSaving}>
            {isSaving ? "저장 중..." : "저장"}
          </ActionButton>
        </div>
      </form>
    </ModalShell>
  );
}

function UploadDialog({
  file,
  error,
  isSubmitting,
  onClose,
  onSelectFile,
  onSubmit,
}) {
  return (
    <ModalShell
      title="녹음 파일 업로드"
      onClose={onClose}
      size="md"
      panelClassName="rounded-[20px]"
    >
      <div className="space-y-5">
        <VoiceUploader
          fileName={file?.name ?? ""}
          onSelectFile={onSelectFile}
          className="rounded-[20px]"
        />

        <HelperBanner className="rounded-[18px]">
          업로드된 녹음 파일은 자동으로 텍스트로 변환되고 AI가 회의 내용을
          분석하여 요약, 주요 논의 사항, 체크리스트를 추출해드립니다.
        </HelperBanner>

        {error ? (
          <p className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <div className="flex gap-3">
          <ActionButton
            tone="light"
            className="flex-1 rounded-[14px]"
            onClick={onClose}
          >
            취소
          </ActionButton>
          <ActionButton
            tone="charcoal"
            className="flex-1 rounded-[14px]"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "업로드"}
          </ActionButton>
        </div>
      </div>
    </ModalShell>
  );
}

function CreateNoteChooserDialog({
  isProcessing,
  error,
  onClose,
  onSelectFile,
  onOpenManualCreate,
}) {
  return (
    <ModalShell
      title="새 회의록 작성"
      onClose={onClose}
      size="md"
      panelClassName="rounded-[20px]"
    >
      <div className="space-y-5">
        <VoiceUploader
          fileName=""
          onSelectFile={onSelectFile}
          disabled={isProcessing}
          className="rounded-[20px]"
        />

        <HelperBanner className="rounded-[18px]">
          업로드된 녹음 파일은 자동으로 텍스트로 변환되고, AI가 회의 내용을
          분석하여 요약과 주요 체크리스트까지 정리해드립니다.
        </HelperBanner>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">또는</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <ActionButton
          tone="light"
          className="w-full"
          onClick={onOpenManualCreate}
          disabled={isProcessing}
        >
          직접 작성하기
        </ActionButton>

        {isProcessing ? (
          <p className="rounded-[18px] border border-[#b6e6dc] bg-[#eefaf6] px-4 py-3 text-sm text-[#27695d]">
            업로드된 파일을 분석하고 있어요. 잠시만 기다려주세요.
          </p>
        ) : null}

        {error ? (
          <p className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}

        <ActionButton tone="light" className="w-full" onClick={onClose}>
          취소
        </ActionButton>
      </div>
    </ModalShell>
  );
}

function DeleteConfirmDialog({ isDeleting, onClose, onDelete }) {
  return (
    <ModalShell title="회의록 삭제" onClose={onClose} size="sm">
      <div className="space-y-6">
        <p className="text-lg leading-8 text-slate-500">
          정말로 이 회의록을 삭제하시겠습니까?
        </p>

        <div className="flex gap-3">
          <ActionButton tone="light" className="flex-1" onClick={onClose}>
            취소
          </ActionButton>
          <ActionButton
            tone="danger"
            className="flex-1"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </ActionButton>
        </div>
      </div>
    </ModalShell>
  );
}

function MeetingNotesList({
  meetingNotes,
  query,
  selectedProject,
  onQueryChange,
  onProjectChange,
  onOpenUploadDialog,
  onOpenCreateChooser,
  projects,
}) {
  const filteredMeetingNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return meetingNotes.filter((meetingNote) => {
      const matchesProject =
        selectedProject === ALL_PROJECTS_OPTION ||
        meetingNote.project === selectedProject;

      const matchesQuery =
        !normalizedQuery ||
        [
          meetingNote.title,
          meetingNote.summary,
          meetingNote.project,
          ...meetingNote.tags,
          ...meetingNote.participants,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesProject && matchesQuery;
    });
  }, [meetingNotes, query, selectedProject]);

  const visibleMeetingNotes = filteredMeetingNotes.slice(0, PAGE_SIZE);
  const visibleStart = visibleMeetingNotes.length > 0 ? 1 : 0;
  const visibleEnd = visibleMeetingNotes.length;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            회의록
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            회의 내용을 기록하고 AI로 자동 요약하세요
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ActionButton tone="slate" onClick={onOpenUploadDialog}>
            <UploadIcon />
            녹음 파일 업로드
          </ActionButton>
          <ActionButton tone="charcoal" onClick={onOpenCreateChooser}>
            <PlusIcon />새 회의록
          </ActionButton>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-3 rounded-[20px] bg-slate-50 px-4 py-4 text-slate-400">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="회의록 검색..."
              className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <Select
            value={selectedProject}
            onChange={(event) => onProjectChange(event.target.value)}
            className="bg-white"
          >
            <option value={ALL_PROJECTS_OPTION}>{ALL_PROJECTS_OPTION}</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <p className="text-base text-slate-500">
        총{" "}
        <span className="font-semibold text-[#172554]">
          {filteredMeetingNotes.length}개
        </span>
        의 회의록 ({visibleStart}-{visibleEnd} 표시)
      </p>

      {visibleMeetingNotes.length > 0 ? (
        <div className="space-y-4">
          {visibleMeetingNotes.map((meetingNote) => (
            <MeetingNoteCard key={meetingNote.id} meetingNote={meetingNote} />
          ))}
        </div>
      ) : (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            조건에 맞는 회의록이 없습니다
          </h2>
          <p className="mt-3 text-slate-500">
            검색어를 바꾸거나 프로젝트 필터를 초기화해보세요.
          </p>
        </section>
      )}
    </section>
  );
}

function MeetingNotesDetail({
  meetingNote,
  onOpenEdit,
  onDownload,
  onDelete,
  onToggleActionItem,
}) {
  return (
    <section className="space-y-6">
      <Link
        to="/records"
        className="inline-flex items-center gap-2 text-base font-medium text-slate-400 transition hover:text-slate-700"
      >
        <ChevronLeftIcon />
        회의록 목록으로
      </Link>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[1.95rem] font-black tracking-tight text-[#172554]">
              {meetingNote.title}
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              {formatMeetingMeta(meetingNote, true)}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <TagChip tone="project">{meetingNote.project}</TagChip>
              {meetingNote.tags.map((tag) => (
                <TagChip key={tag}>#{tag}</TagChip>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenEdit}
              className="rounded-[16px] border border-slate-200 p-3 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              aria-label="회의록 수정"
            >
              <PencilIcon />
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="rounded-[16px] border border-slate-200 p-3 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              aria-label="회의록 다운로드"
            >
              <DownloadIcon />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-[16px] border border-rose-100 p-3 text-[#e7645b] transition hover:bg-rose-50"
              aria-label="회의록 삭제"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <h2 className="text-[1.85rem] font-black tracking-tight text-slate-900">
          참석자
        </h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {meetingNote.participants.map((participant) => (
            <span
              key={participant}
              className="rounded-[16px] bg-slate-50 px-4 py-3 text-lg text-[#172554]"
            >
              {participant}
            </span>
          ))}
        </div>
      </section>

      <SummaryResult
        summary={meetingNote.summary}
        keyPoints={meetingNote.keyPoints}
        actionItems={meetingNote.actionItems}
        actionItemChecks={meetingNote.actionItemChecks}
        onToggleActionItem={onToggleActionItem}
      />
      <SttResult value={meetingNote.transcript} />
    </section>
  );
}

function MeetingNotesPage() {
  const navigate = useNavigate();
  const { meetingNoteId } = useParams();
  const [meetingNotes, setMeetingNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS_OPTION);
  const [chooserDialog, setChooserDialog] = useState({
    open: false,
    isProcessing: false,
    error: "",
  });
  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    file: null,
    error: "",
    isSubmitting: false,
  });
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create",
    noteId: null,
    values: null,
    error: "",
    isSaving: false,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    isDeleting: false,
  });

  const activeMeetingNote = useMemo(
    () =>
      meetingNoteId
        ? (meetingNotes.find(
            (meetingNote) => meetingNote.id === meetingNoteId,
          ) ?? null)
        : null,
    [meetingNoteId, meetingNotes],
  );

  const defaultProject =
    selectedProject !== ALL_PROJECTS_OPTION
      ? selectedProject
      : (projects[0] ?? "포트폴리오 관리 시스템");

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [fetchedMeetingNotes, fetchedProjects] = await Promise.all([
          getMeetingNotes(),
          getMeetingProjects(),
        ]);

        if (!isMounted) {
          return;
        }

        setMeetingNotes(sortMeetingNotes(fetchedMeetingNotes));
        setProjects(fetchedProjects);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(
          "회의록 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const syncMeetingNoteState = (nextMeetingNotes) => {
    const sortedMeetingNotes = sortMeetingNotes(nextMeetingNotes);
    setMeetingNotes(sortedMeetingNotes);

    const nextProjects = Array.from(
      new Set(
        sortedMeetingNotes
          .map((meetingNote) => meetingNote.project)
          .filter(Boolean),
      ),
    );

    setProjects((currentProjects) =>
      Array.from(new Set([...currentProjects, ...nextProjects])).filter(
        Boolean,
      ),
    );
  };

  const openManualCreateDialog = () => {
    setChooserDialog({
      open: false,
      isProcessing: false,
      error: "",
    });
    setFormDialog({
      open: true,
      mode: "create",
      noteId: null,
      values: buildFormState(null, defaultProject),
      error: "",
      isSaving: false,
    });
  };

  const handleGeneratedDraft = (draftValues) => {
    setChooserDialog({
      open: false,
      isProcessing: false,
      error: "",
    });
    setUploadDialog({
      open: false,
      file: null,
      error: "",
      isSubmitting: false,
    });
    setFormDialog({
      open: true,
      mode: "create",
      noteId: null,
      values: buildFormState(draftValues, draftValues.project),
      error: "",
      isSaving: false,
    });
  };

  const handleChooserFileSelect = async (file) => {
    setChooserDialog((currentState) => ({
      ...currentState,
      isProcessing: true,
      error: "",
    }));

    try {
      const draft = await generateMeetingDraftFromAudio(file, defaultProject);
      handleGeneratedDraft(draft);
    } catch (error) {
      setChooserDialog((currentState) => ({
        ...currentState,
        isProcessing: false,
        error:
          error instanceof Error
            ? error.message
            : "파일을 처리하는 중 오류가 발생했습니다.",
      }));
    }
  };

  const handleUploadSubmit = async () => {
    setUploadDialog((currentState) => ({
      ...currentState,
      isSubmitting: true,
      error: "",
    }));

    try {
      const draft = await generateMeetingDraftFromAudio(
        uploadDialog.file,
        defaultProject,
      );
      handleGeneratedDraft(draft);
    } catch (error) {
      setUploadDialog((currentState) => ({
        ...currentState,
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "파일을 처리하는 중 오류가 발생했습니다.",
      }));
    }
  };

  const handleFormFieldChange = (fieldName, nextValue) => {
    setFormDialog((currentState) => {
      const nextValues = {
        ...currentState.values,
        [fieldName]: nextValue,
      };

      if (fieldName === "actionItem") {
        nextValues.actionItems = [...currentState.values.actionItems];
        nextValues.actionItems[nextValue.actionItemIndex] = nextValue.nextValue;
        delete nextValues.actionItem;
      }

      if (fieldName === "actionItemAdd") {
        nextValues.actionItems = [...currentState.values.actionItems, ""];
        nextValues.actionItemChecks = [
          ...(currentState.values.actionItemChecks ?? []),
          false,
        ];
        delete nextValues.actionItemAdd;
      }

      if (fieldName === "actionItemRemove") {
        const removeIndex = nextValue.actionItemIndex;
        const currentItems = currentState.values.actionItems ?? [];
        const currentChecks = currentState.values.actionItemChecks ?? [];

        nextValues.actionItems = currentItems.filter(
          (_item, index) => index !== removeIndex,
        );
        nextValues.actionItemChecks = currentChecks.filter(
          (_checked, index) => index !== removeIndex,
        );

        if (nextValues.actionItems.length === 0) {
          nextValues.actionItems = [""];
          nextValues.actionItemChecks = [false];
        }

        delete nextValues.actionItemRemove;
      }

      if (fieldName === "actionItemToggle") {
        const toggleIndex = nextValue.actionItemIndex;
        nextValues.actionItemChecks = [
          ...(currentState.values.actionItemChecks ?? []),
        ];
        nextValues.actionItemChecks[toggleIndex] = !Boolean(
          nextValues.actionItemChecks[toggleIndex],
        );
        delete nextValues.actionItemToggle;
      }

      return {
        ...currentState,
        error: "",
        values: nextValues,
      };
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPayloadFromForm(formDialog.values);

    if (!payload.project || !payload.title.trim() || !payload.date) {
      setFormDialog((currentState) => ({
        ...currentState,
        error: "프로젝트, 제목, 날짜는 반드시 입력해주세요.",
      }));
      return;
    }

    if (!payload.summary.trim()) {
      setFormDialog((currentState) => ({
        ...currentState,
        error: "AI 요약 또는 직접 작성한 요약 내용을 입력해주세요.",
      }));
      return;
    }

    setFormDialog((currentState) => ({
      ...currentState,
      isSaving: true,
      error: "",
    }));

    try {
      if (formDialog.mode === "edit" && formDialog.noteId) {
        const updatedMeetingNote = await updateMeetingNote(
          formDialog.noteId,
          payload,
        );

        if (updatedMeetingNote) {
          syncMeetingNoteState(
            meetingNotes.map((meetingNote) =>
              meetingNote.id === updatedMeetingNote.id
                ? updatedMeetingNote
                : meetingNote,
            ),
          );
        }

        setFormDialog((currentState) => ({
          ...currentState,
          open: false,
          isSaving: false,
        }));
        return;
      }

      const createdMeetingNote = await createMeetingNote(payload);
      syncMeetingNoteState([createdMeetingNote, ...meetingNotes]);
      setFormDialog((currentState) => ({
        ...currentState,
        open: false,
        isSaving: false,
      }));
      navigate(`/records/${createdMeetingNote.id}`);
    } catch (error) {
      setFormDialog((currentState) => ({
        ...currentState,
        isSaving: false,
        error: "회의록 저장에 실패했습니다. 잠시 후 다시 시도해주세요.",
      }));
    }
  };

  const handleDeleteMeetingNote = async () => {
    if (!activeMeetingNote) {
      return;
    }

    setDeleteDialog((currentState) => ({
      ...currentState,
      isDeleting: true,
    }));

    try {
      await deleteMeetingNote(activeMeetingNote.id);
      const nextMeetingNotes = meetingNotes.filter(
        (meetingNote) => meetingNote.id !== activeMeetingNote.id,
      );

      syncMeetingNoteState(nextMeetingNotes);
      setDeleteDialog({
        open: false,
        isDeleting: false,
      });
      navigate("/records");
    } catch (error) {
      setDeleteDialog((currentState) => ({
        ...currentState,
        isDeleting: false,
      }));
    }
  };

  const handleToggleActionItem = async (actionItemIndex) => {
    if (!activeMeetingNote) {
      return;
    }

    const currentChecks =
      activeMeetingNote.actionItemChecks ??
      activeMeetingNote.actionItems.map(() => false);
    const nextChecks = currentChecks.map((checked, index) =>
      index === actionItemIndex ? !checked : checked,
    );
    const optimisticMeetingNote = {
      ...activeMeetingNote,
      actionItemChecks: nextChecks,
    };

    syncMeetingNoteState(
      meetingNotes.map((meetingNote) =>
        meetingNote.id === optimisticMeetingNote.id
          ? optimisticMeetingNote
          : meetingNote,
      ),
    );

    try {
      const updatedMeetingNote = await updateMeetingNote(
        activeMeetingNote.id,
        buildPayloadFromMeetingNote(activeMeetingNote, {
          actionItemChecks: nextChecks,
        }),
      );

      if (updatedMeetingNote) {
        syncMeetingNoteState(
          meetingNotes.map((meetingNote) =>
            meetingNote.id === updatedMeetingNote.id
              ? updatedMeetingNote
              : meetingNote,
          ),
        );
      }
    } catch (error) {
      syncMeetingNoteState(meetingNotes);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm">
        <div className="space-y-4">
          <div className="h-10 w-40 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-72 animate-pulse rounded-full bg-slate-100" />
          <div className="mt-8 h-32 animate-pulse rounded-[28px] bg-slate-100" />
          <div className="h-44 animate-pulse rounded-[28px] bg-slate-100" />
          <div className="h-44 animate-pulse rounded-[28px] bg-slate-100" />
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="rounded-[32px] border border-rose-200 bg-white px-6 py-8 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          회의록
        </h1>
        <p className="mt-4 rounded-[20px] bg-rose-50 px-4 py-4 text-rose-600">
          {loadError}
        </p>
      </section>
    );
  }

  return (
    <>
      {meetingNoteId ? (
        activeMeetingNote ? (
          <MeetingNotesDetail
            meetingNote={activeMeetingNote}
            onOpenEdit={() =>
              setFormDialog({
                open: true,
                mode: "edit",
                noteId: activeMeetingNote.id,
                values: buildFormState(
                  activeMeetingNote,
                  activeMeetingNote.project,
                ),
                error: "",
                isSaving: false,
              })
            }
            onDownload={() => downloadMeetingNoteFile(activeMeetingNote)}
            onDelete={() =>
              setDeleteDialog({
                open: true,
                isDeleting: false,
              })
            }
            onToggleActionItem={handleToggleActionItem}
          />
        ) : (
          <section className="rounded-[32px] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              회의록을 찾을 수 없습니다
            </h1>
            <p className="mt-4 text-slate-500">
              삭제되었거나 잘못된 경로로 접근했을 수 있습니다.
            </p>
            <ActionButton className="mt-6" onClick={() => navigate("/records")}>
              회의록 목록으로 이동
            </ActionButton>
          </section>
        )
      ) : (
        <MeetingNotesList
          meetingNotes={meetingNotes}
          query={query}
          selectedProject={selectedProject}
          onQueryChange={setQuery}
          onProjectChange={setSelectedProject}
          onOpenUploadDialog={() =>
            setUploadDialog({
              open: true,
              file: null,
              error: "",
              isSubmitting: false,
            })
          }
          onOpenCreateChooser={() =>
            setChooserDialog({
              open: true,
              isProcessing: false,
              error: "",
            })
          }
          projects={projects}
        />
      )}

      {chooserDialog.open ? (
        <CreateNoteChooserDialog
          isProcessing={chooserDialog.isProcessing}
          error={chooserDialog.error}
          onClose={() =>
            setChooserDialog({
              open: false,
              isProcessing: false,
              error: "",
            })
          }
          onSelectFile={handleChooserFileSelect}
          onOpenManualCreate={openManualCreateDialog}
        />
      ) : null}

      {uploadDialog.open ? (
        <UploadDialog
          file={uploadDialog.file}
          error={uploadDialog.error}
          isSubmitting={uploadDialog.isSubmitting}
          onClose={() =>
            setUploadDialog({
              open: false,
              file: null,
              error: "",
              isSubmitting: false,
            })
          }
          onSelectFile={(file) =>
            setUploadDialog((currentState) => ({
              ...currentState,
              file,
              error: "",
            }))
          }
          onSubmit={handleUploadSubmit}
        />
      ) : null}

      {formDialog.open && formDialog.values ? (
        <MeetingNoteFormDialog
          mode={formDialog.mode}
          projects={projects.length > 0 ? projects : [defaultProject]}
          values={formDialog.values}
          error={formDialog.error}
          isSaving={formDialog.isSaving}
          onChange={handleFormFieldChange}
          onClose={() =>
            setFormDialog((currentState) => ({
              ...currentState,
              open: false,
              isSaving: false,
              error: "",
            }))
          }
          onSubmit={handleFormSubmit}
        />
      ) : null}

      {deleteDialog.open && activeMeetingNote ? (
        <DeleteConfirmDialog
          isDeleting={deleteDialog.isDeleting}
          onClose={() =>
            setDeleteDialog({
              open: false,
              isDeleting: false,
            })
          }
          onDelete={handleDeleteMeetingNote}
        />
      ) : null}
    </>
  );
}

export default MeetingNotesPage;
