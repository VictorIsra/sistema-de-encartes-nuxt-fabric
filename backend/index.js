const express = require('express')
const app = express()

app.get('/', (req, res, next) => {
  res.send('APwootdsd')
})
// export the server middleware
module.exports = {
  path: '/backend',
  handler: app
}