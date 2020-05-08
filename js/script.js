const datas = [];
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

let cardsAmount = 0;
let isLoading = false;

function onResizeEvent() {
    reloadCards();
}

function onScrollEvent() {
    const loader = document.getElementById('loader');

    if (loader && isVisible(loader) && !isLoading) {
        isLoading = true;

        setTimeout(() => {
            loadCards();
            isLoading = false;
            loader.remove();
        }, 500);
    }
}

function getAmountColumns(width) {
    return width < 768 ? 1 : (width < 992 ? 2 : 3);
}

function getAmountRows(amountCards, amountColumns) {
    return amountCards % amountColumns == 0 ? amountCards / amountColumns : Number((amountCards / amountColumns).toFixed()) + 1;
}

function incrementCardsAmount() {
    cardsAmount += cardsAmount === 0 ? 9 : 3;

    if (cardsAmount >= datas.length) {
        cardsAmount = datas.length;
    }
}

function getCard(data) {
    const { photo, name, property_type, price } = data;
    return `
        <article class="col-sm-12 col-md-6 col-lg-4">
            <div class="card">
                <img src="${photo}" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${price}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${property_type}</h6>
                    <p class="card-text">${name}</p>
                    <div class="d-flex justify-content-center align-items-end">
                        <a href="#" class="btn btn-outline-danger">Alugar</a>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function createLoader() {
    const centerDivRow = document.createElement('div');
    centerDivRow.className = 'row d-flex justify-content-center';

    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.className = 'spinner-border';
    loader.role = 'status';
    loader.innerHTML = '<span class="sr-only">Carregando...</span>'

    centerDivRow.appendChild(loader);

    return centerDivRow;
}

function reloadCards() {
    const cardsHtml = document.getElementById('cards');
    const width = window.innerWidth;

    cardsHtml.innerHTML = '';
    
    let actualIndex = 0;
    const amountColumns = getAmountColumns(width);
    const amountRows = getAmountRows(cardsAmount, amountColumns);

    for (let i = 0; i < amountRows; i++) {
        const row = document.createElement('div');
        row.className = 'row mb-5';

        for (let j = 0; j < amountColumns && actualIndex < cardsAmount; j++) {
            const { photo, name, property_type, price } = datas[actualIndex];
            const formattedPrice = currencyFormatter.format(price);
            const card = getCard({ photo, name, property_type, price: formattedPrice });

            row.innerHTML += card;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }

    if (cardsAmount < datas.length) {
        const loader = createLoader();
        cardsHtml.appendChild(loader);
    }
}

function loadCards() {
    const cardsHtml = document.getElementById('cards');
    const width = window.innerWidth;
    
    let actualIndex = cardsAmount;
    const amountColumns = getAmountColumns(width);
    const lastAmountRow = getAmountRows(cardsAmount, amountColumns);

    incrementCardsAmount();
    const amountRows = getAmountRows(cardsAmount, amountColumns);

    for (let i = lastAmountRow; i < amountRows; i++) {
        const row = document.createElement('div');
        row.className = 'row mb-5';
        for (let j = 0; j < amountColumns && actualIndex < cardsAmount; j++) {
            const { photo, name, property_type, price } = datas[actualIndex];
            const formattedPrice = currencyFormatter.format(price);
            const card = getCard({ photo, name, property_type, price: formattedPrice });

            row.innerHTML += card;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }

    if (cardsAmount < datas.length) {
        const loader = createLoader();
        cardsHtml.appendChild(loader);
    }
}

// font: https://www.it-swarm.dev/pt/javascript/verificar-se-o-elemento-esta-visivel-no-dom/1043392274/
function isVisible(elem) {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72').then(response => {
    if (response.ok) {
        response.json().then(body => {
            datas.push(...body);
            const cardsHtml = document.getElementById('cards');
            cardsHtml.innerHTML = '';

            loadCards();
        });
    }
}).catch(error => console.log(error));