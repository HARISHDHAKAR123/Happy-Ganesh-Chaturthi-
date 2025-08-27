// script.js
(function () {
	// Simple marigold petal shower
	const canvas = document.getElementById('petals-canvas');
	const ctx = canvas.getContext('2d');
	let petals = [];
	let width = 0, height = 0, raf = 0;

	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
	}
	window.addEventListener('resize', resize);
	resize();

	const colors = ['#ff9f1c', '#ffd166', '#ffa502', '#ff7a00', '#ff6b81'];
	function spawnPetal(x = Math.random() * width, y = -20) {
		petals.push({
			x,
			y,
			r: 4 + Math.random() * 6,
			vx: -0.6 + Math.random() * 1.2,
			vy: 1.2 + Math.random() * 1.8,
			rot: Math.random() * Math.PI,
			vr: -0.02 + Math.random() * 0.04,
			color: colors[(Math.random() * colors.length) | 0],
			alpha: 0.85 + Math.random() * 0.15
		});
	}

	function loop() {
		ctx.clearRect(0, 0, width, height);
		for (let i = petals.length - 1; i >= 0; i--) {
			const p = petals[i];
			p.x += p.vx + Math.sin(p.rot) * 0.2;
			p.y += p.vy;
			p.rot += p.vr;
			if (p.y > height + 40) petals.splice(i, 1);
		}
		petals.forEach(p => drawPetal(p));
		raf = requestAnimationFrame(loop);
	}

	function drawPetal(p) {
		ctx.save();
		ctx.globalAlpha = p.alpha;
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rot);
		const w = p.r * 2.2, h = p.r * 3.0;
		const grd = ctx.createRadialGradient(0, -h * 0.2, p.r * 0.2, 0, 0, h);
		grd.addColorStop(0, 'rgba(255,255,255,0.7)');
		grd.addColorStop(0.15, p.color);
		grd.addColorStop(1, 'rgba(0,0,0,0.15)');
		ctx.fillStyle = grd;
		ctx.beginPath();
		ctx.moveTo(0, -h * 0.8);
		ctx.quadraticCurveTo(w * 0.6, -h * 0.3, 0, h * 0.9);
		ctx.quadraticCurveTo(-w * 0.6, -h * 0.3, 0, -h * 0.8);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	// Gentle continuous petals
	let continuous = true;
	setInterval(() => { if (continuous && petals.length < 160) spawnPetal(); }, 60);

	// Buttons
	const showerButton = document.getElementById('shower-flowers');
	showerButton.addEventListener('click', () => {
		for (let i = 0; i < 120; i++) setTimeout(spawnPetal, i * 8);
	});

	// 🎵 Aarti Audio Play/Pause
	const aartiAudio = document.getElementById('aarti');
	const aartiButton = document.getElementById('play-aarti');
	aartiAudio.loop = true; // loop automatically

	aartiButton.addEventListener('click', () => {
		if (aartiAudio.paused) {
			aartiAudio.play();
			aartiButton.textContent = "Pause Aarti";
		} else {
			aartiAudio.pause();
			aartiButton.textContent = "Play Aarti";
		}
	});

	// Start animation
	loop();

	// Accessibility: stop petals when tab hidden
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) { continuous = false; cancelAnimationFrame(raf); }
		else { continuous = true; loop(); }
	});
})();
