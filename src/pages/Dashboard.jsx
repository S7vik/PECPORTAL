import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Book, ClipboardList, FileText } from 'lucide-react';

const Dashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const user = {
    name: 'Satvik Raina',
    branch: 'CSE',
    semester: '4th',
    email: 'satvikraina@ped.edu.in',
  };

  const subjects = [
    'Data Structures',
    'Operating Systems',
    'Database Management',
    'Computer Networks',
  ];

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
      <div className="container mx-auto">
        <motion.div
          className="bg-white text-gray-800 rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <h1 className="text-3xl font-extrabold">Welcome, {user.name}</h1>
              <p className="text-sm text-gray-600">
                Branch: <span className="font-semibold">{user.branch}</span> | Semester: <span className="font-semibold">{user.semester}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Email: <span className="font-semibold">{user.email}</span></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Your Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="p-4 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-700 cursor-pointer transition transform hover:scale-105"
                  onClick={() => handleSubjectClick(subject)}
                >
                  <p className="text-lg font-medium text-center">{subject}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedSubject && (
            <motion.div
              className="mt-8 bg-gray-100 text-gray-800 p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold border-b pb-2 mb-4">{selectedSubject}</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-700 cursor-pointer transition transform hover:scale-105">
                  <Book className="mb-4 w-8 h-8 mx-auto" />
                  <p className="text-center text-lg font-semibold">Resources</p>
                </div>
                <div className="p-6 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-700 cursor-pointer transition transform hover:scale-105">
                  <ClipboardList className="mb-4 w-8 h-8 mx-auto" />
                  <p className="text-center text-lg font-semibold">Quiz</p>
                </div>
                <div className="p-6 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-700 cursor-pointer transition transform hover:scale-105">
                  <FileText className="mb-4 w-8 h-8 mx-auto" />
                  <p className="text-center text-lg font-semibold">Exam</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
