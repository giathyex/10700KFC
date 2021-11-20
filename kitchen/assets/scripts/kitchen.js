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

// Enable enter table box after some stuff is added to cart
document.getElementById("pass-enter").addEventListener("input", function() {
    var passs = document.getElementById("pass-enter").value;
    if (passs.length > 5) {
        document.getElementById('sign-in').removeAttribute("disabled");
        document.getElementById('sign-in').value = "Tiếp tục";
    } else {
        document.getElementById('sign-in').setAttribute("disabled", null);
        document.getElementById('sign-in').value = "Vui lòng nhập mật khẩu";
    }
});

// Sign-in button
const signinn = document.getElementById("sign-in");
signinn.addEventListener('click', signinnf);

function signinnf() {
    var namew = document.getElementById("name-enter").value;
    var passw = document.getElementById("pass-enter").value;
    var passi = passw + "t";
    try {
        db.collection(namew).doc(passw).get().then(doc => {
            //Valid code
            if (doc.exists) {
                // Valid password
                if (doc.get(passi) != null) {
                    document.getElementById("signinpage").style.display = "none";
                    document.getElementById("mainpage").style.display = "";

                    // Number comma formatting
                    function numberWithCommas(x) {
                        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    }

                    const formData = document.querySelector(".form-data");

                    function createFormOrder(doc) {
                        var div = document.createElement("div");
                        div.className = "form-titles";
                        var tableNo = document.createElement("span");
                        tableNo.className = "flex-item-first";
                        var foodList = document.createElement("span");
                        foodList.className = "flex-item-secnd";
                        var totalPrice = document.createElement("span");
                        totalPrice.className = "flex-item-third";
                        var button = document.createElement("button");
                        button.className = "flex-item-four";
                        button.innerHTML = "Hoàn thành";

                        div.classList.add('form-info');

                        div.setAttribute("data-id", doc.id);
                        tableNo.textContent = doc.data().table;
                        totalPrice.textContent = numberWithCommas(doc.data().total);
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
                                try {
                                    formData.removeChild(div);
                                } catch {
                                    window.location.reload();
                                }

                            }
                        })
                    })
                } else {
                    document.getElementById("errort").style.display = "";
                }
            } else {
                document.getElementById("errort").style.display = "";
            }
        }, error => {
            document.getElementById("errort").style.display = "";
        })
    } catch {
        document.getElementById("errort").style.display = "";
    }
}