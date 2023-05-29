import express from "express";
import cors from "cors";
import morgan from "morgan";

// import votosRoutes from "./api/routes/votos.routes.js"
import actasRoutes from "./api/routes/actas.routes.js"
import authRoutes from "./api/routes/auth.routes.js";
import usersRoutes from "./api/routes/users.routes.js";
import participantesRoutes from "./api/routes/participante.routes.js"

// import { createRoles } from "./libs/initialSetup.js";

const app = express();
// createRoles();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES
// app.use("/sgacfi-api/votos", votosRoutes);
app.use("/sgacfi-api/actas", actasRoutes);
app.use("/sgacfi-api/auth", authRoutes);
app.use("/sgacfi-api/usuarios", usersRoutes);
app.use("/sgacfi-api/participantes", participantesRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: "Error interno del servidor" });
});

app.use("*", (req, res) => {
  res.status(404).json({error: "No found"})
})

export default app;
