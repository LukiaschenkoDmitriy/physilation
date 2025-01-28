import AbstractComponent from "@App/components/AbstractComponent";
import { Ticker } from "pixi.js";

abstract class AbstractPhysic<ConfigData> {
    private config: ConfigData;
    public constructor(config: ConfigData) {
        this.config = config;

        if (!this.validateConfig(this.config)) {
            throw new Error("Invalid config");
        }
    }
    public abstract defLogic(object: AbstractComponent<any,any>, delta: Ticker, config: ConfigData): void
    public abstract validateConfig(config: any): boolean;
    public logic(object: AbstractComponent<any,any>, delta: Ticker, config: ConfigData): void {
        this.defLogic(object, delta, config);
    }
    public update(objects: AbstractComponent<any,any>[], delta: Ticker) {
        objects.forEach((object: AbstractComponent<any,any>) => {
            this.logic(object, delta, this.config);
        });
    }
}

export default AbstractPhysic;