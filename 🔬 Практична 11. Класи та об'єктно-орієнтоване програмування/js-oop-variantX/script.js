// --- Ієрархія класів ---

// Базовий клас
class Vehicle {
    // Приватні поля для інкапсуляції
    #mileage;
    #fuelLevel;

    constructor(brand, model, year) {
        this.id = Date.now().toString() + Math.floor(Math.random() * 1000);
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.#mileage = 0;
        this.#fuelLevel = 100; // Початковий рівень палива (відсотки або літри)
    }

    // Геттери для доступу до приватних полів
    get mileage() {
        return this.#mileage;
    }

    get fuelLevel() {
        return this.#fuelLevel;
    }

    // Методи
    drive(distance) {
        const fuelNeeded = distance * 0.1; // Умовна витрата
        if (this.#fuelLevel >= fuelNeeded) {
            this.#mileage += distance;
            this.#fuelLevel -= fuelNeeded;
            return true;
        }
        return false; // Недостатньо палива
    }

    refuel(amount) {
        this.#fuelLevel += amount;
        if (this.#fuelLevel > 100) this.#fuelLevel = 100;
    }

    getMaintenance() {
        return this.#mileage * 0.5; // Базова вартість обслуговування
    }

    // Статичний метод для пошуку/фільтрації
    static filterByType(vehicles, TypeClass) {
        return vehicles.filter(v => v instanceof TypeClass);
    }
}

// Спадкоємці
class Car extends Vehicle {
    constructor(brand, model, year, doors, transmission = "автомат") {
        super(brand, model, year); // Виклик конструктора базового класу
        this.doors = doors;
        this.transmission = transmission;
    }

    // Поліморфізм: перевизначення методу
    getMaintenance() {
        return super.getMaintenance() + 100; // Легкові обходяться трохи дорожче базової ставки
    }
}

class Truck extends Vehicle {
    constructor(brand, model, year, loadCapacity) {
        super(brand, model, year);
        this.loadCapacity = loadCapacity;
        this.isLoaded = false;
    }

    toggleLoad() {
        this.isLoaded = !this.isLoaded;
    }

    getMaintenance() {
        return super.getMaintenance() * 2; // Вантажівки дорожчі в обслуговуванні
    }
}

class Motorcycle extends Vehicle {
    constructor(brand, model, year, type) {
        super(brand, model, year);
        this.type = type; // спортивний/круїзер
    }
}

// Клас управління автопарком
class Fleet {
    constructor() {
        this.vehicles = [];
    }

    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
    }

    removeVehicle(id) {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
    }

    getAverageMileage() {
        if (this.vehicles.length === 0) return 0;
        const total = this.vehicles.reduce((sum, v) => sum + v.mileage, 0);
        return (total / this.vehicles.length).toFixed(1);
    }

    getTotalMaintenance() {
        return this.vehicles.reduce((sum, v) => sum + v.getMaintenance(), 0);
    }
}

// --- UI Логіка ---

const myFleet = new Fleet();

// Додамо кілька стартових машин
myFleet.addVehicle(new Car("Toyota", "Camry", 2020, 4));
myFleet.addVehicle(new Truck("Volvo", "FH16", 2018, 20000));
myFleet.addVehicle(new Motorcycle("Yamaha", "R1", 2022, "Спортивний"));

const listContainer = document.getElementById("fleet-list");

function renderFleet(vehiclesArray) {
    listContainer.innerHTML = "";
    vehiclesArray.forEach(v => {
        const typeName = v.constructor.name;
        let extraInfo = "";

        if (v instanceof Car) extraInfo = `Двері: ${v.doors}, Трансмісія: ${v.transmission}`;
        if (v instanceof Truck) extraInfo = `Вантажопідйомність: ${v.loadCapacity} кг`;
        if (v instanceof Motorcycle) extraInfo = `Тип: ${v.type}`;

        const card = document.createElement("div");
        card.className = "vehicle-card";
        card.innerHTML = `
            <div>
                <strong>${v.brand} ${v.model} (${v.year}) - ${typeName}</strong><br>
                <small>${extraInfo}</small><br>
                Пробіг: <span id="mil-${v.id}">${v.mileage}</span> км | Паливо: <span id="fuel-${v.id}">${v.fuelLevel.toFixed(1)}</span>%
            </div>
            <div>
                <button onclick="driveVehicle('${v.id}')">Їхати (100 км)</button>
                <button onclick="refuelVehicle('${v.id}')" style="background:#198754;">Заправити (+20%)</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// Функції для кнопок на картках
window.driveVehicle = function(id) {
    const v = myFleet.vehicles.find(v => v.id === id);
    if (v) {
        if (!v.drive(100)) {
            alert("Недостатньо палива!");
        } else {
            document.getElementById(`mil-${id}`).textContent = v.mileage;
            document.getElementById(`fuel-${id}`).textContent = v.fuelLevel.toFixed(1);
        }
    }
};

window.refuelVehicle = function(id) {
    const v = myFleet.vehicles.find(v => v.id === id);
    if (v) {
        v.refuel(20);
        document.getElementById(`fuel-${id}`).textContent = v.fuelLevel.toFixed(1);
    }
};

// Додавання через форму
document.getElementById("btn-add").addEventListener("click", () => {
    const type = document.getElementById("v-type").value;
    const brand = document.getElementById("v-brand").value || "Unknown";
    const model = document.getElementById("v-model").value || "Model";
    const year = Number(document.getElementById("v-year").value) || 2023;
    const extra = document.getElementById("v-extra").value || "Standard";

    let newVehicle;
    if (type === "Car") newVehicle = new Car(brand, model, year, extra);
    else if (type === "Truck") newVehicle = new Truck(brand, model, year, extra);
    else newVehicle = new Motorcycle(brand, model, year, extra);

    myFleet.addVehicle(newVehicle);
    renderFleet(myFleet.vehicles);
});

// Статистика та фільтри
document.getElementById("btn-stats").addEventListener("click", () => {
    const avgMil = myFleet.getAverageMileage();
    const totalMaint = myFleet.getTotalMaintenance();
    document.getElementById("stats-output").textContent = `Середній пробіг: ${avgMil} км | Загальна вартість обслуговування: ${totalMaint} грн`;
});

document.getElementById("btn-filter-car").addEventListener("click", () => {
    // Використання статичного методу
    const carsOnly = Vehicle.filterByType(myFleet.vehicles, Car);
    renderFleet(carsOnly);
});

document.getElementById("btn-show-all").addEventListener("click", () => {
    renderFleet(myFleet.vehicles);
});

// Початковий рендер
renderFleet(myFleet.vehicles);