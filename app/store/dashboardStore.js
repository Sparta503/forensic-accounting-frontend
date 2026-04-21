import { create } from 'zustand';

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

export const useDashboardStore = create((set, get) => ({
  // 🔹 LOADING STATE
  isLoading: false,
  
  // 🔹 STATS FOR CARDS (by role)
  stats: {
    admin: {
      totalUsers: 0,
      fraudAlerts: 0,
      transactions: 0,
    },
    auditor: {
      flaggedTransactions: 0,
      highRiskCases: 0,
      resolvedCases: 0,
    },
    management: {
      activeProjects: 0,
      teamMembers: 0,
      revenueGrowth: 0,
    },
  },

  // 🔹 CHART DATA (by role) - with defaults for SSR
  chartData: {
    admin: {
      line: { 
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], 
        series: [{ name: "Transactions", data: [100, 200, 150, 300, 250, 400] }] 
      },
      pie: { 
        labels: ["High Risk", "Medium", "Low"], 
        series: [50, 30, 20] 
      },
      bar: { 
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], 
        series: [{ name: "Volume", data: [300, 500, 400, 600, 550, 700, 650] }] 
      },
    },
    auditor: {
      line: { 
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], 
        series: [
          { name: "Flagged", data: [10, 25, 18, 40, 35] },
          { name: "Reviewed", data: [5, 15, 12, 20, 25] },
        ] 
      },
      pie: { 
        labels: ["Critical", "Moderate", "Safe"], 
        series: [40, 35, 25] 
      },
      bar: { 
        categories: ["Case1", "Case2", "Case3", "Case4", "Case5"], 
        series: [{ name: "Investigations", data: [20, 35, 25, 40, 30] }] 
      },
    },
    management: {
      line: { 
        categories: ["Q1", "Q2", "Q3", "Q4"], 
        series: [
          { name: "Revenue", data: [500, 700, 650, 900] },
          { name: "Expenses", data: [300, 400, 350, 500] },
        ] 
      },
      pie: { 
        labels: ["Completed", "In Progress", "Pending"], 
        series: [45, 35, 20] 
      },
      bar: { 
        categories: ["Finance", "HR", "IT", "Sales", "Marketing"], 
        series: [{ name: "Performance", data: [85, 92, 78, 95, 88] }] 
      },
    },
  },

  // 🔹 TABLE DATA (by role) - with defaults for SSR
  tableData: {
    admin: [
      { user: "admin@system.com", action: "Login", time: "2 mins ago", status: "Success" },
      { user: "auditor@audit.com", action: "Report Generated", time: "15 mins ago", status: "Completed" },
    ],
    auditor: [
      { id: "#TX123", amount: "$5,000", status: "High Risk" },
      { id: "#TX124", amount: "$200", status: "Review" },
    ],
    management: [
      { department: "Finance", task: "Q3 Budget Review", manager: "John Smith", status: "In Progress", date: "Today" },
      { department: "HR", task: "Employee Onboarding", manager: "Sarah Lee", status: "Completed", date: "Yesterday" },
    ],
  },

  // 🔹 FRAUD LOGS (for auditor role)
  fraudLogs: [
    { id: "FRD-001", user: "John Doe", type: "Card Fraud", amount: "$1,200", risk: "High", status: "Investigating", date: "2026-04-12" },
    { id: "FRD-002", user: "Sarah Lee", type: "Login Anomaly", amount: "$0", risk: "Medium", status: "Reviewed", date: "2026-04-11" },
    { id: "FRD-003", user: "Mike Ross", type: "Transaction Spike", amount: "$5,800", risk: "High", status: "Blocked", date: "2026-04-10" },
    { id: "FRD-004", user: "Emma Stone", type: "Geo Mismatch", amount: "$320", risk: "Low", status: "Resolved", date: "2026-04-09" },
  ],

  // 🔹 AUDIT REPORTS HISTORY
  auditReports: [],

  // 🔹 ADMIN REPORTS (for admin role)
  adminReports: [
    { id: "RPT-001", title: "Fraud Detection Summary", department: "Finance", risk: "High", status: "Pending Review", date: "2026-04-10" },
    { id: "RPT-002", title: "Audit Compliance Report", department: "Compliance", risk: "Medium", status: "Approved", date: "2026-04-09" },
    { id: "RPT-003", title: "System Anomaly Report", department: "IT", risk: "High", status: "Under Review", date: "2026-04-08" },
    { id: "RPT-004", title: "Staff Activity Report", department: "HR", risk: "Low", status: "Resolved", date: "2026-04-07" },
  ],

  // 🔹 DEPARTMENT TASKS (for management role)
  departmentTasks: [
    { id: 1, department: "Finance", task: "Review audit reports", status: "Pending" },
    { id: 2, department: "IT", task: "Investigate login anomalies", status: "In Progress" },
    { id: 3, department: "HR", task: "Staff performance review", status: "Completed" },
  ],

  // 🔹 STAFF OVERVIEW (for management role)
  staffOverview: [
    { id: 1, name: "John Mwangi", department: "Finance", role: "Auditor", status: "Active" },
    { id: 2, name: "Sarah Lee", department: "IT", role: "Security Analyst", status: "On Leave" },
    { id: 3, name: "Mike Ross", department: "Compliance", role: "Investigator", status: "Active" },
    { id: 4, name: "Emma Stone", department: "HR", role: "Manager", status: "Inactive" },
  ],

  // 🔹 PERFORMANCE REPORTS (for management role)
  performanceReports: [], // Populated from audit reports analysis

  // 🔹 USERS (for admin role - user management)
  users: [
    { id: 1, name: "John Mwangi", email: "john@example.com", role: "Admin", status: "Active", lastActive: "2026-04-16" },
    { id: 2, name: "Sarah Lee", email: "sarah@example.com", role: "Auditor", status: "Active", lastActive: "2026-04-15" },
    { id: 3, name: "Mike Ross", email: "mike@example.com", role: "User", status: "Inactive", lastActive: "2026-04-10" },
    { id: 4, name: "Emma Stone", email: "emma@example.com", role: "Manager", status: "Suspended", lastActive: "2026-04-08" },
  ],

  // 🔹 SETTERS
  setStats: (role, stats) => set((state) => ({
    stats: { ...state.stats, [role]: stats },
  })),

  setChartData: (role, data) => set((state) => ({
    chartData: { ...state.chartData, [role]: data },
  })),

  setTableData: (role, data) => set((state) => ({
    tableData: { ...state.tableData, [role]: data },
  })),

  // 🔹 FETCH ALL DATA FOR A ROLE (simulates API call)
  fetchDashboardData: async (role) => {
    // Skip during SSR
    if (!isBrowser) {
      return {
        stats: get().stats[role],
        chartData: get().chartData[role],
        tableData: get().tableData[role],
      };
    }

    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock data based on role
    const data = generateMockData(role);
    
    set((state) => ({
      stats: { ...state.stats, [role]: data.stats },
      chartData: { ...state.chartData, [role]: data.chartData },
      tableData: { ...state.tableData, [role]: data.tableData },
      isLoading: false,
    }));

    return data;
  },

  // 🔹 GETTERS FOR CONVENIENCE
  getStats: (role) => get().stats[role],
  getChartData: (role) => get().chartData[role],
  getTableData: (role) => get().tableData[role],

  // 🔹 ADD FRAUD LOG (from audit analysis)
  addFraudLog: (log) => set((state) => ({
    fraudLogs: [log, ...state.fraudLogs],
  })),

  // 🔹 UPDATE FRAUD LOG STATUS
  updateFraudLogStatus: (id, newStatus) => set((state) => ({
    fraudLogs: state.fraudLogs.map((log) =>
      log.id === id ? { ...log, status: newStatus } : log
    ),
  })),

  // 🔹 PROCESS AUDIT REPORT (analyzes document and updates dashboard)
  processAuditReport: async (file, findings) => {
    set({ isLoading: true });

    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate new fraud logs from findings
    const newFraudLogs = findings.map((finding, index) => ({
      id: `FRD-${Date.now()}-${index}`,
      user: finding.user || "Unknown",
      type: finding.type || "Unknown Fraud",
      amount: finding.amount || "$0",
      risk: finding.risk || "Medium",
      status: "Investigating",
      date: new Date().toISOString().split("T")[0],
    }));

    // Update stats based on findings
    const highRiskCount = findings.filter((f) => f.risk === "High").length;
    const currentStats = get().stats.auditor;

    set((state) => ({
      // Add new fraud logs
      fraudLogs: [...newFraudLogs, ...state.fraudLogs],

      // Update auditor stats
      stats: {
        ...state.stats,
        auditor: {
          ...currentStats,
          flaggedTransactions: currentStats.flaggedTransactions + newFraudLogs.length,
          highRiskCases: currentStats.highRiskCases + highRiskCount,
        },
      },

      // Add to audit reports history
      auditReports: [
        {
          id: `RPT-${Date.now()}`,
          filename: file?.name || "Unknown",
          date: new Date().toLocaleString(),
          findingsCount: findings.length,
          riskLevel: highRiskCount > 0 ? "High" : "Medium",
        },
        ...state.auditReports,
      ],

      isLoading: false,
    }));

    return {
      newFraudLogs,
      totalFindings: findings.length,
      highRiskCount,
    };
  },

  // 🔹 ADD ADMIN REPORT (when auditor submits report)
  addAdminReport: (report) => set((state) => ({
    adminReports: [report, ...state.adminReports],
  })),

  // 🔹 UPDATE ADMIN REPORT STATUS
  updateAdminReportStatus: (id, newStatus) => set((state) => ({
    adminReports: state.adminReports.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    ),
  })),

  // ═══════════════════════════════════════════════════════════
  // MANAGEMENT ACTIONS
  // ═══════════════════════════════════════════════════════════

  // 🔹 ADD DEPARTMENT TASK
  addDepartmentTask: (task) => set((state) => ({
    departmentTasks: [
      {
        id: Date.now(),
        department: task.department,
        task: task.task,
        status: "Pending",
      },
      ...state.departmentTasks,
    ],
  })),

  // 🔹 UPDATE TASK STATUS
  updateTaskStatus: (id, newStatus) => set((state) => ({
    departmentTasks: state.departmentTasks.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    ),
  })),

  // 🔹 DELETE TASK
  deleteTask: (id) => set((state) => ({
    departmentTasks: state.departmentTasks.filter((t) => t.id !== id),
  })),

  // 🔹 ADD STAFF MEMBER
  addStaffMember: (staff) => set((state) => ({
    staffOverview: [
      {
        id: Date.now(),
        name: staff.name,
        department: staff.department,
        role: staff.role,
        status: staff.status || "Active",
      },
      ...state.staffOverview,
    ],
  })),

  // 🔹 UPDATE STAFF STATUS
  updateStaffStatus: (id, newStatus) => set((state) => ({
    staffOverview: state.staffOverview.map((s) =>
      s.id === id ? { ...s, status: newStatus } : s
    ),
  })),

  // 🔹 ADD PERFORMANCE REPORT (from audit analysis)
  addPerformanceReport: (report) => set((state) => ({
    performanceReports: [report, ...state.performanceReports],
  })),

  // ═══════════════════════════════════════════════════════════
  // USER MANAGEMENT ACTIONS (for admin role)
  // ═══════════════════════════════════════════════════════════

  // 🔹 ADD USER
  addUser: (user) => set((state) => ({
    users: [
      {
        id: Date.now(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || "Active",
        lastActive: new Date().toISOString().split("T")[0],
      },
      ...state.users,
    ],
  })),

  // 🔹 UPDATE USER STATUS
  updateUserStatus: (id, newStatus) => set((state) => ({
    users: state.users.map((u) =>
      u.id === id ? { ...u, status: newStatus } : u
    ),
  })),

  // 🔹 UPDATE USER ROLE
  updateUserRole: (id, newRole) => set((state) => ({
    users: state.users.map((u) =>
      u.id === id ? { ...u, role: newRole } : u
    ),
  })),

  // 🔹 DELETE USER
  deleteUser: (id) => set((state) => ({
    users: state.users.filter((u) => u.id !== id),
  })),
}));

// 🔥 MOCK DATA GENERATOR (replace with real API calls)
function generateMockData(role) {
  const stats = {
    admin: {
      totalUsers: Math.floor(Math.random() * 5000) + 1000,
      fraudAlerts: Math.floor(Math.random() * 100) + 10,
      transactions: Math.floor(Math.random() * 20000) + 5000,
    },
    auditor: {
      flaggedTransactions: Math.floor(Math.random() * 200) + 50,
      highRiskCases: Math.floor(Math.random() * 50) + 5,
      resolvedCases: Math.floor(Math.random() * 100) + 20,
    },
    management: {
      activeProjects: Math.floor(Math.random() * 30) + 5,
      teamMembers: Math.floor(Math.random() * 100) + 20,
      revenueGrowth: Math.floor(Math.random() * 50) + 5,
    },
  };

  const chartData = {
    admin: {
      line: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        series: [
          { name: "Transactions", data: [100, 200, 150, 300, 250, 400] },
          { name: "Fraud", data: [20, 40, 30, 80, 60, 90] },
        ],
      },
      pie: {
        labels: ["High Risk", "Medium", "Low"],
        series: [50, 30, 20],
      },
      bar: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        series: [{ name: "Volume", data: [300, 500, 400, 600, 550, 700, 650] }],
      },
    },
    auditor: {
      line: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        series: [
          { name: "Flagged", data: [10, 25, 18, 40, 35] },
          { name: "Reviewed", data: [5, 15, 12, 20, 25] },
        ],
      },
      pie: {
        labels: ["Critical", "Moderate", "Safe"],
        series: [40, 35, 25],
      },
      bar: {
        categories: ["Case1", "Case2", "Case3", "Case4", "Case5"],
        series: [{ name: "Investigations", data: [20, 35, 25, 40, 30] }],
      },
    },
    management: {
      line: {
        categories: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          { name: "Revenue", data: [500, 700, 650, 900] },
          { name: "Expenses", data: [300, 400, 350, 500] },
        ],
      },
      pie: {
        labels: ["Completed", "In Progress", "Pending"],
        series: [45, 35, 20],
      },
      bar: {
        categories: ["Finance", "HR", "IT", "Sales", "Marketing"],
        series: [{ name: "Performance", data: [85, 92, 78, 95, 88] }],
      },
    },
  };

  const tableData = {
    admin: [
      { user: "admin@system.com", action: "Login", time: "2 mins ago", status: "Success" },
      { user: "auditor@audit.com", action: "Report Generated", time: "15 mins ago", status: "Completed" },
      { user: "user@demo.com", action: "Transaction", time: "1 hour ago", status: "Pending" },
      { user: "admin@system.com", action: "User Created", time: "3 hours ago", status: "Success" },
      { user: "system", action: "Backup", time: "6 hours ago", status: "Success" },
      { user: "auditor@audit.com", action: "Fraud Alert", time: "8 hours ago", status: "Reviewed" },
      { user: "user@demo.com", action: "Password Change", time: "12 hours ago", status: "Success" },
      { user: "admin@system.com", action: "Settings Updated", time: "1 day ago", status: "Success" },
    ],
    auditor: [
      { id: "#TX123", amount: "$5,000", status: "High Risk" },
      { id: "#TX124", amount: "$200", status: "Review" },
      { id: "#TX125", amount: "$1,200", status: "Resolved" },
      { id: "#TX126", amount: "$3,500", status: "High Risk" },
      { id: "#TX127", amount: "$800", status: "Review" },
      { id: "#TX128", amount: "$150", status: "Resolved" },
      { id: "#TX129", amount: "$4,200", status: "High Risk" },
      { id: "#TX130", amount: "$600", status: "Review" },
    ],
    management: [
      { department: "Finance", task: "Q3 Budget Review", manager: "John Smith", status: "In Progress", date: "Today" },
      { department: "HR", task: "Employee Onboarding", manager: "Sarah Lee", status: "Completed", date: "Yesterday" },
      { department: "Operations", task: "Audit Compliance", manager: "Mike Chen", status: "Pending", date: "Tomorrow" },
      { department: "IT", task: "System Migration", manager: "David Kim", status: "In Progress", date: "2 days" },
      { department: "Marketing", task: "Campaign Analysis", manager: "Emma Wilson", status: "Review", date: "3 days" },
      { department: "Sales", task: "Quarterly Report", manager: "Alex Brown", status: "Completed", date: "Last week" },
      { department: "Legal", task: "Contract Review", manager: "Lisa Park", status: "Pending", date: "Next week" },
      { department: "Finance", task: "Expense Audit", manager: "John Smith", status: "In Progress", date: "Today" },
    ],
  };

  return {
    stats: stats[role],
    chartData: chartData[role],
    tableData: tableData[role],
  };
}
