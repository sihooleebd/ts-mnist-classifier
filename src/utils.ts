const readFile = (file: File): Promise<string | false> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result as string);
      },
      false,
    );

    addEventListener('error', (event) => {
      resolve(false);
    });

    reader.readAsText(file);
  });
};

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const denominatorOfSoftmax = (arr: number[]) =>
  arr.reduce((prev, cur) => prev + Math.exp(cur), 0);

const softmax = (value: number, denominator: number) =>
  Math.exp(value) / denominator;

const findMaxItem = (arr: number[]) => {
  let maxIdx = 0;
  let maxNum = 0;
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] > maxNum) {
      maxNum = arr[i];
      maxIdx = i;
    }
  }
  return maxIdx;
};

export { readFile, sigmoid, denominatorOfSoftmax, softmax, findMaxItem };
