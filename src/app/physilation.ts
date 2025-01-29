import { Application, ApplicationOptions, Rectangle, Ticker } from "pixi.js";
import PhysilationOptions from "./interfaces/options/PhysilationOptions";
import AbstractComponent from "./components/basics/AbstractComponent";
import ContainerComponent from "./components/basics/ContainerComponent";
import BouncingBlockComponent from "./components/BouncingBlockComponent";
import GravitationPhysic from "./physics/GravitationPhysic";
import SpawnEntityEvent from "./events/SpawnEntityEvent";

class Physilation {
    private options: PhysilationOptions = {
        pixijs:  new Application(),
        pixijsConfig: { background: '#2f3030', resizeTo: window },
        root: document.body
    };

    private container: ContainerComponent = new ContainerComponent({}, {});

    public constructor(root: HTMLElement = document.body, options: Partial<ApplicationOptions> = {}) {
        this.options.pixijsConfig = { ...this.options.pixijsConfig, ...options };
        this.options.root = root;
    }
    
    public async init() {
        await this.options.pixijs.init(this.options.pixijsConfig);

        this.updateHitArea();

        window.addEventListener("resize", () => {
            this.updateHitArea();
        });

        this.container.interactive = true;

        this.options.root.appendChild(this.options.pixijs.canvas);

        this.options.pixijs.stage.addChild(this.container);

        this.container.eventManager.addEvent(new SpawnEntityEvent({
            canvas: this.options.pixijs.canvas,
            events: this.options.pixijs.renderer.events
        }), [this.container]);

        this.ticker();

        return this.options.pixijs;
    }

    public ticker() {
        this.options.pixijs.ticker.add((delta: Ticker) => {
            this.container.update(delta);
        });

        this.updateHitArea();
    }

    public updateHitArea() {
        this.container.hitArea = new Rectangle(0, 0, this.options.pixijs.canvas.width, this.options.pixijs.canvas.height);
    }
}

export default Physilation;