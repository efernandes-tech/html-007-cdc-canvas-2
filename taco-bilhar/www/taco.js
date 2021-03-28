function Taco(context, imagem, hammer) {
    this.context = context;
    this.imagem = imagem;
    this.raio = 0;
    this.x = 0;
    this.y = 0;
    this.rotacao = 0;
    this.forca = 0;

    // Configuração dos gestos para serem reconhecidos juntos
    var pinch = hammer.get('pinch');
    var rotate = hammer.get('rotate');
    hammer.get('pinch').set({
        enable: true,
        threshold: 0
    });
    hammer.get('rotate').set({
        enable: true,
        threshold: 0
    });
    pinch.recognizeWith(rotate);

    // Eventos
    var taco = this;
    hammer.on('rotatestart', function (e) {
        taco.iniciarRotacao(e);
    });
    hammer.on('rotatemove', function (e) {
        taco.rotacionar(e);
    });
    hammer.on('rotateend', function (e) {
        taco.finalizarRotacao(e);
    });
}

Taco.prototype = {
    desenhar: function () {
        var ctx = this.context;
        // Área de controle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        ctx.stroke();
        // Taco
        var radianos = this.rotacao * Math.PI / 180;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(radianos);
        ctx.drawImage(this.imagem, this.x - 7, this.y + this.forca,
            this.imagem.width, this.imagem.height);
        ctx.restore();
    },
    // Atenção para as vírgulas!
    iniciarRotacao: function (evento) {
        var canvas = this.context.canvas;
        var dedo1 = this.converterParaCanvas(
            evento.pointers[0].pageX - canvas.offsetLeft,
            evento.pointers[0].pageY - canvas.offsetTop
        );
        var dedo2 = this.converterParaCanvas(
            evento.pointers[1].pageX - canvas.offsetLeft,
            evento.pointers[1].pageY - canvas.offsetTop
        );
        if (this.naArea(dedo1.x, dedo1.y) &&
            this.naArea(dedo2.x, dedo2.y)) {
            this.rotacionando = true;
            this.rotacaoInicial = this.rotacao;
            this.rotacionar(evento);
        }
    },
    converterParaCanvas: function (x, y) {
        var canvas = this.context.canvas;
        return {
            x: canvas.width * x / canvas.offsetWidth,
            y: canvas.height * y / canvas.offsetHeight
        }
    },
    naArea: function (x, y) {
        var distanciaX = Math.abs(this.x - x);
        var distanciaY = Math.abs(this.y - y);
        // Pitágoras
        if (distanciaX * distanciaX + distanciaY * distanciaY <=
            this.raio * this.raio)
            return true;
        else
            return false;
    },
    rotacionar: function (evento) {
        if (this.rotacionando) {
            var rotacao = this.rotacaoInicial + evento.rotation;
            this.rotacao = rotacao % 360;
        }
    },
}