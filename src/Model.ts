import { H_DIM, INPUT_DIM, OUTPUT_DIM } from './Constant';

class Model {
  ih: number[][] = []; //(INPUT_DIM+1) * H_DIM
  hz: number[][] = []; //(H_DIM+1) * OUTPUT_DIM

  init() {
    for (let i = 0; i < INPUT_DIM + 1; ++i) {
      this.ih[i] = [];
      for (let hi = 0; hi < H_DIM; ++hi) {
        this.ih[i][hi] = Math.random() - 0.5;
      }
    }
    this.ih[INPUT_DIM] = [];
    for (let hi = 0; hi < H_DIM; ++hi) {
      this.ih[INPUT_DIM][hi] = 0;
    }
    this.hz[H_DIM] = [];
    for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
      this.hz[H_DIM][zi] = 0;
    }

    for (let hi = 0; hi < H_DIM; ++hi) {
      this.hz[hi] = [];
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        this.hz[hi][zi] = Math.random() - 0.5;
      }
    }
  }

  clone() {
    const newModel = new Model();
    for (let i = 0; i < INPUT_DIM + 1; ++i) {
      newModel.ih[i] = [];
      for (let hi = 0; hi < H_DIM; ++hi) {
        newModel.ih[i][hi] = this.ih[i][hi];
      }
    }

    for (let hi = 0; hi < H_DIM + 1; ++hi) {
      newModel.hz[hi] = [];
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        newModel.hz[hi][zi] = this.hz[hi][zi];
      }
    }
  }
}

export default Model;
