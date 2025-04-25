const express = require('express');

const upload = require('../middlewares/uploadFile');

const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');
const { handleCreateProduct, handleGetAllProducts, handleGetSingleProducts, handleDeleteProducts, handleUpdateProduct } = require('../controllers/productController');
const { validateProduct } = require('../validators/product');
const { runValidation } = require("../validators/index");


const productRouter = express.Router()


productRouter.post('/',upload.single("image"), isLoggedIn, isAdmin, validateProduct, runValidation,  handleCreateProduct);

productRouter.get('/', handleGetAllProducts);
productRouter.get('/:slug', handleGetSingleProducts);
productRouter.delete('/:slug', handleDeleteProducts);
productRouter.put('/:slug', handleUpdateProduct);







module.exports = productRouter