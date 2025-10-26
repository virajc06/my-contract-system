import React from 'react'

interface ContractFormProps {
    handleUpload : any,
    clientName: any,
    setClientName: any,
    contractData: any, 
    setContractData: any,
}

function ContractForm({handleUpload,clientName,setClientName,contractData, setContractData}:ContractFormProps) {
  return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload New Contract</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Data (JSON or Text)
              </label>
              <textarea
                value={contractData}
                onChange={(e) => setContractData(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                placeholder='{"terms": "...", "amount": 10000}'
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Upload Contract
            </button>
          </form>
        </div>
  )
}

export default ContractForm