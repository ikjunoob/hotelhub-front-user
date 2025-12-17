import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// 라우트가 바뀔 때마다 이전 스크롤 위치를 그대로 두지 않고 항상 상단으로 이동
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // PUSH | POP | REPLACE

  // 브라우저 기본 스크롤 복원을 막아 SPA 이동 시 이전 오프셋이 유지되지 않도록 설정
  useEffect(() => {
    const { history } = window;
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      return () => {
        history.scrollRestoration = prev;
      };
    }
  }, []);

  // 모든 네비게이션(PUSH/POP/REPLACE)에서 상단으로 강제 스크롤
  useLayoutEffect(() => {
    // POP 시 브라우저 자동 복원보다 늦게 실행되도록 한 틱 지연
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
