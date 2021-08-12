'use strict';

//モバイル画面でドラック＆ドロップ不可

//タスク
class Task {
  constructor(board) {
    this.board = board; //ボード
    this.taskInput = document.getElementById('task-input'); //新規task入力
    this.taskElId = 1; //taskElのid D&D用
    const addBtn = document.getElementById('add-button'); //addボタン
    //task追加ボタンイベント
    addBtn.addEventListener('click', e => this.addTask(e));
  }

  //taskのdiv要素作成
  createTaskEl() {
    const taskEl = document.createElement('div'); //taskのdiv作成
    taskEl.setAttribute('id', `task${this.taskElId}`); //id設定 c&Drop用
    taskEl.classList.add('task'); //class追加
    taskEl.setAttribute('draggable', true); //要素をDrag可能にする(htmlで使用)
    taskEl.addEventListener('dragstart', e => this.board.dragStart(e)); //イベント
    return taskEl;
  }

  //task内容作成
  createNewTask() {
    const newTask = document.createElement('div'); //task内容のdiv作成
    newTask.classList.add('newtask'); //class追加
    newTask.innerText = this.taskInput.value; //taskの内容
    return newTask;
  }

  // editボタン作成
  createEditBtn() {
    const editBtn = document.createElement('div'); //editボタン
    editBtn.textContent = 'edit'; //icon用
    editBtn.classList.add('material-icons'); //icon用
    editBtn.classList.add('md-36'); //iconサイズ用
    editBtn.classList.add('edit-btn'); //editTask用
    return editBtn;
  }

  //deleteボタン作成
  createDeleteBtn() {
    const deleteBtn = document.createElement('div'); //deleteボタン
    deleteBtn.textContent = 'delete'; //icon用
    deleteBtn.classList.add('material-icons'); //icon用
    deleteBtn.classList.add('md-36'); //iconサイズ用
    deleteBtn.classList.add('delete-btn'); //deleteTask用
    return deleteBtn;
  }

  //タスク追加
  addTask(e) {
    e.preventDefault(); //デフォルトの動作を止める
    const taskEl = this.createTaskEl(); //taskのdiv要素作成
    const newTask = this.createNewTask(); //task内容作成
    if (!newTask.textContent) return; //task内容が空ならreturn
    let editInput = document.createElement('input'); //edit用inputタグ作成 最初は非表示
    const editBtn = this.createEditBtn(); //editボタン作成
    const deleteBtn = this.createDeleteBtn(); //deleteボタン作成

    taskEl.appendChild(newTask); //taskDivにtask内容追加
    taskEl.appendChild(editInput); //taskDivにedit用input追加(最初は非表示)
    taskEl.appendChild(editBtn); //taskDivにeditボタン追加
    taskEl.appendChild(deleteBtn); //taskDivにdleteボタン追加
    this.taskInput.value = ''; //入力欄を空白にする

    this.board.taskBoard.appendChild(taskEl); //task一覧にtask追加
    this.taskElId++; //taskElのid Drag&Drop用
  }

  //edit
  editTask(event) {
    let item = event.target; //クリックした要素を取得(editボタン)
    let task = item.parentElement; //親要素(taskEl)
    let editInput = task.querySelector('input'); //edit用inputタグ(最初は空)
    editInput.setAttribute('maxlength', '10'); //edit用inputタグ最大文字数
    let newTask = task.querySelector('.newtask'); //task内容のdiv

    //editボタンを押した
    if (item.classList.contains('edit-btn')) {
      task.classList.toggle('editMode'); //editMode切り替え
      //editModeへ
      if (task.classList.contains('editMode')) {
        editInput.value = newTask.innerText; //入力したtask内容をedit用inputタグへ
        //editModeから戻る
      } else {
        if (!editInput.value) return; //編集内容が空ならreturn
        newTask.innerText = editInput.value; //edit用inputタグの内容をnewtaskへ
      }
    }
  }

  //delete
  deleteTask(event) {
    const item = event.target; //クリックした要素を取得(deleteボタン)
    const task = item.parentElement; //親要素(taskEl)

    //deleteボタンか確認
    if (item.classList.contains('delete-btn')) {
      task.remove(); //taskElを削除
    }
  }
}

// ボード
class Board {
  constructor() {
    this.task = new Task(this);
    this.taskBoard = document.getElementById('task-board'); //taskボード
    const doingBoard = document.getElementById('doing-board'); //doingボード
    const doneBoard = document.getElementById('done-board'); //doneボード

    //taskボードイベント(edit)
    this.taskBoard.addEventListener('click', e => this.task.editTask(e));
    //taskボードイベント(delete)
    this.taskBoard.addEventListener('click', e => this.task.deleteTask(e));
    //doingボードイベント(edit)
    doingBoard.addEventListener('click', e => this.task.editTask(e));
    //doingボードイベント(delete)
    doingBoard.addEventListener('click', e => this.task.deleteTask(e));
    //doneボードイベント(edit)
    doneBoard.addEventListener('click', e => this.task.editTask(e));
    //doneボードイベント(delete)
    doneBoard.addEventListener('click', e => this.task.deleteTask(e));

    this.BoardAddEventListeners(); // ボード　イベントリスナー関数
  }
  //dragstart
  dragStart(event) {
    //ドラッグするデータのid名をDataTransferオブジェクトにセット
    event.dataTransfer.setData('text/plain', event.target.id);
  }

  //dragover
  dragOver(event) {
    // ブラウザには何かがドロップされたときに行う動作がデフォルトで用意
    // dragoverイベントが起きたとき、デフォルトの動作を明示的に止める必要
    event.preventDefault();
  }

  //drop
  dragDrop(event) {
    // dataTransfer.getData(format) …… データを取得する
    let sourceId = event.dataTransfer.getData('text/plain');

    let sourceIdEl = document.getElementById(sourceId); //drag元のdiv
    let sourceIdParentEl = sourceIdEl.parentElement; //drag元のdivの親
    let targetEl = document.getElementById(event.target.id); //drop先のdiv
    let targetParentEl = targetEl.parentElement; //drop先のdivの親

    //ex.task一覧からdone一覧へ
    if (targetParentEl.id !== sourceIdParentEl.id) {
      //同じclassの中に入ってしまう(taskDivの中にtaskDiv)
      if (targetEl.className === sourceIdEl.className) {
        targetParentEl.appendChild(sourceIdEl); //上記を避けるためdrop先の親の子に追加
      } else {
        targetEl.appendChild(sourceIdEl); //drop先の子に追加
      }
      //同じ場合(ex.task一覧内での移動)
    } else {
      targetParentEl.insertBefore(sourceIdEl, targetEl);
    }

    event.dataTransfer.clearData(); //dataTransfer オブジェクトをリセット
  }

  // ボード　イベントリスナー関数
  BoardAddEventListeners() {
    const boardContents = document.querySelectorAll('.board-content');

    boardContents.forEach(boardContent => {
      boardContent.addEventListener('dragover', this.dragOver);
      boardContent.addEventListener('drop', this.dragDrop);
    });
  }
}

new Board();
