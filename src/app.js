import express from 'express'
import pkg from '../package.json'

import actasRoutes from './routes/actas.routes'
import morgan from 'morgan'

const app = express()

// Config 
app.set('pkg', pkg)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    Nombre: app.get('pkg').name,
    Autor: app.get('pkg').author,
    Descripcion: app.get('pkg').description,
    Version: app.get('pkg').version
  })
})

// ROUTES
app.use("/sgacfi-api/actas", actasRoutes)
export default app