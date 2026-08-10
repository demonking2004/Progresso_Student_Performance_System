import React, { useState } from "react";

function App() {

  const [rollNumber, setRollNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost/add_student.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roll_number: rollNumber,
        student_name: studentName,
      }),
    });

    const data = await response.json();

    alert(data.message);

    setRollNumber("");
    setStudentName("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Admin Panel</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="number"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default App;