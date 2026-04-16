import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import sequelize from "./config/config"; 

sequelize
  .authenticate()
  .then(async () => {
    console.log("Banco de dados conectado com sucesso!");

    await sequelize.sync();
    console.log("Sincronização do banco concluída!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;