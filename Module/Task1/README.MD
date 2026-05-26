# Аналіз чисел

Функція `summarizeNumbers(numbers)` приймає масив чисел і повертає об'єкт зі статистикою.

## Функціонал
- `count`: Загальна кількість чисел.
- `sum`: Сума всіх чисел.
- `evenCount`: Кількість парних чисел.
- `max`: Найбільше число (або `undefined` для порожнього масиву).
- `category`: "empty" для порожнього масиву, "positive" якщо сума > 0, "non-positive" в іншому випадку.

## Як використовувати
```javascript
const result = summarizeNumbers([4, 7, 2, 9]);
console.log(result);