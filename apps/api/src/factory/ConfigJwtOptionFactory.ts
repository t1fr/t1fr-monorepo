import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { Configuration } from "@t1fr/backend/configs";

export class ConfigJwtOptionFactory implements JwtOptionsFactory {
    @Configuration("jwt")
    private readonly options!: JwtModuleOptions;

    createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
        return this.options;
    }
}