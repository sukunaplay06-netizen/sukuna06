import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", earnings: 200 },
  { day: "Tue", earnings: 400 },
  { day: "Wed", earnings: 300 },
  { day: "Thu", earnings: 500 },
  { day: "Fri", earnings: 250 },
  { day: "Sat", earnings: 600 },
  { day: "Sun", earnings: 350 },
];

export default function ReferralChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
