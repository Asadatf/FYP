import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [quizzes, setquizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userData,setuserdata] = useState({
    name: localStorage.getItem('username'),
    email: localStorage.getItem('email')

  });
  const [complete, setcomplete] =useState(0);

  // Add authentication check
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");

    if (!token) {
      // No token found, redirect to login page
      navigate("/login?logged_out=true", { replace: true });
      return;
    }

    // Prevent back button navigation
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(
          "http://localhost:5500/api/games/getgames?is_active=1"
        );
        const data = await response.json(); // Convert response to JSON

        const qresponse = await fetch(
          "http://localhost:5500/api/quiz/getquizzes"
        );
        const qdata = await qresponse.json(); // Convert response to JSON


        setGames(data.games); // Store games in state
        setquizzes(qdata.quizzes);
        console.log(userData)
        
        const res = await fetch(`http://localhost:5500/api/quiz/getquizscore?username=${userData.name}`);
        const dc = await res.json();
        console.log('Completed Quizzes:', dc);
        setcomplete(dc.count);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Add logout function
  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login?logged_out=true", { replace: true });
  };

  if (loading) return <p>Loading games...</p>;

  return (
    <>
      <div className="dashboard-main-wrapper">
        <div className="dashboard-body">
          {/* Welcome Banner */}
          <div className="card mb-24 bg-main-600">
            <div className="card-body p-24">
              <div className="flex-between flex-wrap gap-16">
                <div>
                  <h3 className="text-white mb-8">
                    Welcome back, {userData.name}!
                  </h3>
                  <p className="text-white mb-0 opacity-75">
                    Continue your cybersecurity learning journey
                  </p>
                </div>
                <div className="d-flex align-items-center gap-16">
                  <div className="stats-card bg-white bg-opacity-10 p-16 rounded-12">
                    <p className="text-white mb-4 fw-medium">Your Progress</p>
                    <h4 className="text-white mb-0">75% Complete</h4>
                  </div>
                  {/* Add logout button */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-light rounded-pill py-10 px-20"
                  >
                    Logout
                    <i className="ph ph-sign-out ms-8"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row gy-24">
            {/* Main Content Column */}
            <div className="col-lg-8">
              {/* Games Section - Expanded */}
              <div className="card mb-24">
                <div className="card-header bg-white border-bottom border-gray-100 p-20">
                  <div className="flex-between flex-wrap gap-8">
                    <h4 className="mb-0">Available Games</h4>
                    <span className="badge rounded-pill bg-main-100 text-main-600 px-16 py-8">
                      {games.length} Games
                    </span>
                  </div>
                </div>
                <div className="card-body p-24">
                  <div className="row g-24">
                    {games.map((game) => (
                      <div key={game.game_id} className="col-md-6 col-lg-4">
                        <div className="card border border-gray-100 h-100 transition-all hover-shadow">
                          <div className="card-body p-0">
                            <div className="position-relative">
                              <div className="bg-main-100 overflow-hidden">
                                <img
                                  src={game.game_thumbnail}
                                  alt={game.title}
                                  className="w-100"
                                  style={{
                                    height: "180px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>

                              <div className="position-absolute top-16 right-16">
                                <span className="badge bg-main-600 text-white px-12 py-6 rounded-8">
                                  {game.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-20">
                              <h5 className="mb-8">
                                <a href="#" className="hover-text-main-600">
                                  {game.title}
                                </a>
                              </h5>
                              <p className="text-gray-600 mb-20">
                                {game.description}
                              </p>

                              <div className="mb-20">
                                <div className="flex-between mb-8">
                                  <span className="text-gray-500 fw-medium">
                                    Completion
                                  </span>
                                  <span className="text-main-600 fw-bold">
                                    32%
                                  </span>
                                </div>
                                <div
                                  className="progress rounded-pill"
                                  style={{ height: "8px" }}
                                >
                                  <div
                                    className="progress-bar bg-main-600"
                                    role="progressbar"
                                    style={{ width: "50%" }}
                                  ></div>
                                </div>
                              </div>

                              <a
                                href={game.game_url}
                                className="btn btn-main w-100 rounded-pill py-12"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Play Game
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Additional Empty Game Card Placeholder */}
                    <div className="col-md-6 col-lg-4">
                      <div className="card border border-gray-100 border-dashed h-100">
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center p-20"
                          style={{ minHeight: "350px" }}
                        >
                          <div className="text-center mb-16">
                            <i
                              className="ph ph-plus-circle text-gray-400"
                              style={{ fontSize: "48px" }}
                            ></i>
                            <h5 className="mb-8 mt-16">Coming Soon</h5>
                            <p className="text-gray-600">
                              New cybersecurity game will be added here
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quizzes Section - Improved UI */}
              <div className="card">
                <div className="card-header bg-white border-bottom border-gray-100 p-20">
                  <div className="flex-between flex-wrap gap-8">
                    <div className="d-flex align-items-center gap-12">
                      <div className="quiz-icon rounded-12 bg-main-50 d-flex align-items-center justify-content-center p-8">
                        <i className="ph ph-brain fs-20 text-main-600"></i>
                      </div>
                      <h4 className="mb-0">Knowledge Quizzes</h4>
                    </div>
                    <div className="d-flex align-items-center gap-12">
                      <span className="badge rounded-pill bg-success-100 text-success-600 px-16 py-8">
                        {quizzes.length} Available
                      </span>
                      <Link
                        to="/quizzes"
                        className="btn btn-sm btn-outline-main rounded-pill"
                      >
                        View All
                        <i className="ph ph-arrow-right ms-6"></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body p-24">
                  <div className="row g-24">
                    {quizzes.map((quiz) => {
                      // Determine badge color based on difficulty
                      const difficultyColor =
                        quiz.difficulty === "Beginner"
                          ? "success"
                          : quiz.difficulty === "Intermediate"
                          ? "warning"
                          : "danger";

                      // Determine icon based on quiz title (simplified)
                      const quizIcon = quiz.title.includes("Network")
                        ? "ph-shield"
                        : quiz.title.includes("Phishing")
                        ? "ph-fish"
                        : "ph-bug";

                      return (
                        <div key={quiz.id} className="col-md-6 col-xl-4">
                          <div className="card border border-gray-100 h-100 transition-all hover-shadow">
                            <div className="card-body p-0">
                              {/* Quiz Header with Icon and Difficulty */}
                              <div className="p-20 border-bottom border-gray-100">
                                <div className="d-flex justify-content-between mb-16">
                                  <div className="quiz-icon rounded-12 bg-main-50 d-flex align-items-center justify-content-center p-12">
                                    <i
                                      className={`${quizIcon} fs-20 text-main-600`}
                                    ></i>
                                  </div>
                                  <span
                                    className={`badge px-12 py-6 rounded-pill bg-${difficultyColor}-100 text-${difficultyColor}-600`}
                                  >
                                    {quiz.difficulty}
                                  </span>
                                </div>

                                <h5 className="mb-8">{quiz.title}</h5>
                                <p className="text-gray-600 mb-0 text-truncate-2">
                                  {quiz.description}
                                </p>
                              </div>

                              {/* Quiz Info and Actions */}
                              <div className="p-20">
                                <div className="d-flex justify-content-between mb-16">
                                  <div className="d-flex align-items-center gap-8">
                                    <i className="ph ph-question fs-16 text-gray-600"></i>
                                    <span className="fs-14 text-gray-600">
                                      {quiz.questions} Questions
                                    </span>
                                  </div>

                                  <div className="d-flex align-items-center gap-8">
                                    <i className="ph ph-clock fs-16 text-gray-600"></i>
                                    <span className="fs-14 text-gray-600">
                                      {quiz.timeEstimate}
                                    </span>
                                  </div>
                                </div>

                                {quiz.completion > 0 ? (
                                  <>
                                    <div className="flex-between mb-8">
                                      <span className="text-gray-500 fw-medium">
                                        Progress
                                      </span>
                                      <span
                                        className={`text-${difficultyColor}-600 fw-bold`}
                                      >
                                        {quiz.completion}%
                                      </span>
                                    </div>
                                    <div
                                      className="progress rounded-pill mb-16"
                                      style={{ height: "8px" }}
                                    >
                                      <div
                                        className={`progress-bar bg-${difficultyColor}-600`}
                                        role="progressbar"
                                        style={{ width: `${quiz.completion}%` }}
                                      ></div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="d-flex align-items-center gap-8 mb-16">
                                    <i className="ph ph-info text-info-600"></i>
                                    <span className="fs-14 text-gray-600">
                                      Not started yet
                                    </span>
                                  </div>
                                )}

                                <Link
                                  to={`/quiz/${quiz.id}`}
                                  className={`btn btn-${
                                    quiz.completion > 0
                                      ? difficultyColor
                                      : "main"
                                  } w-100 rounded-pill py-10`}
                                >
                                  {quiz.completion > 0 ? (
                                    <>
                                      Continue Quiz
                                      <i className="ph ph-arrow-right ms-8"></i>
                                    </>
                                  ) : (
                                    <>
                                      Start Quiz
                                      <i className="ph ph-play ms-8"></i>
                                    </>
                                  )}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quiz Coming Soon Card */}
                    <div className="col-md-6 col-xl-4">
                      <div className="card border border-gray-100 border-dashed h-100">
                        <div
                          className="card-body d-flex flex-column justify-content-center align-items-center p-20"
                          style={{ minHeight: "270px" }}
                        >
                          <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-16"
                            style={{ width: "64px", height: "64px" }}
                          >
                            <i
                              className="ph ph-plus-circle text-gray-400"
                              style={{ fontSize: "28px" }}
                            ></i>
                          </div>
                          <h5 className="mb-8">More Quizzes Coming Soon</h5>
                          <p className="text-gray-600 text-center mb-0">
                            New cybersecurity quizzes will be added regularly
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Challenge Banner */}
                  {/* <div className="card border-0 bg-gradient-primary text-white mt-24 overflow-hidden">
                    <div className="card-body p-24">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center gap-12 mb-12">
                            <div className="badge bg-white bg-opacity-20 px-12 py-6 rounded-pill">
                              <i className="ph ph-trophy me-4"></i>
                              Weekly Challenge
                            </div>
                            <div className="badge bg-warning text-dark px-12 py-6 rounded-pill">
                              <i className="ph ph-clock me-4"></i>3 days left
                            </div>
                          </div>
                          <h4 className="mb-8">
                            Cybersecurity Trivia Challenge
                          </h4>
                          <p className="text-white text-opacity-80 mb-16">
                            Complete this week's challenge to earn a special
                            badge and compete with others on the leaderboard.
                          </p>
                          <button className="btn btn-light rounded-pill py-10 px-20">
                            Take the Challenge
                            <i className="ph ph-lightning ms-8"></i>
                          </button>
                        </div>
                        <div className="col-md-4 d-none d-md-block">
                          <div className="challenge-graphic position-relative">
                            <div
                              className="position-absolute top-0 end-0"
                              style={{ opacity: "0.2" }}
                            >
                              <i
                                className="ph ph-trophy"
                                style={{ fontSize: "120px" }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-lg-4">
              {/* Progress Overview */}
              <div className="card mb-24">
                <div className="card-header bg-white border-bottom border-gray-100 p-20">
                  <h4 className="mb-0">My Progress</h4>
                </div>
                <div className="card-body p-24">
                  {/* <div className="text-center mb-24">
                    <div
                      className="position-relative d-inline-block"
                      style={{ width: "160px", height: "160px" }}
                    >
                      <svg
                        viewBox="0 0 36 36"
                        className="circular-progress w-100 h-100"
                      >
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4c6fff"
                          strokeWidth="3"
                          strokeDasharray="75, 100"
                        />
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h3 className="mb-0 fw-bold">75%</h3>
                        <p className="mb-0 text-gray-500 fs-14">Overall</p>
                      </div>
                    </div>
                  </div> */}

                  <div className="mb-20">
                    <div className="flex-between mb-8">
                      <span className="fw-medium">Network Security</span>
                      <span className="text-main-600 fw-bold">80%</span>
                    </div>
                    <div
                      className="progress rounded-pill"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-main-600"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-20">
                    <div className="flex-between mb-8">
                      <span className="fw-medium">Phishing Prevention</span>
                      <span className="text-main-600 fw-bold">65%</span>
                    </div>
                    <div
                      className="progress rounded-pill"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-main-600"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex-between mb-8">
                      <span className="fw-medium">Malware Analysis</span>
                      <span className="text-main-600 fw-bold">45%</span>
                    </div>
                    <div
                      className="progress rounded-pill"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-main-600"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Time */}
              {/* <div className="card mb-24">
                <div className="card-header bg-white border-bottom border-gray-100 p-20">
                  <h4 className="mb-0">Learning Time</h4>
                </div>
                <div className="card-body p-24">
                  <div className="text-center mb-24">
                    <h3 className="display-6 fw-bold">6h 32m</h3>
                    <p className="text-gray-500">Total learning time</p>
                  </div>

                  <div className="row g-16">
                    <div className="col-6">
                      <div className="p-16 bg-light rounded-12 text-center">
                        <h5 className="text-main-600 fw-bold mb-4">4h 12m</h5>
                        <p className="text-gray-500 mb-0 fs-14">This week</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-16 bg-light rounded-12 text-center">
                        <h5 className="text-main-600 fw-bold mb-4">2h 20m</h5>
                        <p className="text-gray-500 mb-0 fs-14">Last week</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Quiz Performance - Enhanced */}
              <div className="card">
                <div className="card-header bg-white border-bottom border-gray-100 p-20">
                  <div className="d-flex align-items-center gap-12">
                    <div className="quiz-icon rounded-12 bg-success-50 d-flex align-items-center justify-content-center p-8">
                      <i className="ph ph-chart-pie fs-20 text-success-600"></i>
                    </div>
                    <h4 className="mb-0">Quiz Performance</h4>
                  </div>
                </div>
                <div className="card-body p-24">
                  {/* <div className="text-center mb-24">
                    <div
                      className="position-relative d-inline-block"
                      style={{ width: "140px", height: "140px" }}
                    >
                      <svg
                        viewBox="0 0 36 36"
                        className="circular-progress w-100 h-100"
                      >
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#28a745"
                          strokeWidth="3"
                          strokeDasharray="50, 100"
                        />
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h2 className="mb-0 fw-bold">50%</h2>
                        <p className="mb-0 text-gray-500 fs-14">Avg. Score</p>
                      </div>
                    </div>
                  </div> */}

                  <div className="row g-16 mb-20">
                    <div className="col-6">
                      <div className="p-16 bg-light rounded-12 text-center">
                        <div className="d-flex align-items-center justify-content-center mb-8">
                          <i className="ph ph-check-circle text-success-600 me-4"></i>
                          <h5 className="text-success-600 fw-bold mb-0">{complete}</h5>
                        </div>
                        <p className="text-gray-500 mb-0 fs-14">Completed</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-16 bg-light rounded-12 text-center">
                        <div className="d-flex align-items-center justify-content-center mb-8">
                          <i className="ph ph-hourglass text-warning-600 me-4"></i>
                          <h5 className="text-warning-600 fw-bold mb-0">{quizzes.length}</h5>
                        </div>
                        <p className="text-gray-500 mb-0 fs-14">Total Quizzes</p>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-light border-0 mb-20">
                    <div className="card-body p-16">
                      <h6 className="mb-12">Performance by Topic</h6>

                      <div className="mb-12">
                        <div className="d-flex justify-content-between mb-8">
                          <span className="fs-14 text-gray-600">
                            Phishing Prevention
                          </span>
                          <span className="badge bg-success-100 text-success-600 py-4 px-8 rounded-pill">
                            92%
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "6px" }}
                        >
                          <div
                            className="progress-bar bg-success-600"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-12">
                        <div className="d-flex justify-content-between mb-8">
                          <span className="fs-14 text-gray-600">
                            Network Security
                          </span>
                          <span className="badge bg-info-100 text-info-600 py-4 px-8 rounded-pill">
                            75%
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "6px" }}
                        >
                          <div
                            className="progress-bar bg-info-600"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between mb-8">
                          <span className="fs-14 text-gray-600">
                            Malware Analysis
                          </span>
                          <span className="badge bg-warning-100 text-warning-600 py-4 px-8 rounded-pill">
                            45%
                          </span>
                        </div>
                        <div
                          className="progress rounded-pill"
                          style={{ height: "6px" }}
                        >
                          <div
                            className="progress-bar bg-warning-600"
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mb-12">
                    <div className="d-flex align-items-center gap-8">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-success-100"
                        style={{ width: "28px", height: "28px" }}
                      >
                        <i className="ph ph-medal text-success-600 fs-14"></i>
                      </div>
                      <span className="fw-medium">Highest Score</span>
                    </div>
                    <div className="fw-bold">95%</div>
                  </div>

                  <div className="text-center mt-20">
                    <Link
                      to="/quizzes"
                      className="btn btn-outline-main w-100 rounded-pill py-12"
                    >
                      <i className="ph ph-chart-bar me-8"></i>
                      View Detailed Analytics
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
