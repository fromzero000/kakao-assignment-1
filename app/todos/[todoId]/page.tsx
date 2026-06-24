import EditTodoForm from "./EditTodoForm";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

type Todo = {
  id: number;
  text: string;
  date: string;
  completed: boolean;
};

async function getTodo(id: string): Promise<Todo> {
  // 전체 목록에서 해당 id를 찾음 (단건 조회 API가 없으므로)
  const res = await fetch(`${BACKEND_URL}/todos`, { cache: "no-store" });
  if (!res.ok) throw new Error("Todo를 불러오지 못했습니다.");

  const todos: Todo[] = await res.json();
  const todo = todos.find((t) => t.id === Number(id));
  if (!todo) throw new Error("해당 Todo를 찾을 수 없습니다.");

  return todo;
}

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodo(todoId);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <EditTodoForm todo={todo} />
      </div>
    </div>
  );
}
