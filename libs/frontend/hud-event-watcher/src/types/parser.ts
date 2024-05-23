import { Player } from "./Player";

const PlayerRegex = /(\W?(?<squadron>\w{2,5})\W? )?(?<id>.{1,16}?) \((?<vehicle>[^)]*\)?)\)/;

export function parseDamageMessage(message: string): Player | null {
    const normalizedMessage = message.replaceAll("\t", "")
    const match = normalizedMessage.match(PlayerRegex)
    if (match === null || !match.groups) return null

    const { squadron, id, vehicle } = match.groups
    return new Player(id, squadron ?? null, vehicle)
}

