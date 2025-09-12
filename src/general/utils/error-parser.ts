import { ERROR_LOOKUP } from '../errors/error-lookup.map';
import {
    VIDEOJET_WARNINGS,
    VideojetWarningInfo,
} from '../errors/videojet-warning.map';

export function parseErrorStatus(hex: string): VideojetWarningInfo[] {
    const warnings: VideojetWarningInfo[] = [];

    if (hex.length < 12) {
        return [
            {
                code: 'INVALID',
                message: 'Invalid error response',
                solution: 'Periksa koneksi & format response.',
            },
        ];
    }

    const bytes: number[] = [];
    for (let i = 0; i < 12; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    bytes.forEach((byte, index) => {
        const lookup = ERROR_LOOKUP[index];
        if (!lookup) return;

        Object.keys(lookup).forEach((bitStr) => {
            const bit = parseInt(bitStr, 10);
            if (byte & (1 << bit)) {
                const code = lookup[bit];
                const info = VIDEOJET_WARNINGS[code];
                if (info) {
                    warnings.push(info);
                }
            }
        });
    });

    return warnings;
}
