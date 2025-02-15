export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source?: MediaElementAudioSourceNode;
  private beatThreshold: number = 80; // Lower threshold for more frequent beats
  private lastBeatTime: number = 0;
  private beatCooldown: number = 500; // Minimum time between beats in ms

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  connect(audioElement: HTMLAudioElement) {
    try {
      if (this.source) {
        this.source.disconnect();
      }
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      console.log('Audio analyzer connected successfully');
    } catch (error) {
      console.error('Error connecting audio analyzer:', error);
    }
  }

  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getBeatDetection(): boolean {
    const now = Date.now();
    if (now - this.lastBeatTime < this.beatCooldown) {
      return false;
    }

    const data = this.getFrequencyData();
    // Focus on bass frequencies (first quarter of the frequency range)
    const bassRange = Math.floor(data.length / 4);
    let bassSum = 0;
    for (let i = 0; i < bassRange; i++) {
      bassSum += data[i];
    }
    const bassAverage = bassSum / bassRange;

    if (bassAverage > this.beatThreshold) {
      this.lastBeatTime = now;
      return true;
    }
    return false;
  }

  resume() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(console.error);
    }
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
    }
  }
}