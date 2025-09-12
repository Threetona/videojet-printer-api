export const ERROR_LOOKUP: {
    [byteIndex: number]: { [bit: number]: string }; // pakai code string
} = {
    0: {
        0: 'ChargePumpFault',
        1: 'EHTCabinetHot',
        2: 'GutterFault',
        3: 'InkCoreEmpty',
    },
    1: {
        0: 'PhaseMax',
        1: 'AutoModFail',
        2: 'InitialTrimFail',
        3: 'PhaseMin',
    },
    2: {
        0: 'RasterOverflow',
        1: 'ValveError',
        2: 'CoreNotFilling',
        3: 'ModulationFail',
    },
    3: {
        0: 'DateTimeNotSet',
        1: 'InkCoreMismatch',
        2: 'EHTCalibrationRequired',
        3: 'InkInsufficient',
    },
    4: {
        0: 'ViscosityControlFail',
        1: 'TempSensorFault',
    },
    5: {
        0: 'FatalFirmwareError',
    },
};
