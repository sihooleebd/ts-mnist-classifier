import { H1_DIM, H2_DIM, INPUT_DIM } from './constant';

class Data {
  x: number[][] = []; //[N][INPUT_DIM+1]
  h1: number[][] = []; //[N][H1_DIM]
  h1s: number[][] = []; //[N][H1_DIM+1]
  h2: number[][] = []; //[N][H2_DIM]
  h2s: number[][] = []; //[N][H2_DIM+1]
  z: number[][] = []; // [N][OUTPUT_DIM]
  out: number[][] = []; //[N][OUTPUT_DIM]
  y: number[] = []; // [N]
  pepz: number[][] = []; //[N][OUTPUT_DIM]
  peph2s: number[][] = []; //[N][H2_DIM]
  peph2: number[][] = []; //[N][H2_DIM]
  peph1s: number[][] = []; //[N][H1_DIM]
  peph1: number[][] = []; //[N][H1_DIM]

  add(row: string) {
    if (row === '') {
      return;
    }
    const newIndex = this.x.length;
    const arr = row.split(',');
    if (arr.length !== INPUT_DIM + 1) {
      throw new Error('INVALID_DATA_SIZE');
    }
    const ans = parseInt(arr[0]);
    this.x[newIndex] = [];
    for (let i = 0; i < INPUT_DIM; ++i) {
      this.x[newIndex][i] = parseInt(arr[i + 1]) / 255;
    }
    this.y[newIndex] = ans;
    this.h1[newIndex] = [];
    this.h1s[newIndex] = [];
    this.h2[newIndex] = [];
    this.h2s[newIndex] = [];
    this.z[newIndex] = [];
    this.out[newIndex] = [];
    this.pepz[newIndex] = [];
    this.peph2s[newIndex] = [];
    this.peph2[newIndex] = [];
    this.peph1s[newIndex] = [];
    this.peph1[newIndex] = [];
    this.x[newIndex][INPUT_DIM] = 1;
    this.h1s[newIndex][H1_DIM] = 1;
    this.h2s[newIndex][H2_DIM] = 1;
  }
}

export default Data;
