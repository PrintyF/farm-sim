import { Layer } from './Layer.class'

export class NeuralNetwork {
    layers: Layer[] = [];

    constructor(neuronCount: number[]) {
        for (let i = 0; i < neuronCount.length - 1; i++ ) {
            this.layers.push(new Layer(neuronCount[i], neuronCount[i  + 1]));  
        }
    }

    feedForward(givenInputs: number[]) {
        let outputs = Layer.feedForward(givenInputs, this.layers[0]);

        for (let i = 0; i < this.layers.length; i++) {
            outputs = Layer.feedForward(outputs, this.layers[i]);
        }
        return outputs;
    }
    
}