import { useCallback, useEffect, useRef, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { getAllList, getFilteredList, getLastId } from '@src/apis/portfolio';
import Filter from '@src/components/main/Filter';
import PortfolioItem from '@src/components/main/PortfolioItem';
import { PortfolioDataType } from '@src/types/portfolioType';
import { categoryState, filterState } from '@src/states';
import { filterListObject } from '@src/constants/portfolioFilteringData';

const Main = () => {
  const [list, setList] = useState<PortfolioDataType[]>([]);
  const [filterList, setFilterList] = useState<string[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);

  const [selectedFilter, setSelectedFilter] = useRecoilState(filterState);
  const selectedCategory = useRecoilValue(categoryState);

  const isExistData = list.length !== 0;

  // --- 무한스크롤 ---
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreData = useCallback(async () => {
    if (lastId - 10 > 0) {
      setIsMoreLoading(true);

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
    return lastId;
  };

  const fetchFirstMountList = async (filterKeyword: string) => {
    setList([]);

    if (filterKeyword !== 'All') {
      fetchFilteredList(filterKeyword);
      return;
    }

    const serverDataLastId = await fetchLastId();
    const serverData = await getAllList({ lastId: serverDataLastId, category: selectedCategory });
    setList(serverData);
  };

  const fetchFilteredList = async (filterKeyword: string) => {
    if (filterKeyword === 'All') {
      fetchFirstMountList(filterKeyword);
    }

    const serverDataLastId = await fetchLastId(filterKeyword);

    const filteredData = await getFilteredList({
      lastId: serverDataLastId,
      category: selectedCategory,
      filter: filterKeyword,
    });

    setList(filteredData);
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
    <StPortfolioPageContainer>
      <Filter filterList={filterList} onClickFilterButton={onClickFilterButton} />
      <StPortfolioListContainer>
        {isExistData ? (
          list.map((item: PortfolioDataType) => <PortfolioItem key={item.id} item={item} />)
        ) : (
          <StNoDataTextContainer>포트폴리오가 존재하지 않습니다.</StNoDataTextContainer>
        )}
      </StPortfolioListContainer>
      {isMoreLoading ? (
        <StLoadingSpinner />
      ) : (
        // TODO: api 명세 수정 반영된 후 해당하는 데이터가 없을 경우 데이터 없다는 문구 표시(!isNoMoreData &&)
        <StLoadingIndicator ref={lastItemRef} />
      )}
    </StPortfolioPageContainer>
  );
};

const StPortfolioPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 41px;
`;

const StPortfolioListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  grid-auto-rows: min-content;
  row-gap: 56px;
  column-gap: 50px;
  width: 100%;
  margin-top: 10px;
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

const StLoadingSpinner = styled(AiOutlineLoading3Quarters)`
  animation: ${spinAnimation} 1s infinite linear;
  font-size: 30px;
  color: gray;
`;

const StNoDataTextContainer = styled.div``;

export default Main;
