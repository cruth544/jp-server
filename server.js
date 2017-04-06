'use strict'
require('dotenv').load()
const express = require('express')
const path  = require('path')
const routes = require('./app/routes/routes.js')

// Middleware
const bodyParser = require('body-parser')
// const dbConfig = require('./db/credentials.js')
const cors = require('cors')

// App
const app = express()

// Settings
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(cors())
app.use('/', routes)

// ? ? ?
// app.use('/public', express.static('public'));

// Constants
const PORT = 8080


app.listen(PORT)
console.log('\n\n\nRunning on http://localhost:' + PORT)

module.exports = app

// // use db connection string based on whether the environment is development or production
// switch(app.get('env')){
//   case 'development':
//       // mongoose.connect(dbConfig.mongo.dev.conn, dbConfig.mongo.options);
//       mongoose.connect(dbConfig.mongo.dev.conn, function (err) {
//           if (err) console.log(err)
//           else
//             console.log("Connected to MongoDB!")
//       })
//       console.log('connecting to mongo dev.')
//       console.log(dbConfig.mongo.dev.conn)
//       break;
//   case 'production':
//       mongoose.connect(dbConfig.mongo.prod.conn, dbConfig.mongo.options);
//       console.log('connecting to mongo prod.')
//       console.log(dbConfig.mongo.prod.conn)
//       break;
//   default:
//       console.log('connecting nowhere')
//       throw new Error('Unknown execution environment: ' + app.get('env'));
// }
