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


// Render food list from database
function renderList(doc, indexc) {
    var pricec = document.createElement("p");
    pricec.className = "product-value";
    pricec.innerHTML = "<h4>" + doc.data().price + "</h4>";

    var namec = document.createElement("p");
    namec.className = "product-name"
    namec.innerHTML = doc.data().name;

    var imgc = document.createElement("img");
    imgc.src = "assets/images/hamburguer.svg";
    imgc.alt = doc.data().name;

    var divc = $('<div/>', {
        'class': "product",
        'data-index': indexc,
        'data-name': doc.data().name,
        'data-value': doc.data().price
    });
    $(divc).append(imgc);
    $(divc).append("<br><br>");
    $(divc).append(namec);
    $(divc).append("<br>");
    $(divc).append(pricec);

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
    let billProducts = document.querySelector('#productslist');
    let productsInput = document.querySelector('#productslist');

    var total = 0;

    productsInput.value = '';

    products.forEach(product => {
        product.addEventListener('click', function(e) {
            let index = e.srcElement.dataset.index;
            let name = e.srcElement.dataset.name;
            let value = e.srcElement.dataset.value;
            
            if(typeof(name) == "undefined" || typeof(value) == "undefined") return;

            var pa = name + ' - ' + value + ' VND';
            billProducts.innerHTML += pa + "<br>";


            total = +total + +value;
            document.getElementById("totallabel").innerHTML = total;

            if (productsInput.value == '') {
                productsInput.value += index;
            } else {
                productsInput.value += ',' + index;
            }
        });
    });
}

// Search function
function searchProduct() {
    let input = document.getElementById('myInput').value
    input=input.toLowerCase();
    let x = document.getElementsByClassName("product");
    
    for (i = 0; i < x.length; i++) { 
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display="none";
        }
        else {
            x[i].style.display="list-item";
        }
    }
}

// Enable checkout button after table number is entered
document.getElementById("tablen").addEventListener("keyup", function() {
    var nameInput = document.getElementById('tablen').value;
    if (nameInput != "") {
        document.getElementById('checkout').removeAttribute("disabled");
    } else {
        document.getElementById('checkout').setAttribute("disabled", null);
    }
});


// Passing variable and open bill.html
function checkoutfunc() {
    var orders = document.querySelector('#productslist').innerHTML;
    var tabno = document.getElementById('tablen').value;
    var totalpr = document.getElementById('totallabel').innerHTML;

    localStorage.setItem("orders", orders);
    localStorage.setItem("tabno", tabno);
    localStorage.setItem("totalpr", totalpr);

    window.location = 'bill.html';
}