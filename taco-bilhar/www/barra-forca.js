function BarraForca(context, ponteiro, taco, hammer) {
    this.context = context;
    this.ponteiro = ponteiro;
    this.taco = taco;
    this.x = 0;
    this.y = 0;
    this.largura = 0;
    this.altura = 0;
    this.forca = 0;

    var barra = this;
    hammer.get('pan').set({
        threshold: 0
    });
    hammer.on('panstart', function (e) {
        barra.iniciarAjusteForca(e);
    });
    hammer.on('panmove', function (e) {
        barra.ajustarForca(e);
    });
    hammer.on('panend', function (e) {
        barra.finalizarAjusteForca(e);
    });
}
BarraForca.prototype = {
    desenhar: function () {
        var ctx = this.context;
        // Contêiner
        ctx.strokeRect(this.x - 2, this.y - 2, this.largura + 4,
            this.altura + 4);
        // Força
        ctx.save();
        ctx.fillStyle = '#900';
        ctx.fillRect(this.x, this.y, this.forca * 2, this.altura);
        ctx.restore();
        // Ponteiro
        var pos = this.posicaoPonteiro();
        ctx.drawImage(this.ponteiro, pos.x, pos.y,
            this.ponteiro.width, this.ponteiro.height);
    }, // Atenção para a vírgula
    posicaoPonteiro: function () {
        var x = this.x + this.forca * 2 - this.ponteiro.width / 2;
        var y = this.y + this.altura / 2;
        return {
            x: x,
            y: y
        };
    }, // Não esqueça da vírgula quando for acrescentar métodos!
    iniciarAjusteForca: function (evento) {
        var canvas = this.context.canvas;
        // Coordenadas na imagem do Canvas
        var toque = this.converterParaCanvas(
            evento.center.x - canvas.offsetLeft,
            evento.center.y - canvas.offsetTop
        );
        // Posição do ponteiro
        var pos = this.posicaoPonteiro();
        var largura = this.ponteiro.width;
        var altura = this.ponteiro.height;
        // Testar os limites
        if (toque.x >= pos.x && toque.x <= pos.x + largura &&
            toque.y >= pos.y && toque.y <= pos.y + altura) {
            this.ajustandoForca = true;
            this.ajustarForca(evento);
        }
    }, // Ainda tem mais métodos...
    converterParaCanvas: function (x, y) {
        var canvas = this.context.canvas;
        return {
            x: canvas.width * x / canvas.offsetWidth,
            y: canvas.height * y / canvas.offsetHeight
        }
    },
    ajustarForca: function (evento) {
        // Está dentro do limite?
        if (this.ajustandoForca) {
            var canvas = this.context.canvas;
            // Converter para Canvas
            var toque = this.converterParaCanvas(
                evento.center.x - canvas.offsetLeft,
                evento.center.y - canvas.offsetTop
            );
            // Nova força
            this.forca = (toque.x - this.x) / 2;
            // Limites
            if (this.forca < 0) this.forca = 0;
            if (this.forca > 100) this.forca = 100;
            // Força do taco
            this.taco.forca = this.forca;
        }
    },
    finalizarAjusteForca: function (evento) {
        if (this.ajustandoForca) {
            this.ajustarForca(evento);
            this.ajustandoForca = false;
        }
    } // Esta classe acabou!
}