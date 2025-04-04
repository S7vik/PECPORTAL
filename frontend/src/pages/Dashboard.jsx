import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, ClipboardList, FileText, Bell, Search, ChevronRight, LogOut } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample subjects data - in production, this would come from your backend
  const subjects = [
    {
      name: 'Data Structures',
      progress: 75,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Operating Systems',
      progress: 60,
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Database Management',
      progress: 85,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Computer Networks',
      progress: 45,
      color: 'from-orange-500 to-orange-600'
    },
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      // if (!token) {
      //   navigate('/Login');
      //   return;
      // }

      try {
        const response = await api.get('/api/user/profile');
        if (response.data && response.data.success) {
          setUserData(response.data.user);
        } else {
          // Handle error - token might be invalid
          localStorage.removeItem('token');
          navigate('/Login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          navigate('/Login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  };

  const filteredSubjects = subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SubjectCard = ({ subject }) => (
      <motion.div
          whileHover={{ y: -4 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className={`h-2 rounded-t-xl bg-gradient-to-r ${subject.color}`} />
        <div className="p-4">
          <h3 className="font-semibold text-gray-800">{subject.name}</h3>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium text-gray-700">{subject.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${subject.color}`}
                  style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
  );

  const ActionCard = ({ icon: Icon, title, color }) => (
      <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-xl bg-gradient-to-r ${color} text-white cursor-pointer`}
      >
        <Icon className="w-6 h-6 mb-2" />
        <h3 className="font-medium">{title}</h3>
      </motion.div>
  );

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-800">Student Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                    {userData?.name ? userData.name.charAt(0) : 'U'}
                  </div>
                  <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-gray-800"
                      title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Welcome back, {userData?.name || 'Student'}</h2>
                <p className="text-gray-600 mt-1">
                  {userData?.branch || 'CSE'} • Semester {userData?.semester || '4th'}
                </p>
              </div>
              <div className="mt-4 md:mt-0 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {filteredSubjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No subjects found matching "{searchQuery}"</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {filteredSubjects.map((subject, index) => (
                    <div key={index} onClick={() => setSelectedSubject(subject.name)}>
                      <SubjectCard subject={subject} />
                    </div>
                ))}
              </div>
          )}

          <AnimatePresence mode="wait">
            {selectedSubject && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-xl shadow-sm p-6 mt-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">{selectedSubject}</h3>
                    <button
                        onClick={() => setSelectedSubject(null)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard
                        icon={Book}
                        title="Learning Resources"
                        color="from-blue-500 to-blue-600"
                    />
                    <ActionCard
                        icon={ClipboardList}
                        title="Practice Quiz"
                        color="from-emerald-500 to-emerald-600"
                    />
                    <ActionCard
                        icon={FileText}
                        title="Assignments"
                        color="from-purple-500 to-purple-600"
                    />
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
  );
};

export default Dashboard;