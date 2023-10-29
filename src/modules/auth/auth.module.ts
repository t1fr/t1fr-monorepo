import { Module } from "@nestjs/common";
import { AuthController } from "@/modules/auth/auth.controller";
import { AuthService } from "@/modules/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ManagementModule } from "@/modules/management/management.module";

@Module({
	imports: [ManagementModule, JwtModule.register({ secret: "***REMOVED***", signOptions: { expiresIn: "30min" }, global: true })],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
