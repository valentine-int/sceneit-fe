import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReports, updateReportStatus } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

function statusBadgeClass(status) {
  if (status === 'removed') return 'bg-red-500/15 text-red-400';
  if (status === 'reviewed') return 'bg-green-500/15 text-green-400';
  return 'bg-yellow-500/15 text-yellow-400';
}

function AdminReports() {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getReports();
      setReports(result.reports || []);
    } catch (err) {
      console.error('ADMIN REPORTS LOAD ERROR:', err);
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAction = async (reportId, status) => {
    if (processingId) return;
    const confirmMessage =
      status === 'removed'
        ? 'Delete this review permanently? This cannot be undone.'
        : 'Mark this report as reviewed (no action taken on the review)?';
    if (!window.confirm(confirmMessage)) return;

    try {
      setProcessingId(reportId);
      await updateReportStatus(reportId, status);
      setReports((current) =>
        current.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      showToast(
        status === 'removed' ? 'Review removed.' : 'Report marked as reviewed.',
        'success'
      );
    } catch (err) {
      console.error('ADMIN REPORT ACTION ERROR:', err);
      showToast(err.message || 'Failed to update report.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminLayout title="Report Moderation">
      {loading && (
        <div className="py-16 text-center text-sm text-[#93939A]">
          <i className="ri-loader-4-line animate-spin mr-2"></i>
          Loading reports...
        </div>
      )}

      {!loading && error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="py-16 text-center text-sm text-[#93939A]">
          <i className="ri-shield-check-line mb-2 block text-3xl text-[#52525B]"></i>
          No reports yet. All clear!
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-[#27272A] bg-[#12141C] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadgeClass(report.status)}`}
                >
                  {report.status}
                </span>
                <span className="text-xs text-[#71717A]">
                  Reported by {report.reporter?.name || 'Unknown'}
                </span>
              </div>

              <p className="mt-3 text-sm text-[#D4D4D8]">
                <span className="font-semibold text-[#F4F4F5]">Reason: </span>
                {report.reason}
              </p>

              <div className="mt-3 rounded-lg bg-[#090A0F] p-3">
                <div className="flex items-center gap-1.5 text-xs text-[#93939A]">
                  <i className="ri-star-fill text-yellow-400"></i>
                  {report.review?.rating ?? 'N/A'}/10
                </div>
                <p className="mt-1 text-sm text-[#D4D4D8]">
                  {report.review?.content || '(Review content unavailable — may already be deleted)'}
                </p>
              </div>

              {report.status === 'pending' && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAction(report.id, 'reviewed')}
                    disabled={processingId === report.id}
                    className="rounded-lg border border-[#27272A] px-3.5 py-2 text-xs font-medium text-[#D4D4D8] transition-colors hover:bg-[#1A1C24] disabled:opacity-50"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(report.id, 'removed')}
                    disabled={processingId === report.id}
                    className="rounded-lg bg-red-500/15 px-3.5 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                  >
                    {processingId === report.id ? 'Removing...' : 'Remove Review'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminReports;