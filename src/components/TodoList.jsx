import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onToggleComplete, onDelete, onUpdate }) {
    if (todos.length === 0) {
        return <div className="text-center text-[#a0a0a0] py-4">표시할 할 일이 없습니다.</div>;
    }

    return (
        <section>
            <ul className="list-none p-0 m-0">
                {todos.map(todo => (
                    <TodoItem 
                        key={todo.id} 
                        todo={todo}
                        onToggleComplete={onToggleComplete}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </ul>
        </section>
    );
}

export default TodoList;
