
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://mern-backend-ekzo.onrender.com";

async function readResponse(response) {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Backend trả về HTML hoặc dữ liệu không hợp lệ (HTTP ${response.status}). Kiểm tra API và Render Logs.`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Yêu cầu thất bại (HTTP ${response.status})`
    );
  }

  return data;
}

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      const data = await readResponse(response);

      if (!Array.isArray(data)) {
        throw new Error("API danh sách không trả về một mảng sinh viên.");
      }

      setStudents(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      alert(`Không tải được danh sách: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Thêm hoặc cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const student = {
      studentId: studentId.trim(),
      name: name.trim(),
      email: email.trim(),
    };

    if (!student.studentId || !student.name || !student.email) {
      alert("Vui lòng nhập đầy đủ mã sinh viên, họ tên và email.");
      return;
    }

    setLoading(true);

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_URL}/api/students/${editingId}`
        : `${API_URL}/api/students`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(student),
      });

      await readResponse(response);

      // Chỉ xóa form sau khi thao tác thành công
      setStudentId("");
      setName("");
      setEmail("");
      setEditingId(null);

      await fetchStudents();
      alert(isEditing ? "Cập nhật sinh viên thành công!" : "Thêm sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi thêm/cập nhật:", error);
      alert(`Không thực hiện được: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Chọn sinh viên để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId || "");
    setName(student.name || "");
    setEmail(student.email || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xóa sinh viên
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      await readResponse(response);
      await fetchStudents();
      alert("Xóa sinh viên thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      alert(`Không thể xóa sinh viên: ${error.message}`);
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

        <button type="submit" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : editingId
              ? "Cập nhật"
              : "Thêm sinh viên"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel} disabled={loading}>
            Hủy
          </button>
        )}
      </form>

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
                <button type="button" onClick={() => handleEdit(student)}>
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(student._id)}
                >
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
