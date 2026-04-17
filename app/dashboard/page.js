export const dynamic = "force-dynamic";

export default function UserDashboard() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">User Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Balance</p>
          <h2 className="text-2xl font-bold">$4,200</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Transactions</p>
          <h2 className="text-2xl font-bold">87</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Alerts</p>
          <h2 className="text-2xl font-bold text-red-500">2</h2>
        </div>

      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Recent Transactions</h2>

        <ul className="space-y-2 text-sm">
          <li className="flex justify-between border-b pb-2">
            <span>Payment</span>
            <span>$120</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>Deposit</span>
            <span>$500</span>
          </li>
        </ul>
      </div>

    </div>
  );
}