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

const formData = document.querySelector(".form-data");

function createFormOrder(doc){
    var div = document.createElement("div");
    var tableNo = document.createElement("span");
    var foodList = document.createElement("span");
    var totalPrice = document.createElement("span");
    var button = document.createElement("button");
    button.innerHTML = "Hoàn thành";

    div.classList.add('form-info');

    div.setAttribute("data-id", doc.id);
    tableNo.textContent = doc.data().table;
    totalPrice.textContent = doc.data().total;
    foodList.innerHTML = "";
    doc.data().food_name.forEach(food => {
        foodList.innerHTML = foodList.innerHTML + food + '<br/>';
    });
   // icon.classList.add("far", "fa-trash-alt");

    div.appendChild(tableNo);
    div.appendChild(foodList);
    div.appendChild(totalPrice);
    div.appendChild(button);

    formData.appendChild(div);

    button.addEventListener('click', () => {
        var ref = db.collection("orders").doc(doc.id);
        ref.delete();
    });
}

// Show orders real-time
db.collection("orders").onSnapshot((snap) => {
    snap.docChanges().forEach((doc) => {
        if (doc.type === "added") {
            createFormOrder(doc.doc);
        } else if (doc.type === "removed") {
            var div = document.querySelector(`[data-id=${doc.doc.id}]`);
            formData.removeChild(div);
        }
    })
})

const signOut = document.getElementById("sign-out")
signOut.addEventListener('click', () => {
    window.location = "index.html"
});