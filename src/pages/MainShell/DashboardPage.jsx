import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../data/apiClient';

const DASHBOARD_TODO_LIMIT = 4;

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getTomorrowDateKey = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDateKey(tomorrow);
};

const getScheduleTypeLabel = (type) => {
  const typeLabels = {
    meeting: '회의',
    deadline: '마감일',
    presentation: '발표',
    other: '기타',
  };

  return typeLabels[type] || '일정';
};

const buildDashboardTask = (todo) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${todo.due_date}T00:00:00`);
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
    id: todo.id,
    title: todo.title,
    date: todo.due_date,
    isDone: todo.status === 'done',
    status: todo.status,
    badge,
    badgeType,
  };
};

const sortTasksByCompletion = (tasks) =>
  [...tasks].sort((a, b) => Number(a.isDone) - Number(b.isDone));

const fetchTodosByStatus = async ({ todayKey, status, pageSize }) => {
  const response = await apiClient.get('/api/todos/', {
    params: {
      due_date: todayKey,
      status,
      ordering: 'due_date',
      page_size: pageSize,
    },
  });

  return response.data.results.map(buildDashboardTask);
};

const fetchDashboardTasks = async (todayKey) => {
  const inProgressTasks = await fetchTodosByStatus({
    todayKey,
    status: 'in_progress',
    pageSize: DASHBOARD_TODO_LIMIT,
  });
  const remainingCount = DASHBOARD_TODO_LIMIT - inProgressTasks.length;
  const doneTasks =
    remainingCount > 0
      ? await fetchTodosByStatus({
          todayKey,
          status: 'done',
          pageSize: remainingCount,
        })
      : [];

  return [...inProgressTasks, ...doneTasks];
};

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
      const todayKey = formatDateKey(new Date());

      try {
        const projectRes = await apiClient.get('/api/projects/', {
          params: {
            page_size: 8,
          },
        });
        const projectData = projectRes.data.results
          .filter((p) => p.status === 'inProgress')
          .map((p) => ({
            id: p.id,
            title: p.name,
            dotColor: getTailwindColor(p.colorKey),
            done: p.completedTodoCount,
            total: p.todoCount,
          }))
          .slice(0, 4);
        setProjects(projectData);
      } catch (error) {
        console.error('프로젝트 데이터를 불러오는데 실패했습니다.', error);
        setProjects([]);
      }

      try {
        const scheduleRes = await apiClient.get('/api/schedules/', {
          params: {
            start: todayKey,
            end: getTomorrowDateKey(),
            ordering: 'start_datetime',
            page_size: 3,
          },
        });
        const scheduleData = scheduleRes.data.results.map((s) => {
          const dateObj = new Date(s.start_datetime);
          const hour = String(dateObj.getHours()).padStart(2, '0');
          const min = String(dateObj.getMinutes()).padStart(2, '0');

          return {
            id: s.id,
            hour: hour,
            min: min,
            title: s.title,
            type: getScheduleTypeLabel(s.type),
          };
        });
        setSchedules(scheduleData);
      } catch (error) {
        console.error('일정 데이터를 불러오는데 실패했습니다.', error);
        setSchedules([]);
      }

      try {
        const dashboardTasks = await fetchDashboardTasks(todayKey);
        setTasks(dashboardTasks);
      } catch (error) {
        console.error('오늘 할 일 데이터를 불러오는데 실패했습니다.', error);
        setTasks([]);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleTask = async (id) => {
    const targetTask = tasks.find(t => t.id === id);
    if (!targetTask) return;

    const newStatus = targetTask.isDone ? 'in_progress' : 'done';

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map(task => 
        task.id === id ? { ...task, isDone: !task.isDone, status: newStatus } : task
      );
      return sortTasksByCompletion(updatedTasks);
    });

    try {
      await apiClient.patch(`/api/todos/${id}/`, { status: newStatus });

      const refreshedTasks = await fetchDashboardTasks(formatDateKey(new Date()));
      setTasks(refreshedTasks);
    } catch (error) {
      console.error('할 일 상태 업데이트 실패', error);

      alert('상태 업데이트에 실패했습니다. 다시 시도해 주세요.');
      setTasks((prevTasks) => {
        const rolledBackTasks = prevTasks.map(task => 
          task.id === id
            ? { ...task, isDone: targetTask.isDone, status: targetTask.status }
            : task
        );
        return sortTasksByCompletion(rolledBackTasks);
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

        <SectionContainer title="오늘 할 일" linkTo="/calendar#todos">
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

function SectionContainer({ title, linkTo, children }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-7 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold text-slate-900">{title}</h2>
        <Link to={linkTo} className="text-sm font-semibold text-[#3A3A3A] hover:text-[#000000] transition-colors flex items-center">
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
