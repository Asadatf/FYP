import React from 'react';
import PageBanner from '../components/PageBanner';
import aboutImage from '../assets/images/about-2.jpg';
import serviceShape2 from '../assets/images/service/s-shape-2.png';
import serviceIcon1 from '../assets/images/service/service-1.png';
import serviceIcon2 from '../assets/images/service/service-2.png';
import serviceIcon3 from '../assets/images/service/service-3.png';

const About = () => {
  return (
    <>
      <PageBanner
        title="About Us"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About Us', path: '/about' }
        ]}
      />

      {/* // About Start */}
      <div className="section about-section section-padding">
        <div className="container">
          {/* About Wrap Start */}
          <div className="about-wrap">
            <div className="row">
              <div className="col-lg-6">
                {/* About Thumb Wrap Start */}
                <div className="about-thumb-wrap">
                  <div className="about-thumb-small">
                    <img src={aboutImage} alt="" />
                  </div>
                </div>
                {/* About Thumb Wrap End */}
              </div>
              <div className="col-lg-6">
                {/* About Content Start */}
                <div className="about-content">
                  <div className="section-title">
                    <h3 className="sub-title">Who We Are</h3>
                    <h2 className="title">
                      Empowering the <br /> Next Generation of Cybersecurity Experts
                    </h2>
                  </div>
                  <p>
                    Our adaptive learning platform revolutionizes cybersecurity education by offering
                    personalized experiences through interactive games, hands-on labs, and real-world
                    challenges, empowering students to master skills and excel in their cybersecurity journey.
                  </p>
                  <div className="about-author-list">
                    <div className="about-list">
                      <ul>
                        <li>
                          <i className="fas fa-check"></i>
                          <a href="#">Comprehensive Learning Path</a>
                        </li>
                        <li>
                          <i className="fas fa-check"></i>
                          <a href="#">Enhanced Engagement through Gamification</a>
                        </li>
                        <li>
                          <i className="fas fa-check"></i>
                          <a href="#">Hands-on Experience through Simulation</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* About Content End */}
              </div>
            </div>
          </div>
          {/* About Wrap End */}
        </div>
      </div>

      {/* // About End */}

      <div className="section service-section service-section-5">
        <div className="container">
          <div className="service-wrap">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                {/* Service Item Start */}
                <div className="service-item about-service-item text-center">
                  <div className="shape-1"></div>
                  <div className="shape-2">
                    <img src={serviceShape2} alt="" />
                  </div>
                  <div className="service-icon">
                    <img src={serviceIcon1} alt="" />
                  </div>
                  <div className="service-content">
                    <h3 className="title"><a href="#">Adaptive Learning</a></h3>
                    <p>Experience personalized lessons tailored to your needs.</p>
                  </div>
                </div>
                {/* Service Item End */}
              </div>

              <div className="col-lg-4 col-sm-6">
                {/* Service Item Start */}
                <div className="service-item about-service-item text-center">
                  <div className="shape-1"></div>
                  <div className="shape-2">
                    <img src={serviceShape2} alt="" />
                  </div>
                  <div className="service-icon">
                    <img src={serviceIcon2} alt="" />
                  </div>
                  <div className="service-content">
                    <h3 className="title"><a href="#">Interactive Gameplay</a></h3>
                    <p>Learn through immersive, cybersecurity-themed games</p>
                  </div>
                </div>
                {/* Service Item End */}
              </div>

              <div className="col-lg-4 col-sm-6">
                {/* Service Item Start */}
                <div className="service-item about-service-item text-center">
                  <div className="shape-1"></div>
                  <div className="shape-2">
                    <img src={serviceShape2} alt="" />
                  </div>
                  <div className="service-icon">
                    <img src={serviceIcon3} alt="" />
                  </div>
                  <div className="service-content">
                    <h3 className="title"><a href="#">Skill Development</a></h3>
                    <p>Progress along a structured roadmap from basics to mastery</p>
                  </div>
                </div>
                {/* Service Item End */}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* //service end */}



      {/* // Skill Start */}
      <div className="section skill-section skill-section-2">
        <div className="container">
          <div className="skill-wrap">
            {/* Skill Content Wrap Start */}
            <div className="skill-content-wrap">
              <div className="row align-items-center">
                <div className="col-lg-5">
                  {/* Skill Content Left Start */}
                  <div className="skill-content-left">
                    {/* <div className="experience">
                   <h2 className="number">25+</h2>
                   <span>Years of experience</span>
                 </div> */}
                    <h3 className="title">
                      Empowering the <span>Cybersecurity Learning</span> through Game-Based Solutions
                    </h3>
                  </div>
                  {/* Skill Content Left End */}
                </div>
                <div className="col-lg-7">
                  {/* Skill Content Right Start */}
                  <div className="skill-content-right">
                    {/* <h3 className="title">Accelerate innovation with world-class tech teams We'll match you to an entire remote technology</h3> */}
                    <div className="skill-bar-wrap shape-2">
                      <img
                        src="https://inspiredelearning.com/wp-content/uploads/2023/01/gamification-eleanring-scaled.jpeg"
                        alt="Gamification eLearning"
                      />
                    </div>
                  </div>
                  {/* Skill Content Right End */}
                </div>
              </div>
            </div>
            {/* Skill Content Wrap End */}
          </div>
        </div>
      </div>
      {/* // Skill End */}


    </>
  );
};

export default About;