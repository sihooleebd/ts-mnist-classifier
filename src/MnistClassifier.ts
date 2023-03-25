import {
  BATCH_SIZE,
  H_DIM,
  INPUT_DIM,
  LEARNING_RATE,
  N_EPOCHS,
  OUTPUT_DIM,
  TEST_DATA_SIZE,
  TRAINING_DATA_SIZE,
  VALIDATION_DATA_SIZE,
} from './Constant';
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
      for (let hi = 0; hi < H_DIM; ++hi) {
        data.h[di][hi] = data.x[di].reduce(
          (prev, cur, i) => prev + cur * this.model.ih[i][hi],
          0,
        );
        data.hs[di][hi] = sigmoid(data.h[di][hi]);
      }

      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        data.z[di][zi] = data.hs[di].reduce(
          (prev, cur, hsi) => prev + cur * this.model.hz[hsi][zi],
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

      for (let hsi = 0; hsi < H_DIM; ++hsi) {
        // this.trainingData.pephs[di][hsi] =
        let temp = 0;
        for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
          temp += this.trainingData.pepz[di][zi] * this.model.hz[hsi][zi];
        }
        this.trainingData.pephs[di][hsi] = temp;
        this.trainingData.peph[di][hsi] =
          this.trainingData.pephs[di][hsi] *
          this.trainingData.hs[di][hsi] *
          (1 - this.trainingData.hs[di][hsi]); // derivative of sigmoid
      }
    }
  }
  step(from: number, to: number) {
    const dataSize = to - from + 1;
    for (let hsi = 0; hsi < H_DIM + 1; ++hsi) {
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        let gradient = 0;
        for (let di = from; di <= to; ++di) {
          gradient +=
            this.trainingData.pepz[di][zi] * this.trainingData.hs[di][hsi];
        }
        this.model.hz[hsi][zi] -= LEARNING_RATE * (gradient / dataSize);
      }
    }
    for (let i = 0; i < INPUT_DIM + 1; ++i) {
      for (let hi = 0; hi < H_DIM; ++hi) {
        let gradient = 0;
        for (let di = from; di <= to; ++di) {
          gradient +=
            this.trainingData.peph[di][hi] * this.trainingData.x[di][i];
        }
        this.model.ih[i][hi] -= LEARNING_RATE * (gradient / dataSize);
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
    return this.getCrossEntropy(this.validationData, from, to);
  }

  doTrain() {
    for (let epochIdx = 0; epochIdx < N_EPOCHS; ++epochIdx) {
      const trainingLoss = this.train();
      const validatingLoss = this.validate();
      console.log(trainingLoss, validatingLoss);
      console.log(this.calculateAccuracy());
    }
  }
  calculateAccuracy() {
    console.log(this.testData);
    this.forward(this.testData, 0, TEST_DATA_SIZE - 1);
    const maxItemArr: number[] = [];
    for (let i = 0; i < TEST_DATA_SIZE; ++i) {
      maxItemArr[i] = findMaxItem(this.testData.out[i]);
    }
    let correctCount = 0;
    for (let i = 0; i < TEST_DATA_SIZE; ++i) {
      if (this.testData.y[i] == maxItemArr[i]) {
        correctCount++;
      }
    }
    console.log('accuracy', correctCount / TEST_DATA_SIZE);
  }
}

export default MnistClassifier;
