import React, { useState } from 'react';
import referralService from '../api/referralService';

function ReferralDataTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Running comprehensive referral data test...');

      // Test 1: Check authentication
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      const authTest = {
        tokenExists: !!token,
        userDataExists: !!userData,
        tokenLength: token ? token.length : 0
      };

      // Test 2: Test backend connection
      const connectionTest = await referralService.testConnection();

      // Test 3: Fetch referral data
      const dataTest = await referralService.getReferralMetrics();

      // Test 4: Test downline data
      const downlineTest = await referralService.getReferralDownline();

      setTestResult({
        timestamp: new Date().toISOString(),
        auth: authTest,
        connection: connectionTest,
        referralData: dataTest,
        downlineData: downlineTest
      });

    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Referral Data Test</h2>
      
      <button
        onClick={runTest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg mb-4"
      >
        {loading ? 'Running Tests...' : 'Run Comprehensive Test'}
      </button>

      {testResult && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Test Results ({testResult.timestamp})</h3>
            
            {testResult.error ? (
              <div className="text-red-600">
                <strong>Error:</strong> {testResult.error}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Authentication Test */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">🔐 Authentication Test</h4>
                  <div className="text-sm space-y-1">
                    <div>Token: {testResult.auth.tokenExists ? '✅ Present' : '❌ Missing'}</div>
                    <div>User Data: {testResult.auth.userDataExists ? '✅ Present' : '❌ Missing'}</div>
                    <div>Token Length: {testResult.auth.tokenLength}</div>
                  </div>
                </div>

                {/* Connection Test */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">🌐 Backend Connection Test</h4>
                  <div className="text-sm space-y-1">
                    <div>Status: {testResult.connection.success ? '✅ Connected' : '❌ Failed'}</div>
                    {testResult.connection.error && (
                      <div className="text-red-600">Error: {testResult.connection.error}</div>
                    )}
                  </div>
                </div>

                {/* Referral Data Test */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium">📊 Referral Data Test</h4>
                  <div className="text-sm space-y-1">
                    <div>Status: {testResult.referralData.success ? '✅ Success' : '❌ Failed'}</div>
                    {testResult.referralData.success ? (
                      <div className="bg-white p-2 rounded border">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(testResult.referralData.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-red-600">Error: {testResult.referralData.error}</div>
                    )}
                  </div>
                </div>

                {/* Downline Data Test */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">👥 Downline Data Test</h4>
                  <div className="text-sm space-y-1">
                    <div>Status: {testResult.downlineData.success ? '✅ Success' : '❌ Failed'}</div>
                    {testResult.downlineData.success ? (
                      <div>
                        <div>Total Referrals: {testResult.downlineData.total}</div>
                        {testResult.downlineData.data.length > 0 && (
                          <div className="bg-white p-2 rounded border mt-2">
                            <pre className="text-xs overflow-auto">
                              {JSON.stringify(testResult.downlineData.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600">Error: {testResult.downlineData.error}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralDataTest;
