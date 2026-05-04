export default function AnimatedBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute animate-blob-1"
        style={{
          width: '600px',
          height: '600px',
          top: '-100px',
          left: '-100px',
          background: 'radial-gradient(circle, rgba(0, 25, 255, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute animate-blob-2"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-100px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(51, 71, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
