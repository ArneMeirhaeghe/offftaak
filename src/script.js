import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { gsap } from "gsap";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader();
//Web Assembly - Worker -> Haal de draco file uit node_modules -> three -> examples -> jsm -> libs -> draco
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
//vertel aan de gltfLoader dat hij draco moet gebruiken indien het bestand draco compressed is.
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Models
 */

let mixer = null;
const animationObject = {
  actions: {},
};

gltfLoader.load(
  "/models/models/logo1.gltf",
  (gltf) => {
    console.log("success");

    //Toevoegen van model
    gltf.scene.scale.set(1, 1, 1);
    scene.add(gltf.scene);

    //Wanneer een model meerdere children heeft
    //Met While loop
    // while(gltf.scene.children.length){
    //     scene.add(gltf.scene.children[0])
    // }

    //For loop
    // const children = [...gltf.scene.children];
    // for (const child of children){
    //     scene.add(child);
    // }
  },
  () => {
    console.log("progress");
  },
  (error) => {
    console.log("error", error);
  }
);
gltfLoader.load(
  "/models/models/nietkwijtraken.gltf",
  (test) => {
    console.log("success");

    //Toevoegen van model
    test.scene.scale.set(1, 1, 1);
    test.scene.position.set(0, 10, 0);
    scene.add(test.scene);

    //Wanneer een model meerdere children heeft
    //Met While loop
    // while(gltf.scene.children.length){
    //     scene.add(gltf.scene.children[0])
    // }

    //For loop
    // const children = [...gltf.scene.children];
    // for (const child of children){
    //     scene.add(child);
    // }
  },
  () => {
    console.log("progress");
  },
  (error) => {
    console.log("error", error);
  }
);
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    //een check om te zien of er wel een mixer aanwezig is, de eerste paar frames zal het model nog niet geladen zijn en is mixer = null
    mixer.update(deltaTime);
  }
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
