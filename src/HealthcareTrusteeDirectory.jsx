import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Users, Stethoscope, Building2, Star, Award, ChevronRight, ChevronLeft, Menu, X, Home as HomeIcon, Clock, FileText, UserPlus, Pill, Phone, Mail, MapPin, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import { getAllMembers, getAllCommitteeMembers, getAllHospitals, getAllElectedMembers } from './services/api';

const HealthcareTrusteeDirectory = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState(null); // null, 'healthcare', 'trustee', or 'committee'
  const [activeTab, setActiveTab] = useState(null);

  const [allMembers, setAllMembers] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [electedMembers, setElectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Ref to track previous filtered members to avoid infinite loop
  const previousFilteredRef = useRef([]);
  
  // Ref for the content area to scroll to
  const contentRef = useRef(null);

  // Restore directory and tab when coming back from member details
  useEffect(() => {
    const restoreDirectory = sessionStorage.getItem('restoreDirectory');
    if (restoreDirectory) {
      setSelectedDirectory(restoreDirectory);
      if (restoreDirectory === 'healthcare') {
        setActiveTab('doctors');
      } else if (restoreDirectory === 'committee') {
        setActiveTab('committee');
      } else if (restoreDirectory === 'trustee') {
        setActiveTab('trustees');
      }
      sessionStorage.removeItem('restoreDirectory');
    }
  }, []);

  // Fetch all members, hospitals and member types when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Attempting to fetch all members...');
        const response = await getAllMembers();
        console.log('Full API response:', response);
        console.log('Fetched members data:', response.data);
        
        // Debug: Check structure of first few members
        if (response.data && response.data.length > 0) {
          console.log('First 3 members structure:');
          response.data.slice(0, 3).forEach((member, index) => {
            console.log(`Member ${index + 1}:`, {
              type: member.type,
              Name: member.Name,
              consultant_name: member.consultant_name,
              department: member.department,
              designation: member.designation
            });
          });
        }
        
        // Debug: Count doctors from opd_schedule
        const opdDoctors = response.data.filter(m => m.consultant_name && m.department);
        console.log(`Found ${opdDoctors.length} doctors from opd_schedule`);
        
        // Debug: Show doctor-specific entries
        if (opdDoctors.length > 0) {
          console.log('Sample opd_schedule doctors:', opdDoctors.slice(0, 3));
        }
        
        // Debug: Count all doctor-related entries
        const allDoctors = response.data.filter(m => 
          (m.type && m.type.toLowerCase().includes('doctor')) ||
          m.specialization ||
          m.designation ||
          (m.consultant_name && m.department)
        );
        console.log(`Total doctor-related entries: ${allDoctors.length}`);
        
        setAllMembers(response.data || []);
        
        // Fetch hospitals separately from the hospitals table
        try {
          const hospitalsResponse = await getAllHospitals();
          console.log('Hospitals response:', hospitalsResponse);
          setHospitals(hospitalsResponse.data || []);
        } catch (hospitalsErr) {
          console.error('Error fetching hospitals:', hospitalsErr);
          // Continue with empty hospitals array
          setHospitals([]);
        }
        

        
        // Fetch committee members separately from committee_members table
        try {
          const committeeResponse = await getAllCommitteeMembers();
          console.log('Committee members response:', committeeResponse);
          setCommitteeMembers(committeeResponse.data || []);
        } catch (committeeErr) {
          console.error('Error fetching committee members:', committeeErr);
          // Don't set error, just log it - committee members are optional
        }
        
        // Fetch elected members separately from elected_members table
        try {
          const electedResponse = await getAllElectedMembers();
          console.log('Elected members response:', electedResponse);
          setElectedMembers(electedResponse.data || []);
        } catch (electedErr) {
          console.error('Error fetching elected members:', electedErr);
          // Don't set error, just log it - elected members are optional
        }
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(`Failed to load members data: ${err.message || 'Please make sure backend server is running on port 5000'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);

  // Calculate counts for each category
  const getTrusteesCount = () => allMembers.filter(m => {
    if (!m.type) return false;
    const typeLower = m.type.toLowerCase().trim();
    return typeLower === 'trustee' || typeLower === 'trustees';
  }).length;
  
  const getPatronsCount = () => allMembers.filter(m => {
    if (!m.type) return false;
    const typeLower = m.type.toLowerCase().trim();
    return typeLower === 'patron' || typeLower === 'patrons';
  }).length;
  
  const getCommitteeCount = () => {
    // Count committee members from committee_members table
    return committeeMembers.length;
  };
  
  const getDoctorsCount = () => allMembers.filter(m => 
    (m.type && (m.type.toLowerCase().includes('doctor') || 
               m.type.toLowerCase().includes('medical'))) || 
    m.specialization ||
    m.designation ||
    (m.consultant_name && m.department) // This indicates it's from opd_schedule
  ).length;
  
  const getHospitalsCount = () => hospitals.length;

  const getElectedMembersCount = () => electedMembers.length;

  // Function to get members based on selected directory and tab
  const getMembersByDirectoryAndTab = useCallback((directory, tabId) => {
    if (directory === 'healthcare') {
      if (tabId === 'doctors') {
        return allMembers.filter(member => 
          (member.type && (
            member.type.toLowerCase().includes('doctor') ||
            member.type.toLowerCase().includes('medical')
          )) || member.specialization || member.designation || (member.consultant_name && member.department)
        );
      } else if (tabId === 'hospitals') {
        // Return hospitals from the separate hospitals array
        return hospitals;
      }
    } else if (directory === 'trustee') {
      if (tabId === 'trustees') {
        return allMembers.filter(member => {
          if (!member.type) return false;
          const typeLower = member.type.toLowerCase().trim();
          return typeLower === 'trustee' || typeLower === 'trustees';
        });
      } else if (tabId === 'patrons') {
        return allMembers.filter(member => {
          if (!member.type) return false;
          const typeLower = member.type.toLowerCase().trim();
          return typeLower === 'patron' || typeLower === 'patrons';
        });
      }
    } else if (directory === 'committee') {
      if (tabId === 'elected') {
        // Return elected members from elected_members table
        return electedMembers;
      } else {
        // Return unique committee names instead of individual members
        const uniqueCommittees = [...new Set(committeeMembers.map(cm => cm.committee_name_english || cm.committee_name_hindi))]
          .filter(name => name && name !== 'N/A')
          .map((committeeName, index) => ({
            'S. No.': `COM${index}`,
            'Name': committeeName,
            'type': 'Committee',
            'committee_name_english': committeeMembers.find(cm => (cm.committee_name_english || cm.committee_name_hindi) === committeeName)?.committee_name_english || committeeName,
            'committee_name_hindi': committeeMembers.find(cm => (cm.committee_name_english || cm.committee_name_hindi) === committeeName)?.committee_name_hindi || committeeName,
            'is_committee_group': true
          }));
        return uniqueCommittees;
      }
    }
    return [];
  }, [allMembers, hospitals, electedMembers, committeeMembers]);

  // Healthcare Directory Tabs
  const healthcareTabs = [
    { id: 'doctors', label: `Doctors (${getDoctorsCount()})`, icon: Stethoscope },
    { id: 'hospitals', label: `Hospitals (${getHospitalsCount()})`, icon: Building2 },
  ];

  // Trustee Directory Tabs
  const trusteeTabs = [
    { id: 'trustees', label: `Trustees (${getTrusteesCount()})`, icon: Star },
    { id: 'patrons', label: `Patrons (${getPatronsCount()})`, icon: Award },
  ];

  // Committee Directory Tabs
  const committeeTabs = [
    { id: 'committee', label: `Committee (${getCommitteeCount()})`, icon: Users },
    { id: 'elected', label: `Elected (${getElectedMembersCount()})`, icon: Star },
  ];

  // Get current tabs based on selected directory
  const currentTabs = selectedDirectory === 'healthcare' ? healthcareTabs : 
                     selectedDirectory === 'committee' ? committeeTabs : trusteeTabs;

  // Filter members based on current selection and search
  useEffect(() => {
    let membersToFilter = [];
    
    if (selectedDirectory && currentTabs.length > 0) {
      // Get members for the currently selected tab
      const currentTabId = activeTab || currentTabs[0]?.id; // Use active tab if set, otherwise default to first tab
      membersToFilter = getMembersByDirectoryAndTab(selectedDirectory, currentTabId);
    } else {
      membersToFilter = [];
    }

    // Apply search filter
    const filtered = membersToFilter.filter(item =>
      (item.Name && item.Name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.hospital_name && item.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.member_name_english && item.member_name_english.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item['Company Name'] && item['Company Name'].toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.trust_name && item.trust_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.committee_name_hindi && item.committee_name_hindi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.hospital_type && item.hospital_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.member_role && item.member_role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item['Membership number'] && item['Membership number'].toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.designation && item.designation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.consultant_name && item.consultant_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.position && item.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.member_id && item.member_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.Mobile && item.Mobile.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.Mobile2 && item.Mobile2.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Only update if the filtered members have actually changed
    const hasChanged = filtered.length !== previousFilteredRef.current.length ||
      !filtered.every((item, index) => item['S. No.'] === previousFilteredRef.current[index]?.['S. No.']);
    
    if (hasChanged) {
      setFilteredMembers(filtered);
      previousFilteredRef.current = filtered;
      // Reset to first page when search, tab, or directory changes
      setCurrentPage(1);
      
      // Scroll to the content area when tab changes
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedDirectory, activeTab, searchQuery, allMembers, committeeMembers, currentTabs]); // getMembersByDirectoryAndTab is stable due to useCallback

  // Scroll to top of container when component mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageMembers = filteredMembers.slice(startIndex, endIndex);



  const containerRef = useRef(null);
  
  return (
    <div className="bg-white min-h-screen pb-10 relative" ref={containerRef}>
      {/* Navbar - Matching Home.jsx */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          {selectedDirectory ? (selectedDirectory === 'healthcare' ? 'Healthcare Directory' : 
           selectedDirectory === 'committee' ? 'Committee Directory' : 'Trustee Directory') : 'Directory Selection'}
        </h1>
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-indigo-600"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="px-6 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Menu - Inside app layout */}
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
            <button 
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <HomeIcon className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Home</span>
            </button>
            <button 
              onClick={() => { onNavigate('directory'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Directory</span>
            </button>
            {/* <button 
              onClick={() => { onNavigate('healthcare-trustee-directory'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 transition-colors text-left"
            >
              <Building2 className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Healthcare & Trustee Directory</span>
            </button> */}
            <button 
              onClick={() => { onNavigate('appointment'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Appointments</span>
            </button>
            <button 
              onClick={() => { onNavigate('reports'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Reports</span>
            </button>
            <button 
              onClick={() => { onNavigate('reference'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <UserPlus className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Referral</span>
            </button>
            <button 
              onClick={() => { onNavigate('medicines-booking'); setIsMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
            >
              <Pill className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-700">Medicines</span>
            </button>
          </div>
        </div>
      )}

      {/* Directory Selection Screen */}
      {!selectedDirectory && !loading && !error && (
        <div className="px-6 pt-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Directory Selection</h1>
            <p className="text-gray-600">Choose the directory you want to explore</p>
          </div>

          <div className="space-y-4">
            {/* Committee Directory Card */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
              onClick={() => {
                setSelectedDirectory('committee');
                setActiveTab('committee'); // Set first tab immediately to show data
              }}
            >
              <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Users className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                  Committee Directory
                </h3>
                <p className="text-gray-600 text-sm mt-1">Find Committee Members</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                    {getCommitteeCount()} Committee
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Trustee Directory Card */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
              onClick={() => {
                setSelectedDirectory('trustee');
                setActiveTab('trustees'); // Set first tab immediately to show data
              }}
            >
              <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Star className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                  Trustee And Patron Directory
                </h3>
                <p className="text-gray-600 text-sm mt-1">Find Trustees & Patrons</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                    {getTrusteesCount()} Trustees
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                    {getPatronsCount()} Patrons
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Healthcare Directory Card */}
            <div 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
              onClick={() => {
                setSelectedDirectory('healthcare');
                setActiveTab('doctors'); // Set first tab immediately to show data
              }}
            >
              <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                  Healthcare Directory
                </h3>
                <p className="text-gray-600 text-sm mt-1">Find Doctors & Hospitals</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
                    {getDoctorsCount()} Doctors
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                    {getHospitalsCount()} Hospitals
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Healthcare or Trustee Directory View */}
      {selectedDirectory && (
        <div>
          {/* Header Section */}
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setSelectedDirectory(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-indigo-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-4 flex-1 mx-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/image-1767090787454.png?width=8000&height=8000&resize=contain" alt="Logo" className="h-14 w-14 object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedDirectory === 'healthcare' ? 'Healthcare Directory' : 
                     selectedDirectory === 'committee' ? 'Committee Directory' : 'Trustee Directory'}
                  </h1>
                  <p className="text-gray-500 text-sm font-medium">
                    {selectedDirectory === 'healthcare' ? 'Find Doctors & Hospitals' : 
                     selectedDirectory === 'committee' ? 'Find Committee Members' : 'Find Trustees & Patrons'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="px-6 mt-4">
            <div className="bg-gray-50 rounded-2xl p-2 flex items-center gap-3 border border-gray-200 focus-within:border-indigo-300 transition-all shadow-sm">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 ml-1">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <input
                type="text"
                placeholder={`Search in ${selectedDirectory === 'healthcare' ? 'Healthcare' : 
                          selectedDirectory === 'committee' ? 'Committee' : 'Trustee'} directory...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-medium text-sm py-2"
              />
            </div>
          </div>

          {/* Tabs - Modern Pill Style */}
          <div className="px-6 mt-6">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {currentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all text-xs tracking-tight ${
                    activeTab === tab.id || (!activeTab && currentTabs[0]?.id === tab.id)
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 border border-indigo-600'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${(activeTab === tab.id || (!activeTab && currentTabs[0]?.id === tab.id)) ? 'text-white' : 'text-indigo-600'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content List - Modern Cards */}
          <div className="px-6 mt-2 space-y-4" ref={contentRef}>
            {currentPageMembers.length > 0 ? (
              currentPageMembers.map((item) => (
                <div 
                  key={item['S. No.'] || item.id || Math.random()} 
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
                  onClick={() => {
                    // Check if this is a committee group (committee name)
                    if (item.is_committee_group) {
                      // Navigate to a new view showing all members of this committee
                      const filteredCommitteeMembers = committeeMembers.filter(cm => 
                        (cm.committee_name_english === item.Name) || (cm.committee_name_hindi === item.Name)
                      );
                      
                      const committeeData = {
                        'Name': item.Name,
                        'type': 'Committee',
                        'committee_members': filteredCommitteeMembers,
                        'committee_name_english': item.committee_name_english,
                        'committee_name_hindi': item.committee_name_hindi,
                        'is_committee_group': true
                      };
                      
                      // Add the current directory type as the previous screen name
                      committeeData.previousScreenName = selectedDirectory;
                      
                      // Store the current directory and tab in sessionStorage to restore when coming back
                      sessionStorage.setItem('restoreDirectory', selectedDirectory);
                      sessionStorage.setItem('restoreDirectoryTab', activeTab);
                      
                      onNavigate('committee-members', committeeData);
                    } else {
                      // Navigate to member details page
                      // Determine if this is a healthcare member (from opd_schedule)
                        const isHealthcareMember = !!item.consultant_name || (item.original_id && item.original_id.toString().startsWith('DOC'));
                        // Determine if this is a committee member (from committee_members table)
                        const isCommitteeMember = !!item.is_committee_member || (item.original_id && item.original_id.toString().startsWith('CM'));
                        // Determine if this is a hospital member (from hospitals table)
                        const isHospitalMember = !!item.is_hospital || 
                                              (item.original_id && item.original_id.toString().startsWith('HOSP')) ||
                                              (item['S. No.'] && item['S. No.'].toString().startsWith('HOSP'));
                        
                        // Create member data based on the source
                        const memberData = {
                          'S. No.': item['S. No.'] || item.original_id || `MEM${Math.floor(Math.random() * 10000)}`,
                          'Name': item.member_name_english || item.Name || item.hospital_name || item.consultant_name || 'N/A',
                          'Mobile': item.Mobile || item.contact_phone || item.mobile || 'N/A',
                          'Email': item.Email || item.contact_email || item.email || 'N/A',
                          'type': item.member_role || item.type || item.Type || 'N/A',
                          'Membership number': item['Membership number'] || item.membership_number || 'N/A',
                          'isHealthcareMember': isHealthcareMember,
                          'isCommitteeMember': isCommitteeMember,
                          'isHospitalMember': isHospitalMember
                        };
                        
                        // Add hospital-specific fields (from hospitals table) only if it's a hospital member
                        if (isHospitalMember) {
                          memberData.hospital_name = item.hospital_name || 'N/A';
                          memberData.trust_name = item.trust_name || 'N/A';
                          memberData.hospital_type = item.hospital_type || 'N/A';
                          memberData.address = item.address || 'N/A';
                          memberData.city = item.city || 'N/A';
                          memberData.state = item.state || 'N/A';
                          memberData.pincode = item.pincode || 'N/A';
                          memberData.established_year = item.established_year || 'N/A';
                          memberData.bed_strength = item.bed_strength || 'N/A';
                          memberData.accreditation = item.accreditation || 'N/A';
                          memberData.facilities = item.facilities || 'N/A';
                          memberData.departments = item.departments || 'N/A';
                          memberData.contact_phone = item.contact_phone || 'N/A';
                          memberData.contact_email = item.contact_email || 'N/A';
                          memberData.is_active = item.is_active || 'N/A';
                          memberData.id = item.original_id || null;
                        } else if (isCommitteeMember) {
                          // Add committee-specific fields (from committee_members table)
                          memberData.committee_name_hindi = item.committee_name_hindi || 'N/A';
                          memberData.member_name_english = item.member_name_english || 'N/A';
                          memberData.member_role = item.member_role || 'N/A';
                          memberData['Company Name'] = item.committee_name_hindi || item['Company Name'] || 'N/A';
                        } else if (!isHealthcareMember) {
                          // Add general member fields (from Members Table) only if not healthcare or committee
                          if (item['Company Name']) memberData['Company Name'] = item['Company Name'];
                          if (item['Address Home']) memberData['Address Home'] = item['Address Home'];
                          if (item['Address Office']) memberData['Address Office'] = item['Address Office'];
                          if (item['Resident Landline']) memberData['Resident Landline'] = item['Resident Landline'];
                          if (item['Office Landline']) memberData['Office Landline'] = item['Office Landline'];
                        }
                        
                        // Add healthcare-specific fields (from opd_schedule) only if it's a healthcare member
                        if (isHealthcareMember) {
                          memberData.department = item.department || 'N/A';
                          memberData.designation = item.designation || item.specialization || 'N/A';
                          memberData.qualification = item.qualification || 'N/A';
                          memberData.senior_junior = item.senior_junior || 'N/A';
                          memberData.unit = item.unit || 'N/A';
                          memberData.general_opd_days = item.general_opd_days || 'N/A';
                          memberData.private_opd_days = item.private_opd_days || 'N/A';
                          memberData.unit_notes = item.unit_notes || 'N/A';
                          memberData.consultant_name = item.consultant_name || item.Name || 'N/A';
                          memberData.notes = item.notes || item.unit_notes || 'N/A';
                          memberData.id = item.id || item.original_id || null;
                        } else if (!isCommitteeMember && !isHospitalMember) {
                          // For non-healthcare, non-committee, non-hospital members, use original field values if they exist
                          if (item.designation) memberData.designation = item.designation;
                          if (item.qualification) memberData.qualification = item.qualification;
                          if (item.notes) memberData.notes = item.notes;
                        }
                        
                        // Add the current directory type as the previous screen name
                        memberData.previousScreenName = selectedDirectory;
                        
                        // Store the current directory and tab in sessionStorage to restore when coming back
                        sessionStorage.setItem('restoreDirectory', selectedDirectory);
                        sessionStorage.setItem('restoreDirectoryTab', activeTab);
                        
                        onNavigate('member-details', memberData);
                    }
                  }}
                >
                  <div className="bg-indigo-50 h-16 w-16 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    {selectedDirectory === 'healthcare' ? <Stethoscope className="h-7 w-7" /> : 
                     selectedDirectory === 'committee' ? <Users className="h-7 w-7" /> : <Star className="h-7 w-7" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                          {item.member_name_english || item.Name || 'N/A'}
                        </h3>
                        <div className="flex flex-col gap-1 mt-1">
                          {item['Membership number'] && (
                            <p className="text-gray-500 text-xs font-medium">
                              {item['Membership number']}
                            </p>
                          )}
                          <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full inline-block group-hover:bg-indigo-100 transition-colors">
                            {item.position || item.member_role || item.type || item['Company Name'] || 'N/A'}
                          </p>
                          {(item.committee_name_hindi || item['Company Name'] || item.department) && (
                            <p className="text-gray-600 text-xs mt-1">
                              {item.committee_name_hindi || item.department || item['Company Name']}
                            </p>
                          )}
                          {(item.hospital_type || item.trust_name) && (
                            <p className="text-gray-600 text-xs mt-1">
                              {item.hospital_type || item.trust_name}
                            </p>
                          )}
                          {(item.designation || item.qualification) && (
                            <p className="text-gray-500 text-xs">
                              {item.designation}{item.qualification ? ` | ${item.qualification}` : ''}
                            </p>
                          )}
                          {item.city && (
                            <p className="text-gray-500 text-xs">
                              {item.city}, {item.state || ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                      {item.Mobile && (
                        <a 
                          href={`tel:${item.Mobile.replace(/\s+/g, '').split(',')[0]}`} 
                          className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-xs font-semibold border border-gray-100"
                        >
                          <User className="h-3.5 w-3.5" />
                          Call
                        </a>
                      )}
                      {item.Email && item.Email.trim() && (
                        <a 
                          href={`mailto:${item.Email.trim()}`} 
                          className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-xs font-semibold border border-gray-100"
                        >
                          <User className="h-3.5 w-3.5" />
                          Email
                        </a>
                      )}
                      {(item.address || item['Address Home']) && (
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 text-xs font-semibold border border-gray-100">
                          <User className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[150px]">{item.address || item['Address Home']}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
                  <User className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-gray-800 font-bold">No results found</h3>
                <p className="text-gray-500 text-sm mt-1">Try searching with a different keyword</p>
              </div>
            )}
          </div>

          {/* Pagination Controls - Improved Design */}
          {filteredMembers.length > itemsPerPage && (
            <div className="px-6 mt-6 mb-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
                <div className="flex flex-col items-center gap-4">
                  {/* Pagination Buttons */}
                  <div className="flex items-center gap-2 justify-center w-full">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-md border border-indigo-200'
                      }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
                              currentPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-md scale-105'
                                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-gray-400 font-bold">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-10 h-10 rounded-xl font-bold text-sm bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-200 shadow-sm"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-md border border-indigo-200'
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Showing Text Below Buttons */}
                  <div className="text-sm text-gray-700 font-medium text-center">
                    Showing <span className="font-bold text-indigo-600">{startIndex + 1}</span> to{' '}
                    <span className="font-bold text-indigo-600">
                      {Math.min(endIndex, filteredMembers.length)}
                    </span>{' '}
                    of <span className="font-bold text-indigo-600">{filteredMembers.length}</span> members
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extra Space for Bottom Nav */}
      <div className="h-10"></div>
    </div>
  );
};

export default HealthcareTrusteeDirectory;