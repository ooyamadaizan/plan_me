document.addEventListener('DOMContentLoaded', function() {
  let offset = 0;

  // 新しいタスクを作成するボタンのイベントリスナー
  document.getElementById('create-task-btn').addEventListener('click', function() {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        task: {
          title: 'タイトル名を入力',
          description: '内容を入力',
          due_date: new Date().toISOString().split('T')[0]
        }
      })
    })
    .then(response => response.text())
    .then(html => {
      document.getElementById('tasks-container').innerHTML = html;
      offset = 0;
      updatePaginationButtons();
      fetchTasks(); // 新しく作成したタスクを含めてリストを更新
    });
  });

  // 前のページへ移動するボタンのイベントリスナー
  document.getElementById('prev-tasks').addEventListener('click', function() {
    offset = Math.max(0, offset - 6);
    fetchTasks();
  });

  // 次のページへ移動するボタンのイベントリスナー
  document.getElementById('next-tasks').addEventListener('click', function() {
    offset += 6;
    fetchTasks();
  });

  // サーバーからタスクを取得する関数
  function fetchTasks() {
    fetch(`/tasks/reorder?offset=${offset}`)
      .then(response => response.text())
      .then(html => {
        document.getElementById('tasks-container').innerHTML = html;
        updatePaginationButtons();
      });
  }

  // ページネーションボタンの状態を更新する関数
  function updatePaginationButtons() {
    document.getElementById('prev-tasks').disabled = offset === 0;
    document.getElementById('next-tasks').disabled =
      document.querySelectorAll('#tasks-container > div').length < 6;
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`; // 'success' or 'error'
    document.body.appendChild(notification);
  
    // 通知を3秒後に自動で削除
    setTimeout(() => notification.remove(), 3000);
  }
  // タスクのタイトルまたは説明のインライン編集を処理するイベントリスナー
  document.addEventListener('click', function(e) {
    if (
      e.target.classList.contains('task-title') ||
      e.target.classList.contains('task-description') ||
      e.target.classList.contains('task-status')
    ) {
       // タスクのステータス（完了チェック）を更新
      if (e.target.classList.contains('task-status')) {
        const taskItem = e.target.closest('.task-item');
        const statusTaskId = e.target.closest('.task-item').dataset.taskId;
        const completed = e.target.checked;

        fetch(`/tasks/${statusTaskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          body: JSON.stringify({
            task: {
              completed: completed
            }
          })
        })
        .then(response => {
          if (!response.ok) {
            // エラーコードやレスポンス内容を含めたエラーを投げる
            return response.json().then(err => {
              throw new Error(err.errors || 'Unknown error');
            });
          }
          return response.text().then(text => (text ? JSON.parse(text) : {}));
        })
        .then(() => {
          if (completed) {
            taskItem.classList.add('completed');
          } else {
            taskItem.classList.remove('completed');
          }
          showNotification('タスクが正常に更新されました！', 'success');
        })
        .catch(error => {
          console.error('Error updating task:', error);
          e.target.checked = !completed;
          showNotification(`タスクの更新に失敗しました: ${error.message}`, 'error');
        });
      }

      // タイトルまたは説明の編集
      if (
        e.target.classList.contains('task-title') ||
        e.target.classList.contains('task-description')
      ) {
        e.target.addEventListener(
          'blur',
          function() {
            const taskId = this.closest('.task-item').dataset.taskId;
            const field = this.classList.contains('task-title') ? 'title' : 'description';
            const value = this.textContent;

            fetch(`/tasks/${taskId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
              },
              body: JSON.stringify({
                task: {
                  [field]: value
                }
              })
            });
          },
          { once: true }
        );
      }
    }
  });

  // デジタル時計を更新する関数
  function updateClock() {
    const now = new Date();
    const clock = document.getElementById('digital-clock');
    clock.textContent = now.toLocaleTimeString();
  }

  // デジタル時計を1秒ごとに更新
  setInterval(updateClock, 1000);
  updateClock();
});

