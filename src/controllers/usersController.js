const createError = require('http-errors')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');

const cloudinary = require('../config/cloudinary')
const User = require('../medels/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const { createJSONwebToken } = require('../helper/jsonwebtoken');
const emailWithNodeMailer = require('../helper/email');
const { clientUrl } = require('../secret');
const { userStatus, findAllUsers, updateUser, updateUserPassword, resetUserPassword, resetPassword } = require('../services/userService');


const getAllUsers = async(req, res, next) =>{
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const sortBy = req.query.sortBy || 'createdAt'; 
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const {users, pagination} = await findAllUsers(search,page, limit, sortBy, sortOrder)

        successResponse(res, {
            statusCode: 200,
            message: 'Users were returned successfully',
            payload: {
                users: users,
                pagination: pagination
            }
        })

    } catch (error) {
        next(error)
    }
}

//get user by id 
const getUserById = async(req, res, next) =>{
    try {
        const id  = req.params.id

        const options = {password: 0}
        const user = await findWithId(User, id, options);

        successResponse(res, {
            statusCode: 200,
            message: user.name + ":- were returned successfully",
            payload: {
                user,
            }
        })
    } catch (error) {
        next(error)
    }
}

//Delete user By ID
const deleteUserById = async(req, res, next) =>{
    try {
        const id  = req.params.id

        const user = await findWithId(User, id);
     
        await User.findByIdAndDelete({_id:id, isAdmin:false})

        successResponse(res, {
            statusCode: 200,
            message: "user was Deleted successfully",
        })

    } catch (error) {
        next(error)
    }
}

const processRegister = async(req, res, next) =>{
    try {
        const {name, email, password, phone, address} = req.body
        console.log(req.body);
        
       // const imageBufferString = req.file.buffer.toString('base64')
        const userExists = await User.exists({email:email})

        if (userExists) {
            throw createError(409,'User exists with this email. Please sign in')
            
        }

        const token = createJSONwebToken({name, email, password, phone, address, image: req.file?.path}, 'sdfsfsgg54f5s4fs', '10m')

        //prepare mail data
        const emailData = {
            email,
            subject: 'Account activate email',
            html: `
                <h2>hello ${name}!</h2>
                <p>please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank">Activate your account</a></p>
            `
        }
        //send email with nodemailer
    try {
      await  emailWithNodeMailer(emailData)
    } catch (error) {
        next(createError(500, 'faile to send verication'))
        return;
    }

       return successResponse(res, {
            statusCode: 200,
            message: "Please go to your email for completing your registration process",
            payload: {token}
        })

    } catch (error) {
        next(error)
    }
}

const acitvateUserAccount = async(req, res, next) =>{
    try {
        
        const token = req.body.token
        if(!token) throw createError(404, "token not found")

       try {
        const decode = jwt.verify(token, 'sdfsfsgg54f5s4fs')

        if (!decode) throw createError(401, 'user was not able to verify')

        const userExists = await User.exists({email:decode.email})

        if (userExists) {
            throw createError(409,'User exists with this email. Please sign in') 
        }
           // Upload an image
           if (decode.image) {
            const uploadResult = await cloudinary.uploader.upload(
                decode.image, {
                   folder: 'ecommerce/users',
               })
                decode.image = uploadResult.secure_url
           }

         // Upload an image
        
        await User.create(decode);    
        
       return successResponse(res, {
            statusCode: 201,
            message: "User was Succesfully registered",
        })
       } catch (error) {

        if (error.name == 'TokenExpiredError') {
            throw createError(401, 'token has expoired');
            
        }else if (error.name == 'JsonWebTokenError') {
            throw createError(401, 'Invalid Token');

        } else {
            throw error
        }
        
       }

    } catch (error) {
        next(error)
    }
}

const updateUserById = async(req, res, next) =>{
    try {
        const {update}= await updateUser(req)
        //const userImagePath = user.image;
       // deleteImage(userImagePath);

        successResponse(res, {
            statusCode: 200,
            message: "user was Updated successfully",
            payload: update
        })

    } catch (error) {
        next(error)
    }
}

const handleUserStatus= async(req, res, next) =>{
    try {
        const userId  = req.params.id
        const action  = req.body.action
        console.log(userId);
        
        console.log(action);
        
        
       const {successMesssage,updateUser} = await userStatus(userId,action)

        successResponse(res, {
            statusCode: 200,
            message: successMesssage,
            payload: updateUser
            
        })

    } catch (error) {
        next(error)
    }
}

const handleUpdateUserPassword = async(req, res, next) =>{
    try {

        const userId = req.params.id

        // request body data fetch
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

       const updatePassword = await updateUserPassword(userId, email, oldPassword, newPassword, confirmPassword)

        successResponse(res, {
            statusCode: 200,
            message: " User password was Updated successfully",
            payload: updatePassword
        })

    } catch (error) {
        next(error)
    }
}

const handleUserResetPassword = async(req, res, next) =>{
    try {
        const {email} = req.body

       const token = await resetUserPassword(email)

       return successResponse(res, {
            statusCode: 200,
            message: "Please go to your email for completing your rest password  process",
            payload: {token}
        })

    } catch (error) {
        next(error)
    }
}



const handleVerifyUserResetPassword = async(req, res, next) =>{
    try {
        
        const token = req.body.token
        const password = req.body.password

        await resetPassword(token, password)

        return successResponse(res, {
            statusCode: 201,
            message: "Password reset successfully",
        })

    } catch (error) {
        next(error)
    }
}





module.exports = {getAllUsers, getUserById, deleteUserById,processRegister, acitvateUserAccount, updateUserById, handleUserStatus, handleUpdateUserPassword, handleUserResetPassword, handleVerifyUserResetPassword}
