document.addEventListener('DOMContentLoaded', () => {
    loadLandingsFromLocalStorage(); // завантажуємо лендінги при завантаженні сторінки
});

const landings = [];

const allOffers = [
    { id: 1, name: 'acreditkz', img: '../images/banks/acreditkz.png' },
    { id: 2, name: 'cashradarkz', img: '../images/banks/cashradarkz.svg' },
    { id: 3, name: 'creditpluskz', img: '../images/banks/creditpluskz.svg' },
    { id: 4, name: 'credity360', img: '../images/banks/credity360.png' }
];

// Зберігати вибрані офери по id
const landingOffers = {};

// Завантажити з localStorage при першому завантаженні сторінки
function loadFromLocalStorage() {
    const savedLandings = JSON.parse(localStorage.getItem('landings'));
    const savedLandingOffers = JSON.parse(localStorage.getItem('landingOffers'));

    if (savedLandings) {
        landings.length = 0; // очищаємо поточний масив
        landings.push(...savedLandings);
    }

    if (savedLandingOffers) {
        Object.assign(landingOffers, savedLandingOffers);
    }

    renderTable();
}

function saveToLocalStorage() {
    localStorage.setItem('landings', JSON.stringify(landings));
    localStorage.setItem('landingOffers', JSON.stringify(landingOffers));
}

// Відображення таблиці
function renderTable() {
    const tbody = document.getElementById('landingTable');
    tbody.innerHTML = '';

    landings.forEach(landing => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${landing.id}</td>
        <td>${landing.name}</td>
        <td><button class="edit" onclick="editOffers(${landing.id})">Редактировать</button></td>
      `;
        tbody.appendChild(tr);
    });
}

// Відкрити модальне вікно
let currentLandingId = null;

function editOffers(id) {
    currentLandingId = id;
    const landing = landings.find(l => l.id === id);
    document.getElementById('landingName').innerText = landing.name;

    const selected = landingOffers[id] || [];
    renderSelectedOffers(selected);
    renderAvailableOffers(selected);

    document.getElementById('offerModal').style.display = 'flex';
}

function renderAvailableOffers(selected) {
    const container = document.getElementById('availableOffers');
    container.innerHTML = '';

    allOffers.forEach(offer => {
        const alreadySelected = selected.find(o => o.id === offer.id);
        if (alreadySelected) return;

        const div = document.createElement('div');
        div.className = 'offer-card';
        div.innerHTML = `
        <img src="${offer.img}" alt="${offer.name}" />
        <p>${offer.name}</p>
        <button class="add-offer" onclick="addOffer(${offer.id})">Добавить</button>
      `;
        container.appendChild(div);
    });
}
function renderSelectedOffers(selected) {
    const ul = document.getElementById('offerList');
    ul.innerHTML = '';

    selected.forEach((offer, i) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.index = i;
        li.innerHTML = `
        <img src="${offer.img}" width="50" />
        <span>${offer.name}</span>
        <button onclick="removeOffer(${offer.id})">Удалить</button>
      `;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('drop', drop);
        li.addEventListener('dragover', e => e.preventDefault());
        ul.appendChild(li);
    });
}
function addOffer(offerId) {
    const offer = allOffers.find(o => o.id === offerId);
    const selected = landingOffers[currentLandingId] || [];
    selected.push(offer);
    landingOffers[currentLandingId] = selected;

    renderSelectedOffers(selected);
    renderAvailableOffers(selected);
    saveToLocalStorage(); // Зберігаємо в localStorage після додавання
}
function removeOffer(offerId) {
    const selected = landingOffers[currentLandingId] || [];
    const updatedSelected = selected.filter(o => o.id !== offerId);
    landingOffers[currentLandingId] = updatedSelected;

    // Оновлюємо UI та зберігаємо в localStorage
    renderSelectedOffers(updatedSelected);
    saveToLocalStorage();
}

function closeModal() {
    document.getElementById('offerModal').style.display = 'none';
}

let dragSrcEl = null;

function dragStart(e) {
    dragSrcEl = e.target;
}

function drop(e) {
    e.preventDefault();
    if (dragSrcEl === e.target) return;

    const list = document.getElementById('offerList');
    const items = Array.from(list.children);
    const fromIndex = items.indexOf(dragSrcEl);
    const toIndex = items.indexOf(e.target);

    const selected = landingOffers[currentLandingId];
    const movedItem = selected.splice(fromIndex, 1)[0];
    selected.splice(toIndex, 0, movedItem);

    renderSelectedOffers(selected);
}

// Зберегти офери
function saveOffers() {
    console.log('Збережено:', landingOffers[currentLandingId]);
    saveToLocalStorage(); // Зберігаємо всі зміни в localStorage
    closeModal();
}

function loadLandingsFromLocalStorage() {
    const savedLandings = JSON.parse(localStorage.getItem('landings'));
    if (savedLandings) {
        landings.length = 0; // очищаємо поточний масив
        landings.push(...savedLandings); // додаємо збережені лендінги
        renderTable(); // оновлюємо таблицю
    }
}

loadFromLocalStorage();
renderTable();

function addLanding() {
    const input = document.getElementById('newLandingName');
    const name = input.value.trim();
    if (!name) {
        alert("Введіть назву лендінга");
        return;
    }

    const newId = landings.length > 0 ? landings[landings.length - 1].id + 1 : 1;

    landings.push({ id: newId, name });
    input.value = ''; // очистити поле

    renderTable(); // оновити таблицю
}