const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()

app.listen(process.env.port,console.log(`listening on port ${process.env.port}...`))