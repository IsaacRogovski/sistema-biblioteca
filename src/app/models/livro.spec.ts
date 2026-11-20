import { formularioVazio, validarLivro } from './livro';

describe('validarLivro', () => {
  const valido = {
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    ano: 1899,
    editora: 'Vozes',
    paginas: 256,
    genero: 'Romance',
  };

  it('aceita um livro completo', () => {
    expect(validarLivro(valido, 2026)).toEqual({});
  });

  it('aponta todos os campos de um formulário vazio', () => {
    expect(Object.keys(validarLivro(formularioVazio(), 2026)).sort()).toEqual(
      ['ano', 'autor', 'editora', 'genero', 'paginas', 'titulo'],
    );
  });

  it('rejeita ano no futuro e páginas zero', () => {
    const erros = validarLivro({ ...valido, ano: 2027, paginas: 0 }, 2026);
    expect(erros.ano).toContain('2026');
    expect(erros.paginas).toBeTruthy();
  });

  it('trata texto só com espaços como vazio', () => {
    expect(validarLivro({ ...valido, titulo: '   ' }, 2026).titulo).toBeTruthy();
  });
});
