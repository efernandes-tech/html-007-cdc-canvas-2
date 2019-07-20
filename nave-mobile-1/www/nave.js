// arquivo: nave.js

function Nave(context, direcional, imagem, imgExplosao) {
    this.context = context;
    // this.teclado = teclado;
    this.direcional = direcional;
    this.imagem = imagem;
    this.x = 0;
    this.y = 0;
    this.velocidade = 0;
    this.spritesheet = new Spritesheet(context, imagem, 3, 2);
    this.spritesheet.linha = 0;
    this.spritesheet.intervalo = 100;
    this.imgExplosao = imgExplosao;
    this.acabaramVidas = null;
    this.vidasExtras = 3;
}

Nave.prototype = {
    atualizar: function() {
        var incremento = this.velocidade * this.animacao.decorrido / 1000;

        var dir = this.direcional;
        var esquerda = dir.direcao == DIRECAO_NO ||
            dir.direcao == DIRECAO_O ||
            dir.direcao == DIRECAO_SO;
        var direita =   dir.direcao == DIRECAO_NE ||
            dir.direcao == DIRECAO_L ||
            dir.direcao == DIRECAO_SE;
        var acima =     dir.direcao == DIRECAO_NO ||
            dir.direcao == DIRECAO_N ||
            dir.direcao == DIRECAO_NE;
        var abaixo =    dir.direcao == DIRECAO_SO ||
            dir.direcao == DIRECAO_S ||
            dir.direcao == DIRECAO_SE;

        if (esquerda && this.x > 0)
            this.x -= incremento;
        if (direita && this.x < this.context.canvas.width - 36)
            this.x += incremento;
        if (acima && this.y > 0)
            this.y -= incremento;
        if (abaixo && this.y < this.context.canvas.height - 48)
            this.y += incremento;
    },
    desenhar: function() {
        var dir = this.direcional;
        if (dir.direcao == DIRECAO_NO ||
            dir.direcao == DIRECAO_O ||
            dir.direcao == DIRECAO_SO)
            this.spritesheet.linha = 1;
        else if (dir.direcao == DIRECAO_NE ||
            dir.direcao == DIRECAO_L ||
            dir.direcao == DIRECAO_SE)
            this.spritesheet.linha = 2;
        else
            this.spritesheet.linha = 0;

        this.spritesheet.desenhar(this.x, this.y);
        this.spritesheet.proximoQuadro();
    },
    // Não esqueça da vírgula no último método quando criar outro.
    atirar: function() {
        var t = new Tiro(this.context, this);
        this.animacao.novoSprite(t);
        this.colisor.novoSprite(t);
    },
    retangulosColisao: function() {
        // Estes valores vão sendo ajustados aos poucos.
        var rets = [
            {x: this.x+2, y: this.y+19, largura: 9, altura: 13},
            {x: this.x+13, y: this.y+3, largura: 10, altura: 33},
            {x: this.x+25, y: this.y+19, largura: 9, altura: 13}
        ];
        // Desenhando os retângulos para visualização.
        // var ctx = this.context;
        // for (var i in rets) {
        //     ctx.save();
        //     ctx.strokeStyle = 'yellow';
        //     ctx.strokeRect(rets[i].x, rets[i].y, rets[i].largura, rets[i].altura);
        //     ctx.restore();
        // }
        return rets;
    },
    colidiuCom: function(outro) {
        // Se colidiu com um Ovni...
        if (outro instanceof Ovni) {
            this.animacao.excluirSprite(this);
            this.animacao.excluirSprite(outro);
            this.colisor.excluirSprite(this);
            this.colisor.excluirSprite(outro);

            var exp1 = new Explosao(this.context, this.imgExplosao, this.x, this.y);
            var exp2 = new Explosao(this.context, this.imgExplosao, outro.x, outro.y);

            this.animacao.novoSprite(exp1);
            this.animacao.novoSprite(exp2);

            var nave = this;
            exp1.fimDaExplosao = function() {
                nave.vidasExtras--;
                if (nave.vidasExtras < 0) {
                    if (nave.acabaramVidas) {
                        nave.acabaramVidas();
                    }
                } else {
                    // Recolocar a nave no engine.
                    nave.colisor.novoSprite(nave);
                    nave.animacao.novoSprite(nave);
                    nave.posicionar();
                }
            }
        }
    },
    posicionar: function() {
        var canvas = this.context.canvas;
        this.x = canvas.width / 2 - 18; // 36 / 2 - 18
        this.y = canvas.height - 48;
    }
}
