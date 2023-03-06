// khai báo đối tượng
class Product {
    constructor(id, avatar, name, price, volume) {
        this.id = id;
        this.avatar = avatar;
        this.name = name;
        this.price = price;
        this.volume = volume;
    }
}
// key hệ thống
const product_key = "product_app";
var products = [];
var page_size = 8;  // số lượng hiển thị của phân trang
var total_pages = 0; // trang 1
var page_number = 1; // số lượng cộng thêm

var cart = [];

function init() { // chứa thông tin của sản phẩm
    if (window.localStorage.getItem(product_key) == null) {
        products = [
            new Product(4, "images/4.jpg", "Dubai Perfume", "500", "30"),
            new Product(3, "images/24.jpg", "Gio Perfume", "300", "150"),
            new Product(5, "images/2.jpg", "Channel Perfume", "450", "50"),
            new Product(8, "images/1.jpg", "Dior Perfume", "100", "150"),
            new Product(7, "images/23.jpg", "Paris Perfume", "800", "150"),
            new Product(6, "images/22.jpg", "Clive Christian Perfume", "1000", "150"),
            new Product(2, "images/8.jpg", "Victorias Perfume", "150", "100"),
            new Product(1, "images/7.jpg", "Gucci Perfume", "200", "50")
        ]
        window.localStorage.setItem(product_key, JSON.stringify(products));
    }
    else {
        products = JSON.parse(window.localStorage.getItem(product_key));
    }
}

function renderProduct() {
    let data = products.slice((page_size * (page_number - 1)), (page_size * page_number));
    let htmls = data.map(function (product) {
        return `
        <div class="product-items" ondblclick="editProduct(${product.id})">
            <img src="${product.avatar}" alt="" class="product-img">
            <h2 class="product-title">${product.name}(${product.volume}ml)</h2>
            <span class="price">$${product.price}</span>
            <i class='bx bxs-trash-alt add-cart' title="button" onclick="deleteProduct(${product.id})"></i>
        </div>
        `
    })
    document.getElementById('shop-content').innerHTML = htmls.join("");
    buildPagination();
}

function saveProduct() {
    let avatar = document.getElementById("avatar").value;
    let name = document.getElementById("name").value;
    let price = Number(document.getElementById("price").value);
    let volume = Number(document.getElementById("volume").value);
    let id = findMaxId() + 1;

    if (avatar == null || avatar == '') {
        alert('Hãy dán link ảnh sản phẩm.');
        return;
    } if (name == null || name == '') {
        alert('Hãy nhập tên của sản phẩm');
        return;
    } if (price <= 0) {
        alert('giá không được âm')
        return;
    } if (price >= 9999999) {
        alert('giá không được lớn hơn 10.000.000($)')
        return;
    } if (volume == null || volume == '') {
        alert('Hãy nhập thể tích của sản phẩm');
        return;
    }

    let product = new Product(id, avatar, name, price, volume);
    products.unshift(product);

    window.localStorage.setItem(product_key, JSON.stringify(products));

    renderProduct();

    resetForm()
}

function resetForm() {
    document.getElementById("productId").value = "0";
    document.getElementById("avatar").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("volume").value = "";

    document.getElementById('btnCreate').classList.remove('d-none');
    document.getElementById('btnUpdate').classList.add('d-none');
}

function findMaxId() {
    let max = 0;
    for (let product of products) {
        if (product.id > max) {
            max = product.id
        }
    }
    return max;
}

function deleteProduct(productId) {
    let confirm = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm?");
    if (confirm) {
        let index = products.findIndex(function (product) {
            return product.id == productId;
        })
        products.splice(index, 1);

        window.localStorage.setItem(product_key, JSON.stringify(products));

        renderProduct();
    }
}

function editProduct(productId) {
    let product = products.find(function (product) {
        return product.id == productId;
    })

    document.getElementById("productId").value = product.id;
    document.getElementById("avatar").value = product.avatar;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("volume").value = product.volume;


    document.getElementById('btnCreate').classList.add('d-none');
    document.getElementById('btnUpdate').classList.remove('d-none');
}

function updateProduct() {
    let avatar = document.getElementById("avatar").value;
    let name = document.getElementById("name").value;
    let price = Number(document.getElementById("price").value);
    let volume = Number(document.getElementById("volume").value);
    let id = document.getElementById("productId").value;

    let currentProduct = products.find(function (product) {
        return product.id == id;
    })

    currentProduct.avatar = avatar;
    currentProduct.name = name;
    currentProduct.price = price;
    currentProduct.volume = volume;

    window.localStorage.setItem(product_key, JSON.stringify(products));

    renderProduct();
    resetForm();
}


function buildPagination() {
    total_pages = Math.ceil(products.length / page_size);
    let paginationString = "";
    let start = page_number == 1 ? 1 : page_number == total_pages ? page_number - 2 : page_number - 1;
    let end = page_number == total_pages ? total_pages : page_number == 1 ? page_number + 2 : page_number + 1;
    paginationString += `<li class="page-item"><button onclick='changePage(1)'>&#x25C0;</button></li>`;
    for (let page = 1; page <= total_pages; page++) {
        paginationString += `<li class="page-item">
                                    <button class='${page == page_number ? 'active' : ''}'
                                        onclick='changePage(${page})'>
                                ${page}</button></li>`
    }
    paginationString += `<li class="page-item"><button onclick='changePage(${total_pages})'>&#x25B6;</button></li>`;
    document.getElementById('pagination').innerHTML = paginationString;
}


function changePage(page) {
    page_number = page;
    renderProduct();
}
function ready() {
    init();
    renderProduct();
}

ready();