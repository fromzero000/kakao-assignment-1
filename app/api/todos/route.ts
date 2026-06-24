import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

// GET /api/todos → FastAPI GET /todos
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.toString();
  const url = `${BACKEND_URL}/todos${query ? `?${query}` : ""}`;

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// POST /api/todos → FastAPI POST /todos
export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// PUT /api/todos → FastAPI PUT /todos/{id}
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updateData } = body;

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/todos?id=123 → FastAPI DELETE /todos/{id}
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "DELETE",
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
