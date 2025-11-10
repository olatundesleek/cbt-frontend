import { PieChartComponent } from "@/components/charts/piechart";

const dashboardCards: { label: string; value: string }[] = [
  {
    label: "Total Students",
    value: "1,200",
  },
  {
    label: "Total Teachers",
    value: "85",
  },
  {
    label: "Total Admins",
    value: "85",
  },
  {
    label: "Total Users",
    value: "85",
  },
];

const recentActivities = [
  "New Courses Created",
  "User Registered",
  "Test Added",
];

export default function AdminDashboardPage() {
  return (
    <section className="flex-1 flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-3">
        {dashboardCards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-3 bg-background rounded-xl w-full p-3"
          >
            <span className="text-neutral-500 text-sm">{card.label}</span>
            <span className="text-xl text-foreground font-semibold">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <span className="text-xl text-foreground font-semibold">
            Recent Activities
          </span>

          <ul className="flex flex-col gap-4 w-full">
            {recentActivities.map((item, itemIndex) => (
              <li key={itemIndex} className="flex flex-row items-center gap-2">
                <div className="w-2 h-2 bg-primary-700 rounded-full" />
                <span className="text-base text-neutral-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <span className="text-xl text-foreground font-semibold">
            System Summary
          </span>

          <PieChartComponent />
        </div>
      </div>
    </section>
  );
}
