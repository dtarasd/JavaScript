const { ShoppingCart, CartItem } = require("./Practicalwork 1.js");

// група тестів для кошика
describe("ShoppingCart", () => {
    let cart;
    let testProduct;

    // очищуємо, щоб кошик завжди був порожній
    beforeEach(() => {
        cart = new ShoppingCart();
        testProduct = { id: 1, name: "Телефон", price: 10000 };
    });

    test("має додавати новий товар у порожній кошик", () => {
        // додаю 2 телефони
        cart.addItem(testProduct, 2);
        // перевіряю чи кількість одиниць товару дорівнює 2
        expect(cart.getItemCount()).toBe(2);
    });

    test("має оновлювати кількість вже існуючого товару", () => {
        cart.addItem(testProduct, 1);
        // змінюю кількість з 1 на 5
        cart.updateItemQuantity(1, 5);
        expect(cart.getItemCount()).toBe(5);
    });

    test("має видаляти товар з кошика за його id", () => {
        cart.addItem(testProduct, 1);
        cart.removeItem(1);
        // після видалення кошик має бути порожнім
        expect(cart.getItemCount()).toBe(0);
    });

    test("має правильно рахувати загальну вартість без урахування знижок", () => {
        cart.addItem(testProduct, 2);
        // 2 телефони по 10000 = 20000
        expect(cart.getSubtotal()).toBe(20000);
    });

    test("має коректно застосовувати промокод та вираховувати фінальну суму", () => {
        cart.addItem(testProduct, 1);
        // застосовую знижку 10%
        cart.applyDiscount("SALE10");

        // логіка розрахунку:
        // база 10000 - знижка 1000 = 9000
        // податок 20% від 9000 = 1800
        // доставка = 100
        // разом: 9000 + 1800 + 100 = 10900
        expect(cart.getTotal().rawTotal).toBe(10900);
    });

    test("має повністю очищати кошик", () => {
        cart.addItem(testProduct, 1);
        cart.clearCart();
        // перевіряю, що масив товарів порожній
        expect(cart.getItems().length).toBe(0);
    });
});