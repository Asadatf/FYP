import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ImprovedQuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
  // Fetch quiz metadata from the server
  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching quiz info for ID:", quizId);
        const response = await fetch(`http://localhost:5500/api/quiz/getquiz/${quizId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch quiz information');
        }
        
        console.log("Received quiz info:", data);
        
        // Store quiz metadata 
        if (data && data.quiz) {
          setQuizInfo(data.quiz);
          setTimeRemaining((data.quiz.time_estimate || 10) * 60); // Default to 10 minutes if not specified
        } else {
          throw new Error('Invalid quiz data format received');
        }
        
      } catch (err) {
        console.error("Error fetching quiz info:", err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchQuizInfo();
    } else {
      setError('No quiz ID provided');
      setLoading(false);
    }
  }, [quizId]);
  
  // Timer effect - only start when in actual quiz
  useEffect(() => {
    let timer = null;
    
    if (!loading && !showIntro && !quizSubmitted && timeRemaining > 0 && quiz) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, showIntro, quizSubmitted, timeRemaining, quiz]);
  
  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number') return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Start the quiz by fetching questions
  const handleStartQuiz = async () => {
    if (!quizInfo) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting quiz, fetching questions for:", quizInfo.title);
      
      // Sample questions for testing (remove in production)
      
      
      // In a real app, uncomment this code to fetch from API
      
      const response = await fetch('http://localhost:5500/api/quiz/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: quizInfo.title,
          difficulty: quizInfo.difficulty,
          numberOfQuestions: quizInfo.questions
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz questions');
      }
      
      
      // For testing/debugging, use dummy data
     
      
      console.log("Received quiz questions:", data);
      
      if (data && data.quiz && Array.isArray(data.quiz.questions) && data.quiz.questions.length > 0) {
        setQuiz(data.quiz);
        setShowIntro(false);
      } else {
        throw new Error('Invalid quiz questions format received');
      }
      
    } catch (err) {
      console.error("Error starting quiz:", err);
      setError(err.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };
  
  // Question navigation
  const handleNextQuestion = () => {
    if (!quiz || !Array.isArray(quiz.questions)) return;
    
    setShowExplanation(false);
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  
  
  // Answer and flag management
  const handleAnswerSelection = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };
  
  const toggleFlaggedQuestion = (index) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(index)) {
        return prev.filter(q => q !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Quiz submission and review
  const handleSubmitQuiz = () => {
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      setError('Cannot submit quiz: No questions available');
      return;
    }
    
    // Calculate results
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passingScore = quizInfo?.passing_score || 70;
    
    setQuizResult({
      totalQuestions: quiz.questions.length,
      correctAnswers,
      percentage,
      grade: percentage >= 90 ? 'Excellent' : 
             percentage >= 80 ? 'Very Good' : 
             percentage >= 70 ? 'Good' : 
             percentage >= 60 ? 'Satisfactory' : 
             'Needs Improvement',
      passed: percentage >= passingScore
    
    });
    setQuizSubmitted(true);
  };
  
  const handleReviewQuiz = () => {
    setCurrentQuestionIndex(0);
  };
  
  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setFlaggedQuestions([]);
    setTimeRemaining((quizInfo?.time_estimate || 10) * 60);
  };
  
  const handleReturnToDashboard = () => {
    navigate('/');
  };

  const SaveQuizScore = async () => {
    setIsButtonDisabled(true);
    const token = localStorage.getItem("token");
  
    // Verify token
    const response = await fetch('http://localhost:5500/api/auth/verifyToken', {
      method: 'POST',
      headers: {
        'auth': `${token}`,
      },
    });
  
    const data = await response.json();
  
    if (response.ok) {
      console.log(data.user.user_id);
      console.log("ssssss");
      console.log(quizInfo.id);
      console.log(quizResult.percentage);
  
      // Save quiz score
      const res = await fetch(`http://localhost:5500/api/quiz/savequiz?quizId=${quizInfo.id}&userId=${data.user.user_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure content type is set to JSON
        },
        body: JSON.stringify({ // Make sure body is stringified JSON
          score: quizResult.percentage,
          passed: true,
        }),
      });
  
      // You can handle the response if needed, e.g., checking if the quiz score was saved successfully
      const result = await res.json();
      console.log(result);
      window.location.href = '/dashboard';
    } else {
      console.error("Failed to verify token");
    }
  };
  
  
  // ======== RENDER FUNCTIONS ========
  
  // Loading state
  if (loading) {
    return (
      <div className="quiz-attempt-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <div className="spinner-border text-main-600 mb-16" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mb-0 text-gray-600">Loading quiz...</h5>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="quiz-attempt-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <div className="bg-danger-100 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16" style={{ width: '80px', height: '80px' }}>
            <i className="ph ph-x-circle fs-48 text-danger-600"></i>
          </div>
          <h4 className="mb-8 text-danger-600">Error Loading Quiz</h4>
          <p className="mb-16 text-gray-600">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline-primary rounded-pill px-24 py-12">
            <i className="ph ph-arrow-left me-8"></i>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Missing quiz info
  if (!quizInfo) {
    return (
      <div className="quiz-attempt-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <div className="bg-warning-100 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16" style={{ width: '80px', height: '80px' }}>
            <i className="ph ph-warning fs-48 text-warning-600"></i>
          </div>
          <h4 className="mb-8 text-warning-600">Quiz Information Missing</h4>
          <p className="mb-16 text-gray-600">Unable to load quiz information.</p>
          <button onClick={() => navigate('/')} className="btn btn-outline-primary rounded-pill px-24 py-12">
            <i className="ph ph-arrow-left me-8"></i>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Quiz intro screen
  if (showIntro) {
    const difficultyLevel = quizInfo.difficulty?.toLowerCase() || 'intermediate';
    const difficultyColor = difficultyLevel === 'beginner' || difficultyLevel === 'easy' ? 'success' : 
                            difficultyLevel === 'intermediate' ? 'warning' : 'danger';

    return (
      <div className="quiz-intro-wrapper py-48">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  {/* Quiz Header Banner */}
                  <div className={`bg-${difficultyColor}-600 text-white p-32 rounded-top-4`}>
                    <div className="d-flex justify-content-between align-items-center mb-16">
                      <div className={`badge bg-white text-${difficultyColor}-600 px-12 py-8 rounded-pill`}>
                        {quizInfo.difficulty ? 
                          (quizInfo.difficulty.charAt(0).toUpperCase() + quizInfo.difficulty.slice(1)) : 
                          'Intermediate'}
                      </div>
                      <div className={`badge bg-white text-${difficultyColor}-600 px-12 py-8 rounded-pill`}>
                        {quizInfo.tags || quizInfo.title || 'Quiz'}
                      </div>
                    </div>
                    <h2 className="mb-12">{quizInfo.title || 'Quiz'}</h2>
                    <p className="mb-0 opacity-80">{quizInfo.description || 'Test your knowledge with this quiz.'}</p>
                  </div>
                  
                  {/* Quiz Info */}
                  <div className="p-32">
                    <div className="row g-24 mb-32">
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i className={`ph ph-question-mark fs-32 text-${difficultyColor}-600`}></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>{quizInfo.questions || 5}</h4>
                          <p className="mb-0 text-gray-600">Questions</p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i className={`ph ph-clock fs-32 text-${difficultyColor}-600`}></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>{quizInfo.time_estimate || 10} min</h4>
                          <p className="mb-0 text-gray-600">Time Limit</p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i className={`ph ph-chart-bar fs-32 text-${difficultyColor}-600`}></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>{quizInfo.passing_score || 70}%</h4>
                          <p className="mb-0 text-gray-600">Passing Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-warning-50 border border-warning-100 rounded-4 p-16 mb-32">
                      <div className="d-flex gap-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-info fs-24 text-warning-600"></i>
                        </div>
                        <div>
                          <h5 className="mb-8">Important Instructions</h5>
                          <ul className="mb-0">
                            <li className="mb-8">Once you start the quiz, the timer will begin and cannot be paused.</li>
                            <li className="mb-8">You can navigate between questions using the Previous and Next buttons.</li>
                            <li className="mb-8">You can flag questions to review later.</li>
                            <li className="mb-0">Once you submit the quiz, you cannot change your answers.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-sm-row gap-16 justify-content-center">
                      <button onClick={handleReturnToDashboard} className={`btn btn-${difficultyColor} rounded-pill px-32 py-12`}>
                        <i className="ph ph-arrow-left me-8"></i>
                        Return to Dashboard
                      </button>
                      <button onClick={handleStartQuiz} className={`btn btn-${difficultyColor} rounded-pill px-32 py-12`}>
                        Start Quiz
                        <i className="ph ph-play ms-8"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check for quiz data after starting
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    return (
      <div className="quiz-attempt-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <div className="bg-warning-100 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16" style={{ width: '80px', height: '80px' }}>
            <i className="ph ph-warning fs-48 text-warning-600"></i>
          </div>
          <h4 className="mb-8 text-warning-600">Quiz Questions Missing</h4>
          <p className="mb-16 text-gray-600">Unable to load quiz questions. Please try again.</p>
          <button onClick={() => navigate('/')} className="btn btn-outline-primary rounded-pill px-24 py-12">
            <i className="ph ph-arrow-left me-8"></i>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Quiz result display
  if (quizSubmitted) {
    const resultColor = quizResult?.percentage >= 90 ? 'success' : 
                        quizResult?.percentage >= 70 ? 'primary' : 
                        quizResult?.percentage >= 60 ? 'warning' : 'danger';
                        console.log("ye rha uska result");
                        console.log(quizResult);
                        
    
    return (
      <div className="quiz-result-wrapper py-48">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  {/* Results Header */}
                  <div className={`bg-${resultColor}-600 text-white p-32 rounded-top-4 text-center`}>
                    <div className="mb-16">
                      {quizResult?.passed ? (
                        <div className="d-inline-block bg-white rounded-circle p-16 mb-16">
                          <i className="ph ph-check-circle fs-48 text-success-600"></i>
                        </div>
                      ) : (
                        <div className="d-inline-block bg-white rounded-circle p-16 mb-16">
                          <i className="ph ph-x-circle fs-48 text-danger-600"></i>
                        </div>
                      )}
                    </div>
                    <h2 className="mb-8">{quizResult?.passed ? 'Quiz Passed!' : 'Quiz Failed'}</h2>
                    <p className="mb-0 opacity-80">
                      {quizResult?.passed 
                        ? 'Great job! You\'ve successfully completed the quiz.' 
                        : 'Don\'t worry! You can review your answers and try again.'}
                    </p>
                  </div>
                  
                  {/* Results Content */}
                  <div className="p-32">
                    <div className="text-center mb-32">
                      <div className="position-relative d-inline-block mb-16" style={{ width: '160px', height: '160px' }}>
                        <svg viewBox="0 0 36 36" className="circular-progress w-100 h-100">
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
                            stroke={quizResult?.passed ? '#28a745' : '#dc3545'}
                            strokeWidth="3"
                            strokeDasharray={`${quizResult?.percentage || 0}, 100`}
                          />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <h1 className={`mb-0 fw-bold text-${resultColor}-600`}>{quizResult?.percentage || 0}%</h1>
                        </div>
                      </div>
                      <h4 className="text-gray-800">{quizResult?.grade || 'Completed'}</h4>
                    </div>
                    
                    <div className="row g-24 mb-32">
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-light">
                          <h3 className="text-gray-800 mb-4">{quiz?.questions?.length || 0}</h3>
                          <p className="text-gray-600 mb-0">Total Questions</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-success-50">
                          <h3 className="text-success-600 mb-4">{quizResult?.correctAnswers || 0}</h3>
                          <p className="text-gray-600 mb-0">Correct Answers</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-danger-50">
                          <h3 className="text-danger-600 mb-4">
                            {quiz?.questions?.length ? (quiz.questions.length - (quizResult?.correctAnswers || 0)) : 0}
                          </h3>
                          <p className="text-gray-600 mb-0">Incorrect Answers</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-md-row gap-16 justify-content-center">
                      <button 
                        className="btn btn-outline-secondary rounded-pill px-24 py-12"
                        onClick={handleReviewQuiz}
                      >
                        <i className="ph ph-list-checks me-8"></i>
                        Review Answers
                      </button>
                      {quizResult?.passed ? (
                        <div>
                        <button 
                          className="btn btn-main rounded-pill px-24 py-12"
                          onClick={handleReturnToDashboard}
                        >
                          <i className="ph ph-arrow-right me-8"></i>
                          Back to Dashboard
                        </button>
                        <button 
                          className="btn btn-main rounded-pill px-24 py-12"
                          onClick={SaveQuizScore} disabled={isButtonDisabled}
                        >
                          <i className="ph ph-arrow-right me-8"></i>
                          Save Score
                        </button>

                        </div>
                      ) : (
                        <button 
                          className="btn btn-danger rounded-pill px-24 py-12"
                          onClick={handleRetryQuiz}
                        >
                          <i className="ph ph-arrows-clockwise me-8"></i>
                          Try Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Ensure we have a valid current question
  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="quiz-attempt-wrapper d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center">
          <div className="bg-warning-100 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16" style={{ width: '80px', height: '80px' }}>
            <i className="ph ph-warning fs-48 text-warning-600"></i>
          </div>
          <h4 className="mb-8 text-warning-600">Question Not Found</h4>
          <p className="mb-16 text-gray-600">The current question cannot be displayed.</p>
          <button onClick={handleReturnToDashboard} className="btn btn-outline-primary rounded-pill px-24 py-12">
            <i className="ph ph-arrow-left me-8"></i>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Main quiz interface
  return (
    <div className="quiz-attempt-wrapper py-32">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Quiz Header */}
            <div className="card border-0 shadow-sm mb-24">
              <div className="card-body p-0">
                <div className="d-flex flex-column flex-md-row">
                  <div className="p-24 bg-main-50 d-flex flex-column justify-content-center" style={{ minWidth: '280px' }}>
                    <h5 className="text-main-800 mb-8">{quiz.title || 'Quiz'}</h5>
                    <div className="d-flex align-items-center gap-12 mb-16">
                      <span className="badge bg-main-100 text-main-600 py-6 px-12 rounded-pill">
                        {quiz.difficulty ? 
                          (quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)) : 
                          'Quiz'}
                      </span>
                      <span className="badge bg-main-100 text-main-600 py-6 px-12 rounded-pill">
                        {quiz.tags || quiz.title || 'Quiz'}
                      </span>
                    </div>
                    <div className="progress rounded-pill mb-12" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-main-600" 
                        role="progressbar" 
                        style={{ width: `${((currentQuestionIndex + 1) / (quiz.questions?.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fs-14 text-gray-600">
                        Question {currentQuestionIndex + 1} of {quiz.questions?.length || 0}
                      </span>
                      <span className="fs-14 text-gray-600">
                        {((currentQuestionIndex + 1) / (quiz.questions?.length || 1) * 100).toFixed(0)}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="p-24 d-flex align-items-center flex-grow-1 justify-content-between">
                    <div className="d-flex gap-24 align-items-center">
                      <div className="d-flex align-items-center gap-12">
                        <div className="quiz-stat-icon rounded-circle bg-success-50 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="ph ph-check-circle text-success-600"></i>
                        </div>
                        <div>
                          <p className="mb-0 fs-14 text-gray-600">Answered</p>
                          <h5 className="mb-0 text-success-600">
                            {Object.keys(selectedAnswers).length}/{quiz.questions?.length || 0}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div className="quiz-stat-icon rounded-circle bg-warning-50 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="ph ph-flag text-warning-600"></i>
                        </div>
                        <div>
                          <p className="mb-0 fs-14 text-gray-600">Flagged</p>
                          <h5 className="mb-0 text-warning-600">{flaggedQuestions.length}/{quiz.questions?.length || 0}</h5>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`quiz-timer d-flex align-items-center gap-12 ${
                      timeRemaining < 60 ? 'text-danger-600' : 
                      timeRemaining < 180 ? 'text-warning-600' : 
                      'text-main-600'
                    }`}>
                      <i className="ph ph-clock fs-24"></i>
                      <div className="text-center">
                        <p className="mb-0 fs-14">Time Remaining</p>
                        <h4 className="mb-0">{formatTime(timeRemaining)}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              {/* Main Question Area */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm mb-24">
                  <div className="card-body p-32">
                    <div className="d-flex justify-content-between align-items-center mb-24">
                      <h4 className="mb-0">Question {currentQuestionIndex + 1}</h4>
                      <button 
                        className={`btn btn-warning ${flaggedQuestions.includes(currentQuestionIndex) ? 'btn-warning' : 'btn-outline-warning'} rounded-pill`}
                        onClick={() => toggleFlaggedQuestion(currentQuestionIndex)}
                      >
                        <i className="ph ph-flag me-8"></i>
                        {flaggedQuestions.includes(currentQuestionIndex) ? 'Flagged' : 'Flag for Review'}
                      </button>
                    </div>
                    
                    <div className="question-container p-24 border border-gray-200 rounded-4 bg-light bg-opacity-50 mb-32">
                      <h5 className="mb-24">{currentQuestion.question}</h5>
                      
                      <div className="options-container">
                        {Array.isArray(currentQuestion.options) ? (
                          currentQuestion.options.map((option, index) => (
                            <div 
                              key={index} 
                              className={`option-item mb-16 p-20 border rounded-4 d-flex align-items-center gap-16 cursor-pointer transition-all ${
                                selectedAnswers[currentQuestionIndex] === index 
                                  ? 'border-main-600 bg-main-50' 
                                  : 'border-gray-200 hover-border-main-200 hover-bg-gray-50'
                              }`}
                              onClick={() => handleAnswerSelection(currentQuestionIndex, index)}
                            >
                              <div className={`option-indicator rounded-circle d-flex align-items-center justify-content-center ${
                                selectedAnswers[currentQuestionIndex] === index 
                                  ? 'bg-main-600 text-white' 
                                  : 'bg-white border border-gray-200'
                              }`} style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                {selectedAnswers[currentQuestionIndex] === index ? (
                                  <i className="ph ph-check fs-16"></i>
                                ) : (
                                  <span className="fw-medium">{String.fromCharCode(65 + index)}</span>
                                )}
                              </div>
                              <div className="option-text fw-medium">{option}</div>
                            </div>
                          ))
                        ) : (
                          <div className="alert alert-danger">
                            <i className="ph ph-warning me-2"></i>
                            Options for this question are not available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {quizSubmitted && showExplanation && currentQuestion.explanation && (
                      <div className="explanation-container p-24 border border-info-200 rounded-4 bg-info-50 mb-32">
                        <div className="d-flex gap-16">
                          <div className="flex-shrink-0">
                            <div className="bg-info-100 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="ph ph-info fs-20 text-info-600"></i>
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-8">Explanation</h5>
                            <p className="mb-0">{currentQuestion.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {quizSubmitted && !showExplanation && currentQuestion.explanation && (
                          <button 
                            className="btn btn-outline-info rounded-pill"
                            onClick={() => setShowExplanation(true)}
                          >
                            <i className="ph ph-info me-8"></i>
                            Show Explanation
                          </button>
                        )}
                      </div>
                      
                      <div className="d-flex gap-16">
                        <button 
                          className="btn btn-main rounded-pill px-20 py-10"
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          <i className="ph ph-arrow-left me-8"></i>
                          Previous
                        </button>
                        
                        {currentQuestionIndex < (quiz.questions?.length || 0) - 1 ? (
                          <button 
                            className="btn btn-main rounded-pill px-20 py-10"
                            onClick={handleNextQuestion}
                          >
                            Next
                            <i className="ph ph-arrow-right ms-8"></i>
                          </button>
                        ) : (
                          <button 
                            className="btn btn-success rounded-pill px-20 py-10"
                            onClick={handleSubmitQuiz}
                          >
                            Submit Quiz
                            <i className="ph ph-check-circle ms-8"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Question Navigator */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm mb-24 sticky-top" style={{ top: '20px', zIndex: 100 }}>
                  <div className="card-header bg-white p-20 border-bottom border-gray-100">
                    <h5 className="mb-0">Question Navigator</h5>
                  </div>
                  <div className="card-body p-24">
                    <div className="d-grid grid-questions gap-12" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                      {quiz.questions.map((_, index) => {
                        let btnClass = 'btn-light text-gray-600 border border-gray-200';
                        
                        if (currentQuestionIndex === index) {
                          btnClass = 'btn-main text-white';
                        } else if (flaggedQuestions.includes(index)) {
                          btnClass = 'btn-warning text-white';
                        } else if (selectedAnswers[index] !== undefined) {
                          btnClass = 'btn-success text-white';
                        }
                        
                        return (
                          <button
                            key={index}
                            className={`btn ${btnClass}  rounded-4 d-flex align-items-center justify-content-center py-10`}
                            onClick={() => setCurrentQuestionIndex(index)}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="d-flex flex-column gap-12 mt-24">
                      <div className="d-flex align-items-center gap-12">
                        <div className="bg-main-600 rounded-4" style={{ width: '16px', height: '16px' }}></div>
                        <span className="fs-14 text-gray-600">Current Question</span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div className="bg-success-600 rounded-4" style={{ width: '16px', height: '16px' }}></div>
                        <span className="fs-14 text-gray-600">Answered</span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div className="bg-warning-600 rounded-4" style={{ width: '16px', height: '16px' }}></div>
                        <span className="fs-14 text-gray-600">Flagged for Review</span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div className="bg-light border border-gray-200 rounded-4" style={{ width: '16px', height: '16px' }}></div>
                        <span className="fs-14 text-gray-600">Unanswered</span>
                      </div>
                    </div>
                    
                    <div className="mt-24">
                      <div className="alert alert-warning d-flex gap-12 mb-16">
                        <i className="ph ph-warning fs-20"></i>
                        <div>
                          You have {(quiz.questions?.length || 0) - Object.keys(selectedAnswers).length} unanswered questions.
                        </div>
                      </div>
                      
                      <button 
                        className="btn btn-success w-100 rounded-pill py-12"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(selectedAnswers).length === 0}
                      >
                        <i className="ph ph-check-circle me-8"></i>
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Quiz Tips */}
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white p-20 border-bottom border-gray-100">
                    <h5 className="mb-0">Quiz Tips</h5>
                  </div>
                  <div className="card-body p-24">
                    <ul className="quiz-tips-list mb-0">
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-timer text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">Manage your time wisely. Don't spend too long on any single question.</p>
                      </li>
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-flag text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">Flag difficult questions and return to them later.</p>
                      </li>
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-check-square text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">Read each question carefully before selecting an answer.</p>
                      </li>
                      <li className="d-flex gap-12">
                        <div className="flex-shrink-0">
                          <i className="ph ph-lightbulb text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">If you're unsure, try to eliminate obviously incorrect options first.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedQuizAttempt;