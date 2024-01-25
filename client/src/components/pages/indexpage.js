import { useContext, useEffect, useState } from 'react';
import Post from '../post';
import { userContext } from '../userContext';

export default function IndexPage(){

    const [posts, setPosts] = useState([]);
    const {userInfo,setUserInfo} = useContext(userContext);

    useEffect(()=>{
        fetch('http://localhost:4000/post').then(response=>{
            response.json().then(posts=>{
               setPosts(posts);
               console.log(posts);
            });
        });
    },[]);

    if(userInfo &&userInfo.clicked)
    {
      fetch(`http://localhost:4000/post/search/?query=${userInfo.search}`).then(response=>{
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
            (<h2>No post found Refresh again</h2>)
          }
        </>
      </>
    )
}