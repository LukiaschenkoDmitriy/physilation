import AbstractComponent, { AbstractComponentData } from "./basics/AbstractComponent";
import {ContainerChild, ContainerOptions, Graphics, Ticker } from "pixi.js";

export interface BouncingBlockData {
    rect: {
        x: number,
        y: number
        width: number,
        height: number
        color: number,
        alfaDelta: number
    },
    directions: {
        x: number,
        y: number,
        speedX: number,
        speedY: number
    }
}

class BouncingBlockComponent extends AbstractComponent<BouncingBlockData, Graphics> {
    public constructor(app: AbstractComponentData, componentData: BouncingBlockData | (() => BouncingBlockData), options?: ContainerOptions<ContainerChild>) {
        super({...app, childIsRenderable: true}, componentData, options);
    }
    public defRender(data: BouncingBlockData): Graphics {
        return (new Graphics()).rect(0, 0, data.rect.width, data.rect.height).fill(data.rect.color);
    }

    public defExecuteLogic(delta: Ticker, object: Graphics, data: BouncingBlockData): void { }

    public defSetDefaultObjectData(object: Graphics, data: BouncingBlockData): void {
        this.x = data.rect.x;
        this.y = data.rect.y;
    }
}

export default BouncingBlockComponent;