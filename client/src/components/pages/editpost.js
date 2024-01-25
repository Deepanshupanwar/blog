import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from "react-router-dom";
import Editor from "../editor";



export default function EditPost(){
    const {id} = useParams();
    const [title, setTitle] =useState('');
    const [summary, setSummary] =useState('');
    const [content, setContent] =useState('');
    const [file, setFile] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        fetch(`https://iblog-deepanshus-projects-b59175f2.vercel.app/api/post/`+id)
        .then(response =>{
            response.json().then(postInfo=>{
                setTitle(postInfo.title)
                setContent(postInfo.content)
                setSummary(postInfo.summary)
            })
        })
    },[id])

    async function editPost(ev){
        ev.preventDefault();

        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('id',id);
        if(file?.[0])
            data.set('file', file?.[0])

        const response = await fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/post',{
            method: 'PUT',
            body: data,
            credentials: 'include'
        })

        if(response.ok)
        {
            setRedirect(true);
        }

    }

    if(redirect)
    {
      return <Navigate to={'/post/'+id}/>
    }

    return (
    <form onSubmit={editPost}>
        <input type="title" placeholder={'Title'} value={title} 
        onChange={
          ev=> setTitle(ev.target.value)
        }/>
        <input type="summary" placeholder={'Summary'} value={summary}
        onChange={
          ev=> setSummary(ev.target.value)
        }/>
        <input type="file"
        onChange={
          ev=> setFile(ev.target.files)
        }/>
        <Editor onChange={setContent} value={content}/>
        <button style={{marginTop:'5px', width:'100%'}}>Edit Post</button>
    </form>
    );
}
