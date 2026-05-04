

export default function FileTable({ files }) {
    const getStatusColor = (status) => {
        if (status === 'ok') return 'text-green';
        if (status === 'corrupt') return 'text-red';
        if (status === 'recovered') return 'text-blue';
        return 'text-amber';
    };

    return (
        <div className="glass-panel table-panel">
            <h2>File Allocation Table</h2>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Sectors</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((f, i) => (
                        <tr key={i}>
                            <td>{f.name}</td>
                            <td>{f.ftype.toUpperCase()}</td>
                            <td>{f.size_kb}KB</td>
                            <td>{f.sectors && f.sectors.length > 0 ? `${f.sectors[0]}-${f.sectors[f.sectors.length-1]}` : '-'}</td>
                            <td className={getStatusColor(f.status)}>{f.status.toUpperCase()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}