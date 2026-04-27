export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
  status: "disponivel" | "emprestado";
}

export interface CriarLivroDTO {
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
}
