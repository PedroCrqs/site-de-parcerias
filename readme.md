# Real Estate Options Spreadsheet / Planilha de Opções

Interactive spreadsheet for real estate partners, displaying available property listings directly from the PostgreSQL database in real time.

---

## Architecture / Arquitetura

```
ngrok tunnel (HTTPS) / local:3001
            │
      server.js (Express)
            │
       PostgreSQL
     (public.imoveis)
```

### Stack
- **Backend:** Node.js, Express, `cors`, `dotenv`, `pg` (PostgreSQL Connection Pool)
- **Frontend:** Vanilla HTML5 / CSS3 / JavaScript (responsive table with real-time filtering)
- **Database:** PostgreSQL (`public.imoveis`)

---

## Environment Variables / Variáveis de Ambiente

Create a `.env` file in the project root:

```env
PORT=3001
DATABASE_URL=postgresql://imoveis_app:24261841@localhost:5432/imoveis
```

---

## How to Run / Como Rodar

```bash
npm install
node server.js
```

Application will be available at `http://localhost:3001`.
