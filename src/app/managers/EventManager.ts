import AbstractComponent from "@App/components/basics/AbstractComponent";
import AbstractEvent from "@App/events/AbstractEvent";
import { Ticker } from "pixi.js";

class EventManager {
    private events: AbstractEvent<any, any>[] = [];

    public addEvent(event: AbstractEvent<any, any>, objects: AbstractComponent<any, any>[]): void {
        if (this.events.some((ev: AbstractEvent<any, any>) => event.getEventName() == ev.getEventName())) return;
        this.events.push(event);
        event.bind(objects);
    }

    public removeEvent(event: AbstractEvent<any, any>): void {
        this.events = this.events.filter((ev: AbstractEvent<any, any>) => event.getEventName() != ev.getEventName());
    }

    public executeStateActiveEvents(delta: Ticker, object: AbstractComponent<any,any>, data: any): void {
        this.events.forEach((event: AbstractEvent<any, any>) => {
            event.whileStateActive(delta, object, data);
        });
    }

    public getEvents(): AbstractEvent<any, any>[] {
        return this.events;
    }
}

export default EventManager;