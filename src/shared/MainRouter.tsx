import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '@src/pages/Main';
import Test from '@src/pages/Test';
import Detail from '@src/pages/Detail';
import { PATH_URL } from '@src/constants/constants';
import Layout from './Layout';
import TestPortfolioPage from '@src/pages/TestPortfolioPage';

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={PATH_URL.MAIN} element={<Main />} />
          <Route path={PATH_URL.DETAIL_PATH} element={<Detail />} />
          <Route path={PATH_URL.TEST} element={<Test />} />
          <Route path="/test/portfolio" element={<TestPortfolioPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
