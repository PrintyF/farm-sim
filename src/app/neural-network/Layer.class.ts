export class Layer {
    weights: number[][] = [];
    bias: number[] = [];
    inputs: any[] = [];
    outputs: any[] = [];

    constructor(private inputCount: number,
                private outputCount: number) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.weights = this.randomMatrix(this.inputCount, this.outputCount);
        this.bias = this.randomMatrix(1, this.outputCount)[0];
    }

    randomMatrix(rows: number, cols: number): number[][] {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() * 2 - 1)
        );
    }

    static feedForward(givenInputs: number[], layer: Layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = givenInputs[i];
        }
        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = 0;

            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j] * layer.weights[j][i]; 
            }
            layer.outputs[i] = sum > layer.bias[i] ? 1 : 0;
        }
        return layer.outputs;
    }
    
}