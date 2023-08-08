const app = require('./app')
const db = require('./config')
const PORT = process.env.PORT || 3000;

// once db is open, then start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log("Server running. Use our API on port: 3000")
  })
})

