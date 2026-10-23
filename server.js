const express = require("express");
const cors = require("cors"); // Necessário para aceitar requisições do seu front-end (Vercel/GitHub Pages)
const app = express();
const PORT = 3001; // Mudado para 3001 para não conflitar com o seu outro projeto na porta 3000

const Database = require("better-sqlite3");
const db = new Database("../imoveis-database/data/imoveis.db");

// Libera o CORS para qualquer origem (ou você pode restringir depois para a URL da sua Vercel)
app.use(cors());
app.use(express.static("public"));

const query = `
  SELECT i.ImovelID,
  c.Nome AS NomeImovel,
  b.Nome AS Bairro,
  i.Valor,
  i.Tipologia,
  i.Quartos,
  i.LinkPublico
  FROM Imoveis i INNER JOIN Bairros b ON i.BairroID = b.BairroID LEFT JOIN Condominios c ON i.CondominioID = c.CondominioID WHERE i.ImovelStatus = 'Disponível' ORDER BY b.Nome, c.Nome
`;

app.get("/api/imoveis", (req, res) => {
  try {
    // Executa a query no momento da requisição para garantir dados em tempo real
    const available = db.prepare(query).all();
    res.json(available);
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    res.status(500).json({ error: "Erro interno ao buscar imóveis" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
