export default function MatchCard({ match, intro, aiLoading, onSendMatch }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{match.badge}</span>
            <span className="text-sm font-semibold text-gray-700">{match.label}</span>
            <span className="text-sm text-gray-400">Score: {match.score}/100</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {match.firstName} {match.lastName}
          </h3>
          <p className="text-sm text-gray-500">
            {match.age} yrs • {match.city} • {match.designation}
          </p>

          {/* Reason pills */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {match.reasons.map((reason, i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full font-medium">
                {reason}
              </span>
            ))}
          </div>

          {/* AI Intro */}
          <div className="mt-3">
            {aiLoading ? (
              <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
            ) : intro ? (
              <p className="text-sm text-gray-600 italic">"{intro}"</p>
            ) : null}
          </div>
        </div>

        <button
          onClick={onSendMatch}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition whitespace-nowrap"
        >
          Send Match
        </button>
      </div>
    </div>
  );
}
