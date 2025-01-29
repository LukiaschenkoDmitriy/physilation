import AbstractComponent from "@App/components/basics/AbstractComponent";
import { FederatedPointerEvent, Ticker } from "pixi.js";

type EventMethod<T, Config> = (this: T, event: FederatedPointerEvent, object: AbstractComponent<any, any>, config: Config) => void;
type EventMethodName<T, Config> = {
    [K in keyof T]: T[K] extends EventMethod<T, Config> ? K : never;
}[keyof T];

abstract class AbstractEvent<EventConfig, T> {
    protected config: EventConfig;
    private eventName?: string;
    public constructor(config: EventConfig, eventName?: string) {
        this.config = config;
        this.eventName = eventName;
    }

    public bind(objects: AbstractComponent<any, any>[]): void {
        const events = this.defEvents();

        objects.forEach((object: AbstractComponent<any, any>) => {
            events.forEach((event) => {
                object.on(event.eventName, (ev: FederatedPointerEvent) => {
                    const methodName = event.methodName as keyof this;
                    const method = this[methodName];

                    if (typeof method === "function") {
                        (method as EventMethod<this, EventConfig>).call(this, ev, object, this.config);
                    } else {
                        console.warn(`Method ${event.methodName.toString()} not found on`, this);
                    }
                });
            });
        });
    }


    public unBindEvent(objects: AbstractComponent<any, any>[]): void {
        const events = this.defEvents();
        objects.forEach((object: AbstractComponent<any, any>) => {
            events.forEach((event) => {
                object.off(event.eventName);
            });
        });
    }

    public getEventName(): string {
        return (this.eventName) ? this.eventName: this.constructor.name;
    }

    public whileStateActive(delta: Ticker, object: AbstractComponent<any,any>, data: any) {}
    public abstract defEvents(): {eventName: string, methodName: EventMethodName<T, EventConfig>}[];
}

export default AbstractEvent;

