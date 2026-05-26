function summarizeNumbers(numbers) {
    // Перевірка на порожній масив, щоб уникнути помилок при розрахунках
    if (numbers.length === 0) {
        return {
            count: 0,
            sum: 0,
            evenCount: 0,
            max: undefined,
            category: "empty"
        };
    }

    // Ініціалізація змінних для підрахунку
    let count = numbers.length;
    let sum = 0;
    let evenCount = 0;
    let max = numbers[0]; // Припускаємо, що перше число є найбільшим

    // Цикл для перебору всіх елементів масиву
    for (let i = 0; i < numbers.length; i++) {
        let current = numbers[i];

        // Додаємо поточне число до загальної суми
        sum += current;

        // Перевіряємо, чи є число парним
        if (current % 2 === 0) {
            evenCount++;
        }

        // Оновлюємо максимальне значення, якщо поточне число більше
        if (current > max) {
            max = current;
        }
    }

    // Визначаємо категорію на основі суми
    let category = sum > 0 ? "positive" : "non-positive";

    // Повертаємо об'єкт із зібраною статистикою
    return {
        count,
        sum,
        evenCount,
        max,
        category
    };
}

// Тестування роботи функції
const data = [4, 7, 2, 9];
console.log(summarizeNumbers(data));

console.log("--- Додаткові тести ---");

// Тест 1: Масив з одним від'ємним числом
console.log("Один від'ємний елемент:", summarizeNumbers([-5]));
// Очікувано: { count: 1, sum: -5, evenCount: 0, max: -5, category: "non-positive" }

// Тест 2: Масив з нулем
console.log("Масив з нулем:", summarizeNumbers([0]));
// Очікувано: { count: 1, sum: 0, evenCount: 1, max: 0, category: "non-positive" }

// Тест 3: Масив тільки з парними числами
console.log("Тільки парні:", summarizeNumbers([2, 4, 6]));
// Очікувано: { count: 3, sum: 12, evenCount: 3, max: 6, category: "positive" }

// Тест 4: Масив з великими числами
console.log("Великі числа:", summarizeNumbers([1000, 2000]));
// Очікувано: { count: 2, sum: 3000, evenCount: 2, max: 2000, category: "positive" }

// Тест 5: Масив з від'ємними та додатними числами
console.log("Змішані числа:", summarizeNumbers([-10, 10, 5]));
// Очікувано: { count: 3, sum: 5, evenCount: 1, max: 10, category: "positive" }