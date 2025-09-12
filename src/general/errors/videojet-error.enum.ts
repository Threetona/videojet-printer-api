export enum VideojetError {
    ChargePumpFault = 'Charge error: Pump fault → Cek pompa tinta, pastikan tidak tersumbat.',
    EHTCabinetHot = 'EHT Trip: Cabinet terlalu panas → Periksa kipas pendingin & ventilasi.',
    GutterFault = 'Gutter fault: Ink core service overdue → Lakukan service ink core.',
    InkCoreEmpty = 'Ink core empty → Pasang cartridge baru.',

    PhaseMax = 'Phasing threshold maksimum – phasing gagal → Reset phasing.',
    AutoModFail = 'Auto mod gagal → Periksa modulasi nozzle.',
    InitialTrimFail = 'Initial phasing trim gagal → Cek sirkuit phasing.',
    PhaseMin = 'Phasing threshold minimum – phasing gagal → Kalibrasi ulang phasing.',

    RasterOverflow = 'Raster memory overflow → Restart printer.',
    ValveError = 'Valve error → Periksa katup tinta, kemungkinan macet.',
    CoreNotFilling = 'Core tidak terisi → Cek kebocoran & valve.',
    ModulationFail = 'Modulation readback gagal → Cek rangkaian modulasi/nozzle.',

    DateTimeNotSet = 'Tanggal/Waktu belum diatur → Set pada menu printer.',
    InkCoreMismatch = 'Ink Core berbeda → Ganti dengan core yang sesuai.',
    EHTCalibrationRequired = 'Kalibrasi EHT diperlukan → Jalankan prosedur kalibrasi.',
    InkInsufficient = 'Tinta tidak cukup → Pasang cartridge tinta.',

    ViscosityControlFail = 'Viscosity control gagal → Periksa tinta & sensor viskositas.',
    TempSensorFault = 'Temperature sensor fault → Cek sensor suhu.',
    FatalFirmwareError = 'Fatal error: Tidak ada respons firmware → Restart printer / hubungi teknisi.',
}
