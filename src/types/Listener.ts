import { Callback } from "@/types/Callback";

export type Listener<T extends Callback<any[]>> = {
    callback: T;
    priority: number;
};
