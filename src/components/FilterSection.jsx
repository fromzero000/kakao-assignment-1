import React from 'react';

function FilterSection({ currentFilter, onFilterChange }) {
    const filters = [
        { id: 'all', label: '전체' },
        { id: 'active', label: '진행중' },
        { id: 'completed', label: '완료' },
    ];

    return (
        <section className="flex gap-2 mb-5 border-b border-[#eee] pb-3">
            {filters.map(filter => {
                const isActive = currentFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`border-none text-sm font-medium cursor-pointer px-3 py-2 rounded-md transition-all ${
                            isActive 
                            ? 'text-white bg-primary shadow-[0_4px_8px_rgba(103,43,224,0.15)]' 
                            : 'text-[#a0a0a0] bg-transparent hover:bg-[#f0f0f0]'
                        }`}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </section>
    );
}

export default FilterSection;
