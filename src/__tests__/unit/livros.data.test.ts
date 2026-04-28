import { describe, it, expect, beforeEach } from '@jest/globals';
import {livros, gerarId, resetarLivros}  from "../../data/livros";

describe("Data Store - livros", () => {
  beforeEach(() => {
    resetarLivros();
  });

  // ─── Teste 1: seed data carrega corretamente ──────────────
  it("deve carregar 6 livros iniciais", () => {
    expect(livros).toHaveLength(6);
  });

  // ─── Teste 2: todos os livros têm campos obrigatórios ─────
  it("deve ter todos os campos obrigatórios em cada livro", () => {
    livros.forEach((livro) => {
      expect(livro).toHaveProperty("id");
      expect(livro).toHaveProperty("titulo");
      expect(livro).toHaveProperty("autor");
      expect(livro).toHaveProperty("genero");
      expect(livro).toHaveProperty("ano");
      expect(livro).toHaveProperty("status");
    });
  });

  // ─── Teste 3: status dos livros são válidos ───────────────
  it("deve ter apenas status 'disponivel' ou 'emprestado'", () => {
    livros.forEach((livro) => {
      expect(["disponivel", "emprestado"]).toContain(livro.status);
    });
  });

  // ─── Teste 4: IDs são únicos ──────────────────────────────
  it("deve ter IDs únicos para cada livro", () => {
    const ids = livros.map((l) => l.id);
    const idsUnicos = new Set(ids);
    expect(idsUnicos.size).toBe(ids.length);
  });

  // ─── Teste 5: gerarId incrementa corretamente ─────────────
  it("deve gerar IDs sequenciais a partir de 7", () => {
    const id1 = gerarId();
    const id2 = gerarId();
    const id3 = gerarId();

    expect(id1).toBe(7);
    expect(id2).toBe(8);
    expect(id3).toBe(9);
  });

  // ─── Teste 6: resetarLivros restaura o estado inicial ─────
  it("deve restaurar o estado original após reset", () => {
    // Modifica o estado
    livros.push({
      id: gerarId(),
      titulo: "Teste",
      autor: "Autor",
      genero: "Genero",
      ano: 2024,
      status: "disponivel",
    });
    expect(livros).toHaveLength(7);

    // Reseta
    resetarLivros();

    expect(livros).toHaveLength(6);
    expect(gerarId()).toBe(7); // ID resetou também
  });

  // ─── Teste 7: anos são números válidos ─────────────────────
  it("deve ter anos positivos e razoáveis em todos os livros", () => {
    livros.forEach((livro) => {
      expect(typeof livro.ano).toBe("number");
      expect(livro.ano).toBeGreaterThan(0);
      expect(livro.ano).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });
});