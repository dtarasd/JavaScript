function processProducts(products) {
    // Фільтруємо товари, що є в наявності
    const availableProducts = products.filter(product => product.inStock);

    // Отримуємо масив назв товарів у наявності
    const available = availableProducts.map(product => product.name);

    // Рахуємо загальну ціну товарів у наявності
    const totalPrice = availableProducts.reduce((sum, product) => sum + product.price, 0);

    // Знаходимо назву найдешевшого товару в наявності
    // Створюємо копію масиву та сортуємо за ціною, щоб отримати найменший елемент
    const cheapest = availableProducts.length > 0
        ? [...availableProducts].sort((a, b) => a.price - b.price)[0].name
        : undefined;

    // Формуємо список цін для всіх товарів
    const priceList = products.map(product => `${product.name} — ${product.price} грн`);

    return {
        available,
        totalPrice,
        cheapest,
        priceList
    };
}

const products = [
    { name: "Чай", price: 50, inStock: true },
    { name: "Кава", price: 120, inStock: false },
    { name: "Цукор", price: 30, inStock: true }
];

console.log(processProducts(products));