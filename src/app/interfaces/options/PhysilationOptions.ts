import { Application, ApplicationOptions } from "pixi.js";

interface PhysilationOptions {
    pixijs: Application;
    pixijsConfig: Partial<ApplicationOptions>;
    root: HTMLElement;
}

export default PhysilationOptions