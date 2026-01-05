import React, { useState, useEffect } from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Menu, X, Home as HomeIcon, Settings, Eye, Edit2, Info, CheckCircle2 } from 'lucide-react';

const doctors = [
  { id: 1, name: 'Dr. Amit Desai', specialization: 'Cardiologist', experience: '20 Years', availability: 'Mon-Sat: 10AM-5PM', phone: '+91 98765 11111' },
  { id: 2, name: 'Dr. Neha Kapoor', specialization: 'Neurologist', experience: '15 Years', availability: 'Mon-Fri: 9AM-4PM', phone: '+91 98765 22222' },
  { id: 3, name: 'Dr. Ravi Joshi', specialization: 'Orthopedic', experience: '18 Years', availability: 'Tue-Sat: 11AM-6PM', phone: '+91 98765 33333' },
  { id: 4, name: 'Dr. Sanjana Iyer', specialization: 'Pediatrician', experience: '12 Years', availability: 'Mon-Sat: 8AM-2PM', phone: '+91 98765 44444' },
  { id: 5, name: 'Dr. Kiran Shah', specialization: 'General Physician', experience: '25 Years', availability: 'Mon-Sat: 9AM-7PM', phone: '+91 98765 55555' },
];

const Referral = ({ onNavigate, referenceView, setReferenceView, newReference, setNewReference }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [referenceHistory, setReferenceHistory] = useState([]);

  // Load references from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userKey = `userReferences_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
        const savedReferences = localStorage.getItem(userKey);
        if (savedReferences) {
          setReferenceHistory(JSON.parse(savedReferences));
        }
      } catch (error) {
        console.error('Error loading references:', error);
      }
    }
  }, []);

  // Get reference counts by category
  const getReferenceCounts = () => {
    const generalCount = referenceHistory.filter(ref => ref.category === 'General').length;
    const ewsCount = referenceHistory.filter(ref => ref.category === 'EWS').length;
    return { generalCount, ewsCount, total: referenceHistory.length };
  };

  const { generalCount, ewsCount, total } = getReferenceCounts();

  // Check if user can add more references
  const canAddReference = (category) => {
    if (total >= 4) return false;
    if (category === 'General' && generalCount >= 2) return false;
    if (category === 'EWS' && ewsCount >= 2) return false;
    return true;
  };

  // Save reference to localStorage
  const saveReference = (reference) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userKey = `userReferences_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
        const newRef = {
          ...reference,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };
        const updatedHistory = [...referenceHistory, newRef];
        setReferenceHistory(updatedHistory);
        localStorage.setItem(userKey, JSON.stringify(updatedHistory));
        return true;
      } catch (error) {
        console.error('Error saving reference:', error);
        return false;
      }
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!newReference.category) {
      alert('Please select a category (General or EWS)');
      return;
    }

    if (!canAddReference(newReference.category)) {
      const limitMsg = newReference.category === 'General' 
        ? 'You have reached the limit of 2 General category references.'
        : 'You have reached the limit of 2 EWS category references.';
      alert(limitMsg);
      return;
    }

    if (saveReference(newReference)) {
      alert('Reference added successfully!');
      setNewReference({
        patientName: '',
        age: '',
        gender: '',
        phone: '',
        referredTo: '',
        condition: '',
        category: '',
        notes: ''
      });
      setReferenceView('menu');
    } else {
      alert('Error saving reference. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">Patient Referral</h1>
        <button
          onClick={() => onNavigate('home')}
          className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <HomeIcon className="h-5 w-5 text-indigo-600" />
        </button>
      </div>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-[57px] w-72 h-[calc(100vh-57px)] bg-white shadow-2xl z-40 border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" alt="Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Trustee and Patron Portal</h2>
                <p className="text-xs text-gray-500">Maharaja Agarsen</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <HomeIcon className="h-5 w-5 text-gray-600" /> Home
            </button>
            <button onClick={() => onNavigate('directory')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <Users className="h-5 w-5 text-gray-600" /> Directory
            </button>
            <button onClick={() => onNavigate('appointment')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <Clock className="h-5 w-5 text-gray-600" /> Appointments
            </button>
            <button onClick={() => onNavigate('reports')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left font-medium text-gray-700">
              <FileText className="h-5 w-5 text-gray-600" /> Reports
            </button>
            <button onClick={() => onNavigate('reference')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 transition-colors text-left font-medium">
              <UserPlus className="h-5 w-5 text-indigo-600" /> Patient Referral
            </button>
          </div>
        </div>
      )}

      {referenceView === 'menu' && (
        <>
          {/* Header Section */}
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                <UserPlus className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">Patient Referral</h1>
                <p className="text-gray-500 text-sm font-medium">Refer patients to our doctors</p>
              </div>
            </div>
          </div>

          {/* Reference Limits Info Card */}
          <div className="px-6 mb-4">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-xl">
                  <Info className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Reference Limits</h3>
                  <p className="text-xs text-gray-600 mb-3">You can refer a maximum of 4 patients (2 General + 2 EWS)</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="text-xs font-semibold text-gray-700">General Category</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {generalCount}/2
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-xs font-semibold text-gray-700">EWS Category</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {ewsCount}/2
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs font-bold text-gray-800">Total References</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {total}/4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => setReferenceView('addNew')}
              disabled={total >= 4}
              className={`w-full rounded-2xl shadow-sm p-6 transition-all active:scale-[0.98] group flex items-center justify-between ${
                total >= 4 
                  ? 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
              }`}
            >
              <div className={`flex items-center gap-4 text-left ${total >= 4 ? 'text-gray-600' : 'text-white'}`}>
                <div className={`p-3 rounded-xl ${total >= 4 ? 'bg-gray-200' : 'bg-white/20'}`}>
                  <Plus className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">New Reference</h3>
                  <p className={`text-xs font-medium ${total >= 4 ? 'text-gray-500' : 'text-indigo-100'}`}>
                    {total >= 4 ? 'Reference limit reached' : 'Refer a patient to specialist'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`h-6 w-6 ${total >= 4 ? 'text-gray-400' : 'text-white/50 group-hover:text-white'}`} />
            </button>

            {/* Reference History List */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Reference History</h3>
                {referenceHistory.length > 0 && (
                  <span className="text-xs font-semibold text-gray-500">
                    {referenceHistory.length} {referenceHistory.length === 1 ? 'reference' : 'references'}
                  </span>
                )}
              </div>
              
              {referenceHistory.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
                  <div className="bg-white p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No references yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {referenceHistory.map(ref => (
                    <div key={ref.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 group hover:shadow-md hover:border-gray-300 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2.5 rounded-xl transition-colors ${
                            ref.category === 'EWS' 
                              ? 'bg-indigo-50 text-indigo-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <User className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-800 text-sm leading-tight">
                                {ref.patientName}
                              </h4>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                ref.category === 'EWS' 
                                  ? 'bg-indigo-100 text-indigo-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {ref.category}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs font-medium">
                              {ref.referredTo}
                            </p>
                            {ref.condition && (
                              <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                                {ref.condition}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                          ref.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          ref.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">{ref.date}</span>
                        </div>
                        {ref.phone && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone className="h-3.5 w-3.5" />
                            <span className="text-xs font-semibold">{ref.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {referenceView === 'addNew' && (
        <div className="px-6 py-4">
          <button 
            onClick={() => {
              setNewReference({
                patientName: '',
                age: '',
                gender: '',
                phone: '',
                referredTo: '',
                condition: '',
                category: '',
                notes: ''
              });
              setReferenceView('menu');
            }}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-6 hover:underline"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to Menu
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Details</h2>
          <p className="text-gray-500 text-sm mb-6">Fill in the information to refer a patient</p>
          
          {/* Category Selection */}
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-3 block">Category *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (canAddReference('General')) {
                    setNewReference({...newReference, category: 'General'});
                  } else {
                    alert('You have reached the limit of 2 General category references.');
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  newReference.category === 'General'
                    ? 'border-indigo-500 bg-indigo-50'
                    : canAddReference('General')
                    ? 'border-gray-200 bg-white hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
                disabled={!canAddReference('General')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">General</span>
                  {newReference.category === 'General' && (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Available</span>
                  <span className="text-xs font-bold text-gray-700">{2 - generalCount} left</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (canAddReference('EWS')) {
                    setNewReference({...newReference, category: 'EWS'});
                  } else {
                    alert('You have reached the limit of 2 EWS category references.');
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  newReference.category === 'EWS'
                    ? 'border-indigo-500 bg-indigo-50'
                    : canAddReference('EWS')
                    ? 'border-gray-200 bg-white hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
                disabled={!canAddReference('EWS')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">EWS</span>
                  {newReference.category === 'EWS' && (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Available</span>
                  <span className="text-xs font-bold text-gray-700">{2 - ewsCount} left</span>
                </div>
              </button>
            </div>
            {newReference.category && (
              <div className="mt-3 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl">
                <Info className="h-4 w-4" />
                <span>Selected: <strong>{newReference.category}</strong> category</span>
              </div>
            )}
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Patient Name *</label>
              <input
                type="text"
                required
                value={newReference.patientName}
                onChange={(e) => setNewReference({...newReference, patientName: e.target.value})}
                placeholder="Enter full name"
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Age *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={newReference.age}
                  onChange={(e) => setNewReference({...newReference, age: e.target.value})}
                  placeholder="Years"
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender *</label>
                <select
                  required
                  value={newReference.gender}
                  onChange={(e) => setNewReference({...newReference, gender: e.target.value})}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number *</label>
              <input
                type="tel"
                required
                maxLength="10"
                value={newReference.phone}
                onChange={(e) => setNewReference({...newReference, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="10 digit number"
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Refer To Doctor *</label>
              <select
                required
                value={newReference.referredTo}
                onChange={(e) => setNewReference({...newReference, referredTo: e.target.value})}
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              >
                <option value="">Choose doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} - {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Medical Condition *</label>
              <textarea
                required
                value={newReference.condition}
                onChange={(e) => setNewReference({...newReference, condition: e.target.value})}
                placeholder="Brief condition description"
                rows="3"
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!newReference.category || !canAddReference(newReference.category)}
              className={`w-full mt-6 py-4 rounded-2xl font-bold text-base shadow-lg active:scale-[0.98] transition-all ${
                !newReference.category || !canAddReference(newReference.category)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Submit Reference
            </button>
          </form>
        </div>
      )}

      {referenceView === 'history' && (
        <div className="px-6 py-4">
          <button 
            onClick={() => setReferenceView('menu')}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-6 hover:underline"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to Menu
          </button>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reference History</h2>
            <p className="text-gray-500 text-sm">
              {referenceHistory.length > 0 
                ? `Total ${referenceHistory.length} reference${referenceHistory.length > 1 ? 's' : ''}`
                : 'No references yet'
              }
            </p>
          </div>

          {referenceHistory.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No References Yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start referring patients to our specialists</p>
              <button
                onClick={() => setReferenceView('addNew')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
              >
                Add New Reference
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {referenceHistory.map(ref => (
                <div key={ref.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 group hover:shadow-md hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-xl transition-colors ${
                        ref.category === 'EWS' 
                          ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-600 group-hover:text-white'
                      }`}>
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800 text-base leading-tight">
                            {ref.patientName}
                          </h3>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            ref.category === 'EWS' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {ref.category}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs font-medium mt-1">
                          Referred to {ref.referredTo}
                        </p>
                        {ref.condition && (
                          <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                            {ref.condition}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      ref.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      ref.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-semibold">{ref.date}</span>
                    </div>
                    {ref.phone && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="h-4 w-4" />
                        <span className="text-xs font-semibold">{ref.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Referral;