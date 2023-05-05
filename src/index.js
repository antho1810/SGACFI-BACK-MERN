import app from "./server.js"
import './database.js'

app.listen(3000, () => {
  console.log('Is working')
})