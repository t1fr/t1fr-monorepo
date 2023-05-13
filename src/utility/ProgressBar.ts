export class ProgressBar {

  private dictionary = new Map<number, string>([
    [1, '▉'],
    [5 / 6, '▊'],
    [4 / 6, '▋'],
    [3 / 6, '▍'],
    [2 / 6, '▎'],
    [1 / 6, '▏'],
  ]);

  private progressBarString = [] as string[];
  private currentLength;

  constructor(value: number = 0, private length: number = 17) {
    this.currentLength = this.length * value;
    let residual = this.currentLength;
    this.dictionary.forEach((value, key) => {
      while (residual >= key) {
        residual -= key;
        this.progressBarString.push(value);
      }
    });
  }

  public setFractionalValue(value: number): string {
    let residual = value * this.length - Math.floor(this.currentLength);
    if (this.currentLength - Math.floor(this.currentLength) > 1 / 6) {
      this.progressBarString.pop();
    }
    this.currentLength = value * this.length;
    this.dictionary.forEach((value, key) => {
      while (residual >= key) {
        residual -= key;
        this.progressBarString.push(value);
      }
    });
    return this.progressBarString.join('');
  }
}