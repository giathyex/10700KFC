class Product {
    constructor(name, price, number=0, billNumber=0) {
        this.name = name;
        this.price = price;
        this.number = number;
        this.billNumber = billNumber;
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

    setBillNumber(name, billNumber) {
        this.list[name].billNumber = billNumber;
    }

    getBillIndex(name) {
        return this.list[name].billNumber;
    }

    reduceItem(name, number=0) {
        //Update total price
        this.total = this.total - this.list[name].price * number;

        // Update number of product
        this.list[name].number = this.list[name].number - number;
    }

    removeItem(name) {
        this.total = this.total - this.list[name].price * this.list[name].number;
        this.list[name].number = 0;
        this.setBillNumber(name, 0);
    }

    numberOfItem(name) {
        return this.list[name].number;
    }

    changeNumOfItem(name, number) {
        let t = number - this.list[name].number;
        this.addToCart(name, t);
        this.list[name].number = number;
    }

    getTotal() {
        return this.total;
    }

    getList() {
        return this.list;
    }

    removeAllItem() {
        this.total = 0;
        Object.keys(this.list).forEach(function(key) {
            this.list[key].number = 0;
            this.list[key].billNumber = 0;
        });
    }
}
