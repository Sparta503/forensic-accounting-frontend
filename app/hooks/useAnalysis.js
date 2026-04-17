export function useAnalysis(role) {

  // 🔥 ADMIN DATA
  if (role === "admin") {
    return {
      line: {
        categories: ["Jan", "Feb", "Mar", "Apr"],
        series: [
          { name: "Transactions", data: [100, 200, 150, 300] },
          { name: "Fraud", data: [20, 40, 30, 80] },
        ],
      },

      pie: {
        labels: ["High Risk", "Medium", "Low"],
        series: [50, 30, 20],
      },

      bar: {
        categories: ["Mon", "Tue", "Wed", "Thu"],
        series: [
          { name: "Volume", data: [300, 500, 400, 600] },
        ],
      },
    };
  }

  // 🔥 AUDITOR DATA
  if (role === "auditor") {
    return {
      line: {
        categories: ["Mon", "Tue", "Wed", "Thu"],
        series: [
          { name: "Flagged", data: [10, 25, 18, 40] },
          { name: "Reviewed", data: [5, 15, 12, 20] },
        ],
      },

      pie: {
        labels: ["Critical", "Moderate", "Safe"],
        series: [40, 35, 25],
      },

      bar: {
        categories: ["Case1", "Case2", "Case3"],
        series: [
          { name: "Investigations", data: [20, 35, 25] },
        ],
      },
    };
  }

  // 🔥 USER DATA
  return {
    line: {
      categories: ["Week1", "Week2", "Week3"],
      series: [
        { name: "My Transactions", data: [50, 80, 60] },
      ],
    },

    pie: {
      labels: ["Spent", "Saved", "Pending"],
      series: [60, 25, 15],
    },

    bar: {
      categories: ["Food", "Bills", "Shopping"],
      series: [
        { name: "Expenses", data: [200, 150, 300] },
      ],
    },
  };
}