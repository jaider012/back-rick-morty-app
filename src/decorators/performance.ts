export function measureExecutionTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = process.hrtime();

    try {
      const result = await originalMethod.apply(this, args);
      const [seconds, nanoseconds] = process.hrtime(start);
      const totalTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

      console.log(
        `Method ${propertyKey} executed in ${totalTime.toFixed(2)}ms`
      );

      return result;
    } catch (error) {
      const [seconds, nanoseconds] = process.hrtime(start);
      const totalTime = seconds * 1000 + nanoseconds / 1000000;

      console.error(
        `Method ${propertyKey} failed after ${totalTime.toFixed(2)}ms`
      );
      throw error;
    }
  };

  return descriptor;
}
