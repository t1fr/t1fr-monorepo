import { Module } from "@nestjs/common";
import { AccountModule } from "./account";
import { MemberModule } from "./member";
import PointModule from "./point/point.module";

@Module({
  imports: [MemberModule, AccountModule, PointModule],
  exports: [MemberModule, AccountModule, PointModule],
})
export class ManagementModule {
}
