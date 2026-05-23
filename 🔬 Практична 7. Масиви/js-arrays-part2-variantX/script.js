// глобальний масив для зберігання задач
let tasks = [];
let taskId = 1;

// функція для виведення задач на екран
function renderTasks() {
    const output = document.getElementById("output");
    output.innerHTML = "";

    tasks.forEach(t => {
        const div = document.createElement("div");
        div.className = "task-card";
        div.innerHTML = `
            <div class="task-info">
                <strong>${t.title}</strong> 
                (Пріоритет: ${t.priority}, Дедлайн: ${t.date}) - Статус: <em>${t.status}</em>
            </div>
            <div class="task-actions">
                <button onclick="changeStatus(${t.id})">Змінити статус</button>
                <button onclick="deleteTask(${t.id})" style="background: red;">Видалити</button>
            </div>
        `;
        output.appendChild(div);
    });
}

// обробник для додавання нової задачі
document.getElementById("btn-add").addEventListener("click", () => {
    const title = document.getElementById("t-title").value;
    const priority = document.getElementById("t-priority").value;
    const date = document.getElementById("t-date").value;

    if (title && date) {
        tasks.push({ id: taskId++, title, priority, status: "очікує", date });
        renderTasks();
    } else {
        alert("Введи назву та дату!");
    }
});

// функція для циклічної зміни статусу
window.changeStatus = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        if (task.status === "очікує") task.status = "у процесі";
        else if (task.status === "у процесі") task.status = "виконано";
        else task.status = "очікує";
        renderTasks();
    }
};

// функція для видалення задачі з масиву
window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};

// розрахунок статистики
document.getElementById("btn-stats").addEventListener("click", () => {
    const done = tasks.filter(t => t.status === "виконано").length;
    const inProg = tasks.filter(t => t.status === "у процесі").length;
    const pending = tasks.filter(t => t.status === "очікує").length;

    document.getElementById("stats-output").textContent =
        `Виконано: ${done} | У процесі: ${inProg} | Очікує: ${pending}`;
});

// --- Реалізація функцій трансформації масивів ---

// рекурсивне розгортання вкладеного масиву
function flatten(arr) {
    return arr.reduce((acc, val) =>
        Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
    );
}

// групування об'єктів за ключем
function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
        const k = item[key];
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {});
}

// унікальні елементи масиву
function unique(arr) {
    return [...new Set(arr)];
}

// розбиття масиву на частини заданого розміру
function chunk(arr, size) {
    let res = [];
    for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size));
    }
    return res;
}

// тестування трансформацій (результат у консолі)
document.getElementById("btn-test").addEventListener("click", () => {
    console.log("--- Тест flatten ---");
    console.log(flatten([1, [2, [3, 4]], 5]));

    console.log("--- Тест groupBy (за пріоритетом задач) ---");
    console.log(groupBy(tasks, "priority"));

    console.log("--- Тест unique ---");
    console.log(unique([1, 1, 2, 3, 3, 4, 5, 5]));

    console.log("--- Тест chunk ---");
    console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3));

    alert("Відкрий консоль розробника (F12), щоб побачити результати роботи функцій трансформації.");
});