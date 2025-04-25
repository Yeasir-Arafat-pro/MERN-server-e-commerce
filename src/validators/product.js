const {body} = require('express-validator');



const validateProduct = [

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({min:3, max:15})
        .withMessage('Product name should be 3-150 characters long'),
            
    body('description')
        .trim()
        .notEmpty()
        .withMessage('description is required')
        .isLength({min:3})
        .withMessage('description should be 3 characters long'),

    body('price')
        .trim()
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({min: 0})
        .withMessage('Price must be positive number'),

     body('quantity')
        .trim()
        .notEmpty()
        .withMessage('quantity is required')
        .isInt({min:1})
        .withMessage('quantity must be positive Integer'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength()
        .withMessage('Category name should be 3 characters long'),


];




module.exports = {validateProduct}
