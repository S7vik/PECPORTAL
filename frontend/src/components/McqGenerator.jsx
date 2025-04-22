import React, { useState } from 'react';
import { BookOpen, Check, X, AlertCircle, Loader } from 'lucide-react';
import api from '../api/axios';
import PropTypes from "prop-types";

const McqGenerator = ({ courseId}) => {
    const [topics, setTopics] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [mcqQuestions, setMcqQuestions] = useState([]);
    const [error, setError] = useState('');
    const [showAnswers, setShowAnswers] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);

    const handleTopicsChange = (e) => {
        setTopics(e.target.value);
    };

    const handleGenerateMcqs = async () => {
        if (!topics.trim()) {
            setError('Please enter at least one topic');
            return;
        }

        setError('');
        setIsGenerating(true);
        setMcqQuestions([]);
        setUserAnswers({});
        setShowAnswers(false);
        setScore(null);

        try {
            const response = await api.post('/api/mcq/generate', {
                courseId,
                topics: topics.split(',').map(t => t.trim()),
                numberOfQuestions: 15
            });

            setMcqQuestions(response.data.questions);
        } catch (err) {
            console.error('Error generating MCQs:', err);
            setError('Failed to generate MCQs. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setUserAnswers({
            ...userAnswers,
            [questionIndex]: optionIndex
        });
    };

    const calculateScore = () => {
        let correct = 0;
        let total = mcqQuestions.length;

        mcqQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            if (userAnswer !== undefined) {
                if (question.options[userAnswer].correct) {
                    correct++;
                }
            }
        });

        setScore({
            correct,
            total,
            percentage: Math.round((correct / total) * 100)
        });

        setShowAnswers(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="mr-2 w-5 h-5" />
          Practice Quiz Generator
        </h3>
      
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Topics for MCQs (comma-separated)
          </label>
          <input
            type="text"
            value={topics}
            onChange={handleTopicsChange}
            placeholder="e.g. Arrays, Linked Lists, Sorting Algorithms"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Questions will be completely based on selected topics and PREVIOUS YEAR
            PAPERS
          </label>
        </div>
      
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      
        <button
          onClick={handleGenerateMcqs}
          disabled={isGenerating || !topics.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
        >
          {isGenerating ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            'Generate Practice Questions'
          )}
        </button>
      
        {isGenerating && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-pulse py-2 px-4 bg-blue-50 text-blue-600 rounded-md">
              Generating quality questions based on your topics and previous papers...
              This may take up to 30 seconds.
            </div>
          </div>
        )}
      
        {mcqQuestions.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Practice Questions</h4>
              {Object.keys(userAnswers).length > 0 && !showAnswers && (
                <button
                  onClick={calculateScore}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Check Answers
                </button>
              )}
              {showAnswers && (
                <button
                  onClick={() => setShowAnswers(false)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Hide Answers
                </button>
              )}
            </div>
      
            {score && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h5 className="font-semibold text-indigo-900 text-lg mb-2">
                  Your Score
                </h5>
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                    {score.percentage}%
                  </div>
                  <div className="ml-4">
                    <p className="text-indigo-800 text-lg">
                      {score.correct} correct out of {score.total} questions
                    </p>
                    <p className="text-indigo-600 text-sm mt-1">
                      {score.percentage >= 80
                        ? 'Excellent! You have a great understanding of the topics.'
                        : score.percentage >= 60
                        ? 'Good job! Keep practicing to improve further.'
                        : 'Keep practicing! Review the explanations for questions you missed.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
      
            <div className="space-y-6">
              {mcqQuestions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className={`p-4 border ${
                    showAnswers && userAnswers[qIndex] !== undefined
                      ? question.options[userAnswers[qIndex]].correct
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white'
                  } rounded-lg`}
                >
                  <h5 className="font-semibold mb-3">
                    {qIndex + 1}. {question.question}
                  </h5>
      
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`p-3 rounded-md cursor-pointer flex items-center ${
                          userAnswers[qIndex] === oIndex
                            ? 'bg-indigo-100 border-indigo-300 border'
                            : 'hover:bg-gray-100 border border-transparent'
                        } ${
                          showAnswers && option.correct
                            ? 'bg-green-100 border-green-300 border'
                            : showAnswers &&
                              userAnswers[qIndex] === oIndex &&
                              !option.correct
                            ? 'bg-red-100 border-red-300 border'
                            : ''
                        }`}
                        onClick={() =>
                          !showAnswers && handleAnswerSelect(qIndex, oIndex)
                        }
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <div className="flex-1">{option.option}</div>
                        {showAnswers && (
                          <div className="ml-2 flex-shrink-0">
                            {option.correct ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : userAnswers[qIndex] === oIndex ? (
                              <X className="w-5 h-5 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
      
                  {showAnswers && (
                    <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
    );
};

McqGenerator.propTypes = {
    courseId: PropTypes.string.isRequired
};

export default McqGenerator;