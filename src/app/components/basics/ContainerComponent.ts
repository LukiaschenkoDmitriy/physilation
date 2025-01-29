import { Container, ContainerChild, Ticker } from "pixi.js";
import AbstractComponent from "./AbstractComponent";

class ContainerComponent extends AbstractComponent<{}, Container<ContainerChild>> {
    public defRender(data: any, additionalOptions: any): ContainerChild {
        return this;
    }

    public defExecuteLogic(delta: Ticker, object: ContainerChild, data: any): void { 
        this.children.forEach((component) => {
            (component as AbstractComponent<any,any>).update(delta);
        });
    }

    public updatePhysic(delta: Ticker) {}
    public defSetDefaultObjectData(object: ContainerChild, data: any): void {}
}

export default ContainerComponent;