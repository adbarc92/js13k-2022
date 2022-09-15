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

  onCompletion() {
    return new Promise((resolve) => {
      if (this.isComplete()) {
        return;
      }
      this.awaits.push(resolve);
    });
  }
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export const distance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};
