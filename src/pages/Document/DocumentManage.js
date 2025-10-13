import DManageComponent from "../../components/Document/DManageComponent.js";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "../common.css"; // 导入通用样式

function DocumentManage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>资料管理</h1>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          返回主页
        </button>
      </div>
      {/* 页面内容 */}
      <main className="page-content">
        <DManageComponent />
      </main>
    </div>
  );
}

export default DocumentManage;
