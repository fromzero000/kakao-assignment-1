"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTodoPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [date, setDate] = useState(() => {
    // 오늘 날짜를 기본값으로 (YYYY-MM-DD)
    return new Date().toISOString().split("T")[0];
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), date }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "생성에 실패했습니다.");
      }

      router.push("/todos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            href="/todos"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← 목록으로
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            새 할 일 추가
          </h1>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="text"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              할 일
            </label>
            <input
              id="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="할 일을 입력하세요"
              autoFocus
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              날짜
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
            >
              {isSubmitting ? "추가 중..." : "추가"}
            </button>
            <Link
              href="/todos"
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
