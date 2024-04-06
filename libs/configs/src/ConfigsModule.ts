import { Module } from "@nestjs/common";
import { ConfigModule, ConfigObject } from "@nestjs/config";
import { globSync } from "glob";
import * as path from "path";
import * as console from "console";


const loadGlob = () => {
	const matches = globSync(path.resolve(__dirname, "config", "**/!(*.d).config.ts"));
	console.log(path.resolve(__dirname, "config", "**/!(*.d).config.ts"));
	console.log(matches);
	return matches.reduce((configs: ConfigObject, filepath) => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const module = require(filepath);
		const config = module.default || module;
		const ext = path.extname(filepath);
		const configName = path.basename(filepath, ext).replace(".config", "");
		configs[configName] = config;
		return configs;
	}, {});
};

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true, load: [loadGlob] })],
	providers: [],
	exports: [],
})
export class ConfigsModule {
}

