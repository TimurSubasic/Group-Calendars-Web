import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NoGroups from "@/components/NoGroups";

//Mock data - replace with your actual data fetching

const groups = [
  { id: "1", name: "Development Team", members: 8 },
  { id: "2", name: "Marketing Team", members: 5 },
  { id: "3", name: "Design Team", members: 6 },
];

// const groups = [] as { id: string; name: string; members: number }[];

export default function GroupsPage() {
  if (groups.length === 0) {
    return <NoGroups />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Groups</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}/calendar`}>
            <Card className="hover:shadow-lg dark:hover:shadow-card transition-shadow cursor-pointer">
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
