import { useEffect, useRef, useState } from 'react';
import {
  EVENT_COLOR_OPTIONS,
  EVENT_THEMES,
  EVENT_TYPE_OPTIONS,
  PROJECT_OPTIONS,
  TODO_PRIORITY_OPTIONS,
  formatEventFullDateLabel,
  formatEventTimeRange,
  hasEventTime,
} from './calendarData';

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[2]"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" />
      <path d="M8 3.75v4" />
      <path d="M16 3.75v4" />
      <path d="M3.75 9.5h16.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5v5l3.5 2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[2.4]"
    >
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

function SelectArrowIcon({ open = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 fill-none stroke-current stroke-[2] transition ${
        open ? 'rotate-180' : ''
      }`}
    >
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
          className={`dialog-surface w-full ${maxWidth} overflow-hidden rounded-[36px] bg-white shadow-[0_35px_90px_-35px_rgba(15,23,42,0.45)]`}
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
      <div className="dialog-footer border-t border-slate-100 px-6 py-5 sm:px-8">
        {footer}
      </div>
    </div>
  );
}

function FormField({ label, optional = false, children }) {
  return (
    <div className="block">
      <span className="mb-3 block text-base font-medium text-slate-900">
        {label}
        {optional ? ' (선택)' : ''}
      </span>
      {children}
    </div>
  );
}

function FieldInput(props) {
  return (
    <input
      {...props}
      className="dialog-field-input w-full rounded-[28px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 text-lg text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#767676] focus:bg-white"
    />
  );
}

function FieldTextarea(props) {
  return (
    <textarea
      {...props}
      className="dialog-field-input min-h-[138px] w-full rounded-[28px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 text-lg text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#767676] focus:bg-white"
    />
  );
}

function openNativePicker(input) {
  if (!input) {
    return;
  }

  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
      return;
    } catch {
      // Fallback to focus when showPicker is unavailable.
    }
  }

  input.focus();
}

function PickerField({ type, ariaLabel, ...props }) {
  const inputRef = useRef(null);
  const icon = type === 'time' ? <ClockIcon /> : <CalendarIcon />;

  return (
    <div className="flex items-center gap-3 rounded-[28px] border border-slate-100 bg-[#f7f8fc] px-6 py-5 transition focus-within:border-[#767676] focus-within:bg-white">
      <input
        ref={inputRef}
        type={type}
        {...props}
        className="picker-field-input w-full bg-transparent text-lg text-slate-900 outline-none"
      />
      <button
        type="button"
        onClick={() => openNativePicker(inputRef.current)}
        className="shrink-0 text-slate-500 transition hover:text-slate-900"
        aria-label={ariaLabel}
      >
        {icon}
      </button>
    </div>
  );
}

function TimePickerField({ label, value, onChange, ariaLabel }) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <PickerField
        type="time"
        step="300"
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}

function FieldSelect({ value, options, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === value) ?? null;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className={`dialog-field-select-trigger flex w-full items-center justify-between rounded-[28px] border px-6 py-5 text-left text-lg text-slate-900 transition ${
          isOpen
            ? 'border-[#767676] bg-white shadow-[0_20px_40px_-30px_rgba(58,58,58,0.35)]'
            : 'border-slate-100 bg-[#f7f8fc] hover:border-slate-200'
        }`}
      >
        <span>{selectedOption?.label ?? placeholder}</span>
        <span className="text-slate-500">
          <SelectArrowIcon open={isOpen} />
        </span>
      </button>

      {isOpen ? (
        <div className="dialog-field-select-menu absolute z-30 mt-3 w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)]">
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[22px] px-4 py-3 text-left text-lg transition ${
                    isSelected
                      ? 'bg-[#EFEFEF] text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <span className="text-[#3A3A3A]">
                      <CheckIcon />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EventColorPicker({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {EVENT_COLOR_OPTIONS.map((option) => {
        const theme = EVENT_THEMES[option.value];
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-4 rounded-[24px] border px-4 py-4 text-left transition ${
              isSelected
                ? 'border-slate-900 ring-2 ring-slate-200'
                : 'border-slate-200 hover:border-slate-300'
            } ${theme.card}`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full ${theme.swatch}`}
            >
              <span className={`h-5 w-5 rounded-full ${theme.dot}`} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                {option.label}
              </span>
            </span>
            {isSelected ? (
              <span className="text-slate-900">
                <CheckIcon />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="dialog-secondary-button flex-1 rounded-[26px] border border-slate-200 px-5 py-4 text-xl font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, tone = 'primary', ...props }) {
  const toneClassName =
    tone === 'danger'
      ? 'bg-white text-[#CC3F41] ring-1 ring-[#FFC1C1] hover:bg-[#FFE0E0]'
      : 'bg-[#3A3A3A] text-white hover:bg-[#000000]';

  return (
    <button
      {...props}
      className={`dialog-primary-button flex-1 rounded-[26px] px-5 py-4 text-xl font-medium transition ${toneClassName}`}
    >
      {children}
    </button>
  );
}

function toProjectOption(projectName) {
  return { value: projectName, label: projectName };
}

export function TodoFormDialog({ mode, initialValues, onClose, onSubmit }) {
  const [formState, setFormState] = useState(initialValues);

  const setFieldValue = (fieldName, nextValue) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: nextValue,
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
              onChange={(event) => setFieldValue('title', event.target.value)}
              placeholder="할 일을 입력해 주세요"
            />
          </FormField>

          <FormField label="우선순위">
            <FieldSelect
              value={formState.priority}
              options={TODO_PRIORITY_OPTIONS}
              onChange={(nextValue) => setFieldValue('priority', nextValue)}
              placeholder="우선순위를 선택해 주세요"
            />
          </FormField>

          <FormField label="마감일" optional>
            <PickerField
              type="date"
              value={formState.date}
              onChange={(event) => setFieldValue('date', event.target.value)}
              ariaLabel="마감일 선택"
            />
          </FormField>

          <FormField label="설명" optional>
            <FieldTextarea
              value={formState.description}
              onChange={(event) =>
                setFieldValue('description', event.target.value)
              }
              placeholder="할 일에 대한 설명을 입력해 주세요"
            />
          </FormField>

          <FormField label="프로젝트" optional>
            <FieldSelect
              value={formState.project}
              options={PROJECT_OPTIONS.map(toProjectOption)}
              onChange={(nextValue) => setFieldValue('project', nextValue)}
              placeholder="프로젝트를 선택해 주세요"
            />
          </FormField>
        </form>
      </FormLayout>
    </DialogShell>
  );
}

export function EventFormDialog({ mode, initialValues, onClose, onSubmit }) {
  const [formState, setFormState] = useState(initialValues);

  const setFieldValue = (fieldName, nextValue) => {
    setFormState((currentState) => {
      const nextState = {
        ...currentState,
        [fieldName]: nextValue,
      };

      if (
        fieldName === 'startDate' &&
        currentState.endDate &&
        currentState.endDate < nextValue
      ) {
        nextState.endDate = nextValue;
      }

      if (
        fieldName === 'endDate' &&
        currentState.startDate &&
        nextValue &&
        nextValue < currentState.startDate
      ) {
        nextState.endDate = currentState.startDate;
      }

      return nextState;
    });
  };

  const toggleTime = () => {
    setFormState((currentState) => ({
      ...currentState,
      hasTime: !currentState.hasTime,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formState.title.trim() ||
      !formState.startDate ||
      !formState.endDate ||
      (formState.hasTime &&
        (!formState.startTime || !formState.endTime))
    ) {
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
              onChange={(event) => setFieldValue('title', event.target.value)}
              placeholder="일정 제목"
            />
          </FormField>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="시작일">
              <PickerField
                type="date"
                value={formState.startDate}
                onChange={(event) =>
                  setFieldValue('startDate', event.target.value)
                }
                ariaLabel="시작일 선택"
              />
            </FormField>

            <FormField label="종료일">
              <PickerField
                type="date"
                min={formState.startDate || undefined}
                value={formState.endDate}
                onChange={(event) =>
                  setFieldValue('endDate', event.target.value)
                }
                ariaLabel="종료일 선택"
              />
            </FormField>
          </div>

          <FormField label="시간" optional>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-[24px] border border-slate-100 bg-[#f7f8fc] px-5 py-4">
                <span className="text-base font-semibold text-slate-900">
                  시간 사용
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formState.hasTime}
                  onClick={toggleTime}
                  className={`relative h-8 w-14 rounded-full transition ${
                    formState.hasTime ? 'bg-[#3A3A3A]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                      formState.hasTime ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {formState.hasTime ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <TimePickerField
                    label="시작 시간"
                    value={formState.startTime}
                    onChange={(event) =>
                      setFieldValue('startTime', event.target.value)
                    }
                    ariaLabel="시작 시간 입력"
                  />
                  <TimePickerField
                    label="종료 시간"
                    value={formState.endTime}
                    onChange={(event) =>
                      setFieldValue('endTime', event.target.value)
                    }
                    ariaLabel="종료 시간 입력"
                  />
                </div>
              ) : null}
            </div>
          </FormField>

          <FormField label="유형">
            <FieldSelect
              value={formState.type}
              options={EVENT_TYPE_OPTIONS}
              onChange={(nextValue) => setFieldValue('type', nextValue)}
              placeholder="일정 유형을 선택해 주세요"
            />
          </FormField>

          <FormField label="일정 색상">
            <EventColorPicker
              value={formState.color}
              onChange={(nextValue) => setFieldValue('color', nextValue)}
            />
          </FormField>

          <FormField label="장소" optional>
            <FieldInput
              value={formState.location}
              onChange={(event) => setFieldValue('location', event.target.value)}
              placeholder="장소를 입력해 주세요"
            />
          </FormField>

          <FormField label="설명" optional>
            <FieldTextarea
              value={formState.description}
              onChange={(event) =>
                setFieldValue('description', event.target.value)
              }
              placeholder="일정에 대한 설명을 입력해 주세요"
            />
          </FormField>

          <FormField label="프로젝트" optional>
            <FieldSelect
              value={formState.project}
              options={PROJECT_OPTIONS.map(toProjectOption)}
              onChange={(nextValue) => setFieldValue('project', nextValue)}
              placeholder="프로젝트를 선택해 주세요"
            />
          </FormField>
        </form>
      </FormLayout>
    </DialogShell>
  );
}

export function EventDetailDialog({ event, onClose, onDelete, onEdit }) {
  const theme = EVENT_THEMES[event.color] ?? EVENT_THEMES.primary;

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

          {hasEventTime(event) ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                <ClockIcon />
              </span>
              <p>{formatEventTimeRange(event.start, event.end)}</p>
            </div>
          ) : null}

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
          <p className="mt-8 text-xl leading-8 text-slate-400">
            {event.description}
          </p>
        ) : null}

        <div className="mt-8 flex gap-4">
          <PrimaryButton
            type="button"
            tone="danger"
            onClick={() => onDelete(event.id)}
          >
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
