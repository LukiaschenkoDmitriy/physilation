import AbstractPhysic from "@App/physics/AbstractPhysic";
import { Container, ContainerChild, ContainerOptions, DestroyOptions, Ticker } from "pixi.js";

export interface AbstractComponentData {
    canvas: HTMLCanvasElement
}

abstract class AbstractComponent<DataType, ComponentType extends ContainerChild> extends Container {
    private object: ComponentType;
    private data: DataType;
    protected physics: AbstractPhysic<any>[] = [];
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

        this.addChild(this.object);
    }

    public update(delta: Ticker) {
        this.defExecuteLogic(delta, this.object, this.data);
        this.updatePhysics(delta);
    }

    public updatePhysics(delta: Ticker) {
        this.physics.forEach((physic: AbstractPhysic<any>) => {
            physic.update([this], delta);
        });
    }

    public addPhysic(physic: AbstractPhysic<any>) {
        if (!this.physics.some(p => p.constructor.name === physic.constructor.name)) {
            this.physics.push(physic);
        }
    }

    public removePhysic(physic: AbstractPhysic<any>) {
        this.physics = this.physics.filter(p => p.constructor.name !== physic.constructor.name);
    }

    public removePhysicByName(name: string) {
        this.physics = this.physics.filter(p => p.constructor.name !== name);
    }

    public getData(): DataType {
        return this.data;
    }

    public destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.physics = [];
    }

    public abstract defRender(data: DataType, additionalOptions: any): ComponentType;
    public abstract defExecuteLogic(delta: Ticker, object: ComponentType, data: DataType): void;
    public abstract defSetDefaultObjectData(object: ComponentType, data: DataType): void;
}

export default AbstractComponent;