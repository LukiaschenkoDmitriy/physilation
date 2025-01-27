import { Container, ContainerChild, ContainerOptions, Ticker } from "pixi.js";

export interface AbstractComponentData {
    canvas: HTMLCanvasElement
}

abstract class AbstractComponent<DataType, ComponentType extends ContainerChild> extends Container {
    private object: ComponentType;
    private data: DataType;
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

    public abstract defRender(data: DataType, additionalOptions: any): ComponentType;
    public abstract defExecuteLogic(delta: Ticker, object: ComponentType, data: DataType): void;
    public abstract defSetDefaultObjectData(object: ComponentType, data: DataType): void;

    public update(delta: Ticker) {
        this.defExecuteLogic(delta, this.object, this.data);
    }
}

export default AbstractComponent;