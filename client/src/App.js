import './App.css';
import Layout from './components/layout';
import IndexPage from './components/pages/indexpage';
import {Route, Routes} from "react-router-dom";
import LoginPage from './components/pages/loginpage';
import RegisterPage from './components/pages/registerpage';
import { UserContextProvider } from './components/userContext';
import CreatePost from './components/pages/createpost';
import PostPage from './components/pages/postpage';
import EditPost from './components/pages/editpost';
import Profile from './components/pages/profile';
function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<IndexPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/create' element={<CreatePost/>}/>
        <Route path="/post/:id" element={<PostPage/>}/>
        <Route path='/edit/:id' element={<EditPost/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
   
  );
}

export default App;
