export function wrapWithLog<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    console.log(`Calling ${fn.name} with`, ...args);
    const result = fn(...args);
    console.log(`Result of ${fn.name} is`, result);
    return result;
  }) as any;
}
