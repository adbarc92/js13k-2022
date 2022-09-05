
const getNow = () => window.performance.now();
const timers = [];

export class Timer {
  constructor(duration) {
    this.timestampStart = getNow();
    this.timestampPause = 0;
    this.duration = duration;
    this.paused = false;
    this.awaits = [];
    timers.push(this);
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.timestampPause = getNow();
    }
  }

  unpause() {
    if (this.paused) {
      this.paused = false;
      this.start -= this.timestampPause;
      this.timestampPause = 0;
    }
  }

  start(duration) {
    if (this.paused) this.unpause();
    this.timestampStart = getNow();
    this.duration = duration ?? this.duration;
  }

  getPctComplete() {
    let now = getNow();
    if (this.paused) now -= this.timestampPause;
    let diff = now - this.timestampStart;
    if (diff > this.duration) {
      diff = this.duration;
    } else if (diff < 0) {
      diff = -1;
    }
    return Math.min(1, diff / this.duration);
  }

  isComplete() {
    return this.getPctComplete() >= 1;
  }
}