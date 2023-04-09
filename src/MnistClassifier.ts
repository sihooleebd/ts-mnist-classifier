import {
  BATCH_SIZE,
  H1_DIM,
  H2_DIM,
  INPUT_DIM,
  LEARNING_RATE,
  N_EPOCHS,
  OUTPUT_DIM,
  TEST_DATA_SIZE,
  TRAINING_DATA_SIZE,
  VALIDATION_DATA_SIZE,
} from './constant';
import { denominatorOfSoftmax, findMaxItem, sigmoid, softmax } from './utils';
import Data from './Data';
import Model from './Model';

class MnistClassifier {
  model: Model;
  trainingData: Data;
  validationData: Data;
  testData: Data;
  constructor() {
    this.model = new Model();
    this.trainingData = new Data();
    this.validationData = new Data();
    this.testData = new Data();
    this.model.init();
  }

  setData(csv: string) {
    const arr = csv.split(`\n`);
    for (let i = 1; i <= TRAINING_DATA_SIZE; ++i) {
      this.trainingData.add(arr[i]);
    }
    for (
      let i = TRAINING_DATA_SIZE + 1;
      i <= TRAINING_DATA_SIZE + VALIDATION_DATA_SIZE;
      ++i
    ) {
      this.validationData.add(arr[i]);
    }
    for (
      let i = TRAINING_DATA_SIZE + VALIDATION_DATA_SIZE + 1;
      i <= TRAINING_DATA_SIZE + VALIDATION_DATA_SIZE + TEST_DATA_SIZE;
      ++i
    ) {
      this.testData.add(arr[i]);
    }
  }

  forward(data: Data, from: number, to: number) {
    for (let di = from; di <= to; ++di) {
      for (let h1i = 0; h1i < H1_DIM; ++h1i) {
        data.h1[di][h1i] = data.x[di].reduce(
          (prev, cur, i) => prev + cur * this.model.ih1[i][h1i],
          0,
        );
        data.h1s[di][h1i] = sigmoid(data.h1[di][h1i]);
      }
      for (let h2i = 0; h2i < H2_DIM; ++h2i) {
        data.h2[di][h2i] = data.h1s[di].reduce(
          (prev, cur, h1si) => prev + cur * this.model.h1h2[h1si][h2i],
          0,
        );
        data.h2s[di][h2i] = sigmoid(data.h2[di][h2i]);
      }

      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        data.z[di][zi] = data.h2s[di].reduce(
          (prev, cur, h2si) => prev + cur * this.model.h2z[h2si][zi],
          0,
        );
      }
      const denominator = denominatorOfSoftmax(data.z[di]);
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        data.out[di][zi] = softmax(data.z[di][zi], denominator);
      }
    }
  }

  getCrossEntropy(data: Data, from: number, to: number) {
    let crossEntropySum = 0;
    for (let di = from; di <= to; ++di) {
      const answer: number = data.y[di];
      crossEntropySum += -1 * Math.log(data.out[di][answer]);
    }
    return crossEntropySum;
  }

  backward(from: number, to: number) {
    for (let di = from; di <= to; ++di) {
      const answer = this.trainingData.y[di];
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        const outI = this.trainingData.out[di][zi];
        const yI = zi === answer ? 1 : 0;
        this.trainingData.pepz[di][zi] = outI - yI;
      }

      for (let h2si = 0; h2si < H2_DIM; ++h2si) {
        this.trainingData.peph2s[di][h2si] = this.trainingData.pepz[di].reduce(
          (acc, cur, zi) => acc + cur * this.model.h2z[h2si][zi],
          0,
        );
        this.trainingData.peph2[di][h2si] =
          this.trainingData.peph2s[di][h2si] *
          this.trainingData.h2s[di][h2si] *
          (1 - this.trainingData.h2s[di][h2si]); // derivative of sigmoid
      }

      for (let h1si = 0; h1si < H1_DIM; ++h1si) {
        this.trainingData.peph1s[di][h1si] = this.trainingData.peph2[di].reduce(
          (acc, cur, h2i) => acc + cur * this.model.h1h2[h1si][h2i],
          0,
        );
        this.trainingData.peph1[di][h1si] =
          this.trainingData.peph1s[di][h1si] *
          this.trainingData.h1s[di][h1si] *
          (1 - this.trainingData.h1s[di][h1si]); // derivative of sigmoid
      }
    }
  }
  step(from: number, to: number) {
    const dataSize = to - from + 1;
    for (let h2si = 0; h2si < H2_DIM + 1; ++h2si) {
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        let gradient = 0;
        for (let di = from; di <= to; ++di) {
          gradient +=
            this.trainingData.pepz[di][zi] * this.trainingData.h2s[di][h2si];
        }
        this.model.h2z[h2si][zi] -= LEARNING_RATE * (gradient / dataSize);
      }
    }
    for (let h1si = 0; h1si < H1_DIM + 1; ++h1si) {
      for (let h2i = 0; h2i < H2_DIM; ++h2i) {
        let gradient = 0;
        for (let di = from; di <= to; ++di) {
          gradient +=
            this.trainingData.peph2[di][h2i] * this.trainingData.h1s[di][h1si];
        }
        this.model.h1h2[h1si][h2i] -= LEARNING_RATE * (gradient / dataSize);
      }
    }
    for (let i = 0; i < INPUT_DIM + 1; ++i) {
      for (let h1i = 0; h1i < H1_DIM; ++h1i) {
        let gradient = 0;
        for (let di = from; di <= to; ++di) {
          gradient +=
            this.trainingData.peph1[di][h1i] * this.trainingData.x[di][i];
        }
        this.model.ih1[i][h1i] -= LEARNING_RATE * (gradient / dataSize);
      }
    }
  }

  train() {
    let totalLoss = 0;
    for (let i = 0; i < TRAINING_DATA_SIZE; i += BATCH_SIZE) {
      const from = i;
      const to = i + BATCH_SIZE - 1;

      this.forward(this.trainingData, from, to);
      const lossOfMiniBatch = this.getCrossEntropy(this.trainingData, from, to);

      this.backward(from, to);
      this.step(from, to);
      totalLoss += lossOfMiniBatch;
    }
    return totalLoss / TRAINING_DATA_SIZE;
  }

  validate() {
    const from = 0;
    const to = VALIDATION_DATA_SIZE - 1;

    this.forward(this.validationData, from, to);
    return (
      this.getCrossEntropy(this.validationData, from, to) / VALIDATION_DATA_SIZE
    );
  }

  doTrain() {
    for (let epochIdx = 0; epochIdx < N_EPOCHS; ++epochIdx) {
      const trainingLoss = this.train();
      const validatingLoss = this.validate();
      console.log(
        `${
          epochIdx + 1
        },${trainingLoss},${validatingLoss},${this.calculateAccuracy()}`,
      );
    }
  }
  calculateAccuracy() {
    this.forward(this.validationData, 0, VALIDATION_DATA_SIZE - 1);
    const maxItemArr: number[] = [];
    for (let i = 0; i < VALIDATION_DATA_SIZE; ++i) {
      maxItemArr[i] = findMaxItem(this.validationData.out[i]);
    }
    let correctCount = 0;
    for (let i = 0; i < VALIDATION_DATA_SIZE; ++i) {
      if (this.validationData.y[i] == maxItemArr[i]) {
        correctCount++;
      }
    }
    return correctCount / VALIDATION_DATA_SIZE;
  }
}

export default MnistClassifier;
