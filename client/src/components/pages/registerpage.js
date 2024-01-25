import { useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import { userContext } from "../userContext";

export default function RegisterPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(userContext);
    async function register(ev){
       ev.preventDefault(); 
       const response= await fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api:4000/register',{
        method:'POST',
        body: JSON.stringify({username,password}),
        headers:{'Content-type':'application/json'}
       })
       if(response.status !==200)
       {
        alert('register failed: use Unique username')
       }
       else{
            response.json().then(userInfo=>{
                setUserInfo(userInfo)
                setRedirect(true);
            })
       }

    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return(
    <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input type="text" placeholder="username" value={username}
        onChange={ev=>setUsername(ev.target.value)}/>
        <input type="password" placeholder="password" value={password}
        onChange={ev=>setPassword(ev.target.value)}/>
        <button style={{marginTop:'5px', width:'100%'}}>Register</button>
    </form>
    )
}
