import type Entity from '@src/core/Entity';
import System from '@src/core/System';

export interface QueuedWork<T> {
    callback: (item: T) => void;
    items: T[];
    onFinished?: () => void;
}

interface IndexedWork {
    processNext: () => void;
    readonly remaining: number;
    onFinished?: () => void;
}

/**
 * System splits expensive work across frames.
 * 
 * worksPerFrame - decides how many works can be used by one animation frame.
 * 
 * queueWork() - schedules work to be run in next available frame.
 */
abstract class QueuedWorkSystem extends System {
    abstract readonly worksPerFrame: number;
    private queuedWorks: IndexedWork[] = [];

    protected queueWork<T>(work: QueuedWork<T>) {
      let currentIndex = 0;
      this.queuedWorks.push({
        processNext: () => {
          work.callback(work.items[currentIndex]);
          currentIndex++;
        },
        get remaining() {
          return work.items.length - currentIndex;
        },
        onFinished: work.onFinished,
      });
      return this.queuedWorks.length;
    }

    update() {
      if (!this.queuedWorks.length) return;

      const currentWork = this.queuedWorks[0];

      for (let i = 0; i < this.worksPerFrame && currentWork.remaining > 0; i++) {
        currentWork.processNext();
      }

      if (currentWork.remaining <= 0) {
        currentWork.onFinished?.();
        this.queuedWorks.shift();
      }
    }
    
    onEntityRemoved(_entity: Entity): void {}
}

export default QueuedWorkSystem;