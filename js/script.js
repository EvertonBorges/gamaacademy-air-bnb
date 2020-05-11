const datas = [];
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

let cardsAmount = 0;
let isLoading = false;

let datasFiltered = [];

function onResizeEvent() {
    reloadCards();

    const width = window.innerWidth;
    const filterHtml = document.getElementById('filters');
    if (width > 992) {
        filterHtml.classList.remove('d-none');
        filterHtml.classList.add('d-flex');
    } else {
        filterHtml.classList.add('d-none');
        filterHtml.classList.remove('d-flex');
    }
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
    // const dataSize = datasFiltered.length;
    cardsAmount += cardsAmount === 0 ? 9 : 3;

    if (cardsAmount >= datasFiltered.length) {
        cardsAmount = datasFiltered.length;
    }
}

function getIcons(details) {
    return details && details.map(detail => {
        switch(detail) {
            case 'Ar-condicionado': return 'snowflake';
            case 'Estacionamento': case 'Estacionamento pago': return 'parking';
            case 'Acessível': return 'wheelchair';
            case 'Wi-Fi': case 'Wi-Fi gratuito': case 'Wi-Fi pago': return 'wifi';
            case 'Piscina': case 'Piscina externa': case 'Piscina coberta': return 'swimmer';
            case 'Serviço de lavanderia': return 'soap';
            case 'Centro Comercial': return 'hotel';
            case 'Serviço de quarto': return 'broom';
            case 'Ideal para crianças': return 'child';
            case 'Restaurante': case 'Cozinha em alguns quartos': return 'utensils';
            case 'Academia': return 'dumbbell';
            case 'Bar': return 'glass-martini-alt';
            case 'Proibido fumar': return 'smoking-ban';
            case 'Acesso à praia': return 'umbrella-beach';
            case 'Translado do aeroporto': return 'bus-alt';
            case 'Café da manhã incluído': return 'coffee';
            case 'Pacote com tudo incluído disponível': return 'people-carry';
            case 'Permite animais': return 'paw';
            case 'Banheira quente': case 'Spa': return 'hot-tub';
            default: return 'wifi';
        }
    });
}

function getCard(data) {
    const { photo, name, description, propertyType, price, maxPrice, details } = data;
    const textPrice = price === maxPrice ? price : `${price}~${maxPrice}`;
    const icons = getIcons(details);

    let inMaxSize = false;

    return `
        <article class="col-sm-12 col-md-6 col-lg-4">
            <div class="card mb-4">
                <div>
                    <div class="card-top-title">
                        <div class="d-flex justify-content-between pt-2 pl-3 pr-3">
                            <label>${name}</label>
                            <a href="#"><i class="far fa-heart"></i></a>
                        </div>
                    </div>
                    <img src=${photo} class="card-img-top" alt="${name}">
                </div>
                <div class="card-body">
                    <div class="card-title d-flex justify-content-between mb-2">
                        <label class="mb-0"><h5>${propertyType}</h5></label>
                        <div class="d-flex justify-contet-right align-items-center">
                            <label class="mb-0"><h6>${textPrice} <span>/noite</span></h6></label>
                        </div>
                    </div>
                    <label class="mb-0"><h6 class="card-subtitle mb-2 text-muted">${description}</h6></label>
                    <div class="d-flex justify-content-center mb-4">
                        <a href="#" class="card-reserve btn btn-airbnb-radial" onmousemove="onMouseMoveEvent(event)">Reservar</a>
                    </div>
                    <div class="d-flex justify-content-left mb-1">
                    ${
                        details &&
                        details.reduce((previous, actual) => {
                            const index = details.indexOf(actual);
                            if (index < 2) {
                                inMaxSize = true;
                                return previous + `<a href="#" class="card-detail btn btn-outline-dark rounded-pill mr-2 mb-1"><i class="fas fa-${icons[index]}"></i> ${actual}</a>`;
                            } else if (inMaxSize) {
                                inMaxSize = false;
                                return previous + `
                                        </div>
                                        <div class="d-flex justify-content-center">
                                            <div class="card-show-more btn">
                                                <a href="#">Mostrar mais <i class="fas fa-chevron-down"></i></a>
                                            </div>
                                    `;
                            } else {
                                return previous;
                            }
                        }, '')  
                    }
                    </div>
                </div>
            </div>
        </article>
    `
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

function getDetails(details = '') {
    const detailsList = details.replace('[', '').replace(']', '').split(',');
    if (detailsList.length === 0) return null;
    if (detailsList.length === 1 && detailsList[0] === '') return null;
    return detailsList;
}

function getDataFiltered(text) {
    if (text) {
        return datas.filter(data => 
            data.name.includes(text) || 
            data.description.includes(text) || 
            data.city.includes(text) || 
            data.state.includes(text) || 
            data.propertyType.includes(text));
    } else {
        return [...datas];
    }
}

function reloadCardsByFilter() {
    const text = document.getElementById('filterText').value;
    datasFiltered = getDataFiltered(text);

    cardsAmount = 0;

    const cardsHtml = document.getElementById('cards');
    const width = window.innerWidth;

    cardsHtml.innerHTML = '';
    
    let actualIndex = cardsAmount;
    const amountColumns = getAmountColumns(width);
    const lastAmountRow = getAmountRows(cardsAmount, amountColumns);

    incrementCardsAmount();
    const amountRows = getAmountRows(cardsAmount, amountColumns);

    for (let i = lastAmountRow; i < amountRows; i++) {
        const row = document.createElement('div');
        row.className = 'row mb-5';
        for (let j = 0; j < amountColumns && actualIndex < cardsAmount; j++) {
            const { photo, name, description, propertyType, price, maxPrice, details } = datasFiltered[actualIndex];
            const detailsList = getDetails(details);
            const formattedPrice = currencyFormatter.format(price);
            const formattedMaxPrice = currencyFormatter.format(maxPrice)
            const card = getCard({ photo, name, description, propertyType, price: formattedPrice, maxPrice: formattedMaxPrice, details: detailsList });

            row.innerHTML += card;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }

    if (cardsAmount < datasFiltered.length) {
        const loader = createLoader();
        cardsHtml.appendChild(loader);
    }
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
            const { photo, name, propertyType, price, maxPrice, details, description } = datasFiltered[actualIndex];
            const detailsList = getDetails(details);
            const formattedPrice = currencyFormatter.format(price);
            const formattedMaxPrice = currencyFormatter.format(maxPrice)
            const card = getCard({ photo, name, description, propertyType, price: formattedPrice, maxPrice: formattedMaxPrice, details: detailsList });

            row.innerHTML += card;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }

    if (cardsAmount < datasFiltered.length) {
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
            const { photo, name, description, propertyType, price, maxPrice, details } = datasFiltered[actualIndex];
            const detailsList = getDetails(details);
            const formattedPrice = currencyFormatter.format(price);
            const formattedMaxPrice = currencyFormatter.format(maxPrice)
            const card = getCard({ photo, name, description, propertyType, price: formattedPrice, maxPrice: formattedMaxPrice, details: detailsList });

            row.innerHTML += card;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }

    if (cardsAmount < datasFiltered.length) {
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

fetch('https://v2-api.sheety.co/65262d7029ebf13f074f328915540e37/airbnbClone/locals').then(response => {
    if (response.ok) {
        response.json().then(body => {
            datas.push(...body.locals);
            datasFiltered.push(...datas);
            const cardsHtml = document.getElementById('cards');
            cardsHtml.innerHTML = '';

            loadCards();
        });
    }
}).catch(error => console.log(error));