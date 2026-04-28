import { Livro } from "../types/Livro";

let nextId = 7;

const SEED_DATA: Livro[] = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", genero: "Romance", ano: 1899, status: "disponivel" },
  { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", genero: "Romance", ano: 1890, status: "emprestado" },
  { id: 3, titulo: "Vidas Secas", autor: "Graciliano Ramos", genero: "Romance", ano: 1938, status: "disponivel" },
  { id: 4, titulo: "Neuromancer", autor: "William Gibson", genero: "Ficção Científica", ano: 1984, status: "disponivel" },
  { id: 5, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", genero: "Fantasia", ano: 1954, status: "emprestado" },
  { id: 6, titulo: "O Iluminado", autor: "Stephen King", genero: "Terror", ano: 1977, status: "disponivel" },
];

export const livros: Livro[] = SEED_DATA.map((l) => ({ ...l }));

export function gerarId(): number {
  return nextId++;
}

/** Restaura o estado inicial (para testes) */
export function resetarLivros(): void {
  livros.length = 0;
  SEED_DATA.forEach((l) => livros.push({ ...l }));
  nextId = 7;
}