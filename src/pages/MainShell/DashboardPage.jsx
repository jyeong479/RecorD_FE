import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
  // 가상의 데이터 (추후 백엔드 API 연동 시 이 부분을 상태(State)로 교체하면 됩니다)
  const projects = [
    { id: 1, title: '포트폴리오 관리 시스템', dotColor: 'bg-lime-500', done: 16, total: 24 },
    { id: 2, title: 'AI 챗봇 프로젝트', dotColor: 'bg-blue-400', done: 7, total: 18 },
    { id: 3, title: '모바일 앱 개발', dotColor: 'bg-lime-500', done: 32, total: 32 },
  ];

  const schedules = [
    { id: 1, hour: '14', min: '00', title: '디자인 리뷰 미팅', type: 'Meeting' },
    { id: 2, hour: '17', min: '00', title: '개발 스프린트 종료', type: 'Deadline' },
  ];

  // 할 일 상태 관리를 위한 임시 State (체크박스 클릭 효과용)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'UI 컴포넌트 개발', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
    { id: 2, title: '테스트 코드 작성', date: '2026-04-12', isDone: true, badge: '지남', badgeType: 'default' },
    { id: 3, title: '회의록 정리', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
    { id: 4, title: '보안 검토 완료', date: '2026-04-15', isDone: false, badge: 'D-Day', badgeType: 'danger' },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isDone: !task.isDone } : task
    ));
  };

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">대시보드</h1>
        <p className="mt-2 text-slate-400 font-medium">오늘의 일정과 진행 중인 작업을 확인하세요</p>
      </div>

      <div className="space-y-6">
        
        {/* 1. 진행 중인 프로젝트 섹션 */}
        <SectionContainer title="진행 중인 프로젝트" linkTo="/projects">
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
                  <span>할일 <span className="text-slate-800 font-bold ml-1">{project.done}/{project.total}</span></span>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>

        {/* 2. 오늘의 일정 섹션 */}
        <SectionContainer title="오늘의 일정" linkTo="/calendar">
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
        </SectionContainer>

        {/* 3. 오늘 할 일 섹션 */}
        <SectionContainer title="오늘 할 일" linkTo="/todos">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between bg-[#f8fafc] rounded-2xl p-4 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center space-x-5">
                  {/* 커스텀 체크박스 */}
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] transition-colors ${
                    task.isDone ? 'bg-teal-50 border-teal-400' : 'border-slate-300 bg-white'
                  }`}>
                    {task.isDone && (
                      <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* 할 일 텍스트 */}
                  <div>
                    <h3 className={`font-semibold text-[15px] transition-all ${
                      task.isDone ? 'text-slate-400 line-through' : 'text-slate-800'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-400 mt-0.5">{task.date}</p>
                  </div>
                </div>

                {/* 뱃지 (D-Day, 지남 등) */}
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide ${
                  task.badgeType === 'danger' 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {task.badge}
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>

      </div>
    </div>
  );
}

// 중복되는 섹션 레이아웃(하얀색 박스 및 타이틀)을 감싸주는 재사용 컴포넌트
function SectionContainer({ title, linkTo, children }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-7 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
        <Link 
          to={linkTo} 
          className="text-sm font-semibold text-[#8dc63f] hover:text-[#7bb034] transition-colors flex items-center"
        >
          전체보기 <span className="ml-1">→</span>
        </Link>
      </div>
      {children}
    </div>
  );
}

// 우측 화살표 아이콘 재사용 컴포넌트
function ChevronRightIcon() {
  return (
    <svg 
      className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default DashboardPage;