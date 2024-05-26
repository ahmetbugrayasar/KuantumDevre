const LOCAL_STORAGE_ITEM_CONFIG = 'synthesis_config';

const DEFAULT_SYNTHESIS_CONFIG = {
    numOfAnts: 20,
    numOfIterations: 30,
    alpha: 2.0,
    beta: 1.5,
    evaporationRate: 0.3,
    localLoops: 4,
    searchDepth: 6,
    disableNegativeControl: true,
    baseGate: 'toffoli',
};

export function updateSynthesisConfig(config) {
    const configJSON = JSON.stringify(config);
    window.localStorage.setItem(LOCAL_STORAGE_ITEM_CONFIG, configJSON);
}

export function getSynthesisConfig() {
    const storedConfig = window.localStorage.getItem(LOCAL_STORAGE_ITEM_CONFIG);
    if (!storedConfig) {
        return DEFAULT_SYNTHESIS_CONFIG;
    }

    return JSON.parse(storedConfig);
}

function mapControlBits(controlBits) {
    let res = [];
    for (let i = 0; i < controlBits.length; i++) {
        if (controlBits[i] === 0) {
            res.push(i);
        }
    }
    return res;
}

function mapGateType(gateType) {
    if (gateType === 'toffoli' || gateType === 'cnot' || gateType === 'not') {
        return 'x';
    }
    if (gateType === 'fredkin') {
        return 'swap';
    }
    throw new Error('unknown gate type ' + gateType);
}

export function synthesize(tt, onResult) {
    const conf = getSynthesisConfig();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/api/v1/synth');
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onload = () => {
        if (xhr.status !== 200) {
            throw new Error(`got status ${xhr.status}`);
        }

        const resp = JSON.parse(xhr.responseText);

        window.alert(`Successfully synthesized a circuit with ${resp.errorsCount} errors`);

        let circuit = [];
        for (const gate of resp.gates) {
            circuit.push({
                type: mapGateType(gate.type),
                time: circuit.length,
                targets: gate.targetBits,
                controls: mapControlBits(gate.controlBits),
            });
        }

        onResult({
            gates: [],
            circuit,
            qubits: tt.in[0].length,
            input: tt.in[0],
        });
    };
    xhr.send(JSON.stringify({
        config: conf,
        target: { inputs: tt.in, outputs: tt.out },
    }));
}
