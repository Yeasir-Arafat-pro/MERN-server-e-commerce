const {body} = require('express-validator');



const validateCategory = [

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength()
        .withMessage('Category name should be 3 characters long'),
            

];




module.exports = {validateCategory}
