import { useRef, useState } from "react";

let interval: ReturnType<typeof setInterval>;

export type UseCounterReturn = {
  isInProgress: boolean;
  startCounter: (
    initialVal?: number,
    onSecondPass?: (newSeconds: number) => void
  ) => void;
  stopCounter: () => void;
};

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

  const returnObj: UseCounterReturn = {
    isInProgress,
    startCounter,
    stopCounter,
  };

  return returnObj;
};

export default useCounter;
