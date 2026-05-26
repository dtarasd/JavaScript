// Клас окремого завдання
class Task {
    constructor(id, text) {
        this.id = id;
        this.text = text;
        this.done = false; // За замовчуванням завдання не виконане
    }
    // Метод для зміни стану завдання
    toggle() {
        this.done = !this.done;
    }
}

// Клас для керування списком завдань
class TodoList {
    constructor() {
        this.tasks = []; // Масив для зберігання об'єктів Task
    }
    // Додавання завдання: створення нового об'єкта та додавання в масив
    add(text) {
        const task = new Task(Date.now(), text);
        this.tasks.push(task);
    }
    // Видалення завдання через фільтрацію масиву за ID
    remove(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}

const myTodoList = new TodoList();
const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// Функція для оновлення списку в HTML
function render() {
    list.innerHTML = ""; // Очищаємо список перед рендером
    myTodoList.tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id; // Зберігаємо ID завдання в атрибуті елемента

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";
        if (task.done) span.classList.add("done"); // Додаємо клас закреслення, якщо виконано

        const delBtn = document.createElement("button");
        delBtn.textContent = "Видалити";
        delBtn.className = "delete-btn";

        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

// Обробник натискання кнопки додавання
btn.addEventListener("click", () => {
    if (input.value.trim() === "") return; // Перевірка, чи не порожній інпут
    myTodoList.add(input.value);
    input.value = ""; // Очищення поля вводу
    render();
});

// Делегування подій на список для обробки кліків по завданнях або кнопках видалення
list.addEventListener("click", (e) => {
    const item = e.target.closest(".task-item");
    if (!item) return;

    const id = Number(item.dataset.id);

    // Якщо клікнули по кнопці видалення
    if (e.target.classList.contains("delete-btn")) {
        myTodoList.remove(id);
    }
    // Якщо клікнули по тексту завдання
    else if (e.target.classList.contains("task-text")) {
        const task = myTodoList.tasks.find(t => t.id === id);
        if (task) task.toggle();
    }
    render(); // Перемальовуємо список після змін
});