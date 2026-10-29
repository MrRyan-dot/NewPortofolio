
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// Cegah animasi dibuat dua kali.
if (!document.querySelector("#three-particles-bg")) {
  const canvas = document.createElement("canvas");
  canvas.id = "three-particles-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  // Scene dan kamera 3D.
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 24;

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power"
    });
  } catch (error) {
    console.warn("Three.js tidak dapat dijalankan:", error);
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Jumlah partikel menyesuaikan ukuran layar.
    const particleCount = window.innerWidth < 600 ? 350 : 650;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 42;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;

      velocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.003
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    
const material = new THREE.PointsMaterial({
  color: 0x168b70,
  size: 0.125, // Partikel lebih besar
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
  depthWrite: false
});

// Sesuaikan warna partikel dengan tema website.
function updateParticleTheme() {
  const isDark = document.body.classList.contains("dark-mode");

  material.color.set(isDark ? 0x75d9d0 : 0x168b70);
  material.opacity = isDark ? 0.75 : 0.9;
}

updateParticleTheme();

const themeObserver = new MutationObserver(updateParticleTheme);

themeObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"]
});


    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Respons terhadap posisi mouse.
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener("pointermove", (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 1.2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 0.8;
    }, { passive: true });

    // Hormati preferensi pengurangan gerakan.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let animationId;
    let isVisible = true;

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      if (!reducedMotion.matches) {
        const positionAttribute = geometry.attributes.position;

        for (let i = 0; i < particleCount; i++) {
          const index = i * 3;
          const velocity = velocities[i];

          positions[index] += velocity.x;
          positions[index + 1] += velocity.y;
          positions[index + 2] += velocity.z;

          // Partikel kembali ke sisi sebaliknya saat keluar batas.
          if (positions[index] > 22) positions[index] = -22;
          if (positions[index] < -22) positions[index] = 22;
          if (positions[index + 1] > 14) positions[index + 1] = -14;
          if (positions[index + 1] < -14) positions[index + 1] = 14;
          if (positions[index + 2] > 9) positions[index + 2] = -9;
          if (positions[index + 2] < -9) positions[index + 2] = 9;
        }

        positionAttribute.needsUpdate = true;

        mouseX += (targetX - mouseX) * 0.025;
        mouseY += (targetY - mouseY) * 0.025;

        particles.rotation.y = mouseX * 0.15;
        particles.rotation.x = mouseY * 0.15;
        particles.rotation.z += 0.00015;
      }

      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    resizeObserver.observe(document.documentElement);

    document.addEventListener("visibilitychange", () => {
      isVisible = !document.hidden;
    });

    animate();

    // Bersihkan animasi jika halaman ditinggalkan.
    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    }, { once: true });
  }
}
