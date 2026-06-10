// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// 주간 네비게이션 관련 DOM 요소 선택
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const weekDisplay = document.getElementById('week-display');
const weekRangeLabel = document.getElementById('week-range-label');

let currentFilter = 'all'; // 기본 필터 상태: 전체 ('all', 'active', 'completed')
let selectedDate = new Date(); // 현재 선택된 날짜
selectedDate.setHours(0, 0, 0, 0); // 날짜 비교를 위해 시간 부분은 자정으로 초기화

// 주간 뷰: 현재 보고 있는 주의 월요일을 추적
let currentWeekStart = new Date(selectedDate);
const dayOfWeek = currentWeekStart.getDay(); // 0(일) ~ 6(토)
// 자바스크립트는 일요일이 0이므로 월요일을 한 주의 시작으로 계산
const diffToMonday = currentWeekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
currentWeekStart.setDate(diffToMonday);

// 요일 이름 배열
const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

// 날짜를 YYYY.MM.DD 형식으로 포맷팅하는 함수
function formatFullDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 주간 네비게이션 렌더링 함수
function renderWeeklyNavigation() {
    weekDisplay.innerHTML = ''; // 초기화
    
    // 실제 오늘 날짜 (시간 자정 초기화)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startOfWeekStr = '';
    let endOfWeekStr = '';

    for (let i = 0; i < 7; i++) {
        const iterDate = new Date(currentWeekStart);
        iterDate.setDate(currentWeekStart.getDate() + i);
        
        if (i === 0) startOfWeekStr = formatFullDate(iterDate);
        if (i === 6) endOfWeekStr = formatFullDate(iterDate);
        
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item';
        
        // 현재 선택된 날짜인지 확인
        if (iterDate.getTime() === selectedDate.getTime()) {
            dateItem.classList.add('active');
        }
        
        // 실제 오늘 날짜인지 확인
        if (iterDate.getTime() === today.getTime()) {
            dateItem.classList.add('today');
        }
        
        // 요일 텍스트
        const daySpan = document.createElement('span');
        daySpan.className = 'day-name';
        daySpan.textContent = dayNames[i];
        
        // 날짜 숫자
        const dateNumSpan = document.createElement('span');
        dateNumSpan.className = 'date-number';
        dateNumSpan.textContent = iterDate.getDate();
        
        // 개수 배지 (초기값 0)
        const countSpan = document.createElement('span');
        countSpan.className = 'todo-count';
        countSpan.dataset.dateString = iterDate.toDateString(); // 나중에 개수 갱신을 위해 날짜 저장
        countSpan.textContent = '0';
        
        dateItem.appendChild(daySpan);
        dateItem.appendChild(dateNumSpan);
        dateItem.appendChild(countSpan);
        
        // 날짜 클릭 이벤트
        dateItem.addEventListener('click', () => {
            selectedDate = new Date(iterDate);
            renderWeeklyNavigation(); // active 클래스 갱신을 위해 다시 렌더링
            filterTodos();
            updateTodoCounts(); // 클릭 후 개수도 다시 렌더링되므로 업데이트 필요
        });
        
        weekDisplay.appendChild(dateItem);
    }
    
    // 기간 라벨 업데이트
    if (weekRangeLabel) {
        weekRangeLabel.textContent = `${startOfWeekStr} ~ ${endOfWeekStr}`;
    }
}

// 주 단위 이동 이벤트 설정
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderWeeklyNavigation();
    updateTodoCounts();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderWeeklyNavigation();
    updateTodoCounts();
});

// 초기 날짜 렌더링 호출
renderWeeklyNavigation();

// 로컬 스토리지 데이터 불러오기
loadTodos();

// 필터 버튼 클릭 이벤트 리스너 추가
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 모든 탭의 active 클래스 제거
        filterBtns.forEach(b => b.classList.remove('active'));
        // 선택된 탭에 active 클래스 추가
        btn.classList.add('active');
        
        // 현재 필터 상태 업데이트 및 목록 필터링 실행
        currentFilter = btn.dataset.filter;
        filterTodos();
    });
});

// 현재 필터 상태에 따라 Todo 항목들을 보여주거나 숨기는 함수
function filterTodos() {
    const items = document.querySelectorAll('.todo-item');
    const selectedDateString = selectedDate.toDateString(); // 비교를 위한 문자열 생성

    items.forEach(item => {
        // 1. 날짜 필터링: 항목의 데이터와 현재 선택된 날짜가 일치하지 않으면 숨김 처리
        if (item.dataset.date !== selectedDateString) {
            item.classList.add('hidden');
            return; 
        }

        const isCompleted = item.classList.contains('completed');
        
        switch (currentFilter) {
            case 'all':
                item.classList.remove('hidden');
                break;
            case 'active':
                if (isCompleted) item.classList.add('hidden');
                else item.classList.remove('hidden');
                break;
            case 'completed':
                if (isCompleted) item.classList.remove('hidden');
                else item.classList.add('hidden');
                break;
        }
    });
}

// Todo 추가 이벤트 리스너 (버튼 클릭 및 Enter 키 입력)
addBtn.addEventListener('click', handleAddTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAddTodo();
    }
});

// Todo 항목을 추가하는 메인 함수
function handleAddTodo() {
    const text = todoInput.value.trim();

    // 입력값이 비어있는 경우 검증 및 안내 메시지 표시
    const inputSection = document.querySelector('.input-section');
    if (text === '') {
        showError(inputSection, '할 일을 입력해주세요.', todoInput);
        return;
    }
    hideError(inputSection); // 성공 시 삭제
    todoInput.value = '';

    // 새로운 Todo DOM 요소 생성 및 목록에 추가
    const todoItem = createTodoElement(text);
    todoList.appendChild(todoItem);

    // 새 항목 추가 후 현재 필터 상태 다시 적용
    filterTodos();
    saveTodos(); // 추가 후 스토리지 저장
    updateTodoCounts(); // 개수 갱신
}

//내가 수정한 부분 5: 에러 메시지 기능 일관되게 변경
// 동적 에러 표시 함수
function showError(referenceElement, msg, inputElement) {
    hideError(referenceElement); // 기존에 떠있는 에러가 있으면 먼저 지움
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message show';
    errorMsg.textContent = msg;

    //AI 도움
    // referenceElement 바로 다음(afterend)에 에러 메시지를 찰칵 끼워 넣음!
    referenceElement.insertAdjacentElement('afterend', errorMsg);
    
    if (inputElement) inputElement.focus();
}

//AI 도움
// 동적 에러 삭제 함수
function hideError(referenceElement) {
    // referenceElement 바로 다음 형제 요소가 에러 메시지라면 삭제!
    const nextEl = referenceElement.nextElementSibling;
    if (nextEl && nextEl.classList.contains('error-message')) {
        nextEl.remove();
    }
}

// 개별 Todo 요소(li)를 생성하는 함수
function createTodoElement(text, savedDate = selectedDate.toDateString(), isCompleted = false) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    if (isCompleted) li.classList.add('completed');
    
    // 생성 시 인자로 받은 날짜를 데이터 속성에 저장
    li.dataset.date = savedDate; 

    // 내용 영역 생성 (텍스트)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'todo-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = text;

    contentDiv.appendChild(textSpan);

    // 버튼 그룹 영역 생성
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // 1. 완료 버튼
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.textContent = '완료';
    completeBtn.addEventListener('click', () => {
        // 완료 상태 토글 (취소선 적용)
        li.classList.toggle('completed');
        // 완료 상태 변경 시 필터 즉시 재적용
        filterTodos();
        saveTodos(); // 완료 상태 변경 후 스토리지 저장
    });

    // 2. 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', () => {
        enableEditMode(li, textSpan, contentDiv, buttonGroup, editBtn);
    });

    // 3. 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => {
        // 해당 Todo 항목 삭제
        li.remove();
        saveTodos(); // 삭제 후 스토리지 저장
        updateTodoCounts(); // 개수 갱신
    });

    // 버튼들을 그룹에 추가
    buttonGroup.appendChild(completeBtn);
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    // 전체 요소를 li에 조립
    li.appendChild(contentDiv);
    li.appendChild(buttonGroup);

    return li;
}

// 수정 모드로 전환하는 함수
function enableEditMode(li, textSpan, contentDiv, buttonGroup, editBtn) {
    // 이미 수정 중이면 무시
    if (li.classList.contains('editing')) return;
    
    li.classList.add('editing');


    // 기존 텍스트를 숨기고 입력창을 생성하여 표시
    const currentText = textSpan.textContent;

    // AI 도움: error-message 출력 과정에서 동적으로 message element를 생성하고 flex를 세로로 바꾸기 위해서
    // 기존의 input element 대신 input + error-message를 합친 container element 생성
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.flex = '1';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = currentText;

    inputContainer.appendChild(editInput);
    contentDiv.replaceChild(inputContainer, textSpan);

    editInput.focus();

    // 기존 수정 버튼을 '저장' 역할을 하는 버튼으로 교체
    const saveBtn = editBtn.cloneNode(true); // 이벤트가 복사되지 않은 복제본 생성
    saveBtn.textContent = '저장';
    saveBtn.className = 'action-btn save-btn';
    buttonGroup.replaceChild(saveBtn, editBtn);

    //내가 수정한 부분 1: 다른 버튼 비활성화
    Array.from(buttonGroup.children).forEach(btn => {
        if(btn != saveBtn){
            btn.disabled = true;
        }
    })
    // 수정 내용 저장 로직
    const saveHandler = () => {
        const newText = editInput.value.trim();
        
        // 입력값이 비어있으면 에러 메시지 표시 후 중단
        if (newText === '') {
            showError(editInput, '수정할 내용을 입력해주세요.', editInput);
            return;
        }

        hideError(editInput); // 에러가 표시되어 있었다면 숨김 처리

        // 텍스트 업데이트 및 입력창을 다시 span 태그로 복구
        textSpan.textContent = newText;
        contentDiv.replaceChild(textSpan, inputContainer);
        
        // 버튼을 다시 '수정' 버튼으로 복구
        buttonGroup.replaceChild(editBtn, saveBtn);
        li.classList.remove('editing');

        //내가 수정한 부분 2: 버튼들 다시 활성화
        Array.from(buttonGroup.children).forEach(btn => {
            btn.disabled = false;
        })

        saveTodos(); // 수정 내용 적용 후 스토리지 저장
    };

    // 저장 버튼 클릭 시 저장 이벤트 발생
    saveBtn.addEventListener('click', saveHandler);

    // 엔터 키 입력 시 저장 이벤트 발생
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveHandler();
        }
    });
}

// 로컬 스토리지에 현재 상태 저장
function saveTodos() {
    const items = document.querySelectorAll('.todo-item');
    const todos = [];
    
    items.forEach(item => {
        todos.push({
            text: item.querySelector('.todo-text').textContent,
            date: item.dataset.date,
            completed: item.classList.contains('completed')
        });
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 로컬 스토리지에서 데이터 불러오기
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        todos.forEach(todo => {
            const todoItem = createTodoElement(todo.text, todo.date, todo.completed);
            todoList.appendChild(todoItem);
        });
    }
    updateTodoCounts(); // 불러오기 완료 후 개수 갱신
}

// 날짜별 Todo 개수 갱신 함수
function updateTodoCounts() {
    // 모든 todo-item을 조회 (hidden 상태 포함)
    const items = document.querySelectorAll('.todo-item');
    const counts = {};
    
    // 각 날짜별로 개수 집계
    items.forEach(item => {
        const dateStr = item.dataset.date;
        counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    
    // 화면에 렌더링된 배지들에 집계된 숫자 반영
    const badges = document.querySelectorAll('.todo-count');
    badges.forEach(badge => {
        const dateStr = badge.dataset.dateString;
        badge.textContent = counts[dateStr] || 0;
    });
}
