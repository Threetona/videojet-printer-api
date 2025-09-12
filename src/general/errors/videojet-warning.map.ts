export interface VideojetWarningInfo {
    code: string;
    message: string;
    solution: string;
}

export const VIDEOJET_WARNINGS: Record<string, VideojetWarningInfo> = {
    ChargePumpFault: {
        code: 'ChargePumpFault',
        message: 'Charge error: Pump fault',
        solution: 'Cek pompa tinta, pastikan tidak tersumbat.',
    },
    EHTCabinetHot: {
        code: 'EHTCabinetHot',
        message: 'EHT Trip: Cabinet terlalu panas',
        solution: 'Periksa kipas pendingin & ventilasi.',
    },
    GutterFault: {
        code: 'GutterFault',
        message: 'Gutter fault: Ink core service overdue',
        solution: 'Lakukan service ink core.',
    },
    InkCoreEmpty: {
        code: 'InkCoreEmpty',
        message: 'Ink core empty',
        solution: 'Pasang cartridge baru.',
    },
    // ... lanjutkan semua mapping lama
};
