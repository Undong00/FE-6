import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '@src/pages/Main';
import Test from '@src/pages/Test';
import Detail from '@src/pages/Detail';
import MyPage from '@src/pages/MyPage';
import { PATH_URL } from '@src/constants/constants';
import Layout from './Layout';
import SearchResults from '@src/pages/SearchResults';
import HyoHwan from '@src/pages/HyoHwan';
import PortfolioDetails from '@src/pages/PortfolioDetails';
import LinkPreview from '@src/components/LinkPreview';
import MyPortfolio from '@src/pages/MyPortfolio';
import CreatePortfolio from '@src/pages/CreatePortfolio';
import Login from '@src/pages/Login';
import KakaoAuth from '@src/components/auth/KakaoAuth';
import TestKakaoLogin from '@src/components/auth/TestKakaoLogin';
import RedirectionNaver from '@src/components/RedirectionNaver';

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={PATH_URL.MAIN} element={<Main />} />
          <Route path={PATH_URL.DETAIL_PATH} element={<Detail />} />
          <Route path={PATH_URL.TEST} element={<Test />} />
          <Route path={PATH_URL.PORTFOLIODETAIL} element={<PortfolioDetails />} />
          <Route path={PATH_URL.MYPAGE} element={<MyPage />} />
          <Route path={PATH_URL.SEARCHRESULTS} element={<SearchResults />} />
          <Route path={PATH_URL.MY_PORTFOLIO_PATH} element={<MyPortfolio />} />
          <Route path={PATH_URL.CREATE_PORTFOLIO} element={<CreatePortfolio />} />
          <Route path="*" element={<Login />} />
          <Route path={PATH_URL.KAKAO_AUTH} element={<KakaoAuth />} />
          <Route path="/test/kakao" element={<TestKakaoLogin />} />
          <Route path="/api/users/naver" element={<RedirectionNaver />}></Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
