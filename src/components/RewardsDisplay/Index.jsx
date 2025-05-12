// src/components/RewardsDisplay/index.jsx
import React from 'react';

const RewardsDisplay = ({ wallet, balance }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Your Rewards</h3>
      <div className="bg-gray-50 p-4 rounded">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-2xl font-bold">{balance} SOL</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Attendance Rewards</span>
            <span className="font-medium">0.1 SOL/day</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Project Completion</span>
            <span className="font-medium">0.5 SOL/project</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsDisplay;