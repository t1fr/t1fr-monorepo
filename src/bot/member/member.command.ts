import { Injectable } from '@nestjs/common';
import { Context, createCommandGroupDecorator, SlashCommandContext, Subcommand } from 'necord';
import { MemberRepo } from '../../repository/member.repo';
import { MemberType } from '../../enum/MemberType';
import { ConfigRepo } from '../../repository/config.repo';
import { AccountSeasonResult, RewardPointService } from '../../points/reward-point.service';

const MemberCommandDecorator = createCommandGroupDecorator({
  name: 'member',
  description: '管理聯隊內的 DC 帳號',
});

@MemberCommandDecorator()
@Injectable()
export class MemberCommand {

  constructor(private memberRepo: MemberRepo, private configService: ConfigRepo, private readonly rewardPointService: RewardPointService) {
  }

  private get coreRoleId(): string {
    return this.configService.getValue('bot.roles.core_player');
  };

  private get casualRoleId(): string {
    return this.configService.getValue('bot.roles.casual_player');
  };

  @Subcommand({ name: 'load', description: '將現有隊員 Discord 帳號存入資料庫' })
  async onLoadMembers(@Context() [interaction]: SlashCommandContext) {
    const members = await interaction.guild?.members.fetch();
    if (members) {
      await interaction.deferReply();
      const insertedMembers = await Promise.all(members.map((member) => {
        if (member.roles.cache.has(this.coreRoleId)) {
          return this.memberRepo.upsert({ discordId: member.id, nickname: member.nickname ?? member.user.username, memberType: MemberType.CORE });
        } else if (member.roles.cache.has(this.casualRoleId)) {
          return this.memberRepo.upsert({ discordId: member.id, nickname: member.nickname ?? member.user.username, memberType: MemberType.CASUAL });
        }
      }));

      await interaction.followUp({
        content: `已成功將現有 ${insertedMembers.filter(value => value !== undefined).length} 隊員存入資料庫`,
      });
    } else {
      await interaction.reply({ content: '使用命令的伺服器沒有成員' });
    }
  }

  @Subcommand({ name: 'reward-point', description: '計算當前隊員的積分點' })
  async onCalculateRewardPoint(@Context() [interaction]: SlashCommandContext) {
    await interaction.deferReply();
    const results = await this.rewardPointService.calculate();
    const groups = results.filter(result => result.point > 0).reduce((acc: { [key: string]: AccountSeasonResult[] }, val) => {
      const memberId = val.memberId;
      if (acc.hasOwnProperty(memberId)) {
        acc[memberId].push(val);
      } else {
        acc[memberId] = [val];
      }
      return acc;
    }, {});

    const messages = Object.entries(groups).map(group => [
      `<@${group[0]}>`,
      '```',
      group[1].map(seasonResult =>
        `${seasonResult.point.toString().padStart(2)} 積分 原因：\n\t${seasonResult.reasons.join('\n  ➔')}`).join('\n'),
      '```',
    ].join('\n'));
    for (let i = 0; i < messages.length; i += 10) {
      const message = messages.slice(i, i + 10).join('\n');
      await interaction.followUp({ content: message });
    }
  }
}