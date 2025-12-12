import { useEffect, useRef } from "react";

export function usePoll(fn: () => Promise<void>, interval = 3000) {
  const timer = useRef<number | null>(null);
  const stopped = useRef(false);

  useEffect(() => {
    stopped.current = false;

    async function tick() {
      if (stopped.current) return;
      try {
        await fn();
      } catch (err) {
        console.log(err);
      } finally {
        timer.current = window.setTimeout(tick, interval);
      }
    }

    tick();

    return () => {
      stopped.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
