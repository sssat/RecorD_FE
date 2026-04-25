import { useState } from 'react';
import {
  EVENT_THEMES,
  EVENT_TYPE_OPTIONS,
  PROJECT_OPTIONS,
  TODO_PRIORITY_OPTIONS,
  formatEventFullDateLabel,
  formatEventTimeRange,
} from './calendarData';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[2]">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" />
      <path d="M8 3.75v4" />
      <path d="M16 3.75v4" />
      <path d="M3.75 9.5h16.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5v5l3.5 2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]">
      <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

function SelectArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[2]">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function DialogShell({ maxWidth = 'max-w-[640px]', onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/45 px-4 py-4 sm:px-6 sm:py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div
          className={`w-full ${maxWidth} overflow-hidden rounded-[32px] bg-white shadow-[0_35px_90px_-35px_rgba(15,23,42,0.45)]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function FormLayout({ title, onClose, footer, children }) {
  return (
    <div className="flex max-h-[calc(100vh-2rem)] flex-col">
      <div className="flex items-center justify-between gap-4 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
        <h2 className="text-[2rem] font-black tracking-tight text-slate-900">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="닫기"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="overflow-y-auto px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        {children}
      </div>
      <div className="border-t border-slate-100 px-6 py-5 sm:px-8">{footer}</div>
    </div>
  );
}

function FormField({ label, optional = false, children }) {
  return (
    <label className="block">
      <span className="mb-3 block text-base font-medium text-slate-900">
        {label}
        {optional ? ' (선택)' : ''}
      </span>
      {children}
    </label>
  );
}

function FieldInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[22px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 text-lg text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-lime-300 focus:bg-white"
    />
  );
}

function FieldTextarea(props) {
  return (
    <textarea
      {...props}
      className="min-h-[138px] w-full rounded-[22px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 text-lg text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-lime-300 focus:bg-white"
    />
  );
}

function FieldSelect({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full appearance-none rounded-[22px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 pr-14 text-lg text-slate-900 outline-none transition focus:border-lime-300 focus:bg-white"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
        <SelectArrowIcon />
      </span>
    </div>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="flex-1 rounded-[22px] border border-slate-200 px-5 py-4 text-xl font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, tone = 'primary', ...props }) {
  const toneClassName =
    tone === 'danger'
      ? 'bg-white text-rose-400 ring-1 ring-rose-300 hover:bg-rose-50'
      : 'bg-lime-400 text-white hover:bg-lime-500';

  return (
    <button
      {...props}
      className={`flex-1 rounded-[22px] px-5 py-4 text-xl font-medium transition ${toneClassName}`}
    >
      {children}
    </button>
  );
}

export function TodoFormDialog({ mode, initialValues, onClose, onSubmit }) {
  const [formState, setFormState] = useState(initialValues);

  const updateField = (fieldName) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.title.trim()) {
      return;
    }

    onSubmit({
      ...formState,
      title: formState.title.trim(),
      description: formState.description.trim(),
    });
  };

  return (
    <DialogShell onClose={onClose}>
      <FormLayout
        title={mode === 'edit' ? '할 일 수정' : '새 할 일'}
        onClose={onClose}
        footer={
          <div className="flex gap-4">
            <SecondaryButton type="button" onClick={onClose}>
              취소
            </SecondaryButton>
            <PrimaryButton type="submit" form="todo-form">
              확인
            </PrimaryButton>
          </div>
        }
      >
        <form id="todo-form" onSubmit={handleSubmit} className="space-y-6">
          <FormField label="제목">
            <FieldInput
              value={formState.title}
              onChange={updateField('title')}
              placeholder="할 일을 입력하세요"
            />
          </FormField>

          <FormField label="우선순위">
            <FieldSelect
              value={formState.priority}
              onChange={updateField('priority')}
            >
              {TODO_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FieldSelect>
          </FormField>

          <FormField label="마감일" optional>
            <FieldInput
              type="date"
              value={formState.date}
              onChange={updateField('date')}
            />
          </FormField>

          <FormField label="설명" optional>
            <FieldTextarea
              value={formState.description}
              onChange={updateField('description')}
              placeholder="할 일에 대한 설명을 입력하세요"
            />
          </FormField>

          <FormField label="프로젝트" optional>
            <FieldSelect
              value={formState.project}
              onChange={updateField('project')}
            >
              {PROJECT_OPTIONS.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </FieldSelect>
          </FormField>
        </form>
      </FormLayout>
    </DialogShell>
  );
}

export function EventFormDialog({ mode, initialValues, onClose, onSubmit }) {
  const [formState, setFormState] = useState(initialValues);

  const updateField = (fieldName) => (event) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.title.trim() || !formState.date || !formState.startTime || !formState.endTime) {
      return;
    }

    onSubmit({
      ...formState,
      title: formState.title.trim(),
      location: formState.location.trim(),
      description: formState.description.trim(),
    });
  };

  return (
    <DialogShell onClose={onClose}>
      <FormLayout
        title={mode === 'edit' ? '일정 수정' : '새 일정'}
        onClose={onClose}
        footer={
          <div className="flex gap-4">
            <SecondaryButton type="button" onClick={onClose}>
              취소
            </SecondaryButton>
            <PrimaryButton type="submit" form="event-form">
              확인
            </PrimaryButton>
          </div>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
          <FormField label="제목">
            <FieldInput
              value={formState.title}
              onChange={updateField('title')}
              placeholder="일정 제목"
            />
          </FormField>

          <FormField label="날짜">
            <FieldInput
              type="date"
              value={formState.date}
              onChange={updateField('date')}
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="시작 시간">
              <FieldInput
                type="time"
                value={formState.startTime}
                onChange={updateField('startTime')}
              />
            </FormField>

            <FormField label="종료 시간">
              <FieldInput
                type="time"
                value={formState.endTime}
                onChange={updateField('endTime')}
              />
            </FormField>
          </div>

          <FormField label="유형">
            <FieldSelect value={formState.type} onChange={updateField('type')}>
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FieldSelect>
          </FormField>

          <FormField label="장소" optional>
            <FieldInput
              value={formState.location}
              onChange={updateField('location')}
              placeholder="장소를 입력하세요"
            />
          </FormField>

          <FormField label="설명" optional>
            <FieldTextarea
              value={formState.description}
              onChange={updateField('description')}
              placeholder="일정에 대한 설명을 입력하세요"
            />
          </FormField>

          <FormField label="프로젝트" optional>
            <FieldSelect
              value={formState.project}
              onChange={updateField('project')}
            >
              {PROJECT_OPTIONS.map((projectName) => (
                <option key={projectName} value={projectName}>
                  {projectName}
                </option>
              ))}
            </FieldSelect>
          </FormField>
        </form>
      </FormLayout>
    </DialogShell>
  );
}

export function EventDetailDialog({ event, onClose, onDelete, onEdit }) {
  const theme = EVENT_THEMES[event.color] ?? EVENT_THEMES.lime;

  return (
    <DialogShell maxWidth="max-w-[650px]" onClose={onClose}>
      <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className={`mb-4 block h-3 w-3 rounded-full ${theme.dot}`} />
            <h2 className="truncate text-[2rem] font-black tracking-tight text-slate-900">
              {event.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-8 space-y-4 text-lg text-slate-700">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              <CalendarIcon />
            </span>
            <p>{formatEventFullDateLabel(event)}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              <ClockIcon />
            </span>
            <p>{formatEventTimeRange(event.start, event.end)}</p>
          </div>

          {event.location ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                <MapPinIcon />
              </span>
              <p>{event.location}</p>
            </div>
          ) : null}
        </div>

        {event.description ? (
          <p className="mt-8 text-xl leading-8 text-slate-400">{event.description}</p>
        ) : null}

        <div className="mt-8 flex gap-4">
          <PrimaryButton type="button" tone="danger" onClick={() => onDelete(event.id)}>
            삭제
          </PrimaryButton>
          <PrimaryButton type="button" onClick={() => onEdit(event)}>
            수정
          </PrimaryButton>
        </div>
      </div>
    </DialogShell>
  );
}
