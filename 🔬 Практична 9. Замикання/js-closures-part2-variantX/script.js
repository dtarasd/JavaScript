// --- 1. Cache Manager ---
function createCache(maxSize, defaultTTL) {
    const cache = new Map();
    let hits = 0;
    let misses = 0;

    return {
        set: function(key, value, ttl = defaultTTL) {
            if (cache.size >= maxSize && !cache.has(key)) {
                // видаляю найстаріший елемент (перший у Map)
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
            }

            const expiresAt = Date.now() + ttl;
            cache.set(key, { value, expiresAt });
        },

        get: function(key) {
            if (!cache.has(key)) {
                misses++;
                return null;
            }

            const item = cache.get(key);
            if (Date.now() > item.expiresAt) {
                // кеш прострочився
                cache.delete(key);
                misses++;
                return null;
            }

            hits++;
            // оновлюю позицію для LRU (переношу в кінець)
            cache.delete(key);
            cache.set(key, item);

            return item.value;
        },

        invalidate: function(key) {
            cache.delete(key);
        },

        clear: function() {
            cache.clear();
            hits = 0;
            misses = 0;
        },

        getStats: function() {
            const total = hits + misses;
            const hitRate = total === 0 ? 0 : ((hits / total) * 100).toFixed(2);
            return { hits, misses, hitRate: `${hitRate}%`, size: cache.size };
        }
    };
}

// ініціалізую кеш на 3 елементи, стандартний TTL 5 секунд
const myCache = createCache(3, 5000);

// --- 2. Lazy Evaluation ---

// відкладене обчислення
function lazy(fn) {
    let evaluated = false;
    let result;

    return function() {
        if (!evaluated) {
            result = fn();
            evaluated = true;
        }
        return result;
    };
}

// ледача послідовність
function lazyList(generatorFn) {
    return {
        take: function(n) {
            const iterator = generatorFn();
            const result = [];
            for (let i = 0; i < n; i++) {
                const next = iterator.next();
                if (next.done) break;
                result.push(next.value);
            }
            return result;
        },
        map: function(transformFn) {
            // створюю новий генератор, який на льоту застосовує трансформацію
            const newGenerator = function* () {
                const iterator = generatorFn();
                for (let item of iterator) {
                    yield transformFn(item);
                }
            };
            return lazyList(newGenerator);
        }
    };
}

// генератор простих чисел для прикладу
function* primesGenerator() {
    let num = 2;
    while (true) {
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) yield num;
        num++;
    }
}

const primesList = lazyList(primesGenerator);


// --- Інтерфейс ---
const outCache = document.getElementById("out-cache");
const outLazy = document.getElementById("out-lazy");

// тестування кешу
document.getElementById("btn-cache-set").addEventListener("click", () => {
    myCache.set("testKey", "Секретні дані", 2000); // ttl 2 секунди
    outCache.textContent = "Дані збережено під ключем 'testKey' на 2 секунди.";
});

document.getElementById("btn-cache-get").addEventListener("click", () => {
    const data = myCache.get("testKey");
    if (data) {
        outCache.textContent = `Отримано: ${data}`;
    } else {
        outCache.textContent = "Дані не знайдено (або TTL вийшов).";
    }
});

document.getElementById("btn-cache-stats").addEventListener("click", () => {
    outCache.textContent = JSON.stringify(myCache.getStats());
});

// тестування lazy
document.getElementById("btn-lazy-take").addEventListener("click", () => {
    const result = primesList.take(5);
    outLazy.textContent = `Перші 5 простих чисел: ${result.join(', ')}`;
});

document.getElementById("btn-lazy-map").addEventListener("click", () => {
    const mappedList = primesList.map(x => x * 10);
    const result = mappedList.take(5);
    outLazy.textContent = `Ті самі числа, помножені на 10 (map): ${result.join(', ')}`;
});