// const timers = [];

/** When resumed, the start time is moved up by the amount of time it was paused.
 */
export class Timer {
  constructor(duration) {
    this.duration = duration;
    this.startTime = 0;
    this.paused = true;
    this.pauseTime = 0;
    this.completionFns = [];
    timers.push(this);
  }

  /**
   * Gets the current time.
   */
  now() {
    return window.performance.now();
  }

  /**
   * Updates the starting time.
   * @return {number} The new timer start value.
   * @param {number} offset - The value by which the start
   * should be offset.
   */
  newStartTime(offset) {
    return this.startTime + offset;
  }

  /**
   * Pauses the timer.
   */
  pause() {
    this.pauseStart = this.now();
    this.paused = true;
  }

  /**
   * Resumes the timer.
   */
  resume() {
    this.paused = false;
    this.startTime = this.newStartTime(this.now() - this.pauseTime);
    this.pauseTime = 0;
  }

  /**
   * Starts the timer.
   */
  start() {
    this.startTime = this.now();
    this.paused = false;
  }

  /**
   * Gets the percent complete.
   */
  percentDone() {
    return ((this.now() - this.startTime) / this.duration) * 100;
  }

  /**
   * Gets the completion percentage.
   */
  complete() {
    return this.percentDone() >= 100;
  }

  /**
   * Add a function to be called on timer completion.
   * @param {function} fn
   */
  addCompletionFn(fn) {
    this.completionFns.push(fn);
  }

  /**
   * Returns a promise to be used in chaining.
   * @returns {Promise<void>}
   */
  onComplete() {
    return new Promise((resolve) => {
      this.completionFns.push(resolve);
    });
  }

  /**
   * Check if the timer has run its duration.
   * If so, call each of its completion functions.
   */
  update() {
    if (this.complete()) {
      this.completionFns.forEach((fn) => fn());
      this.completionFns = [];
    }
  }
}

const timers = [];
const firstTest = () => {
  const timer = new Timer(1000);
  const cb = () => console.log('DONE!');
  let running = true;
  const result = timer.onComplete();
  timer.start();
  while (running) {
    timer.update();
    result.then(() => {
      cb();
      running = false;
    });
  }
};

firstTest();
