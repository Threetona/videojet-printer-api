export function calculateChecksum(packet: string): string {
    let sum = 0;
    // Exclude STX (0 index) and ETX + checksum (last 3 characters)
    for (let i = 1; i < packet.length - 3; i++) {
        sum += packet.charCodeAt(i);
    }
    sum = sum % 256;
    const highNibble = Math.floor(sum / 16)
        .toString(16)
        .toUpperCase()
        .padStart(1, '0');
    const lowNibble = (sum % 16).toString(16).toUpperCase().padStart(1, '0');
    return `${highNibble}${lowNibble}`;
}
