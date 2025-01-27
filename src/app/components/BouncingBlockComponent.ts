import AbstractComponent, { AbstractComponentData } from "./AbstractComponent";
import {ContainerChild, ContainerOptions, Graphics, Ticker } from "pixi.js";

export interface BouncingBlockData {
    rect: {
        x: number,
        y: number
        width: number,
        height: number
        color: number
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
        super(app, componentData, options);
    }
    public defRender(data: BouncingBlockData): Graphics {
        return (new Graphics()).rect(0, 0, data.rect.width, data.rect.height).fill(data.rect.color);
    }

    public defExecuteLogic(delta: Ticker, object: Graphics, data: BouncingBlockData): void {
        if (this.destroyed) return;

        let dt = delta.deltaTime;

        object.x += data.directions.x * dt * data.directions.speedX;
        object.y += data.directions.y * dt * data.directions.speedY;

        if (object.x + object.width > this.app.canvas.width || object.x < 0) {
            data.directions.x *= -1;
        }

        if (object.y + object.height > this.app.canvas.height || object.y < 0) {
            data.directions.y *= -1;
        }

        object.alpha -= 0.01;

        if (object.alpha <= 0.0) {
            this.destroy({
                children: true,
            });
        }
    }

    public defSetDefaultObjectData(object: Graphics, data: BouncingBlockData): void {
        object.x = data.rect.x;
        object.y = data.rect.y;
    }
}

export default BouncingBlockComponent;