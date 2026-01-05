import React from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Home as HomeIcon, ChevronLeft, Download } from 'lucide-react';

const Reports = ({ onNavigate }) => {
  const memberReports = [
    { id: 1, name: 'Blood Test Report', date: '2024-12-15', type: 'Pathology', status: 'Completed', hospital: 'Apollo Main Hospital' },
    { id: 2, name: 'X-Ray Chest PA', date: '2024-12-10', type: 'Radiology', status: 'Completed', hospital: 'Care Hospital' },
    { id: 3, name: 'Sugar & Lipid Profile', date: '2024-11-25', type: 'Pathology', status: 'Completed', hospital: 'Apollo Main Hospital' },
  ];

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => {
            // Back button functionality - go to previous page or home
            onNavigate('home');
          }}
          className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <ChevronLeft className="h-5 w-5 text-indigo-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Medical Reports</h1>
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-indigo-600"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      </div>



      {/* Header Section */}
      <div className="bg-white px-6 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Test History</h1>
            <p className="text-gray-500 text-sm font-medium">Access your digital medical records</p>
          </div>
        </div>
      </div>

      {/* Upload Report Section */}
      <div className="px-6 mt-4">
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-200">
              <Plus className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-800">Upload New Report</h2>
              <p className="text-gray-600 text-xs mt-1">Add your medical test reports and documents</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Report Name</label>
                <input
                  type="text"
                  placeholder="e.g., Blood Test Report"
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Report Type</label>
                <select className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium">
                  <option value="">Select type</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Upload File</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="report-upload"
                />
                <label
                  htmlFor="report-upload"
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-bold">Choose File or Drag & Drop</span>
                  <span className="text-xs text-gray-500">(PDF, JPG, PNG)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Test Date</label>
              <input
                type="date"
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>

            <button
              type="button"
              onClick={() => alert('Report uploaded successfully!')}
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Upload Report
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="px-6 py-4 space-y-4">
        {memberReports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group hover:shadow-md hover:border-indigo-100 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                    {report.name}
                  </h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1 bg-gray-50 px-2 py-0.5 rounded-full inline-block">
                    {report.hospital}
                  </p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {report.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-semibold">{report.date}</span>
              </div>
              <button 
                onClick={() => alert(`Downloading ${report.name}...`)}
                className="flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold border border-indigo-100"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        ))}

        {memberReports.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-300">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-800 font-bold">No reports found</h3>
            <p className="text-gray-500 text-sm mt-1">Your medical reports will appear here</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 mt-4">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-xl shadow-sm">
            <Shield className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-[11px] font-bold text-indigo-900 leading-tight">
            Your medical records are encrypted and stored securely following HIPAA compliance guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;