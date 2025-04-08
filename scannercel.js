function esCelular() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function iniciarEscaner() {
    const video = document.getElementById('scanner-preview');
    const inputManual = document.createElement('input');

    if (esCelular()) {
        // 📱 Modo celular: ocultar video y mostrar input
        video.style.display = 'none';

        inputManual.type = 'text';
        inputManual.placeholder = 'Escaneá o pegá el código';
        inputManual.style.fontSize = '20px';
        inputManual.style.margin = '20px';
        inputManual.autofocus = true;

        inputManual.addEventListener('change', () => {
            const codigo = inputManual.value.trim();
            mostrarCodigo(codigo);
        });

        document.getElementById('scanner-container').appendChild(inputManual);

    } else {
        // 💻 Modo PC: activar Quagga para escaneo por cámara
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: video,
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["code_128_reader", "ean_reader", "ean_8_reader"]
            }
        }, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected(function (result) {
            const codigo = result.codeResult.code;
            Quagga.stop();
            mostrarCodigo(codigo);
        });
    }
}

function mostrarCodigo(codigo) {
    document.getElementById('codigo-escaneado').textContent = codigo;
    document.getElementById('mensaje-escaneo').style.display = 'block';

    // Si querés redirigir automáticamente al especimen:
    // window.location.href = `/specimen/${codigo}`;
}

function cerrarMensaje() {
    document.getElementById('mensaje-escaneo').style.display = 'none';
    location.reload(); // o resetear input
}

document.addEventListener('DOMContentLoaded', iniciarEscaner);
