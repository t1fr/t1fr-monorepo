import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { ManagementModule } from "@t1fr/legacy/management";
import { AuthService } from "./auth.service";

@Module({
	imports: [ManagementModule, JwtModule.register({ secret: "***REMOVED***", signOptions: { expiresIn: "30min" }, global: true })],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
