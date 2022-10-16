import * as THREE from "three";

import Sizes from "./utils/Sizes.js";
import Time from "./utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./world/World.js";
import Resources from "./utils/Resources.js";
import Debug from "./utils/Debug.js";
import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Make Experience into singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resources = new Resources(sources);
    this.renderer = new Renderer();
    this.world = new World();

    // Event Listeners
    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse and destroy
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
}
