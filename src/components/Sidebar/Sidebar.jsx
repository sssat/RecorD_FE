import { Link } from 'react-router-dom';

const sidebarItems = [
  { label: '대시보드', icon: DashboardIcon, active: true },
  { label: '회의록', icon: DocumentIcon },
  { label: '캘린더', icon: CalendarIcon },
  { label: '프로젝트', icon: FolderIcon },
];

function SidebarIconShell({ children, active }) {
  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
        active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
      }`}
    >
      {children}
    </span>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M7 3.75h6.5L19.25 9.5V19A2.25 2.25 0 0 1 17 21.25H7A2.25 2.25 0 0 1 4.75 19V6A2.25 2.25 0 0 1 7 3.75Z" />
      <path d="M13 3.75V9.5h5.75" />
      <path d="M8.5 13h7" />
      <path d="M8.5 16.5h7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" />
      <path d="M8 3.75v4" />
      <path d="M16 3.75v4" />
      <path d="M3.75 9.5h16.5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M4 7.25A2.25 2.25 0 0 1 6.25 5h3.5l1.7 1.75H17.75A2.25 2.25 0 0 1 20 9v8.75A2.25 2.25 0 0 1 17.75 20H6.25A2.25 2.25 0 0 1 4 17.75V7.25Z" />
      <path d="M4 9.75h16" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M10.1 4.25h3.8l.5 2.08a6.31 6.31 0 0 1 1.62.94l1.97-.79 1.9 3.28-1.46 1.48c.09.5.14 1 .14 1.51s-.05 1.01-.14 1.51l1.46 1.48-1.9 3.28-1.97-.79c-.5.38-1.05.7-1.62.94l-.5 2.08h-3.8l-.5-2.08a6.31 6.31 0 0 1-1.62-.94l-1.97.79-1.9-3.28 1.46-1.48a8.4 8.4 0 0 1-.14-1.51c0-.51.05-1.01.14-1.51L4.5 9.76l1.9-3.28 1.97.79c.5-.38 1.05-.7 1.62-.94l.5-2.08Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function UserProfileCard() {
  return (
    <Link
      to="/login"
      className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-lime-300 hover:bg-lime-50"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lime-400 text-lg font-semibold text-white">
        K
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-slate-900">로그인 해주세요</p>
        <p className="truncate text-sm text-slate-500">
          카카오 로그인 화면으로 이동합니다
        </p>
      </div>
      <span className="rounded-full bg-white p-2 text-slate-500 shadow-sm">
        <GearIcon />
      </span>
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-[280px] lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-200 px-6 py-7">
        <Link to="/" className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-white to-lime-100 shadow-sm ring-1 ring-slate-200">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-[#24406f] stroke-[1.8]">
              <path d="M4 17.5V8.25" />
              <path d="M8 17.5V11" />
              <path d="M12 17.5V6.5" />
              <path d="M16 17.5v-4.25" />
              <path d="M20 17.5V4.5" />
              <path d="M3.5 19.25h17" />
            </svg>
          </span>
          <div>
            <p className="text-3xl font-black tracking-tight text-slate-900">Recor-D</p>
            <p className="text-sm text-slate-500">포트폴리오 관리</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <div
                  className={`flex items-center gap-4 rounded-3xl px-4 py-3 ${
                    item.active
                      ? 'bg-lime-400 text-white shadow-[0_16px_30px_-18px_rgba(132,204,22,0.9)]'
                      : 'text-slate-700'
                  }`}
                >
                  <SidebarIconShell active={item.active}>
                    <Icon />
                  </SidebarIconShell>
                  <span className="text-lg font-medium">{item.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-5">
        <UserProfileCard />
      </div>
    </aside>
  );
}

export default Sidebar;
