import mongoose from "mongoose";

const URI = "mongodb://127.0.0.1/sgacfi-final"

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log("DB is connected"))
.catch(err => console.log(err))