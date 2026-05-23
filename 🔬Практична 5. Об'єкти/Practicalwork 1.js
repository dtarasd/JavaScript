class CartItem {
    constructor(product, quantity, price) {
        this.product = { ...product };
        this.quantity = quantity;
        this.price = price;
    }

    updateQuantity(quantity) {
        return new CartItem(this.product, quantity, this.price);
    }

    getSubtotal() {
        return this.price * this.quantity;
    }
}

class ShoppingCart {
    #items;
    #discountCode;
    #discountAmount;
    #taxRate;
    #deliveryCost;

    constructor() {
        this.#items = [];
        this.#discountCode = null;
        this.#discountAmount = 0;
        this.#taxRate = 0.20;
        this.#deliveryCost = 100;
    }

    addItem(product, quantity = 1) {
        const existingItemIndex = this.#items.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
            const existingItem = this.#items[existingItemIndex];
            const updatedItem = existingItem.updateQuantity(existingItem.quantity + quantity);

            this.#items = [
                ...this.#items.slice(0, existingItemIndex),
                updatedItem,
                ...this.#items.slice(existingItemIndex + 1)
            ];
        } else {
            const newItem = new CartItem(product, quantity, product.price);
            this.#items = [...this.#items, newItem];
        }
    }

    removeItem(productId) {
        this.#items = this.#items.filter(item => item.product.id !== productId);
    }

    updateItemQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        this.#items = this.#items.map(item => {
            if (item.product.id === productId) {
                return item.updateQuantity(quantity);
            }
            return item;
        });
    }

    clearCart() {
        this.#items = [];
        this.#discountCode = null;
        this.#discountAmount = 0;
    }

    getItems() {
        return [...this.#items];
    }

    getItemCount() {
        return this.#items.reduce((count, item) => count + item.quantity, 0);
    }

    getSubtotal() {
        return this.#items.reduce((sum, item) => sum + item.getSubtotal(), 0);
    }

    applyDiscount(code) {
        const validCodes = {
            "SALE10": 0.10,
            "STUDENT20": 0.20
        };

        if (validCodes[code]) {
            this.#discountCode = code;
            this.#discountAmount = validCodes[code];
        } else {
            console.error("Помилка: невірний промокод");
        }
    }

    #formatPrice(price) {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH'
        }).format(price);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const discountValue = subtotal * this.#discountAmount;
        const discountedSubtotal = subtotal - discountValue;

        const taxValue = discountedSubtotal * this.#taxRate;
        const finalDeliveryCost = this.getItemCount() > 0 ? this.#deliveryCost : 0;

        const total = discountedSubtotal + taxValue + finalDeliveryCost;

        return {
            subtotal: this.#formatPrice(subtotal),
            discount: this.#formatPrice(discountValue),
            tax: this.#formatPrice(taxValue),
            delivery: this.#formatPrice(finalDeliveryCost),
            total: this.#formatPrice(total),
            rawTotal: total
        };
    }
}

const cart = new ShoppingCart();

const laptop = { id: 1, name: "Ноутбук", price: 35000 };
const mouse = { id: 2, name: "Мишка", price: 1200 };

cart.addItem(laptop, 1);
cart.addItem(mouse, 2);

console.log("Загальна кількість речей:", cart.getItemCount());
console.log("Сума до застосування знижки:", cart.getSubtotal());

cart.applyDiscount("STUDENT20");
cart.updateItemQuantity(2, 3);

console.log("Деталізований чек:");
console.log(cart.getTotal());

module.exports = { ShoppingCart, CartItem };