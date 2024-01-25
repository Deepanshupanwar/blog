import { useContext, useEffect, useState} from "react";
import { Navigate ,Link } from "react-router-dom";
import { userContext } from "./userContext";

export default function Header(){
 
  const {userInfo,setUserInfo} =useContext(userContext);
  const [search, setSearch]= useState('');
  const [redirect, setRedirect] =useState(false);
  useEffect(()=>{
    fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/profile',{
      credentials: 'include',
    }).then(response=>{
      response.json().then(userInfo=>{
        setUserInfo(userInfo)
      })
    })
  },[setUserInfo]);

  function logout(ev){
    ev.preventDefault();
    fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/logout',{
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    setRedirect(true);
  }
  const username = userInfo?.username ;

 if(redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <header>
        <Link to="/" className="logo">iBlog</Link>
        <nav className="header-right">
          <div className="search-box">
          <input className="search" type="text" placeholder="Enter Blog Title to Search" onChange={ev=>{
            setSearch(ev.target.value)
          }}/>
          <button className="search-btn" onClick={ev=>{
              setUserInfo(prevState => ({
                ...prevState,
                search: search, 
                clicked:true
              }))
          }}>Search</button>
          </div>
          <div className="header-left">
          {username && (
            <>
               <Link to={`/profile/${userInfo.id}`}>{username}</Link>
              <Link to='/create'>Create new Post</Link>
              <a href="/" onClick={logout}>logout</a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          </div>
        </nav>
      </header> 
    );
}
