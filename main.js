import * as THREE from "three";

import vertexShader from "./vert.glsl";
import fragmentShader from "./frag.glsl";

import imagePath from "/image.jpg";

import * as dat from "lil-gui";

import { CanvasCapture } from "canvas-capture";

const width = window.innerWidth,
  height = window.innerHeight;

// 创建相机
const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
camera.position.z = 2;

// 创建场景
const scene = new THREE.Scene();

// 创建渲染器
const canvas = document.querySelector("#sketch");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setAnimationLoop(animation);

// 创建计时器
const clock = new THREE.Clock();

// 创建主要物体
const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.PlaneGeometry(1.92, 1.28, 64, 64);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    iChannel0: {
      value: textureLoader.load(imagePath),
    },
    iTime: {
      value: clock.getElapsedTime(),
    },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uDistort: {
      value: 1,
    },
  },
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 调试
let gui = null;
if (window.location.hash === "#debug") {
  gui = new dat.GUI();
}

const params = {
  distort: 1,
};
gui
  ?.add(params, "distort")
  .min(0)
  .max(2)
  .step(0.01)
  .onChange((val) => {
    material.uniforms.uDistort.value = val;
  });

// 录制GIF
CanvasCapture.init(canvas, { showRecDot: true });
CanvasCapture.bindKeyToGIFRecord("g");

// 动画
function animation(time) {
  material.uniforms.iTime.value = clock.getElapsedTime();
  material.uniforms.iResolution.value = new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  );

  renderer.render(scene, camera);

  CanvasCapture.checkHotkeys();
  if (CanvasCapture.isRecording()) {
    CanvasCapture.recordFrame();
  }
}

// 缩放
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
}

window.addEventListener("resize", resize);
