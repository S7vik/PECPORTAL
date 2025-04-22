import React , { useState } from 'react';
import { BookOpen, FileText, CheckSquare, User, Zap, Calendar, Bell, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 



const PECPortalLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Zap className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl">PEC Portal</span>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-6">
                <a href="#features" className="px-3 py-2 text-sm font-medium hover:bg-blue-600 rounded-md">Features</a>
                <a href="#resources" className="px-3 py-2 text-sm font-medium hover:bg-blue-600 rounded-md">Resources</a>
                <a href="#faq" className="px-3 py-2 text-sm font-medium hover:bg-blue-600 rounded-md">FAQ</a>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <button className="bg-white text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
               onClick={() => navigate('/login')} >
             
                <LogIn className="w-4 h-4 inline mr-1" />
                Log In
              </button>
            </div>
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 text-base font-medium hover:bg-blue-600 rounded-md">Features</a>
              <a href="#courses" className="block px-3 py-2 text-base font-medium hover:bg-blue-600 rounded-md">Courses</a>
              <a href="#resources" className="block px-3 py-2 text-base font-medium hover:bg-blue-600 rounded-md">Resources</a>
              <a href="#faq" className="block px-3 py-2 text-base font-medium hover:bg-blue-600 rounded-md">FAQ</a>
              <button className="mt-2 w-full bg-white text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"  onClick={() => navigate('/login')}>Log In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                Your Complete Academic Resource Hub
              </h1>
              <p className="text-xl mb-8">
                Access your courses, study materials, and practice quizzes all in one place. 
                Designed specifically for college students to enhance your learning experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-white text-blue-700 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-100 shadow-lg"  onClick={() => navigate('/login')}>
                  Log In
                </button>
                <button className="bg-blue-800 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-900 shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center ">
              <img 
                src="/peclogo.png" 
                alt="Student dashboard preview" 
                className="rounded-lg shadow-xl" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Designed with students in mind, our platform provides all the tools you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Course Access</h3>
              </div>
              <p className="text-gray-600">
                Easily access all your enrolled courses, syllabus, and course materials in one organized dashboard.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Learning Resources</h3>
              </div>
              <p className="text-gray-600">
                Find lecture notes, reading materials, and supplemental resources to support your learning journey.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckSquare className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Practice Quizzes</h3>
              </div>
              <p className="text-gray-600">
                Test your knowledge with interactive practice quizzes designed to reinforce your understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

        

      {/* Resources Section */}
      <div id="resources" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Learning Resources
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Access a wealth of materials to support your studies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Study Materials</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Lecture notes for all courses
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Textbook references and readings
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Video tutorials and recordings
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Supplementary articles and papers
                </li>
              </ul>
              <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700" onClick={() => navigate('/login')}>
                Browse Materials
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Practice & Assessment</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Topic-specific practice quizzes
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mock exams and timed tests
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Interactive problem-solving exercises
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Self-assessment tools with instant feedback
                </li>
              </ul>
              <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700" onClick={() => navigate('/login')}>
                Start Practicing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find answers to common questions about the PEC Portal.
            </p>
          </div>

          <div className="space-y-6 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 md:space-y-0">
            {[
              {
                q: "How do I access my courses?",
                a: "After logging in, all your enrolled courses will appear on your dashboard. Click on any course to access its materials and resources."
              },
              {
                q: "Can I download resources for offline use?",
                a: "Yes, most resources are available for download. Look for the download icon next to any resource to save it for offline access."
              },
              {
                q: "How are practice quizzes graded?",
                a: "Practice quizzes are automatically graded upon completion. You'll receive instant feedback with explanations for each question."
              },
              {
                q: "Can I access the portal on mobile devices?",
                a: "Yes, the PEC Portal is fully responsive and can be accessed on any device with a web browser."
              },
              {
                q: "How do I submit assignments?",
                a: "Navigate to the specific assignment in your course, then use the submission form to upload your work before the deadline."
              },
              {
                q: "Who do I contact for technical support?",
                a: "For technical issues, click on the 'Support' link in the footer to access our help center or contact the IT helpdesk."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to enhance your learning experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Log in to access your courses, resources, and start practicing with our interactive quizzes.
          </p>
          <button className="bg-white text-blue-700 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-100 shadow-lg" 
           onClick={() => navigate('/login')}
           >
            Log In Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">PEC Portal</h3>
              <p className="text-sm">
                Your complete academic resource hub, designed to enhance the learning experience for college students.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                
                <li><a href="#resources" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact IT</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
               
                <li><a href="https://pec.ac.in/current-students" className="hover:text-white">Student Services</a></li>
                <li><a href="https://pec.ac.in/campus" className="hover:text-white">Campus Map</a></li>
                
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row md:justify-between">
            <p className="text-sm text-gray-400">© 2025 PEC Portal. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default PECPortalLandingPage;