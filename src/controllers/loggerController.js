const {createLogger, format, transports} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH-mm-ss'}),   
    format.json()
),





  //defaultMeta: { service: 'user-service' },

  transports: [   
    new transports.File({ 
        filename: 'src/logs/info.log', 
        level: 'info' 
    }),

    new transports.File({ 
        filename: 'src/logs/error.log', 
        level: 'error'
    })



   // new transports.File({ filename: 'combined.log' }),


  ],
});

module.exports = logger

    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //

    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //