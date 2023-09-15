class CodeService {
  getRandomCode(length: number) {
    let min = 10 ** (length - 1);
    let max = 10 ** length;
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export const codeService = new CodeService();
