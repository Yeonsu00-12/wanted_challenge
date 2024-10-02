import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { getMockData, MockData } from "./api/Mock";
import styled from "styled-components";
import useIntersect from "./Component/scroll";

function App() {
  const [items, setItems] = useState<MockData[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const fetchItems = useCallback(async () => {
    if (isEnd || isLoading) return; // 더 가져올 데이터가 없거나 로딩 중일 때 중지
    setIsLoading(true);

    try {
      const res = await getMockData(page); // 목 데이터를 받아옴

      setItems((prevItems) => [...prevItems, ...res.datas]); // 기존 데이터에 새 데이터를 추가
      setTotalPrice(
        (prevTotal) =>
          prevTotal + res.datas.reduce((acc, item) => acc + item.price, 0) // 가격 계산
      );
      setPage((prevPage) => prevPage + 1); // 페이지 증가
      setIsEnd(res.isEnd);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isEnd, isLoading]);

  const intersectHandler = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        fetchItems(); // 교차 시 데이터 가져오기
      }
    },
    [fetchItems]
  );

  const ref = useIntersect(intersectHandler, {
    rootMargin: "100px",
  });

  useEffect(() => {
    fetchItems(); // 첫 페이지 데이터 가져오기
  }, [fetchItems]);

  return (
    <Box className="App">
      {items.map((item) => (
        <Container key={item.productId}>
          <p>{item.boughtDate}</p>
          <p>{item.price}</p>
          <p className="item">{item.productName}</p>
        </Container>
      ))}
      {isLoading && <p>Loading...</p>}
      <div ref={ref} />
      <div>총 가격 : {totalPrice}</div>
      {isEnd && <div>마지막 페이지입니다.</div>}
    </Box>
  );
}

export default App;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid black;
  margin: 10px;
`;
