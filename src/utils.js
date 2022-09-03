
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

  
}