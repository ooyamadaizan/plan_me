document.addEventListener('turbo:load', function() {
  // ボタンやイベントリスナーの初期化
  console.log("turbo:loadイベントが発火しました");
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
          due_date: new Date().toISOString().split('T')[0],
          display_color_id: 2, // 適切なIDを設定
          display_type_id: 1  // 適切なIDを設定
        }
      })
    })
    .then(response => response.text())
    .then(html => {
      document.getElementById('tasks-container').innerHTML = html;
      offset = 0;
      updatePaginationButtons();
      fetchTasks(); // 新しく作成したタスクを含めてリストを更新

      // 自動リロードの追加
      window.location.reload(); // 全体リロードでカレンダーも更新
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

    // 通知を1.3秒後に自動で削除
    setTimeout(() => notification.remove(), 1300);
  }

  // タスクのタイトルまたは説明のインライン編集を処理するイベントリスナー
  document.addEventListener('click', function(e) {
    if (
      e.target.classList.contains('task-title') ||
      e.target.classList.contains('task-description') ||
      e.target.classList.contains('task-due-date') ||
      e.target.classList.contains('task-status') ||
      e.target.classList.contains('task-display-color') ||
      e.target.classList.contains('task-display-type')
    ) {
      // タスクのステータス（完了チェック）を更新

      if (e.target.classList.contains('task-status')) {
        const taskItem = e.target.closest('.task-item');
        const statusTaskId = taskItem.dataset.taskId;
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
              throw new Error('Failed to update the task status');
          }
          return response.json();
        })
        .then(() => {
          const deleteButton = taskItem.querySelector('.task-delete-button');
          deleteButton.disabled = !completed; // ステータスが「完了」なら削除ボタンを有効化        
          if (completed) {
            taskItem.classList.add('completed');// 完了タスクにクラスを追加
          } else {
            taskItem.classList.remove('completed');// 完了タスクのクラスを削除
          }
          showNotification('タスクが正常に更新されました！', 'success');
        })
        .catch(error => {
          console.error('Error updating task:', error);
          e.target.checked = !completed; // チェック状態を元に戻す
          showNotification(`タスクの更新に失敗しました: ${error.message}`, 'error');
        });
      } else {
        // 他のフィールド（title, description, due_date）がクリックされた場合の処理
        e.target.addEventListener(
          'blur',
          function() {
            const taskItem = this.closest('.task-item');
            const taskId = taskItem.dataset.taskId;
            const field = this.classList.contains('task-title')
              ? 'title'
              : this.classList.contains('task-description')
              ? 'description'
              : this.classList.contains('task-due-date')
              ? 'due_date'
              : this.classList.contains('task-display-color')
              ? 'display_color_id'
              : this.classList.contains('task-display-type')
              ? 'display_type_id'
              : null;
        
            // フィールドが null の場合は何もしない
            if (!field) return;
        
            let value = this.value || this.textContent.trim(); 
            if (field === 'due_date') {
              value = value
                .replace(/年/, '-')  // "年"を"-"に置換
                .replace(/月/, '-')  // "月"を"-"に置換
                .replace(/日/, '')   // "日"を削除
                .trim();             // 前後の余計な空白を削除
            }
            function formatDate(dateStr) {
              let year, month, day;
            
              // 入力の正規化（記号とスペースの削除）
              const cleanDateStr = dateStr.replace(/[\s年月日/-]/g, "").toUpperCase();
              const currentYear = new Date().getFullYear();
            
              // 日付形式の判定と整形
              if (/^\d{8}$/.test(cleanDateStr)) {
                // YYYYMMDD の形式
                year = cleanDateStr.slice(0, 4);
                month = cleanDateStr.slice(4, 6);
                day = cleanDateStr.slice(6, 8);
              } 
              else if (/^\d{4}$/.test(cleanDateStr)) {
                // MMDD の形式
                year = currentYear;
                month = cleanDateStr.slice(0, 2);
                day = cleanDateStr.slice(2, 4);
              } 
              else if (/^\d{1,2}月\d{1,2}日$/.test(dateStr)) {
                // 日本語形式: 1月12日, 3月4日
                year = currentYear;
                [month, day] = dateStr.match(/\d+/g);
              }
              else if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
                // M/D または MM/DD の形式
                year = currentYear;
                [month, day] = dateStr.split("/");
              }
              else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || /^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
                // YYYY-MM-DD または YYYY/MM/DD の形式
                [year, month, day] = dateStr.split(/[-/]/);
              }
              else if (/^[A-Z]+ \d{1,2}$/i.test(dateStr)) {
                // 英語形式 (月名 + 日)
                year = currentYear;
                const [monthName, dayStr] = dateStr.split(" ");
                const monthIndex = new Date(`${monthName} 1`).getMonth() + 1;
                if (!isNaN(monthIndex)) {
                  month = monthIndex.toString();
                  day = dayStr.padStart(2, "0");
                } else {
                  console.error("不正な月の名前:", monthName);
                  return "不正な日付";
                }
              }
              else if (/^\d{1,2} \d{1,2}$/.test(dateStr)) {
                // MM DD の形式 (スペース区切り)
                year = currentYear;
                [month, day] = dateStr.split(" ");
              }
              else {
                console.error("不正な日付形式:", dateStr);
                return "不正な日付";
              }
            
              // 整形された日付の出力
              const formattedDate = `${year}年${month.padStart(2, "0")}月${day.padStart(2, "0")}日`;
              console.log("整形後の日付:", formattedDate);
              return formattedDate;
            }
            // サーバーへの PATCH リクエスト
            fetch(`/tasks/${taskId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
              },
              body: JSON.stringify({
                task: {
                  [field]: value,
                },
              }),
            })
              .then((response) => {
                console.log("レスポンス全体:", response); // レスポンス全体を確認
                return response.json(); // JSON本文を取得
              })
              .then((data) => {
                console.log("JSONレスポンス:", data);
            
                if (!data.success || !data.task) {
                  showNotification('タスクの更新に失敗しました', 'error');
                  return;
                }
            
                const updatedTask = data.task;
                const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
            
                if (!taskItem) {
                  console.error("タスクアイテムが見つかりません");
                  return;
                }
            
                // DOMの更新処理
                const fieldsToUpdate = {
                  title: '.task-title',
                  description: '.task-description',
                  due_date: '.task-due-date',
                };
            
                // 更新処理の実行
                for (const [field, selector] of Object.entries(fieldsToUpdate)) {
                  const updatedValue = field === 'due_date' 
                    ? formatDate(updatedTask[field])  // 日付整形の適用
                    : updatedTask[field];

                  const fieldElement = taskItem.querySelector(selector);
                  
                  if (fieldElement) {
                    fieldElement.textContent = updatedValue || 'N/A';
                  } else {
                    console.warn(`フィールド要素が見つかりません: ${selector}`);
                  }
                }

                // タスクマーカーのクラス更新
                const taskMarker = taskItem.querySelector('.task-marker');

              if (taskMarker) {
                // クラス名の動的設定 (デフォルト値の適用)
                const colorClass = updatedTask.display_color?.attributes?.code || 'default-color';
                const typeClass = updatedTask.display_type?.attributes?.code || 'default-type';

                // クラス名の設定
                const newClass = `task-marker ${colorClass} ${typeClass}`;
                taskMarker.className = newClass;

                console.log("新しいクラスが適用されました:", newClass);
                console.log("更新されたタスク:", updatedTask);
              } else {
                console.warn("タスクマーカー要素が見つかりません");
              }

              const calendarTaskMarker = document.querySelector(`.calendar-task .task-marker[data-task-id="${taskId}"]`);

              if (calendarTaskMarker) {
                // カレンダー側のクラス更新
                const newCalendarClass = `task-marker ${updatedTask.display_color?.attributes?.code || 'default-color'} ${updatedTask.display_type?.attributes?.code || 'default-type'}`;
                calendarTaskMarker.className = newCalendarClass;

                console.log("カレンダーのクラス更新:", newCalendarClass);
              } else {
                console.warn("カレンダー内のタスクが見つかりません");
              }

                // 更新成功メッセージの表示
                showNotification(data.message, 'success');
              })
              .catch((error) => {
                console.error('エラー発生:', error);
                showNotification('タスクの更新に失敗しました', 'error');
              });

          },
          { once: true }
        );
      }
    }
  });

  document.querySelectorAll('.task-status').forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const taskItem = this.closest('.task-item');
      const deleteButton = taskItem.querySelector('.task-delete-button');
      
      if (this.checked) {
        deleteButton.disabled = false; // チェックが入っている場合は削除ボタンを有効化
      } else {
        deleteButton.disabled = true; // チェックが外れている場合は削除ボタンを無効化
      }
    });
  });

  // 削除ボタンのクリック処理
  document.getElementById('tasks-container').addEventListener('click', function (event) {
    // クリックされた要素が削除ボタンか確認
    if (event.target.classList.contains('task-delete-button')) {
      const taskId = event.target.dataset.taskId;
  
      if (!confirm('このタスクを削除してもよろしいですか？')) {
        return; // ユーザーがキャンセルを選択した場合
      }
  
      fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('タスクの削除に失敗しました');
          }
          return response.json();
        })
        .then(data => {
          console.log('タスク削除成功:', data);
          // 該当タスクを削除
          const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
          if (taskItem) {
            taskItem.remove();
          }
          window.location.reload();  // ページ全体のリロード
        })
        .catch(error => {
          console.error('タスク削除失敗:', error);
        });
        
    }
  });

  document.addEventListener("keydown", function (e) {
    // エンターキーが押された場合
    if (e.key === "Enter") {
      const activeElement = document.activeElement;
  
      // 対象のクラスを確認
      if (
        activeElement.classList.contains("task-title") ||
        activeElement.classList.contains("task-description") ||
        activeElement.classList.contains("task-due-date") ||
        activeElement.classList.contains("task-display-color") ||
        activeElement.classList.contains("task-display-type")
      ) {
        e.preventDefault(); // フォーム送信の防止
        activeElement.blur(); // フォーカスを外す
        console.log("エンターキーでフォーカスを外しました");
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
