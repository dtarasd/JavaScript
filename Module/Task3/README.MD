# API Client

Утиліта `createApiClient` для виконання мережевих запитів.

## Особливості
- Використання **замикання** для зберігання `baseUrl` та лічильника запитів.
- Асинхронний метод `get(path)` з обробкою помилок через `try...catch`.
- Метод `getRequestCount()` для моніторингу активності.

## Приклад
```javascript
const api = createApiClient("[https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com)");
const user = await api.get("/users/1");
console.log(api.getRequestCount()); // 1