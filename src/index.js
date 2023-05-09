import app from "./server.js"
import './database.js'

app.listen(4000, () => {
  console.log('Is working')
})