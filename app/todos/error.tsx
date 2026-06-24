"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-white w-full max-w-120 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-7.5">
      <header className="mb-4">
        <h1 className="text-2xl text-center text-[#222] font-bold mb-2">
          TODO List
        </h1>
      </header>
      <div className="text-center py-8">
        <p className="text-[#e74c3c] text-base mb-4">
          {error.message || "문제가 발생했습니다."}
        </p>
        <button
          onClick={reset}
          className="px-5 py-3 text-base font-semibold bg-primary text-white border-none rounded-lg cursor-pointer transition-colors hover:bg-primary-hover"
        >
          다시 시도
        </button>
      </div>
    </main>
  );
}
