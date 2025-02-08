import { useContext, useEffect, useState } from 'react';
import Post from '../post';
import { userContext } from '../userContext';

export default function IndexPage(){

    const [posts, setPosts] = useState([]);
    const {userInfo,setUserInfo} = useContext(userContext);

    useEffect(()=>{
        fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/post').then(response=>{
            response.json().then(posts=>{
               setPosts(posts);
            });
        });
    },[]);

    if(userInfo &&userInfo.clicked)
    {
      fetch(`https://iblog-deepanshus-projects-b59175f2.vercel.app/api/post/search/?query=${userInfo.search}`).then(response=>{
        response.json().then(posts=>{
          setPosts(posts);
       });
    });
    setUserInfo(prevState => ({
      ...prevState,
      search: '',
      clicked:false 
    }))
    }
    
    return(
      <>
        <>
          {posts.length> 0 && posts.map((post,index)=>(
            <Post key={index} {...post}/>
          ))}
        </>
        <>
          {posts.length === 0 &&
            (<h2>Loading please wait</h2>)
          }
        </>
      </>
    )
}
