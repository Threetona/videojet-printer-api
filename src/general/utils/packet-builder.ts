import { PacketType } from '../../printer/types/packet-type.enum';
import { calculateChecksum } from './checksum';

export function createPacket(
    type: PacketType,
    lines: {
        font: string;
        horc: string;
        code: string;
        text: string;
        attribute?: string;
    }[],
): Buffer {
    const STX = String.fromCharCode(0x02);
    const ETX = String.fromCharCode(0x03);
    const LF = String.fromCharCode(0x0a);

    const dataLines = lines.map((line, index) => {
        const attr = line.attribute ?? '000000';
        const formattedLine = `${line.font}${line.horc}${line.code}${attr}${line.text}`;
        return index === 0 ? `${type}${formattedLine}` : formattedLine;
    });

    const body = dataLines.join(LF);
    const packetWithoutChecksum = `${STX}${body}${ETX}`;
    const checksum = calculateChecksum(packetWithoutChecksum);
    const finalPacket = `${packetWithoutChecksum}${checksum}`;

    return Buffer.from(finalPacket, 'ascii');
}
