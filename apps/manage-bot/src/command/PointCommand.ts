import { Injectable, UseInterceptors } from "@nestjs/common";
import type { SlashCommandContext } from "necord";
import { Context, createCommandGroupDecorator, Options, SlashCommand, Subcommand } from "necord";
import { AccountAutocompleteInterceptor } from "../autocomplete";
import { AwardData, MemberInfoOption, SeasonSummary } from "./PointOption";

const PointCommandDecorator = createCommandGroupDecorator({ name: "point", description: "點數相關命令" });

@PointCommandDecorator()
@Injectable()
export class PointCommand {

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
    async seasonSummary(@Context() [interaction]: SlashCommandContext, @Options() { writeInToDb, type }: SeasonSummary) {
        // if (type === "懲罰") return interaction.reply({ content: "未實裝功能" });
        //
        // await interaction.deferReply();
        // const content = await this.pointService.calculate(type, writeInToDb);
        // await interaction.followUp({ content: "報表如下" });
        // const channel = interaction.channel;
        // if (!channel) return;
        //
        // for (let i = 0; i < content.length; i += 10) {
        //     await channel.send({ content: content.slice(i, i + 10).join("\n") });
        // }
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
