const Product = require("../models/products");


module.exports.add_product = async(req, res) => {
    const {
        productName,
        images,
        description,
        features,
        brandName,
        country,
        manufacturer,
        type,
        mainCategory,
        subCategory,
        productCategory,
        quantities,
        prices,
        measuringUnit
    } = req.body;

    try {
        const product = await Product.create({
            productName,
            images,
            description,
            features,
            brandName,
            country,
            manufacturer,
            type,
            mainCategory,
            subCategory,
            productCategory,
            quantities,
            prices,
            measuringUnit
        });
        res.status(201).json({ result: { productID: product._id }, status: "Success" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });
    }

   

}

module.exports.get_productslist = async(req, res) => {


    try {
       
        const data = await Product.getProductsList();
        res.status(200).json({
            result: {
                products:data,
                noOfProducts:data.length            },
            status: "Success"
        });



    } catch (err) {
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });
    }
}

module.exports.get_product = async(req, res) => {

    const productId = req.params.id;


    try {
        const data = await Product.productDetails(productId);
        res.status(200).json({
            result: data,
            status: "Success"
        });



    } catch (err) {
        
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });

    }
}

module.exports.update_product = async(req, res) => {

    const productId = req.params.id;

    try {

        const updates = { $set: req.body }
        const options = { upsert: true, new: true };
        const result = await Product.findOneAndUpdate(productId, updates, options);

        res.status(200).json({
            result: result,
            status: "Successfully updated"
        });



    } catch (err) {
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });

    }
}

module.exports.delete_product = async(req, res) => {

    const productId = req.params.id;

    try {
        const result = await Product.deleteOne({"_id": productId});

        res.status(200).json({
            result: result,
            status: "Successfully Deleted"
        });



    } catch (err) {
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });

    }
}