import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';


const Login = (props) => 
{
    let navigate = useNavigate()
    const [credentials, setcredentials] = useState({email:"",password:""})

    const handleSubmit = async (e) =>{
       e.preventDefault(); 
       const response = await fetch(`http://localhost:5000/api/auth/login`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({email:credentials.email,password: credentials.password})
    });
    const json = await response.json();
    console.log(json)
    if(json.success){
        //Save the auth token and redirect
        localStorage.setItem('token',json.authtoken);
        props.showAlert("Logged In successfully!!","success")
        navigate("/")
    }
    else{
        props.showAlert("Invalid Credentials","danger")
    }

    
}
const onChange = (e) => {
 setcredentials({...credentials,[e.target.name]:e.target.value})
};
  return (
    <div className='mt-3'>
        <h2>Login to continue to iNotebook</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" name='email' 
                value={credentials.email} onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email"/>
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className='form-label'>Password</label>
                <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} placeholder="Password"/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>

)}

export default Login;
