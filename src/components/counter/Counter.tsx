import { useState, useRef, useEffect } from "react";

let startTime: number, interval: ReturnType<typeof setInterval>;

const Counter = ({
  secs,
  started,
  onSecondPass,
}: {
  secs: number;
  started: boolean;
  onSecondPass: (seconds: any) => void;
}) => {
  const [seconds, setSeconds] = useState(secs || 0);
  const [milliseconds, setMilliseconds] = useState(0);
  const secondsRef = useRef<number | undefined>(undefined);

  const startTimer = () => {
    secondsRef.current = window.setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1;
        onSecondPass(newSeconds);
        return newSeconds;
      });
    }, 1000);

    // startTime = Date.now();
    // interval = setInterval(() => {
    //   setMilliseconds(Date.now() - startTime);
    // });
  };

  const stopTimer = () => {
    clearInterval(secondsRef.current);
    secondsRef.current = 0;

    clearInterval(interval);
  };

  useEffect(() => {
    started && startTimer();
    // gameStatus === EnumGameStatus.in_progress && startTimer();
    // gameStatus === EnumGameStatus.lose && stopTimer();
    // if (gameStatus === EnumGameStatus.win) {
    //   stopTimer();
    //   dispatch(setDuration(milliseconds));
    // }
  }, [started]);

  return (
    <>
      <div>Duration: {seconds}s</div>
    </>
  );
};

export default Counter;
