export default function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-copper pl-4">
      <p className="font-display text-3xl font-semibold text-paper md:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-paper/50">{label}</p>
    </div>
  );
}