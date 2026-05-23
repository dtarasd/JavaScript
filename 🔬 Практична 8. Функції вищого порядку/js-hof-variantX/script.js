// --- Власні реалізації чистих функцій map, filter, reduce ---

const myMap = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(fn(arr[i], i, arr));
    }
    return result;
};

const myFilter = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
};

const myReduce = (arr, fn, initialValue) => {
    let acc = initialValue !== undefined ? initialValue : arr[0];
    let startIdx = initialValue !== undefined ? 0 : 1;
    for (let i = startIdx; i < arr.length; i++) {
        acc = fn(acc, arr[i], i, arr);
    }
    return acc;
};

// --- Chainable API (через імутабельний клас-обгортку) ---
class Chain {
    constructor(value) {
        this.val = value;
    }
    map(fn) {
        return new Chain(myMap(this.val, fn));
    }
    filter(fn) {
        return new Chain(myFilter(this.val, fn));
    }
    reduce(fn, init) {
        return myReduce(this.val, fn, init);
    }
    value() {
        return this.val;
    }
}
// Хелпер для зручного створення ланцюжка
const _ = (arr) => new Chain(arr);

// --- Функції композиції ---
// compose: виконує функції справа наліво
const compose = (...fns) => (x) => myReduce([...fns].reverse(), (acc, fn) => fn(acc), x);

// pipe: виконує функції зліва направо
const pipe = (...fns) => (x) => myReduce(fns, (acc, fn) => fn(acc), x);

// --- Curry та Partial ---
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) return fn(...args);
        return (...args2) => curried(...args, ...args2);
    };
};

const partial = (fn, ...presetArgs) => (...laterArgs) => fn(...presetArgs, ...laterArgs);

// --- Memoize ---
const memoize = (fn) => {
    const cache = {};
    return (...args) => {
        const key = JSON.stringify(args);
        if (key in cache) {
            return { fromCache: true, result: cache[key] };
        }
        const result = fn(...args);
        cache[key] = result;
        return { fromCache: false, result: result };
    };
};

// --- Логіка інтерфейсу та тестування ---
const output = document.getElementById("output");
const data = [1, 2, 3, 4, 5];

document.getElementById("btn-chain").addEventListener("click", () => {
    // Демонстрація Chainable API
    const result = _(data)
        .filter(x => x % 2 !== 0) // залишаємо непарні (1, 3, 5)
        .map(x => x * 10)         // множимо на 10 (10, 30, 50)
        .reduce((sum, x) => sum + x, 0); // сумуємо (90)

    output.textContent = `Вхідний масив: [${data}]\n\nТест Chainable (filter непарні -> map *10 -> reduce сума):\nРезультат = ${result}`;
});

document.getElementById("btn-compose").addEventListener("click", () => {
    const add5 = x => x + 5;
    const multiply2 = x => x * 2;

    // compose: спочатку multiply2, потім add5
    const composedFn = compose(add5, multiply2);

    // pipe: спочатку add5, потім multiply2
    const pipedFn = pipe(add5, multiply2);

    output.textContent = `Тест Compose (add5(multiply2(10))):\nРезультат = ${composedFn(10)}\n\nТест Pipe (multiply2(add5(10))):\nРезультат = ${pipedFn(10)}`;
});

document.getElementById("btn-curry").addEventListener("click", () => {
    const multiply3Numbers = (a, b, c) => a * b * c;

    const curriedMultiply = curry(multiply3Numbers);
    const resCurry = curriedMultiply(2)(3)(4); // 24

    const greet = (greeting, name) => `${greeting}, ${name}!`;
    const sayHello = partial(greet, "Привіт");
    const resPartial = sayHello("Світ");

    output.textContent = `Тест Curry (множення 2*3*4 через виклики f(a)(b)(c)):\nРезультат = ${resCurry}\n\nТест Partial (фіксуємо аргумент "Привіт"):\nРезультат = ${resPartial}`;
});

document.getElementById("btn-memoize").addEventListener("click", () => {
    // Імітація важких обчислень
    const slowSquare = (n) => n * n;
    const memoizedSquare = memoize(slowSquare);

    const call1 = memoizedSquare(5); // обчислюється вперше
    const call2 = memoizedSquare(5); // береться з кешу

    output.textContent = `Тест Memoize для функції slowSquare(5):\n\nВиклик 1: ${JSON.stringify(call1)}\nВиклик 2 (з тими ж даними): ${JSON.stringify(call2)}`;
});