import { useCallback, useRef } from "react";

export default function useTimeGuardedCallback(
  callback,
  delayMs,
  {
    preventDefaultOnBlock = true,
    stopPropagationOnBlock = true,
  } = {}
) {
  const lastCallTimeRef = useRef(0);

  return useCallback(
    (...args) => {
      const now = Date.now();
      const event = args[0];

      if (now - lastCallTimeRef.current < delayMs) {
        if (preventDefaultOnBlock) {
          event?.preventDefault?.();
        }
        if (stopPropagationOnBlock) {
          event?.stopPropagation?.();
        }
        return;
      }

      lastCallTimeRef.current = now;
      callback?.(...args);
    },
    [callback, delayMs, preventDefaultOnBlock, stopPropagationOnBlock]
  );
}
