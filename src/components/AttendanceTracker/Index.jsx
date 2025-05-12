import React, { useState, useEffect } from 'react';

const AttendanceTracker = ({ wallet }) => {
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load attendance from localStorage
    const savedAttendance = localStorage.getItem(`attendance_${wallet}`);
    if (savedAttendance) {
      try {
        const parsed = JSON.parse(savedAttendance);
        setAttendance(Array.isArray(parsed) ? parsed : []);
        
        // Check today's record
        const today = new Date().toISOString().split('T')[0];
        const lastRecord = parsed.find(record => record.date === today);
        if (lastRecord) {
          setTodayRecord(lastRecord);
        }
      } catch (err) {
        console.error('Error parsing attendance:', err);
        setAttendance([]);
      }
    }
  }, [wallet]);

  const saveAttendance = (newAttendance) => {
    localStorage.setItem(`attendance_${wallet}`, JSON.stringify(newAttendance));
    setAttendance(newAttendance);
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser Anda tidak mendukung geolokasi'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Gagal mendapatkan lokasi: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  const checkIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      if (todayRecord) {
        throw new Error('Anda sudah check-in hari ini');
      }

      const location = await getCurrentLocation();
      const now = new Date();

      const newRecord = {
        date: today,
        wallet,
        checkIn: {
          timestamp: now.toISOString(),
          location
        },
        checkOut: null
      };

      const newAttendance = [...attendance, newRecord];
      saveAttendance(newAttendance);
      setTodayRecord(newRecord);

    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.message || 'Terjadi kesalahan saat check-in');
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!todayRecord) {
        throw new Error('Anda belum check-in hari ini');
      }

      if (todayRecord.checkOut) {
        throw new Error('Anda sudah check-out hari ini');
      }

      const location = await getCurrentLocation();
      const now = new Date();

      const updatedRecord = {
        ...todayRecord,
        checkOut: {
          timestamp: now.toISOString(),
          location
        }
      };

      const newAttendance = attendance.map(record => 
        record.date === updatedRecord.date ? updatedRecord : record
      );

      saveAttendance(newAttendance);
      setTodayRecord(updatedRecord);

    } catch (err) {
      console.error('Check-out error:', err);
      setError(err.message || 'Terjadi kesalahan saat check-out');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getAttendanceStatus = () => {
    if (!todayRecord) return 'not-checked-in';
    if (!todayRecord.checkOut) return 'checked-in';
    return 'checked-out';
  };

  const renderActionButton = () => {
    const status = getAttendanceStatus();
    
    if (loading) {
      return (
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        </button>
      );
    }

    switch (status) {
      case 'not-checked-in':
        return (
          <button
            onClick={checkIn}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            Check In
          </button>
        );
      case 'checked-in':
        return (
          <button
            onClick={checkOut}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
          >
            Check Out
          </button>
        );
      case 'checked-out':
        return (
          <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
            Selesai
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Attendance Tracker</h3>
          <p className="text-sm text-gray-500">
            {!todayRecord ? (
              'Belum check-in hari ini'
            ) : !todayRecord.checkOut ? (
              `Check-in: ${formatDate(todayRecord.checkIn?.timestamp)}`
            ) : (
              `Check-out: ${formatDate(todayRecord.checkOut?.timestamp)}`
            )}
          </p>
        </div>
        {renderActionButton()}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">Riwayat Kehadiran</h4>
        <div className="divide-y divide-gray-200">
          {attendance.length === 0 ? (
            <p className="text-gray-500 py-4">Belum ada riwayat kehadiran</p>
          ) : (
            attendance.map((record, index) => (
              <div key={index} className="py-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(record.date)}
                    </p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.checkOut 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.checkOut ? 'Selesai' : 'Sedang Berlangsung'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    {record.checkIn && (
                      <p>
                        Check-in: {formatDate(record.checkIn.timestamp)}
                        <br />
                        Lokasi: {record.checkIn.location.latitude.toFixed(6)}, {record.checkIn.location.longitude.toFixed(6)}
                      </p>
                    )}
                    {record.checkOut && (
                      <p>
                        Check-out: {formatDate(record.checkOut.timestamp)}
                        <br />
                        Lokasi: {record.checkOut.location.latitude.toFixed(6)}, {record.checkOut.location.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;