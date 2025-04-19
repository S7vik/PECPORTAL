import React from 'react';
import { Book, BookOpen, Settings, Users, Database, X, Layout } from 'lucide-react';
import PropTypes from 'prop-types';

const Sidebar = ({
  isAdmin,
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  userData
}) => {
  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transform  md:relative md:translate-x-0 top-0 left-0 min-h-full bg-gray-900 w-64 transition-transform duration-200 ease-in-out z-40 sticky`}
    >
      <div className="flex flex-col min-h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-50">
          <h2 className="text-white text-xl font-bold">
            {isAdmin ? 'Admin Panel' : 'Student Portal'}
          </h2>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">{userData?.name || 'User'}</p>
              <p className="text-gray-400 text-sm">
                {isAdmin ? 'Administrator' : userData?.department?.toUpperCase() || 'Student'}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Navigation</p>
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'courses'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('courses');
                  closeSidebar();
                }}
              >
                <Book className="h-5 w-5 mr-3" />
                <span>Courses</span>
              </button>
            </li>
            {activeTab === 'materials' && (
              <li>
                <button
                  className="w-full flex items-center px-3 py-2 rounded-md bg-gray-800 text-white transition-colors"
                  onClick={() => {
                    setActiveTab('materials');
                    closeSidebar();
                  }}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  <span>Materials</span>
                </button>
              </li>
            )}
            <li>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => {
                  setActiveTab('settings');
                  closeSidebar();
                }}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </button>
            </li>
          </ul>

          {isAdmin && (
            <>
              <p className="text-gray-400 text-xs uppercase tracking-wider mt-6 mb-2">Administration</p>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeTab === 'manageCourses'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab('manageCourses');
                      closeSidebar();
                    }}
                  >
                    <Database className="h-5 w-5 mr-3" />
                    <span>Manage Courses</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeTab === 'manageMaterials'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab('manageMaterials');
                      closeSidebar();
                    }}
                  >
                    <BookOpen className="h-5 w-5 mr-3" />
                    <span>Manage Materials</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeTab === 'manageUsers'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab('manageUsers');
                      closeSidebar();
                    }}
                  >
                    <Users className="h-5 w-5 mr-3" />
                    <span>Manage Users</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeTab === 'manageLayout'
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      setActiveTab('manageLayout');
                      closeSidebar();
                    }}
                  >
                    <Layout className="h-5 w-5 mr-3" />
                    <span>Site Layout</span>
                  </button>
                </li>
              </ul>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  userData: PropTypes.object
};

export default Sidebar;
