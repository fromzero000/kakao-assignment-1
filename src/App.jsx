import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeekNavigation from './components/WeekNavigation';
import TodoInput from './components/TodoInput';
import FilterSection from './components/FilterSection';
import TodoList from './components/TodoList';
import { getStartOfDay, getMonday } from './utils/dateUtils';

function App() {
    // 1. 상태 관리
    const [selectedDate, setSelectedDate] = useState(getStartOfDay(new Date()));
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
    const [filter, setFilter] = useState('all');
    
    // 로컬 스토리지 초기화 및 레거시 데이터 호환성 보정
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // 구 버전(vanilla) 데이터 호환성: id가 없으면 생성해 줌
                return parsed.map((item, index) => ({
                    ...item,
                    id: item.id || Date.now().toString() + index // 고유 ID 부여
                }));
            } catch (e) {
                console.error("Failed to parse todos from localStorage", e);
            }
        }
        return [];
    });

    // 상태 변경 시 로컬 스토리지 자동 저장
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // 2. 핸들러 함수들
    const handleDateSelect = (date) => {
        setSelectedDate(getStartOfDay(date));
    };

    const handlePrevWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(currentWeekStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(currentWeekStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleAddTodo = (text) => {
        const newTodo = {
            id: Date.now().toString(),
            text,
            date: selectedDate.toDateString(),
            completed: false
        };
        setTodos(prev => [...prev, newTodo]);
    };

    const handleToggleComplete = (id) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleDelete = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleUpdate = (id, newText) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        ));
    };

    // 3. 필터링 로직
    const getFilteredTodos = () => {
        const dateStr = selectedDate.toDateString();
        
        // 날짜 필터링
        let filtered = todos.filter(todo => todo.date === dateStr);

        // 상태 필터링
        if (filter === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        return filtered;
    };

    return (
        <main className="bg-white w-full max-w-120 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-7.5">
            <Header currentWeekStart={currentWeekStart} />
            <WeekNavigation 
                selectedDate={selectedDate}
                currentWeekStart={currentWeekStart}
                todos={todos}
                onDateSelect={handleDateSelect}
                onPrevWeek={handlePrevWeek}
                onNextWeek={handleNextWeek}
            />
            <TodoInput onAddTodo={handleAddTodo} />
            <FilterSection currentFilter={filter} onFilterChange={handleFilterChange} />
            <TodoList 
                todos={getFilteredTodos()}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </main>
    );
}

export default App;
