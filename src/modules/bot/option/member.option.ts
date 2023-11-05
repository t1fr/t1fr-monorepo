import { StringOption } from 'necord'
import { arrayToChoices } from '@/utlity'
import { PointType, PointTypes } from '@/modules/management/point/point.schema'

export class PointListOption {
  @StringOption({ name: "type", description: "積分類型", choices: arrayToChoices(PointTypes) })
  type?: PointType;
}

export class JoinOption {
  @StringOption({
    name: "type",
    description: "申請項目",
    required: true,
    choices: arrayToChoices(["休閒隊員", "聯隊戰隊員", "轉聯隊戰隊員", "轉休閒隊員"]),
  })
  type: string;
}