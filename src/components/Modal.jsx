import { useState } from 'react';

export default function Modal({ client, match, onClose, onConfirm }) {
  const [body, setBody] = useState(
    `Hi ${client.firstName},\n\nWe found a great match for you!\n\n` +
    `Name: ${match.firstName} ${match.lastName}\n` +
    `Age: ${match.age} | City: ${match.city}\n` +
    `Designation: ${match.designation} at ${match.company}\n` +
    `Education: ${match.education}\n\n` +
    `${match.intro || ''}\n\n` +
    `Best regards,\nYour Matchmaker at TDC`
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Send Match Introduction</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">To:</label>
            <p className="text-gray-800">{client.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Subject:</label>
            <p className="text-gray-800">We found a great match for you — {match.firstName} {match.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Body:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-48 mt-1 p-3 border border-gray-200 rounded-lg resize-none text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            Confirm Send
          </button>
        </div>
      </div>
    </div>
  );
}
