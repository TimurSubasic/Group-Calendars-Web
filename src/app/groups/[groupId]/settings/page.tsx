export default function GroupMembersPage({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Members</h2>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Members list for Group {params.groupId}
        </p>
      </div>
    </div>
  );
}
