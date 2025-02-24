import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../components/PageBanner';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <>
      <PageBanner 
        title="Login" 
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Login', path: '/login' }
        ]} 
      />
      {/* // Login & Register Start */}
   <div className="section login-register-section section-padding">
     <div className="container">
       {/* Login & Register Wrapper Start */}
       <div className="login-register-wrap">
         <div className="row gx-5">
           <div className="col-lg-6">
             {/* Login Box Start */}
             <div className="login-register-box">
               {/* Section Title Start */}
               <div className="section-title">
                 <h2 className="title">Login</h2>
               </div>
               {/* Section Title End */}

               <div className="login-register-form">
                 <form action="#">
                   <div className="single-form">
                     <input 
                       type="text" 
                       className="form-control" 
                       placeholder="Username or email"
                     />
                   </div>
                   <div className="single-form">
                     <input 
                       type="password" 
                       className="form-control" 
                       placeholder="Password"
                     />
                   </div>
                   <div className="single-form form-check">
                     <input 
                       className="form-check-input" 
                       type="checkbox" 
                       value="" 
                       id="flexCheckDefault"
                     />
                     <label 
                       className="form-check-label" 
                       htmlFor="flexCheckDefault"
                     >
                       Remember me
                     </label>
                   </div>
                   <div className="form-btn">
                     <button className="btn">Login</button>
                   </div>
                   <div className="single-form">
                     <p><a href="#">Lost your password?</a></p>
                   </div>
                 </form>
               </div>
             </div>
             {/* Login Box End */}
           </div>

           <div className="col-lg-6">
             {/* Register Box Start */}
             <div className="login-register-box">
               {/* Section Title Start */}
               <div className="section-title">
                 <h2 className="title">Register</h2>
               </div>
               {/* Section Title End */}

               <div className="login-register-form">
                 <form action="#">
                   <div className="single-form">
                     <input 
                       type="text" 
                       className="form-control" 
                       placeholder="Email"
                     />
                   </div>
                   <div className="single-form">
                     <input 
                       type="text" 
                       className="form-control" 
                       placeholder="Username or email"
                     />
                   </div>
                   <div className="single-form">
                     <input 
                       type="password" 
                       className="form-control" 
                       placeholder="Password"
                     />
                   </div>
                   <div className="single-form">
                     <input 
                       type="password" 
                       className="form-control" 
                       placeholder="Confirm Password"
                     />
                   </div>
                   <div className="form-btn">
                     <button className="btn">Register</button>
                   </div>
                 </form>
               </div>
             </div>
             {/* Register Box End */}
           </div>
         </div>
       </div>
       {/* Login & Register Wrapper End */}
     </div>
   </div>
   {/* // Login & Register End */}


   
    </>
  );
};

export default Login;