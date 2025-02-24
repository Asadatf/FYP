import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

import ContactSection from '../components/ContactSection';
import heroImage from '../assets/images/home10/hero-img10.png';
import shape1 from '../assets/images/home10/sh-1.png';
import shape2 from '../assets/images/home10/sh-2.png';
import heroBg from '../assets/images/home10/hero-bg10.png';
import serShape1 from '../assets/images/home10/ser-shape1.png';
import serIcon1 from '../assets/images/home10/ser-icon1.png';
import serIcon2 from '../assets/images/home10/ser-icon2.png';
import serIcon3 from '../assets/images/home10/ser-icon3.png';
import overShape1 from '../assets/images/home10/over-shape1.png';
import overImg1 from '../assets/images/home10/over-img1.png';
import overBgShape2 from '../assets/images/home10/over-bg-sh2.png';
import overImg2 from '../assets/images/home10/over-img2.png';
import featBg from '../assets/images/home10/feat-bg.jpg';
import feature1 from '../assets/images/features-1.png';
import feature2 from '../assets/images/features-2.png';
import feature3 from '../assets/images/features-3.png';

const Home = () => {


    const features = [
        { title: "Face Recognition", icon: "assets/images/features-1.png" },
        { title: "Network Scanning", icon: "assets/images/features-2.png" },
        { title: "Client Protection", icon: "assets/images/features-3.png" },
        { title: "Scheduled Backups", icon: "assets/images/features-1.png" }
    ];

    return (
        <>
            <div
                className="section tech-hero-section-10"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6">
                            {/* Hero Content Start */}
                            <div className="hero-content">
                                <h2
                                    className="title"
                                // data-aos="fade-up" 
                                // data-aos-delay="800"
                                >AI-Based<span>Cybersecurity</span> learning platform
                                </h2>
                                <p
                                // data-aos="fade-up" 
                                // data-aos-delay="900"
                                >
                                    empowering students to master skills and excel in their cybersecurity journey
                                </p>
                                <div
                                    className="hero-btn"
                                // data-aos="fade-up" 
                                // data-aos-delay="1000"
                                >
                                    <a className="btn" href="#">Read More</a>
                                </div>
                            </div>
                            {/* Hero Content End */}
                        </div>
                        <div className="col-lg-6">
                            {/* Hero Images Start */}
                            <div className="hero-images">
                                <img className="shape-1" src={shape1} alt="" />
                                <img className="shape-2" src={shape2} alt="" />
                                <div className="image">
                                    <img src={heroImage} alt="" />
                                </div>
                            </div>
                            {/* Hero Images End */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="section service-section-10 section-padding-03">
                <div className="container">
                    <div className="service-wrap">
                        <div className="section-title2 text-center">
                            <div className="sub-title primary">Our solution</div>
                            <h2 className="title white">Game-Based Learning</h2>
                        </div>
                        <div className="service-content-wrap">
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    {/* Service Item Start */}
                                    <div className="service-item text-center">
                                        <div className="shape-1">
                                            <img src={serShape1} alt="" />
                                        </div>
                                        <div className="service-icon">
                                            <img src={serIcon1} alt="" />
                                        </div>
                                        <div className="service-content">
                                            <h3 className="title">
                                                <a href="#">
                                                    Data<br /> Encryption
                                                </a>
                                            </h3>
                                            <p>We provide the most responsive and functional IT design for companies and businesses worldwide.</p>
                                        </div>
                                    </div>
                                    {/* Service Item End */}
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    {/* Service Item Start */}
                                    <div className="service-item text-center">
                                        <div className="shape-1">
                                            <img src={serShape1} alt="" />
                                        </div>
                                        <div className="service-icon">
                                            <img src={serIcon2} alt="" />
                                        </div>
                                        <div className="service-content">
                                            <h3 className="title">
                                                <a href="#">
                                                    Malware <br /> Protection
                                                </a>
                                            </h3>
                                            <p>We provide the most responsive and functional IT design for companies and businesses worldwide.</p>
                                        </div>
                                    </div>
                                    {/* Service Item End */}
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    {/* Service Item Start */}
                                    <div className="service-item text-center">
                                        <div className="shape-1">
                                            <img src={serShape1} alt="" />
                                        </div>
                                        <div className="service-icon">
                                            <img src={serIcon3} alt="" />
                                        </div>
                                        <div className="service-content">
                                            <h3 className="title">
                                                <a href="#">
                                                    Network <br /> Defender
                                                </a>
                                            </h3>
                                            <p>We provide the most responsive and functional IT design for companies and businesses worldwide.</p>
                                        </div>
                                    </div>
                                    {/* Service Item End */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="section overview-section-5 section-padding">
                <div className="container">
                    {/* Overview Wrap Start */}
                    <div className="overview-wrap">
                        <div className="row">
                            <div className="col-xl-7 col-lg-6">
                                {/* Overview Image Start */}
                                <div className="overview-img">
                                    <img className="shape-1" src={overShape1} alt="" />
                                    <div className="image">
                                        <img src={overImg1} alt="" />
                                    </div>
                                </div>
                                {/* Overview Image End */}
                            </div>
                            <div className="col-xl-5 col-lg-6">
                                {/* Overview Content Start */}
                                <div className="overview-content">
                                    <div className="section-title2">
                                        <h2 className="title white">best solution for All native Devices</h2>
                                    </div>
                                    <p className="text">
                                        Accelerate innovation with world-class tech teams We'll match you to an entire remote team of incredible freelance talent for all your software development needs.
                                    </p>
                                    <div className="overview-list">
                                        <ul>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <li>
                                                        <span className="overview-icon">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                        <span className="overview-text">Complete Security</span>
                                                    </li>
                                                </div>
                                                <div className="col-md-6">
                                                    <li>
                                                        <span className="overview-icon">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                        <span className="overview-text">Security Management</span>
                                                    </li>
                                                </div>
                                                <div className="col-md-6">
                                                    <li>
                                                        <span className="overview-icon">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                        <span className="overview-text">Malware Detection</span>
                                                    </li>
                                                </div>
                                                <div className="col-md-6">
                                                    <li>
                                                        <span className="overview-icon">
                                                            <i className="fas fa-check"></i>
                                                        </span>
                                                        <span className="overview-text">Identifying Threats</span>
                                                    </li>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                                {/* Overview Content End */}
                            </div>
                        </div>
                    </div>
                    {/* Overview Wrap End */}
                </div>
            </div>
            {/* Overview End */}




            <div className="section overview-section-3 overview-section-4 overview-section-6">
                <img className="shape-1" src={overBgShape2} alt="" />
                <div className="container">
                    {/* Overview Wrap Start */}
                    <div className="overview-wrap">
                        <div className="row">
                            <div className="col-lg-6">
                                {/* Overview Content Start */}
                                <div className="overview-content">
                                    <div className="section-title2">
                                        <h2 className="title white">
                                            Transform Learning with AI-Based Cybersecurity Games
                                        </h2>
                                    </div>
                                    <p className="text">
                                        Discover the future of education with our adaptive learning platform.
                                        Dive into engaging, game-based challenges designed to teach essential
                                        cybersecurity skills in an interactive and immersive way.
                                    </p>
                                    <div className="overview-list">
                                        <ul>
                                            <li>
                                                <span className="overview-text">Comprehensive Learning Path</span>
                                            </li>
                                            <li>
                                                <span className="overview-text">Gamified Education</span>
                                            </li>
                                            <li>
                                                <span className="overview-text">
                                                    Hands-on Experience through Simulation
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                    <a className="btn" href="#">Start Learning</a>
                                </div>
                                {/* Overview Content End */}
                            </div>
                            <div className="col-lg-6">
                                {/* Overview Image Start */}
                                <div className="overview-img">
                                    <div className="image">
                                        <img src={overImg2} alt="" />
                                    </div>
                                </div>
                                {/* Overview Image End */}
                            </div>
                        </div>
                    </div>
                    {/* Overview Wrap End */}
                </div>
            </div>
            {/* // Overview End */}




            <div
                className="section features-section-10 section-padding"
                style={{ backgroundImage: `url(${featBg})` }}
            >
                <div className="container">
                    {/* Features Wrap Start */}
                    <div className="features-wrap-3">
                        <div className="section-title2 text-center">
                            <h3 className="sub-title primary">advanced and reliable protection</h3>
                            <h2 className="title white">Explore Our Cybersecurity Games</h2>
                        </div>
                        <div className="features-content-wrap">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6">
                                    {/* Features Item Start */}
                                    <div className="features-item text-center">
                                        <div className="features-icon">
                                            <img src={feature1} alt="" />
                                        </div>
                                        <div className="features-content">
                                            <h3 className="title">all Face Recognition</h3>
                                        </div>
                                    </div>
                                    {/* Features Item End */}
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    {/* Features Item Start */}
                                    <div className="features-item text-center">
                                        <div className="features-icon">
                                            <img src={feature2} alt="" />
                                        </div>
                                        <div className="features-content">
                                            <h3 className="title">Network Scanning</h3>
                                        </div>
                                    </div>
                                    {/* Features Item End */}
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    {/* Features Item Start */}
                                    <div className="features-item text-center">
                                        <div className="features-icon">
                                            <img src={feature3} alt="" />
                                        </div>
                                        <div className="features-content">
                                            <h3 className="title">Client Protection</h3>
                                        </div>
                                    </div>
                                    {/* Features Item End */}
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    {/* Features Item Start */}
                                    <div className="features-item text-center">
                                        <div className="features-icon">
                                            <img src={feature1} alt="" />
                                        </div>
                                        <div className="features-content">
                                            <h3 className="title">Scheduled Backups</h3>
                                        </div>
                                    </div>
                                    {/* Features Item End */}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Features Wrap End */}
                </div>
            </div>


            <ContactSection />
        </>
    );
};

export default Home;