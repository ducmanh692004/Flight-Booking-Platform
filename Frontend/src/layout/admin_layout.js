// import Side_Bar from "../components/Admin/SideBar"
// import Admin_Route from "../routes/admin_Route"
import AdminSidebar from '../components/admin/adminSideBar';
import AdminRoutes from '../routes/admin_Route';

const Admin_Layout = () => {
    return (
        <div className="d-flex" style={{ maxHeight: '100vh', width: '100%' }}>
            <div
                className="col-2"
                style={{ height: '100%', backgroundColor: '#0ba9e7ff' }}
            >
                <AdminSidebar />
            </div>
            <main className="bg-light col-10 p-3" style={{ height: '100%' }}>
                <AdminRoutes />
            </main>
        </div>
    );
};

export default Admin_Layout;
