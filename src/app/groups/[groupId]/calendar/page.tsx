export default function GroupCalendarPage({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar</h2>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Calendar view for Group {params.groupId}
        </p>
      </div>
    </div>
  );
}
