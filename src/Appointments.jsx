import React from 'react';
import { User, Users, Clock, FileText, UserPlus, Bell, ChevronRight, LogOut, Heart, Shield, Plus, ArrowRight, Pill, ShoppingCart, Calendar, Stethoscope, Building2, Phone, QrCode, Monitor, Brain, Package, FileCheck, Search, Filter, MapPin, Star, HelpCircle, BookOpen, Video, Headphones, Home as HomeIcon, ChevronLeft } from 'lucide-react';

const doctors = [
  { id: 1, name: 'Dr. Amit Desai', specialization: 'Cardiologist', experience: '20 Years', availability: 'Mon-Sat: 10AM-5PM', phone: '+91 98765 11111' },
  { id: 2, name: 'Dr. Neha Kapoor', specialization: 'Neurologist', experience: '15 Years', availability: 'Mon-Fri: 9AM-4PM', phone: '+91 98765 22222' },
  { id: 3, name: 'Dr. Ravi Joshi', specialization: 'Orthopedic', experience: '18 Years', availability: 'Tue-Sat: 11AM-6PM', phone: '+91 98765 33333' },
  { id: 4, name: 'Dr. Sanjana Iyer', specialization: 'Pediatrician', experience: '12 Years', availability: 'Mon-Sat: 8AM-2PM', phone: '+91 98765 44444' },
  { id: 5, name: 'Dr. Kiran Shah', specialization: 'General Physician', experience: '25 Years', availability: 'Mon-Sat: 9AM-7PM', phone: '+91 98765 55555' },
];

const Appointments = ({ onNavigate, appointmentForm, setAppointmentForm }) => {

  return (
    <div className="bg-white min-h-screen pb-10 relative">
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button
          onClick={() => {
            // Back button functionality - go to previous page or home
            onNavigate('home');
          }}
          className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <ChevronLeft className="h-5 w-5 text-indigo-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Book Appointment</h1>
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
            <Clock className="h-12 w-12 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
            <p className="text-gray-500 text-sm font-medium">Schedule your visit with our doctors</p>
          </div>
        </div>
      </div>

      {/* Appointment Form */}
      <div className="px-6 py-4">
        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Patient Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({...appointmentForm, patientName: e.target.value})}
                placeholder="Enter full name"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                required
                maxLength="10"
                value={appointmentForm.phone}
                onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="10 digit mobile number"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Select Doctor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Stethoscope className="h-5 w-5 text-gray-400" />
              </div>
              <select
                required
                value={appointmentForm.doctor}
                onChange={(e) => setAppointmentForm({...appointmentForm, doctor: e.target.value})}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="">Choose a doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} - {doc.specialization}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  required
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
                >
                  <option value="">Select slot</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={appointmentForm.email || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                placeholder="your.email@example.com"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Age</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                max="120"
                value={appointmentForm.age || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, age: e.target.value})}
                placeholder="Enter age"
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={appointmentForm.gender || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, gender: e.target.value})}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Appointment Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={appointmentForm.appointmentType || ''}
                onChange={(e) => setAppointmentForm({...appointmentForm, appointmentType: e.target.value})}
                className="block w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 appearance-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              >
                <option value="">Select type</option>
                <option value="General Consultation">General Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Specialist Consultation">Specialist Consultation</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Reason for Visit</label>
            <textarea
              required
              value={appointmentForm.reason}
              onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
              placeholder="Briefly describe your symptoms or reason for visit..."
              rows="3"
              className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Previous Medical History (Optional)</label>
            <textarea
              value={appointmentForm.medicalHistory || ''}
              onChange={(e) => setAppointmentForm({...appointmentForm, medicalHistory: e.target.value})}
              placeholder="Any previous medical conditions, allergies, or medications..."
              rows="2"
              className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium resize-none"
            />
          </div>

          <button
            type="button"
            onClick={() => alert('Appointment booked successfully!')}
            className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Confirm Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointments;