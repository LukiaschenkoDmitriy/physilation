import AbstractComponent from "@App/components/basics/AbstractComponent";
import AbstractPhysic from "@App/physics/AbstractPhysic";
import { Ticker } from "pixi.js";

class PhysicsManager {
    private physics: AbstractPhysic<any>[] = [];

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

    public update(components: AbstractComponent<any, any>[], delta: Ticker) {
        this.physics.forEach(physic => physic.update(components, delta));
    }

    public clear() {
        this.physics = [];
    }

    public getPhysics(): AbstractPhysic<any>[] {
        return this.physics;
    }

    public getPhysicByName(name: string): AbstractPhysic<any> | undefined {
        return this.physics.find(p => p.constructor.name === name);
    }
}

export default PhysicsManager;