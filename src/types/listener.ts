import { Callback } from "./callback";

export type Listener<T extends Callback<any[]>> = {
    callback: T;
    priority: number;
};
