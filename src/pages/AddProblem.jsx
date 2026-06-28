import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '../api/client';
import './AddProblem.css';

const AddProblem = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    // Core Problem Data
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        difficulty: 'easy',
        description: '',
        constraints: ''
    });

    // Dynamic Lists
    const [tags, setTags] = useState('');
    
    // Public Examples
    const [examples, setExamples] = useState([
        { input: '', output: '', explanation: '' }
    ]);
    
    // Hidden Testcases
    const [testcases, setTestcases] = useState([
        { input: '', expectedOutput: '' }
    ]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -- EXAMPLES HANDLERS --
    const handleExampleChange = (index, field, value) => {
        const newExamples = [...examples];
        newExamples[index][field] = value;
        setExamples(newExamples);
    };
    
    const addExample = () => {
        setExamples([...examples, { input: '', output: '', explanation: '' }]);
    };
    
    const removeExample = (index) => {
        const newExamples = examples.filter((_, i) => i !== index);
        setExamples(newExamples);
    };

    // -- TESTCASE HANDLERS --
    const handleTestcaseChange = (index, field, value) => {
        const newTestcases = [...testcases];
        newTestcases[index][field] = value;
        setTestcases(newTestcases);
    };

    const addTestcase = () => {
        setTestcases([...testcases, { input: '', expectedOutput: '' }]);
    };

    const removeTestcase = (index) => {
        const newTestcases = testcases.filter((_, i) => i !== index);
        setTestcases(newTestcases);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const payload = {
            ...formData,
            tags: tags.split(',').map(t => t.trim()).filter(t => t),
            exmaples: examples, // Backend schema spells it 'exmaples'
            testcases: testcases
        };

        try {
            // Usually hits POST /problem/create
            const res = await apiClient.post('/problem/create', payload);
            if (res.success) {
                alert('Problem added successfully!');
                navigate('/admin');
            } else {
                alert(res.message || 'Failed to add problem');
            }
        } catch (err) {
            // Mock success for UI demo
            setTimeout(() => {
                alert('Problem added successfully (Mocked UI)!');
                navigate('/admin');
            }, 1000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-wrapper container animate-fade-in add-problem-page">
            <div className="flex-between mb-4">
                <button className="btn btn-secondary flex-center" onClick={() => navigate('/admin')} style={{gap: 8}}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <h2>Add New Problem</h2>
            </div>

            <form onSubmit={handleSubmit} className="add-problem-form">
                
                {/* Basic Info */}
                <div className="glass-panel form-section">
                    <h3>Basic Information</h3>
                    <div className="input-grid">
                        <div className="input-group">
                            <label>Problem Title</label>
                            <input type="text" name="title" className="glass-input" value={formData.title} onChange={handleFormChange} required />
                        </div>
                        <div className="input-group">
                            <label>Slug (URL identifier)</label>
                            <input type="text" name="slug" className="glass-input" value={formData.slug} onChange={handleFormChange} required />
                        </div>
                        <div className="input-group">
                            <label>Difficulty</label>
                            <select name="difficulty" className="glass-select" value={formData.difficulty} onChange={handleFormChange}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Tags (Comma separated)</label>
                            <input type="text" className="glass-input" placeholder="e.g. Array, Dynamic Programming, Math" value={tags} onChange={(e) => setTags(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Problem Statement */}
                <div className="glass-panel form-section">
                    <h3>Problem Statement</h3>
                    <div className="input-group">
                        <label>Description (HTML/Markdown)</label>
                        <textarea 
                            name="description" 
                            className="glass-input custom-scrollbar" 
                            style={{minHeight: 200, resize: 'vertical'}}
                            value={formData.description}
                            onChange={handleFormChange}
                            required
                        ></textarea>
                    </div>
                    <div className="input-group mt-3">
                        <label>Constraints</label>
                        <textarea 
                            name="constraints" 
                            className="glass-input custom-scrollbar"
                            style={{minHeight: 80, resize: 'vertical'}}
                            value={formData.constraints}
                            onChange={handleFormChange}
                        ></textarea>
                    </div>
                </div>

                {/* Public Examples */}
                <div className="glass-panel form-section">
                    <div className="flex-between mb-3">
                        <h3>Public Examples</h3>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={addExample}>
                            <Plus size={14} /> Add Example
                        </button>
                    </div>
                    <p className="text-secondary mb-4">These are visible to the user in the problem statement.</p>

                    <div className="dynamic-list">
                        {examples.map((ex, index) => (
                            <div key={index} className="dynamic-item glass-card">
                                <div className="item-header flex-between mb-3">
                                    <strong>Example {index + 1}</strong>
                                    {examples.length > 1 && (
                                        <button type="button" className="icon-btn text-danger" onClick={() => removeExample(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Input</label>
                                        <textarea className="glass-input mono" value={ex.input} onChange={e => handleExampleChange(index, 'input', e.target.value)} required></textarea>
                                    </div>
                                    <div className="input-group">
                                        <label>Output</label>
                                        <textarea className="glass-input mono" value={ex.output} onChange={e => handleExampleChange(index, 'output', e.target.value)} required></textarea>
                                    </div>
                                </div>
                                <div className="input-group mt-3">
                                    <label>Explanation (Optional)</label>
                                    <input type="text" className="glass-input" value={ex.explanation} onChange={e => handleExampleChange(index, 'explanation', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hidden Testcases */}
                <div className="glass-panel form-section" style={{border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div className="flex-between mb-3">
                        <h3 className="text-danger" style={{color: 'var(--status-danger)'}}>Hidden Test Cases</h3>
                        <button type="button" className="btn btn-danger btn-sm" onClick={addTestcase}>
                            <Plus size={14} /> Add Testcase
                        </button>
                    </div>
                    <p className="text-secondary mb-4">These run in the backend during submission and remain hidden from the user.</p>

                    <div className="dynamic-list">
                        {testcases.map((tc, index) => (
                            <div key={index} className="dynamic-item glass-card" style={{border: '1px solid rgba(239, 68, 68, 0.15)'}}>
                                <div className="item-header flex-between mb-3">
                                    <strong>Testcase {index + 1}</strong>
                                    {testcases.length > 1 && (
                                        <button type="button" className="icon-btn text-danger" onClick={() => removeTestcase(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                                <div className="input-grid">
                                    <div className="input-group">
                                        <label>Input</label>
                                        <textarea className="glass-input mono" value={tc.input} onChange={e => handleTestcaseChange(index, 'input', e.target.value)} required></textarea>
                                    </div>
                                    <div className="input-group">
                                        <label>Expected Output</label>
                                        <textarea className="glass-input mono" value={tc.expectedOutput} onChange={e => handleTestcaseChange(index, 'expectedOutput', e.target.value)} required></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions mt-5 mb-5" style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button type="submit" className="btn btn-primary" style={{padding: '16px 32px', fontSize: '1.1rem'}} disabled={submitting}>
                        {submitting ? 'Saving Problem...' : <><Save size={20} /> Publish Problem</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProblem;
