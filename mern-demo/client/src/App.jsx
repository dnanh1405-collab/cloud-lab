import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = {
      studentId,
      name,
      email,
    };

    try {
      let response;

      if (editingId) {
        // Cập nhật
        response = await fetch(`/api/students/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        });
      } else {
        // Thêm
        response = await fetch("/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        });
      }

      if (!response.ok) {
        throw new Error("Thao tác thất bại");
      }

      setStudentId("");
      setName("");
      setEmail("");
      setEditingId(null);

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || "");
    setName(student.name || "");
    setEmail(student.email || "");
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xóa thất bại");
      }

      fetchStudents();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể xóa sinh viên!");
    }
  };

  // Hủy sửa
  const handleCancel = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  return (
    <div className="container">
      <h1>Quản lý sinh viên</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách */}
      <h2>Danh sách sinh viên</h2>

      <table>
        <thead>
          <tr>
            <th>Mã sinh viên</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button onClick={() => handleEdit(student)}>
                  Sửa
                </button>

                <button onClick={() => handleDelete(student._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
