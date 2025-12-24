import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Home/Dashboard";
import { Login } from "./pages/Login/Login";
import { SignUp } from "./pages/SignUp/SignUp";
import { Home } from "./pages/Home/Home";
import { VerifyOtp} from "./pages/SignUp/VerifyOtp"; 
import CreateProjectPage from "./pages/Home/CreateProjectPage";
import ProfilePage from "./pages/Home/ProfilePage";
import ProjectDetails from "./pages/Home/ProjectDetails";
import {PublicProjects}  from "./pages/PublicProjects/PublicProjects";



const routes = (
  <Router>
    <Routes>
<Route path="/profile-page/:userId" element={<ProfilePage />} />
      <Route path="/public-projects" element={<PublicProjects />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create-project" element={<CreateProjectPage />} />
      <Route path="/profile-page" element={<ProfilePage />} />
      <Route path="/campaign/:id" element={<ProjectDetails />} />

    </Routes>
  </Router>
);

const App = () => (
  <div>{routes} </div>
);

export default App;
