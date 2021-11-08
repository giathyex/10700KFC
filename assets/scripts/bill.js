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