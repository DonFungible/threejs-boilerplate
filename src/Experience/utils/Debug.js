import * as dat from "lil-gui";

export default class Debug {
  constructor() {
    console.log(window.location.hash);
    this.active = window.location.hash === "#debug";

    console.log(this.active);

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}
