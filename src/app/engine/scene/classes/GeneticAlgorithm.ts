import { NeuralNetwork } from "../../../neural-network/NeuralNetwork";
import { COMBINATION_FACTOR, MUTATION_FACTOR } from "../configuration";

export class GeneticAlgorithm {
    static combine(nn1: NeuralNetwork, nn2: NeuralNetwork): void {
        for (let i = 0; i < nn1.layers.length; i++) {
            nn1.layers[i].bias = nn1.layers[i].bias.map((bias, j) =>
                Math.random() < COMBINATION_FACTOR ? bias : nn2.layers[i].bias[j]
            );
            nn1.layers[i].weights = nn1.layers[i].weights.map((weights, j) =>
                weights.map((weight, k) =>
                    Math.random() < COMBINATION_FACTOR ? weight : nn2.layers[i].weights[j][k]
                )
            );
        }
    }

    static mutate(nn: NeuralNetwork): void {
        for (let i = 0; i < nn.layers.length; i++) {
            nn.layers[i].bias = nn.layers[i].bias.map((bias) =>
                Math.random() < MUTATION_FACTOR ? Math.random() * 2 - 1 : bias
            );
            nn.layers[i].weights = nn.layers[i].weights.map((weights) =>
                weights.map((weight) =>
                    Math.random() < MUTATION_FACTOR ? Math.random() * 2 - 1 : weight
                )
            );
        }
    }
}
