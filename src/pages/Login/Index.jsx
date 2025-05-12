import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Connection, PublicKey } from '@solana/web3.js';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.solana) {
        throw new Error('Phantom wallet tidak ditemukan! Silakan install Phantom wallet.');
      }

      const response = await window.solana.connect();
      const wallet = response.publicKey.toString(); 
      
      // Fetch balance untuk verifikasi
      const balance = await connection.getBalance(new PublicKey(response.publicKey));
      
      // Login menggunakan AuthContext
      const userData = await login(wallet);
      
      // Simpan balance
      localStorage.setItem('balance', balance / 1000000000); // Convert lamports to SOL

      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          WorkChain Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your Phantom wallet to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={connectWallet}
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading 
                ? 'bg-primary-300 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect Phantom Wallet'
            )}
          </button>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500">
              Don't have Phantom wallet?{' '}
              <a 
                href="https://phantom.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Install here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;