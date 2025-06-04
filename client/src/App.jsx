import "./App.css";
import { UserProvider } from "./contexts/UserProvider";
import AppRoutes from "./layout/AppRoutes";
import GymVisit from "./pages/phoneLogin/GymVisit";

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
