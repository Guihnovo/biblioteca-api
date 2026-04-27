import express from "express";
import livrosRoutes from "./routes/livros.routes";

const app = express();

app.use(express.json());

// Rotas
app.use("/livros", livrosRoutes);

// Rota raiz
app.get("/", (_req, res) => {
  res.json({
    nome: "API Biblioteca Municipal",
    versao: "1.0.0",
    endpoints: {
      "GET /livros": "Listar livros (query: busca, status, genero)",
      "GET /livros/:id": "Buscar livro por ID",
      "POST /livros": "Cadastrar livro (body: titulo, autor, genero, ano)",
      "PUT /livros/:id": "Atualizar livro",
      "PATCH /livros/:id/emprestar": "Emprestar livro",
      "PATCH /livros/:id/devolver": "Devolver livro",
      "DELETE /livros/:id": "Remover livro",
    },
  });
});

export default app;