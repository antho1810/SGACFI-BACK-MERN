import express from 'express'
// import pkg from '../package.json'
import morgan from 'morgan'

import { createRoles } from './libs/initialSetup.js'

import actasRoutes from './routes/actas.routes.js'
import authRoutes from './routes/auth.routes.js'
import usersRoutes from './routes/user.routes.js'

const app = express()
createRoles()

// Config 
// app.set('pkg', pkg)

// Middlewares
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => {
  // res.json({
  //   Nombre: app.get('pkg').name,
  //   Autor: app.get('pkg').author,
  //   Descripcion: app.get('pkg').description,
  //   Version: app.get('pkg').version
  // })

  res.send('Funcionando la ruta principal')
})

// ROUTES
app.use("/sgacfi-api/actas", actasRoutes)
app.use("/sgacfi-api/auth", authRoutes)
app.use("/sgacfi-api/users", usersRoutes)

export default app