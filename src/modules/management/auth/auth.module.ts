import { Module } from "@nestjs/common";
import { MemberModule } from "@/modules/management/member/member.module";
import { AuthController } from "@/modules/management/auth/auth.controller";
import { AuthService } from "@/modules/management/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [MemberModule, JwtModule.register({ secret: "***REMOVED***", signOptions: { expiresIn: "30min" }, global: true })],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
