/**
 * Node Modules
 */
import { Outlet } from "react-router";

/**
 * External Components
 */
import CommonPublicLayout from "./components/layout/CommonPublicLayout";

/**
 * Component Logic
 */
function App() {
  return (
    <CommonPublicLayout>
      <Outlet />
    </CommonPublicLayout>
  );
}

export default App;
