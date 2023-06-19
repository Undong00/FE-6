import { useCallback, useEffect, useRef, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { getAllList, getFilteredList, getLastId } from '@src/apis/portfolio';
import Filter from '@src/components/main/Filter';
import { PortfolioDataType } from '@src/types/portfolioType';
import { categoryState, filterState } from '@src/states';
import { filterListObject } from '@src/constants/portfolioFilteringData';
import * as S from '@src/style/common/commonStyles';
import PortfolioItem from '@src/components/common/PortfolioItem';

const Main = () => {
  const [list, setList] = useState<PortfolioDataType[]>([]);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);

  const [selectedFilter, setSelectedFilter] = useRecoilState(filterState);
  const selectedCategory = useRecoilValue(categoryState);

  const isExistData = list.length !== 0;

  // --- 무한스크롤 ---
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreData = useCallback(async () => {
    if (lastId - 10 > 0) {
      setIsMoreLoading(true);
      // console.log('무한스크롤 함수 실행 라스트 id: ', lastId); // 66 -> 56

      let newData: PortfolioDataType[];

      if (selectedFilter !== 'All') {
        newData = await getFilteredList({
          lastId: lastId - 10,
          category: selectedCategory,
          filter: selectedFilter,
        });
      } else {
        newData = await getAllList({ lastId: lastId - 10, category: selectedCategory });
      }

      setList(prevData => [...prevData, ...newData]);
      setLastId((prevId: number) => prevId - 10);
      setIsMoreLoading(false);
    } else {
      return;
    }
  }, [lastId]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) loadMoreData();
      });
      if (node) observer.current.observe(node);
    },
    [loadMoreData]
  );

  // --- 데이터 호출 ---
  const fetchLastId = async (filterKeyword?: string) => {
    const lastId = await getLastId({ category: selectedCategory, filter: filterKeyword });
    setLastId(lastId);
    // console.log('lastId 체크 => ', lastId);

    return lastId;
  };

  const fetchFirstMountList = async (filterKeyword: string) => {
    setList([]);
    setIsDataLoading(true);
    if (filterKeyword !== 'All') {
      fetchFilteredList(filterKeyword);
      // console.log('FirstMountList if문 걸려서 실행 -> filteredList 함수로 이동');

      return;
    }

    const serverDataLastId = await fetchLastId();
    const serverData = await getAllList({ lastId: serverDataLastId, category: selectedCategory });
    setList(serverData);

    // console.log('fetchFirstMount 함수의 라스트 id => ', serverDataLastId);
    setIsDataLoading(false);
  };

  const fetchFilteredList = async (filterKeyword: string) => {
    setIsDataLoading(true);
    if (filterKeyword === 'All') {
      fetchFirstMountList(filterKeyword);
      // console.log('All 선택했을 경우 filteredList 함수에서 조건걸려서 FirstMount로 이동');
      // return;
    }

    const serverDataLastId = await fetchLastId(filterKeyword);
    // TO DO: 직무 필터 적용한 게시글이 10개 미만일 경우 10개 이상이 될 때까지 계속 호출해서 불러오기
    // let length10List: PortfolioDataType[] = []

    // console.log('필터데이터 최대id', serverDataLastId);

    // while (length10List.length < 10) {
    //   const filteredData = await getFilteredList({
    //     lastId: serverDataLastId,
    //     category: selectedCategory,
    //     filter: filterKeyword,
    //   });
    //   length10List = [...length10List, ...filteredData];
    //   console.log('filtered data test => ', length10List); // 계속 8개 받아옴

    //   if (filteredData.length < 10) {
    //     serverDataLastId -= 10;
    //     console.log('minusedLastId', serverDataLastId);

    //     setLastId(serverDataLastId);
    //   }
    // }

    const filteredData = await getFilteredList({
      lastId: serverDataLastId,
      category: selectedCategory,
      filter: filterKeyword,
    });

    setList(filteredData);
    // setList(length10List);
    setIsDataLoading(false);
  };

  // --- 직무 필터링 ---
  const onClickFilterButton = async (filterKeyword: string) => {
    setSelectedFilter(filterKeyword);

    if (filterKeyword === 'All') {
      fetchFirstMountList(filterKeyword);
      return;
    }
    fetchFilteredList(filterKeyword);
  };

  useEffect(() => {
    switch (selectedCategory) {
      case 'All':
        setFilterList(filterListObject.all);
        break;
      case 'Develop':
        setFilterList(filterListObject.develop);
        break;
      case 'Design':
        setFilterList(filterListObject.design);
        break;
      case 'Photographer':
        setFilterList(filterListObject.photograph);
        break;
      default:
        break;
    }

    fetchFirstMountList(selectedFilter);
  }, [selectedCategory]);

  return (
    <S.PageContainer>
      {selectedCategory === 'All' ? (
        <StAllCategoryTitle>ALL</StAllCategoryTitle>
      ) : (
        <Filter filterList={filterList} onClickFilterButton={onClickFilterButton} />
      )}

      {isExistData ? (
        <S.PortfolioListContainer>
          {list.map((item: PortfolioDataType) => (
            <PortfolioItem key={item.id} item={item} />
          ))}
        </S.PortfolioListContainer>
      ) : (
        <>
          {isDataLoading ? (
            <StLoadingContainer>
              <StLoadingSpinner />
            </StLoadingContainer>
          ) : (
            <StNoDataTextContainer>포트폴리오가 존재하지 않습니다.</StNoDataTextContainer>
          )}
        </>
      )}
      {!isMoreLoading && <StLoadingIndicator ref={lastItemRef} />}
    </S.PageContainer>
  );
};

const StAllCategoryTitle = styled.h1`
  margin: 0;
  font-weight: 900;
  margin: 30px 0;
`;

const StLoadingIndicator = styled.div`
  padding: 1rem;
`;

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const centerAlignStyle = `
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StLoadingContainer = styled.div`
  ${centerAlignStyle}
`;

const StLoadingSpinner = styled(AiOutlineLoading3Quarters)`
  animation: ${spinAnimation} 1s infinite linear;
  font-size: 30px;
  color: gray;
`;

const StNoDataTextContainer = styled.div`
  ${centerAlignStyle}

  font-size: 20px;
  font-weight: 500;
  color: gray;
`;

export default Main;
