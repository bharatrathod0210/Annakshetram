import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Search, Filter, RefreshCw, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Clock, Eye, X, AlertCircle, TrendingUp
} from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function fmtDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// ── Badge components (defined outside to avoid re-mount on render) ────────────

function StatusBadge({ status }) {
  const map = {
    SUCCESS: 'bg-green-100 text-green-700 border-green-200',
    FAILED:  'bg-red-100 text-red-700 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };
  const icons = {
    SUCCESS: <CheckCircle className="w-3 h-3" />,
    FAILED:  <XCircle className="w-3 h-3" />,
    PENDING: <Clock className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {icons[status]} {status}
    </span>
  );
}

function OperationBadge({ operation }) {
  const map = {
    CREATE:  'bg-blue-100 text-blue-700',
    UPDATE:  'bg-indigo-100 text-indigo-700',
    VERIFY:  'bg-purple-100 text-purple-700',
    CAPTURE: 'bg-teal-100 text-teal-700',
    REFUND:  'bg-orange-100 text-orange-700',
    FAILED:  'bg-red-100 text-red-700',
    RETRY:   'bg-yellow-100 text-yellow-700',
    DELETE:  'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[operation] || 'bg-gray-100 text-gray-600'}`}>
      {operation}
    </span>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({ log, onClose }) {
  if (!log) return null;

  const Section = ({ title, children }) => (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">{children}</div>
    </div>
  );

  const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right break-all">{value || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Payment Log Details</h3>
              <p className="text-xs text-gray-500">{log.orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5">
          {/* Status row */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-lg">
            <StatusBadge status={log.status} />
            <OperationBadge operation={log.operation} />
            <span className="text-sm text-gray-500 ml-auto">{fmtDate(log.timestamp)}</span>
          </div>

          <Section title="Payment Info">
            <Row label="Amount" value={fmt(log.amount)} />
            <Row label="Currency" value={log.currency} />
            <Row label="Payment Method" value={log.paymentMethod} />
            <Row label="Payment Status" value={log.paymentStatus} />
            <Row label="Razorpay Order ID" value={log.razorpayOrderId} />
            <Row label="Razorpay Payment ID" value={log.razorpayPaymentId} />
          </Section>

          <Section title="User Info">
            <Row label="Name" value={log.userName} />
            <Row label="Email" value={log.userEmail} />
            <Row label="Phone" value={log.userPhone} />
          </Section>

          {log.reason && (
            <Section title="Reason">
              <p className="text-sm text-gray-700">{log.reason}</p>
            </Section>
          )}

          {log.errorDetails && Object.keys(log.errorDetails).some(k => log.errorDetails[k]) && (
            <Section title="Error Details">
              <Row label="Code" value={log.errorDetails.code} />
              <Row label="Description" value={log.errorDetails.description} />
              <Row label="Source" value={log.errorDetails.source} />
              <Row label="Step" value={log.errorDetails.step} />
            </Section>
          )}

          {log.refundDetails?.refundId && (
            <Section title="Refund Details">
              <Row label="Refund ID" value={log.refundDetails.refundId} />
              <Row label="Refund Amount" value={log.refundDetails.refundAmount ? fmt(log.refundDetails.refundAmount) : '—'} />
              <Row label="Refund Status" value={log.refundDetails.refundStatus} />
              <Row label="Refunded At" value={fmtDate(log.refundDetails.refundedAt)} />
            </Section>
          )}

          <Section title="System Info">
            <Row label="IP Address" value={log.ipAddress} />
            <Row label="Device" value={log.deviceInfo} />
          </Section>

          {log.notes && (
            <Section title="Notes">
              <p className="text-sm text-gray-700">{log.notes}</p>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ stats }) {
  if (!stats) return null;
  const { summary } = stats;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Logs',    value: summary.total,       color: 'text-gray-900',   bg: 'bg-gray-50',   icon: <CreditCard className="w-5 h-5 text-gray-500" /> },
        { label: 'Successful',    value: summary.success,     color: 'text-green-700',  bg: 'bg-green-50',  icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
        { label: 'Failed',        value: summary.failed,      color: 'text-red-700',    bg: 'bg-red-50',    icon: <XCircle className="w-5 h-5 text-red-500" /> },
        { label: 'Success Rate',  value: `${summary.successRate}%`, color: 'text-blue-700', bg: 'bg-blue-50', icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
      ].map(s => (
        <div key={s.label} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
          <div className="shrink-0">{s.icon}</div>
          <div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const OPERATIONS = ['', 'CREATE', 'UPDATE', 'VERIFY', 'CAPTURE', 'REFUND', 'FAILED', 'RETRY', 'DELETE'];
const STATUSES   = ['', 'SUCCESS', 'FAILED', 'PENDING'];
const PER_PAGE   = 10;

export default function AdminPaymentLogs() {
  const [logs, setLogs]         = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState(null);

  // Filters
  const [search, setSearch]         = useState('');
  const [filterOp, setFilterOp]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/payment-logs/stats');
      setStats(res.data.data);
    } catch { /* silent */ }
  }, []);

  const fetchLogs = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: PER_PAGE });
      if (filterOp)     params.set('operation', filterOp);
      if (filterStatus) params.set('status', filterStatus);
      if (startDate)    params.set('startDate', startDate);
      if (endDate)      params.set('endDate', endDate);
      if (search.trim()) {
        // search by orderId
        params.set('orderId', search.trim());
      }
      const res = await api.get(`/admin/payment-logs?${params}`);
      setLogs(res.data.data.logs);
      setTotal(res.data.data.pagination.total);
      setPages(res.data.data.pagination.pages);
      setPage(pg);
    } catch {
      toast.error('Failed to load payment logs');
    } finally {
      setLoading(false);
    }
  }, [filterOp, filterStatus, startDate, endDate, search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterOp('');
    setFilterStatus('');
    setStartDate('');
    setEndDate('');
  };

  const hasFilters = search || filterOp || filterStatus || startDate || endDate;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Payment Logs</h1>
          <p className="text-gray-500 text-sm mt-0.5">All payment transactions and events</p>
        </div>
        <button
          onClick={() => { fetchLogs(page); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          {/* Search by Order ID */}
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs font-medium text-gray-500 block mb-1">Search by Order ID</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="e.g. ORD-12345"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
              />
            </div>
          </div>

          {/* Operation filter */}
          <div className="min-w-[140px]">
            <label className="text-xs font-medium text-gray-500 block mb-1">Operation</label>
            <select
              value={filterOp}
              onChange={e => setFilterOp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
            >
              {OPERATIONS.map(op => (
                <option key={op} value={op}>{op || 'All Operations'}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="min-w-[130px]">
            <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s || 'All Statuses'}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="min-w-[140px]">
            <label className="text-xs font-medium text-gray-500 block mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="text-xs font-medium text-gray-500 block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" /> Apply
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <AlertCircle className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">No payment logs found</p>
            {hasFilters && <p className="text-sm mt-1">Try clearing the filters</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Operation</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Razorpay Payment ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log, idx) => (
                  <tr key={log._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {log.orderId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OperationBadge operation={log.operation} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                      {fmt(log.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800 font-medium leading-tight">{log.userName || '—'}</div>
                      <div className="text-gray-400 text-xs">{log.userEmail || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      {log.razorpayPaymentId ? (
                        <span className="font-mono text-xs text-gray-600">{log.razorpayPaymentId}</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {fmtDate(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(log)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)}</span> of <span className="font-semibold text-gray-700">{total}</span> logs
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchLogs(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                // Show pages around current page
                let pg;
                if (pages <= 7) {
                  pg = i + 1;
                } else if (page <= 4) {
                  pg = i + 1;
                } else if (page >= pages - 3) {
                  pg = pages - 6 + i;
                } else {
                  pg = page - 3 + i;
                }
                return (
                  <button
                    key={pg}
                    onClick={() => fetchLogs(pg)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                      pg === page
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-white'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => fetchLogs(page + 1)}
                disabled={page >= pages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <DetailModal log={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
