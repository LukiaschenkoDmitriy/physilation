import { Application, ApplicationOptions, Container, ContainerChild, FederatedPointerEvent, Rectangle, Ticker } from "pixi.js";
import PhysilationOptions from "./interfaces/options/PhysilationOptions";
import AbstractComponent from "./components/AbstractComponent";
import BouncingBlockComponent, { BouncingBlockData } from "./components/BouncingBlockComponent";
import EmmiterComponent from "./components/EmitterComponent";
import GravitationPhysic from "./physics/GravitationPhysic";
import { initDevtools } from "@pixi/devtools";

class Physilation {
    private options: PhysilationOptions = {
        pixijs:  new Application(),
        pixijsConfig: { background: '#2f3030', resizeTo: window },
        root: document.body
    };

    private components: AbstractComponent<any, any>[] = [];
    private isClicked: boolean = false;

    public constructor(root: HTMLElement = document.body, options: Partial<ApplicationOptions> = {}) {
        this.options.pixijsConfig = { ...this.options.pixijsConfig, ...options };
        this.options.root = root;
    }

    public async init() {
        await this.options.pixijs.init(this.options.pixijsConfig);
        this.options.root.appendChild(this.options.pixijs.canvas);

        initDevtools({app: this.options.pixijs});

        this.initStage();
        this.initEvents();

        this.options.pixijs.ticker.add((delta: Ticker) => {
            this.components.forEach((component: AbstractComponent<any, any>) => {
                component.update(delta);
            });

            if (this.isClicked) {
                const mousePosition = this.options.pixijs.renderer.events.pointer.global;

                const radius = 10;
                const color = Math.floor(Math.random() * 0xffffff);
                let emmiter = new EmmiterComponent<BouncingBlockData, BouncingBlockComponent>(
                    10,
                    BouncingBlockComponent,
                    {canvas: this.options.pixijs.canvas},
                    () => {
                        const angle = Math.random() * 2 * Math.PI;
                        
                        return {
                            rect: {
                                x: mousePosition.x + radius * Math.cos(angle),
                                y: mousePosition.y + radius * Math.sin(angle),
                                width: 2,
                                height: 2,
                                color: color,
                                alfaDelta: 0
                            },
                            directions: {
                                x: Math.random() > 0.5 ? 1 : -1,
                                y: 0,
                                speedX: 0,
                                speedY: 0
                            }
                        }
                    }
                );

                emmiter.addPhysic(new GravitationPhysic({gravity: 0.5, groundLevel: this.options.pixijs.canvas.height - 2}));

                this.options.pixijs.stage.addChild(emmiter)
                this.components.push(emmiter);
            }
        });
    }

    public getComponents(): AbstractComponent<any, any>[] {
        return this.components;
    }

    public initEvents() {
        this.options.pixijs.stage.on("pointerdown", () => {
            this.isClicked = true;
        })

        this.options.pixijs.stage.on("pointerup", () => {
            this.isClicked = false;
        })

        this.options.pixijs.stage.on("pointerupoutside", () => {
            this.isClicked = false;
        })
    }

    public initStage() {
        this.components = this.mountComponents();
        this.registerComponents();

        this.updateHitArea();

        window.addEventListener("resize", () => {
            this.updateHitArea();
        });    

        this.options.pixijs.stage.interactive = true;
    }

    public updateHitArea() {
        this.options.pixijs.stage.hitArea = new Rectangle(0, 0, this.options.pixijs.canvas.width, this.options.pixijs.canvas.height);
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