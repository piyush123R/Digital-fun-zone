import Signup from './Components/Signup';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import Addtodo from './Components/Addtodo';
import Removetodo from './Components/Removetodo'
import Option from './Components/Option';
import Updates from './Components/Updates';
import Completed from './Components/Completed';
import Showimg from './Practise/Showimg';
import Imageupload from './Practise/Imageupload';
import Leaderboard from './Practise/Leaderboard';
import Antdesign from './Practise/Antdesign';
import Personalchat from './Practise/Personalchat';
import Multipurpose from './Practise/Multipurpose';
import Game from './Practise/Game'
import Navigation from './Practise/Navigation';
function App() {
  return (
    <BrowserRouter>
      
       <Routes>
          <Route exact path='/' element={<Signup></Signup>}></Route>
          <Route exact path='/login' element={<Login></Login>}></Route>
          <Route exact path='/signup' element={<Signup></Signup>}></Route>
          <Route exact path='/Home' element={<Home></Home>}></Route>
          <Route exact path='/addtodo' element={<Addtodo></Addtodo>}></Route>
          <Route exact path='/remove' element={<Removetodo></Removetodo>}></Route>
          <Route exact path='/options' element={<Option></Option>}></Route>
          <Route exact path='/update' element={<Updates></Updates>}></Route>
          <Route exact path='/done' element={<Completed></Completed>}></Route>
          <Route exact path='/show' element={<Showimg></Showimg>}></Route>
          <Route exact path='/ranking' element={<Leaderboard></Leaderboard>}></Route>
          <Route exact path='/antd' element={<Antdesign></Antdesign>}></Route>
          <Route exact path='/chat' element={<Personalchat></Personalchat>}></Route>
          <Route exact path='/multi' element={<Multipurpose></Multipurpose>}></Route>
          <Route exact path='/game' element={<Game></Game>}></Route>
          <Route exact path='/nav' element={<Navigation></Navigation>}></Route>
          <Route path='/*' element={<Imageupload></Imageupload>}></Route>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
