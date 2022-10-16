import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Fox");
    }

    // Setup
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    console.log(this.resource);
    console.log(this.animation);
    // this.animation.action = this.animation.mixer.clipAction(
    //   this.resource.animations[0]
    // );
    this.animation.actions = {};
    this.animation.actions.survey = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walk = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.run = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.actions.current = this.animation.actions.walk;
    this.animation.actions.current.play();
    this.animation.play = (actionName) => {
      const nextAction = this.animation.actions[actionName];
      const oldAction = this.animation.actions.current;

      nextAction.reset();
      nextAction.play();
      nextAction.crossFadeFrom(oldAction, 1);
    };

    // Debug
    if (this.debug.active) {
      const debugObject = {
        actionSurvey: () => {
          this.animation.play("survey");
        },
        actionWalk: () => {
          this.animation.play("walk");
        },
        actionRun: () => {
          this.animation.play("run");
        },
      };
      this.debugFolder.add(debugObject, "actionSurvey");
      this.debugFolder.add(debugObject, "actionWalk");
      this.debugFolder.add(debugObject, "actionRun");
    }
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
