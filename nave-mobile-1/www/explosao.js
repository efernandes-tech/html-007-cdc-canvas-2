// Arquivo: explosao.js

function Explosao(context, imagem, x, y) {
    this.context = context;
    this.imagem = imagem;
    this.spritesheet = new Spritesheet(context, imagem, 1, 5);
    this.spritesheet.intervalo = 75;
    this.x = x;
    this.y = y;
    this.animando = false;

    var explosao = this;

    this.fimDaExplosao = null;

    this.spritesheet.fimDoCiclo = function() {
        explosao.animacao.excluirSprite(explosao);
        if (explosao.fimDaExplosao) explosao.fimDaExplosao();
    }
}

Explosao.prototype = {
    atualizar: function() {

    },
    desenhar: function() {
        this.spritesheet.desenhar(this.x, this.y);
        this.spritesheet.proximoQuadro();
    }
}
