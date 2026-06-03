import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";

const Reports = () => {

  const [childrenData, setChildrenData] =
    useState({});

  const [volunteerData, setVolunteerData] =
    useState({});

  const [staffData, setStaffData] =
    useState({});
  
  // =========================================
  // FETCH REPORT DATA
  // =========================================
  const fetchReports = async () => {

    try {

      // CHILDREN REPORT
      const childRes = await fetch(
        "http://localhost:5000/api/analytics/children"
      );

      // VOLUNTEER REPORT
      const volunteerRes = await fetch(
        "http://localhost:5000/api/analytics/volunteers"
      );

      const staffRes = await fetch(
        "http://localhost:5000/api/analytics/staffs"
      );
      
      const childData =
        await childRes.json();

      const volunteerReport =
        await volunteerRes.json();
      
      const staffReport =
        await staffRes.json();
        
      setChildrenData(childData);
      setVolunteerData(volunteerReport);
      setStaffData(staffReport);
      
    } catch (error) {

      console.log(
        "Error fetching reports:",
        error
      );

    }

  };

  useEffect(() => {

    fetchReports();

  }, []);

  // =========================================
  // PDF DOWNLOAD
  // =========================================
  const downloadPDF = (type) => {

    const doc = new jsPDF();
    let isFirstPage = true;

    // =====================================
    // CHILDREN REPORT PDF
    // =====================================
    if (type === "children") {

      // HEADER - ONLY ON FIRST PAGE
      if (isFirstPage) {
        doc.setFillColor(34, 94, 60);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Children Detailed Report", 50, 28);

        doc.setFontSize(11);
        doc.setTextColor(200, 230, 210);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Generated: ${new Date().toLocaleString()}`,
          55,
          38
        );
        isFirstPage = false;
      } else {
        doc.setFontSize(16);
        doc.setTextColor(34, 94, 60);
        doc.setFont("helvetica", "bold");
        doc.text("Children Detailed Report (Continued)", 50, 20);
      }

      doc.setDrawColor(34, 94, 60);
      doc.line(20, 48, 190, 48);
      
      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 65);

      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Total Children:", 24, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${childrenData.totalChildren || 0}`, 100, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Orphanage:", 114, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${childrenData.orphanageChildren || 0}`, 180, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Rescued Children:", 24, 93);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${childrenData.rescuedChildren || 0}`, 100, 93);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Male:", 114, 93);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${childrenData.male || 0}`, 180, 93);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(65, 100, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Female:", 69, 107);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${childrenData.female || 0}`, 135, 107);

      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Children List", 20, 125);
      doc.setDrawColor(34, 94, 60);
      doc.line(20, 128, 90, 128);

      // CHILDREN TABLE DATA
      const tableData = childrenData.children?.map((child, index) => [
        index + 1,
        child.name || "N/A",
        child.age || "N/A",
        child.gender || "N/A",
        child.healthStatus || "N/A",
        child.educationLevel || "N/A",
        child.specialNeeds || "None",
        child.guardianName || "N/A",
        child.guardianContact || "N/A",
        child.notes || "N/A",
        child.createdAt ? new Date(child.createdAt).toLocaleDateString() : "N/A"
      ]) || [];

      autoTable(doc, {
        startY: 135,
        head: [["ID", "Name", "Age", "Gender", "Health Status", "Education Level", "Special Needs", "Guardian Name", "Guardian Contact", "Notes", "Created Date"]],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [34, 94, 60],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        margin: { left: 10, right: 10 }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 100, 285, { align: "center" });
      }
      
      doc.save("children-report.pdf");

    }

    // =====================================
    // VOLUNTEER REPORT PDF
    // =====================================
    if (type === "volunteers") {

      isFirstPage = true;

      if (isFirstPage) {
        doc.setFillColor(34, 94, 60);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Volunteer Detailed Report", 45, 28);

        doc.setFontSize(11);
        doc.setTextColor(200, 230, 210);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Generated: ${new Date().toLocaleString()}`,
          55,
          38
        );
        isFirstPage = false;
      } else {
        doc.setFontSize(16);
        doc.setTextColor(34, 94, 60);
        doc.setFont("helvetica", "bold");
        doc.text("Volunteer Detailed Report (Continued)", 45, 20);
      }

      doc.setDrawColor(34, 94, 60);
      doc.line(20, 48, 190, 48);
      
      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 65);

      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Total Volunteers:", 24, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${volunteerData.total || 0}`, 100, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Approved:", 114, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${volunteerData.approved || 0}`, 180, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Pending:", 24, 93);
      doc.setTextColor(245, 158, 11);
      doc.setFont("helvetica", "bold");
      doc.text(`${volunteerData.pending || 0}`, 100, 93);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Rejected:", 114, 93);
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text(`${volunteerData.rejected || 0}`, 180, 93);

      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Volunteer List", 20, 115);
      doc.setDrawColor(34, 94, 60);
      doc.line(20, 118, 90, 118);

      // VOLUNTEER TABLE DATA
      const tableData = volunteerData.volunteers?.map((volunteer, index) => [
        index + 1,
        volunteer.name || "N/A",
        volunteer.email || "N/A",
        volunteer.phone || "N/A",
        volunteer.age || "N/A",
        volunteer.city || "N/A",
        volunteer.occupation || "N/A",
        volunteer.skills || "N/A",
        volunteer.availability || "N/A",
        volunteer.experience || "N/A",
        volunteer.joinedAt ? new Date(volunteer.joinedAt).toLocaleDateString() : "N/A"
      ]) || [];

      autoTable(doc, {
        startY: 125,
        head: [["ID", "Name", "Email", "Phone", "Age", "City", "Occupation", "Skills", "Availability", "Experience", "Date"]],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [34, 94, 60],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        margin: { left: 10, right: 10 }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 100, 285, { align: "center" });
      }
      
      doc.save("volunteer-report.pdf");

    }

    // =====================================
    // STAFF REPORT PDF
    // =====================================
    if (type === "staffs") {

      isFirstPage = true;

      if (isFirstPage) {
        doc.setFillColor(34, 94, 60);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Staff Detailed Report", 55, 28);

        doc.setFontSize(11);
        doc.setTextColor(200, 230, 210);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Generated: ${new Date().toLocaleString()}`,
          55,
          38
        );
        isFirstPage = false;
      } else {
        doc.setFontSize(16);
        doc.setTextColor(34, 94, 60);
        doc.setFont("helvetica", "bold");
        doc.text("Staff Detailed Report (Continued)", 55, 20);
      }

      doc.setDrawColor(34, 94, 60);
      doc.line(20, 48, 190, 48);
      
      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 20, 65);

      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Total Staff:", 24, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${staffData.total || 0}`, 100, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 72, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Active:", 114, 79);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text(`${staffData.active || 0}`, 180, 79);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(20, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Inactive:", 24, 93);
      doc.setTextColor(220, 38, 38);
      doc.setFont("helvetica", "bold");
      doc.text(`${staffData.inactive || 0}`, 100, 93);
      
      doc.setFillColor(245, 250, 245);
      doc.roundedRect(110, 86, 80, 10, 2, 2, 'F');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("On Leave:", 114, 93);
      doc.setTextColor(245, 158, 11);
      doc.setFont("helvetica", "bold");
      doc.text(`${staffData.onLeave || 0}`, 180, 93);

      doc.setFontSize(18);
      doc.setTextColor(34, 94, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Staff List", 20, 115);
      doc.setDrawColor(34, 94, 60);
      doc.line(20, 118, 90, 118);

      // STAFF TABLE DATA
      const tableData = staffData.staffs?.map((staff, index) => [
        index + 1,
        staff.address || "N/A",
        staff.city || "N/A",
        staff.department || "N/A",
        staff.email || "N/A",
        staff.emergencyContact || "N/A",
        staff.experience || "N/A",
        staff.joinDate ? new Date(staff.joinDate).toLocaleDateString() : "N/A",
        staff.phone || "N/A",
        staff.position || "N/A",
        staff.qualifications || "N/A",
        staff.salary || 0,
        staff.shift || "N/A"
      ]) || [];

      autoTable(doc, {
        startY: 125,
        head: [["ID", "Address", "City", "Department", "Email", "Emergency Contact", "Experience", "Join Date", "Phone", "Position", "Qualifications", "Salary", "Shift"]],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [34, 94, 60],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        margin: { left: 10, right: 10 }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 100, 285, { align: "center" });
      }
      
      doc.save("staff-report.pdf");

    }
  };

  return (

    <div className="reports-page">

      <div className="reports-header">
 

  <div className="header-buttons">

    <button
      className="dashboard-btn"
      onClick={() =>
        window.history.back()
      }
    >
      Go To Dashboard
    </button>

    <button
      className="refresh-btn"
      onClick={fetchReports}
    >
      Refresh Data
    </button>

  </div>

</div>

      <div className="reports-grid">

        {/* CHILDREN REPORT */}
        <div className="report-card">

          <h2>
            Children Report
          </h2>

          <p>
            Total Children:
            {childrenData.totalChildren || 0}
          </p>

          <p>
            Orphanage Children:
            {childrenData.orphanageChildren || 0}
          </p>

          <p>
            Rescued Children:
            {childrenData.rescuedChildren || 0}
          </p>

          <p>
            Male:
            {childrenData.male || 0}
          </p>

          <p>
            Female:
            {childrenData.female || 0}
          </p>

          <button
            onClick={() =>
              downloadPDF("children")
            }
          >
            Download Children PDF
          </button>

        </div>

        {/* VOLUNTEER REPORT */}
        <div className="report-card">

          <h2>
            Volunteer Report
          </h2>

          <p>
            Total Volunteers:
            {volunteerData.total || 0}
          </p>

          <p>
            Approved:
            {volunteerData.approved || 0}
          </p>

          <p>
            Pending:
            {volunteerData.pending || 0}
          </p>

          <p>
            Rejected:
            {volunteerData.rejected || 0}
          </p>

          <button
            onClick={() =>
              downloadPDF("volunteers")
            }
          >
            Download Volunteer PDF
          </button>

        </div>

        {/* STAFF REPORT */}
        <div className="report-card">

          <h2>
            Staff Report
          </h2>

          <p>
            Total Staff:
            {staffData.total || 0}
          </p>

          <p>
            Active:
            {staffData.active || 0}
          </p>

          <p>
            Inactive:
            {staffData.inactive || 0}
          </p>

          <p>
            On Leave:
            {staffData.onLeave || 0}
          </p>

          <button
            onClick={() =>
              downloadPDF("staffs")
            }
          >
            Download Staff PDF
          </button>

        </div>
      </div>

    </div>

  );

};

export default Reports;