import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, Search, LogOut, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Changed from useRouter
import api from '../api/axios';
import Sidebar from '../pages/Sidebar';
import CourseCard from '../pages/CourseCard';
import StudyMaterialsList from '../pages/StudyMaterialsList';
import AdminUserManagement from "./AdminUserManagement.jsx";
import AdminCourseManagement from "./AdminCourseManagement.jsx";
import AdminMaterialManagement from "./AdminMaterialManagement.jsx";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate(); 
  const logoutInProgress = useRef(false);
  

  // Fetch user data and courses on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // First, get dashboard data which includes user info
        const dashboardResponse = await api.get('/api/dashboard');
        console.log("Dashboard response:", dashboardResponse.data);
        setUserData(dashboardResponse.data);        
        if (dashboardResponse.data && dashboardResponse.data.name) {
          localStorage.setItem('user', JSON.stringify(dashboardResponse.data));
        }
        if (dashboardResponse.data.dashboardType === 'student') {
          const coursesResponse = await api.get('/api/courses/current');
          console.log("Courses response:", coursesResponse.data);
          setCourses(coursesResponse.data.courses || []);
        }
        else if (dashboardResponse.data.dashboardType === 'admin') {
          const coursesResponse = await api.get('/api/courses/admin/all');
          setCourses(coursesResponse.data || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');

        if (err.response && err.response.status === 401) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); 

  // Separate logout function with browser compatibility improvements
  const handleLogout = useCallback(() => {
    // Prevent multiple logout attempts
    if (logoutInProgress.current) return;
    
    logoutInProgress.current = true;
    localStorage.removeItem('token');
    
    // Force a browser redirect instead of using React Router
    // This is more reliable across browsers
    window.location.href = '/login';
  }, []);

  const fetchMaterialsForCourse = async (courseId) => {
    try {
      const response = await api.get(`/api/materials/course/${courseId}`);
      setMaterials(response.data);
      setSelectedCourse(courses.find(course => course.id === courseId));
      setActiveTab('materials');
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load course materials');
    }
  };

  const filteredCourses = courses.filter(course =>
      course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
    );
  }

  if (error) {
    localStorage.removeItem('token');
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <p className="text-red-500 mb-4">{error}</p>
          <button
              onClick={() => navigate('/login', { replace: true })}
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
          >
            Back to Login
          </button>
        </div>
    );
  }

  const isAdmin = userData?.dashboardType === 'admin';

  return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile sidebar toggle */}
        <button
            className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <List className="h-6 w-6 text-gray-700" />
        </button>

        {/* Sidebar */}
        <Sidebar
            isAdmin={isAdmin}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isMobileSidebarOpen}
            setIsOpen={setIsMobileSidebarOpen}
            userData={userData}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-semibold text-gray-800">
                  {isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
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
          </header>

          {/* Main content area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome back, {userData && userData.name ? userData.name : 'User'}
                  </h2>
                  {!isAdmin && userData && (
                      <p className="text-gray-600 mt-1">
                        {userData.department ? userData.department.toUpperCase() : 'Department'} •
                        Semester {userData.currentSemester || '-'} •
                        Batch {userData.batchYear || '-'}
                      </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'courses' && (
                <>
                  {filteredCourses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {searchQuery
                              ? `No courses found matching "${searchQuery}"`
                              : "No courses available for this semester"
                          }
                        </p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onClick={() => fetchMaterialsForCourse(course.id)}
                            />
                        ))}
                      </div>
                  )}
                </>
            )}

            {activeTab === 'materials' && selectedCourse && (
                <StudyMaterialsList
                    materials={materials}
                    course={selectedCourse}
                    onBackClick={() => setActiveTab('courses')}
                />
            )}

            {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{userData?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData?.email || 'N/A'}</p>
                    </div>
                    {!isAdmin && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{userData?.department?.toUpperCase() || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Batch Year</p>
                            <p className="font-medium">{userData?.batchYear || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Current Semester</p>
                            <p className="font-medium">{userData?.currentSemester || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Semester Date Range</p>
                            <p className="font-medium">{userData?.semesterDateRange || 'N/A'}</p>
                          </div>
                        </>
                    )}
                  </div>
                </div>
            )}

            {/* Admin-specific tabs */}
            {isAdmin && activeTab === 'manageCourses' && (
                <AdminCourseManagement courses={courses} setCourses={setCourses} />
            )}

            {isAdmin && activeTab === 'manageMaterials' && (
                <AdminMaterialManagement courses={courses} />
            )}

            {isAdmin && activeTab === 'manageUsers' && (
                <AdminUserManagement />
            )}
          </main>
        </div>
      </div>
  );
};

export default Dashboard;