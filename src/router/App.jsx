import { Navigate, Route, Routes, BrowserRouter} from 'react-router-dom';
import { Home } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';

const App = () => {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace={true} />} />
            {/* <Route path="/login" element={<LoginUser />}/>
            <Route path="/addporto" element={<AuthChecker><AddPorto /></AuthChecker>}/>
            <Route path="/editporto/:id" element={<AuthChecker><EditPorto /></AuthChecker>}/> */}
            <Route path="/home" element={<Home />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
            {/* <Route path="*" element={<NotFound/>} /> */}
          </Routes>
        </BrowserRouter>
      </>
  );
};

export default App;