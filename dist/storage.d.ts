export declare class MemoryStorage {
    #private;
    constructor(scope: string);
    setItem(key: string, value: string): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    clear(): void;
    scopedKey(key: string): string;
}
