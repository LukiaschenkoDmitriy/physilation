import AbstractComponent, { AbstractComponentData } from "./AbstractComponent";
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
        super(app, componentData, options);
    }
    public defRender(data: BouncingBlockData): Graphics {
        return (new Graphics()).rect(0, 0, data.rect.width, data.rect.height).fill(data.rect.color);
    }

    public defExecuteLogic(delta: Ticker, object: Graphics, data: BouncingBlockData): void {
        if (this.destroyed) return;

        let dt = delta.deltaTime;

        this.x += data.directions.x * dt * data.directions.speedX;
        this.y += data.directions.y * dt * data.directions.speedY;

        if (this.x + this.width > this.app.canvas.width || this.x < 0) {
            data.directions.x *= -1;
        }

        if (this.y + this.height > this.app.canvas.height || this.y < 0) {
            data.directions.y *= -1;
        }

        this.alpha -= data.rect.alfaDelta * dt;

        if (this.alpha <= 0.0) {
            this.destroy();
        }
    }

    public defSetDefaultObjectData(object: Graphics, data: BouncingBlockData): void {
        this.x = data.rect.x;
        this.y = data.rect.y;
    }
}

export default BouncingBlockComponent;