// 1. Базовий лічильник з методами increment та decrement
function createCounter() {
    // приватна змінна
    let count = 0;

    return {
        increment: function() {
            return ++count;
        },
        decrement: function() {
            return --count;
        },
        get: function() {
            return count;
        }
    };
}

// 2. Лічильник з лімітами (не виходить за межі min та max)
function createLimitedCounter(min, max) {
    let count = min;

    return {
        increment: function() {
            if (count < max) count++;
            return count;
        },
        decrement: function() {
            if (count > min) count--;
            return count;
        },
        get: function() {
            return count;
        }
    };
}

// 3. Лічильник зі змінним кроком
function createStepCounter(step) {
    let count = 0;

    return {
        increment: function() {
            count += step;
            return count;
        },
        decrement: function() {
            count -= step;
            return count;
        },
        get: function() {
            return count;
        }
    };
}

// 4. Лічильник з ім'ям та історією змін
function createNamedCounter(name) {
    let count = 0;
    let history = []; // приватний масив для історії

    function record(action, value) {
        history.push({
            action: action,
            value: value,
            time: new Date().toLocaleTimeString()
        });
    }

    return {
        increment: function() {
            count++;
            record("increment", count);
            return count;
        },
        decrement: function() {
            count--;
            record("decrement", count);
            return count;
        },
        get: function() {
            return count;
        },
        getName: function() {
            return name;
        },
        getHistory: function() {
            // повертаю копію масиву, щоб історію не можна було змінити ззовні
            return [...history];
        }
    };
}

// --- Логіка інтерфейсу ---

// ініціалізую всі лічильники
const basicCounter = createCounter();
const limitedCounter = createLimitedCounter(0, 5);
const stepCounter = createStepCounter(10);
const namedCounter = createNamedCounter("Мій Головний Лічильник");

// Базовий
document.getElementById("btn-basic-inc").addEventListener("click", () => {
    document.getElementById("val-basic").textContent = basicCounter.increment();
});
document.getElementById("btn-basic-dec").addEventListener("click", () => {
    document.getElementById("val-basic").textContent = basicCounter.decrement();
});

// Лімітований
document.getElementById("btn-limited-inc").addEventListener("click", () => {
    document.getElementById("val-limited").textContent = limitedCounter.increment();
});
document.getElementById("btn-limited-dec").addEventListener("click", () => {
    document.getElementById("val-limited").textContent = limitedCounter.decrement();
});

// З кроком
document.getElementById("btn-step-inc").addEventListener("click", () => {
    document.getElementById("val-step").textContent = stepCounter.increment();
});
document.getElementById("btn-step-dec").addEventListener("click", () => {
    document.getElementById("val-step").textContent = stepCounter.decrement();
});

// З історією
document.getElementById("btn-named-inc").addEventListener("click", () => {
    document.getElementById("val-named").textContent = namedCounter.increment();
});
document.getElementById("btn-named-dec").addEventListener("click", () => {
    document.getElementById("val-named").textContent = namedCounter.decrement();
});
document.getElementById("btn-named-hist").addEventListener("click", () => {
    console.log(`Історія лічильника "${namedCounter.getName()}":`);
    console.table(namedCounter.getHistory());
});