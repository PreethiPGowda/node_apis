const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { db } = require("../models/user");


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
            result: {
                email: data.email,
                username: data.username,
                phone: data.phone,
                gender: data.gender,
                userId: data._id
            },
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
        const updates = { $set: req.body }
        const options = { upsert: true, new: true };
        const result = await User.findOneAndUpdate(userId, updates, options);

        res.status(200).json({
            result: {
                email: result.email,
                username: result.username,
                phone: result.phone,
                gender: result.gender,
                userId: result._id
            },
            status: "Successfully updated"
        });



    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ result: errors, status: "Failure" });

    }
}