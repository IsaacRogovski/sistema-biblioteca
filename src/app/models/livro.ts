/** Livro como a API devolve (6 propriedades + id). */
export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  ano: number;
  editora: string;
  paginas: number;
  genero: string;
}

/** Dados enviados à API para criar ou atualizar um livro. */
export type DadosLivro = Omit<Livro, 'id'>;

/** Estado do formulário: números ficam `null` enquanto o campo está vazio. */
export interface FormularioLivro {
  titulo: string;
  autor: string;
  ano: number | null;
  editora: string;
  paginas: number | null;
  genero: string;
}

export type CampoLivro = keyof DadosLivro;
export type ErrosLivro = Partial<Record<CampoLivro, string>>;

export function formularioVazio(): FormularioLivro {
  return { titulo: '', autor: '', ano: null, editora: '', paginas: null, genero: '' };
}

/**
 * Valida o formulário com as mesmas regras do backend.
 * Devolve um objeto com a mensagem de cada campo inválido (vazio = tudo certo).
 */
export function validarLivro(
  form: FormularioLivro,
  anoAtual: number = new Date().getFullYear(),
): ErrosLivro {
  const erros: ErrosLivro = {};

  if (!form.titulo?.trim()) erros.titulo = 'Informe o título.';
  if (!form.autor?.trim()) erros.autor = 'Informe o autor.';
  if (!form.editora?.trim()) erros.editora = 'Informe a editora.';
  if (!form.genero?.trim()) erros.genero = 'Informe o gênero.';

  if (form.ano === null || !Number.isInteger(form.ano)) {
    erros.ano = 'Informe o ano.';
  } else if (form.ano < 1 || form.ano > anoAtual) {
    erros.ano = `Use um ano entre 1 e ${anoAtual}.`;
  }

  if (form.paginas === null || !Number.isInteger(form.paginas)) {
    erros.paginas = 'Informe as páginas.';
  } else if (form.paginas < 1) {
    erros.paginas = 'Use pelo menos 1 página.';
  }

  return erros;
}
