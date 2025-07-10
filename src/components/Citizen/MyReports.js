import { CheckCircle, Clock, MapPin, Calendar, MessageSquare } from 'lucide-react';

const MyReports = ({ reports }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'open':
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-50 border-green-200';
      case 'open':
      default:
        return 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const location = report.binId?.location?.name || 'Unknown Location';
        const binType = report.binId?.type || '';
        const formattedLocation = `${location}${binType ? ` (${binType})` : ''}`;

        return (
          <div
            key={report._id}
            className={`bg-white rounded-lg shadow-sm border p-6 ${getStatusColor(report.status)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(report.status)}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Bin Issue - {formattedLocation}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formattedLocation}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  report.status === 'resolved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                {report.status === 'resolved' ? 'Resolved' : 'Open'}
              </span>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm leading-relaxed">{report.message}</p>
              </div>
            </div>

            {report.status === 'resolved' && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✅ This issue has been resolved. Thank you for helping keep our community clean!
                </p>
              </div>
            )}
          </div>
        );
      })}

      {reports.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-green-100 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-600">
            You haven't submitted any reports. Use the "Report Issue" tab to report bin problems in your area.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyReports;

