class Livro {

    // metodo construtor
    constructor(id, titulo, autor, editora, anoPublicacao, categoria, quantidade) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.editora = editora;
        this.anoPublicacao = anoPublicacao;
        this.categoria = categoria;
        this.quantidade = quantidade;
    }

    // Getters
    getId() {
        return this.id;
    }

    getTitulo() {
        return this.titulo;
    }

    getAutor() {
        return this.autor;
    }

    getEditora() {
        return this.editora;
    }

    getAnoPublicacao() {
        return this.anoPublicacao;
    }

    getCategoria() {
        return this.categoria;
    }

    getQuantidade() {
        return this.quantidade;
    }

    // Setters
    set setTitulo(titulo) {
        this.titulo = titulo;
    }

    setAutor(autor) {
        this.autor = autor;
    }

    setEditora(editora) {
        this.editora = editora;
    }

    setAnoPublicacao(anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    setCategoria(categoria) {
        this.categoria = categoria;
    }

    setQuantidade(quantidade) {
        this.quantidade = quantidade;
    }

    // Métodos próprios
    estaDisponivel() {
        return this.quantidade > 0;
    }

    atualizarQuantidade(valor) {
        this.quantidade += valor;

        if (this.quantidade < 0) {
            this.quantidade = 0;
        }
    }
}

// exportando a classe
module.exports = Livro;
