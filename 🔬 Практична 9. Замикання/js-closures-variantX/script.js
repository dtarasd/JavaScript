// --- Бібліотека Мемоізації на замиканнях ---

// 1. Базова мемоізація з підтримкою LRU (Least Recently Used) та статистикою
function memoize(fn, limit = 100) {
    const cache = new Map();
    let hits = 0;
    let misses = 0;

    const memoized = function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            hits++;
            // LRU: переміщуємо використаний елемент в кінець
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }

        misses++;
        const result = fn.apply(this, args);

        // LRU: видаляємо найстаріший елемент, якщо ліміт перевищено
        if (cache.size >= limit) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        cache.set(key, result);
        return result;
    };

    memoized.getStats = () => ({ hits, misses, cacheSize: cache.size });
    memoized.clearCache = () => cache.clear();
    return memoized;
}

// 2. Мемоізація з кастомним генератором ключів
function memoizeWith(keyFn, fn, limit = 100) {
    const cache = new Map();
    return function (...args) {
        const key = keyFn(...args);
        if (cache.has(key)) return cache.get(key);

        const result = fn.apply(this, args);
        if (cache.size >= limit) cache.delete(cache.keys().next().value);
        cache.set(key, result);
        return result;
    };
}

// 3. Мемоізація для асинхронних функцій
function memoizeAsync(fn) {
    const cache = new Map();
    return async function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        // Кешуємо сам проміс, щоб уникнути дублювання паралельних запитів
        const promise = fn.apply(this, args).catch(err => {
            cache.delete(key); // Видаляємо з кешу у разі помилки
            throw err;
        });
        cache.set(key, promise);
        return promise;
    };
}

// 4. Мемоізація з TTL (обмеженим часом життя)
function memoizeExpiring(fn, ttlMs) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        const now = Date.now();

        if (cache.has(key)) {
            const entry = cache.get(key);
            if (now - entry.timestamp < ttlMs) {
                return entry.value; // Кеш ще валідний
            }
            cache.delete(key); // Кеш прострочився
        }

        const result = fn.apply(this, args);
        cache.set(key, { value: result, timestamp: now });
        return result;
    };
}

// --- Логіка інтерфейсу та Бенчмарки ---
const output = document.getElementById("output");
const log = (text) => output.textContent = text;

// Тест 1: Fibonacci та LRU Benchmark
document.getElementById("btn-fib").addEventListener("click", () => {
    // Звичайна рекурсивна функція
    const slowFib = (n) => n <= 1 ? n : slowFib(n - 1) + slowFib(n - 2);

    // Мемоізована функція (перевизначає себе всередині для рекурсії)
    const fastFib = memoize((n) => n <= 1 ? n : fastFib(n - 1) + fastFib(n - 2), 50); // ліміт LRU = 50

    const num = 35; // Достатньо велике число, щоб побачити різницю

    let start1 = performance.now();
    const res1 = slowFib(num);
    let time1 = performance.now() - start1;

    let start2 = performance.now();
    const res2 = fastFib(num); // Перший виклик (наповнює кеш)
    let time2 = performance.now() - start2;

    let start3 = performance.now();
    const res3 = fastFib(num); // Другий виклик (миттєво з кешу)
    let time3 = performance.now() - start3;

    log(`Бенчмарк для числа Фібоначчі (${num}):
    
Без мемоізації: ${res1} (Час: ${time1.toFixed(2)} мс)
З мемоізацією (перший раз): ${res2} (Час: ${time2.toFixed(2)} мс)
З мемоізацією (з кешу): ${res3} (Час: ${time3.toFixed(2)} мс)

Статистика кешу: ${JSON.stringify(fastFib.getStats())}`);
});

// Тест 2: Custom Key
document.getElementById("btn-with").addEventListener("click", () => {
    // Наприклад, нам важливий лише перший аргумент для кешування
    const keyGenerator = (userObj) => userObj.id;
    const processUser = (userObj) => `Оброблено користувача: ${userObj.name}`;

    const memoizedProcess = memoizeWith(keyGenerator, processUser);

    const u1 = { id: 1, name: "Іван" };
    const u2 = { id: 1, name: "Петро" }; // Той самий ID, тому має взятися з кешу

    const r1 = memoizedProcess(u1);
    const r2 = memoizedProcess(u2);

    log(`Тест кастомного ключа (кешування за user.id):
    
Виклик 1 (id: 1, name: Іван): ${r1}
Виклик 2 (id: 1, name: Петро): ${r2} // Результат старий, бо ID збігається`);
});

// Тест 3: Async API
document.getElementById("btn-async").addEventListener("click", async () => {
    log("Виконується асинхронний запит...");

    const fakeApiCall = async (id) => {
        return new Promise(resolve => setTimeout(() => resolve(`Дані для ID ${id}`), 1000));
    };

    const memoizedApi = memoizeAsync(fakeApiCall);

    let t1 = performance.now();
    const res1 = await memoizedApi(42);
    t1 = performance.now() - t1;

    let t2 = performance.now();
    const res2 = await memoizedApi(42); // Має бути миттєво
    t2 = performance.now() - t2;

    log(`Тест Async API:
    
Запит 1 (без кешу): ${res1} (Час: ${t1.toFixed(0)} мс)
Запит 2 (з кешу): ${res2} (Час: ${t2.toFixed(0)} мс)`);
});

// Тест 4: TTL (Time To Live)
document.getElementById("btn-ttl").addEventListener("click", () => {
    let count = 0;
    const getValue = () => ++count;

    const memoizedTTL = memoizeExpiring(getValue, 1000); // 1 секунда TTL

    log(`Тест TTL (1 секунда):
Виклик 1: ${memoizedTTL()} (генерується нове значення)
Виклик 2: ${memoizedTTL()} (береться з кешу)

Зачекай 1.5 секунди...`);

    setTimeout(() => {
        const outputVal = document.getElementById("output").textContent;
        document.getElementById("output").textContent = outputVal + `\nВиклик 3: ${memoizedTTL()} (кеш прострочився, нове значення)`;
    }, 1500);
});