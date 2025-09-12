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
    PhaseMax: {
        code: 'PhaseMax',
        message: 'Phasing threshold maksimum – phasing gagal',
        solution: 'Reset phasing.',
    },
    AutoModFail: {
        code: 'AutoModFail',
        message: 'Auto mod gagal',
        solution: 'Periksa modulasi nozzle.',
    },
    InitialTrimFail: {
        code: 'InitialTrimFail',
        message: 'Initial phasing trim gagal',
        solution: 'Cek sirkuit phasing.',
    },
    PhaseMin: {
        code: 'PhaseMin',
        message: 'Phasing threshold minimum – phasing gagal',
        solution: 'Kalibrasi ulang phasing.',
    },
    RasterOverflow: {
        code: 'RasterOverflow',
        message: 'Raster memory overflow',
        solution: 'Restart printer.',
    },
    ValveError: {
        code: 'ValveError',
        message: 'Valve error',
        solution: 'Periksa katup tinta, kemungkinan macet.',
    },
    CoreNotFilling: {
        code: 'CoreNotFilling',
        message: 'Core tidak terisi',
        solution: 'Cek kebocoran & valve.',
    },
    ModulationFail: {
        code: 'ModulationFail',
        message: 'Modulation readback gagal',
        solution: 'Cek rangkaian modulasi/nozzle.',
    },
    DateTimeNotSet: {
        code: 'DateTimeNotSet',
        message: 'Tanggal/Waktu belum diatur',
        solution: 'Set pada menu printer.',
    },
    InkCoreMismatch: {
        code: 'InkCoreMismatch',
        message: 'Ink Core berbeda',
        solution: 'Ganti dengan core yang sesuai.',
    },
    EHTCalibrationRequired: {
        code: 'EHTCalibrationRequired',
        message: 'Kalibrasi EHT diperlukan',
        solution: 'Jalankan prosedur kalibrasi.',
    },
    InkInsufficient: {
        code: 'InkInsufficient',
        message: 'Tinta tidak cukup',
        solution: 'Pasang cartridge tinta.',
    },
    ViscosityControlFail: {
        code: 'ViscosityControlFail',
        message: 'Viscosity control gagal',
        solution: 'Periksa tinta & sensor viskositas.',
    },
    TempSensorFault: {
        code: 'TempSensorFault',
        message: 'Temperature sensor fault',
        solution: 'Cek sensor suhu.',
    },
    FatalFirmwareError: {
        code: 'FatalFirmwareError',
        message: 'Fatal error: Tidak ada respons firmware',
        solution: 'Restart printer / hubungi teknisi.',
    },
};
