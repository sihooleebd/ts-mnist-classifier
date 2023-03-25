import { H_DIM, INPUT_DIM } from './Constant';

class Data {
  x: number[][] = []; //[N][INPUT_DIM+1]
  h: number[][] = []; //[N][H_DIM]
  hs: number[][] = []; //[N][H_DIM+1]
  z: number[][] = []; // [N][OUTPUT_DIM]
  out: number[][] = []; //[N][OUTPUT_DIM]
  y: number[] = []; // [N]
  pepz: number[][] = []; //[N][OUTPUT_DIM]
  pephs: number[][] = []; //[N][H_DIM]
  peph: number[][] = []; //[N][H_DIM]

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
    this.h[newIndex] = [];
    this.hs[newIndex] = [];
    this.z[newIndex] = [];
    this.out[newIndex] = [];
    this.pepz[newIndex] = [];
    this.pephs[newIndex] = [];
    this.peph[newIndex] = [];
    this.x[newIndex][INPUT_DIM] = 1;
    this.hs[newIndex][H_DIM] = 1;
  }
}

export default Data;
