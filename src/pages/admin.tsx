import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// import '../styles/admin-dashboard.css';

interface Student {
  id: string;
  studentName: string;
  age: number;
  parentName: string;
  phone: string;
  email: string;
  location: 'KATY' | 'SUGARLAND';
  frequency: 'ONCE_A_WEEK' | 'TWICE_A_WEEK';
  selectedDays: string[];
  startDate: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
}

type SortConfig = { key: keyof Student; direction: 'asc' | 'desc' } | null;

const AdminPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [edited, setEdited] = useState<Record<string, Partial<Student>>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [showTable, setShowTable] = useState(true);
  const [showAllStudents, setShowAllStudents] = useState(true);
  const [showPaidStudents, setShowPaidStudents] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [customEvents, setCustomEvents] = useState<{ date: string; note: string }[]>([]);
  const [newEventNote, setNewEventNote] = useState('');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventNote, setEventNote] = useState('');



  const classStartDates = students.map(s => new Date(s.startDate).toDateString());

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isStart = classStartDates.includes(date.toDateString());
      const isEvent = customEvents.some(e => e.date === date.toDateString());
      if (isStart) return 'highlight-start';
      if (isEvent) return 'highlight-event';
    }
    return null;
  };


  


  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get<Student[]>('/api/admin/students');
      setStudents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = <K extends keyof Student>(id: string, field: K, value: Student[K]) => {
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleSave = async (id: string) => {
    try {
      await axios.put(`/api/admin/students/${id}`, edited[id]);
      fetchStudents();
      alert('Student updated!');
    } catch (err) { console.error(err); alert('Update failed.'); }
  };

  const requestSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    if (!sortConfig) return students;
    const sorted = [...students].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === 'number' && typeof bVal === 'number')
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [students, sortConfig]);

  const paidStudents = sortedStudents.filter(s => s.paymentStatus === 'PAID');

  const renderStudentTable = (studentList: Student[]) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
      <thead className="bg-gray-100">
        <tr>
          {['studentName','age','parentName','phone','email','location','frequency','paymentStatus','startDate'].map((key) => (
            <th
              key={key}
              onClick={() => requestSort(key as keyof Student)}
              className="px-4 py-2 text-gray-600 uppercase font-semibold tracking-wide text-left cursor-pointer"
            >
              <div className="flex items-center">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                {sortConfig?.key === key && (
                  <span className="ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                )}
              </div>
            </th>
          ))}
          <th className="px-4 py-2 text-gray-600 uppercase font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {studentList.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-4 py-2"><input className="admin-input" value={edited[s.id]?.studentName ?? s.studentName} onChange={e => handleChange(s.id, 'studentName', e.target.value)} /></td>
            <td className="px-4 py-2"><input type="number" className="admin-input" value={edited[s.id]?.age ?? s.age} onChange={e => handleChange(s.id, 'age', parseInt(e.target.value, 10) || 0)} /></td>
            <td className="px-4 py-2"><input className="admin-input" value={edited[s.id]?.parentName ?? s.parentName} onChange={e => handleChange(s.id, 'parentName', e.target.value)} /></td>
            <td className="px-4 py-2"><input className="admin-input" value={edited[s.id]?.phone ?? s.phone} onChange={e => handleChange(s.id, 'phone', e.target.value)} /></td>
            <td className="px-4 py-2"><input className="admin-input" value={edited[s.id]?.email ?? s.email} onChange={e => handleChange(s.id, 'email', e.target.value)} /></td>
            <td className="px-4 py-2"><select className="admin-select" value={edited[s.id]?.location ?? s.location} onChange={e => handleChange(s.id, 'location', e.target.value as Student['location'])}><option value="KATY">Katy</option><option value="SUGARLAND">Sugar Land</option></select></td>
            <td className="px-4 py-2"><select className="admin-select" value={edited[s.id]?.frequency ?? s.frequency} onChange={e => handleChange(s.id, 'frequency', e.target.value as Student['frequency'])}><option value="ONCE_A_WEEK">Once a Week</option><option value="TWICE_A_WEEK">Twice a Week</option></select></td>
            <td className="px-4 py-2"><select className="admin-select" value={edited[s.id]?.paymentStatus ?? s.paymentStatus} onChange={e => handleChange(s.id, 'paymentStatus', e.target.value as Student['paymentStatus'])}><option value="PENDING">Pending</option><option value="PAID">Paid</option><option value="FAILED">Failed</option></select></td>
            <td className="px-4 py-2"><input type="date" className="admin-input" value={edited[s.id]?.startDate?.substring(0,10) ?? s.startDate.substring(0,10)} onChange={e => handleChange(s.id, 'startDate', e.target.value)} /></td>
            <td className="px-4 py-2"><button className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600" onClick={() => handleSave(s.id)}>Save</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  
);



return (
  <div className="admin-wrapper p-4 md:p-8 bg-[#fdf8ef] min-h-screen">
    <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Welcome Ms. Cristina!</h1>

    <div className="flex flex-col gap-6">
  {/* Full Student Registry */}
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-xl font-semibold text-gray-700">Full Student Registry</h2>
      <button
        className="bg-pink-500 text-white font-medium px-4 py-1 rounded hover:bg-pink-600 transition"
        onClick={() => setShowAllStudents(prev => !prev)}
      >
        {showAllStudents ? 'Hide' : 'View'}
      </button>
    </div>
    {showAllStudents && renderStudentTable(sortedStudents)}
  </div>

  {/* Confirmed Roster (Paid Students Only) */}
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-xl font-semibold text-green-700">Confirmed Roster (Paid Only)</h2>
      <button
        className="bg-green-600 text-white font-medium px-4 py-1 rounded hover:bg-green-700 transition"
        onClick={() => setShowPaidStudents(prev => !prev)}
      >
        {showPaidStudents ? 'Hide' : 'View'}
      </button>
    </div>
    {showPaidStudents && renderStudentTable(paidStudents)}
  </div>

{/* Calendar Widget */}
<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl mx-auto">
  <h2 className="text-xl font-semibold text-pink-700 mb-4 flex items-center gap-2">
    📅 Class Start Calendar
  </h2>

  <Calendar
  onChange={(value) => {
    const date = Array.isArray(value) ? value[0] : value; // handle range mode too
    if (date) setCalendarDate(date);
  }}
  value={calendarDate}
  tileClassName={tileClassName}
/>


  <div className="mt-4 flex justify-between items-center">
    <p className="text-gray-600">
      Selected Date: <strong>{calendarDate.toDateString()}</strong>
    </p>
    <button
      className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
      onClick={() => {
        setEventDate(calendarDate); // preload with calendar date
        setIsModalOpen(true);
      }}
    >
      ➕ Add Event
    </button>
  </div>
</div>

{/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold text-pink-700 mb-4">Add Important Event</h3>

      <label className="block mb-2 font-medium text-gray-700">Choose Date:</label>
      <Calendar
        onChange={(date) => {
          if (date instanceof Date) setEventDate(date);
        }}
        value={eventDate}
        className="mb-4 border rounded-lg"
      />

      <label className="block mb-2 font-medium text-gray-700">Event Description:</label>
      <input
        type="text"
        className="w-full px-3 py-2 border rounded mb-4"
        placeholder="hola mami"
        value={eventNote}
        onChange={(e) => setEventNote(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setEventNote('');
            setIsModalOpen(false);
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (eventNote.trim()) {
              setCustomEvents(prev => [...prev, {
                date: eventDate.toDateString(),
                note: eventNote.trim(),
              }]);
              setEventNote('');
              setIsModalOpen(false);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Event
        </button>
      </div>
    </div>
  </div>
)}



</div>

  </div>
);

};

export default AdminPage;
