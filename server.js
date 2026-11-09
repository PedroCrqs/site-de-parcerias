require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://imoveis_app:24261841@localhost:5432/imoveis",
});

app.use(cors());
app.use(express.static("public"));

const queryAvailable = `
  SELECT i.imovelid AS "ImovelID",
         c.nome AS "NomeImovel",
         b.nome AS "Bairro",
         i.valor::float AS "Valor",
         i.tipologia AS "Tipologia",
         i.quartos AS "Quartos",
         i.linkpublico AS "LinkPublico"
  FROM imoveis i
  INNER JOIN bairros b ON i.bairroid = b.bairroid
  LEFT JOIN condominios c ON i.condominioid = c.condominioid
  WHERE i.imovelstatus = 'Disponível'
  ORDER BY b.nome, c.nome
`;

app.get("/api/imoveis", async (req, res) => {
  try {
    const { rows } = await pool.query(queryAvailable);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar imóveis disponíveis:", error.message);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
