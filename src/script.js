import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//Load
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/NormalMap.png");
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;

material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff0000, 10);
pointLight2.position.set(-1.86, 1, -1.65);

scene.add(pointLight2);

// const light1 = gui.addFolder('light 1')
// light1.add(pointLight2.position,'y').min(-3).max(3).step(0.001)
// light1.add(pointLight2.position,'x').min(-6).max(6).step(0.001)
// light1.add(pointLight2.position,'z').min(-3).max(3).step(0.001)
// light1.add(pointLight2,'intensity').min(0).max(10).step(0.001)

const debugObject = { color: 0x96ff };

const pointLight3 = new THREE.PointLight(debugObject.color, 10);
pointLight3.position.set(1.6, -1.52, -1.6);

scene.add(pointLight3);
// const light2 = gui.addFolder('light 2')
// light2.add(pointLight3.position,'x').min(-3).max(3).step(0.001)
// light2.add(pointLight3.position,'y').min(-6).max(6).step(0.001)
// light2.add(pointLight3.position,'z').min(-3).max(3).step(0.001)
// light2.add(pointLight3,'intensity').min(0).max(10).step(0.001)
// light2.addColor(debugObject,'color').onChange(()=>{pointLight3.color.set(debugObject.color)})
/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener("mousemove", (event) => {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
});

window.addEventListener("scroll", (event) => {
	sphere.position.y = window.scrollY * 0.002;
	// sphere.position.z = window.scrollY*0.002
});

var box = new THREE.Box3(
	new THREE.Vector3(-100, -100, -0.5),
	new THREE.Vector3(100, 100, 2)
);
box.setFromCenterAndSize(
	new THREE.Vector3(0, 0, 0),
	new THREE.Vector3(100, 100, 2)
);

//random function for flickering
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const clock = new THREE.Clock();

const tick = () => {
	targetX = mouseX * 0.001;
	targetY = mouseY * 0.001;
	const elapsedTime = clock.getElapsedTime();

	console.log(elapsedTime % 2);
	if (elapsedTime % 2 < 0.5) {
		pointLight2.intensity = 0;
	} else {
		pointLight2.intensity = 10;
	}

	// Update objects
	sphere.rotation.y = 0.5 * elapsedTime;
	sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
	sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);
	sphere.position.z += -0.007 * targetY;
	if (sphere.position.z > box.max.z) {
		sphere.position.z = box.max.z;
	}
	if (sphere.position.z < box.min.z + 0.5) {
		sphere.position.z = -0.5;
	}
	// Update Orbital Controls
	// controls.update()
	if ((elapsedTime + 0.3 ) % 2 < 0.5) {
		pointLight3.intensity = 0;
	} else {
		pointLight3.intensity = 10;
	}
	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
