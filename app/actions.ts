"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

// Todo 생성
export async function createTodo(text: string, date: string) {
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, date }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "생성에 실패했습니다.");
  }

  revalidatePath("/todos");
  return res.json();
}

// Todo 수정
export async function updateTodo(
  id: number,
  data: { text?: string; date?: string; completed?: boolean }
) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "수정에 실패했습니다.");
  }

  revalidatePath("/todos");
  return res.json();
}

// Todo 삭제
export async function deleteTodo(id: number) {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    const error = await res.json();
    throw new Error(error.detail || "삭제에 실패했습니다.");
  }

  revalidatePath("/todos");
}
