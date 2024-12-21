// === リファクタリング後のtasks.js ===

// 初期化処理
function initializeApp() {
  console.log("turbo:loadイベントが発火しました");
  initTaskCreation();
  initPagination();
  initInlineEditing();
  initTaskDeletion();
  initClock();
}

document.addEventListener('turbo:load', initializeApp);

// === タスク作成機能 ===
function initTaskCreation() {
  const createTaskBtn = document.getElementById('create-task-btn');
  if (!createTaskBtn) return;

  createTaskBtn.addEventListener('click', async function () {
      const taskData = {
          title: 'タイトル名を入力',
          description: '内容を入力',
          due_date: new Date().toISOString().split('T')[0],
          display_color_id: 1,
          display_type_id: 1,
          completed: false,
      };

      try {
          const response = await fetch('/tasks', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
              },
              body: JSON.stringify({ task: taskData }),
          });

          if (!response.ok) throw new Error('タスク作成に失敗しました');

          const html = await response.text();
          document.getElementById('tasks-container').innerHTML = html;
          window.location.reload();
      } catch (error) {
          console.error(error);
      }
  });
}

// === ページネーション機能 ===
function initPagination() {
  const prevButton = document.getElementById('prev-tasks');
  const nextButton = document.getElementById('next-tasks');
  let offset = 0;

  if (!prevButton || !nextButton) return;

  prevButton.addEventListener('click', () => {
      offset = Math.max(0, offset - 6);
      fetchTasks(offset);
  });

  nextButton.addEventListener('click', () => {
      offset += 6;
      fetchTasks(offset);
  });

  fetchTasks(offset);
}

async function fetchTasks(offset) {
  try {
      const response = await fetch(`/tasks/reorder?offset=${offset}`);
      if (!response.ok) throw new Error('タスク取得に失敗しました');

      const html = await response.text();
      document.getElementById('tasks-container').innerHTML = html;


      // ページネーションボタンの状態を更新
      const taskCount = document.querySelectorAll('#tasks-container > div').length;

      document.getElementById('prev-tasks').disabled = offset === 0;   // 最初のページなら無効化
      document.getElementById('next-tasks').disabled = taskCount < 6; // タスクが6件未満なら無効化
  } catch (error) {
      console.error(error);
  }
}

// === タスク削除機能 ===
function initTaskDeletion() {
  const container = document.getElementById('tasks-container');

  container.addEventListener('click', async function (event) {
      if (!event.target.classList.contains('task-delete-button')) return;

      const taskId = event.target.dataset.taskId;
      if (!confirm('このタスクを削除してもよろしいですか？')) return;

      try {
          const response = await fetch(`/tasks/${taskId}`, {
              method: 'DELETE',
              headers: {
                  'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
              },
          });

          if (!response.ok) throw new Error('タスク削除に失敗しました');

          document.querySelector(`.task-item[data-task-id="${taskId}"]`).remove();
      } catch (error) {
          console.error(error);
      }
  });
}

// === インライン編集機能 ===
function initInlineEditing() {
  document.addEventListener('click', function (e) {
      if (
          e.target.classList.contains('task-title') ||
          e.target.classList.contains('task-description') ||
          e.target.classList.contains('task-due-date')
      ) {
          handleInlineEditing(e.target);
      }
  });
}

async function handleInlineEditing(element) {
  element.addEventListener(
      'blur',
      async function () {
          const taskItem = element.closest('.task-item');
          const taskId = taskItem.dataset.taskId;
          const field = getFieldName(element);
          let value = element.textContent.trim();

          if (!field) return;

          // 期日のフォーマット処理
          if (field === 'due_date') {
            value = formatDate(value);
        }
          try {
              const response = await fetch(`/tasks/${taskId}`, {
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                  },
                  body: JSON.stringify({ task: { [field]: value } }),
              });

              if (!response.ok) throw new Error('タスク更新に失敗しました');

              const updatedTask = await response.json();
              syncCalendarTask(taskId, updatedTask);
          } catch (error) {
              console.error(error);
          }
      },
      { once: true }
  );
}

function getFieldName(element) {
  if (element.classList.contains('task-title')) return 'title';
  if (element.classList.contains('task-description')) return 'description';
  if (element.classList.contains('task-due-date')) return 'due_date';
  return null;
}

// === 日付フォーマット専用関数 ===
function formatDate(dateStr) {
  return dateStr
      .replace(/年/, '-')  // "年"を"-"に置換
      .replace(/月/, '-')  // "月"を"-"に置換
      .replace(/日/, '')   // "日"を削除
      .trim();             // 前後の余計な空白を削除
}

// === カレンダー同期 ===
function syncCalendarTask(taskId, updatedTask) {
  const calendarTaskMarker = document.querySelector(`.calendar-task .task-marker[data-task-id="${taskId}"]`);
  if (!calendarTaskMarker) return;

  calendarTaskMarker.setAttribute('title', updatedTask.title);
  const newDueDate = updatedTask.due_date;
  const newCalendarDate = document.querySelector(`.calendar-date[data-date="${newDueDate}"]`);

  if (newCalendarDate) {
      newCalendarDate.appendChild(calendarTaskMarker);
  }
}

// === ユーティリティ: デジタル時計 ===
function initClock() {
  function updateClock() {
      const now = new Date();
      const clock = document.getElementById('digital-clock');
      clock.textContent = now.toLocaleTimeString();
  }

  setInterval(updateClock, 1000);
  updateClock();
}
