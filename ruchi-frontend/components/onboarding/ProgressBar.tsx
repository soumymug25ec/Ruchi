export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i < step ? "bg-ruchi-purple" : "bg-ruchi-purple-light"
          }`}
        />
      ))}
    </div>
  );
}
