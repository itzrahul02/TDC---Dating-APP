import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const { data } = await api.get(`/api/clients/${id}`);
      setClient(data);
      setNotes(data.notes || '');
    } catch (error) {
      toast.error('Client not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { data } = await api.patch(`/api/clients/${id}`, { status: newStatus });
      setClient(data);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNotesChange = async (e) => {
    const value = e.target.value;
    setNotes(value);
    // Debounced save (save on blur instead)
  };

  const saveNotes = async () => {
    try {
      await api.patch(`/api/clients/${id}`, { notes });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  if (loading) return <div className="flex min-h-screen"><Sidebar /><div className="flex-1 ml-64 p-6 flex items-center justify-center text-gray-400">Loading...</div></div>;
  if (!client) return null;

  const initials = `${client.firstName[0]}${client.lastName[0]}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-gray-500">{client.age} yrs • {client.city} • {client.gender}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={client.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option>Searching</option>
              <option>Intro Sent</option>
              <option>Matched</option>
              <option>On Hold</option>
            </select>
            <StatusBadge status={client.status} />
          </div>
        </div>

        {/* Biodata Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Section title="Personal">
            <Field label="DOB" value={client.dob} />
            <Field label="Gender" value={client.gender} />
            <Field label="Height" value={`${client.height} cm`} />
            <Field label="Religion" value={client.religion} />
            <Field label="Caste" value={client.caste} />
            <Field label="Mother Tongue" value={client.motherTongue} />
            <Field label="Diet" value={client.diet} />
            <Field label="Marital Status" value={client.maritalStatus} />
          </Section>

          <Section title="Education & Career">
            <Field label="Education" value={client.education} />
            <Field label="College" value={client.college} />
            <Field label="Company" value={client.company} />
            <Field label="Designation" value={client.designation} />
            <Field label="Income" value={`₹${client.income} LPA`} />
          </Section>

          <Section title="Preferences">
            <Field label="Wants Kids" value={client.wantKids} />
            <Field label="Open to Relocate" value={client.openToRelocate} />
            <Field label="Open to Pets" value={client.openToPets} />
            <Field label="Family Type" value={client.familyType} />
          </Section>

          <Section title="Family & Languages">
            <Field label="Siblings" value={client.siblings} />
            <Field label="Languages" value={client.languages?.join(', ')} />
            <Field label="Email" value={client.email} />
            <Field label="Phone" value={client.phone} />
          </Section>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-5 shadow mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Matchmaker Notes</h3>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            onBlur={saveNotes}
            className="w-full h-28 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-rose-500 outline-none"
            placeholder="Add notes about this client..."
          />
        </div>

        {/* Find Matches Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/client/${id}/matches`)}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            Find Matches →
          </button>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value || '—'}</span>
    </div>
  );
}
