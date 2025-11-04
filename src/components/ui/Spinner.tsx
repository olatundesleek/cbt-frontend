export default function Spinner({
  color = 'text-secondary',
}: {
  color?: string;
}) {
  return (
    <div
      className={`w-16 aspect-square rounded-full mx-auto animate-spin ${color}`}
      style={{
        background: `radial-gradient(farthest-side, #0284c7 94%, #0000) top/10px 10px no-repeat,
                     conic-gradient(#0000 30%, #0284c7)`,
        WebkitMask: `radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0)`,
        mask: `radial-gradient(farthest-side, #0000 calc(100% - 10px), #000 0)`,
      }}
    />
  );
}
