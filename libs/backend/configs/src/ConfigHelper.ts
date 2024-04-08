import { Logger } from "@nestjs/common";
import { ConfigObject } from "@nestjs/config";
import { readFileSync } from "fs";
import { globSync } from "glob";
import { load } from "js-yaml";
import { isArray, mergeWith } from "lodash";
import path from "path";

export class ConfigHelper {
    static Config: ConfigObject = {};
    private static logger = new Logger(ConfigHelper.name);

    static loadGlob() {
        const pattern = path.resolve(__dirname, "config", "**/*.config.json").replace(/\\/g, "/");
        const filenames = globSync(pattern);
        const configs = filenames.reduce((record, filename) => {
            this.logger.verbose(`載入 ${filename}`);
            const extension = path.extname(filename);
            const basename = path.basename(filename, extension).replace(".config", "");
            const content = readFileSync(filename, { encoding: "utf8" });
            const configObject = load(content, { json: true });
            return mergeWith(record, { [basename]: configObject }, (a, b) => isArray(b) ? b : undefined);
        }, {});
        Object.assign(this.Config, configs);
    }
}
