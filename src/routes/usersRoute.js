const express = require('express');
const { getAllUsers, getUserById, deleteUserById, processRegister, acitvateUserAccount, updateUserById, handleUserStatus, handleUpdateUserPassword, handleUserResetPassword, handleVerifyUserResetPassword } = require('../controllers/usersController');
const upload = require('../middlewares/uploadFile');
const { validateUserRagistration, validateUserUpdatePassword, validateUserResetPassword, validateVerifyUserResetPassword } = require('../validators/auth');
const { runValidation } = require('../validators/index');
const { isLoggedOut, isLoggedIn, isAdmin } = require('../middlewares/auth');

const userRouter = express.Router()


userRouter.put('/reset-password', validateVerifyUserResetPassword, runValidation,  handleVerifyUserResetPassword);
userRouter.post('/process-register',isLoggedOut, upload.single("image"),validateUserRagistration, runValidation, processRegister);
userRouter.post('/verify',isLoggedOut, acitvateUserAccount);

userRouter.get('/', isLoggedIn, isAdmin, getAllUsers);
userRouter.get('/:id',isLoggedIn, getUserById);
userRouter.delete('/:id',isLoggedIn, deleteUserById);
userRouter.put('/:id',isLoggedIn,isLoggedIn, isAdmin, upload.single("image"), updateUserById);
userRouter.put('/user-status/:id',isLoggedIn, isAdmin,  handleUserStatus);
userRouter.put('/update-password/:id',isLoggedIn, validateUserUpdatePassword, runValidation,  handleUpdateUserPassword);
userRouter.post('/forget-password',validateUserResetPassword, runValidation,  handleUserResetPassword);





module.exports = userRouter