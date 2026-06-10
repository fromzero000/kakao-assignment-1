import React, { useState, useRef, useEffect } from 'react';

function TodoItem({ todo, onToggleComplete, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [editError, setEditError] = useState('');
    const inputRef = useRef(null);

    // 수정 모드 진입 시 포커스 이동
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleEditStart = () => {
        setIsEditing(true);
        setEditText(todo.text);
        setEditError('');
    };

    const handleSave = () => {
        const trimmed = editText.trim();
        if (trimmed === '') {
            setEditError('수정할 내용을 입력해주세요.');
            return;
        }
        setEditError('');
        onUpdate(todo.id, trimmed);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <li className={`flex justify-between items-center p-4 bg-[#fafafa] rounded-lg mb-3 border border-[#eee] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${todo.completed ? 'completed' : ''}`}>
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
                    <span className={`text-base break-all transition-colors ${todo.completed ? 'line-through text-[#a0a0a0]' : ''}`}>
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

export default TodoItem;
