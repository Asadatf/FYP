import logo from '../assets/images/logo (2).png';

const Footer = () => {
 return (
   <div>
     {/* Footer Section Start */}
     <div className="section footer-section">
       <div className="container">
         {/* Footer Widget Wrap Start */}
         <div className="footer-widget-wrap footer-widget-wrap-2">
           <div className="row">
             <div className="col-lg-3 col-sm-6">
               {/* Footer Widget Start */}
               <div className="footer-widget-about">
                 <a className="footer-logo" href="index.html">
                   <img src={logo} alt="Logo" />
                 </a>
                 <div className="widget-info">
                   <ul>
                     <li>
                       <div className="info-icon">
                         <i className="flaticon-phone-call"></i>
                       </div>
                       <div className="info-text">
                         <span><a href="#">+92123456789</a></span>
                       </div>
                     </li>
                     <li>
                       <div className="info-icon">
                         <i className="far fa-envelope-open"></i>
                       </div>
                       <div className="info-text">
                         <span><a href="#">info@cyberbit.com</a></span>
                       </div>
                     </li>
                     <li>
                       <div className="info-icon">
                         <i className="flaticon-pin"></i>
                       </div>
                       <div className="info-text">
                         <span>Karachi,Pakistan</span>
                       </div>
                     </li>
                   </ul>
                 </div>
               </div>
               {/* Footer Widget End */}
             </div>
             <div className="col-lg-3 col-sm-6">
               {/* Footer Widget Start */}
               <div className="footer-widget">
                 <h4 className="footer-widget-title">Useful Links</h4>
                 <div className="widget-link">
                   <ul className="link">
                     <li><a href="#">Home</a></li>
                     <li><a href="#">About Us</a></li>
                     <li><a href="#">Login</a></li>
                     <li><a href="#">Contact Us</a></li>
                   </ul>
                 </div>
               </div>
               {/* Footer Widget End */}
             </div>
             <div className="col-lg-3 col-sm-6">
               {/* Footer Widget Start */}
               <div className="footer-widget">
                 <h4 className="footer-widget-title">Our Topics</h4>
                 <div className="widget-link">
                   <ul className="link">
                     <li><a href="#">Data Security</a></li>
                     <li><a href="#">IT Managment</a></li>
                     <li><a href="#">Encryption</a></li>
                     <li><a href="#">Networking</a></li>
                   </ul>
                 </div>
               </div>
               {/* Footer Widget End */}
             </div>
             <div className="col-lg-3 col-sm-6">
               {/* Footer Widget Start */}
               {/* Footer Widget End */}
             </div>
           </div>
         </div>
         {/* Footer Widget Wrap End */}
       </div>

       {/* Footer Copyright Start */}
       <div className="footer-copyright-area footer-copyright-4">
         <div className="container">
           <div className="footer-copyright-wrap">
             <div className="row align-items-center">
               <div className="col-lg-6 col-md-6">
                 {/* Footer Copyright Text Start */}
                 <div className="copyright-text">
                   <p>© Copyrights 2024 <a href="#">CyberFort</a> All rights reserved. </p>
                 </div>
                 {/* Footer Copyright Text End */}
               </div>
             </div>
           </div>
         </div>
       </div>
       {/* Footer Copyright End */}
     </div>
     {/* Footer Section End */}

     {/* back to top start */}
     <div className="progress-wrap">
       <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
         <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
       </svg>
     </div>
     {/* back to top end */}
   </div>
 );
};

export default Footer;