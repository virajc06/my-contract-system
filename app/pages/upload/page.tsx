"use client"

import React, { useState } from 'react'
import ContractForm from '@/components/ContractForm';

function UploadPage() {
      const [contracts, setContracts] = useState<any[]>([]);
      const [clientName, setClientName] = useState('');
      const [contractData, setContractData] = useState('');

        // Upload contract
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contracts', {
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
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to upload contract');
      console.error(error);
    }
  };
  return (
    <div className='min-h-screen bg-gray-100 p-8 text-black'>
        <h1>Upload Page</h1>
        <ContractForm     
          handleUpload={handleUpload}
          clientName={clientName}
          setClientName={setClientName}
          contractData={contractData}
          setContractData={setContractData}
        />
    </div>
  )
}

export default UploadPage