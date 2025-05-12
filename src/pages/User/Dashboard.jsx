import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AttendanceTracker from '../../components/AttendanceTracker';
import Layout from '../../components/Layout/Layout';
import RewardsDisplay from '../../components/RewardsDisplay';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch balance logic here
    const savedBalance = localStorage.getItem('balance');
    if (savedBalance) {
      setBalance(savedBalance);
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <Layout balance={balance}>
      <div className="grid grid-cols-1 gap-6">
        <AttendanceTracker wallet={user.wallet} />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <RewardsDisplay wallet={user.wallet} balance={balance} />
      </div>
    </Layout>
  );
};

export default UserDashboard;