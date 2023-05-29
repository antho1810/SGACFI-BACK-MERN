import mongoose from "mongoose";

const URI =
  "mongodb+srv://asistente_fi:JjOgj2gSCX5BGfO8@cluster0.s5cbdjs.mongodb.net/?retryWrites=true&w=majority";
// username: asistente_fi
// password: JjOgj2gSCX5BGfO8

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log("DB is connected"))
  .catch(err => console.log(err))


import './models/Participantes.js'
import './models/User.js'
import './models/Acta.js'