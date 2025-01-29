import AbstractPhysic from "./AbstractPhysic";
import { Ticker } from "pixi.js";
import AbstractComponent from "@App/components/basics/AbstractComponent";

export interface AirResistancePhysicConfig {
    airResistance: number;
    windForce: number;
    windAngle: number;
}

class AirResistancePhysic extends AbstractPhysic<AirResistancePhysicConfig> {
    public defLogic(object: AbstractComponent<any, any>, delta: Ticker, config: AirResistancePhysicConfig): void {
        const data = object.getData();
        
        if (data && data.directions) {
            let directions = data.directions;
            
            // Опір повітря діє на швидкість
            directions.speedX -= directions.speedX * config.airResistance;
            directions.speedY -= directions.speedY * config.airResistance;
            
            // Додаємо вплив вітру з урахуванням кута
            const windRad = (config.windAngle * Math.PI) / 180;
            directions.speedX += config.windForce * Math.cos(windRad);
            directions.speedY += config.windForce * Math.sin(windRad);
            
            // Оновлюємо позицію об'єкта
            object.x += directions.speedX * delta.deltaTime;
            object.y += directions.speedY * delta.deltaTime;
        }
    }

    public validateConfig(config: AirResistancePhysicConfig): boolean {
        return config.airResistance !== undefined && config.windForce !== undefined && config.windAngle !== undefined;
    }
}

export default AirResistancePhysic;