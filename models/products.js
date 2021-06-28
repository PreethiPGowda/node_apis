const mongoose = require('mongoose');


const productsSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, "Please enter Product Name "]
    },
    images: {
        type: Array,
    },
    description: {
        type: String
    },
    features: {
        type: Array
    },
    brandName: {
        type: String
    },
    country: {
        type: String
    },
    manufacturer: {
        type: String
    },
    type: {
        type: String
    },
    mainCategory: {
        type: String
    },
    subCategory: {
        type: String
    },
    productCategory: {
        type: String
    },
    quantities: {
        type: Array
    },
    prices: {
        type: Array
    },
    measuringUnit: {
        type: String
    },
}, {timestamps: true});

productsSchema.index({"$**":"text"});

productsSchema.statics.productDetails = async function(id) {
    const product = await this.findOne({ "_id": id });
    if (product) {
        console.log(product);
        return product;
    }
    throw Error("User doesn't exist");
};


productsSchema.statics.getProductsList = async function() {
    const product = await this.find({}).sort({"productName":1});
    if (product) {
        console.log(product);
        return product;
    }
    throw Error("No products found");
};

productsSchema.statics.searchProductsList = async function(name) {
    const product = await this.find({ $text: { $search: name }}).sort({"productName":1});;
    if (product) {
        console.log(product);
        return product;
    }
    throw Error("No products found");
};




const Product = mongoose.model('product', productsSchema)


module.exports = Product;