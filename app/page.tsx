'use client';

import { useState, useEffect } from 'react';
import ContractForm from '../components/ContractForm';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');
  const [contractData, setContractData] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Fetch contracts from Supabase
  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContracts(data || []);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  // Fetch contracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []);

  // Upload contract
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([
          {
            client_name: clientName,
            contract_data: contractData,
            status: 'Draft'
          }
        ])
        .select();

      if (error) throw error;

      alert('Contract uploaded successfully!');
      setClientName('');
      setContractData('');
      fetchContracts();
    } catch (error) {
      alert('Failed to upload contract');
      console.error(error);
    }
  };

  // Delete contract
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Contract deleted successfully!');
      fetchContracts();
    } catch (error) {
      alert('Failed to delete contract');
      console.error(error);
    }
  };

  // Filter contracts based on search and status
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.client_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
          
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading contracts...</p>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          ) : filteredContracts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {contracts.length === 0 
                ? 'No contracts yet. Upload your first contract above!'
                : 'No contracts match your search criteria.'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
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
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(contract.created_at).toLocaleDateString()}
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
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => {
                        setClientName(contract.client_name);
                        setContractData(contract.contract_data);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      onClick={() => handleDelete(contract.id)}
                    >
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