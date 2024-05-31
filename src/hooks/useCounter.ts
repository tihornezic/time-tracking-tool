import { useRef, useState } from "react";

let interval: ReturnType<typeof setInterval>;

const useCounter = () => {
  const counterRef = useRef(0);
  const secondsRef = useRef<number | undefined>(undefined);
  const isInProgressRef = useRef(false);

  const [isInProgress, setIsInProgress] = useState(false);

  const startCounter = (
    initialVal?: number,
    onSecondPass?: (newSeconds: number) => void
  ) => {
    isInProgressRef.current = true;
    setIsInProgress(true);

    if (initialVal) {
      counterRef.current = initialVal;
    }

    secondsRef.current = window.setInterval(() => {
      counterRef.current += 1; // Increment the counter value
      const newSeconds = counterRef.current;
      onSecondPass?.(newSeconds);
    }, 1000);
  };

  const stopCounter = () => {
    isInProgressRef.current = false;
    setIsInProgress(false);
    clearInterval(secondsRef.current);
    secondsRef.current = 0;
    counterRef.current = 0;

    clearInterval(interval);
  };

  return { isInProgress, startCounter, stopCounter };
};

export default useCounter;
