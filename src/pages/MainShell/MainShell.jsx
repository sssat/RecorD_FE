import Sidebar from '../../components/Sidebar/Sidebar';

function MainShell() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex">
      <Sidebar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1320px]">
          <section className="min-h-[calc(100vh-4rem)] rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-sm lg:px-8">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              메인페이지
            </h1>
          </section>
        </div>
      </main>
    </div>
  );
}

export default MainShell;
