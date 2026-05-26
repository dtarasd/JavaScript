function createApiClient(baseUrl) {
    let requestCount = 0;

    return {
        get: async function(path) {
            requestCount++;
            try {
                const response = await fetch(baseUrl + path);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return await response.json();
            } catch (error) {
                return {
                    error: "Запит не вдався"
                };
            }
        },
        getRequestCount: function() {
            return requestCount;
        }
    };
}

// Приклад використання:
(async () => {
    const api = createApiClient("https://jsonplaceholder.typicode.com");

    const user = await api.get("/users/1");
    console.log("Користувач:", user);

    const posts = await api.get("/posts");
    console.log("Кількість постів:", posts.length);

    console.log("Кількість запитів:", api.getRequestCount());
})();