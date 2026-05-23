// знаходжу всі потрібні елементи на сторінці
const overlay = document.getElementById('modal-overlay');
const modals = document.querySelectorAll('.modal');
const btnAlert = document.getElementById('btn-alert');
const btnConfirm = document.getElementById('btn-confirm');
const closeBtns = document.querySelectorAll('.close-btn');

// функція для відкриття конкретного модального вікна по його id
function openModal(modalId) {
    overlay.classList.add('active');
    document.getElementById(modalId).classList.add('active');
}

// функція для повного закриття всіх модалок та темного фону
function closeModal() {
    overlay.classList.remove('active');
    modals.forEach(modal => modal.classList.remove('active'));
}

// вішаю слухачів подій на кнопки відкриття
btnAlert.addEventListener('click', () => openModal('modal-alert'));
btnConfirm.addEventListener('click', () => openModal('modal-confirm'));

// додаю закриття на всі кнопки всередині вікон (Зрозуміло, Так, Ні)
closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

// реалізую закриття по кліку на темний фон (overlay)
overlay.addEventListener('click', closeModal);

// реалізую закриття по натисканню клавіші Esc на клавіатурі
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});