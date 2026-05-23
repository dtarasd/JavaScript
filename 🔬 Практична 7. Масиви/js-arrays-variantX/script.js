// функція для генерації масиву з випадковими числами
function generateArray(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 10000));
    }
    return arr;
}

// сортування бульбашкою
function bubbleSort(arr) {
    let a = [...arr];
    let comp = 0, swaps = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            comp++;
            if (a[j] > a[j + 1]) {
                swaps++;
                let t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
            }
        }
    }
    return { name: 'Bubble Sort', comp, swaps };
}

// сортування вибором
function selectionSort(arr) {
    let a = [...arr];
    let comp = 0, swaps = 0;
    for (let i = 0; i < a.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < a.length; j++) {
            comp++;
            if (a[j] < a[min]) min = j;
        }
        if (min !== i) {
            swaps++;
            let t = a[i];
            a[i] = a[min];
            a[min] = t;
        }
    }
    return { name: 'Selection Sort', comp, swaps };
}

// сортування вставками
function insertionSort(arr) {
    let a = [...arr];
    let comp = 0, swaps = 0;
    for (let i = 1; i < a.length; i++) {
        let key = a[i];
        let j = i - 1;
        while (j >= 0) {
            comp++;
            if (a[j] > key) {
                swaps++;
                a[j + 1] = a[j];
                j--;
            } else {
                break;
            }
        }
        a[j + 1] = key;
    }
    return { name: 'Insertion Sort', comp, swaps };
}

// злиттям (тут замість обмінів рахуємо записи у масив)
function mergeSort(arr) {
    let a = [...arr];
    let comp = 0, writes = 0;

    function merge(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);
        for (let i = 0; i < n1; i++) L[i] = a[l + i];
        for (let j = 0; j < n2; j++) R[j] = a[m + 1 + j];

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            comp++;
            if (L[i] <= R[j]) {
                a[k] = L[i]; i++;
            } else {
                a[k] = R[j]; j++;
            }
            writes++; k++;
        }
        while (i < n1) { a[k] = L[i]; i++; k++; writes++; }
        while (j < n2) { a[k] = R[j]; j++; k++; writes++; }
    }

    function sort(l, r) {
        if (l < r) {
            let m = Math.floor(l + (r - l) / 2);
            sort(l, m);
            sort(m + 1, r);
            merge(l, m, r);
        }
    }

    sort(0, a.length - 1);
    return { name: 'Merge Sort', comp, swaps: writes };
}

// швидке сортування
function quickSort(arr) {
    let a = [...arr];
    let comp = 0, swaps = 0;

    function partition(low, high) {
        let pivot = a[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            comp++;
            if (a[j] < pivot) {
                i++;
                swaps++;
                let t = a[i];
                a[i] = a[j];
                a[j] = t;
            }
        }
        swaps++;
        let t = a[i + 1];
        a[i + 1] = a[high];
        a[high] = t;
        return i + 1;
    }

    function sort(low, high) {
        if (low < high) {
            let pi = partition(low, high);
            sort(low, pi - 1);
            sort(pi + 1, high);
        }
    }

    sort(0, a.length - 1);
    return { name: 'Quick Sort', comp, swaps };
}

// логіка для запуску тестування по кліку
document.getElementById('run-btn').addEventListener('click', () => {
    // беремо розміри 100 та 1000, щоб браузер не завис від бульбашки на 5000
    const sizes = [100, 1000];
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Виконуються розрахунки...';

    setTimeout(() => {
        let html = '';
        sizes.forEach(size => {
            const arr = generateArray(size);
            html += `<div class="result-block"><h4>Масив на ${size} випадкових елементів</h4><ul>`;

            const results = [
                bubbleSort(arr),
                selectionSort(arr),
                insertionSort(arr),
                mergeSort(arr),
                quickSort(arr)
            ];

            results.forEach(res => {
                html += `<li>${res.name}: ${res.comp} порівнянь, ${res.swaps} обмінів/операцій</li>`;
            });

            html += '</ul></div>';
        });
        resultsDiv.innerHTML = html;
    }, 100);
});