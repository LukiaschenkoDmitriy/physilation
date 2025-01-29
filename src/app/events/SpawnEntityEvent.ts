import { EventSystem, FederatedPointerEvent, Ticker } from "pixi.js";
import AbstractEvent from "./AbstractEvent";
import AbstractComponent from "@App/components/basics/AbstractComponent";
import EmmiterComponent from "@App/components/basics/EmitterComponent";
import BouncingBlockComponent from "@App/components/BouncingBlockComponent";
import GravitationPhysic from "@App/physics/GravitationPhysic";
import AirResistancePhysic from "@App/physics/AirResistancePhysic";

export interface SpawnEntityEventConfig {
    canvas: HTMLCanvasElement
    events: EventSystem
}

class SpawnEntityEvent extends AbstractEvent<SpawnEntityEventConfig, SpawnEntityEvent> {
    private mouseIsDown:boolean = false;
    public defEvents() {
        return [
            { eventName: "pointerdown", methodName: "onPointerDown" as const },
            { eventName: "pointerup", methodName: "onPointerUp" as const }
        ];
    }

    public onPointerDown(ev: FederatedPointerEvent, object: AbstractComponent<any,any>, config: SpawnEntityEventConfig): void {
        this.mouseIsDown = true;
    }

    public onPointerUp(ev: FederatedPointerEvent, object: AbstractComponent<any,any>, config: SpawnEntityEventConfig): void {
        this.mouseIsDown = false;
    }

    public whileStateActive(delta: Ticker, object: AbstractComponent<any,any>, data: {}): void {
        if (this.mouseIsDown) {
            const mouse = this.config.events.pointer.global;

            const emmiter = new EmmiterComponent(
                1, BouncingBlockComponent, {}, () => {
                    return {
                        rect: {
                            x: mouse.x,
                            y: mouse.y,
                            width: 2,
                            height: 2,
                            color: 0x00ff00,
                            alfaDelta: 0
                        },
                        directions: {
                            x: 0,
                            y: 0,
                            speedX: 1,
                            speedY: 1
                        }
                    }
                }
            );

            emmiter.addPhysicForChilds(new GravitationPhysic({gravity: 0.1, groundLevel: this.config.canvas.height - 5}))
            emmiter.addPhysicForChilds(new AirResistancePhysic({airResistance: 1.5, windForce: 1, windAngle: -45}))
            object.addChild(emmiter);
        }
    }
}

export default SpawnEntityEvent;