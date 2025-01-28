import { Container, ContainerChild, ContainerOptions, Ticker } from "pixi.js";
import AbstractComponent, { AbstractComponentData } from "./AbstractComponent";
import AbstractPhysic from "@App/physics/AbstractPhysic";

type EmmiterChildComponent<DataType, ComponentType> = new (
    app: AbstractComponentData, 
    componentData: DataType | (() => DataType), 
    options?: ContainerOptions<ContainerChild>,
    additionalOptions?: {}
) => ComponentType;
        
class EmmiterComponent<DataType, ComponentType extends AbstractComponent<DataType, any>> extends AbstractComponent<DataType, ContainerChild> {
    public constructor(count: number, componentConstructor: EmmiterChildComponent<DataType, ComponentType>, app: AbstractComponentData, componentData: DataType | (() => DataType), options?: ContainerOptions<ContainerChild>) {
        super(app, componentData, undefined, {
            countElements: count,
            componentConstructor: componentConstructor
        });
    }

    public defRender(data: DataType, additionalOptions: any): ContainerChild {
        if (!this.getCallableData) throw new Error("getCallableData is null");

        for (let i = 0; i < additionalOptions.countElements; i++) {
            this.addChild(new additionalOptions.componentConstructor({canvas: this.app.canvas}, this.getCallableData()));
        }

        return this;
    }

    public defExecuteLogic(delta: Ticker, object: ContainerChild, data: DataType): void {
        this.children.forEach((child: ContainerChild) => {
            if (child instanceof AbstractComponent) {
                child.update(delta);
            }
        });

        if (this.children.length === 0) {
            this.destroy({
                children: true,
            });
        }
    }

    public updatePhysics(delta: Ticker) {
        this.physics.forEach((physic: AbstractPhysic<any>) => {
            physic.update(this.children.map((component) => component as AbstractComponent<DataType, any>), delta);
        });
    }

    public defSetDefaultObjectData(object: ContainerChild, data: DataType): void {}
}

export default EmmiterComponent;