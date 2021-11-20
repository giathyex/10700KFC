// Set up database
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


// Number comma formatting
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function loadbill() {
    var tablen = localStorage.getItem("tabno");
    $("#tablenum").append(tablen);

    var totalpri = localStorage.getItem("totalpr"); // Actual total price in int
    var totalcomma = numberWithCommas(totalpri); // Comma total price
    $("#total").append("<h4>" + totalcomma + "</h4>");

    var detaill = localStorage.getItem("orders");
    $("#detaillist").append(detaill);

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " - " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes();
    $("#datetime").append(datetime);
}

loadbill();

(function() {
    let printButton = document.querySelector('#print');
    let newButton = document.querySelector('#new');

    printButton.addEventListener('click', function(e) {
        window.print();
    });
    newButton.addEventListener('click', function(e) {
        window.location = './index.html';
    });
})();

const firebaseData = db.collection("orders");
const billPrint = document.querySelector('.bill');

function sendOrderToServer(tableNo, totalPrice, orders) {
    var foodList = [];
    orders.forEach(element => {
        foodList.push(element.innerHTML);
    });
    firebaseData.doc().set({
        table: tableNo,
        total: totalPrice,
        food_name: foodList,
    }).then(() => {
        var noti = document.createElement('div');
        noti.className = "noti-to-customer";
        noti.innerHTML = "Đơn đã được gửi tới bếp. Xin quý khách vui lòng đợi trong giây lát!";
        billPrint.appendChild(noti);
    });
}

sendOrderToServer(localStorage.getItem("tabno"), localStorage.getItem("totalpr"), document.querySelectorAll("#productlist2i"));