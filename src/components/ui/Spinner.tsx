export default function Spinner({ size = 8 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center w-full h-40">
      <div
        className={`animate-spin rounded-full border-b-2 border-indigo-500 w-${size} h-${size}`}
      />
    </div>
  );
}
