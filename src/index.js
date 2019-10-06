import { useLayoutEffect, useState, useRef } from 'react';

const useElapsedTime = (isPlaying, config = {}) => {
  const {
    durationMilliseconds,
    onComplete,
    isRepeated
  } = config;
  const [elapsedTime, setElapsedTime] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const loop = time => {
    let isCompleted = false;

    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;

      setElapsedTime(prevTime => {
        const currentElapsedTime = prevTime + deltaTime;
        isCompleted = currentElapsedTime >= durationMilliseconds;

        return isCompleted ? durationMilliseconds : currentElapsedTime;
      });
    }

    if (isCompleted) {
      if (typeof onComplete === 'function') {
        onComplete();
      }

      if (isRepeated) {
        setElapsedTime(0);
        previousTimeRef.current = undefined;
        requestRef.current = requestAnimationFrame(loop);
      }
    } else {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  useLayoutEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
      requestRef.current = undefined;
    };
  }, [isPlaying]);

  return elapsedTime;
};

export { useElapsedTime };