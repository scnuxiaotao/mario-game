import GameCanvas from '../components/GameCanvas';

export default function Page() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#8ecae6', overflow: 'hidden' }}>
      <h1 style={{ textAlign: 'center', color: '#023047', marginTop: '0' }}>马里奥第一关 DEMO</h1>
      <GameCanvas />
      <footer style={{ position: 'absolute', bottom: '0', width: '100%', textAlign: 'center', color: '#555', fontSize: '14px' }}>
        © 2025 马里奥 DEMO | 功能：左右移动、跳跃、下蹲、吃蘑菇、踩怪、碰旗过关
      </footer>
    </div>
  );
}
