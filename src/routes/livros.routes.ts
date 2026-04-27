import { Router, Request, Response } from "express";
import { livros, gerarId } from "../data/livros";
import { CriarLivroDTO } from "../types/Livro";

const router = Router();

// GET /livros — listar todos (com filtros opcionais via query)
router.get("/", (req: Request, res: Response) => {
  let resultado = [...livros];

  const { busca, status, genero } = req.query;

  if (typeof busca === "string" && busca.trim()) {
    const termo = busca.toLowerCase();
    resultado = resultado.filter(
      (l) =>
        l.titulo.toLowerCase().includes(termo) ||
        l.autor.toLowerCase().includes(termo)
    );
  }

  if (status === "disponivel" || status === "emprestado") {
    resultado = resultado.filter((l) => l.status === status);
  }

  if (typeof genero === "string" && genero.trim()) {
    resultado = resultado.filter(
      (l) => l.genero.toLowerCase() === genero.toLowerCase()
    );
  }

  res.json({
    total: resultado.length,
    livros: resultado,
  });
});

// GET /livros/:id — buscar por id
router.get("/:id", (req: Request, res: Response) => {
  const livro = livros.find((l) => l.id === Number(req.params.id));

  if (!livro) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }

  res.json(livro);
});

// POST /livros — cadastrar novo livro
router.post("/", (req: Request, res: Response) => {
  const { titulo, autor, genero, ano } = req.body as CriarLivroDTO;

  if (!titulo || !autor || !genero || !ano) {
    res.status(400).json({ erro: "Campos obrigatórios: titulo, autor, genero, ano" });
    return;
  }

  const novoLivro = {
    id: gerarId(),
    titulo,
    autor,
    genero,
    ano: Number(ano),
    status: "disponivel" as const,
  };

  livros.push(novoLivro);
  res.status(201).json(novoLivro);
});

// PUT /livros/:id — atualizar livro
router.put("/:id", (req: Request, res: Response) => {
  const index = livros.findIndex((l) => l.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }

  const { titulo, autor, genero, ano } = req.body;
  const livro = livros[index];

  if (titulo) livro.titulo = titulo;
  if (autor) livro.autor = autor;
  if (genero) livro.genero = genero;
  if (ano) livro.ano = Number(ano);

  res.json(livro);
});

// PATCH /livros/:id/emprestar — emprestar livro
router.patch("/:id/emprestar", (req: Request, res: Response) => {
  const livro = livros.find((l) => l.id === Number(req.params.id));

  if (!livro) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }

  if (livro.status === "emprestado") {
    res.status(409).json({ erro: "Livro já está emprestado" });
    return;
  }

  livro.status = "emprestado";
  res.json({ mensagem: `"${livro.titulo}" emprestado com sucesso`, livro });
});

// PATCH /livros/:id/devolver — devolver livro
router.patch("/:id/devolver", (req: Request, res: Response) => {
  const livro = livros.find((l) => l.id === Number(req.params.id));

  if (!livro) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }

  if (livro.status === "disponivel") {
    res.status(409).json({ erro: "Livro já está disponível" });
    return;
  }

  livro.status = "disponivel";
  res.json({ mensagem: `"${livro.titulo}" devolvido com sucesso`, livro });
});

// DELETE /livros/:id — remover livro
router.delete("/:id", (req: Request, res: Response) => {
  const index = livros.findIndex((l) => l.id === Number(req.params.id));

  if (index === -1) {
    res.status(404).json({ erro: "Livro não encontrado" });
    return;
  }

  const [removido] = livros.splice(index, 1);
  res.json({ mensagem: `"${removido.titulo}" removido do acervo`, livro: removido });
});

export default router;
