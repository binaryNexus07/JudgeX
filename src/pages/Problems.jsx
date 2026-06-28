import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Play, CheckCircle } from 'lucide-react';
import { getProblems } from '../api/problems.api';
import './Problems.css';

const Problems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficulty, setDifficulty] = useState('all');

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                // Fetching all problems for now. 
                const res = await getProblems();
                if (res.success && res.data) {
                    setProblems(res.data.problems || res.data); // Adjusting based on exact response shape
                }
            } catch (err) {
                console.error('Failed to fetch problems', err);
                // Fallback dummy data for visual testing before backend connection
                setProblems([
                    { _id: '1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', tags: ['Array', 'Hash Table'] },
                    { _id: '2', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium', tags: ['Linked List', 'Math'] },
                    { _id: '3', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'hard', tags: ['Array', 'Binary Search'] },
                    { _id: '4', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'medium', tags: ['String', 'DP'] },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDiff = difficulty === 'all' || p.difficulty === difficulty;
        return matchesSearch && matchesDiff;
    });

    return (
        <div className="page-wrapper container">
            <div className="problems-header flex-between animate-fade-in">
                <div>
                    <h2>Problem Set</h2>
                    <p className="text-secondary">Explore and solve algorithmic challenges</p>
                </div>
                
                <div className="problems-filters flex-center">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input 
                            type="text" 
                            className="glass-input" 
                            placeholder="Search problems..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-dropdown">
                        <Filter size={18} />
                        <select 
                            className="glass-select"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="problems-list animate-slide-up">
                {loading ? (
                    <div className="skeletons-wrapper">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="skeleton problem-skeleton"></div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel problems-table-container">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th>Tags</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProblems.length > 0 ? (
                                    filteredProblems.map((problem) => (
                                        <tr key={problem._id}>
                                            <td width="60">
                                                <div className="status-icon pending">
                                                    {/* In a real app, check if user solved it */}
                                                    <div className="unsolved-circle"></div>
                                                </div>
                                            </td>
                                            <td width="40%">
                                                <Link to={`/problems/${problem.slug}`} className="problem-title-link">
                                                    {problem.title}
                                                </Link>
                                            </td>
                                            <td width="15%">
                                                <span className={`badge badge-${problem.difficulty}`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td width="25%">
                                                <div className="tags-container">
                                                    {problem.tags && problem.tags.slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="badge badge-tag">{tag}</span>
                                                    ))}
                                                    {problem.tags && problem.tags.length > 3 && (
                                                        <span className="badge badge-tag">+{problem.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <Link to={`/problems/${problem.slug}`} className="btn btn-primary solve-btn">
                                                    Solve <Play size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center no-results">
                                            No problems found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Problems;
