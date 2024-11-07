function DashboardCard({ title, value }) {
    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{value}</p>
            </div>
        </div>
    );
}

export default DashboardCard;
