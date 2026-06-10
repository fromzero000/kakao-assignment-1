# TODO Application : Migration from Vanilla JS to React


## 1. 프로젝트 개요
- 프로젝트 설명 : Vanilla JS로 개발한 TODO 앱
- 활용 스택 : HTML, CSS, Vanilla JS, Web Storage API (localStorage)

## 2. 기존 프로그램의 디렉토리 구조

```
todo-vanilla/
├── index.html	— HTML 구조
├── style.css     — 스타일
└── app.js	— 전체 로직
```

## 2-1. 수정 방향

```
src/components
├── Header.jsx
├── WeekNavigation.jsx
├── FilterSection.jsx
├── TodoInput.jsx
├── TodoList.jsx
└── TodoItem.jsx
```

- 모든 로직이 app.js에 구현되어 있음 => 컴포넌트 별로 분리하고 개별 파일에서 정의해야 함
- 개별 TODO의 '완료', '수정', '삭제' 버튼마다 eventListener를 붙이고 있음 => 부모 요소 한 곳에서 클릭을 모아 처리(이벤트 위임)하게 변경해야 함

## 3. 기능 명세
### 3-1. TODO CRUD (형식 : 동작 -> 결과 )
- TODO 추가 : 입력창에 텍스트 입력후 Enter 혹은 '추가'버튼 클릭 -> TODO 항목을 TODO 배열에 추가
- TODO 읽기 : 페이지 로드 시 localStorage에서 선택된 날짜에 해당하는 TODO 목록 복원해서 표시
- TODO 갱신1 : '수정' 버튼 클릭 -> 인라인 입력창에 텍스트 변경후 Enter 혹은 '저장'버튼 클릭
- TODO 갱신2 : '완료' 버튼 클릭 -> 완료 / 미완료 상태 전환
- TODO 삭제 : '삭제' 버튼 클릭 -> TODO 목록에서 제거

#### 입력 검증
- TODO 추가 시에 빈 문자열 입력시 에러 메시지 "할 일을 입력해주세요." 표시
- TODO 수정 시에 빈 문자열 입력 후 저장시 에러 메시지 "수정할 내용을 입력해주세요." 표시

#### TODO '완료'버튼 동작
- TODO에 'completed' 클래스 있을 때 완료'버튼 클릭시 'completed' 클래스 삭제
- TODO에 'completed' 클래스 없을 때 완료'버튼 클릭시 'completed' 클래스 추가

### 3-2. TODO 상태별 필터링
- 전체 : 선택된 날짜의 모든 TODO 표시
- 진행중 : 선택된 날짜의 'completed'클래스 없는 TODO만 표시
- 완료 : 선택된 날짜의 'completed'클래스 있는 TODO만 표시

#### 필터링 방식
- CSS 클래스 'hidden'을 토글하여 'display : none' 처리

### 3-3. 주간 뷰
- 주간 달력 표시 : 현재 주의 월~일 7일을 가로로 표시
- 기간 라벨 : 헤더에 "yyyy.mm.dd~yyyy.mm.dd" 형식으로 주 범위 표시
- 날짜 선택 : 특정 날짜 클릭시 해당 날짜의 TODO목록 표시
- 주 이동 : 이전/다음 버튼 클릭시 주 단위로 이동
- Today 표시 : 실제 오늘 날짜에 밑줄 표시 ('today' 클래스)
- 선택한 날짜 표시 : 선택한 날짜에 배경색 전용 ('active' 클래스)
- TODO 개수 표시 : 각 날짜 아래에 해당 날짜의 TODO 개수를 배지로 표시

### 3-4. 데이터 - 로컬 스토리지 
- 저장 : TODO 추가/수정/완료 토글/삭제할 때마다 즉시 저장
- 복원 : 페이지 로드 시 복원

#### 데이터 형식

```json
[
  {
    "text": "할 일 내용",
    "date": "Mon Jun 09 2026",
    "completed": false
  }
]
```

- localStorage 키 : "todos"

### 4. 기능 개발 순서

- 1. TODO CRUD 구현
- 2. TODO 상태별 필터링 구현
- 3. 주간 뷰 구현
- 4. localStorage와 연동
 
