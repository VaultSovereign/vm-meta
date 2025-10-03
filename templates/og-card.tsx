// OG card template (customize as needed)
export default function OGCard({ title, tags }: { title: string; tags?: string[] }) {
  return (
    <div style={{ width: 1200, height: 630, background: '#0b0f14', color: '#e6edf3', padding: 48 }}>
      <div style={{ fontSize: 48, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 20, fontSize: 28, color: '#9fb0c0' }}>{tags?.slice(0,3)?.join(' · ') ?? ''}</div>
      <div style={{ marginTop: 40, fontSize: 24 }}>VaultMesh • meta</div>
    </div>
  );
}
