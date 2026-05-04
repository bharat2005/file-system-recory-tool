export default function LogPanel({ logs }) {
    const logEndRef = useRef(null);
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="glass-panel log-panel">
            <h2>System Logs</h2>
            <div className="log-container">
                {logs.map((log, i) => (
                    <div key={i} className="log-entry">{log}</div>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}

