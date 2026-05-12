import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks] = useState([]); 

  const getTailwindColor = (colorKey) => {
    const colorMap = {
      green: 'bg-lime-500',
      blue: 'bg-blue-400',
      red: 'bg-red-400',
      yellow: 'bg-yellow-400',
      purple: 'bg-purple-400',
    };
    return colorMap[colorKey] || 'bg-slate-300'; 
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [projectRes, scheduleRes, todoRes] = await Promise.all([
          axios.get('http://localhost:8080/api/projects/', { headers }),
          axios.get('http://localhost:8080/api/schedules/', { headers }),
          axios.get('http://localhost:8080/api/todos/', { headers })
        ]);

        // 1. 프로젝트
        const projectData = projectRes.data.results.map((p) => ({
          id: p.id,
          title: p.name, 
          dotColor: getTailwindColor(p.colorKey), 
          done: p.completedTodoCount, 
          total: p.todoCount 
        }));
        setProjects(projectData);

        // 2. 일정
        const scheduleData = scheduleRes.data.results.map((s) => {
          const dateObj = new Date(s.start_datetime);
          const hour = String(dateObj.getHours()).padStart(2, '0');
          const min = String(dateObj.getMinutes()).padStart(2, '0');

          return {
            id: s.id,
            hour: hour,
            min: min,
            title: s.title,
            type: s.type ? s.type.charAt(0).toUpperCase() + s.type.slice(1) : 'Schedule'
          };
        });
        setSchedules(scheduleData.slice(0, 3));

        // 3. 할 일
        const todoData = todoRes.data.results.map((t) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dueDate = new Date(t.due_date);
          dueDate.setHours(0, 0, 0, 0);

          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let badge = '';
          let badgeType = '';

          if (diffDays < 0) {
            badge = '지남';
            badgeType = 'default';
          } else if (diffDays === 0) {
            badge = 'D-Day';
            badgeType = 'danger';
          } else {
            badge = `D-${diffDays}`;
            badgeType = 'primary'; 
          }

          return {
            id: t.id,
            title: t.title,
            date: t.due_date,
            isDone: t.status === 'done', 
            badge: badge,
            badgeType: badgeType
          };
        });

        // 완료된 항목 아래로 정렬
        const sortedTodoData = todoData.sort((a, b) => Number(a.isDone) - Number(b.isDone));
        setTasks(sortedTodoData.slice(0, 4));

      } catch (error) {
        console.error('대시보드 데이터를 불러오는데 실패했습니다.', error);
      }
    };

    fetchDashboardData();
  }, []);

  // 투두리스트 체크박스 클릭 핸들러 (실제 PATCH API 연동)
  const toggleTask = async (id) => {
    // 목표로 하는 할 일 찾기
    const targetTask = tasks.find(t => t.id === id);
    // 현재 상태의 반대 상태를 백엔드에 보낼 값으로 설정 (done <-> todo)
    const newStatus = targetTask.isDone ? 'todo' : 'done'; 
    
    // 1. 프론트엔드 UI 즉각 업데이트 (사용자 경험 향상 및 정렬 처리)
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map(task => 
        task.id === id ? { ...task, isDone: !task.isDone } : task
      );
      return updatedTasks.sort((a, b) => Number(a.isDone) - Number(b.isDone));
    });

    // 2. 실제 백엔드에 수정(PATCH) 요청
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8080/api/todos/${id}/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(`할 일(${id}) 상태가 ${newStatus}(으)로 성공적으로 변경되었습니다.`);
    } catch (error) {
      console.error('할 일 상태 업데이트 실패', error);
      
      // 3. 서버 통신 실패 시: 체크박스와 정렬을 원래대로 롤백(복구)
      alert('상태 업데이트에 실패했습니다. 다시 시도해 주세요.');
      setTasks((prevTasks) => {
        const rolledBackTasks = prevTasks.map(task => 
          task.id === id ? { ...task, isDone: targetTask.isDone } : task
        );
        return rolledBackTasks.sort((a, b) => Number(a.isDone) - Number(b.isDone));
      });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          대시보드
        </h1>
        <p className="mt-3 text-lg leading-8 text-slate-400 sm:text-xl">
          오늘의 일정과 진행 중인 작업을 확인하세요
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 1. 진행 중인 프로젝트 섹션 */}
        <SectionContainer title="진행 중인 프로젝트" linkTo="/projects">
          {projects.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">진행 중인 프로젝트가 없습니다.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex-1 min-w-[260px] bg-[#f8fafc] rounded-2xl p-5 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${project.dotColor}`}></span>
                      <h3 className="font-semibold text-slate-800 text-[15px]">{project.title}</h3>
                    </div>
                    <ChevronRightIcon />
                  </div>
                  <div className="flex items-center text-[13px] font-medium text-slate-500">
                    <span>할 일 <span className="text-slate-800 font-bold ml-1">{project.done}/{project.total}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionContainer>

        {/* 2. 오늘의 일정 섹션 */}
        <SectionContainer title="오늘의 일정" linkTo="/calendar">
          {schedules.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">오늘 등록된 일정이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div 
                  key={schedule.id}
                  className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center justify-center w-10 text-[#8dc63f]">
                      <span className="text-2xl font-extrabold leading-none">{schedule.hour}</span>
                      <span className="text-xs font-semibold mt-1">{schedule.min}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{schedule.title}</h3>
                      <p className="text-[13px] font-medium text-slate-400 mt-0.5">{schedule.type}</p>
                    </div>
                  </div>
                  <ChevronRightIcon />
                </div>
              ))}
            </div>
          )}
        </SectionContainer>

        {/* 3. 오늘 할 일 섹션 */}
        <SectionContainer title="오늘 할 일" linkTo="/todos">
          {tasks.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">오늘 등록된 할 일이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const badgeStyle = 
                  task.badgeType === 'danger' ? 'bg-red-50 text-red-500' : 
                  task.badgeType === 'primary' ? 'bg-blue-50 text-blue-500' : 
                  'bg-slate-100 text-slate-400';

                return (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-center space-x-5">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] transition-colors ${
                        task.isDone ? 'bg-teal-50 border-teal-400' : 'border-slate-300 bg-white'
                      }`}>
                        {task.isDone && (
                          <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-[15px] transition-all ${
                          task.isDone ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-[13px] font-medium text-slate-400 mt-0.5">{task.date}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${badgeStyle}`}>
                      {task.badge}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionContainer>

      </div>
    </div>
  );
}

// 재사용 컴포넌트들
function SectionContainer({ title, linkTo, children }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-7 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold text-slate-900">{title}</h2>
        <Link to={linkTo} className="text-sm font-semibold text-[#8dc63f] hover:text-[#7bb034] transition-colors flex items-center">
          전체보기 <span className="ml-1">→</span>
        </Link>
      </div>
      {children}
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default DashboardPage;



// [초기 버전] 가상의 데이터로 UI 레이아웃과 인터랙션을 먼저 구현한 코드

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// function DashboardPage() {
//   // 가상의 데이터 (추후 백엔드 API 연동 시 이 부분을 상태(State)로 교체하면 됩니다)
//   const projects = [
//     { id: 1, title: '포트폴리오 관리 시스템', dotColor: 'bg-lime-500', done: 16, total: 24 },
//     { id: 2, title: 'AI 챗봇 프로젝트', dotColor: 'bg-blue-400', done: 7, total: 18 },
//     { id: 3, title: '모바일 앱 개발', dotColor: 'bg-lime-500', done: 32, total: 32 },
//   ];

//   const schedules = [
//     { id: 1, hour: '14', min: '00', title: '디자인 리뷰 미팅', type: 'Meeting' },
//     { id: 2, hour: '17', min: '00', title: '개발 스프린트 종료', type: 'Deadline' },
//   ];

//   // 할 일 상태 관리를 위한 임시 State (체크박스 클릭 효과용)
//   const [tasks, setTasks] = useState([
//     { id: 1, title: 'UI 컴포넌트 개발', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
//     { id: 2, title: '테스트 코드 작성', date: '2026-04-12', isDone: true, badge: '지남', badgeType: 'default' },
//     { id: 3, title: '회의록 정리', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
//     { id: 4, title: '보안 검토 완료', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
//   ]);

//   const toggleTask = (id) => {
//     setTasks(tasks.map(task => 
//       task.id === id ? { ...task, isDone: !task.isDone } : task
//     ));
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-8 font-sans">
      
//       {/* 페이지 헤더 */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">대시보드</h1>
//         <p className="mt-2 text-slate-400 font-medium">오늘의 일정과 진행중인 작업을 확인하세요</p>
//       </div>

//       <div className="space-y-6">
        
//         {/* 1. 진행중인 프로젝트 섹션 */}
//         <SectionContainer title="진행중인 프로젝트" linkTo="/projects">
//           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
//             {projects.map((project) => (
//               <div 
//                 key={project.id} 
//                 className="flex-1 min-w-[260px] bg-[#f8fafc] rounded-2xl p-5 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group"
//               >
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center space-x-3">
//                     <span className={`w-2.5 h-2.5 rounded-full ${project.dotColor}`}></span>
//                     <h3 className="font-semibold text-slate-800 text-[15px]">{project.title}</h3>
//                   </div>
//                   <ChevronRightIcon />
//                 </div>
//                 <div className="flex items-center text-[13px] font-medium text-slate-500">
//                   <span>할일 <span className="text-slate-800 font-bold ml-1">{project.done}/{project.total}</span></span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </SectionContainer>

//         {/* 2. 오늘의 일정 섹션 */}
//         <SectionContainer title="오늘의 일정" linkTo="/calendar">
//           <div className="space-y-3">
//             {schedules.map((schedule) => (
//               <div 
//                 key={schedule.id}
//                 className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group"
//               >
//                 <div className="flex items-center space-x-6">
//                   <div className="flex flex-col items-center justify-center w-10 text-[#8dc63f]">
//                     <span className="text-2xl font-extrabold leading-none">{schedule.hour}</span>
//                     <span className="text-xs font-semibold mt-1">{schedule.min}</span>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-slate-800">{schedule.title}</h3>
//                     <p className="text-[13px] font-medium text-slate-400 mt-0.5">{schedule.type}</p>
//                   </div>
//                 </div>
//                 <ChevronRightIcon />
//               </div>
//             ))}
//           </div>
//         </SectionContainer>

//         {/* 3. 오늘 할 일 섹션 */}
//         <SectionContainer title="오늘 할 일" linkTo="/todos">
//           <div className="space-y-3">
//             {tasks.map((task) => (
//               <div 
//                 key={task.id}
//                 className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
//                 onClick={() => toggleTask(task.id)}
//               >
//                 <div className="flex items-center space-x-5">
//                   {/* 커스텀 체크박스 */}
//                   <div className={`flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] transition-colors ${
//                     task.isDone ? 'bg-teal-50 border-teal-400' : 'border-slate-300 bg-white'
//                   }`}>
//                     {task.isDone && (
//                       <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                       </svg>
//                     )}
//                   </div>
                  
//                   {/* 할 일 텍스트 */}
//                   <div>
//                     <h3 className={`font-semibold text-[15px] transition-all ${
//                       task.isDone ? 'text-slate-400 line-through' : 'text-slate-800'
//                     }`}>
//                       {task.title}
//                     </h3>
//                     <p className="text-[13px] font-medium text-slate-400 mt-0.5">{task.date}</p>
//                   </div>
//                 </div>

//                 {/* 뱃지 (D-Day, 지남 등) */}
//                 <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${
//                   task.badgeType === 'danger' 
//                     ? 'bg-red-50 text-red-500' 
//                     : 'bg-slate-100 text-slate-400'
//                 }`}>
//                   {task.badge}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </SectionContainer>

//       </div>
//     </div>
//   );
// }

// // 중복되는 섹션 레이아웃(하얀색 박스 및 타이틀)을 감싸주는 재사용 컴포넌트
// function SectionContainer({ title, linkTo, children }) {
//   return (
//     <div className="bg-white rounded-[1.5rem] p-7 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
//       <div className="flex items-center justify-between mb-5">
//         <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
//         <Link 
//           to={linkTo} 
//           className="text-sm font-semibold text-[#8dc63f] hover:text-[#7bb034] transition-colors flex items-center"
//         >
//           전체보기 <span className="ml-1">→</span>
//         </Link>
//       </div>
//       {children}
//     </div>
//   );
// }

// // 우측 화살표 아이콘 재사용 컴포넌트
// function ChevronRightIcon() {
//   return (
//     <svg 
//       className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" 
//       fill="none" 
//       viewBox="0 0 24 24" 
//       stroke="currentColor" 
//       strokeWidth={2}
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//     </svg>
//   );
// }

// export default DashboardPage;