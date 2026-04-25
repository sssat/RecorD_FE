import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

function MainShell() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex lg:h-screen lg:overflow-hidden">
      <Sidebar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:min-w-0 lg:overflow-y-auto lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1480px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainShell;
