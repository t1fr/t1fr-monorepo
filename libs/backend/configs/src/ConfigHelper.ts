import { ConfigObject } from "@nestjs/config";

type Transform = (value: unknown) => unknown

export class ConfigHelper {
    static Config: ConfigObject = {};

    private static keys = new Array<{ key: string, fallback?: unknown, transform?: Transform }>();

    static setKey(key: string, fallback?: unknown, transform?: Transform) {
        if (this.keys.some(it => it.key === key)) return;
        this.keys.push({ key, fallback, transform });
    }

    static getKeys() {
        return this.keys;
    }
}
