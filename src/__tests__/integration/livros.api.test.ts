import request from "supertest";
import app from "../../app";
import { resetarLivros } from "../../data/livros";
import { describe, it, expect, beforeEach } from '@jest/globals';

describe("API /livros - Integração", () => {
  beforeEach(() => {
    resetarLivros();
  });

  // ─── GET /livros ──────────────────────────────────────────
  describe("GET /livros", () => {
    it("deve retornar a lista completa com total", async () => {
      const res = await request(app).get("/livros");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(6);
      expect(res.body.livros).toHaveLength(6);
    });

    it("deve filtrar por busca no título", async () => {
      const res = await request(app).get("/livros?busca=casmurro");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(1);
      expect(res.body.livros[0].titulo).toBe("Dom Casmurro");
    });

    it("deve filtrar por busca no autor", async () => {
      const res = await request(app).get("/livros?busca=machado");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(1);
      expect(res.body.livros[0].autor).toBe("Machado de Assis");
    });

    it("deve filtrar por status disponivel", async () => {
      const res = await request(app).get("/livros?status=disponivel");

      expect(res.status).toBe(200);
      res.body.livros.forEach((livro: any) => {
        expect(livro.status).toBe("disponivel");
      });
    });

    it("deve filtrar por gênero", async () => {
      const res = await request(app).get("/livros?genero=terror");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(1);
      expect(res.body.livros[0].titulo).toBe("O Iluminado");
    });

    it("deve retornar lista vazia quando busca não encontra nada", async () => {
      const res = await request(app).get("/livros?busca=xyznaoencontrar");

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.livros).toHaveLength(0);
    });
  });

  // ─── GET /livros/:id ──────────────────────────────────────
  describe("GET /livros/:id", () => {
    it("deve retornar um livro pelo ID", async () => {
      const res = await request(app).get("/livros/1");

      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe("Dom Casmurro");
      expect(res.body.id).toBe(1);
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const res = await request(app).get("/livros/999");

      expect(res.status).toBe(404);
      expect(res.body.erro).toBeDefined();
    });
  });

  // ─── POST /livros ─────────────────────────────────────────
  describe("POST /livros", () => {
    it("deve cadastrar um novo livro", async () => {
      const novoLivro = {
        titulo: "Grande Sertão: Veredas",
        autor: "Guimarães Rosa",
        genero: "Romance",
        ano: 1956,
      };

      const res = await request(app).post("/livros").send(novoLivro);

      expect(res.status).toBe(201);
      expect(res.body.titulo).toBe(novoLivro.titulo);
      expect(res.body.status).toBe("disponivel");
      expect(res.body.id).toBeDefined();
    });

    it("deve retornar 400 quando faltar campos obrigatórios", async () => {
      const res = await request(app).post("/livros").send({ titulo: "Incompleto" });

      expect(res.status).toBe(400);
      expect(res.body.erro).toBeDefined();
    });
  });

  // ─── PUT /livros/:id ──────────────────────────────────────
  describe("PUT /livros/:id", () => {
    it("deve atualizar dados de um livro", async () => {
      const res = await request(app)
        .put("/livros/1")
        .send({ titulo: "Dom Casmurro - Edição Especial" });

      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe("Dom Casmurro - Edição Especial");
      expect(res.body.autor).toBe("Machado de Assis"); // mantém o resto
    });

    it("deve retornar 404 para ID inexistente", async () => {
      const res = await request(app).put("/livros/999").send({ titulo: "X" });

      expect(res.status).toBe(404);
    });
  });

  // ─── PATCH /livros/:id/emprestar ──────────────────────────
  describe("PATCH /livros/:id/emprestar", () => {
    it("deve emprestar um livro disponível", async () => {
      const res = await request(app).patch("/livros/1/emprestar");

      expect(res.status).toBe(200);
      expect(res.body.livro.status).toBe("emprestado");
      expect(res.body.mensagem).toContain("emprestado");
    });

    it("deve retornar 409 ao emprestar livro já emprestado", async () => {
      const res = await request(app).patch("/livros/2/emprestar"); // id 2 já é emprestado

      expect(res.status).toBe(409);
      expect(res.body.erro).toBeDefined();
    });
  });

  // ─── PATCH /livros/:id/devolver ───────────────────────────
  describe("PATCH /livros/:id/devolver", () => {
    it("deve devolver um livro emprestado", async () => {
      const res = await request(app).patch("/livros/2/devolver"); // id 2 é emprestado

      expect(res.status).toBe(200);
      expect(res.body.livro.status).toBe("disponivel");
      expect(res.body.mensagem).toContain("devolvido");
    });

    it("deve retornar 409 ao devolver livro já disponível", async () => {
      const res = await request(app).patch("/livros/1/devolver"); // id 1 já é disponível

      expect(res.status).toBe(409);
      expect(res.body.erro).toBeDefined();
    });
  });

  // ─── DELETE /livros/:id ───────────────────────────────────
  describe("DELETE /livros/:id", () => {
    it("deve remover um livro existente", async () => {
      const res = await request(app).delete("/livros/1");

      expect(res.status).toBe(200);
      expect(res.body.livro.titulo).toBe("Dom Casmurro");

      // Confirma que foi removido
      const check = await request(app).get("/livros/1");
      expect(check.status).toBe(404);
    });

    it("deve retornar 404 ao remover ID inexistente", async () => {
      const res = await request(app).delete("/livros/999");

      expect(res.status).toBe(404);
    });
  });
});