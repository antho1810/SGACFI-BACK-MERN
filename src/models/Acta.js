import mongoose from 'mongoose';

const { Schema } = mongoose;

const ActaSchema = new Schema({
  numeroRef: { type: Number, unique: true, index: true },
  fechaCreacion: { type: Date, default: Date.now, required: true },
  lugar: { type: String, required: true },
  modalidad: {
    type: String,
    enum: ['presencial', 'virtual', 'mixta'],
    required: true
  },
  horaInicio: { type: String, required: true },
  horaFinal: { type: String, required: true },
  estado: {
    type: String,
    enum: ['En proceso', 'Aprobado', 'Desaprobado'],
    default: 'En proceso',
    required: true
  },
  cronograma: [{ type: Object, required: true }],
  miembrosPresentes: [
    { type: Schema.Types.ObjectId, ref: 'Participante' } // [{_id: xxxxx},{...}]
  ],
  miembrosInvitados: [
    { type: Schema.Types.ObjectId, ref: 'Participante' }
  ],
  miembrosAusentes: [
    { type: Schema.Types.ObjectId, ref: 'Participante' }
  ],
  documentosSoporte: [
    {
      nombre: { type: String, required: true },
      archivo: { type: Buffer, required: true },
      contentType: { type: String, required: true }
    }
  ],
  articulos: { type: [], required: true }
},
{
    timestamps: true,
    versionKey: false
});

ActaSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.numeroRef) {
    const lastDoc = await doc.constructor.findOne(
      {},
      {},
      { sort: { numeroRef: -1 } }
    );
    doc.numeroRef = lastDoc ? lastDoc.numeroRef + 1 : 1;
  }
  next();
});

const Acta = mongoose.model('Acta', ActaSchema);

export default Acta;