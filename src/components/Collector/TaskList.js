import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  X,
  Trash2,
  Truck,
} from 'lucide-react';

const TaskList = ({ tasks, onTaskComplete, onTaskSkip }) => {
  const [skipModalOpen, setSkipModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState('');

  const priorityColor = (p) =>
    p === 'high' ? 'text-red-600' : p === 'medium' ? 'text-orange-600' : 'text-green-600';

  const statusIcon = (s) =>
    s === 'completed' ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : s === 'skipped' ? (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    ) : (
      <Clock className="h-5 w-5 text-orange-600" />
    );

  const typeEmoji = (t) =>
    ({ school: '🏫', residential: '🏠', public: '🏛️', depot: '🏭' }[t] || '📍');

  const openSkip = (id) => {
    setSelectedId(id);
    setReason('');
    setSkipModalOpen(true);
  };

  const submitSkip = () => {
    if (selectedId && reason.trim()) {
      onTaskSkip(selectedId, reason.trim());
      setSkipModalOpen(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Collection Tasks</h3>
        <p className="text-sm text-gray-600 mt-1">
          {tasks.filter((t) => t.status === 'pending').length} pending ·{' '}
          {tasks.filter((t) => t.status === 'completed').length} completed ·{' '}
          {tasks.filter((t) => t.status === 'skipped').length} skipped
        </p>
      </div>

      <div className="divide-y">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`p-6 transition ${
              t.status === 'completed'
                ? 'bg-green-50'
                : t.status === 'skipped'
                ? 'bg-red-50'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex space-x-4 flex-1 items-start">
                <div className="flex space-x-2 items-center">
                  {statusIcon(t.status)}
                  <span className="text-2xl">{typeEmoji(t.type)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{t.placename}</h4>
                    <span className={`text-sm font-medium ${priorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex space-x-6 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {t.lat?.toFixed(3)}, {t.lng?.toFixed(3)}
                    </span>
                    <span>Fill {t.fillLevel}%</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 h-2 rounded-full max-w-xs">
                      <div
                        className={`h-2 rounded-full ${
                          t.fillLevel >= 90
                            ? 'bg-red-600'
                            : t.fillLevel >= 75
                            ? 'bg-orange-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${t.fillLevel}%` }}
                      />
                    </div>
                  </div>

                  {t.skipReason && (
                    <p className="mt-2 text-sm text-red-600">
                      <strong>Skipped:</strong> {t.skipReason}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {t.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => openSkip(t.id)}
                      className="px-3 py-2 text-sm bg-gray-100 rounded-lg flex items-center space-x-1 hover:bg-gray-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Skip</span>
                    </button>
                    <button
                      onClick={() => onTaskComplete(t.id)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg flex items-center space-x-1 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete</span>
                    </button>
                  </>
                ) : t.status === 'completed' ? (
                  <span className="text-green-600 text-sm font-medium">✓Completed</span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">⚠Skipped</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No collection tasks assigned.</p>
        </div>
      )}

      {skipModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-lg font-semibold">Skip Task</h2>
              <button onClick={() => setSkipModalOpen(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Bin unreachable, road blocked..."
              />
            </div>
            <div className="flex space-x-3 p-6 border-t">
              <button
                className="flex-1 border rounded-lg px-4 py-2"
                onClick={() => setSkipModalOpen(false)}
              >
                Cancel
              </button>
              <button
                disabled={!reason.trim()}
                className="flex-1 bg-red-600 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                onClick={submitSkip}
              >
                Skip Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
