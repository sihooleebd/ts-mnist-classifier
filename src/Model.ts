import { H1_DIM, H2_DIM, INPUT_DIM, OUTPUT_DIM } from './constant';

class Model {
  ih1: number[][] = []; //(INPUT_DIM+1) * H_DIM
  h1h2: number[][] = []; //(H1_DIM + 1)  * H2_DIM
  h2z: number[][] = []; //(H_DIM+1) * OUTPUT_DIM

  init() {
    for (let i = 0; i < INPUT_DIM; ++i) {
      this.ih1[i] = [];
      for (let hi = 0; hi < H1_DIM; ++hi) {
        this.ih1[i][hi] = Math.random() - 0.5;
      }
    }
    this.ih1[INPUT_DIM] = [];
    for (let hi = 0; hi < H1_DIM; ++hi) {
      this.ih1[INPUT_DIM][hi] = 0;
    }

    for (let h1i = 0; h1i < H1_DIM; ++h1i) {
      this.h1h2[h1i] = [];
      for (let h2i = 0; h2i < H2_DIM; ++h2i) {
        this.h1h2[h1i][h2i] = Math.random() - 0.5;
      }
    }
    this.h1h2[H1_DIM] = [];
    for (let h2i = 0; h2i < H2_DIM; ++h2i) {
      this.h1h2[H1_DIM][h2i] = 0;
    }

    for (let h2i = 0; h2i < H2_DIM; ++h2i) {
      this.h2z[h2i] = [];
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        this.h2z[h2i][zi] = Math.random() - 0.5;
      }
    }
    this.h2z[H2_DIM] = [];
    for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
      this.h2z[H2_DIM][zi] = 0;
    }
  }

  clone() {
    const newModel = new Model();
    for (let i = 0; i < INPUT_DIM + 1; ++i) {
      newModel.ih1[i] = [];
      for (let hi = 0; hi < H1_DIM; ++hi) {
        newModel.ih1[i][hi] = this.ih1[i][hi];
      }
    }

    for (let h1i = 0; h1i < H1_DIM + 1; ++h1i) {
      newModel.h1h2[h1i] = [];
      for (let h2i = 0; h2i < H2_DIM; ++h2i) {
        newModel.h1h2[h1i][h2i] = this.h1h2[h1i][h2i];
      }
    }
    for (let hi = 0; hi < H2_DIM + 1; ++hi) {
      newModel.h2z[hi] = [];
      for (let zi = 0; zi < OUTPUT_DIM; ++zi) {
        newModel.h2z[hi][zi] = this.h2z[hi][zi];
      }
    }
  }
}

export default Model;
