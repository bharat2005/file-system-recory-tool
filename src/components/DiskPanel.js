
export default function DiskPanel({ sectors }) {
    const used = sectors.filter(s => s === 1).length;
    const corrupt = sectors.filter(s => s === 2).length;
    const recovered = sectors.filter(s => s === 3).length;
    const bad = sectors.filter(s => s === 4).length;

    const totalUsed = used + corrupt + recovered + bad;
    const usagePct = Math.round((totalUsed / SECTOR_COUNT) * 100);
    const corruptPct = Math.round((corrupt / SECTOR_COUNT) * 100);

    return (
        <div className="glass-panel disk-panel">
            <div className="panel-header">
                <h2>Virtual Disk Map (512 Sectors)</h2>
                <div className="legend">
                    <span className="legend-item"><span className="dot bg-free"></span> Free</span>
                    <span className="legend-item"><span className="dot bg-used"></span> Used</span>
                    <span className="legend-item"><span className="dot bg-corrupted"></span> Corrupt</span>
                    <span className="legend-item"><span className="dot bg-recovered"></span> Recovered</span>
                    <span className="legend-item"><span className="dot bg-bad"></span> Bad Block</span>
                </div>
            </div>
            <div className="disk-grid">
                {sectors.map((s, i) => (
                    <div key={i} className={`sector ${STATUS_COLORS[s]}`} title={`Sector ${i}`}></div>
                ))}
            </div>
            <div className="progress-bars">
                <div className="progress-bar-container">
                    <label>Storage <span>{usagePct}%</span></label>
                    <div className="progress-track"><div className="progress-fill bg-used" style={{width: `${usagePct}%`}}></div></div>
                </div>
                <div className="progress-bar-container">
                    <label>Corruption <span>{corruptPct}%</span></label>
                    <div className="progress-track"><div className="progress-fill bg-corrupted" style={{width: `${corruptPct}%`}}></div></div>
                </div>
            </div>
        </div>
    );
}
