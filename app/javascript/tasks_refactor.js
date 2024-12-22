// === リファクタリング後のtasks.js ===

// 初期化処理
function initializeApp() {
  console.log("turbo:loadイベントが発火しました");
  initTaskCreation();
  initPagination();
  initTaskCompletion();
  initInlineEditingFocus();
  initActiveHashSave();
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

// === 通知表示用関数 ===
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`; // 'success' or 'error'
    document.body.appendChild(notification);

    // 通知を1.3秒後に自動で削除
    setTimeout(() => notification.remove(), 1300);
}

// === タスク完了用チェックボックスの保存処理 ===
function initTaskCompletion() {
    document.addEventListener('change', async function (e) {
        if (!e.target.classList.contains('task-status')) return;

        const taskItem = e.target.closest('.task-item');
        const statusTaskId = taskItem.dataset.taskId;
        const completed = e.target.checked;

        try {
            console.log("タスク完了状態を更新中:", { taskId: statusTaskId, completed });
            
            const response = await fetch(`/tasks/${statusTaskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    task: { completed }
                }),
            });

            if (!response.ok) throw new Error('タスクの更新に失敗しました');

            // DOMの更新
            updateTaskStatusUI(taskItem, completed);

            // 通知を表示
            showNotification('タスクが正常に更新されました！', 'success');
        } catch (error) {
            console.error("タスク更新エラー:", error);
            e.target.checked = !completed; // チェック状態を元に戻す
            showNotification(`タスクの更新に失敗しました: ${error.message}`, 'error');
        }
    });
}

// UIを更新するヘルパー関数
function updateTaskStatusUI(taskItem, completed) {
    const deleteButton = taskItem.querySelector('.task-delete-button');
    deleteButton.disabled = !completed; // 完了状態に応じて削除ボタンを切り替え

    if (completed) {
        taskItem.classList.add('completed'); // 完了タスクにクラスを追加
    } else {
        taskItem.classList.remove('completed'); // 完了タスクのクラスを削除
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

function initInlineEditingFocus() {
  document.addEventListener('focusin', function (e) {
      if (
          e.target.classList.contains('task-title') ||
          e.target.classList.contains('task-description') ||
          e.target.classList.contains('task-due-date')
      ) {
          console.log("フォーカスが当たりました:", e.target);
          e.target.classList.add('editing'); // 編集中クラスを追加
          handleInlineEditing(e.target); // フォーカスアウト時の処理
      }
  });

  document.addEventListener('focusout', function (e) {
      if (e.target.classList.contains('editing')) {
          console.log("フォーカスが外れました:", e.target);
          e.target.classList.remove('editing'); // 編集中クラスを削除
      }
  });
}

document.addEventListener("keydown", function (e) {
  // エンターキーが押された場合
  if (e.key === "Enter") {
    const activeElement = document.activeElement;

    // 対象のクラスを確認
    if (
      activeElement.classList.contains("task-title") ||
      activeElement.classList.contains("task-description") ||
      activeElement.classList.contains("task-due-date") 
    ) {
      e.preventDefault(); // フォーム送信の防止
      activeElement.blur(); // フォーカスを外す
      console.log("エンターキーでフォーカスを外しました");
    }
  }
});

async function handleInlineEditing(element) {
  console.log("インライン編集ハンドラが設定されました:", element);
  element.addEventListener(
      'blur',
      async function () {
          const taskItem = element.closest('.task-item');
          const taskId = taskItem.dataset.taskId;
          const field = getFieldName(element);
          let value = element.textContent.trim();
          const { saveFormat, displayFormat } = formatDate(value);

          console.log("フォーカスアウト時の値:", value); // フォーカスアウト直後の値を確認

          if (!field) return;

          // 期日のフォーマット処理
          if (field === 'due_date') {

            console.log(formatDate(value))
            if (saveFormat === "不正な日付") {
                showNotification("不正な日付形式です。正しい形式で入力してください。", 'error');
                return; // 無効な日付の場合は保存を中止
            }      
            value = saveFormat;
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
              console.log("保存成功:", updatedTask);

              if (field === 'due_date') {
                element.textContent = displayFormat;
                console.log("表示を更新しました:", displayFormat);
              }

              // 保存成功時の通知
              showNotification('タスクが正常に保存されました！', 'success');
              syncCalendarTask(taskId, updatedTask);
          } catch (error) {
              console.error(error);

              // 保存失敗時の通知
              showNotification('タスクの保存に失敗しました', 'error');
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
    let year, month, day;

    // 入力の正規化（記号とスペースの削除）
    const cleanDateStr = dateStr.replace(/[\s年月日/-]/g, "").replace(/\./g, "");
    console.log("整形中のcleanDateStr:", cleanDateStr);

    // 日付形式の判定と整形
    if (/^\d{8}$/.test(cleanDateStr)) {
        // YYYYMMDD の形式
        year = cleanDateStr.slice(0, 4);
        month = cleanDateStr.slice(4, 6);
        day = cleanDateStr.slice(6, 8);
    } else if (/^\d{4}$/.test(cleanDateStr)) {
        // MMDD の形式
        year = new Date().getFullYear(); // 現在の年を補完
        month = cleanDateStr.slice(0, 2);
        day = cleanDateStr.slice(2, 4);
    } else if (/^\d{1,2}月\d{1,2}日$/.test(dateStr)) {
        year = new Date().getFullYear(); // 現在の年を補完
        [month, day] = dateStr.match(/\d+/g);
    } else if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
        year = new Date().getFullYear(); // 現在の年を補完
        [month, day] = dateStr.split("/");
    } else if (/^\d{1,2}\.\d{1,2}$/.test(dateStr)) {
        year = new Date().getFullYear(); // 現在の年を補完
        [month, day] = dateStr.split(".");
    } else if (/^\d{1,2}-\d{1,2}$/.test(dateStr)) {
        year = new Date().getFullYear(); // 現在の年を補完
        [month, day] = dateStr.split("-");
    } else {
        console.warn("不正な日付形式:", dateStr);
        return { saveFormat: "不正な日付", displayFormat: "不正な日付" };
    }

    // 保存用と表示用のフォーマットを作成
    const saveFormat = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const displayFormat = `${year}年${parseInt(month, 10)}月${parseInt(day, 10)}日`;

    return { saveFormat, displayFormat };
}

function initActiveHashSave() {
    document.addEventListener('change', async function (e) {
        if (
            !e.target.classList.contains('task-display-color') &&
            !e.target.classList.contains('task-display-type')
        ) return;

        const taskItem = e.target.closest('.task-item');
        const taskId = taskItem.dataset.taskId;
        const field = e.target.classList.contains('task-display-color') ? 'display_color_id' : 'display_type_id';
        const value = e.target.value;

        try {
            console.log("アクティブハッシュを保存中:", { taskId, field, value });

            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    task: { [field]: value }
                }),
            });

            if (!response.ok) throw new Error('アクティブハッシュの更新に失敗しました');

            const updatedTask = await response.json();
            console.log("保存成功:", updatedTask);

            // カレンダーと同期
            syncCalendarTask(taskId, updatedTask);

            // 成功通知
            showNotification('アクティブハッシュが正常に保存されました！', 'success');
        } catch (error) {
            console.error("保存エラー:", error);

            // 失敗通知
            showNotification('アクティブハッシュの保存に失敗しました', 'error');
        }
    });
}

// === カレンダー同期 ===
function syncCalendarTask(taskId, updatedTask) {
  const calendarTaskMarker = document.querySelector(`.calendar-task .task-marker[data-task-id="${taskId}"]`);
  if (!calendarTaskMarker) {
    console.warn("カレンダー内のタスクマーカーが見つかりません:", taskId);
    return;
    }
    // タイトルの更新
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
