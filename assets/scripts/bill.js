function loadbill() {
    var tablen = localStorage.getItem("tabno");
    $("#tablenum").append(tablen);

    var totalpri = localStorage.getItem("totalpr");
    $("#total").append("<h4>" + totalpri + "</h4>");

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