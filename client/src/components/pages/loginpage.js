import { useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import { userContext } from "../userContext";

export default function LoginPage(){

    const [username, setUsername] =useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(userContext);
    async function login(ev){
        ev.preventDefault();
        const response = await fetch('https://iblog-deepanshus-projects-b59175f2.vercel.app/api/login',{
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include',
        });

        if(response.ok)
        {
            response.json().then(userInfo=>{
                setUserInfo(userInfo)
                setRedirect(true);
            })
        }
        else
        {
            alert('worng username or password!');
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" placeholder="username" value={username}
            onChange={e=>setUsername(e.target.value)
            }/>
            <input type="password" placeholder="password" value={password}
            onChange={e=>
                setPassword(e.target.value)
            }/>
            <button style={{marginTop:'5px', width:'100%'}}>Login</button>
        </form>
    )
}
