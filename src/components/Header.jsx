import React from 'react';
import { formatFullDate } from '../utils/dateUtils';

function Header({ currentWeekStart }) {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(currentWeekStart.getDate() + 6);

    const startOfWeekStr = formatFullDate(currentWeekStart);
    const endOfWeekStr = formatFullDate(endOfWeek);

    return (
        <header className="mb-4">
            <h1 className="text-2xl text-center text-[#222] font-bold mb-2">TODO List</h1>
            <div className="text-center text-[21px] text-[#3b3386] font-medium border border-[#eee] rounded-lg bg-[#c4bffd] py-2">
                {startOfWeekStr} ~ {endOfWeekStr}
            </div>
        </header>
    );
}

export default Header;
