import { ChatWidget } from './components/ChatWidget';
import './styles.css';

function App() {
  return (
    <div>
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to the EvoAI Store</h1>
        <p>Our store helper is in the bottom-right corner!</p>
      </header>
      <ChatWidget />
    </div>
  );
}

export default App;