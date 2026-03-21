import { useEffect } from 'react';
import api from './services/api';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/test');
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div>Working...</div>
    </>
  )
}

export default App
