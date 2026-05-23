// роблю дебаунс функцію, щоб не спамити перевірками при кожному натисканні клавіші
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// знаходжу всі елементи форми
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress');

// зберігаю стан валідації кожного поля
let validState = {
    name: false,
    email: false,
    phone: false,
    message: false
};

// універсальна функція для перевірки полів
function validateField(field, regex, minLen, maxLen) {
    const val = field.value.trim();
    let isValid = false;
    let errorMsg = '';

    if (val.length === 0) {
        errorMsg = 'Поле не може бути порожнім';
    } else if (regex && !regex.test(val)) {
        errorMsg = 'Неправильний формат';
    } else if (minLen && val.length < minLen) {
        errorMsg = 'Занадто коротке';
    } else if (maxLen && val.length > maxLen) {
        errorMsg = 'Занадто довге';
    } else {
        isValid = true;
    }

    const errorSpan = document.getElementById(field.id + '-error');
    if (isValid) {
        field.classList.add('valid');
        field.classList.remove('invalid');
        errorSpan.textContent = '';
    } else {
        field.classList.add('invalid');
        field.classList.remove('valid');
        errorSpan.textContent = errorMsg;
    }

    validState[field.id] = isValid;
    updateProgress();
}

// оновлюю прогрес-бар та стан кнопки
function updateProgress() {
    let validCount = Object.values(validState).filter(Boolean).length;
    let percent = (validCount / 4) * 100;
    progressBar.style.width = percent + '%';
    submitBtn.disabled = validCount !== 4;
}

// створюю обробники з дебаунсом 300ms
const validateName = debounce(() => validateField(nameInput, /^[а-яА-Яa-zA-ZіІїЇєЄґҐ\s]+$/, 2, null), 300);
const validateEmail = debounce(() => validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, null, null), 300);
const validatePhone = debounce(() => validateField(phoneInput, /^\+380\d{9}$/, null, null), 300);
const validateMessage = debounce(() => validateField(messageInput, null, 20, 500), 300);

// вішаю слухачів подій на інпути
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
messageInput.addEventListener('input', validateMessage);

// логіка для пошуку
const searchInput = document.getElementById('search');
const searchList = document.getElementById('search-list');
const noResults = document.getElementById('no-results');

// масив з 30+ елементів для пошуку
const items = [
    'Яблуко', 'Банан', 'Апельсин', 'Груша', 'Виноград', 'Ківі', 'Манго', 'Персик',
    'Слива', 'Ананас', 'Лимон', 'Лайм', 'Грейпфрут', 'Мандарин', 'Помело', 'Хурма',
    'Гранат', 'Інжир', 'Кавун', 'Диня', 'Полуниця', 'Малина', 'Ожина', 'Чорниця',
    'Журавлина', 'Аґрус', 'Смородина', 'Черешня', 'Вишня', 'Абрикос', 'Нектарин'
];

// функція малювання списку
function renderList(query = '') {
    searchList.innerHTML = '';
    let count = 0;

    items.forEach(item => {
        if (item.toLowerCase().includes(query.toLowerCase())) {
            const li = document.createElement('li');
            if (query) {
                // підсвічую співпадіння
                const regex = new RegExp(`(${query})`, 'gi');
                li.innerHTML = item.replace(regex, '<span class="highlight">$1</span>');
            } else {
                li.textContent = item;
            }
            searchList.appendChild(li);
            count++;
        }
    });

    // показую плашку "Не знайдено", якщо результатів нуль
    if (count === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// обробник пошуку теж з дебаунсом
const handleSearch = debounce((e) => {
    renderList(e.target.value);
}, 300);

searchInput.addEventListener('input', handleSearch);

// малюю початковий список
renderList();