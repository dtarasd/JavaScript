// вибираю всі потрібні елементи з DOM
const columns = document.querySelectorAll('.column');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo');

// лічильник для унікальних id карток
let cardIdCounter = 0;

// додаю подію на кнопку створення нової картки
addBtn.addEventListener('click', () => {
    const text = prompt('Введи назву задачі:');
    if (text) {
        const card = createCard(text);
        todoList.appendChild(card);
    }
});

// функція для створення нової картки
function createCard(text) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.draggable = true;
    card.textContent = text;
    card.id = 'card-' + cardIdCounter++;

    // додаю події для drag & drop на саму картку
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

// обробка початку перетягування
function handleDragStart(e) {
    // зберігаю id картки, яку тягну
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

// обробка завершення перетягування
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// додаю події для колонок, щоб вони могли приймати картки
columns.forEach(column => {
    column.addEventListener('dragover', e => {
        // дозволяю скидання елемента в цю зону
        e.preventDefault();
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', e => {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', e => {
        e.preventDefault();
        column.classList.remove('drag-over');

        // дістаю id картки і знаходжу її в DOM
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);

        // додаю картку в нову колонку
        if (card) {
            column.appendChild(card);
        }
    });
});