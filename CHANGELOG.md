# Changelog

All notable changes to this project will be documented in this file.
Todas as mudanças relevantes deste projeto serão documentadas aqui.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-09

### English

#### Added
- PostgreSQL integration using connection pool via `pg` (`Pool`).
- Environment configuration via `dotenv` with `DATABASE_URL` and `PORT`.

#### Changed
- **Database Persistence:** Migrated backend data source from SQLite (`better-sqlite3` / `imoveis.db`) to PostgreSQL (`public.imoveis`) to ensure real-time synchronization with the main platform inventory.
- **Query Adaptation:** Adapted SQL query in `server.js` to PostgreSQL syntax with `imovelstatus = 'Disponível'` and cast `i.valor::float` for accurate numeric formatting.
- **Frontend Currency Formatting:** Hardened currency formatting in `script.js` with `Number(Valor).toLocaleString`.

#### Removed
- Removed SQLite (`better-sqlite3`) dependency from `package.json`.

---

### Português

#### Adicionado
- Integração com PostgreSQL utilizando pool de conexões via `pg` (`Pool`).
- Configuração de ambiente via `dotenv` com suporte a `DATABASE_URL` e `PORT`.

#### Alterado
- **Persistência de Dados:** Migração da fonte de dados de SQLite (`better-sqlite3` / `imoveis.db`) para PostgreSQL (`public.imoveis`), garantindo sincronização em tempo real com o inventário principal da plataforma.
- **Adaptação da Consulta SQL:** Consulta adaptada para sintaxe do PostgreSQL com `imovelstatus = 'Disponível'` e conversão explícita `i.valor::float` para formatação numérica.
- **Formatação de Moeda no Frontend:** Tratamento seguro de formatação de moeda em `script.js` com `Number(Valor).toLocaleString`.

#### Removido
- Removida a dependência do SQLite (`better-sqlite3`) do `package.json`.

---

## [1.0.0] - 2025-06-22

### Alterado
- Dados da planilha migrados do HTML estático para banco de dados SQLite
- Tabela agora é renderizada dinamicamente via `fetch()` no frontend
- Imóveis indisponíveis (vendidos, alugados, retirados) são excluídos automaticamente pela API
- Ordenação da tabela por bairro e nome do imóvel definida no backend

### Adicionado
- Servidor Node.js com Express expondo a rota `GET /api/imoveis`
- Integração com SQLite via `better-sqlite3`
- Query com `INNER JOIN` em `Bairros` e `LEFT JOIN` em `Condominios`
- Arquivos estáticos servidos pelo próprio Express a partir de `/public`
- Valor dos imóveis formatado em `BRL` via `toLocaleString`

### Removido
- Linhas `<tr>` hardcoded do `index.html`
