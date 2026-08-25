/**
 * loginAnimation.js
 * Animación de partículas-red exclusiva para la pantalla de Login de JobConnect.
 * Se activa al mostrar el login y se pausa al ocultarlo.
 */

export const LoginAnimation = (() => {
    const COLORS = {
        dot:  'rgba(42, 157, 143, 0.75)',  // Verde agua
        line: 'rgba(42, 157, 143, 0.15)',
        bg:   'rgba(247, 244, 239, 0.0)'
    };
    const DOT_COUNT   = 55;
    const MAX_DIST    = 140;
    const SPEED       = 0.55;

    let canvas, ctx, dots = [], raf = null, running = false;

    /* ---- Dot factory ---- */
    function createDot() {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.5 + 0.25) * SPEED;
        return {
            x:    Math.random() * canvas.width,
            y:    Math.random() * canvas.height,
            vx:   Math.cos(angle) * speed,
            vy:   Math.sin(angle) * speed,
            r:    Math.random() * 2.5 + 1.2,
            pulse: Math.random() * Math.PI * 2  // offset para efecto de pulso
        };
    }

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function update() {
        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            d.pulse += 0.035;

            // Rebotar en los bordes
            if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
            if (d.y < 0 || d.y > canvas.height)  d.vy *= -1;
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- Líneas entre partículas cercanas ---
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx   = dots[i].x - dots[j].x;
                const dy   = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > MAX_DIST) continue;

                const alpha = (1 - dist / MAX_DIST) * 0.45;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(42, 157, 143, ${alpha})`;
                ctx.lineWidth   = 0.8;
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }

        // --- Puntos con efecto de pulso sutil ---
        dots.forEach(d => {
            const pulseFactor = 0.85 + Math.sin(d.pulse) * 0.15;
            const radius = d.r * pulseFactor;

            // Halo exterior
            const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius * 3.5);
            grd.addColorStop(0, 'rgba(42, 157, 143, 0.3)');
            grd.addColorStop(1, 'rgba(42, 157, 143, 0)');
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Núcleo del punto
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.dot;
            ctx.fill();
        });
    }

    function loop() {
        if (!running) return;
        update();
        draw();
        raf = requestAnimationFrame(loop);
    }

    /* ---- API pública ---- */
    function init() {
        canvas = document.getElementById('loginCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        dots = Array.from({ length: DOT_COUNT }, createDot);
        window.addEventListener('resize', resize);
    }

    function start() {
        if (!canvas) init();
        if (running) return;
        running = true;
        canvas.classList.add('visible');
        loop();
    }

    function stop() {
        running = false;
        canvas?.classList.remove('visible');
        cancelAnimationFrame(raf);
    }

    return { init, start, stop };
})();
