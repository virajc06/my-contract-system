'use client';

import { useState, useEffect } from 'react';
import ContractForm from '../components/ContractForm';

export default function Home() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [contractData, setContractData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch contracts (you'll implement this later)
  const fetchContracts = async () => {
    // TODO: Implement fetch from API
    console.log('Fetching contracts...');
  };

  // Upload contract
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: clientName,
          contract_data: contractData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Contract uploaded successfully!');
        setClientName('');
        setContractData('');
        fetchContracts();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to upload contract');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Contract Management System
        </h1>
        <ContractForm     
          handleUpload={handleUpload}
          clientName={clientName}
          setClientName={setClientName}
          contractData={contractData}
          setContractData={setContractData}
        />


        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Client Name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search contracts..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="Draft">Draft</option>
                <option value="Finalized">Finalized</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contracts List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Contracts</h2>
          
          {contracts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No contracts yet. Upload your first contract above!
            </p>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{contract.client_name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        ID: {contract.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        contract.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}