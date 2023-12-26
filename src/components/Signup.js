import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    let navigate = useNavigate()
    const [credentials, setcredentials] = useState({name:"",email:"",password:"",cpassword:""})

    const handleSubmit = async (e) =>{
        e.preventDefault(); 
        const {name,email,password} = credentials;
        const response = await fetch(`http://localhost:5000/api/auth/createuser`,{
         method:'POST',
         headers:{
             'Content-type':'application/json'
         },
         body: JSON.stringify({name,email,password})
     });
     const json = await response.json();
     console.log(json)
     if(json.success){
         //Save the auth token and redirect
         localStorage.setItem('token',json.authtoken);
         navigate("/")
         props.showAlert("Account created successfully!!","success")
     }
     else{
         props.showAlert("Invalid Credentials","danger")
     }
 
     
 }
 const onChange = (e) => {
  setcredentials({...credentials,[e.target.name]:e.target.value})
 };

  return (
    <div className='container mt-2'>
              <h2>Create an account</h2>
      <form onSubmit={handleSubmit} className='my-3'>
  <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" required/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" required/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>


  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" name='password' onChange={onChange} id="password" minLength={5} required/>
  </div>

  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label"> Confirm Password</label>
    <input type="password" className="form-control" name='cpassword' onChange={onChange} id="cpassword" minLength={5} required/>
  </div>

  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  );
}

export default Signup;
