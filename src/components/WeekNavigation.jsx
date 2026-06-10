import React from 'react';
import { getStartOfDay } from '../utils/dateUtils';

const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

function WeekNavigation({ selectedDate, currentWeekStart, todos, onDateSelect, onPrevWeek, onNextWeek }) {
    const today = getStartOfDay(new Date());

    const days = [];
    for (let i = 0; i < 7; i++) {
        const iterDate = new Date(currentWeekStart);
        iterDate.setDate(currentWeekStart.getDate() + i);
        days.push(iterDate);
    }

    const getTodoCountForDate = (date) => {
        const dateStr = date.toDateString();
        return todos.filter(todo => todo.date === dateStr).length;
    };

    return (
        <section className="flex justify-between items-center mb-5 pb-4 border-b border-[#eee]">
            <button 
                onClick={onPrevWeek} 
                className="bg-transparent border-none text-lg font-bold text-primary cursor-pointer px-3 py-2 rounded-lg transition-colors hover:bg-primary-light"
            >
                &lt;
            </button>
            <div className="flex justify-between flex-1 px-2.5">
                {days.map((iterDate, index) => {
                    const isSelected = iterDate.toDateString() === selectedDate.toDateString();
                    const isToday = iterDate.toDateString() === today.toDateString();
                    const todoCount = getTodoCountForDate(iterDate);

                    return (
                        <div 
                            key={iterDate.toDateString()}
                            onClick={() => onDateSelect(iterDate)}
                            className={`flex flex-col items-center cursor-pointer p-1.5 rounded-lg transition-colors min-w-11.25 hover:bg-primary-lighter ${isSelected ? 'bg-primary-light' : ''}`}
                        >
                            <span className={`text-xs mb-1 ${isSelected ? 'text-primary font-bold' : 'text-[#a0a0a0]'}`}>
                                {dayNames[index]}
                            </span>
                            <span className={`text-base mb-1 ${isSelected ? 'text-primary font-bold' : 'text-[#555] font-medium'} ${isToday ? 'underline decoration-primary decoration-2 underline-offset-4' : ''}`}>
                                {iterDate.getDate()}
                            </span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-[10px] min-w-5 text-center ${isSelected ? 'bg-primary text-white' : 'bg-[#eee] text-[#666]'}`}>
                                {todoCount}
                            </span>
                        </div>
                    );
                })}
            </div>
            <button 
                onClick={onNextWeek} 
                className="bg-transparent border-none text-lg font-bold text-primary cursor-pointer px-3 py-2 rounded-lg transition-colors hover:bg-primary-light"
            >
                &gt;
            </button>
        </section>
    );
}

export default WeekNavigation;
