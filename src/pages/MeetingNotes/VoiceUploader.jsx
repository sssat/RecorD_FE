import { useId, useState } from 'react';

function UploadArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-16 w-16 fill-none stroke-current stroke-[1.75] text-slate-300"
    >
      <path d="M12 16.5V5.25" />
      <path d="m7.5 9.75 4.5-4.5 4.5 4.5" />
      <path d="M6.25 18.75h11.5A2.25 2.25 0 0 0 20 16.5v-1.25" />
      <path d="M4 15.25v1.25a2.25 2.25 0 0 0 2.25 2.25" />
    </svg>
  );
}

function VoiceUploader({
  label = '녹음 파일 업로드',
  description = '파일을 클릭하거나 드래그하세요',
  helper = 'MP3, WAV, M4A 파일 지원',
  fileName = '',
  onSelectFile,
  disabled = false,
  className = '',
}) {
  const inputId = useId();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];

    if (nextFile && onSelectFile) {
      onSelectFile(nextFile);
    }

    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setIsDragActive(false);
    const nextFile = event.dataTransfer.files?.[0];

    if (nextFile && onSelectFile) {
      onSelectFile(nextFile);
    }
  };

  return (
    <label
      htmlFor={inputId}
      onDragOver={(event) => {
        event.preventDefault();

        if (!disabled) {
          setIsDragActive(true);
        }
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      className={`group flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-10 text-center transition ${
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
          : isDragActive
            ? 'border-[#67b6a7] bg-[#f2fbf8]'
            : 'border-slate-200 bg-white hover:border-[#aacb62] hover:bg-[#fbfdf7]'
      } ${className}`}
    >
      <input
        id={inputId}
        type="file"
        accept=".mp3,.wav,.m4a,audio/*"
        className="sr-only"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <UploadArrowIcon />

      <p className="mt-4 text-[1.9rem] font-semibold tracking-tight text-[#172554]">
        {label}
      </p>
      <p className="mt-2 text-base text-slate-500">{description}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>

      {fileName ? (
        <span className="mt-5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          선택된 파일: {fileName}
        </span>
      ) : null}
    </label>
  );
}

export default VoiceUploader;
