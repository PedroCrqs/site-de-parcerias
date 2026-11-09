# Majesto — Site de Parcerias

Plataforma de listagem de imóveis para corretores parceiros. Interface mobile-first com backend Node.js + PostgreSQL e entrega via Cloudflare Tunnel.

---

## Arquitetura

```
majesto-parcerias.com.br
        │
  Cloudflare Tunnel (HTTPS)
        │
  server.js (Express :3000)
        │
   ┌────┴────────┐
   │             │
public/      PostgreSQL
(static)  (public.imoveis)
```

### Stack

| Camada | Tecnologia |
|---|---|
| Servidor | Node.js + Express |
| Banco de dados | PostgreSQL via `pg` (Connection Pool) |
| Fotos | Google Drive API v3 |
| Exposição pública | Cloudflare Tunnel |
| Processo | PM2 |

---

## Estrutura de Pastas

```
site-de-parcerias/
├── server.js                          # Servidor Express + rotas da API
├── package.json
├── .gitignore
├── CHANGELOG.md
└── public/                            # Arquivos servidos ao browser
    ├── index.html
    └── src/
        ├── scripts/
        │   ├── app.js                 # Orquestração principal
        │   ├── components.js          # Componentes UI + carousel de fotos
        │   ├── data.js                # Fetch da API + transformação
        │   ├── db.js                  # Pool de conexão PostgreSQL
        │   ├── state.js               # Gerenciamento de estado e filtros
        │   └── utils.js               # Funções utilitárias
        ├── styles/
        │   ├── base.css               # Reset e tipografia
        │   ├── components.css         # Estilos dos componentes
        │   ├── layout.css             # Grid e layout
        │   ├── responsive.css         # Media queries
        │   └── variables.css          # Design tokens
        └── assets/
            └── images/
                └── logo.png
```

---

## API

### `GET /api/imoveis`

Retorna todos os imóveis com `imovelstatus = 'Disponível'`, ordenados por bairro e nome.

**Resposta:**
```json
[
  {
    "ImovelID": 1,
    "NomeImovel": "Acquabella",
    "Bairro": "Barra Da Tijuca",
    "Valor": "3200000.00",
    "Tipologia": "Apartamento",
    "Quartos": 4,
    "LinkPublico": "https://drive.google.com/..."
  }
]
```

### `GET /api/imoveis/:id/fotos`

Busca as fotos do imóvel diretamente na pasta do Google Drive via API v3 com cache TTL em memória (12 horas).

**Resposta:**
```json
[
  "https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200"
]
```

---

## Schema do Banco (PostgreSQL)

O banco de dados relacional utiliza o PostgreSQL:

```sql
imoveis         -- dados principais, status, valor, tipologia, link público
bairros         -- nome e zona (Oeste, Sul, Norte, etc.)
condominios     -- nome, endereço, infraestrutura
```

Imóveis com `imovelstatus` diferente de `Disponível` são excluídos automaticamente da API.

---

## Como rodar localmente

```bash
git clone git@github.com:PedroCrqs/site-de-parcerias.git
cd site-de-parcerias
npm install
```

Crie o arquivo `.env` com a string de conexão:
```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/imoveis
```

Certifique-se de posicionar as credenciais da Service Account do Google Drive no arquivo `planilha-de-opcoes-dbe8155b12ce.json`.

Inicie a aplicação:
```bash
node server.js
```

Acesse `http://localhost:3000`.

---

## Deploy (produção)

O servidor roda numa máquina local/servidor Linux Debian 12, exposta via Cloudflare Tunnel sem abertura de portas no roteador.

```bash
# Subir o servidor com PM2
pm2 start server.js --name site-de-parcerias
pm2 save
pm2 startup

# Tunnel como serviço systemd
sudo /usr/local/bin/cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

Configuração do tunnel em `/etc/cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/pedrocrqs/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: majesto-parcerias.com.br
    service: http://localhost:3000
  - service: http_status:404
```

---

## Funcionalidades

- Busca global com debounce (nome, bairro, tipo, valor, quartos)
- Filtros rápidos por tipo (Casa, Apartamento, Cobertura) e quantidade de quartos
- Ordenação por destaque, menor valor, maior valor e nome A-Z
- Carousel de fotos carregadas diretamente do Google Drive com cache TTL de 12 horas
- Interface mobile-first, acessível (ARIA, semântica HTML5, contraste WCAG 2.1)
- Imóveis indisponíveis removidos automaticamente pela API

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta do servidor HTTP |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/imoveis` | String de conexão com o PostgreSQL |

---

## Git Flow

```
feature/*  →  refactor/*
                  │
                 dev      ← testes e staging
                  │
                main      ← produção (releases e tags)
```

---

## Créditos

Desenvolvido por [Pedro Cerqueira](https://github.com/PedroCrqs).

O frontend da versão 2.0 — interface, design system, componentes, acessibilidade e arquitetura de estado — foi inteiramente criado por [Karla Renata](https://github.com/karlarenatadev). Um trabalho cuidadoso, mobile-first e pensado para o público certo. Obrigado, Karla.
