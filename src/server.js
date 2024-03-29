require('express-async-errors')
require('dotenv/config')
const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const database = require('./database/sqlite')
const ErrorAlert = require('./utils/ErrorAlert')
const uploadConfig = require('./configs/upload')

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

database()

app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof ErrorAlert) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.log(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
