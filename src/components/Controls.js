

export default function Controls({ onAction, addLog, setStatus, files }) {
    const [filename, setFilename] = useState("report");
    const [ftype, setFtype] = useState("pdf");

    const write = async () => {
        const data = await onAction('write', { name: filename, ftype });
        if (data.error) {
            addLog(`ERROR: ${data.error}`);
        } else {
            addLog(`WRITE OK: ${filename}.${ftype}`);
            setStatus("System nominal — disk mounted", "green");
        }
    };

    const crash = async (mode) => {
        const data = await onAction('crash', { mode });
        if (data.events) {
            data.events.forEach(e => addLog(`CRASH: ${e}`));
        }
        setStatus("ALERT: Disk crash detected — run recovery engine", "red");
    };

    const reset = async () => {
        await onAction('reset');
        addLog("Disk reset complete.");
        setStatus("System nominal — disk mounted", "green");
    };

    const recoverSigs = async () => {
        const data = await onAction('recover/signatures');
        if (data.results) {
            addLog(`Signature scan complete. Found ${data.results.length} signatures.`);
        }
    };

    const recoverJ = async () => {
        const data = await onAction('recover/journal');
        addLog(`Journal recovery: ${data.recovered?.length || 0} restored.`);
    };

    const recoverAll = async () => {
        setStatus("Recovering files...", "amber");
        const data = await onAction('recover/all');
        addLog(`Recover All: ${data.recovered?.length || 0} restored, ${data.lost?.length || 0} lost.`);
        setStatus("Recovery complete", "green");
    };

    const corruptCount = files.filter(f => f.status === 'corrupt').length;
    const recoveredCount = files.filter(f => f.status === 'recovered').length;

    return (
        <aside className="controls-panel">
            <div className="glass-panel section-panel">
                <h2>Module 1: Simulator</h2>
                <div className="control-group">
                    <label>Filename</label>
                    <input type="text" value={filename} onChange={e => setFilename(e.target.value)} />
                </div>
                <div className="control-group">
                    <label>Type</label>
                    <select value={ftype} onChange={e => setFtype(e.target.value)}>
                        <option value="pdf">PDF</option>
                        <option value="jpg">JPG</option>
                        <option value="txt">TXT</option>
                        <option value="mp4">MP4</option>
                        <option value="docx">DOCX</option>
                    </select>
                </div>
                <button className="btn primary full-width" onClick={write}>Write File</button>

                <div className="divider"></div>

                <div className="button-grid">
                    <button className="btn danger" onClick={() => crash('random')}>Rand Crash</button>
                    <button className="btn danger" onClick={() => crash('power')}>Power Fail</button>
                    <button className="btn warning" onClick={() => crash('bad')}>Bad Blocks</button>
                    <button className="btn outline" onClick={reset}>Reset Disk</button>
                </div>
            </div>

            <div className="glass-panel section-panel">
                <h2>Module 2: Recovery</h2>
                <div className="recovery-stats">
                    <div className="stat-box">
                        <span className="stat-label">Corrupt</span>
                        <span className="stat-value text-red">{corruptCount}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Recovered</span>
                        <span className="stat-value text-green">{recoveredCount}</span>
                    </div>
                </div>
                <div className="button-grid" style={{marginTop: '10px'}}>
                    <button className="btn secondary" onClick={recoverSigs}>Sig Scan</button>
                    <button className="btn secondary" onClick={recoverJ}>Journal Rec.</button>
                    <button className="btn success full-width" onClick={recoverAll}>Recover All</button>
                </div>
            </div>
        </aside>
    );
}
