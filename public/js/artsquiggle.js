import { ImprovedNoise } from 'https://unpkg.com/three/examples/jsm/math/ImprovedNoise.js';

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y=-1.5;

// Set up the renderer
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio( window.devicePixelRatio );

const width = canvas.width;
const height = canvas.height;
renderer.setSize(width * 2, height * 2);
camera.aspect = width / height;
camera.updateProjectionMatrix();

// Set up the noise function
const noise = new ImprovedNoise();

// Set up the colors
const colors = [
  new THREE.Color(0xEE5858), // Yellow
  new THREE.Color(0xEE7D7D), // Magenta
  new THREE.Color(0xEEA3A3), // Blue
  new THREE.Color(0xEEC8C8), // Green
  new THREE.Color(0xEEEEEE), // Red
];

// Set up the waveform points
const positions = [];
for (let i = 0; i < 5; i++) {
  const linePositions = new Float32Array(100 * 3);
  for (let j = 0; j < 100; j++) {
    const x = (j - 50) / 10;
    const y = 0;
    const z = i * 0.2;
    linePositions[j * 3] = x;
    linePositions[j * 3 + 1] = y;
    linePositions[j * 3 + 2] = z;
  }
  positions.push(linePositions);
}

// Create the waveforms
const meshLines = [];
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions[i], 3));

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const lineWidth = 0.6;
    const lineMaterial = new MeshLineMaterial({
        color: colors[i],
        lineWidth: 0.2,
    });

    const meshLine = new MeshLine();
    meshLine.setGeometry(geometry);
    const waveform = new THREE.Mesh(meshLine.geometry, lineMaterial);
    
    scene.add(waveform);

    meshLines.push(meshLine);
}

const fontLoader = new THREE.FontLoader();
fontLoader.load('fonts/Roboto Mono_Bold_Fixed.json', function (font) {
  const rayGeometry = new THREE.TextGeometry('ART', {
    font: font,
    size: 2.5,
    height: 0,
    curveSegments: 12,
  });
  rayGeometry.center();
  const rayMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.9 });
  const rayText = new THREE.Mesh(rayGeometry, rayMaterial);
  scene.add(rayText);
});
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.0002;
    for (let i = 0; i < 5; i++) {
        const linePositions = positions[i];
        for (let j = 0; j < 100; j++) {
            const x = (j - 50) / 10;
            const y = noise.noise(x, time + i * 100, 0)*1-i/2+0.2;
            const z = i * 0.2;
            linePositions[j * 3] = x;
            linePositions[j * 3 + 1] = y;
            linePositions[j * 3 + 2] = z - 1;
        }
        meshLines[i].setGeometry(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(linePositions, 3)));
    }
    renderer.render(scene, camera);
}
animate();

// window.addEventListener('resize', function () {
//   renderer.setPixelRatio( window.devicePixelRatio );
//   const width = canvas.width;
//   const height = canvas.height;
//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });