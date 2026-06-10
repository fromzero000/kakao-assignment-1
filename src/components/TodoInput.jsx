import React, { useState } from 'react';

function TodoInput({ onAddTodo }) {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        const trimmed = text.trim();
        if (trimmed === '') {
            setError('할 일을 입력해주세요.');
            return;
        }
        setError('');
        onAddTodo(trimmed);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
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

export default TodoInput;
