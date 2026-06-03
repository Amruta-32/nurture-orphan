import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

import Home from "./pages/Home";
import SignupChoice from "./pages/SignupChoice";
import UserSignup from "./pages/UserSignup";
import OrphanageSignup from "./pages/OrphanageSignup";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import OrphanageDashboard from "./pages/OrphanageDashboard";
import ReportOrphan from "./pages/ReportOrphan";
import ViewOrphans from "./pages/ViewOrphans";
import Profile from "./pages/Profile";
import Donation from "./pages/Donation";
import VolunteerApply from "./pages/VolunteerApply";
import VolunteerStatus from "./pages/VolunteerStatus";
import AddChild from "./pages/AddChild";
import AvailableChildren from "./pages/AvailableChildren";
import Adoption from "./pages/Adoption";
import AdoptionRequests from "./pages/AdoptionRequests";
import AddStaff from "./pages/AddStaff";
import Reports from "./pages/Reports";
import Sponsorships from "./pages/Sponsorships";
import SponsorshipRequests from "./pages/SponsorshipRequests";
import ScrollToTop from "./components/ScrollToTop";
import Stories from './pages/Stories';
import OrphanageStories from './pages/OrphanageStories';
import Settings from './pages/Settings';
import UserReports from './pages/UserReports';

// Add this route
/* ── Scroll-Reveal: observes .scroll-reveal elements and adds .revealed ── */
function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const observe = () => {
      document.querySelectorAll(".scroll-reveal:not(.revealed)").forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}

function App() {
  return (
    <>
      <ScrollReveal />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup-choice" element={<SignupChoice />} />
        <Route path="/signup-user" element={<UserSignup />} />
        <Route path="/signup-orphanage" element={<OrphanageSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/orphanage-dashboard" element={<OrphanageDashboard />} />
        <Route path="/report-orphan" element={<ReportOrphan />} />
        <Route path="/view-orphans" element={<ViewOrphans />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/volunteer-apply" element={<VolunteerApply />} />
        <Route path="/volunteer-status" element={<VolunteerStatus />} />
        <Route path="/add-child" element={<AddChild />} />
        <Route path="/available-children" element={<AvailableChildren />} />
        <Route path="/adoption" element={<Adoption />} />
        <Route path="/adoption-requests" element={<AdoptionRequests />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sponsorship" element={<Sponsorships />} />
        <Route path="/sponsorship-requests" element={<SponsorshipRequests />} />
<Route path="/stories" element={<Stories />} />
<Route path="/orphanage-stories" element={<OrphanageStories />} />
<Route path="/settings" element={<Settings />} />
<Route path="/user-reports" element={<UserReports />} />

        <Route path="*" element={<h1 style={{ textAlign: "center", padding: "80px 20px", fontFamily: "Inter, sans-serif" }}>404 — Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
