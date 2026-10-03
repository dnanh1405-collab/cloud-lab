import { useState, useEffect } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [mssv, setMssv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Lấy danh sách sinh viên từ backend
  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  // Hàm thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mssv, name, email }),
      });

      if (response.ok) {
        const newStudent = await response.json();
        setStudents([...students, newStudent]); // cập nhật danh sách ngay
        setMessage("Thêm sinh viên thành công!");
        setMssv("");
        setName("");
        setEmail("");
      } else {
        setMessage("Có lỗi xảy ra khi thêm sinh viên.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Không thể kết nối tới server.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách sinh viên</h1>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.mssv} - {s.name} - {s.email}
          </li>
        ))}
      </ul>

      <h2>Thêm sinh viên mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>MSSV: </label>
          <input
            type="text"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Họ tên: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Thêm sinh viên</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
