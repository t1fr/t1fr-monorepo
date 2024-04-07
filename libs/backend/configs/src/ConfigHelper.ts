import { ConfigObject } from "@nestjs/config";
import path from "path";
import { globSync } from "glob";
import { Logger } from "@nestjs/common";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { isArray, mergeWith } from "lodash";

export class ConfigHelper {
  static Config: ConfigObject = {};
  private static logger = new Logger(ConfigHelper.name);

  static loadGlob() {
    const pattern = path.resolve(__dirname, "config", "**/*.config.json").replace(/\\/g, "/");
    const filenames = globSync(pattern);
    const configs = filenames.reduce((record, filename) => {
      Logger.verbose(`Load ${filename}`);
      const extension = path.extname(filename);
      const basename = path.basename(filename, extension).replace(".config", "");
      const content = readFileSync(filename, { encoding: "utf8" });
      const configObject = load(content, { json: true });
      return mergeWith(record, { [basename]: configObject }, (a, b) => isArray(b) ? b : undefined);
    }, {});
    Object.assign(this.Config, configs);
    this.logger.verbose("loaded config:", this.Config);
  }
}
