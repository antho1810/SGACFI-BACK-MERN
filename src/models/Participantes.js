import { Schema, model } from 'mongoose'

const ParticipanteSchema = new Schema({
  nombre:{
    type: String,
    require: true
  },

  apellido: {
    type: String,
    require: true
  },

  cargo: {
    type: String,
    require: true
  }
},
{  timestamps: true,
    versionKey: false
  })
  
  export default model('Participantes', ParticipanteSchema)