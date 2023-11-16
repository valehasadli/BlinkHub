import { Callback } from "./Callback";

export type Listener<T extends Callback<any[]>> = {
    callback: T;
    priority: number;
};
