import mongoose from "mongoose";

const URI =
  "mongodb+srv://asistente_fi:JjOgj2gSCX5BGfO8@cluster0.s5cbdjs.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log("DB is connected"))
.catch(err => console.log(err))