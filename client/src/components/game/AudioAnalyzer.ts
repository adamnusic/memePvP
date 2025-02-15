export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source?: MediaElementAudioSourceNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  connect(audioElement: HTMLAudioElement) {
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getBeatDetection(): boolean {
    const data = this.getFrequencyData();
    const sum = data.reduce((a, b) => a + b, 0);
    const average = sum / data.length;
    return average > 100; // Threshold for beat detection
  }

  resume() {
    this.audioContext.resume();
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
    }
  }
}
