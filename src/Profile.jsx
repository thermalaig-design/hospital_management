import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Briefcase, Camera, ArrowLeft, Save, Edit2, Shield, BadgeCheck, Phone, Droplet, UserCircle, ChevronLeft, Home as HomeIcon, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';

// InputField component definition
const InputField = ({ label, icon: Icon, type = 'text', value, onChange, disabled, placeholder }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all focus-within:border-indigo-500 focus-within:shadow-indigo-100">
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 ml-1">
      {label}
    </label>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-indigo-50 text-indigo-600'}`}>
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 text-sm font-bold text-gray-800 bg-transparent focus:outline-none placeholder:font-normal placeholder:text-gray-300 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
  </div>
);


const Profile = ({ onNavigate, onNavigateBack, onProfileUpdate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFromDatabase, setIsFromDatabase] = useState(false);
  
  const [profileData, setProfileData] = useState({
    // Database fields
    serialNo: '',
    name: '',
    role: 'Trustee',
    memberId: '',
    mobile: '',
    email: '',
    
    // Address fields
    addressHome: '',
    addressOffice: '',
    
    // Company fields
    companyName: '',
    
    // Phone fields
    residentLandline: '',
    officeLandline: '',
    
    // Additional editable fields
    gender: '',
    maritalStatus: '',
    nationality: '',
    aadhaarId: '',
    bloodGroup: '',
    dob: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    profilePhotoUrl: '',
    spouseName: '',
    spouseContactNumber: '',
    childrenCount: '',
    
    // Social media fields
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    whatsapp: '',
    
    familyMembers: []
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
      
    console.log('📄 Profile Component Mounted/Updated');
    console.log('👤 User from localStorage:', user);
      
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('✅ Parsed user data:', JSON.stringify(parsedUser, null, 2));
        console.log('📋 Database Field Mapping:');
        console.log('   - S. No.:', parsedUser['S. No.']);
        console.log('   - Name:', parsedUser['Name']);
        console.log('   - Type:', parsedUser.type);
        console.log('   - Mobile:', parsedUser.Mobile);
        console.log('   - Email:', parsedUser.Email);
        console.log('   - Membership number:', parsedUser['Membership number']);
        console.log('   - Address Home:', parsedUser['Address Home']);
        console.log('   - Address Office:', parsedUser['Address Office']);
        console.log('   - Company Name:', parsedUser['Company Name']);
        console.log('   - Resident Landline:', parsedUser['Resident Landline']);
        console.log('   - Office Landline:', parsedUser['Office Landline']);
          
        // Map database fields to profile data
        let mergedData = {
          // Database fields (from Members Table)
          serialNo: parsedUser['S. No.'] || '',
          name: parsedUser['Name'] || '',
          role: parsedUser.type || 'Trustee',
          memberId: parsedUser['Membership number'] || '',
          mobile: parsedUser.Mobile || '',
          email: parsedUser.Email || '',
          addressHome: parsedUser['Address Home'] || '',
          addressOffice: parsedUser['Address Office'] || '',
          companyName: parsedUser['Company Name'] || '',
          residentLandline: parsedUser['Resident Landline'] || '',
          officeLandline: parsedUser['Office Landline'] || '',
            
          // Additional editable fields (not in database)
          gender: '',
          maritalStatus: '',
          nationality: '',
          aadhaarId: '',
          bloodGroup: '',
          dob: '',
          emergencyContactName: '',
          emergencyContactNumber: '',
          profilePhotoUrl: '',
          spouseName: '',
          spouseContactNumber: '',
          childrenCount: '',
          familyMembers: []
        };
          
        // Check if we have user-specific saved profile
        const userKey = `userProfile_${parsedUser.Mobile || parsedUser.mobile || parsedUser.id || 'default'}`;
        const userSpecificProfile = localStorage.getItem(userKey);
          
        // If we have saved profile, merge it (but keep database fields intact)
        if (userSpecificProfile) {
          const parsedProfile = JSON.parse(userSpecificProfile);
          console.log('💾 Merging with user-specific saved profile');
          mergedData = {
            ...mergedData,
            ...parsedProfile,
            // Always prioritize database fields over saved profile
            serialNo: parsedUser['S. No.'] || parsedProfile.serialNo || '',
            name: parsedUser['Name'] || parsedProfile.name || '',
            role: parsedUser.type || parsedProfile.role || 'Trustee',
            memberId: parsedUser['Membership number'] || parsedProfile.memberId || '',
            mobile: parsedUser.Mobile || parsedProfile.mobile || '',
            email: parsedUser.Email || parsedProfile.email || '',
            addressHome: parsedUser['Address Home'] || parsedProfile.addressHome || '',
            addressOffice: parsedUser['Address Office'] || parsedProfile.addressOffice || '',
            companyName: parsedUser['Company Name'] || parsedProfile.companyName || '',
            residentLandline: parsedUser['Resident Landline'] || parsedProfile.residentLandline || '',
            officeLandline: parsedUser['Office Landline'] || parsedProfile.officeLandline || ''
          };
        }
        // Removed fallback to generic profile - each user should have their own profile based on phone number
          
        console.log('📝 Final merged data:', JSON.stringify(mergedData, null, 2));
          
        // Count filled fields
        const filledFields = Object.keys(mergedData).filter(key => mergedData[key] && key !== 'familyMembers').length;
        console.log(`✅ ${filledFields} fields filled from database`);
          
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setProfileData(mergedData);
          
        // Check if any database fields are empty/null - if so, allow editing
        const hasEmptyDbFields = !mergedData.name || !mergedData.mobile || !mergedData.memberId || !mergedData.email || 
                        !mergedData.addressHome || !mergedData.addressOffice || !mergedData.companyName || 
                        !mergedData.residentLandline || !mergedData.officeLandline;
          
        if (hasEmptyDbFields) {
          console.log('⚠️ Database fields are incomplete - allowing editing');
          setIsEditing(true);
          setIsFromDatabase(true); // Still from database but allowing edits
        } else {
          setIsEditing(false); // Don't allow editing database fields by default
          setIsFromDatabase(true);
        }
          
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
      }
    } else {
      console.log('🆕 New profile - manual entry mode (no user logged in)');
    }
  }, []); // Remove user from dependency array to avoid infinite loop



  const handleSave = () => {
    if (!profileData.name || !profileData.role) {
      alert('Please fill Name and Role');
      return;
    }
    
    // Validate Aadhaar ID format if provided
    if (profileData.aadhaarId && profileData.aadhaarId.length > 0) {
      const cleanId = profileData.aadhaarId.replace(/\s/g, '');
      if (cleanId.length !== 12 || !/^[0-9]{12}$/.test(cleanId)) {
        alert('Please enter a valid 12-digit Aadhaar ID');
        return;
      }
    }
    
    // Validate emergency contact if provided
    if (profileData.emergencyContactNumber && profileData.emergencyContactNumber.length > 0) {
      if (profileData.emergencyContactNumber.length !== 10 && profileData.emergencyContactNumber.length !== 12) {
        alert('Please enter a valid 10-digit emergency contact number');
        return;
      }
    }
    
    console.log('💾 Saving profile data to localStorage:', JSON.stringify(profileData, null, 2));
    
    // Save profile data with user-specific key based on phone number
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userKey = `userProfile_${parsedUser.mobile || parsedUser['Mobile'] || parsedUser.id || 'default'}`;
      localStorage.setItem(userKey, JSON.stringify(profileData));
      console.log(`✅ Profile saved to user-specific key: ${userKey}`);
    } else {
      console.warn('⚠️ No user found in localStorage, cannot save profile');
    }
    
    console.log('✅ Profile saved successfully');
    
    if (onProfileUpdate) onProfileUpdate(profileData);
    alert('Profile saved successfully! ✅');
  };

  return (


    <div className="h-full flex flex-col bg-white font-sans relative">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          Edit Profile
        </h1>
        <button
          onClick={onNavigateBack}
          className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <HomeIcon className="h-5 w-5 text-indigo-600" />
        </button>
      </div>

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={onNavigate}
        currentPage="profile"
      />

      <div className="flex-1 overflow-y-auto pb-40">
        {/* Profile Identity Section */}
        <div className="px-6 pt-8 pb-10 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-gray-50 overflow-hidden transform transition-all group-hover:scale-105">
              {profileData.profilePhotoUrl ? (
                <img 
                  src={profileData.profilePhotoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-[2.5rem]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${profileData.name || 'User'}&background=0D8ABC&color=fff`;
                  }}
                />
              ) : profileData.name ? (
                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center text-indigo-600 text-4xl font-black">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <UserCircle className="h-20 w-20 text-indigo-100" />
              )}
            </div>
            {isEditing && (
              <button 
                onClick={() => document.getElementById('profile-photo-upload').click()}
                className="absolute -bottom-1 -right-1 bg-indigo-600 p-3 rounded-2xl border-4 border-white text-white shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const updatedProfileData = { ...profileData, profilePhotoUrl: reader.result };
                    setProfileData(updatedProfileData);
                                    
                    // Save updated profile with photo to user-specific storage based on phone number
                    const user = localStorage.getItem('user');
                    if (user) {
                      const parsedUser = JSON.parse(user);
                      const userKey = `userProfile_${parsedUser.mobile || parsedUser['Mobile'] || parsedUser.id || 'default'}`;
                      localStorage.setItem(userKey, JSON.stringify(updatedProfileData));
                      console.log(`✅ Photo saved to user-specific key: ${userKey}`);
                    } else {
                      console.warn('⚠️ No user found in localStorage, cannot save photo');
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{profileData.name || 'Set Your Name'}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-2.5 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50">
              <BadgeCheck className="h-4 w-4 text-indigo-600 fill-indigo-600/10" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="px-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <InputField
              label="Full Name"
              icon={User}
              value={profileData.name}
              disabled={!isEditing || (isFromDatabase && profileData.name)}
              onChange={(val) => setProfileData({ ...profileData, name: val })}
              placeholder="e.g. Rajesh Kumar"
            />
            <InputField
              label="Mobile Number"
              icon={Phone}
              value={profileData.mobile}
              disabled={!isEditing || (isFromDatabase && profileData.mobile)}
              onChange={(val) => setProfileData({ ...profileData, mobile: val })}
              placeholder="00000 00000"
            />
            <InputField
              label="Member ID"
              icon={Briefcase}
              value={profileData.memberId}
              disabled={!isEditing || (isFromDatabase && profileData.memberId)}
              onChange={(val) => setProfileData({ ...profileData, memberId: val })}
              placeholder="MAH-2024-XXXX"
            />
            <InputField
              label="Email ID"
              icon={Mail}
              type="email"
              value={profileData.email}
              disabled={!isEditing || (isFromDatabase && profileData.email)}
              onChange={(val) => setProfileData({ ...profileData, email: val })}
              placeholder="name@hospital.com"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Gender"
                icon={User}
                value={profileData.gender}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, gender: val })}
                placeholder="Male/Female/Other"
              />
              <InputField
                label="Marital Status"
                icon={User}
                value={profileData.maritalStatus}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, maritalStatus: val })}
                placeholder="Single/Married"
              />
            </div>
            <InputField
              label="Home Address"
              icon={MapPin}
              value={profileData.addressHome}
              disabled={!isEditing || (isFromDatabase && profileData.addressHome)}
              onChange={(val) => setProfileData({ ...profileData, addressHome: val })}
              placeholder="House No, Street, City"
            />
            <InputField
              label="Office Address"
              icon={MapPin}
              value={profileData.addressOffice}
              disabled={!isEditing || (isFromDatabase && profileData.addressOffice)}
              onChange={(val) => setProfileData({ ...profileData, addressOffice: val })}
              placeholder="Office Address"
            />
            <InputField
              label="Company Name"
              icon={Briefcase}
              value={profileData.companyName}
              disabled={!isEditing || (isFromDatabase && profileData.companyName)}
              onChange={(val) => setProfileData({ ...profileData, companyName: val })}
              placeholder="Company Name"
            />
            <InputField
              label="Resident Landline"
              icon={Phone}
              value={profileData.residentLandline}
              disabled={!isEditing || (isFromDatabase && profileData.residentLandline)}
              onChange={(val) => setProfileData({ ...profileData, residentLandline: val })}
              placeholder="Resident Landline"
            />
            <InputField
              label="Office Landline"
              icon={Phone}
              value={profileData.officeLandline}
              disabled={!isEditing || (isFromDatabase && profileData.officeLandline)}
              onChange={(val) => setProfileData({ ...profileData, officeLandline: val })}
              placeholder="Office Landline"
            />
            <InputField
              label="Aadhaar / Govt ID"
              icon={Shield}
              value={profileData.aadhaarId}
              disabled={!isEditing}
              onChange={(val) => {
                const formatted = val.replace(/\D/g, '').replace(/(\d{4})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
                  let result = p1;
                  if (p2) result += ' ' + p2;
                  if (p3) result += ' ' + p3;
                  return result;
                });
                setProfileData({ ...profileData, aadhaarId: formatted });
              }}
              placeholder="0000 0000 0000"
            />
            <InputField
              label="Emergency Contact Name"
              icon={User}
              value={profileData.emergencyContactName}
              disabled={!isEditing}
              onChange={(val) => setProfileData({ ...profileData, emergencyContactName: val })}
              placeholder="e.g. Spouse Name"
            />
            <InputField
              label="Emergency Contact Number"
              icon={Phone}
              value={profileData.emergencyContactNumber}
              disabled={!isEditing}
              onChange={(val) => setProfileData({ ...profileData, emergencyContactNumber: val })}
              placeholder="00000 00000"
            />
          </div>

          {/* Secondary Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              Security & Identity
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Blood Group"
                  icon={Droplet}
                  value={profileData.bloodGroup}
                  disabled={false}
                  onChange={(val) => setProfileData({ ...profileData, bloodGroup: val })}
                  placeholder="O+"
                />
                <InputField
                  label="Date of Birth"
                  icon={Calendar}
                  type="date"
                  value={profileData.dob}
                  disabled={false}
                  onChange={(val) => setProfileData({ ...profileData, dob: val })}
                />
              </div>
              <InputField
                label="Address"
                icon={MapPin}
                value={profileData.address}
                disabled={false}
                onChange={(val) => setProfileData({ ...profileData, address: val })}
                placeholder="House No, Street, City"
              />
            </div>
          </div>

          {/* Spouse Information */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Spouse Information
            </h3>
            <div className="space-y-4">
              <InputField
                label="Spouse Name"
                icon={User}
                value={profileData.spouseName}
                disabled={false}
                onChange={(val) => setProfileData({ ...profileData, spouseName: val })}
                placeholder="e.g. Priya Sharma"
              />
              <InputField
                label="Spouse Contact Number"
                icon={Phone}
                value={profileData.spouseContactNumber}
                disabled={false}
                onChange={(val) => setProfileData({ ...profileData, spouseContactNumber: val })}
                placeholder="00000 00000"
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              Family Information
            </h3>
            <div className="space-y-4">
              <InputField
                label="Number of Children"
                icon={User}
                type="number"
                value={profileData.childrenCount}
                disabled={false}
                onChange={(val) => setProfileData({ ...profileData, childrenCount: val })}
                placeholder="0"
              />
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-gray-700">Family Members</h4>
                  <button 
                    onClick={() => {
                      const newFamilyMember = {
                        id: Date.now(),
                        name: '',
                        relation: '',
                        age: '',
                        dob: '',
                        bloodGroup: '',
                        contactNo: ''
                      };
                      setProfileData({
                        ...profileData,
                        familyMembers: [...profileData.familyMembers, newFamilyMember]
                      });
                    }}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <span>➕</span> Add Family Member
                  </button>
                </div>
                </div>
                
                <div className="space-y-3">
                  {profileData.familyMembers.map((member, index) => (
                    <div key={member.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-bold text-gray-700">Family Member {index + 1}</h5>
                        <button 
                          onClick={() => {
                            const updatedFamily = profileData.familyMembers.filter((_, i) => i !== index);
                            setProfileData({
                              ...profileData,
                              familyMembers: updatedFamily
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Name</label>
                          <input
                            type="text"
                            value={member.name}
                            disabled={false}
                            onChange={(e) => {
                              const updatedFamily = [...profileData.familyMembers];
                              updatedFamily[index].name = e.target.value;
                              setProfileData({ ...profileData, familyMembers: updatedFamily });
                            }}
                            className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Relation</label>
                          <input
                            type="text"
                            value={member.relation}
                            disabled={false}
                            onChange={(e) => {
                              const updatedFamily = [...profileData.familyMembers];
                              updatedFamily[index].relation = e.target.value;
                              setProfileData({ ...profileData, familyMembers: updatedFamily });
                            }}
                            className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. Son"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Age / DOB</label>
                          <input
                            type="text"
                            value={member.age}
                            disabled={false}
                            onChange={(e) => {
                              const updatedFamily = [...profileData.familyMembers];
                              updatedFamily[index].age = e.target.value;
                              setProfileData({ ...profileData, familyMembers: updatedFamily });
                            }}
                            className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Age or DOB"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Blood Group</label>
                          <input
                            type="text"
                            value={member.bloodGroup}
                            disabled={false}
                            onChange={(e) => {
                              const updatedFamily = [...profileData.familyMembers];
                              updatedFamily[index].bloodGroup = e.target.value;
                              setProfileData({ ...profileData, familyMembers: updatedFamily });
                            }}
                            className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g. O+"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Contact No (optional)</label>
                        <input
                          type="text"
                          value={member.contactNo}
                          disabled={false}
                          onChange={(e) => {
                            const updatedFamily = [...profileData.familyMembers];
                            updatedFamily[index].contactNo = e.target.value;
                            setProfileData({ ...profileData, familyMembers: updatedFamily });
                          }}
                          className="w-full px-3 py-2 text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="00000 00000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Information */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.218.682-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.092-.647.35-1.088.635-1.338-2.22-.253-4.555-1.11-4.555-4.94 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.84-2.339 4.686-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.16 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Social Media
            </h3>
            <div className="space-y-4">
              <InputField
                label="Facebook"
                icon={() => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V15H7.562v-3h2.875V9.5c0-2.847 1.725-4.407 4.167-4.407 1.183 0 2.406.21 2.406.21v2.64h-1.36c-1.337 0-1.762.83-1.762 1.67v1.98h3.013l-.487 3H14v6.75c4.781-.751 8.438-4.888 8.438-9.879z"/></svg>}
                value={profileData.facebook}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, facebook: val })}
                placeholder="https://facebook.com/username"
              />
              <InputField
                label="Twitter / X"
                icon={() => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                value={profileData.twitter}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, twitter: val })}
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="Instagram"
                icon={() => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none"/></svg>}
                value={profileData.instagram}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, instagram: val })}
                placeholder="https://instagram.com/username"
              />
              <InputField
                label="LinkedIn"
                icon={() => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                value={profileData.linkedin}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, linkedin: val })}
                placeholder="https://linkedin.com/in/username"
              />
              <InputField
                label="WhatsApp"
                icon={() => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>}
                value={profileData.whatsapp}
                disabled={!isEditing}
                onChange={(val) => setProfileData({ ...profileData, whatsapp: val })}
                placeholder="https://wa.me/phone_number"
              />
            </div>
          </div>
        </div>
    
      {/* Sticky Bottom Action Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
        <button
          onClick={handleSave}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Save className="h-5 w-5" />
          </div>
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
