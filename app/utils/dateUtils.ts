// 날짜 포맷 함수 (YYYY.MM.DD)
export function formatFullDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

// 날짜를 ISO 형식 (YYYY-MM-DD) 문자열로 변환
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 해당 날짜의 시간 00:00:00으로 초기화한 복사본 반환
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

// 기준 날짜의 월요일 날짜 계산
export function getMonday(date: Date): Date {
  const newDate = getStartOfDay(date);
  const dayOfWeek = newDate.getDay(); // 0(일) ~ 6(토)
  const diffToMonday =
    newDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  newDate.setDate(diffToMonday);
  return newDate;
}
