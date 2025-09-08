import { Outlet } from 'react-router';
import '../css/App.css';

function App() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}

export default App;