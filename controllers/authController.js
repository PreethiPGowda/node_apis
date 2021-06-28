const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { db } = require("../models/user");
const bcrypt = require('bcrypt');


//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: "" };



    //incorrect email
    if (err.message === "Incorrect email") {
        errors.email = "Email not registered";
    }


    //incorrect password
    if (err.message === "Incorrect password") {
        errors.password = "Incorrect password";
    }


    //duplicate error code
    if (err.code === 11000) {
        errors.email = "Email already exists";
        return errors;
    }



    //validation errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}


const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, "mysecretkeyman", { expiresIn: maxAge });
}



// controller actions


module.exports.signup_post = async(req, res) => {
    const { email, password, username, phone, gender } = req.body;

    try {
        const user = await User.create({ email, password, username, phone, gender });
        const token = createToken(user._id);
        res.status(201).json({ result: { user: user._id, token: token }, status: "Success" });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });
    }

}


module.exports.login_post = async(req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({ result: { user: user._id, token: token }, status: "Success" });

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });

    }
}

module.exports.get_user = async(req, res) => {



    try {
        const userId = req.userid;
        const data = await User.userDetails(userId);
        res.status(200).json({
            result: data,
            status: "Success"
        });



    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });

    }
}

module.exports.update_user = async(req, res) => {
    try {

        const userId = req.userid;
        const updates = { $set: req.body };
        const options = { upsert: true, new: true , useFindAndModify : false,projection: {"password":0,"__v":0}}
        const result = await User.findOneAndUpdate(userId, updates,options);

        res.status(200).json({
            result: result,
            status: "Successfully updated"
        });



    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });

    }
}

module.exports.update_password = async(req, res) => {
    try {

        const userId = req.userid;
    // const salt = await bcrypt.genSalt();
    //    req.body.password = await bcrypt.hash(req.body.password, salt);
        const updates = { "password": req.body.password };
        const options = { upsert: true, new: true , useFindAndModify : false, projection: {"password":0,"__v":0}}
        const result = await User.findOneAndUpdate(userId, updates ,options);

        res.status(200).json({
            result: result,
            status: "Successfully updated"
        });



    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });

    }
}

module.exports.search_user = async(req, res) => {

    const { name } = req.query;

    try {
       
        const data = await User.searchUsers(name);
        res.status(200).json({
            result: {
                users:data,
                noOfUsers:data.length            },
            status: "Success"
        });



    } catch (err) {
        console.log(err);
        res.status(400).json({ result: err.message, status: "Failure" });
    }
}