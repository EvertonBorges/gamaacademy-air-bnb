const datas = [];

function onResizeEvent() {
    const cardsHtml = document.getElementById('cards');
    const width = window.innerWidth;

    const listSize = datas.length;

    const amountColumns = width < 768 ? 1 : (width < 992 ? 2 : 3);
    const amountRows = listSize % amountColumns == 0 ? listSize / amountColumns : Number((listSize / amountColumns).toFixed()) + 1;

    cardsHtml.innerHTML = '';

    let actualIndex = 0;
    for (let i = 0; i < amountRows; i++) {
        const row = document.createElement('div');
        row.className = 'row mb-5';
        for (let j = 0; j < amountColumns && actualIndex < listSize; j++) {
            const { photo, name, property_type, price } = datas[actualIndex];
            
            const formattedPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

            row.innerHTML += `
                <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card">
                        <img src="${photo}" class="card-img-top" alt="${name}">
                        <div class="card-body">
                            <h5 class="card-title">${formattedPrice}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${property_type}</h6>
                            <p class="card-text">${name}</p>
                            <div class="d-flex justify-content-center align-items-end">
                                <a href="#" class="btn btn-primary">Alugar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            actualIndex++;
        }

        cardsHtml.appendChild(row);
    }
}

fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72').then(response => {
    if (response.ok) {
        response.json().then(body => {
            datas.push(...body);
            onResizeEvent();
        });
    }
}).catch(error => console.log(error));