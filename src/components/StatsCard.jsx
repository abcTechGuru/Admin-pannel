// components/StatsCard.jsx
import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ title, value }) => (
  <Card className="rounded-2xl shadow-md bg-white text-black">
    <CardContent className="p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default StatsCard;
