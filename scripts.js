// script.js - 3D Claw Machine using Three.js

// Initialize Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Claw (Box)
const clawGeometry = new THREE.BoxGeometry(1, 0.5, 1);
const clawMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const claw = new THREE.Mesh(clawGeometry, clawMaterial);
claw.position.y = 3;
scene.add(claw);

// Ground (Table)
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// Plush Toys
const plushToys = [];
for (let i = 0; i < 5; i++) {
    const plushGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const plushMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const plush = new THREE.Mesh(plushGeometry, plushMaterial);
    plush.position.set(Math.random() * 6 - 3, -0.5, Math.random() * 6 - 3);
    scene.add(plush);
    plushToys.push(plush);
}

// Camera Position
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

// Controls
let movingDown = false;
document.addEventListener("keydown", (event) => {
    // Left and Right movement along the X-axis (A & D keys)
    if (event.key === "a" && claw.position.x > -3) claw.position.x -= 0.5;
    if (event.key === "d" && claw.position.x < 3) claw.position.x += 0.5;
    
    // Forward and Backward movement along the Z-axis (W & S keys)
    if (event.key === "w" && claw.position.z > -3) claw.position.z -= 0.5;
    if (event.key === "s" && claw.position.z < 3) claw.position.z += 0.5;
    
    // Drop the claw when Spacebar is pressed
    if (event.key === " " && !movingDown) movingDown = true;
});

function animate() {
    requestAnimationFrame(animate);
    
    if (movingDown) {
        // Lower the claw
        claw.position.y -= 0.1;
        if (claw.position.y <= -0.5) {
            // Check if the claw is close enough to a plush toy
            plushToys.forEach((plush) => {
                if (Math.abs(plush.position.x - claw.position.x) < 0.6 &&
                    Math.abs(plush.position.z - claw.position.z) < 0.6) {
                    // Attach the plush toy to the claw
                    plush.position.y = claw.position.y;
                }
            });
            
            // Reset the claw position after a short delay
            setTimeout(() => {
                claw.position.y = 3;
                movingDown = false;
            }, 500);
        }
    }
    
    renderer.render(scene, camera);
}
animate();
