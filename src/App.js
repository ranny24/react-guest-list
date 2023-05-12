import styles from './App.scss';
import Guestlist from './Guestlist';

function App() {
  return (
    <div>
      <h1 className={styles.heading}>Guest List</h1>
      <Guestlist />
    </div>
  );
}

export default App;
