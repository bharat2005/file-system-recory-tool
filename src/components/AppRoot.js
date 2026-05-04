import Controls from "./Controls";
import DiskPanel from "./DiskPanel";
import FileTable from "./FileTable";
import LogPanel from "./LogPanel";


const { useState, useEffect, useRef } = React;

const STATUS_COLORS = {
    0: 'bg-free',
    1: 'bg-used',
    2: 'bg-corrupted',
    3: 'bg-recovered',
    4: 'bg-bad'
};



export default function AppRoot() {
    const [state, setState] = useState({
        sectors: Array(SECTOR_COUNT).fill(0),
        files: [],
        journal: [],
        btree_keys: [],
        lru_snapshot: [],
        benchmarks: []
    });
    const [logs, setLogs] = useState(["System initialized in pure Client-Side mode."]);
    const [statusText, setStatusText] = useState("System nominal — disk mounted");
    const [statusColor, setStatusColor] = useState("green");

    const refreshState = () => {
        setState({
            sectors: [...window.fsDisk.sectors],
            files: [...window.fsDisk.files],
            journal: [...window.fsDisk.journal],
            btree_keys: window.fsBTree.traverse(),
            lru_snapshot: window.fsLRU.snapshot().map(e => e[0]),
            benchmarks: [...window.fsBenchmarks]
        });
    };

    useEffect(() => {
        refreshState();
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleAction = async (action, payload) => {
        try {
            let res = {};
            if (action === 'write') {
                const { name, ftype } = payload;
                const { entry, err } = window.fsDisk.write_file(name, ftype);
                if (err) res.error = err;
                else {
                    window.fsBTree.insert(name, entry);
                    window.fsLRU.put(`${name}.${ftype}`, entry);
                    res.entry = entry;
                }
            } else if (action === 'crash') {
                res.events = window.fsDisk.simulate_crash(payload.mode);
            } else if (action === 'reset') {
                window.fsDisk.reset();
                window.fsBTree = new BTree();
                window.fsLRU = new LRUCache();
                window.fsBenchmarks = [];
            } else if (action === 'recover/signatures') {
                res.results = window.fsDisk.scan_signatures();
            } else if (action === 'recover/journal') {
                res = window.fsDisk.recover_journal();
            } else if (action === 'recover/all') {
                res = window.fsDisk.recover_all();
            } else if (action === 'benchmark') {
                const speeds = window.fsDisk.benchmark(payload.mode);
                window.fsBenchmarks.push({ mode: payload.mode, ...speeds });
                res = { ...speeds };
                if (payload.mode === 'both') {
                    res.compacted = window.fsDisk.defragment();
                }
            }
            refreshState();
            return res;
        } catch (e) {
            console.error(e);
            return { error: e.message };
        }
    };

    return (
        <div className="app-container fade-in">
            <header className="glass-panel">
                <div className="header-left">
                    <div className="status-indicator">
                        <span className={`dot ${statusColor}`}></span>
                    </div>
                    <div>
                        <h1>FS Recovery Tool <span style={{fontSize: "0.5em", verticalAlign: "top", background: "rgba(139, 92, 246, 0.2)", color: "#c4b5fd", padding: "2px 6px", borderRadius: "4px"}}>React Client-Side</span></h1>
                        <p className="subtitle">CSE-316 CA2 | Advanced File System Simulator</p>
                    </div>
                </div>
                <div className="header-right">
                    <p className={`status-text text-${statusColor}`}>{statusText}</p>
                </div>
            </header>

            <div className="main-content">
                <Controls
                    onAction={handleAction}
                    addLog={addLog}
                    setStatus={(text, color) => { setStatusText(text); setStatusColor(color); }}
                    files={state.files}
                />

                <main className="workspace">
                    <DiskPanel sectors={state.sectors} files={state.files} />

                    <div className="bottom-panels">
                        <FileTable files={state.files} />
                        <LogPanel logs={logs} />
                    </div>

                    {/*<OptimizerPanel */}
                    {/*    lru={state.lru_snapshot} */}
                    {/*    benchmarks={state.benchmarks}*/}
                    {/*    btreeKeys={state.btree_keys} */}
                    {/*/>*/}
                </main>
            </div>


        </div>
    );
}