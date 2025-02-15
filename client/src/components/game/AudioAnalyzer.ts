export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source?: MediaElementAudioSourceNode;
  private beatThreshold: number = 1; // Lower threshold to ensure we get some beats
  private lastBeatTime: number = 0;
  private beatCooldown: number = 300; // Shorter cooldown for more frequent beats

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  async connect(audioElement: HTMLAudioElement) {
    try {
      // Ensure audio context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Disconnect any existing source
      if (this.source) {
        this.source.disconnect();
      }

      // Create and connect new source
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      console.log('Audio analyzer connected successfully');
      return true;
    } catch (error) {
      console.error('Error connecting audio analyzer:', error);
      return false;
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
      console.log('Beat detected! Average:', bassAverage);
      return true;
    }
    return false;
  }

  async resume() {
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('Audio context resumed');
      } catch (error) {
        console.error('Error resuming audio context:', error);
      }
    }
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
    }
  }
}