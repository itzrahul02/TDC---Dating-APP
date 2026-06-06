import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getTopMatches } from '../logic/matchScore';
import { getMatchIntros } from '../api/claudeIntro';
import Sidebar from '../components/Sidebar';
import MatchCard from '../components/MatchCard';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';

export default function Matches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [matches, setMatches] = useState([]);
  const [intros, setIntros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    loadMatches();
  }, [id]);

  const loadMatches = async () => {
    try {
      const [clientRes, poolRes] = await Promise.all([
        api.get(`/api/clients/${id}`),
        api.get('/api/pool')
      ]);

      const clientData = clientRes.data;
      setClient(clientData);

      const topMatches = getTopMatches(clientData, poolRes.data);
      setMatches(topMatches);
      setLoading(false);

      // Fetch AI intros
      if (topMatches.length > 0) {
        setAiLoading(true);
        const aiIntros = await getMatchIntros(clientData, topMatches);
        setIntros(aiIntros);
        setAiLoading(false);
      }
    } catch (error) {
      toast.error('Failed to load matches');
      setLoading(false);
    }
  };

  const handleSendMatch = (match, index) => {
    setSelectedMatch({ ...match, intro: intros[index] || '' });
  };

  const handleConfirmSend = async () => {
    try {
      await api.patch(`/api/clients/${id}`, { status: 'Intro Sent' });
      toast.success('Match intro sent!');
      setSelectedMatch(null);
    } catch (error) {
      toast.error('Failed to send match');
    }
  };

  if (loading) return <div className="flex min-h-screen"><Sidebar /><div className="flex-1 ml-64 p-6 flex items-center justify-center text-gray-400">Finding best matches...</div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 ml-64">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/client/${id}`)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Matches for {client?.firstName} {client?.lastName}
          </h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No compatible matches found in the pool.
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, index) => (
              <MatchCard
                key={match.profileId}
                match={match}
                intro={intros[index]}
                aiLoading={aiLoading}
                onSendMatch={() => handleSendMatch(match, index)}
              />
            ))}
          </div>
        )}

        {/* Send Match Modal */}
        {selectedMatch && (
          <Modal
            client={client}
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onConfirm={handleConfirmSend}
          />
        )}
      </main>
    </div>
  );
}
