// початковий масив об'єктів для зберігання студентів
let students = [
    { id: 1, name: "Іван Петренко", age: 20, grade: 85.5, faculty: "IT" },
    { id: 2, name: "Олена Коваленко", age: 19, grade: 92.0, faculty: "Математика" },
    { id: 3, name: "Петро Сидоренко", age: 21, grade: 74.0, faculty: "IT" }
];

let currentId = 4;

const output = document.getElementById("output");

// функція для виводу списку студентів на сторінку
function render(list) {
    output.innerHTML = "";
    list.forEach(s => {
        const div = document.createElement("div");
        div.className = "student-card";
        div.textContent = `${s.name} - Вік: ${s.age}, Бал: ${s.grade}, Фак: ${s.faculty}`;
        output.appendChild(div);
    });
}

// малюю початковий список
render(students);

// додавання нового студента
document.getElementById("btn-add").addEventListener("click", () => {
    const name = document.getElementById("s-name").value;
    const age = Number(document.getElementById("s-age").value);
    const grade = Number(document.getElementById("s-grade").value);
    const faculty = document.getElementById("s-faculty").value;

    // проста валідація вхідних даних
    if (name && age && grade && faculty) {
        students.push({ id: currentId++, name, age, grade, faculty });
        render(students);
    } else {
        alert("Заповни всі поля");
    }
});

// сортування за балом за допомогою методу sort
document.getElementById("btn-sort").addEventListener("click", () => {
    // роблю копію масиву щоб не змінювати оригінал
    const sorted = [...students].sort((a, b) => b.grade - a.grade);
    render(sorted);
});

// пошук за ім'ям за допомогою методу find
document.getElementById("btn-search").addEventListener("click", () => {
    const query = document.getElementById("s-search").value.toLowerCase();
    const found = students.find(s => s.name.toLowerCase().includes(query));

    if (found) {
        render([found]);
    } else {
        output.innerHTML = "Студента не знайдено";
    }
});

// розрахунок статистики за допомогою методу reduce
document.getElementById("btn-stats").addEventListener("click", () => {
    if (students.length === 0) return;

    // рахую середній бал
    const avgGrade = students.reduce((sum, s) => sum + s.grade, 0) / students.length;

    // шукаю студента з найвищим балом
    const best = students.reduce((max, s) => s.grade > max.grade ? s : max, students[0]);

    output.innerHTML = `
        <div class="student-card">Середній бал: ${avgGrade.toFixed(2)}</div>
        <div class="student-card">Найкращий студент: ${best.name} (${best.grade})</div>
        <div class="student-card">Загальна кількість: ${students.length}</div>
    `;
});