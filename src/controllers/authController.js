const createError = require('http-errors')
const cookies = require('cookie-parser')
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const User = require('../medels/userModel');
const { successResponse } = require('./responseController');
const { findWithId } = require('../services/findItem');
const { createJSONwebToken } = require('../helper/jsonwebtoken');
const { clientUrl } = require('../secret');

const handleLogin = async (req, res, next) => {

    try {
        // email, password req.body
        const{email, password} = req.body
        
        //isExists
        const user = await User.findOne({email})
        if (!user) {
            throw createError(404, 'user does not exists with this email, please register first')
        }

        //compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw createError(404, 'Email & Password does not match')
        }

        //isBanned
        if (user.isBanned) {
            throw createError(404, 'You are banned, please contact authority')
        }

        //token cookie
         const accessToken =  createJSONwebToken({user},'access', '2h')

         res.cookie("accessToken", accessToken, {
            maxAge: 2*60*60*1000, //2 hours
            httpOnly: false,
            secure: false,
            sameSite: 'lax'
         })

         //create refresh token
         const refreshToken =  createJSONwebToken({user},'refresh', '7d')
         //set cookie
         res.cookie("refreshToken", refreshToken, {
            maxAge: 7*24*60*60*1000, // 7days
            httpOnly: true,
            //secure: true,
            sameSite: 'lax'
         })

         const userWithoutPassword = user.toObject()
         delete userWithoutPassword.password;

        successResponse(res, {
            statusCode: 200,
            message: "user loggedin successfully",
            payload: {userWithoutPassword }
        })
    } catch (error) {
        next(error)
    }
}

const handleLogout= async (req, res, next) => {

    try {

         res.clearCookie("accessToken")
         res.clearCookie("refreshToken")
        successResponse(res, {
            statusCode: 200,
            message: "user logged out successfully",
            payload: { }
        })
    } catch (error) {
        next(error)
    }
}

const handleRefreshToken = async (req, res, next) => {

    try {
     
       const oldRefreshToken =  req.cookies.refreshToken

      const decodeToken = jwt.verify(oldRefreshToken, 'refresh')
      if (!decodeToken) {
        throw createError(404, 'refresh token not found')
      }

      const user = decodeToken.user
       
        //create json web token (jwt)
         const accessToken =  createJSONwebToken({user},'access', '10m')
        //set cookie
         res.cookie("accessToken", accessToken, {
            maxAge: 1*60*1000, //1 min
            httpOnly: true,
            //secure: true,
            sameSite: 'none'
         })
        successResponse(res, {
            statusCode: 200,
            message: "Acces token generate successfully",
        payload: {user}
        })
    } catch (error) {
        next(error)
    }
}

const handleProtectedRoute = async (req, res, next) => {

    try {
     
       const Token =  req.cookies.accessToken

      const decodeToken = jwt.verify(Token, 'access')

      if (!decodeToken) {
        throw createError(404, 'Invalid access token. Please login again')
      }

        successResponse(res, {
            statusCode: 200,
            message: "Protected Resources access successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute}