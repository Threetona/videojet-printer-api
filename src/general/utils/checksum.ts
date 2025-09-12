export function calculateChecksum(packet: string): string {
    let sum = 0;
    for (let i = 1; i < packet.length; i++) {
        sum += packet.charCodeAt(i);
    }
    sum = sum % 256;
    return sum.toString(16).toUpperCase().padStart(2, '0');
}
