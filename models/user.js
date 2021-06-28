
const mongoose = require('mongoose');
const { isEmail , isMobilePhone} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Minimum password length is 8 characters"]
    },
    username:{
        type:String,
        required: [true, "Please enter username"],
    },
    phone:{
        type:String,
        required: [true, "Please enter a Mobile Number"],
        validate: [isMobilePhone, "Please enter a valid Mobile Number"]
    },
    gender:{
        type: String,
        required: [true, "Please enter Gender"],
    }
}
,{timestamps: true});

userSchema.index({"$**":"text"});


//fire function before getting saved
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre('update', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//static method for login

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
}


userSchema.statics.userDetails = async function(id) {
    console.log(id);
    const projection = {password:0};
    const user = await this.findOne({"_id":id},{"password":0,"__v":0});
    if (user) {
        console.log(user);
            return user;
    }
    throw Error("User doesn't exist");
}

userSchema.statics.searchUsers = async function(name) {
    const user = await this.find({ $text: { $search: name }},{"password":0,"__v":0}).sort({"username":1});;
    if (user) {
        console.log(user);
        return user;
    }
    throw Error("No user found");
};

const User = mongoose.model('user', userSchema);

module.exports = User;