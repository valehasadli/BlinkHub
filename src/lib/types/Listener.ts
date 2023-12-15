export type Listener<T> = {
    callback: T;
    priority: number;
};
