import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import Post from "../post";

export default function Profile(){
    const {id} = useParams();
    const [posts, setPosts] = useState([]);
    useEffect( ()=>{
         fetch(`https://iblog-deepanshus-projects-b59175f2.vercel.app/api/profile/${id}`).then(response =>{
            response.json().then(posts=>{
                setPosts(posts)
            })
        }
        )
    },[id]);
    return (
        <>
            <>
                {posts.length> 0 &&
                    <h2 className="user-name">{posts[0].author.username}</h2>
                }
                {posts.length> 0
                && posts.map((post,index)=>(
                    <>
                        <Post key={index} {...post}/>
                    </>
                ))}
            </>
            <>
                {posts.length === 0 &&
                    (<h2>No post found Refresh again</h2>)}
            </>
        </>
      
    );
}
