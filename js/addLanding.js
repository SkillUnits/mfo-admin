let selectedOffers = [];

function renderOfferLists() {
    const cplContainer = document.getElementById('cplOffers');
    const cpsContainer = document.getElementById('cpsOffers');
    cplContainer.innerHTML = '';
    cpsContainer.innerHTML = '';

    allOffers.forEach(offer => {
        if (selectedOffers.some(o => o.id === offer.id)) return; // якщо вже вибрано, не показуємо

        const card = document.createElement('div');
        card.className = 'offer-card';
        card.innerHTML = `
            <img src="${offer.img}" alt="">
            <p>${offer.name}</p>
            <button onclick="addToSelected(${offer.id})">Добавить</button>
        `;

        if (offer.type === 'CPL') {
            cplContainer.appendChild(card);
        } else if (offer.type === 'CPS') {
            cpsContainer.appendChild(card);
        }
    });
}

function addToSelected(id) {
    const offer = allOffers.find(o => o.id === id);
    if (offer && !selectedOffers.some(o => o.id === id)) {
        selectedOffers.push(offer);
        renderSelectedOffers();
        renderOfferLists(); // перерендерити CPL/CPS
    }
}


document.getElementById('selectedOffers').addEventListener('drop', function (e) {
    e.preventDefault();
    const offerId = parseInt(e.dataTransfer.getData('text/plain'));
    const offer = allOffers.find(o => o.id === offerId);
    if (offer) {
        selectedOffers.push(offer); // масив для новоствореного лендінга
        renderSelectedOffers();
    }
});

function renderSelectedOffers() {
    const ul = document.getElementById('selectedOffers');
    ul.innerHTML = '';
    selectedOffers.forEach((offer, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${offer.img}" width="50">
            <span>${offer.name}</span>
            <button onclick="removeFromSelected(${offer.id})">Удалить</button>
        `;
        ul.appendChild(li);
    });
}

function removeFromSelected(id) {
    selectedOffers = selectedOffers.filter(o => o.id !== id);
    renderSelectedOffers();
    renderOfferLists(); // повернути в список CPL/CPS
}

function saveNewLanding() {
    const name = document.getElementById('landingNameInput').value.trim();
    const header = document.getElementById('landingHeaderInput').value.trim();

    if (!name || !header || selectedOffers.length === 0) {
        alert('Заповніть усі поля і додайте офферы!');
        return;
    }

    const newLanding = {
        id: Date.now(),
        name,
        header,
        offers: [...selectedOffers]
    };

    landings.push(newLanding);
    saveLandingsToLocalStorage();
    renderTable();
    showLandingList(); // Повернення до таблиці

    // Очистка
    selectedOffers = [];
    document.getElementById('landingNameInput').value = '';
    document.getElementById('landingHeaderInput').value = '';
}

function saveLandingsToLocalStorage() {
    localStorage.setItem('landings', JSON.stringify(landings));
}

function showLandingList() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('createPage').style.display = 'none';
}

function showCreateLanding() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('createPage').style.display = 'block';

    renderOfferLists(); // завантажити cpl і cps
}