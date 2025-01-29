import AbstractComponent from "@App/components/basics/AbstractComponent";
import { Ticker } from "pixi.js";
import AbstractPhysic from "./AbstractPhysic";

export interface GravigationPhysicConfig {
    gravity: number;
    groundLevel: number;
}

class GravitationPhysic extends AbstractPhysic<GravigationPhysicConfig> {
    public defLogic(object: AbstractComponent<any, any>, delta: Ticker, config: GravigationPhysicConfig): void {
        const data = object.getData();

        if (data && data.directions) {
            let directions = data.directions;

            directions.speedY += config.gravity;

            object.y += directions.speedY * delta.deltaTime;

            if (object.y > config.groundLevel) {
                object.y = config.groundLevel;
                directions.speedY *= -0.8;
            }
        }
    }

    public validateConfig(config: GravigationPhysicConfig): boolean {
        return config.gravity != undefined && config.groundLevel != undefined;
    }
}

export default GravitationPhysic;