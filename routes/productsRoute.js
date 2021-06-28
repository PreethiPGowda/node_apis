const { Router } = require('express');
const productsController = require('../controllers/productsController');
const { checkToken } = require('../middleware/tokenAuth');

const route = Router();

route.post('/addproduct', checkToken, productsController.add_product);

route.get('/details/:id', checkToken, productsController.get_product);

route.get('/list', productsController.get_productslist);

route.patch('/details/update/:id', checkToken, productsController.update_product);

route.delete('/delete/:id', checkToken, productsController.delete_product);

route.get('/list/search', productsController.search_productslist);

// route.patch('/details/update/:id', checkToken, productsController.update_product);

module.exports = route;