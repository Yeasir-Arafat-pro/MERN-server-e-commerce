const createError = require('http-errors')
const { default: slugify } = require('slugify');

const cloudinary = require('../config/cloudinary')

const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const Product = require('../medels/productModel');
const { getAllProdducts, getSingleProdduct, deleteProduct } = require('../services/productService');


const handleCreateProduct = async(req, res, next) =>{
    try {
        const {name, description, price, quantity,shipping,category} = req.body

        const image = req.file

        if (!image) {
            throw createError(404, 'Image file is required')
        }

        if (image.size > 1024*1024*2) {
            throw createError(400, 'Image file is too large')
        }
let uploadImage
   // Upload an image
   if (image.path) {
    const uploadResult = await cloudinary.uploader.upload(
       image.path, {
           folder: 'ecommerce/products',
       })

        uploadImage = uploadResult.secure_url


   }



        
       // const imageBufferString = req.file.buffer.toString('base64')

        const productExists = await Product.exists({name:name})

        if (productExists) {
            throw createError(409,'product  with this name already exists')
                
        }

            const products = await Product.create({
                name:name,
                slug:slugify(name),
                description:description,
                price:price, 
                quantity:quantity,
                shipping:shipping,
                image: uploadImage,
                category:category,
            })

       return successResponse(res, {
            statusCode: 200,
            message: "Product was created successfully",
            payload: {products}
        })

    } catch (error) {
        next(error)
    }
}

const handleGetAllProducts= async(req, res, next) =>{
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const sortBy = req.query.sortBy || 'createdAt'; 
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const productData = await getAllProdducts(search, page, limit, sortBy, sortOrder);

        successResponse(res, {
            statusCode: 200,
            message: 'Products were returned successfully',
            payload: productData
        })

    } catch (error) {
        next(error)
    }
}

const handleGetSingleProducts = async(req, res, next) =>{
    try {
        const slug = req.params.slug

        const productData = await getSingleProdduct(slug)

        successResponse(res, {
            statusCode: 200,
            message: 'Product were returned successfully',
            payload: productData
        })

    } catch (error) {
        next(error)
    }
}


const handleDeleteProducts = async(req, res, next) =>{
    try {
        const slug = req.params.slug

        const deletedProduct = await deleteProduct(slug)

        successResponse(res, {
            statusCode: 200,
            message: 'Product were Deleted successfully',
            payload: deletedProduct
        })

    } catch (error) {
        next(error)
    }
}

const handleUpdateProduct = async(req, res, next) =>{
    try {

        const slug = req.params.slug

        const updateOptions = {new:true, context: 'query'}
        const updates = {}

        for (let key in req.body) {
            if (['name', 'description', 'price', 'quantity','shipping','category'].includes(key)) { 
                updates[key] = req.body[key]
            } 
        }
        
    const {name} = req.body
        if (name) {
            updates.slug = slugify(name)
        }

        const image = req.file

        if (image) {
            if (image.size > 1024 * 1024 * 2) {
               throw createError(404, 'file too large, it is must be less than 2 MB')
            }

            updates.image  = image.buffer.toString('base64')
        }

        const update = await Product.findOneAndUpdate({slug}, updates, updateOptions)

        if (!update) {
            throw createError(404, 'not found product')
        }
        

        // if (!image) {
        //     throw createError(404, 'Image file is required')
        // }

        // if (image.size > 1024*1024*2) {
        //     throw createError(400, 'Image file is too large')
        // }
        
        // const imageBufferString = req.file.buffer.toString('base64')


       return successResponse(res, {
            statusCode: 200,
            message: "Product was updated successfully",
            payload: {update}
        })

    } catch (error) {
        next(error)
    }
}



module.exports = {handleCreateProduct, handleGetAllProducts, handleGetSingleProducts, handleDeleteProducts, handleUpdateProduct}
