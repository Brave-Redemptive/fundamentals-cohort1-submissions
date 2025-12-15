import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
// import Home from "./pages/home";
import Layout from "./components/layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import TasksPage from "./pages/TasksPage";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <Layout>
                <TasksPage />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
