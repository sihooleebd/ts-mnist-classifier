import MnistClassifier from './MnistClassifier';
import { readFile } from './utils';
const mnistClassifier = new MnistClassifier();

document.addEventListener('DOMContentLoaded', (e) => {
  const csvFileForm = document.getElementById('csv-file') as HTMLInputElement;
  csvFileForm.addEventListener('change', async (e) => {
    if (csvFileForm.files?.length !== 1) {
      return;
    }
    const file = csvFileForm.files[0];
    const text = await readFile(file);
    if (!text) {
      return;
    }
    mnistClassifier.setData(text);

    mnistClassifier.doTrain();
  });
});
