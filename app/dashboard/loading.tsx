export default function DashboardLoading() {
  const neuSkel = {
    background: "rgb(var(--color-surface))",
    borderRadius: "var(--radius-sm)",
    boxShadow: "var(--neu-shadow)",
  };

  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="h-8 w-44 mb-2" style={{ ...neuSkel, borderRadius: "var(--radius-sm)" }} />
          <div className="h-4 w-28" style={{ ...neuSkel, borderRadius: "var(--radius-sm)" }} />
        </div>
        <div className="h-10 w-38" style={{ ...neuSkel, borderRadius: "var(--radius-sm)" }} />
      </div>
      {/* Filter skeleton */}
      <div className="flex gap-3 mb-6">
        {[80, 68, 90, 64, 78, 96].map((w, i) => (
          <div key={i} className="h-10 shrink-0" style={{ ...neuSkel, width: `${w}px` }} />
        ))}
      </div>
      {/* Card skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5" style={neuSkel}>
          <div className="flex justify-between items-start">
            <div>
              <div className="h-5 w-44 mb-2" style={{ background: "rgb(var(--color-surface-container-high))", borderRadius: "var(--radius-sm)" }} />
              <div className="h-4 w-64" style={{ background: "rgb(var(--color-surface-container-high))", borderRadius: "var(--radius-sm)" }} />
            </div>
            <div className="h-6 w-20 rounded-full" style={{ background: "rgb(var(--color-surface-container-high))" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
