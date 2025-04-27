const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const createError = require('http-errors')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const seedRouter = require('./routes/seedRoute')
const userRouter = require('./routes/usersRoute')
const { errorResponse } = require('./controllers/responseController')
const authRouter = require('./routes/authRoute')
const categoryRouter = require('./routes/categoryRoute')
const productRouter = require('./routes/productRoute')
const cors = require('cors')



const app  = express()


const allowedOrigins = [
    'http://localhost:5173', // আপনার ক্লায়েন্ট অ্যাড্রেস
    'https://mern-server-e-commerce-new.onrender.com'
  ];
  
  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('CORS Policy Violation'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
  };
  
  app.use(cors(corsOptions));





// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
// app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const rateLimiter = rateLimit({
    windowMs: 1*60*1000,
    max: 100,
    message: 'Too many requets from thius Ip. please try again later',
});

app.use(rateLimiter)
app.use(xssClean())
app.use(morgan('dev'))


app.use('/api/seed', seedRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)
app.use('/api/products', productRouter)


app.use((req,res,next)=>{
    next(createError(404, '404 route not found'));
})

app.use((err, req, res, next)=>{
    return errorResponse(res, {
        statusCode:err.status,
        message: err.message
    })
})



module.exports = app






