const slugify = require("slugify")


const { successResponse } = require("./responseController")
const Category = require("../medels/categoryModel")
const { createCategory, getAllCategory, getCategoryById, updateCategoryById, deleteCategory } = require("../services/categoryServices")

const handleCreateCategory = async (req, res, next)=> {

    try {
        const {name} = req.body

      const newCategory = await createCategory(name)
       
       return successResponse(res, {
            statusCode: 200,
            message: "Category was created successfully",
            payload: {newCategory}
        })

    } catch (error) {
        next(error)
    }

}

const handleGetAllCategory = async (req, res, next)=> {

    try {

      const getCategory = await getAllCategory()
       
       return successResponse(res, {
            statusCode: 200,
            message: "Category fetch successfully",
            payload: getCategory
        })

    } catch (error) {
        next(error)
    }

}


const handleGetCategoryById = async (req, res, next)=> {

    try {

    const {slug} = req.params
    
      const getCategory = await getCategoryById(slug)
       
       return successResponse(res, {
            statusCode: 200,
            message: "Category fetch successfully",
            payload: getCategory
        })

    } catch (error) {
        next(error)
    }

}


const handleUpdateCategoryById = async (req, res, next)=> {

    try {
        const {name} = req.body
        const {slug} = req.params

      const updatedCategory = await updateCategoryById(slug, name)
       
       return successResponse(res, {
            statusCode: 200,
            message: "Category Updated successfully",
            payload: updatedCategory
        })

    } catch (error) {
        next(error)
    }

}

const handleDeleteCategory = async (req, res, next)=> {

    try {
        const {slug} = req.params

      const deleteddCategory = await deleteCategory(slug)
       
       return successResponse(res, {
            statusCode: 200,
            message: "Category Deleted successfully",
            payload: deleteddCategory
        })

    } catch (error) {
        next(error)
    }

}


module.exports = {handleCreateCategory, handleGetAllCategory, handleGetCategoryById, handleUpdateCategoryById, handleDeleteCategory}