import Physilation from "@App/physilation";
import { Application } from "pixi.js";

(async () => {
    const app: Application = await (new Physilation()).init();

    (window as any).__PIXI_DEVTOOLS__ = {
        app: app,
    };
})()