import { useCallback, useEffect, useRef } from "react";

// entry : 타켓과 root(부모) 엘리먼트 사이의 정보
// observer : 엘리먼트를 관찰 중인 observer 인스턴스 (observe, unobserve 관찰 할지 말지 결정)
type IntersectHandler = (
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver
) => void;

// 옵저버 인스턴스를 생성할 때 사용할 콜백 함수 생성
// 엘리먼트 뷰토프에 들어올 때 onIntersect 함수 실행
const useIntersect = (
  onIntersect: IntersectHandler,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onIntersect(entry, observer);
      });
    },
    [onIntersect]
  );

  // ref가 null이 아니면 옵저버를 생성하고 해당 ref에 대한 observe를 실행
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(callback, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options, callback]);
  return ref;
};

export default useIntersect;
