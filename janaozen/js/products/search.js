const searchedItems = document.getElementById("searched-items")




function displayList(array) {
    array.map((a) => {
        var formatter = function(priceSum) {
            let mn = 0;
            let price = priceSum.toString()
            for (let ij = price.length; ij > 0; ij--) {
                if (mn % 3 == 0) {
                    price = [price.slice(0, ij), " ", price.slice(ij)].join('');
                }
                mn++;
            }
            return price;
        }

        let item = document.createElement('div');
        item.classList.add("d__card");

        item.innerHTML = `
        <a class="search-container-tag" href="${a.link}" style="height: 100%; width: 100%;">
        <div class="search-img">
            <div class="search-img-transition">
                <div class="btn-5" id="view_details">
                    Перейти
                </div>
            </div>
            <img src="${a.img}" >
        </div>
        <div class="search-content">
            <h2 class="search-heading">${a.title}</h2>
        </div>
        <div class="search-price-container"><span class="search-price">${formatter(a.price)} тг</span></div>
    </a>
`;
        searchedItems.appendChild(item);

    })
}

let searchArray = JSON.parse(localStorage.getItem("searched-cards") || "[]");
let searchedWord = JSON.parse(localStorage.getItem("searched-word"));

const sWord = document.getElementById("searched-word")
sWord.innerHTML = `${searchedWord}`

searchArray.sort(function(a, b) {
    let x = parseInt(a.price, 10);
    let y = parseInt(b.price, 10);

    console.log(typeof y)
    return x - y;
})




displayList(searchArray)