class Product {
    constructor(name, price, number=0) {
        this.name = name;
        this.price = price;
        this.number = number;
    }
}

export class ProductList {
    constructor() {
        this.list = {};
        this.total = 0;
    }

    addItem(name, price=0, number=0) {
        this.list[name] = new Product(name, price, number);
    }

    addToCart(name, number=1) {
        // Update total price
        this.total = this.total + this.list[name].price * number;

        // Update number of product
        this.list[name].number = this.list[name].number + number;
    } 

    reduceItem(name, number=0) {
        //Update total price
        this.total = this.total - this.list[name].price * number;

        // Update number of product
        this.list[name].number = this.list[name].number - number;
    }

    removeItem(name) {
        this.reduceItem(name, this.list[name].number);
    }

    numberOfItem(name) {
        return this.list[name].number;
    }

    changeNumOfItem(name, number) {
        let t = number - this.list[name].number;
        if (t >= 0) {
            this.addToCart(name, t);
        }
        else {
            this.reduceItem(name, t);
        }
        this.list[name].number = number;
    }

    updateTotal() {
        this.total = 0;
        this.list.forEach(item => {
            this.total = this.total + item.price * item.number;
        });
    }

    getTotal() {
        return this.total;
    }

    removeAllItem() {
        this.total = 0;
        this.list.forEach(item => {
            item.number = 0;
        });
    }
}
