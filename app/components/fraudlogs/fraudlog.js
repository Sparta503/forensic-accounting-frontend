"use client";

import { useState, useMemo } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX, 
  Search, 
  Filter,
  Calendar,
  User,
  CreditCard,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

// Sample fraud log data
const sampleFraudLogs = [
  {
    id: "FR-2024-001",
    timestamp: "2024-01-15T14:30:00",
    user: "john.doe@email.com",
    type: "Suspicious Login",
    location: "Moscow, Russia",
    ipAddress: "185.220.101.45",
    riskLevel: "high",
    status: "flagged",
    amount: null,
    description: "Login attempt from unusual location outside user's normal pattern"
  },
  {
    id: "FR-2024-002",
    timestamp: "2024-01-15T12:15:00",
    user: "jane.smith@email.com",
    type: "Large Transaction",
    location: "New York, USA",
    ipAddress: "192.168.1.45",
    riskLevel: "medium",
    status: "reviewing",
    amount: 25000,
    description: "Unusually large transfer exceeding user's historical pattern"
  },
  {
    id: "FR-2024-003",
    timestamp: "2024-01-15T10:45:00",
    user: "mike.wilson@email.com",
    type: "Multiple Failed Attempts",
    location: "London, UK",
    ipAddress: "203.0.113.78",
    riskLevel: "low",
    status: "resolved",
    amount: null,
    description: "Multiple failed password attempts, user confirmed legitimate access"
  },
  {
    id: "FR-2024-004",
    timestamp: "2024-01-14T18:20:00",
    user: "sarah.jones@email.com",
    type: "Card Fraud",
    location: "Unknown",
    ipAddress: "198.51.100.23",
    riskLevel: "high",
    status: "blocked",
    amount: 5000,
    description: "Stolen card used for online purchase, immediately blocked"
  },
  {
    id: "FR-2024-005",
    timestamp: "2024-01-14T16:00:00",
    user: "robert.brown@email.com",
    type: "Velocity Check",
    location: "Toronto, Canada",
    ipAddress: "192.0.2.156",
    riskLevel: "medium",
    status: "reviewing",
    amount: 1200,
    description: "Multiple transactions within short timeframe"
  },
  {
    id: "FR-2024-006",
    timestamp: "2024-01-14T11:30:00",
    user: "lisa.davis@email.com",
    type: "Account Takeover",
    location: "Beijing, China",
    ipAddress: "103.235.46.89",
    riskLevel: "high",
    status: "flagged",
    amount: 15000,
    description: "Suspicious account behavior suggesting potential compromise"
  },
  {
    id: "FR-2024-007",
    timestamp: "2024-01-13T22:45:00",
    user: "david.miller@email.com",
    type: "Geolocation Anomaly",
    location: "São Paulo, Brazil",
    ipAddress: "177.234.152.11",
    riskLevel: "low",
    status: "resolved",
    amount: 250,
    description: "User confirmed travel, transaction legitimate"
  },
  {
    id: "FR-2024-008",
    timestamp: "2024-01-13T19:15:00",
    user: "emma.taylor@email.com",
    type: "Device Change",
    location: "Berlin, Germany",
    ipAddress: "91.198.174.12",
    riskLevel: "medium",
    status: "reviewing",
    amount: null,
    description: "Login from new device, awaiting user verification"
  }
];

const riskConfig = {
  high: {
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600",
    borderColor: "border-red-500/30",
    icon: ShieldX,
    label: "High Risk"
  },
  medium: {
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-500/30",
    icon: AlertTriangle,
    label: "Medium Risk"
  },
  low: {
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
    borderColor: "border-green-500/30",
    icon: ShieldCheck,
    label: "Low Risk"
  }
};

const statusConfig = {
  flagged: { color: "bg-amber-500", text: "Flagged", icon: AlertTriangle },
  reviewing: { color: "bg-blue-500", text: "Reviewing", icon: Clock },
  resolved: { color: "bg-green-500", text: "Resolved", icon: CheckCircle },
  blocked: { color: "bg-red-500", text: "Blocked", icon: XCircle }
};

const fraudTypeIcons = {
  "Suspicious Login": User,
  "Large Transaction": CreditCard,
  "Multiple Failed Attempts": ShieldAlert,
  "Card Fraud": CreditCard,
  "Velocity Check": Clock,
  "Account Takeover": ShieldX,
  "Geolocation Anomaly": Globe,
  "Device Change": User
};

export default function FraudLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    return sampleFraudLogs.filter((log) => {
      const matchesSearch = 
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = riskFilter === "all" || log.riskLevel === riskFilter;
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [searchQuery, riskFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: sampleFraudLogs.length,
      highRisk: sampleFraudLogs.filter(l => l.riskLevel === "high").length,
      mediumRisk: sampleFraudLogs.filter(l => l.riskLevel === "medium").length,
      lowRisk: sampleFraudLogs.filter(l => l.riskLevel === "low").length,
      flagged: sampleFraudLogs.filter(l => l.status === "flagged").length,
      blocked: sampleFraudLogs.filter(l => l.status === "blocked").length
    };
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-yellow-400" />
            Fraud Detection Logs
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Monitor and manage suspicious activities in real-time
          </p>
        </div>
        
        {/* STATS CARDS */}
        <div className="flex gap-3">
          <div className="bg-gradient-to-br from-red-500/20 to-red-700/20 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 py-2">
            <div className="text-red-400 text-xs">High Risk</div>
            <div className="text-white font-bold text-lg">{stats.highRisk}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl px-4 py-2">
            <div className="text-yellow-400 text-xs">Medium Risk</div>
            <div className="text-white font-bold text-lg">{stats.mediumRisk}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-sm border border-green-500/30 rounded-xl px-4 py-2">
            <div className="text-green-400 text-xs">Low Risk</div>
            <div className="text-white font-bold text-lg">{stats.lowRisk}</div>
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* SEARCH */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by ID, user, type, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-500/50 focus:bg-white/15 transition-all"
            />
          </div>
          
          {/* RISK FILTER */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/50"
            >
              <option value="all" className="bg-gray-800">All Risk Levels</option>
              <option value="high" className="bg-gray-800">High Risk</option>
              <option value="medium" className="bg-gray-800">Medium Risk</option>
              <option value="low" className="bg-gray-800">Low Risk</option>
            </select>
          </div>
          
          {/* STATUS FILTER */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/50"
          >
            <option value="all" className="bg-gray-800">All Status</option>
            <option value="flagged" className="bg-gray-800">Flagged</option>
            <option value="reviewing" className="bg-gray-800">Reviewing</option>
            <option value="resolved" className="bg-gray-800">Resolved</option>
            <option value="blocked" className="bg-gray-800">Blocked</option>
          </select>
        </div>
      </div>

      {/* FRAUD LOGS TABLE */}
      <div className="relative">
        {/* BACKDROP GLOW */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 blur-3xl opacity-30 rounded-3xl" />
        
        <div className="relative bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 text-white text-xs uppercase">
                  <th className="px-4 py-3 font-semibold tracking-wide">Log ID</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Time</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">User</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Type</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Risk Level</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Status</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Amount</th>
                  <th className="px-4 py-3 font-semibold tracking-wide">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  const risk = riskConfig[log.riskLevel];
                  const status = statusConfig[log.status];
                  const TypeIcon = fraudTypeIcons[log.type] || ShieldAlert;
                  const RiskIcon = risk.icon;
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-yellow-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 group-hover:text-yellow-700">
                        {log.id}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {log.user}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${risk.color} bg-opacity-10`}>
                            <TypeIcon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700">{log.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${risk.bgColor} border ${risk.borderColor}`}>
                          <RiskIcon className={`w-3 h-3 ${risk.textColor}`} />
                          <span className={`text-xs font-medium ${risk.textColor}`}>
                            {risk.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon className={`w-3 h-3 ${status.color.replace('bg-', 'text-')}`} />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono">
                        {log.amount ? `$${log.amount.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-gray-400" />
                          {log.location}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No fraud logs match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOG DETAIL MODAL */}
      {selectedLog && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div 
            className="bg-gradient-to-br from-yellow-900 via-amber-800 to-black text-white rounded-2xl p-6 max-w-lg w-full shadow-[0_0_40px_rgba(234,179,8,0.3)] border border-yellow-400/30 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedLog.id}</h3>
                <p className="text-yellow-200/70 text-sm">{selectedLog.type}</p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Risk Level</span>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${riskConfig[selectedLog.riskLevel].bgColor} border ${riskConfig[selectedLog.riskLevel].borderColor}`}>
                  {(() => {
                    const Icon = riskConfig[selectedLog.riskLevel].icon;
                    return <Icon className={`w-3 h-3 ${riskConfig[selectedLog.riskLevel].textColor}`} />;
                  })()}
                  <span className={`text-xs font-medium ${riskConfig[selectedLog.riskLevel].textColor}`}>
                    {riskConfig[selectedLog.riskLevel].label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${statusConfig[selectedLog.status].color}`}>
                  {statusConfig[selectedLog.status].text}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">User</span>
                <span className="text-white">{selectedLog.user}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Timestamp</span>
                <span className="text-white">{formatDate(selectedLog.timestamp)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Location</span>
                <span className="text-white">{selectedLog.location}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">IP Address</span>
                <span className="text-white font-mono text-sm">{selectedLog.ipAddress}</span>
              </div>
              
              {selectedLog.amount && (
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Amount</span>
                  <span className="text-white font-mono">${selectedLog.amount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="py-2">
                <span className="text-white/60 block mb-2">Description</span>
                <p className="text-white/90 text-sm leading-relaxed bg-white/5 rounded-lg p-3">
                  {selectedLog.description}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2.5 rounded-xl transition-all">
                Mark as Resolved
              </button>
              <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl transition-all border border-white/20">
                Escalate
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}