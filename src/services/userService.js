const bcrypt  = require('bcryptjs');
const jwt  = require('jsonwebtoken');
const createError = require('http-errors')
const cloudinary = require('../config/cloudinary')
const User = require("../medels/userModel");
const emailWithNodeMailer = require('../helper/email');
const { createJSONwebToken } = require('../helper/jsonwebtoken');
const { clientUrl } = require('../secret');

const userStatus = async (userId, action) => {
    let updates
        let successedMesssage
        console.log(action);
        
       try {
        if (action == 'ban') {
            updates = {isBanned: true}
           successedMesssage =   'user was banned successfully'      
        }else if (action == 'unban') {
            updates = {isBanned: false}
            successedMesssage =   'user was Unbanned successfully'    
        }else {
            throw createError(403, 'Invalid action. user status can be ban or unban')
        }

        const updateOptions = {new:true, runValitors: true, context: 'query'}
  
        const updateUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password")

        if (!updateUser) {
            throw createError(400, 'user with this id not exists')
        }
        return {successedMesssage, updateUser};
       } catch (error) {
        throw error
       }
}

const findAllUsers = async(search, page, limit, sortBy, sortOrder) =>{
    try {

        const searchRegExp = new RegExp('.*' + search+ '.*', 'i');
        const filter= {
            isAdmin: {$ne: true},
            $or: [
                {name: {$regex: searchRegExp}},
                {email: {$regex: searchRegExp}},
                {address: {$regex: searchRegExp}},
                {phone: {$regex: searchRegExp}},
            ]
        }

        const options = {password: 0}

        //find user for admin
        const users = await User.find(filter, options)
                                .sort({ [sortBy]: sortOrder })
                                .limit(limit)
                                .skip((page-1) * limit)

        //count total users for admin
        const count = await User.find(filter).countDocuments();

        if(!users) throw createError(404, 'users not found');

        return {   users,
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

const updateUser = async(req) =>{
    try {
        const userId  = req.params.id
        const options = {password: 0}
        //await findWithId(User, userId, options);
        const updateOptions = {new:true, runValitors: true, context: 'query'}
        const updates = {}

        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) { 
                updates[key] = req.body[key]
            } else if (['email'].includes(key)) { 
                throw createError(404, 'Email can not update')
            }
        }

        const image = req.file?.path

         // Upload an image
                   if (image) {
                    const uploadResult = await cloudinary.uploader.upload(
                        image, {
                           folder: 'ecommerce/users',
                       })
                
                        updates.image = uploadResult.secure_url
                
                
                   }


                   console.log(updates);
                   
        const update = await User.findByIdAndUpdate(userId, updates, updateOptions).select("-password")

        // if (!updateUser) {
        //     throw createError(404, 'user with this id not exists')
        // }

        //const userImagePath = user.image;
       // deleteImage(userImagePath);
     
       return update;
   

    } catch (error) {
        throw error
    }
}

const updateUserPassword = async(userId, email, oldPassword, newPassword, cofirmPassword) =>{
    try {


        // fetch user data for compare password

       const user = await User.findOne({email: email})

       if (!user) {
        throw createError(404, 'user was not found')
       }

        // oldpassword isExists
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) {
            throw createError(404, 'Password does not correct')
        }


       if (newPassword !== cofirmPassword) {
        throw createError(404, 'oldPassword & ConfirmPassword does not match. please try again')
       }

  

        // update password
        const updatePassword = await User.findByIdAndUpdate(userId, {password: newPassword}, {new:true}).select("-password")
        
        if (!updatePassword) {
            throw createError(404, 'user with this id not exists')
        }

        return updatePassword;

    } catch (error) {
        throw error
    }
}


const resetUserPassword = async(email) =>{
    try {
        const user = await User.findOne({email:email})
        if (!user) {
            throw createError(409,'User does not exists with this email. Please Register first')
        }

        const token = createJSONwebToken({email }, 'anyToken', '10m')

        if (!token) {
            throw createError(401, 'token not found')
        }

        //prepare mail data
        const emailData = {
            email,
            subject: 'Account activate email',
            html: `
                <h2>hello ${user.name}!</h2>
                <p>please click here to <a href="${clientUrl}/api/users/reset-password/${token}" target="_blank">Reset your Password</a></p>
            `
        }

        //send email with nodemailer
    try {
      await  emailWithNodeMailer(emailData)
    } catch (error) {
        throw createError(500, 'faile to send verication')
    }

    return token;

    } catch (error) {
        throw error
    }
}

const resetPassword = async(token, password) =>{
    try {

       try {
        const decode = jwt.verify(token, 'anyToken')

        if (!decode) throw createError(401, 'Token is invalid or Expired')

              // update password
        const updatePassword = await User.findOneAndUpdate(
            {email: decode.email}, 
            {password: password}, 
            {new:true})
            .select("-password")
        
        if (!updatePassword) {
            throw createError(404, 'invalid token')
        }

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
       throw error
    }
}





module.exports = {userStatus ,findAllUsers, updateUser, updateUserPassword, resetUserPassword, resetPassword}