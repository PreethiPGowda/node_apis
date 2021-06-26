const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/productsRoute');


const app = express();


app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/products", productsRoutes);



// database connection
const dbURI = 'mongodb://localhost:27017/preethi';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));