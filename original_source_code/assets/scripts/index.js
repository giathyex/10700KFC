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
const remove = document.querySelector('.button-remove-from-cart');


// Number comma formatting
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Open cart mobile version
var btnc = document.getElementById("cartmobile");
btnc.onclick = cart_open;

function cart_open() {
    if ($('#mySidebar2').css('height') === '0px') {
        document.getElementById("mySidebar2").style.height = "calc(100% - 100px)";
        $(window).scrollTop(0);
        document.body.style.overflow = 'hidden';
    } else {
        document.getElementById("mySidebar2").style.height = "0px";
        document.body.style.overflow = '';
    }
}

// Qty slider
const slider = document.getElementById("food_number");
const output = document.getElementById("md_qty");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
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
        'data-detail': doc.data().detail,
        'data-type': doc.data().type
    });
    $(divc).append(imgc);
    $(divc).append("<br><br>");
    $(divc).append(namec);
    $(divc).append("<br>");
    $(divc).append(pricec);

    foodList.addItem(namec.innerHTML, parseInt(doc.data().price));
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


// Function for choosing food on menu, called after menu loaded sucessfully

function clickwaiter() {
    let products = document.querySelectorAll('#foodlist');

    products.forEach(product => { showInfo(product) });
}


function handler2(event) {
    document.getElementById("popupmenu").style.height = "0%";
    let name = event.srcElement.dataset.name;

    foodList.removeItem(name);
    var totalcomma = numberWithCommas(foodList.getTotal());
    document.getElementById("totallabel").innerHTML = totalcomma;

    $('.productlist2[data-name="' + event.srcElement.dataset.name + '"]').remove();
}

// Show pop-up function
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function showInfo(product) {
    const foodNum = document.getElementById("food_number");
    product.addEventListener('click', function(e) {

        // Click outside the box
        if (typeof(e.srcElement.dataset.name) == "undefined" || typeof(e.srcElement.dataset.value) == "undefined") return;

        $(window).scrollTop(0);

        // Hide sidebar in mobile mode
        // Mobile and sidebar is open
        if (($('#mySidebar2').css('height') != '0px') && ($('#popupmenu').css('position') === 'absolute')) {
            document.getElementById("mySidebar2").style.height = "0%";
            document.body.style.overflow = '';

            sleep(200).then(() => {
                document.getElementById("popupmenu").style.height = "200%";
            });
        }
        // PC
        else if ($('#popupmenu').css('position') === 'fixed') {
            document.getElementById("popupmenu").style.height = "100%";
        }
        // Mobile and sidebar is not open
        else {
            document.getElementById("popupmenu").style.height = "200%";
        }

        $('.md-detail-pics').attr("src", e.srcElement.dataset.pic);
        $('.md-food-name').text(e.srcElement.dataset.name);
        var pricecomma = numberWithCommas(e.srcElement.dataset.value);
        $('.md-price').text(pricecomma + " VND");
        $('.md-detail').text(e.srcElement.dataset.detail);


        if (foodList.numberOfItem(e.srcElement.dataset.name) == 0) {
            foodNum.value = 1;
            document.getElementById("add-to-cart").value = "Thêm vào giỏ hàng"
        } else {
            document.getElementById("add-to-cart").value = "Cập nhật giỏ hàng"
            foodNum.value = foodList.numberOfItem(e.srcElement.dataset.name);
            output.innerHTML = foodNum.value;
        }

        function displayDate() {
            var number = foodNum.value;
            addToCart(e, parseInt(number));
        }

        var btn = document.getElementById("add-to-cart");
        btn.onclick = displayDate;

        function rmclicked() {
            var btnff = document.getElementById("remove-from-cart");
            btnff.onclick = handler2(e);
        }

        if (foodList.numberOfItem(e.srcElement.dataset.name) > 0) {
            remove.style.display = 'block';
            var btnff = document.getElementById("remove-from-cart");
            btnff.onclick = rmclicked;
        } else
            remove.style.display = 'none'
    });

    return product;
}


// Add close button
document.querySelector('.close2').addEventListener("click", async function() {
    document.getElementById("food_number").value = 1;
    document.getElementById("md_qty").innerHTML = "1";

    document.getElementById("popupmenu").style.height = "0%";

});

$('#popupmenu').click(function(event) {
    var $target = $(event.target);
    if (!$target.closest('#popupcontent').length) {
        document.getElementById("food_number").value = 1;
        document.getElementById("md_qty").innerHTML = "1";

        document.getElementById("popupmenu").style.height = "0%";
    }
});

var billindex = 0; // Index of div in bill

// Add to cart function
function addToCart(e, number) {
    document.getElementById("md_qty").innerHTML = number;

    document.getElementById("popupmenu").style.height = "0%";
    let name = e.srcElement.dataset.name;
    let value = e.srcElement.dataset.value;
    let pic = e.srcElement.dataset.pic;
    let detail = e.srcElement.dataset.detail;

    if (typeof(name) == "undefined" || typeof(value) == "undefined") return;

    if (number == 0 || isNaN(number)) return;
    billindex += 1;

    var divbill = $('<div/>', {
        'class': "productlist2",
        'id': "productlist2i",
        'data-index': billindex,
        'data-name': name,
        'data-value': value,
        'data-pic': pic,
        'data-detail': detail
    });

    var pricecomma = numberWithCommas(value);

    if (foodList.numberOfItem(name) == 0 && number == 1) {

        $(divbill).append(name + ' - ' + pricecomma + ' VND');
        foodList.changeNumOfItem(name, number);
        foodList.setBillNumber(name, billindex);


    } else {
        $('.productlist2[data-index=' + foodList.getBillIndex(name) + ']').remove();
        foodList.changeNumOfItem(name, number);
        $(divbill).append(name + ' - ' + pricecomma + ' VND x' + foodList.numberOfItem(name));
        foodList.setBillNumber(name, billindex);
    }


    var totalcomma = numberWithCommas(foodList.getTotal());
    document.getElementById("totallabel").innerHTML = totalcomma;

    $("#selectedproduct").append(divbill);

    document.getElementById("food_number").value = 1;
    document.getElementById("md_qty").innerHTML = "1";

    clickwaiterremove();
}


// Search function
function searchProduct() {
    let input = document.getElementById('myInput').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName("product");
    var filter = document.getElementsByClassName("active")[0].id;
    var check = false;

    for (var i = 0; i < x.length; i++) {
        if (filter == 'all') { check = true; }
        if (x[i].innerHTML.toLowerCase().includes(input) && (x[i].outerHTML.includes(filter) || check)) {
            x[i].style.display = "list-item";
            check = false;
        } else {
            x[i].style.display = "none";
        }
    }
}

const search = document.getElementById("myInput");
search.addEventListener('keyup', searchProduct);


// Filter

// Add active class to the current control button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}
// Filter function
function filterSelection() {
    let x = document.getElementsByClassName("product");
    let c = this.id;
    let input = document.getElementById('myInput').value
    input = input.toLowerCase();

    for (var i = 0; i < x.length; i++) {
        if ((x[i].outerHTML.toLowerCase().includes(c) || c == 'all') && x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "list-item";
        } else {
            x[i].style.display = "none";
        }
    }
}

const filterA = document.getElementById("all");
filterA.addEventListener('click', filterSelection);
const filterN = document.getElementById("noodles");
filterN.addEventListener('click', filterSelection);
const filterB = document.getElementById("bread");
filterB.addEventListener('click', filterSelection);
const filterE = document.getElementById("electronics");
filterE.addEventListener('click', filterSelection);
const filterF = document.getElementById("fashion");
filterF.addEventListener('click', filterSelection);
const filterV = document.getElementById("vehicle");
filterV.addEventListener('click', filterSelection);


// Passing variable and open bill.html
function checkoutfunc() {
    var orders = document.querySelector('#selectedproduct').innerHTML;
    var tabno = document.getElementById('tablen').value;

    localStorage.setItem("orders", orders);
    localStorage.setItem("tabno", tabno);
    localStorage.setItem("totalpr", foodList.getTotal());

    window.location = 'bill.html';
}

const checkout = document.getElementById("checkout");
checkout.addEventListener('click', checkoutfunc);


// Enable checkout button after valid table number is entered
// Table number must be 0 < num <= 100
document.getElementById("tablen").addEventListener("keyup", function() {
    var nameInput = document.getElementById('tablen').value;
    if ((nameInput != "") && (nameInput <= 100) && (nameInput > 0)) {
        document.getElementById('checkout').removeAttribute("disabled");
        document.getElementById("checkout").style.background = "#5e72eb";
        document.getElementById("checkout").style.border = "1px solid #5e72eb";
        document.getElementById('checkout').innerHTML = "Xác nhận thanh toán";
        document.getElementById("checkoutform").addEventListener('submit', checkoutfunc);

    } else {
        document.getElementById('checkout').setAttribute("disabled", null);
        document.getElementById('checkout').innerHTML = "Mã số không hợp lệ";
        document.getElementById("checkout").style.background = "#b9c2f3";
        document.getElementById("checkout").style.border = "1px solid #b9c2f3";
        document.getElementById("checkoutform").removeEventListener('submit', checkoutfunc);

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

// Scroll screen, easier to input
document.getElementById("tablen").addEventListener("click", scrollinput);
document.getElementById("tablen").addEventListener("touchstart", scrollinput);

async function scrollinput() {
    sleep(400).then(() => {
        if (window.screen.width <= 900) {
            var elem = document.getElementById("tablen");
            elem.scrollIntoView();
        }
    });
}

// Cancel function
function cancelfunc() {
    window.location.reload();
}

const cancel = document.getElementById("cancel");
cancel.addEventListener('click', cancelfunc);


// Remove from cart function
function clickwaiterremove() {
    let products2 = document.querySelectorAll('#productlist2i');
    products2.forEach(product2 => { showInfo(product2); });
}


// Change between moblle and PC version
window.addEventListener('resize', function(event) {
    if (window.screen.width > 900) {
        if (document.getElementById("popupmenu").style.height > "0%") {
            document.getElementById("popupmenu").style.height = "100%";
        }
        document.getElementById("mySidebar2").style.height = document.getElementById("foodlist").style.height;
        document.body.style.overflow = 'scroll';
    } else if (window.screen.width <= 900) {
        if (document.getElementById("popupmenu").style.height > "0%") {
            document.getElementById("popupmenu").style.height = "200%";
        }
        if (parseInt($('#mySidebar2').css('height')) < 1) {
            document.getElementById("mySidebar2").style.height = "0%";
        }
    }
});