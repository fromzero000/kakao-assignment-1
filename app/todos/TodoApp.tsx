"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formatFullDate,
  toISODateString,
  getStartOfDay,
  getMonday,
} from "../utils/dateUtils";

type Todo = {
  id: number;
  text: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean;
};

// ─── Header ──────────────────────────────────────────────────────

function Header({ currentWeekStart }: { currentWeekStart: Date }) {
  const endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(currentWeekStart.getDate() + 6);

  return (
    <header className="mb-4">
      <h1 className="text-2xl text-center text-[#222] font-bold mb-2">
        TODO List
      </h1>
      <div className="text-center text-[21px] text-[#3b3386] font-medium border border-[#eee] rounded-lg bg-[#c4bffd] py-2">
        {formatFullDate(currentWeekStart)} ~ {formatFullDate(endOfWeek)}
      </div>
    </header>
  );
}

// ─── WeekNavigation ──────────────────────────────────────────────

const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

function WeekNavigation({
  selectedDate,
  currentWeekStart,
  todos,
  onDateSelect,
  onPrevWeek,
  onNextWeek,
}: {
  selectedDate: Date;
  currentWeekStart: Date;
  todos: Todo[];
  onDateSelect: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) {
  const today = getStartOfDay(new Date());

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const iterDate = new Date(currentWeekStart);
    iterDate.setDate(currentWeekStart.getDate() + i);
    days.push(iterDate);
  }

  const getTodoCountForDate = (date: Date) => {
    const dateStr = toISODateString(date);
    return todos.filter((todo) => todo.date === dateStr).length;
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
          const isSelected =
            toISODateString(iterDate) === toISODateString(selectedDate);
          const isToday =
            toISODateString(iterDate) === toISODateString(today);
          const todoCount = getTodoCountForDate(iterDate);

          return (
            <div
              key={toISODateString(iterDate)}
              onClick={() => onDateSelect(iterDate)}
              className={`flex flex-col items-center cursor-pointer p-1.5 rounded-lg transition-colors min-w-11.25 hover:bg-primary-lighter ${
                isSelected ? "bg-primary-light" : ""
              }`}
            >
              <span
                className={`text-xs mb-1 ${
                  isSelected ? "text-primary font-bold" : "text-[#a0a0a0]"
                }`}
              >
                {dayNames[index]}
              </span>
              <span
                className={`text-base mb-1 ${
                  isSelected
                    ? "text-primary font-bold"
                    : "text-[#555] font-medium"
                } ${
                  isToday
                    ? "underline decoration-primary decoration-2 underline-offset-4"
                    : ""
                }`}
              >
                {iterDate.getDate()}
              </span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-[10px] min-w-5 text-center ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-[#eee] text-[#666]"
                }`}
              >
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

// TodoInput

function TodoInput({ onAddTodo }: { onAddTodo: (text: string) => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (trimmed === "") {
      setError("할 일을 입력해주세요.");
      return;
    }
    setError("");
    onAddTodo(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <section className="mb-2.5">
      <div className="flex gap-2.5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 할 일을 입력하세요..."
          className="flex-1 px-4 py-3 text-base border-2 border-[#e0e0e0] rounded-lg outline-none transition-colors focus:border-primary"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-3 text-base font-semibold bg-primary text-white border-none rounded-lg cursor-pointer transition-colors hover:bg-primary-hover"
        >
          추가
        </button>
      </div>
      {error && (
        <div className="text-[#e74c3c] text-[13px] mt-1.5 pl-1.5">
          {error}
        </div>
      )}
    </section>
  );
}

// FilterSection

function FilterSection({
  currentFilter,
  onFilterChange,
}: {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { id: "all", label: "전체" },
    { id: "active", label: "진행중" },
    { id: "completed", label: "완료" },
  ];

  return (
    <section className="flex gap-2 mb-5 border-b border-[#eee] pb-3">
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`border-none text-sm font-medium cursor-pointer px-3 py-2 rounded-md transition-all ${
              isActive
                ? "text-white bg-primary shadow-[0_4px_8px_rgba(103,43,224,0.15)]"
                : "text-[#a0a0a0] bg-transparent hover:bg-[#f0f0f0]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </section>
  );
}

// SearchSection

function SearchSection({
  currentSearch,
  onSearchChange,
}: {
  currentSearch: string;
  onSearchChange: (search: string) => void;
}) {
  return (
    <section className="mb-4">
      <input
        type="text"
        placeholder="할 일 검색..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const value = e.target.value;
          const timer = setTimeout(() => {
            onSearchChange(value);
          }, 300);
          return () => clearTimeout(timer);
        }}
        className="w-full px-4 py-2.5 text-base border-2 border-[#e0e0e0] rounded-lg outline-none transition-colors focus:border-primary"
      />
    </section>
  );
}

// TodoItem

function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onUpdate,
}: {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editError, setEditError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditError("");
  };

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed === "") {
      setEditError("수정할 내용을 입력해주세요.");
      return;
    }
    setEditError("");
    onUpdate(todo.id, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <li
      className={`flex justify-between items-center p-4 bg-[#fafafa] rounded-lg mb-3 border border-[#eee] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]`}
    >
      {isEditing ? (
        <div className="flex flex-col flex-1 mr-3">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2.5 py-1.5 text-base border border-primary rounded outline-none"
          />
          {editError && (
            <div className="text-[#e74c3c] text-[13px] mt-1 pl-1">
              {editError}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center flex-1 overflow-hidden gap-3 mr-3">
          <span
            className={`text-base break-all transition-colors ${
              todo.completed ? "line-through text-[#a0a0a0]" : ""
            }`}
          >
            {todo.text}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-2.5 py-1.5 text-[13px] border-none rounded-md cursor-pointer font-medium transition-all bg-primary text-white hover:bg-primary-hover"
          >
            저장
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggleComplete(todo.id)}
              className="px-2.5 py-1.5 text-[13px] border-none rounded-md cursor-pointer font-medium transition-all bg-[rgba(39,174,96,0.1)] text-[#27ae60] hover:bg-[rgba(39,174,96,0.2)]"
            >
              완료
            </button>
            <button
              onClick={handleEditStart}
              className="px-2.5 py-1.5 text-[13px] border-none rounded-md cursor-pointer font-medium transition-all bg-[rgba(243,156,18,0.1)] text-[#f39c12] hover:bg-[rgba(243,156,18,0.2)]"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-2.5 py-1.5 text-[13px] border-none rounded-md cursor-pointer font-medium transition-all bg-[rgba(231,76,60,0.1)] text-[#e74c3c] hover:bg-[rgba(231,76,60,0.2)]"
            >
              삭제
            </button>
          </>
        )}
      </div>
    </li>
  );
}

// TodoApp (메인)

export default function TodoApp({
  initialTodos,
}: {
  initialTodos: Todo[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [selectedDate, setSelectedDate] = useState(getStartOfDay(new Date()));
  const [currentWeekStart, setCurrentWeekStart] = useState(
    getMonday(new Date())
  );

  // URL 파라미터에서 필터 및 검색 상태 읽기
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";

  // 서버에서 새 데이터가 오면 반영
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  // 날짜 핸들러

  const handleDateSelect = (date: Date) => {
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

  // 필터 핸들러 (URL 파라미터 업데이트)

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", newFilter);
    }
    const query = params.toString();
    router.push(`/todos${query ? `?${query}` : ""}`);
  };

  const handleSearchChange = (newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    router.push(`/todos${query ? `?${query}` : ""}`);
  };

  // CRUD 핸들러 (API 호출)

  const handleAddTodo = async (text: string) => {
    const date = toISODateString(selectedDate);
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date }),
    });
    if (res.ok) {
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      router.refresh();
    }
  };

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !todo.completed }),
    });
    if (res.ok) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    }
  };

  const handleUpdate = async (id: number, newText: string) => {
    const res = await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: newText }),
    });
    if (res.ok) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
      );
      router.refresh();
    }
  };

  // 필터링 로직 (클라이언트)

  const getFilteredTodos = () => {
    const dateStr = toISODateString(selectedDate);

    // 상태 및 검색어 필터링은 서버(Backend)에서 이미 처리하여 전달됨.
    // 여기서는 선택한 '날짜'에 해당하는 항목만 뷰에 표시하도록 클라이언트 필터링.
    return todos.filter((todo) => todo.date === dateStr);
  };

  const filteredTodos = getFilteredTodos();

  return (
    <>
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
      <FilterSection
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />
      <SearchSection
        currentSearch={search}
        onSearchChange={handleSearchChange}
      />

      {/* TodoList */}
      {filteredTodos.length === 0 ? (
        <div className="text-center text-[#a0a0a0] py-4">
          표시할 할 일이 없습니다.
        </div>
      ) : (
        <section>
          <ul className="list-none p-0 m-0">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
