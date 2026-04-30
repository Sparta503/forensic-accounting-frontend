import { create } from 'zustand';
import { apiRequest } from '../lib/apiClient';

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

export const useDashboardStore = create((set, get) => ({
  // 🔹 LOADING STATE
  isLoading: false,

  // 🔹 RAW BACKEND DATA (shared across roles)
  backendData: {
    transactions: [],
    flagged: [],
  },
  
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

  // 🔹 CHART DATA (by role) - null until real data is loaded
  chartData: {
    admin: null,
    auditor: null,
    management: null,
  },

  // 🔹 TABLE DATA (by role) - with defaults for SSR
  tableData: {
    admin: [
      { user: "admin@system.com", action: "Login", time: "2 mins ago", status: "Success" },
      { user: "auditor@audit.com", action: "Report Generated", time: "15 mins ago", status: "Completed" },
    ],
    auditor: [
      {
        Date: "20/09/2018 12:04:08",
        Mode: "Cash",
        Category: "Transportation",
        Subcategory: "Train",
        Note: "2 Place 5 to Place 0",
        Amount: 30,
        "Income/Expense": "Expense",
        Currency: "INR",
      },
      {
        Date: "20/09/2018 12:03:15",
        Mode: "Cash",
        Category: "Food",
        Subcategory: "snacks",
        Note: "Idli medu Vada mix 2 plates",
        Amount: 60,
        "Income/Expense": "Expense",
        Currency: "INR",
      },
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

  // 🔹 FLAGGED TRANSACTIONS (high-risk transactional data)
  flaggedTransactions: [
    { transaction_id: "TXN-20001", user: "Alice Johnson", amount: "$8,500", risk: "High", risk_score: 92, status: "Flagged", reason: "Suspicious withdrawal pattern", fraud_reasons: ["Large amount", "Unusual time"], timestamp: "2026-04-12 14:32" },
    { transaction_id: "TXN-20002", user: "Bob Martinez", amount: "$3,200", risk: "High", risk_score: 87, status: "Flagged", reason: "Location mismatch", fraud_reasons: ["Geo mismatch", "Speed of transaction"], timestamp: "2026-04-12 13:15" },
    { transaction_id: "TXN-20003", user: "Carol White", amount: "$15,000", risk: "High", risk_score: 95, status: "Flagged", reason: "Duplicate transaction", fraud_reasons: ["Duplicate detection", "High amount"], timestamp: "2026-04-12 11:45" },
    { transaction_id: "TXN-20004", user: "Diana Lee", amount: "$2,100", risk: "Medium", risk_score: 65, status: "Flagged", reason: "Unusual beneficiary", fraud_reasons: ["New beneficiary", "Pattern change"], timestamp: "2026-04-11 16:20" },
    { transaction_id: "TXN-20005", user: "Eve Taylor", amount: "$5,600", risk: "High", risk_score: 88, status: "Flagged", reason: "Multiple rapid transactions", fraud_reasons: ["Velocity check", "Rapid succession"], timestamp: "2026-04-11 10:30" },
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

    try {
      const tryGetFirst = async (paths) => {
        let last = null;
        for (const p of paths) {
          try {
            return await apiRequest(p);
          } catch (e) {
            if (e?.status && e.status !== 404 && e.status !== 405) {
              throw e;
            }
            last = e;
          }
        }
        if (last) throw last;
        return null;
      };

      const safeArray = (value) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === "object") {
          if (Array.isArray(value.items)) return value.items;
          if (Array.isArray(value.users)) return value.users;
          if (Array.isArray(value.logins)) return value.logins;
          if (Array.isArray(value.activities)) return value.activities;
          if (Array.isArray(value.records)) return value.records;
          if (Array.isArray(value.data)) return value.data;
          if (Array.isArray(value.results)) return value.results;
        }
        return null;
      };

      const safeCount = (value) => {
        if (Array.isArray(value)) return value.length;
        if (value && typeof value === "object") {
          const n =
            value.total ??
            value.count ??
            value.total_count ??
            value.totalCount ??
            value.total_records ??
            value.totalRecords;
          if (typeof n === "number") return n;

          const arr = safeArray(value);
          if (arr) return arr.length;
        }
        return null;
      };

      const toCsvRow = (t) => {
        if (!t || typeof t !== "object") return null;

        const date =
          t.Date ??
          t.date ??
          t.transaction_date ??
          t.transactionDate ??
          t.created_at ??
          t.createdAt ??
          "";

        return {
          Date: date,
          Mode: t.Mode ?? t.mode ?? t.payment_mode ?? t.paymentMode ?? "",
          Category: t.Category ?? t.category ?? "",
          Subcategory: t.Subcategory ?? t.subcategory ?? t.sub_category ?? t.subCategory ?? "",
          Note: t.Note ?? t.note ?? t.description ?? "",
          Amount: t.Amount ?? t.amount ?? 0,
          "Income/Expense": t["Income/Expense"] ?? t.income_expense ?? t.incomeExpense ?? t.type ?? "",
          Currency: t.Currency ?? t.currency ?? "",
        };
      };

      const normalizeTransactionForRevenue = (t) => {
        if (!t || typeof t !== "object") return null;

        const parseDate = (value) => {
          if (!value) return null;
          if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

          // First try native parsing (works for ISO strings)
          const d1 = new Date(value);
          if (!Number.isNaN(d1.getTime())) return d1;

          // Try DD/MM/YYYY or DD/MM/YYYY HH:mm:ss
          const s = String(value).trim();
          const m = s.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
          );
          if (m) {
            const day = Number(m[1]);
            const month = Number(m[2]);
            const year = Number(m[3]);
            const hh = Number(m[4] || 0);
            const mm = Number(m[5] || 0);
            const ss = Number(m[6] || 0);
            const d2 = new Date(year, month - 1, day, hh, mm, ss);
            if (!Number.isNaN(d2.getTime())) return d2;
          }

          return null;
        };

        const rawAmount = t.Amount ?? t.amount ?? t.value ?? t.total ?? 0;
        const amount = typeof rawAmount === "number" ? rawAmount : Number(String(rawAmount).replace(/[^0-9.-]/g, "")) || 0;

        const rawType =
          t["Income/Expense"] ??
          t.income_expense ??
          t.incomeExpense ??
          t.type ??
          t.transaction_type ??
          t.transactionType ??
          "";

        const typeKey = String(rawType || "").trim().toLowerCase();
        const isIncome = typeKey === "income" || typeKey.includes("income") || typeKey === "credit";
        const isExpense = typeKey === "expense" || typeKey.includes("expense") || typeKey === "debit";

        const rawDate =
          t.Date ??
          t.date ??
          t.transaction_date ??
          t.transactionDate ??
          t.created_at ??
          t.createdAt;

        const date = parseDate(rawDate);

        return { amount, isIncome, isExpense, date };
      };

      const computeRevenueGrowthPct = (transactions) => {
        if (!Array.isArray(transactions) || transactions.length < 2) return null;

        const norm = transactions.map(normalizeTransactionForRevenue).filter(Boolean);
        const dated = norm.filter((n) => n.date);
        if (dated.length < 2) return null;

        const now = new Date();
        const msDay = 24 * 60 * 60 * 1000;
        const startCurrent = new Date(now.getTime() - 30 * msDay);
        const startPrev = new Date(now.getTime() - 60 * msDay);

        const netForRange = (start, end) => {
          let net = 0;
          for (const n of dated) {
            if (n.date < start || n.date >= end) continue;
            if (n.isExpense) net -= n.amount;
            else if (n.isIncome) net += n.amount;
            else net += n.amount;
          }
          return net;
        };

        const prevNet = netForRange(startPrev, startCurrent);
        const currentNet = netForRange(startCurrent, now);

        const denom = Math.max(Math.abs(prevNet), 1);
        const pct = ((currentNet - prevNet) / denom) * 100;
        if (!Number.isFinite(pct)) return null;
        return Math.round(pct * 10) / 10;
      };

      const [
        transactionsRes,
        flaggedRes,
        fraudSummaryRes,
        riskAnalysisRes,
        usersRes,
        recentLoginsRes,
      ] = await Promise.all([
        tryGetFirst(["/transactions/", "/transactions"]).catch(() => null),
        tryGetFirst(["/fraud/flagged", "/fraud/flagged/"]).catch(() => null),
        role === "admin"
          ? tryGetFirst(["/reports/fraud-summary", "/reports/fraud-summary/"]).catch(() => null)
          : Promise.resolve(null),
        role === "admin"
          ? tryGetFirst(["/reports/risk-analysis", "/reports/risk-analysis/"]).catch(() => null)
          : Promise.resolve(null),
        role === "admin" || role === "management"
          ? tryGetFirst([
              "/users/",
              "/users",
              "/auth/users/",
              "/auth/users",
              "/admin/users/",
              "/admin/users",
              "/accounts/users/",
              "/accounts/users",
            ]).catch(() => null)
          : Promise.resolve(null),
        role === "admin"
          ? tryGetFirst([
              "/auth/recent-logins",
              "/auth/recent-logins/",
              "/auth/login-history",
              "/auth/login-history/",
              "/login-history",
              "/login-history/",
              "/recent-logins",
              "/recent-logins/",
              "/audit/recent-logins",
              "/audit/recent-logins/",
              "/audit/login-history",
              "/audit/login-history/",
              "/logs/recent-logins",
              "/logs/recent-logins/",
              "/logs/login-history",
              "/logs/login-history/",
            ]).catch(() => null)
          : Promise.resolve(null),
      ]);

      const transactions = safeArray(transactionsRes) || [];
      const flagged = safeArray(flaggedRes) || [];
      const transactionsCount = safeCount(transactionsRes) ?? transactions.length;
      const flaggedCount = safeCount(flaggedRes) ?? flagged.length;

      const flaggedFromTransactions = transactions.filter((t) => t?.is_flagged === true).length;
      const fraudFromTransactions = transactions.filter((t) => t?.is_fraud === true).length;
      const uniqueUsersFromTransactions = new Set(
        transactions
          .map((t) => t?.user_id)
          .filter((v) => typeof v === "string" && v.length > 0)
      ).size;

      const highRiskFromTransactions = transactions.filter((t) => {
        const score = t?.risk_score;
        return typeof score === "number" && score >= 70;
      }).length;

      // DERIVE CHART DATA FOR AUDITOR FROM API RESPONSES (fallback to existing mocks)
      const deriveAuditorCharts = (flaggedArr = [], transactionsArr = []) => {
        if (!Array.isArray(flaggedArr)) flaggedArr = [];
        if (!Array.isArray(transactionsArr)) transactionsArr = [];

        // Helper: extract date (YYYY-MM-DD) from many possible timestamp fields
        const getDateKey = (t) => {
          const ts = t?.timestamp || t?.created_at || t?.createdAt || t?.date || t?.Date || "";
          try {
            if (!ts) return "Unknown";
            const d = new Date(ts);
            if (!isNaN(d)) return d.toISOString().slice(0, 10);
            // fallback: if string like "2026-04-12 14:32"
            return String(ts).split(" ")[0];
          } catch (e) {
            return String(ts).split(" ")[0] || "Unknown";
          }
        };

        // Line chart: flagged vs reviewed by day (use flaggedArr)
        const byDay = {};
        flaggedArr.forEach((f) => {
          const k = getDateKey(f);
          byDay[k] = byDay[k] || { flagged: 0, reviewed: 0 };
          byDay[k].flagged += 1;
          if (f.status && String(f.status).toLowerCase() !== "flagged") byDay[k].reviewed += 1;
        });

        // Pick last 7 keys sorted ascending (if Unknown present, keep at end)
        const dayKeys = Object.keys(byDay).filter(k => k !== "Unknown").sort();
        const windowKeys = dayKeys.slice(Math.max(0, dayKeys.length - 7));
        if (windowKeys.length === 0 && flaggedArr.length > 0) {
          // fallback: use all unique keys (including Unknown)
          windowKeys.push(...Object.keys(byDay));
        }

        const lineCategories = windowKeys.length ? windowKeys : ["No Data"];
        const lineFlagged = lineCategories.map((k) => byDay[k]?.flagged || 0);
        const lineReviewed = lineCategories.map((k) => byDay[k]?.reviewed || 0);

        // Pie chart: risk distribution
        const risks = { High: 0, Medium: 0, Low: 0, Other: 0 };
        flaggedArr.forEach((f) => {
          const r = f?.risk || f?.risk_level || "Other";
          if (r === "High" || String(r).toLowerCase() === "high") risks.High += 1;
          else if (r === "Medium" || String(r).toLowerCase() === "medium") risks.Medium += 1;
          else if (r === "Low" || String(r).toLowerCase() === "low") risks.Low += 1;
          else risks.Other += 1;
        });

        const pieLabels = ["High", "Medium", "Low", "Other"].filter((l) => risks[l] > 0);
        const pieSeries = pieLabels.map((l) => risks[l]);

        // Bar chart: monthly transaction trend (aggregate by month from transactionsArr)
        const monthCounts = {};
        const monthLabelsSet = new Set();
        const toMonthKey = (ts) => {
          try {
            if (!ts) return null;
            const d = new Date(ts);
            if (!isNaN(d)) return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            // fallback parse YYYY-MM-DD
            const s = String(ts).split(" ")[0];
            const parts = s.split("-");
            if (parts.length >= 2) return `${parts[0]}-${parts[1].padStart(2, "0")}`;
            return null;
          } catch (e) {
            return null;
          }
        };

        transactionsArr.forEach((t) => {
          const k = toMonthKey(t?.timestamp || t?.created_at || t?.createdAt || t?.date || t?.Date || t?.transaction_date || t?.transactionDate || "");
          if (!k) return;
          monthCounts[k] = (monthCounts[k] || 0) + 1;
          monthLabelsSet.add(k);
        });

        // Build last 12 months list (sorted)
        const monthKeys = Array.from(monthLabelsSet).sort();
        // If no monthKeys from transactions, fallback to flagged dates
        if (monthKeys.length === 0) {
          flaggedArr.forEach((f) => {
            const k = toMonthKey(f?.timestamp || f?.date || f?.Date || "");
            if (!k) return;
            monthCounts[k] = (monthCounts[k] || 0) + 1;
            monthLabelsSet.add(k);
          });
        }

        const finalMonthKeys = Array.from(monthLabelsSet).sort();
        // Format labels as 'Mon YYYY'
        const monthLabels = finalMonthKeys.map((k) => {
          const [y, m] = k.split("-");
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `${months[Number(m) - 1] || m} ${y}`;
        });

        const monthData = finalMonthKeys.map((k) => monthCounts[k] || 0);

        return {
          line: {
            categories: lineCategories,
            series: [
              { name: "Flagged", data: lineFlagged },
              { name: "Reviewed", data: lineReviewed },
            ],
          },
          pie: {
            labels: pieLabels.length ? pieLabels : ["No Data"],
            series: pieSeries.length ? pieSeries : [0],
          },
          bar: {
            categories: monthLabels.length ? monthLabels : ["No Data"],
            series: [{ name: "Transactions", data: monthData.length ? monthData : [0] }],
          },
        };
      };

      // If flagged response is empty, derive pseudo-flagged records from transactions
      let auditorDerivedCharts;
      if ((!Array.isArray(flagged) || flagged.length === 0) && Array.isArray(transactions) && transactions.length > 0) {
        const pseudo = transactions
          .filter((t) => t?.is_flagged === true || t?.is_fraud === true || typeof t?.risk_score === 'number')
          .map((t) => ({
            user: t.user || t.user_id || t.username || t.account || "Unknown",
            risk: t.risk || (typeof t.risk_score === 'number' ? (t.risk_score >= 70 ? 'High' : t.risk_score >= 40 ? 'Medium' : 'Low') : 'Other'),
            status: t.is_flagged || t.is_fraud ? 'Flagged' : (t.status || 'Reviewed'),
            timestamp: t.transaction_date || t.transactionDate || t.created_at || t.createdAt || t.date || t.Date || "",
          }));

        auditorDerivedCharts = deriveAuditorCharts(pseudo.length ? pseudo : flagged, transactions);
      } else {
        auditorDerivedCharts = deriveAuditorCharts(flagged, transactions);
      }

      if (transactionsCount === 0 && typeof console !== "undefined") {
        console.warn("[dashboardStore] /transactions/ returned 0 items", transactionsRes, "for role", role);
      }

      // Determine if we have real chart data
      const hasRealChartData = (Array.isArray(flagged) && flagged.length > 0) || (
        Array.isArray(transactions) && transactions.length > 0 && transactions.some(t => t?.is_flagged || t?.is_fraud || typeof t?.risk_score === 'number')
      );

      set((state) => {
        const next = {
          stats: { ...state.stats },
          chartData: { ...state.chartData },
          tableData: { ...state.tableData },
          backendData: {
            transactions,
            flagged,
          },
          isLoading: false,
        };

        const usersArr = safeArray(usersRes) || [];
        const usersCount = safeCount(usersRes) ?? (Array.isArray(usersArr) ? usersArr.length : 0);
        if (usersCount > 0) {
          next.stats.admin = {
            ...next.stats.admin,
            totalUsers: usersCount,
          };
        }

        if (role === "auditor") {
          const rows = transactions.map(toCsvRow).filter(Boolean);

          next.tableData.auditor = rows.length ? rows : state.tableData.auditor;

          next.stats.auditor = {
            ...state.stats.auditor,
            flaggedTransactions:
              flaggedCount ||
              flaggedFromTransactions ||
              rows.length ||
              state.stats.auditor.flaggedTransactions,
            highRiskCases: highRiskFromTransactions || state.stats.auditor.highRiskCases,
            resolvedCases: state.stats.auditor.resolvedCases,
          };

          // Assign derived chart data for auditor if real data exists, otherwise use mock fallback
          try {
            next.chartData.auditor = hasRealChartData ? (auditorDerivedCharts || state.chartData.auditor) : null;
          } catch (e) {
            next.chartData.auditor = state.chartData.auditor;
          }
        }

        if (role === "admin") {
          const rawLoginsArr = safeArray(recentLoginsRes) || [];
          const loginRows = Array.isArray(rawLoginsArr)
            ? rawLoginsArr
                .slice(0, 20)
                .map((l) => {
                  if (!l || typeof l !== "object") return null;

                  const user =
                    l.email ||
                    l.user ||
                    l.username ||
                    l.user_email ||
                    l.userEmail ||
                    l.user_id ||
                    "Unknown";

                  const ts = l.time || l.timestamp || l.logged_in_at || l.loggedInAt || l.created_at || l.createdAt;
                  const time = ts ? String(ts) : "";

                  const ok =
                    l.success ??
                    l.ok ??
                    l.status === "success" ??
                    l.status === "Success" ??
                    l.is_success;

                  const status =
                    typeof l.status === "string"
                      ? l.status
                      : ok === false
                        ? "Failed"
                        : "Success";

                  return {
                    user: String(user),
                    action: "Login",
                    time,
                    status,
                  };
                })
                .filter(Boolean)
            : [];

          next.stats.admin = {
            ...state.stats.admin,
            transactions: transactionsCount || state.stats.admin.transactions,
            fraudAlerts:
              flaggedFromTransactions ||
              fraudFromTransactions ||
              (fraudSummaryRes && typeof fraudSummaryRes === "object" && (
                fraudSummaryRes.fraud_alerts ??
                fraudSummaryRes.fraudAlerts ??
                fraudSummaryRes.total_fraud_alerts ??
                fraudSummaryRes.totalFraudAlerts ??
                fraudSummaryRes.alerts ??
                fraudSummaryRes.total_alerts ??
                fraudSummaryRes.totalAlerts
              )) ||
              state.stats.admin.fraudAlerts,
            totalUsers: usersCount || state.stats.admin.totalUsers,
          };

          if (loginRows.length) {
            next.tableData.admin = loginRows;
          }

          if (riskAnalysisRes && typeof riskAnalysisRes === "object") {
            next.stats.admin = {
              ...next.stats.admin,
              totalUsers:
                usersCount ||
                (riskAnalysisRes.total_users ?? riskAnalysisRes.totalUsers ?? next.stats.admin.totalUsers),
            };
          } else if (uniqueUsersFromTransactions > 0) {
            next.stats.admin = {
              ...next.stats.admin,
              totalUsers: usersCount || uniqueUsersFromTransactions,
            };
          }
        }

        if (role === "management") {
          const computedGrowth = computeRevenueGrowthPct(transactions);
          next.stats.management = {
            ...state.stats.management,
            activeProjects: state.stats.management.activeProjects || 0,
            teamMembers: state.stats.management.teamMembers || 0,
            revenueGrowth: typeof computedGrowth === "number" ? computedGrowth : (state.stats.management.revenueGrowth || 0),
          };
        }

        // Use auditor-derived charts for admin/management only when real data exists
        if (hasRealChartData && auditorDerivedCharts && typeof auditorDerivedCharts === "object") {
          next.chartData.admin = auditorDerivedCharts;
          next.chartData.management = auditorDerivedCharts;
        } else {
          next.chartData.admin = null;
          next.chartData.management = null;
        }

        return next;
      });
    } catch (e) {
      if (typeof console !== "undefined") {
        console.error("[dashboardStore] fetchDashboardData failed", { role, error: e });
      }

      // On failure, clear backend data for role and leave charts as null (loading state)
      set((state) => ({
        stats: { ...state.stats, [role]: state.stats[role] },
        chartData: { ...state.chartData, [role]: null },
        tableData: { ...state.tableData, [role]: state.tableData[role] },
        backendData: {
          transactions: [],
          flagged: [],
        },
        isLoading: false,
      }));
    }
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

// generateMockData removed — charts are null until real data arrives
