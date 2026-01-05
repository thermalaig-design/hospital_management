import React, { useState, useEffect } from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Menu, X, Home as HomeIcon, Settings, UserCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';

const Home = ({ onNavigate, onLogout, isMember }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Get user-specific profile based on phone number
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userKey = `userProfile_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
        const savedProfile = localStorage.getItem(userKey);
        if (savedProfile) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          setUserProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);
  const recentNotices = [
    { id: 1, title: 'Free Cardiac Checkup', date: 'Dec 29, 2024', tag: 'Health Camp' },
    { id: 2, title: 'New Specialist Joined', date: 'Dec 28, 2024', tag: 'Hiring' },
  ];

  const quickActions = [
    { id: 'directory', title: 'Directory', desc: 'Find Doctors & Hospitals', icon: Users, color: 'bg-blue-100', iconColor: 'text-blue-600', screen: 'directory' },
    { id: 'appointment', title: 'Book Appointment', desc: 'Schedule Doctor Visit', icon: Clock, color: 'bg-indigo-100', iconColor: 'text-indigo-600', screen: 'appointment', memberOnly: true },
    { id: 'reports', title: 'Reports', desc: 'Medical Test Results', icon: FileText, color: 'bg-orange-100', iconColor: 'text-orange-600', screen: 'reports' },
    { id: 'reference', title: 'Patient Referral', desc: 'Refer Patient to Doctor', icon: UserPlus, color: 'bg-teal-100', iconColor: 'text-teal-600', screen: 'reference' },
  ];

  const marqueeUpdates = [
    'Free Cardiac Checkup Camp on March 29, 2026',
    'New Specialist Dr. Neha Kapoor Joined',
    '24x7 Emergency Helpline: 1800-XXX-XXXX',
    'Tele Consultation Services Now Available',
    'Home Delivery of Medicines Available',
    'Free Health Camp at Main Hospital',
    'New MRI Machine Installed',
    'OPD Timings: 9 AM to 5 PM',
    'Emergency Services Available 24/7',
  ];

  const services = [
    { id: 'opd-registration', title: 'OPD Self Registration', icon: QrCode, color: 'bg-purple-500' },
    { id: 'opd-appointment', title: 'OPD Appointment', icon: Calendar, color: 'bg-purple-500' },
    { id: 'medicines-received', title: 'Medicines Received', icon: Pill, color: 'bg-purple-500' },
    { id: 'teleconsultation', title: 'Tele Consultation', icon: Monitor, color: 'bg-purple-500' },
    { id: 'home-delivery', title: 'Home Delivery of Medicines', icon: ShoppingCart, color: 'bg-purple-500' },
    { id: 'tele-manas', title: 'Tele Manas', icon: Brain, color: 'bg-purple-500' },
    { id: 'e-medical-pass', title: 'e-Medical Pass', icon: FileCheck, color: 'bg-purple-500' },
  ];

  const enquiry = [
    { id: 'specialities', title: 'Availability of Specialities', icon: Stethoscope, color: 'bg-purple-500' },
    { id: 'lab-tests', title: 'Availability of Lab Tests', icon: Search, color: 'bg-purple-500' },
    { id: 'drugs', title: 'Availability of Drugs', icon: Pill, color: 'bg-purple-500' },
    { id: 'hcos', title: 'Empanelled HCOs Directory', icon: Building2, color: 'bg-purple-500' },
    { id: 'emergency-contacts', title: 'Emergency Contacts', icon: Phone, color: 'bg-purple-500' },
    { id: 'helpline', title: '24x7 Emergency Helpline', icon: Phone, color: 'bg-purple-500' },
    { id: 'health-info', title: 'Health Information', icon: Heart, color: 'bg-purple-500' },
  ];

  const userSupport = [
    { id: 'help-desk', title: 'HMIS Help Desk', icon: Headphones, color: 'bg-purple-500' },
    { id: 'videos', title: 'Videos', icon: Video, color: 'bg-purple-500' },
    { id: 'user-manuals', title: 'User Manuals', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'handouts', title: 'Handouts', icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">Home</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('profile')}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            {userProfile?.name ? (
              <div className="h-7 w-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold border border-indigo-200">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <UserCircle className="h-6 w-6 text-gray-700" />
            )}
          </button>
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5 text-gray-700" />
          </button>

        </div>
      </div>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="home"
      />

      {/* Header Section - Premium VIP Design */}
      <div className="bg-gradient-to-br from-white to-gray-50 px-4 sm:px-6 pt-6 sm:pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 flex-shrink-0">
            <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">Maharaja Agrasen Hospital</h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium">Trustee & Patron Portal</p>
            {userProfile?.name && (
              <p className="text-indigo-600 text-xs sm:text-sm font-semibold mt-1 truncate">Welcome, {userProfile.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Single Marquee Updates */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white overflow-hidden relative shadow-md">
        <div className="py-2.5">
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
            {marqueeUpdates.map((update, index) => (
              <div key={index} className="flex items-center mx-6 sm:mx-8 flex-shrink-0">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{update}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {marqueeUpdates.map((update, index) => (
              <div key={`dup-${index}`} className="flex items-center mx-6 sm:mx-8 flex-shrink-0">
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">{update}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Main Navigation Cards - Premium Design */}
      <div className="px-4 sm:px-6 mt-4 sm:mt-6 mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.screen)}
              disabled={action.memberOnly && !isMember}
              className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md border-2 border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 active:scale-95 group relative overflow-hidden ${action.memberOnly && !isMember ? 'opacity-60' : ''}`}
            >
              <div className={`${action.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                <action.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${action.iconColor}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1 sm:mb-1.5">{action.title}</h3>
              <p className="text-gray-600 text-[10px] sm:text-xs font-medium leading-snug">{action.desc}</p>
              {action.memberOnly && !isMember && (
                <span className="absolute top-3 right-3 bg-gray-100 text-gray-400 p-1.5 rounded-full shadow-sm"><Shield className="h-3.5 w-3.5" /></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">Services</h2>
          <div className="grid grid-cols-3 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  if (service.id === 'opd-appointment') onNavigate('appointment');
                  else if (service.id === 'home-delivery' || service.id === 'medicines-received') onNavigate('medicines-booking');
                  else alert(`${service.title} feature coming soon!`);
                }}
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col items-center text-center transition-all hover:bg-gray-100 hover:border-indigo-300 active:scale-95 group"
              >
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <service.icon className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-medium text-gray-700 leading-tight">{service.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Section */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">Enquiry</h2>
          <div className="grid grid-cols-3 gap-3">
            {enquiry.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'specialities' || item.id === 'hcos') onNavigate('directory');
                  else alert(`${item.title} feature coming soon!`);
                }}
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col items-center text-center transition-all hover:bg-gray-100 hover:border-indigo-300 active:scale-95 group"
              >
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-medium text-gray-700 leading-tight">{item.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Support Section */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">User Support</h2>
          <div className="grid grid-cols-4 gap-3">
            {userSupport.map((support) => (
              <button
                key={support.id}
                onClick={() => alert(`${support.title} feature coming soon!`)}
                className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex flex-col items-center text-center transition-all hover:bg-gray-100 hover:border-indigo-300 active:scale-95 group"
              >
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <support.icon className="h-5 w-5" />
                </div>
                <p className="text-[9px] font-medium text-gray-700 leading-tight">{support.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
              Recent Updates
            </h2>
            <button 
              onClick={() => onNavigate('notices')}
              className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:text-indigo-700 transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentNotices.map((notice) => (
              <div key={notice.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4 hover:bg-gray-100 transition-all">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Heart className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full">
                      {notice.tag}
                    </span>
                    <span className="text-[9px] text-gray-500 font-medium">{notice.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extra Space for Bottom Nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Home;
