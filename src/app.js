import express from 'express'
import pkg from '../package.json'

const app = express()

app.set('pkg', pkg)

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    Nombre: app.get('pkg').name,
    Autor: app.get('pkg').author,
    Descripcion: app.get('pkg').description,
    Version: app.get('pkg').version
  })
})
export default app