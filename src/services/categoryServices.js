const slugify = require("slugify")
const createError = require('http-errors')

const Category = require("../medels/categoryModel");


const createCategory = async (name) => {
    
       try {

        const newCategory = await Category.create({
            name: name,
            slug: slugify(name)
        })
        if (!newCategory) {
            throw createError(404, 'No Created data')
         }


        return newCategory;
        
       } catch (error) {
        throw error
       }
}


const getAllCategory = async () => {
    
    try {

      const getCategory = await Category.find().select('name slug').lean()
     if (!getCategory) {
        throw createError(404, 'No categories found')
     }

     return getCategory;
     
    } catch (error) {
     throw error
    }
}

const getCategoryById = async (slug) => {
    
    try {
        
        const getCategory = await Category.find({slug:slug}).select('name slug').lean()
        

  

     return getCategory;
     
    } catch (error) {
     throw error
    }
}


const updateCategoryById = async (slug, name) => {
    
    try {

    const filter = {slug:slug}
    const updates = {$set: {name:name, slug: slugify(name)}}
    const option = {new: true}

     const updatedCategory = await Category.findOneAndUpdate(filter,updates,option)
     if (!updatedCategory) {
        throw createError(404, 'No updated data found')
     }

     return updatedCategory;
     
    } catch (error) {
     throw error
    }
}

const deleteCategory = async (slug) => {
    
    try {

     const deletedCategory = await Category.findOneAndDelete({slug:slug})
     if (!deletedCategory) {
        throw createError(404, 'No Deleted data found')
     }

     return deletedCategory;
     
    } catch (error) {
     throw error
    }
}




module.exports = {createCategory, getAllCategory, getCategoryById, updateCategoryById, deleteCategory}