import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../editor";




export default function CreatePost(){

    const [title, setTitle] =useState('');
    const [summary, setSummary] =useState('');
    const [content, setContent] =useState('');
    const [file, setFile] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev){

      const data = new FormData();
      data.set('title',title);
      data.set('summary',summary);
      data.set('content',content);
      data.set('file', file[0])

      ev.preventDefault();

      const response= await fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/post',
      {
        method: 'POST',
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
      return <Navigate to={'/'}/>
    }

    return (
    <form onSubmit={createNewPost}>
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
        <button style={{marginTop:'5px', width:'100%'}}>Create Post</button>
    </form>
    );
}
