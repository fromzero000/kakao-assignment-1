import TodoApp from "./TodoApp";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type Todo = {
  id: number;
  text: string;
  date: string;
  completed: boolean;
};

async function getTodos(filter?: string, search?: string): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (filter && filter !== "all") params.set("filter", filter);
  if (search) params.set("search", search);

  const queryString = params.toString();
  const url = `${BACKEND_URL}/todos${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo 목록을 불러오지 못했습니다.");
  return res.json();
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;
  const search = params.search;
  const todos = await getTodos(filter, search);

  return (
    <main className="bg-white w-full max-w-120 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-7.5">
      <TodoApp initialTodos={todos} />
    </main>
  );
}
