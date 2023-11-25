type AsyncTask<T> = () => Promise<T>;

interface TaskQueue<T, QueueID> {
  id: QueueID;
  tasks: TaskData<T>[];
}

type TaskData<T> = {
  task: AsyncTask<T>;
  resolver: (value: T) => void;
  rejecter: (reason?: any) => void;
};

export class MultiQueueScheduler<QueueID extends string> {
  private queues: Map<QueueID, TaskQueue<any, QueueID>> = new Map();

  private isProcessing: boolean = false;
  private priorityOrder: readonly QueueID[] = [];

  constructor(initialPriorityOrder: readonly QueueID[] = []) {
    this.setPriorityOrder(initialPriorityOrder);
  }

  async enqueue<T>(task: AsyncTask<T>, queueID: QueueID): Promise<T> {
    if (!this.queues.has(queueID)) {
      this.queues.set(queueID, { id: queueID, tasks: [] });
    }

    return new Promise<T>((resolve, reject) => {
      const taskData = {
        task,
        resolver: resolve,
        rejecter: reject,
      };
      this.queues.get(queueID)!.tasks.push(taskData);
      this.processNextTask();
    });
  }

  setPriorityOrder(order: readonly QueueID[]): void {
    this.priorityOrder = [...order];
  }

  private async processNextTask(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    setImmediate(async () => {
      while (true) {
        const nextTaskData = this.getNextTask();
        if (!nextTaskData) break;
        try {
          const result = await nextTaskData.task();
          nextTaskData.resolver(result);
        } catch (error) {
          nextTaskData.rejecter(error);
        }
      }

      this.isProcessing = false;
    });
  }

  private getNextTask(): TaskData<unknown> | null {
    for (const queueID of this.priorityOrder) {
      const queue = this.queues.get(queueID);
      if (queue && queue.tasks.length > 0) {
        const nextTaskData = queue.tasks.shift()!;
        if (queue.tasks.length === 0) this.queues.delete(queueID);
        return nextTaskData;
      }
    }

    // Process remaining tasks in queues not included in the priority order
    for (const [, queue] of this.queues) {
      if (queue.tasks.length > 0) {
        const nextTaskData = queue.tasks.shift()!;
        if (queue.tasks.length === 0) this.queues.delete(queue.id);
        return nextTaskData;
      }
    }

    return null;
  }
}
