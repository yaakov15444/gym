import "./App.css";
import { UserProvider } from "./contexts/UserProvider";
import AppRoutes from "./layout/AppRoutes";
function App() {
  return (
    <>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </>
  );
}

export default App;
