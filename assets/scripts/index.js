import { ProductList } from "./class.js";
// Initialize Firebase
var config = {
    apiKey: "AIzaSyD6RUkvbEbaU1GxDH0YbwYX5B5P2CcRIBg",
    authDomain: "kfc-9b318.firebaseapp.com",
    projectId: "kfc-9b318",
    storageBucket: "kfc-9b318.appspot.com",
    messagingSenderId: "914271438093",
    appId: "1:914271438093:web:c23592d5e8394a865c5c44"
};

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({
    timestampsInSnapshots: true
});

const foodList = new ProductList();

// Number comma formatting
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


// Render food list from database
function renderList(doc, indexc) {
    var pricecomma = numberWithCommas(doc.data().price);
    var pricec = document.createElement("p");
    pricec.className = "product-value";
    pricec.innerHTML = "<h4>" + pricecomma + "</h4>";

    var namec = document.createElement("p");
    namec.className = "product-name"
    namec.innerHTML = doc.data().name;

    var imgc = document.createElement("img");
    imgc.src = doc.data().pic;
    imgc.alt = doc.data().name;

    var divc = $('<div/>', {
        'class': "product",
        'data-index': indexc,
        'data-name': doc.data().name,
        'data-value': doc.data().price,
        'data-pic': doc.data().pic,
        'data-detail': doc.data().detail
    });
    $(divc).append(imgc);
    $(divc).append("<br><br>");
    $(divc).append(namec);
    $(divc).append("<br>");
    $(divc).append(pricec);

    foodList.addItem(namec.innerHTML);

    $("#foodlist").append(divc);
}


// Connect to database to get food list
getdb();
async function getdb() {
    const snapshot = await firebase.firestore().collection('food').get();
    db.collection('food').doc('1').get().then(doc => {
        var indexcount = 0;
        db.collection('food').get().then(snapshot => {
            var leng = snapshot.size;
            snapshot.docs.forEach(doc => {
                indexcount += 1;
                renderList(doc, indexcount);
                if (indexcount == leng) {
                    clickwaiter();
                }
            });
        });
    });
}


// total global variable is actual total price in int
var total = 0;
// total comma is formatted total price for dispaly only


// Function for choosing food on menu, called after menu loaded sucessfully

function clickwaiter() {
    let products = document.querySelectorAll('#foodlist');

    products.forEach(product => { showInfo(product) });
}


// Show pop-up function
function showInfo(product) {
    let temp;
    product.addEventListener('click', function(e) {
        temp = e;

        // Click outside the box
        if (typeof(e.srcElement.dataset.name) == "undefined" || typeof(e.srcElement.dataset.value) == "undefined") return;

        document.querySelector('.bg-modal').style.display = "flex";
        $('.md-detail-pics').attr("src", e.srcElement.dataset.pic);
        $('.md-food-name').text(e.srcElement.dataset.name);
        var pricecomma = numberWithCommas(e.srcElement.dataset.value);
        $('.md-price').text(pricecomma + " VND");
        $('.md-detail').text(e.srcElement.dataset.detail);

        // Stop the UI from scrolling down
        $(window).scrollTop(0);
        document.body.style.overflow = 'hidden';
    });
    document.querySelector('.button-add-to-cart').addEventListener("click", function() {
        // Scrolling again
        document.body.style.overflow = '';
        addToCart(temp);
    });
    return product;
}


// Add close button
document.querySelector('.close2').addEventListener("click", function() {
    // Scrolling again
    document.body.style.overflow = '';
    document.querySelector('.bg-modal').style.display = "none";
    $('.md-detail-pics').attr("src", "");
    $('.md-food-name').text("");
    $('.md-price').text("");
    $('.md-detail').text("");
});

var billindex = 0; // Index of div in bill

// Add to cart function
function addToCart(e) {
    // product.addEventListener('click', function(e) {
    document.querySelector('.bg-modal').style.display = "none";
    let name = e.srcElement.dataset.name;
    let value = e.srcElement.dataset.value;

    if (typeof(name) == "undefined" || typeof(value) == "undefined") return;

    billindex += 1;

    var divbill = $('<div/>', {
        'class': "productlist2",
        'id': "productlist2i",
        'data-index': billindex,
        'data-name': name,
        'data-value': value
    });

    var pricecomma = numberWithCommas(value);
    if (foodList.numberOfItem(name) == 0){
        $(divbill).append(name + ' - ' + pricecomma + ' VND');
        foodList.addToCart(name);
    }
    else
    {
        foodList.addToCart(name);
        $(divbill).append(name + ' - ' + pricecomma + ' VND x' + foodList.numberOfItem(name));
    }
        

    $("#selectedproduct").append(divbill);

    total = +total + +value;
    var totalcomma = numberWithCommas(total);
    document.getElementById("totallabel").innerHTML = totalcomma;

    clickwaiterremove();
}


// Search function
function searchProduct() {
    let input = document.getElementById('myInput').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName("product");

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        } else {
            x[i].style.display = "list-item";
        }
    }
}


// Enable checkout button after valid table number is entered
// Table number must be 0 < num <= 100
document.getElementById("tablen").addEventListener("keyup", function() {
    var nameInput = document.getElementById('tablen').value;
    if ((nameInput != "") && (nameInput <= 100) && (nameInput > 0)) {
        document.getElementById('checkout').removeAttribute("disabled");
        document.getElementById("checkout").style.background = "#5e72eb";
        document.getElementById("checkout").style.border = "1px solid #5e72eb";
        document.getElementById('checkout').innerHTML = "Xác nhận thanh toán";

    } else if ((nameInput != "") && ((nameInput > 100) || (nameInput <= 0))) {
        document.getElementById('checkout').setAttribute("disabled", null);
        document.getElementById('checkout').innerHTML = "Mã số không hợp lệ";
        document.getElementById("checkout").style.background = "#b9c2f3";
        document.getElementById("checkout").style.border = "1px solid #b9c2f3";

    } else {
        document.getElementById('checkout').setAttribute("disabled", null);
        document.getElementById('checkout').innerHTML = "Mã số không hợp lệ";
        document.getElementById("checkout").style.background = "#b9c2f3";
        document.getElementById("checkout").style.border = "1px solid #b9c2f3";

    }
});

// Enable enter table box after some stuff is added to cart
document.getElementById("selectedproduct").addEventListener("DOMSubtreeModified", function() {
    if (document.getElementById("selectedproduct").innerHTML.length > 50) {
        document.getElementById('tablen').removeAttribute("disabled");
        document.getElementById('tablen').placeholder = "Vui lòng nhập mã số bàn";
        document.getElementById('checkout-or-reset').style.display = "block";
    } else {
        document.getElementById('checkout-or-reset').style.display = "none";
        document.getElementById('tablen').setAttribute("disabled", null);
        document.getElementById('tablen').placeholder = "Vui lòng chọn món trước";
    }
});


// Passing variable and open bill.html
function checkoutfunc() {
    var orders = document.querySelector('#selectedproduct').innerHTML;
    var tabno = document.getElementById('tablen').value;

    localStorage.setItem("orders", orders);
    localStorage.setItem("tabno", tabno);
    localStorage.setItem("totalpr", total);

    window.location = 'bill.html';
}


// Cancel function
function cancelfunc() {
    window.location.reload();
}


// Remove from cart function
function clickwaiterremove() {
    let products2 = document.querySelectorAll('#productlist2i');
    products2.forEach(product2 => { removef(product2) });
}

function removef(product2) {
    product2.addEventListener('click', handler2);
}

function handler2(event) {
    total = +total - +event.srcElement.dataset.value;
    var totalcomma = numberWithCommas(total);
    document.getElementById("totallabel").innerHTML = totalcomma;

    $('.productlist2[data-index=' + event.srcElement.dataset.index + ']').remove();
}