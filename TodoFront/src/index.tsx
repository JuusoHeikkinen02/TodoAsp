import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render } from "react-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Activities from "./pages/Activities";
import NoPage from "./pages/NoPage";
import Stats from "./pages/Stats";

class Index extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="Tasks" element={<Tasks />} />
              <Route path="Activities" element={<Activities />} />
              <Route path="Stats" element={<Stats />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}
render(<Index />, document.getElementById("root"));

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
