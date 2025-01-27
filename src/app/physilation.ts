import { Application, ApplicationOptions, ContainerChild, FederatedPointerEvent, Ticker } from "pixi.js";
import PhysilationOptions from "./interfaces/options/PhysilationOptions";
import AbstractComponent from "./components/AbstractComponent";
// import BouncingBlockComponent, { BouncingBlockData } from "./components/BouncingBlockComponent";
// import EmmiterComponent from "./components/EmitterComponent";

class Physilation {
    private options: PhysilationOptions = {
        pixijs:  new Application(),
        pixijsConfig: { background: '#2f3030', resizeTo: window },
        root: document.body
    };

    private components: AbstractComponent<any, any>[] = [];

    public constructor(root: HTMLElement = document.body, options: Partial<ApplicationOptions> = {}) {
        this.options.pixijsConfig = { ...this.options.pixijsConfig, ...options };
        this.options.root = root;
    }

    public async init() {
        await this.options.pixijs.init(this.options.pixijsConfig);
        this.options.root.appendChild(this.options.pixijs.canvas);
        // this.options.pixijs.stage.interactive = false;
        this.options.pixijs.stage.eventMode = "static";

        this.components = this.mountComponents();

        this.registerComponents();

        console.log(this.options.pixijs.stage);

        this.options.pixijs.stage.on("mousedown", () => {
            console.log("test");
    
            // const mouse = event.data.global; // Отримуємо глобальні координати миші
    
            // // Створюємо новий компонент
            // let emmiter = new EmmiterComponent<BouncingBlockData, BouncingBlockComponent>(
            //     1000,
            //     BouncingBlockComponent,
            //     {canvas: this.options.pixijs.canvas},
            //     () => {
            //         return {
            //             rect: {
            //                 x: mouse.x,  // Використовуємо координати миші
            //                 y: mouse.y,
            //                 width: 1,
            //                 height: 1,
            //                 color: Math.floor(Math.random() * 0xffffff)
            //             },
            //             directions: {
            //                 x: Math.random() > 0.5 ? 1 : -1,
            //                 y: Math.random() > 0.5 ? 1 : -1,
            //                 speedX: Math.random() * 5,
            //                 speedY: Math.random() * 5
            //             }
            //         }
            //     }
            // );
    
            // this.components.push(emmiter);
            // this.options.pixijs.stage.addChild(emmiter);
        });

        this.options.pixijs.ticker.add((delta: Ticker) => {
            this.components.forEach((component: AbstractComponent<any, any>) => {
                component.update(delta);
            });
        });
    }

    public getComponents(): AbstractComponent<any, any>[] {
        return this.components;
    }

    protected registerComponents() {
        this.components.forEach((component: AbstractComponent<any, any>) => {
             this.options.pixijs.stage.addChild(component);
        });
    }

    protected mountComponents(): AbstractComponent<any, any>[] {
        return [
            
        ]
    }
}

export default Physilation;