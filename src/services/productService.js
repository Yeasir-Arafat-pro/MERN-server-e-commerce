
const createError = require('http-errors');
const Product = require('../medels/productModel');


const getAllProdducts = async (search, page, limit, sortBy, sortOrder) => {
    try {
        
        const searchRegExp = new RegExp('.*' + search+ '.*', 'i');
        const filter= {
            isAdmin: {$ne: true},
            $or: [
                {name: {$regex: searchRegExp}},
            ]
        }

        const options = {image: 0}
        //find user for admin
        const products = await Product.find(filter, options)
                                .populate("category")
                                .sort({ [sortBy]: sortOrder })
                                .limit(limit)
                                .skip((page-1) * limit)
                                .sort({createdAt: -1})

        //count total users for admin
        const count = await Product.find(filter).countDocuments();

        if(!products) throw createError(404, 'Products not found');

        return {   products,
                   pagination:{
                    totalPages: Math.ceil(count/limit),
                    currentPage: page,
                    previousPage: page-1 > 0 ? page - 1 : null,
                    nextPage: page+ 1 <= Math.ceil(count/limit) ? page + 1 : null
                } 
            }

    } catch (error) {
        throw error
    }
}

const getSingleProdduct = async (slug) => {
    try {
        
        const filter= {
                slug:slug
        }

        const options = {image: 0}
        //find user for admin
        const product = await Product.findOne(filter, options)
                                        .populate("category")

        //count total users for admin


        if(!product) throw createError(404, 'Product not found');

        return product;
                  
            

    } catch (error) {
        throw error
    }
}

const deleteProduct = async (slug) => {
    try {
        
        const filter= {
                slug:slug
        }
        //find user for admin
        const deletedData = await Product.findOneAndDelete(filter)
                                        .populate("category")

        //count total users for admin


        if(!deletedData) throw createError(404, 'Product not found');

        return deletedData;
                  
            

    } catch (error) {
        throw error
    }
}


module.exports = {getAllProdducts, getSingleProdduct, deleteProduct}