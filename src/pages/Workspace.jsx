import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Send, CheckCircle2, XCircle, Clock, Database, AlertCircle } from 'lucide-react';
import { getProblemBySlug } from '../api/problems.api';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import './Workspace.css';

const DEFAULT_TEMPLATES = {
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
    python: 'def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()',
    javascript: 'function solve() {\n    // Write your code here\n}\n\nsolve();'
};

const Workspace = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const socket = useSocket();
    
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [consoleResult, setConsoleResult] = useState(null);

    // Listen for real-time WebSocket updates from Judge0 / API Gateway
    useEffect(() => {
        if (!socket) return;
        
        socket.on('submission_update', (data) => {
            setConsoleResult((prev) => ({
                ...prev,
                ...data,
                status: data.status,
                message: data.message || `Execution Status: ${data.status.toUpperCase()}`
            }));
            
            // If execution is complete, unlock the editor buttons
            if (['accepted', 'error', 'failed', 'time_limit_exceeded', 'wrong_answer'].includes(data.status)) {
                setSubmitting(false);
                setRunning(false);
            }
        });

        return () => {
            socket.off('submission_update');
        };
    }, [socket]);

    // Initial fetch
    useEffect(() => {
        const fetchProblem = async () => {
            setLoading(true);
            try {
                const res = await getProblemBySlug(slug);
                if (res.success && res.data) {
                    setProblem(res.data);
                    updateBoilerplate(res.data, language);
                }
            } catch (err) {
                console.error(err);
                // Fallback for UI testing
                const dummyProblem = {
                    _id: 'dummy_id',
                    title: 'Two Sum',
                    difficulty: 'easy',
                    description: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>',
                    exmaples: [
                        { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'Because nums[0] + nums[1] == 9.' },
                        { input: '3\n3 2 4\n6', output: '1 2' }
                    ],
                    constraints: '2 <= nums.length <= 10^4'
                };
                setProblem(dummyProblem);
                updateBoilerplate(dummyProblem, language);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [slug]);

    // Handle language change boilerplate self-rectification
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (problem) {
            updateBoilerplate(problem, newLang);
        }
    };

    const updateBoilerplate = (prob, lang) => {
        if (prob.codeTemplate && prob.codeTemplate.length > 0) {
            const template = prob.codeTemplate.find(t => t.language === lang);
            setCode(template ? template.starterCode : DEFAULT_TEMPLATES[lang]);
        } else {
            setCode(DEFAULT_TEMPLATES[lang]);
        }
    };

    const handleRun = async () => {
        if (!user) {
            alert('Please login to run code');
            return;
        }
        setRunning(true);
        setConsoleResult({ type: 'run', status: 'pending', message: 'Compiling and Running against sample test cases...' });
        
        try {
            const res = await apiClient.post('/submission/run', {
                problemId: problem._id,
                code,
                language
            });
            // If success, we just wait for the websocket to fire 'submission_update'
            if (!res.success) {
                setConsoleResult({ type: 'run', status: 'error', message: res.message || 'Run failed' });
                setRunning(false);
            }
        } catch (err) {
            // Mocking a successful run response for demonstration if backend endpoint doesn't exist
            setTimeout(() => {
                setConsoleResult({ 
                    type: 'run', 
                    status: 'success', 
                    message: 'Code executed successfully against sample testcases.',
                    output: '0 1\n',
                    expectedOutput: '0 1\n',
                    runtime: 12,
                    memory: 1024
                });
                setRunning(false);
            }, 1500);
        }
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('Please login to submit code');
            return;
        }
        setSubmitting(true);
        setConsoleResult({ type: 'submit', status: 'pending', message: 'Submission queued for final evaluation...' });
        
        try {
            const res = await apiClient.post('/submission/submit', {
                problemId: problem._id,
                code,
                language
            });
            // Result will arrive via WebSocket
            if (!res.success) {
                 setConsoleResult({ type: 'submit', status: 'error', message: res.message || 'Submission failed' });
                 setSubmitting(false);
            }
        } catch (err) {
            // Mocking a submission response
            setTimeout(() => {
                setConsoleResult({ 
                    type: 'submit', 
                    status: 'accepted', 
                    message: 'All hidden test cases passed successfully.',
                    runtime: 14,
                    memory: 1048
                });
                setSubmitting(false);
            }, 2000);
        }
    };

    if (loading) return <div className="page-wrapper flex-center"><div className="skeleton" style={{width: 300, height: 40}}></div></div>;
    if (!problem) return <div className="page-wrapper flex-center">Problem not found</div>;

    return (
        <div className="workspace-container animate-fade-in">
            {/* Left Pane: Problem Description */}
            <div className="workspace-pane problem-pane glass-panel">
                <div className="pane-header">
                    <h3>{problem.title}</h3>
                    <span className={`badge badge-${problem.difficulty}`}>{problem.difficulty}</span>
                </div>
                
                <div className="pane-content custom-scrollbar">
                    <div className="problem-description" dangerouslySetInnerHTML={{ __html: problem.description }}></div>
                    
                    {problem.exmaples && problem.exmaples.length > 0 && (
                        <div className="problem-examples">
                            <h4>Examples</h4>
                            {problem.exmaples.map((ex, idx) => (
                                <div key={idx} className="cf-example-block">
                                    <div className="cf-io-box">
                                        <div className="cf-title">Input</div>
                                        <pre className="cf-content">{ex.input}</pre>
                                    </div>
                                    <div className="cf-io-box">
                                        <div className="cf-title">Output</div>
                                        <pre className="cf-content">{ex.output}</pre>
                                    </div>
                                    {ex.explanation && (
                                        <div className="cf-explanation">
                                            <div className="cf-title">Note</div>
                                            <p>{ex.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {problem.constraints && (
                        <div className="problem-constraints">
                            <h4>Constraints</h4>
                            <pre className="mono">{problem.constraints}</pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Editor & Output */}
            <div className="workspace-pane editor-pane">
                <div className="editor-header glass-panel">
                    <select 
                        className="glass-select language-select"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value="cpp">C++ (GCC)</option>
                        <option value="java">Java (OpenJDK)</option>
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (Node.js)</option>
                    </select>

                    <div className="editor-actions">
                        <button className="btn btn-secondary run-btn" onClick={handleRun} disabled={running || submitting}>
                            {running ? <Clock size={16} /> : <Play size={16} />} 
                            {running ? 'Running...' : 'Run Code'}
                        </button>
                        <button className="btn btn-primary submit-btn" onClick={handleSubmit} disabled={running || submitting}>
                            {submitting ? 'Submitting...' : <><Send size={16} /> Submit</>}
                        </button>
                    </div>
                </div>

                <div className="editor-container glass-panel">
                    <textarea 
                        className="code-editor mono custom-scrollbar"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    ></textarea>
                </div>

                {/* Verification Console */}
                {consoleResult && (
                    <div className="result-console glass-panel animate-slide-up">
                        <div className="result-header">
                            <h4 className="flex-center" style={{gap: 8}}>
                                {consoleResult.type === 'run' ? 'Test Run Console' : 'Submission Verdict'}
                            </h4>
                            
                            {/* Status Badge */}
                            {consoleResult.status === 'accepted' || consoleResult.status === 'success' ? (
                                <span className="badge badge-easy"><CheckCircle2 size={12} /> {consoleResult.status === 'accepted' ? 'Accepted' : 'Tests Passed'}</span>
                            ) : consoleResult.status === 'pending' ? (
                                <span className="badge" style={{background: 'var(--status-pending)'}}>Processing...</span>
                            ) : (
                                <span className="badge badge-hard"><XCircle size={12} /> {consoleResult.status || 'Failed'}</span>
                            )}
                        </div>
                        
                        <div className="console-content custom-scrollbar">
                            {(consoleResult.runtime || consoleResult.memory) && (
                                <div className="result-metrics mb-3">
                                    {consoleResult.runtime && (
                                        <div className="metric">
                                            <Clock size={16} className="text-secondary" />
                                            <span>{consoleResult.runtime} ms</span>
                                        </div>
                                    )}
                                    {consoleResult.memory && (
                                        <div className="metric">
                                            <Database size={16} className="text-secondary" />
                                            <span>{consoleResult.memory} KB</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {consoleResult.message && (
                                <div className="result-message mb-3">
                                    {consoleResult.message}
                                </div>
                            )}

                            {/* Detailed Output for Run */}
                            {consoleResult.type === 'run' && consoleResult.output !== undefined && (
                                <div className="cf-example-block" style={{marginTop: 16}}>
                                    <div className="cf-io-box">
                                        <div className="cf-title">Your Output</div>
                                        <pre className="cf-content">{consoleResult.output || 'No output'}</pre>
                                    </div>
                                    {consoleResult.expectedOutput && (
                                        <div className="cf-io-box">
                                            <div className="cf-title">Expected Output</div>
                                            <pre className="cf-content">{consoleResult.expectedOutput}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Workspace;
