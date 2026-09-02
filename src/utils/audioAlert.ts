/**
 * Web Audio API based Sound Synthesizer
 * Provides zero-dependency, reliable audio alerts for CBT Exam Simulator & Gamification
 */

class AudioAlertService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
      return null;
    }
  }

  /**
   * Play a clean 2-second dual-frequency warning Beep sound for Exam End Alert
   */
  public playExamBeepAlert(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Tone 1: Beep 1 (0.0s - 0.4s)
      this.createBeepPulse(ctx, now + 0.0, 0.35, 880, 0.3); // A5 note
      // Tone 2: Beep 2 (0.5s - 0.9s)
      this.createBeepPulse(ctx, now + 0.5, 0.35, 880, 0.35);
      // Tone 3: Urgent Beep 3 (1.0s - 1.4s)
      this.createBeepPulse(ctx, now + 1.0, 0.35, 1174.66, 0.4); // D6 note (higher pitch)
      // Tone 4: Final Long Beep (1.5s - 2.0s)
      this.createBeepPulse(ctx, now + 1.5, 0.48, 1174.66, 0.45);
    } catch (err) {
      console.warn('Error playing exam beep:', err);
    }
  }

  /**
   * Play a single test beep (0.5 sec) so candidate can verify sound volume
   */
  public playTestBeep(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.createBeepPulse(ctx, now, 0.25, 880, 0.3);
      this.createBeepPulse(ctx, now + 0.3, 0.35, 1174.66, 0.35);
    } catch (err) {
      console.warn('Error playing test beep:', err);
    }
  }

  /**
   * Play positive chime for correct answer / achievement
   */
  public playSuccessChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.createHarmonicNote(ctx, now + 0.0, 0.15, 523.25, 0.15); // C5
      this.createHarmonicNote(ctx, now + 0.1, 0.15, 659.25, 0.2);  // E5
      this.createHarmonicNote(ctx, now + 0.2, 0.3, 783.99, 0.25);  // G5
      this.createHarmonicNote(ctx, now + 0.3, 0.4, 1046.50, 0.3); // C6
    } catch (err) {
      console.warn('Error playing success chime:', err);
    }
  }

  /**
   * Play subtle low-pitch sound for alert / wrong answer
   */
  public playAlertChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.createBeepPulse(ctx, now + 0.0, 0.2, 330, 0.25, 'sawtooth'); // E4
      this.createBeepPulse(ctx, now + 0.22, 0.3, 220, 0.25, 'sawtooth'); // A3
    } catch (err) {
      console.warn('Error playing alert chime:', err);
    }
  }

  // Backwards compatibility aliases
  public playXpGainSound(): void {
    this.playSuccessChime();
  }

  public playXpPenaltySound(): void {
    this.playAlertChime();
  }

  private createBeepPulse(
    ctx: AudioContext, 
    startTime: number, 
    duration: number, 
    freq: number, 
    volume: number = 0.2,
    type: OscillatorType = 'sine'
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private createHarmonicNote(
    ctx: AudioContext,
    startTime: number,
    duration: number,
    freq: number,
    volume: number = 0.2
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const AudioAlert = new AudioAlertService();
