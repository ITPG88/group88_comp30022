const app = require('./app.js')
const connectDB = require('./server/database/connection')
const PORT = process.env.PORT || 8080
// Listen on port
connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
