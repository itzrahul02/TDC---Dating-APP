export default function StatusBadge({ status }) {
  const styles = {
    'Searching': 'bg-yellow-100 text-yellow-700',
    'Intro Sent': 'bg-purple-100 text-purple-700',
    'Matched': 'bg-green-100 text-green-700',
    'On Hold': 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
