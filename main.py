from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
import os

from dotenv import load_dotenv

load_dotenv(".env.local")

# DB 설정
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    text = Column(String, nullable=False)
    date = Column(String, nullable=False)
    completed = Column(Boolean, default=False)





# Pydantic 스키마 (요청/응답 데이터 구조 정의)
class TodoCreate(BaseModel):
    text: str
    date: str  #YYYY-MM-DD
    completed: bool = False

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("할 일 내용은 비어 있을 수 없습니다.")
        return v.strip()

    @field_validator("date")
    @classmethod
    def date_must_be_iso_format(cls, v: str) -> str:
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("날짜는 YYYY-MM-DD 형식이어야 합니다.")
        return v


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    date: Optional[str] = None
    completed: Optional[bool] = None

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("할 일 내용은 비어 있을 수 없습니다.")
        return v.strip() if v is not None else v

    @field_validator("date")
    @classmethod
    def date_must_be_iso_format(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError("날짜는 YYYY-MM-DD 형식이어야 합니다.")
        return v


class TodoResponse(BaseModel):
    id: int
    text: str
    date: str
    completed: bool

    model_config = {"from_attributes": True}


# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI(title="Todo API")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 프론트엔드
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB 세션 의존성

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 엔드포인트 구현

# GET /todos — 전체 Todo 목록 조회 (필터/검색 포함)
@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter: Optional[str] = Query(None, description="filter: active or completed"),
    search: Optional[str] = Query(None, description="Search Keyword"),
    db: Session = Depends(get_db),
):
    query = db.query(Todo)

    # 상태별 필터링
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)

    # 키워드 검색
    if search:
        query = query.filter(Todo.text.contains(search))

    return query.order_by(Todo.id.desc()).all()


# POST /todos — 새 Todo 생성
@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
):
    db_todo = Todo(
        text=todo.text,
        date=todo.date,
        completed=todo.completed,
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


# PUT /todos/{id} — Todo 수정
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    db: Session = Depends(get_db),
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not Found.")

    update_data = todo.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_todo, key, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


# DELETE /todos/{id} — Todo 삭제
@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not Found.")

    db.delete(db_todo)
    db.commit()
    return None