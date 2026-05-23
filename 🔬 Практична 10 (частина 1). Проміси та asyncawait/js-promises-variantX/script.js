const logBox = document.getElementById('log-box');

// Допоміжна функція для виведення логів на екран
function log(message, type = 'normal') {
    const span = document.createElement('span');
    span.textContent = message + '\n';
    if (type === 'error') span.className = 'log-error';
    if (type === 'success') span.className = 'log-success';
    logBox.appendChild(span);
}

// Допоміжна функція для симуляції ймовірності помилки (20%)
function withRandomError(resolveData, rejectMessage, resolve, reject) {
    const isError = Math.random() < 0.2;
    if (isError) {
        reject(new Error(rejectMessage));
    } else {
        resolve(resolveData);
    }
}

// 1. Перевірка наявності товарів (1с)
function checkAvailability(orderId) {
    log(`[1] Перевірка наявності товарів для замовлення #${orderId}...`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            withRandomError(
                { orderId, amount: 850 }, // передаємо суму замовлення
                "Товарів немає в наявності",
                resolve,
                reject
            );
        }, 1000);
    });
}

// 2. Резервування товарів (1с)
function reserveItems(orderId) {
    log(`[2] Резервування товарів для замовлення #${orderId}...`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            withRandomError(
                { orderId, reserved: true },
                "Помилка бази даних при резервуванні",
                resolve,
                reject
            );
        }, 1000);
    });
}

// 3. Обробка оплати (1.5с)
function processPayment(orderId, amount) {
    log(`[3] Обробка оплати на суму ${amount} грн...`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            withRandomError(
                { orderId, paid: true, transactionId: 'TXN-' + Math.floor(Math.random() * 10000) },
                "Недостатньо коштів або помилка банку",
                resolve,
                reject
            );
        }, 1500);
    });
}

// 4. Планування доставки (1с)
function scheduleDelivery(orderId) {
    log(`[4] Планування доставки для замовлення #${orderId}...`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            withRandomError(
                { orderId, deliveryTime: 'Сьогодні о 19:30' },
                "Немає вільних кур'єрів",
                resolve,
                reject
            );
        }, 1000);
    });
}

// Основна логіка ланцюжка промісів при кліку
document.getElementById('btn-order').addEventListener('click', () => {
    const orderId = Math.floor(Math.random() * 1000);
    log(`\n--- Початок обробки нового замовлення #${orderId} ---`);

    const btn = document.getElementById('btn-order');
    btn.disabled = true; // Блокуємо кнопку, щоб уникнути спаму кліками під час обробки

    checkAvailability(orderId)
        .then(result => {
            log(` > Товари в наявності. Сума: ${result.amount} грн.`);
            // Зберігаємо суму і передаємо далі через замикання в наступному then
            return reserveItems(result.orderId).then(() => result);
        })
        .then(result => {
            log(' > Товари успішно зарезервовано.');
            return processPayment(result.orderId, result.amount);
        })
        .then(result => {
            log(` > Оплату прийнято. ID транзакції: ${result.transactionId}`);
            return scheduleDelivery(result.orderId);
        })
        .then(result => {
            log(` > Доставку заплановано: ${result.deliveryTime}`, 'success');
            log('Замовлення успішно оформлено!', 'success');
        })
        .catch(error => {
            // Централізована обробка будь-якої помилки з ланцюжка
            log(`ПОМИЛКА: ${error.message}`, 'error');
            log('Процес замовлення перервано.', 'error');
        })
        .finally(() => {
            // Виконується завжди, незалежно від успіху чи помилки
            log('--- Завершення циклу обробки (очищення ресурсів) ---');
            btn.disabled = false; // Розблоковуємо кнопку
        });
});

document.getElementById('btn-clear').addEventListener('click', () => {
    logBox.innerHTML = '';
});