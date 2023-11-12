export interface OutInterface<T> {
    state: number;
    message: string;
    total?: number;
    data: T[];
}
