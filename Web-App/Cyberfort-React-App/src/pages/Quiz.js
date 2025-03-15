// src/pages/Quiz.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizData from "../data/quizData";

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [showIncorrectAnswersModal, setShowIncorrectAnswersModal] =
    useState(false);

  // Reference to question navigator for proper scrolling behavior
  const questionNavigatorRef = useRef(null);

  // Load quiz data
  useEffect(() => {
    setLoading(true);

    // Simulate API loading with a small delay
    setTimeout(() => {
      const id = parseInt(quizId);
      if (quizData[id]) {
        // Ensure every question has hint and explanation properties even if empty
        const processedQuizData = {
          ...quizData[id],
          questions: quizData[id].questions.map((question) => ({
            ...question,
            hint: question.hint || "No hint available for this question.",
            explanation:
              question.explanation ||
              "No explanation available for this question.",
          })),
        };

        setQuiz(processedQuizData);
        setTimeRemaining(quizData[id].timeLimit * 60); // Convert to seconds
      } else {
        // Handle case where quiz doesn't exist
        console.error(`Quiz with ID ${id} not found`);
        navigate("/dashboard"); // Redirect to dashboard if quiz not found
      }
      setLoading(false);
    }, 800);
  }, [quizId, navigate]);

  // Timer effect
  useEffect(() => {
    if (!loading && !showIntro && !quizSubmitted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, showIntro, quizSubmitted, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleAnswerSelection = (questionIndex, optionIndex) => {
    // Update selected answer without giving feedback
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  // Add some basic styles to ensure hint button is always visible
  const hintButtonStyle = {
    opacity: 1,
    visibility: "visible",
    display: "block",
    marginBottom: "20px",
    width: "100%",
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleFlaggedQuestion = (index) => {
    if (flaggedQuestions.includes(index)) {
      setFlaggedQuestions(flaggedQuestions.filter((q) => q !== index));
    } else {
      setFlaggedQuestions([...flaggedQuestions, index]);
    }
  };

  const handleStartQuiz = () => {
    setShowIntro(false);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const toggleWrongAnswers = () => {
    setShowWrongAnswers(!showWrongAnswers);
  };

  const showIncorrectModal = () => {
    setShowIncorrectAnswersModal(true);
  };

  const hideIncorrectModal = () => {
    setShowIncorrectAnswersModal(false);
  };

  const handleSubmitQuiz = () => {
    // Calculate results
    let correctAnswers = 0;
    const wrongAnswers = [];
    const notAnsweredQuestions = [];

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      } else {
        // Track questions that were answered incorrectly
        if (selectedAnswers[index] !== undefined) {
          wrongAnswers.push({
            questionIndex: index,
            question: question.question,
            userAnswer: selectedAnswers[index],
            correctAnswer: question.correctAnswer,
            options: question.options,
            explanation: question.explanation,
          });
        } else {
          // Track questions that were not answered
          notAnsweredQuestions.push({
            questionIndex: index,
            question: question.question,
            correctAnswer: question.correctAnswer,
            options: question.options,
            explanation: question.explanation,
          });
        }
      }
    });

    const percentage = Math.round(
      (correctAnswers / quiz.questions.length) * 100
    );

    setQuizResult({
      totalQuestions: quiz.questions.length,
      correctAnswers,
      percentage,
      grade:
        percentage >= 90
          ? "Excellent"
          : percentage >= 80
          ? "Very Good"
          : percentage >= 70
          ? "Good"
          : percentage >= 60
          ? "Satisfactory"
          : "Needs Improvement",
      passed: percentage >= quiz.passingScore,
    });

    // Combine incorrect and unanswered questions
    setIncorrectAnswers([...wrongAnswers, ...notAnsweredQuestions]);
    setQuizSubmitted(true);

    // If there are incorrect or unanswered questions, automatically show them
    if (wrongAnswers.length > 0 || notAnsweredQuestions.length > 0) {
      setShowWrongAnswers(true);
    }
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setFlaggedQuestions([]);
    setShowWrongAnswers(false);
    setTimeRemaining(quiz.timeLimit * 60);
  };

  const goToIncorrectQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setQuizSubmitted(false);
    setShowHint(true); // Automatically show hint for incorrect questions
    hideIncorrectModal();
  };

  if (loading || !quiz) {
    return (
      <div
        className="quiz-attempt-wrapper d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-main-600 mb-16"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mb-0 text-gray-600">Loading quiz...</h5>
        </div>
      </div>
    );
  }

  // Quiz intro screen
  if (showIntro) {
    const difficultyColor =
      quiz.difficulty === "Beginner"
        ? "success"
        : quiz.difficulty === "Intermediate"
        ? "warning"
        : "danger";

    return (
      <div className="quiz-intro-wrapper py-48">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  {/* Quiz Header Banner */}
                  <div
                    className={`bg-${difficultyColor}-600 text-white p-32 rounded-top-4`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-16">
                      <div
                        className={`badge bg-white text-${difficultyColor}-600 px-12 py-8 rounded-pill`}
                      >
                        {quiz.category}
                      </div>
                      <div
                        className={`badge bg-white text-${difficultyColor}-600 px-12 py-8 rounded-pill`}
                      >
                        {quiz.difficulty}
                      </div>
                    </div>
                    <h2 className="mb-12">{quiz.title}</h2>
                    <p className="mb-0 opacity-80">{quiz.description}</p>
                  </div>

                  {/* Quiz Info */}
                  <div className="p-32">
                    <div className="row g-24 mb-32">
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i
                              className={`ph ph-question-mark fs-32 text-${difficultyColor}-600`}
                            ></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>
                            {quiz.totalQuestions}
                          </h4>
                          <p className="mb-0 text-gray-600">Questions</p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i
                              className={`ph ph-clock fs-32 text-${difficultyColor}-600`}
                            ></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>
                            {quiz.timeLimit} min
                          </h4>
                          <p className="mb-0 text-gray-600">Time Limit</p>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-center p-16 bg-light rounded-4">
                          <div className="mb-8">
                            <i
                              className={`ph ph-chart-bar fs-32 text-${difficultyColor}-600`}
                            ></i>
                          </div>
                          <h4 className={`mb-4 text-${difficultyColor}-600`}>
                            {quiz.passingScore}%
                          </h4>
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
                            <li className="mb-8">
                              Once you start the quiz, the timer will begin and
                              cannot be paused.
                            </li>
                            <li className="mb-8">
                              You can navigate between questions using the
                              Previous and Next buttons.
                            </li>
                            <li className="mb-8">
                              <strong>
                                Use hints at any time to help with difficult
                                questions.
                              </strong>
                            </li>
                            <li className="mb-8">
                              You can flag questions to review later.
                            </li>
                            <li className="mb-0">
                              <strong>
                                After completing the quiz, you can view all
                                incorrect answers with explanations.
                              </strong>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-16 justify-content-center">
                      <button
                        onClick={handleReturnToDashboard}
                        className={`btn btn-${difficultyColor} rounded-pill px-32 py-12`}
                      >
                        <i className="ph ph-arrow-left me-8"></i>
                        Return to Dashboard
                      </button>
                      <button
                        onClick={handleStartQuiz}
                        className={`btn btn-${difficultyColor} rounded-pill px-32 py-12`}
                      >
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

  // Quiz result display
  if (quizSubmitted) {
    const resultColor =
      quizResult.percentage >= 90
        ? "success"
        : quizResult.percentage >= 70
        ? "primary"
        : quizResult.percentage >= 60
        ? "warning"
        : "danger";

    return (
      <div className="quiz-result-wrapper py-48">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  {/* Results Header */}
                  <div
                    className={`bg-${resultColor}-600 text-white p-32 rounded-top-4 text-center`}
                  >
                    <div className="mb-16">
                      {quizResult.passed ? (
                        <div className="d-inline-block bg-white rounded-circle p-16 mb-16">
                          <i className="ph ph-check-circle fs-48 text-success-600"></i>
                        </div>
                      ) : (
                        <div className="d-inline-block bg-white rounded-circle p-16 mb-16">
                          <i className="ph ph-x-circle fs-48 text-danger-600"></i>
                        </div>
                      )}
                    </div>
                    <h2 className="mb-8">
                      {quizResult.passed ? "Quiz Passed!" : "Quiz Failed"}
                    </h2>
                    <p className="mb-0 opacity-80">
                      {quizResult.passed
                        ? "Great job! You've successfully completed the quiz."
                        : "Don't worry! You can review your answers and try again."}
                    </p>
                  </div>

                  {/* Results Content */}
                  <div className="p-32">
                    <div className="text-center mb-32">
                      <div
                        className="position-relative d-inline-block mb-16"
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
                            stroke={quizResult.passed ? "#28a745" : "#dc3545"}
                            strokeWidth="3"
                            strokeDasharray={`${quizResult.percentage}, 100`}
                          />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <h1
                            className={`mb-0 fw-bold text-${resultColor}-600`}
                          >
                            {quizResult.percentage}%
                          </h1>
                        </div>
                      </div>
                      <h4 className="text-gray-800">{quizResult.grade}</h4>
                    </div>

                    <div className="row g-24 mb-32">
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-light">
                          <h3 className="text-gray-800 mb-4">
                            {quiz.questions.length}
                          </h3>
                          <p className="text-gray-600 mb-0">Total Questions</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-success-50">
                          <h3 className="text-success-600 mb-4">
                            {quizResult.correctAnswers}
                          </h3>
                          <p className="text-gray-600 mb-0">Correct Answers</p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="p-16 rounded-4 text-center bg-danger-50">
                          <h3 className="text-danger-600 mb-4">
                            {quiz.questions.length - quizResult.correctAnswers}
                          </h3>
                          <p className="text-gray-600 mb-0">
                            Incorrect Answers
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Display Incorrect Answers Section */}
                    {incorrectAnswers.length > 0 && (
                      <div className="mb-32">
                        <button
                          className="btn btn-danger w-100 d-flex justify-content-between align-items-center rounded-pill py-12 mb-16"
                          onClick={toggleWrongAnswers}
                        >
                          <span className="d-flex align-items-center">
                            <i className="ph ph-x-circle me-8 fs-18"></i>
                            Review Incorrect & Unanswered Questions (
                            {incorrectAnswers.length})
                          </span>
                          <i
                            className={`ph ${
                              showWrongAnswers ? "ph-caret-up" : "ph-caret-down"
                            }`}
                          ></i>
                        </button>

                        {showWrongAnswers && (
                          <div className="border border-danger-100 rounded-4 p-24 bg-danger-50">
                            <h5 className="mb-16">
                              Your Incorrect/Unanswered Questions
                            </h5>

                            <div className="incorrect-answers-list">
                              {incorrectAnswers.map((item, index) => (
                                <div
                                  className="mb-24 bg-white p-16 rounded-4 shadow-sm"
                                  key={index}
                                >
                                  <h6 className="mb-12 d-flex align-items-center">
                                    <span
                                      className="bg-danger-100 text-danger-600 rounded-circle d-flex align-items-center justify-content-center me-12"
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        minWidth: "28px",
                                      }}
                                    >
                                      {item.questionIndex + 1}
                                    </span>
                                    <span>{item.question}</span>
                                  </h6>

                                  {item.userAnswer !== undefined ? (
                                    <div className="mb-16">
                                      <p className="mb-8 fw-medium">
                                        Your answer:
                                      </p>
                                      <div className="p-12 bg-danger-50 border border-danger-100 rounded-4">
                                        {item.options[item.userAnswer]}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="mb-16">
                                      <p className="mb-8 fw-medium">
                                        Your answer:
                                      </p>
                                      <div className="p-12 bg-danger-50 border border-danger-100 rounded-4">
                                        <i>Question not answered</i>
                                      </div>
                                    </div>
                                  )}

                                  <div className="mb-16">
                                    <p className="mb-8 fw-medium">
                                      Correct answer:
                                    </p>
                                    <div className="p-12 bg-success-50 border border-success-100 rounded-4">
                                      {item.options[item.correctAnswer]}
                                    </div>
                                  </div>

                                  {item.explanation && (
                                    <div className="mb-16">
                                      <p className="mb-8 fw-medium">
                                        Explanation:
                                      </p>
                                      <div className="p-12 bg-info-50 border border-info-100 rounded-4">
                                        {item.explanation}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="d-flex flex-column flex-md-row gap-16 justify-content-center">
                      {quizResult.passed ? (
                        <button
                          className="btn btn-main rounded-pill px-24 py-12"
                          onClick={handleReturnToDashboard}
                        >
                          <i className="ph ph-arrow-right me-8"></i>
                          Back to Dashboard
                        </button>
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

  return (
    <div className="quiz-attempt-wrapper py-32">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Quiz Header */}
            <div className="card border-0 shadow-sm mb-24">
              <div className="card-body p-0">
                <div className="d-flex flex-column flex-md-row">
                  <div
                    className="p-24 bg-main-50 d-flex flex-column justify-content-center"
                    style={{ minWidth: "280px" }}
                  >
                    <h5 className="text-main-800 mb-8">{quiz.title}</h5>
                    <div className="d-flex align-items-center gap-12 mb-16">
                      <span className="badge bg-main-100 text-main-600 py-6 px-12 rounded-pill">
                        {quiz.category}
                      </span>
                      <span className="badge bg-main-100 text-main-600 py-6 px-12 rounded-pill">
                        {quiz.difficulty}
                      </span>
                    </div>
                    <div
                      className="progress rounded-pill mb-12"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-main-600"
                        role="progressbar"
                        style={{
                          width: `${
                            ((currentQuestionIndex + 1) /
                              quiz.questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="fs-14 text-gray-600">
                        Question {currentQuestionIndex + 1} of{" "}
                        {quiz.questions.length}
                      </span>
                      <span className="fs-14 text-gray-600">
                        {(
                          ((currentQuestionIndex + 1) / quiz.questions.length) *
                          100
                        ).toFixed(0)}
                        % Complete
                      </span>
                    </div>
                  </div>
                  <div className="p-24 d-flex align-items-center flex-grow-1 justify-content-between">
                    <div className="d-flex gap-24 align-items-center">
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="quiz-stat-icon rounded-circle bg-success-50 d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="ph ph-check-circle text-success-600"></i>
                        </div>
                        <div>
                          <p className="mb-0 fs-14 text-gray-600">Answered</p>
                          <h5 className="mb-0 text-success-600">
                            {Object.keys(selectedAnswers).length}/
                            {quiz.questions.length}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="quiz-stat-icon rounded-circle bg-warning-50 d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="ph ph-flag text-warning-600"></i>
                        </div>
                        <div>
                          <p className="mb-0 fs-14 text-gray-600">Flagged</p>
                          <h5 className="mb-0 text-warning-600">
                            {flaggedQuestions.length}/{quiz.questions.length}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`quiz-timer d-flex align-items-center gap-12 ${
                        timeRemaining < 60
                          ? "text-danger-600"
                          : timeRemaining < 180
                          ? "text-warning-600"
                          : "text-main-600"
                      }`}
                    >
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
                      <h4 className="mb-0">
                        Question {currentQuestionIndex + 1}
                      </h4>
                      <button
                        className={`btn btn-sm ${
                          flaggedQuestions.includes(currentQuestionIndex)
                            ? "btn-warning"
                            : "btn-outline-warning"
                        } rounded-pill`}
                        onClick={() =>
                          toggleFlaggedQuestion(currentQuestionIndex)
                        }
                      >
                        <i className="ph ph-flag me-8"></i>
                        {flaggedQuestions.includes(currentQuestionIndex)
                          ? "Flagged"
                          : "Flag for Review"}
                      </button>
                    </div>

                    <div className="question-container p-24 border border-gray-200 rounded-4 bg-light bg-opacity-50 mb-24">
                      <h5 className="mb-24">
                        {quiz.questions[currentQuestionIndex].question}
                      </h5>

                      <div className="options-container">
                        {quiz.questions[currentQuestionIndex].options.map(
                          (option, index) => (
                            <div
                              key={index}
                              className={`option-item mb-16 p-20 border rounded-4 d-flex align-items-center gap-16 cursor-pointer transition-all ${
                                selectedAnswers[currentQuestionIndex] === index
                                  ? "border-main-600 bg-main-50"
                                  : "border-gray-200 hover-border-main-200 hover-bg-gray-50"
                              }`}
                              onClick={() =>
                                handleAnswerSelection(
                                  currentQuestionIndex,
                                  index
                                )
                              }
                            >
                              <div
                                className={`option-indicator rounded-circle d-flex align-items-center justify-content-center ${
                                  selectedAnswers[currentQuestionIndex] ===
                                  index
                                    ? "bg-main-600 text-white"
                                    : "bg-white border border-gray-200"
                                }`}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  minWidth: "32px",
                                }}
                              >
                                {selectedAnswers[currentQuestionIndex] ===
                                index ? (
                                  <i className="ph ph-check fs-16"></i>
                                ) : (
                                  <span className="fw-medium">
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                )}
                              </div>
                              <div className="option-text fw-medium">
                                {option}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Hint button */}
                    <div style={hintButtonStyle}>
                      <button
                        className={`btn ${
                          showHint ? "btn-warning" : "btn-warning"
                        } rounded-pill w-100 py-12`}
                        onClick={toggleHint}
                        style={{
                          color: showHint ? "white" : "white",
                          fontWeight: "bold",
                        }}
                      >
                        <i
                          className={`ph ${
                            showHint ? "ph-x" : "ph-lightbulb"
                          } me-8`}
                        ></i>
                        {showHint ? "Hide Hint" : "Need a Hint? Click Here"}
                      </button>
                    </div>

                    {/* Hint Section */}
                    {showHint && quiz.questions[currentQuestionIndex].hint && (
                      <div className="hint-container p-24 border border-warning-200 rounded-4 bg-warning-50 mb-32">
                        <div className="d-flex gap-16">
                          <div className="flex-shrink-0">
                            <div
                              className="bg-warning-100 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i className="ph ph-lightbulb fs-20 text-warning-600"></i>
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-8">Hint</h5>
                            <p className="mb-0">
                              {quiz.questions[currentQuestionIndex].hint}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-8"></div>

                      <div className="d-flex gap-16">
                        <button
                          className="btn btn-main rounded-pill px-20 py-10"
                          onClick={handlePreviousQuestion}
                        >
                          Previous
                          <i className="ph ph-arrow-right ms-8"></i>
                        </button>

                        {currentQuestionIndex < quiz.questions.length - 1 ? (
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
                <div
                  className="card border-0 shadow-sm mb-24"
                  ref={questionNavigatorRef}
                  style={{ position: "relative" }}
                >
                  <div className="card-header bg-white p-20 border-bottom border-gray-100">
                    <h5 className="mb-0">Question Navigator</h5>
                  </div>
                  <div className="card-body p-24">
                    <div
                      className="d-grid grid-questions gap-12"
                      style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                    >
                      {quiz.questions.map((_, index) => {
                        let btnClass =
                          "btn-light text-gray-600 border border-gray-200";

                        if (currentQuestionIndex === index) {
                          btnClass = "btn-main text-white";
                        } else if (flaggedQuestions.includes(index)) {
                          btnClass = "btn-warning text-white";
                        } else if (selectedAnswers[index] !== undefined) {
                          btnClass = "btn-success text-white";
                        }

                        return (
                          <button
                            key={index}
                            className={`btn ${btnClass} rounded-4 d-flex align-items-center justify-content-center py-10`}
                            onClick={() => {
                              setCurrentQuestionIndex(index);
                              setShowHint(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="d-flex flex-column gap-12 mt-24">
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="bg-main-600 rounded-4"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="fs-14 text-gray-600">
                          Current Question
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="bg-success-600 rounded-4"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="fs-14 text-gray-600">Answered</span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="bg-warning-600 rounded-4"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="fs-14 text-gray-600">
                          Flagged for Review
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-12">
                        <div
                          className="bg-light border border-gray-200 rounded-4"
                          style={{ width: "16px", height: "16px" }}
                        ></div>
                        <span className="fs-14 text-gray-600">Unanswered</span>
                      </div>
                    </div>

                    <div className="mt-24">
                      <div className="alert alert-warning d-flex gap-12 mb-16">
                        <i className="ph ph-warning fs-20"></i>
                        <div>
                          You have{" "}
                          {quiz.questions.length -
                            Object.keys(selectedAnswers).length}{" "}
                          unanswered questions.
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

                {/* Quiz Tips - Positioned relative to avoid stacking issues */}
                <div
                  className="card border-0 shadow-sm"
                  style={{ position: "relative" }}
                >
                  <div className="card-header bg-white p-20 border-bottom border-gray-100">
                    <h5 className="mb-0">Quiz Tips</h5>
                  </div>
                  <div className="card-body p-24">
                    <ul className="quiz-tips-list mb-0">
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-timer text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">
                          Manage your time wisely. Don't spend too long on any
                          single question.
                        </p>
                      </li>
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-flag text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">
                          Flag difficult questions and return to them later.
                        </p>
                      </li>
                      <li className="d-flex gap-12 mb-16">
                        <div className="flex-shrink-0">
                          <i className="ph ph-lightbulb text-warning-600 fs-20"></i>
                        </div>
                        <p className="mb-0">
                          <strong>
                            Use the "Need a Hint?" button directly under the
                            question if you need help.
                          </strong>
                        </p>
                      </li>
                      <li className="d-flex gap-12">
                        <div className="flex-shrink-0">
                          <i className="ph ph-check-square text-main-600 fs-20"></i>
                        </div>
                        <p className="mb-0">
                          Read each question carefully before selecting an
                          answer.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Incorrect Answers */}
      {showIncorrectAnswersModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-danger-600 text-white">
                <h5 className="modal-title">
                  Incorrect & Unanswered Questions
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={hideIncorrectModal}
                ></button>
              </div>
              <div className="modal-body p-24">
                <p className="mb-24">
                  Review the questions you answered incorrectly or did not
                  answer:
                </p>

                <div className="list-group">
                  {incorrectAnswers.map((item, index) => (
                    <div
                      key={index}
                      className="list-group-item border-0 bg-light rounded-4 mb-16 p-0"
                    >
                      <div className="p-16">
                        <h6 className="mb-12">
                          Question {item.questionIndex + 1}: {item.question}
                        </h6>

                        {item.userAnswer !== undefined ? (
                          <div className="mb-12">
                            <p className="mb-4 fw-medium text-danger-600">
                              Your answer:
                            </p>
                            <div className="p-12 bg-danger-50 border border-danger-100 rounded-4">
                              {item.options[item.userAnswer]}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-12">
                            <p className="mb-4 fw-medium text-danger-600">
                              Your answer:
                            </p>
                            <div className="p-12 bg-danger-50 border border-danger-100 rounded-4">
                              <i>Question not answered</i>
                            </div>
                          </div>
                        )}

                        <div className="mb-12">
                          <p className="mb-4 fw-medium text-success-600">
                            Correct answer:
                          </p>
                          <div className="p-12 bg-success-50 border border-success-100 rounded-4">
                            {item.options[item.correctAnswer]}
                          </div>
                        </div>

                        <button
                          className="btn btn-primary rounded-pill mt-8"
                          onClick={() =>
                            goToIncorrectQuestion(item.questionIndex)
                          }
                        >
                          <i className="ph ph-arrow-right me-8"></i>
                          Go to this question
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill"
                  onClick={hideIncorrectModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
