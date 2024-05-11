import { Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CalculateSeasonResult, type CalculateSeasonResultOutput, MemberNoAccountError, PointType } from "@t1fr/backend/member-manage";
import type { SlashCommandContext } from "necord";
import { Context, createCommandGroupDecorator, Options, SlashCommand, Subcommand } from "necord";
import { AccountAutocompleteInterceptor } from "../autocomplete";
import { AwardData, MemberInfoOption, SeasonSummaryOption } from "./PointOption";

const PointCommandDecorator = createCommandGroupDecorator({ name: "point", description: "點數相關命令" });

@PointCommandDecorator()
@Injectable()
export class PointCommand {

    @Inject()
    private readonly commandBus!: CommandBus;

    @SlashCommand({ name: "me", description: "顯示個人資訊、擁有帳號、各項點數" })
    async summary(@Context() [interaction]: SlashCommandContext) {
        // await interaction.deferReply({ ephemeral: true });
        // try {
        //     const summary = await this.pointService.summary(interaction.user.id);
        //     const embeds = PointCommand.summaryToEmbeds(summary);
        //     await interaction.followUp({ embeds, ephemeral: true });
        // } catch (error) {
        //     await interaction.followUp({ content: `${error}`, ephemeral: true });
        // }
    }

    @UseInterceptors(AccountAutocompleteInterceptor)
    @SlashCommand({ name: "info", description: "顯示特定成員的資訊、擁有帳號、各項點數" })
    async showInfo(@Context() [interaction]: SlashCommandContext, @Options() { member }: MemberInfoOption) {
        // await interaction.deferReply();
        // try {
        //     const summary = await this.pointService.summary(member);
        //     const embeds = PointCommand.summaryToEmbeds(summary);
        //     await interaction.followUp({ embeds });
        // } catch (error) {
        //     await interaction.followUp({ content: `${error}`, ephemeral: true });
        // }
    }

    @Subcommand({ name: "season-summary", description: "計算賽季結果並產生獎勵名單內容" })
    async seasonSummary(@Context() [interaction]: SlashCommandContext, @Options() { write, seasonIndex, year, type }: SeasonSummaryOption) {
        if (type === "懲罰") return interaction.reply({ content: "未實裝功能" });

        const channel = interaction.channel;
        if (!channel) return interaction.reply("請在文字頻道使用此命令以顯示報表");

        await interaction.deferReply();
        const normalizedWriteOption = write ?? false;
        const result = await this.commandBus.execute(new CalculateSeasonResult({ year, seasonIndex, write: normalizedWriteOption, type: PointType.Reward }))

        if (result.isErr()) {
            const messages = [result.error.toString()]
            if (result.error instanceof MemberNoAccountError) messages.push(`${result.error.memberIds.map(it => `<@${it}>`).join("\n")}`)
            return interaction.followUp(messages.join("\n"));
        }

        await interaction.followUp("報表如下");

        const messages = this.pointCalculateResultToMessage(result.value, PointType.Reward)

        let buffer = ""
        for (const message of messages) {
            if (buffer.length + message.length <= 2048) {
                buffer += `\n${message}`
            } else {
                channel.send(buffer);
                buffer = ""
            }
        }

        if (buffer.length > 0) channel.send(buffer)
    }

    private pointCalculateResultToMessage(data: CalculateSeasonResultOutput, type: PointType) {

        if (type === PointType.Reward) {

            let total = 0;

            const messages = data
                .toSorted((a, b) => (b.group as number) - (a.group as number))
                .map(({ group, records }) => {
                    const point = group as number;
                    total += (point * records.length)
                    const recordsContent = records.map(record => `> <@${record.memberId}>：${record.comment}`)
                    return [`## 獲得積分：${group}`].concat(recordsContent).join("\n")
                })


            messages.push(`\n**本賽季結算發放總量：${total} 點**`)

            return messages;
        }

        throw Error("尚未實裝")
    }


    @Subcommand({ name: "award", description: "更改成員獎勵積分" })
    @UseInterceptors(AccountAutocompleteInterceptor)
    async award(@Context() [interaction]: SlashCommandContext, @Options() parameters: AwardData) {
        // const delta = parameters.delta;
        // if (delta === 0) return interaction.reply({ content: "沒有變化，忽略" });
        // await this.pointService.award(parameters);
        // interaction.reply({
        //     content: delta > 0 ? `已成功給予 <@${parameters.member}> ${delta} 點獎勵積分` : `已成功扣除 <@${parameters.member}> ${-delta} 點獎勵積分`,
        // });
    }

    // static summaryToEmbeds({ accounts, points, nickname }: Summary) {
    //     const embeds = [];
    //
    //     if (accounts.length) {
    //         const accountFields = selectToFields(accounts, ["_id", "type", "activity", "personalRating"], ["遊戲 ID", "類型", "活躍度", "個人評分"]);
    //         embeds.push(
    //             new EmbedBuilder()
    //                 .setTitle("帳號列表")
    //                 .addFields(...accountFields)
    //                 .setColor("#0071f3")
    //                 .setAuthor({ name: nickname }),
    //         );
    //     }
    //     for (const pointType in points) {
    //         const type = pointType as PointType;
    //         const embed = new EmbedBuilder().setTitle(pointType).setDescription(`總和：${points[type].sum}`).setAuthor({ name: nickname });
    //         if (points[type].logs.length > 0) {
    //             const logFields = selectToFields(points[type].logs, ["date", "delta", "category", "detail"], ["日期", "分類", "變化", "原因"]);
    //             embed.setFields(...logFields);
    //         }
    //         embeds.push(embed);
    //     }
    //
    //     return embeds;
    // }
}
