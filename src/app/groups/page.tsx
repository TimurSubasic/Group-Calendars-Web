import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - replace with your actual data fetching
const groups = [
  { id: "1", name: "Development Team", members: 8 },
  { id: "2", name: "Marketing Team", members: 5 },
  { id: "3", name: "Design Team", members: 6 },
];

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}/calendar`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{group.members} members</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
