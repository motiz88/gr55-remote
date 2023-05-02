import { MultiQueueScheduler } from "../MultiQueueScheduler";

describe("MultiQueueScheduler", () => {
  test("executes tasks in the correct order based on priority", async () => {
    const scheduler = new MultiQueueScheduler([
      "high",
      "medium",
      "low",
    ] as const);

    const executionOrder: number[] = [];

    const highPriorityTask = async () => {
      executionOrder.push(1);
    };

    const mediumPriorityTask = async () => {
      executionOrder.push(2);
    };

    const lowPriorityTask = async () => {
      executionOrder.push(3);
    };

    await Promise.all([
      scheduler.enqueue(lowPriorityTask, "low"),
      scheduler.enqueue(mediumPriorityTask, "medium"),
      scheduler.enqueue(highPriorityTask, "high"),
    ]);

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test("resolves enqueued tasks with correct values", async () => {
    const scheduler = new MultiQueueScheduler(["queue"] as const);

    const task1 = async () => 10;
    const task2 = async () => 20;

    const [result1, result2] = await Promise.all([
      scheduler.enqueue(task1, "queue"),
      scheduler.enqueue(task2, "queue"),
    ]);

    expect(result1).toBe(10);
    expect(result2).toBe(20);
  });

  test("handles task rejections and continues processing remaining tasks", async () => {
    const scheduler = new MultiQueueScheduler(["queue"] as const);

    const task1 = async () => {
      throw new Error("Task failed");
    };
    const task2 = async () => 20;

    const result1 = scheduler
      .enqueue(task1, "queue")
      .catch((error) => error.message);
    const result2 = scheduler.enqueue(task2, "queue");

    const [resolvedResult1, resolvedResult2] = await Promise.all([
      result1,
      result2,
    ]);

    expect(resolvedResult1).toBe("Task failed");
    expect(resolvedResult2).toBe(20);
  });

  test("executes tasks in non-priority queues after processing priority queues", async () => {
    const scheduler = new MultiQueueScheduler<"high" | "medium" | "low">([
      "high",
      "medium",
    ]);

    const executionOrder: number[] = [];

    const highPriorityTask = async () => {
      executionOrder.push(1);
    };

    const mediumPriorityTask = async () => {
      executionOrder.push(2);
    };

    const nonPriorityTask = async () => {
      executionOrder.push(3);
    };

    await Promise.all([
      scheduler.enqueue(nonPriorityTask, "low"),
      scheduler.enqueue(mediumPriorityTask, "medium"),
      scheduler.enqueue(highPriorityTask, "high"),
    ]);

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test("changes priority order dynamically during task execution", async () => {
    const scheduler = new MultiQueueScheduler([
      "high",
      "medium",
      "low",
    ] as const);

    const executionOrder: number[] = [];

    const highPriorityTask = async () => {
      executionOrder.push(1);
      scheduler.setPriorityOrder(["low", "medium"]); // Change priority order dynamically
    };

    const mediumPriorityTask = async () => {
      executionOrder.push(2);
    };

    const lowPriorityTask = async () => {
      executionOrder.push(3);
    };

    const tasks = [
      scheduler.enqueue(highPriorityTask, "high"),
      scheduler.enqueue(mediumPriorityTask, "medium"),
      scheduler.enqueue(lowPriorityTask, "low"),
    ];

    await Promise.all(tasks);

    expect(executionOrder).toEqual([1, 3, 2]);
  });

  test("ignores mutation of the initial priority order array", async () => {
    const initialPriorityOrder: ("high" | "medium" | "low")[] = [
      "high",
      "medium",
      "low",
    ];
    const scheduler = new MultiQueueScheduler(initialPriorityOrder);

    const executionOrder: number[] = [];

    const highPriorityTask = async () => {
      executionOrder.push(1);
    };

    const mediumPriorityTask = async () => {
      executionOrder.push(2);
    };

    const lowPriorityTask = async () => {
      executionOrder.push(3);
    };

    // Mutate the initial priority order array
    initialPriorityOrder.reverse();

    const tasks = [
      scheduler.enqueue(lowPriorityTask, "low"),
      scheduler.enqueue(mediumPriorityTask, "medium"),
      scheduler.enqueue(highPriorityTask, "high"),
    ];

    await Promise.all(tasks);

    // Expect the scheduler to use the original priority order
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  test("ignores mutation of the initial priority order array", async () => {
    const scheduler = new MultiQueueScheduler();

    const initialPriorityOrder: ("high" | "medium" | "low")[] = [
      "high",
      "medium",
      "low",
    ];

    scheduler.setPriorityOrder(initialPriorityOrder);

    const executionOrder: number[] = [];

    const highPriorityTask = async () => {
      executionOrder.push(1);
    };

    const mediumPriorityTask = async () => {
      executionOrder.push(2);
    };

    const lowPriorityTask = async () => {
      executionOrder.push(3);
    };

    // Mutate the initial priority order array
    initialPriorityOrder.reverse();

    const tasks = [
      scheduler.enqueue(lowPriorityTask, "low"),
      scheduler.enqueue(mediumPriorityTask, "medium"),
      scheduler.enqueue(highPriorityTask, "high"),
    ];

    await Promise.all(tasks);

    // Expect the scheduler to use the original priority order
    expect(executionOrder).toEqual([1, 2, 3]);
  });
});
