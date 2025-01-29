import AbstractEvent from "@App/events/AbstractEvent";
import EventManager from "@App/managers/EventManager";
import PhysicsManager from "@App/managers/PhysicManager";
import { Container, ContainerChild, ContainerOptions, DestroyOptions, EventSystem, Ticker } from "pixi.js";

export interface AbstractComponentData {
    canvas?: HTMLCanvasElement,
    events?: EventSystem,
    childIsRenderable?: boolean
}

abstract class AbstractComponent<DataType, ComponentType extends ContainerChild> extends Container {
    private object: ComponentType;
    private data: DataType;
    
    public physicManager: PhysicsManager = new PhysicsManager();
    public eventManager: EventManager = new EventManager();

    protected app: AbstractComponentData;
    protected getCallableData: (() => DataType) | null = null;
    public constructor(app: AbstractComponentData, componentData: DataType | (() => DataType), options?: ContainerOptions<ContainerChild>, additionalOptions?: any) {
        super(options);

        this.app = app;

        if (componentData instanceof Function) {
            this.data = componentData();
            this.getCallableData = componentData;
        } else {
            this.data = componentData;
        }

        this.object = this.defRender(this.data, additionalOptions ? additionalOptions : {});

        this.defSetDefaultObjectData(this.object, this.data);

        if (app.childIsRenderable) {
            this.addChild(this.object);
        }
    }

    public update(delta: Ticker) {
        this.defExecuteLogic(delta, this.object, this.data);
        this.eventManager.executeStateActiveEvents(delta, this, this.data);
        this.updatePhysic(delta);
    }

    public updatePhysic(delta: Ticker) {
        this.physicManager.update([this], delta);
    }

    public getData(): DataType {
        return this.data;
    }

    public abstract defRender(data: DataType, additionalOptions: any): ComponentType;
    public abstract defExecuteLogic(delta: Ticker, object: ComponentType, data: DataType): void;
    public abstract defSetDefaultObjectData(object: ComponentType, data: DataType): void;
}

export default AbstractComponent;