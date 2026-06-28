import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContestById } from '../api/contests.api';
import './Contests.css';

const ContestDetail = () => {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContest = async () => {
            setLoading(true);
            try {
                const res = await getContestById(id);
                if (res.success && res.data) {
                    setContest(res.data);
                }
            } catch (err) {
                // Fallback for visual testing
                setContest({
                    _id: id,
                    title: `Contest ${id}`,
                    startTime: new Date(Date.now() + 86400000).toISOString(),
                    duration: 90,
                    description: 'This is a sample contest description. Solve 4 algorithmic challenges within 90 minutes.',
                    problems: [
                        { _id: '1', title: 'Two Sum', slug: 'two-sum', difficulty: 'easy' },
                        { _id: '2', title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'medium' }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchContest();
    }, [id]);

    if (loading) return <div className="page-wrapper flex-center"><div className="skeleton" style={{width: 300, height: 60}}></div></div>;
    if (!contest) return <div className="page-wrapper flex-center">Contest not found</div>;

    const isStarted = new Date(contest.startTime) <= new Date();

    return (
        <div className="page-wrapper container animate-fade-in">
            <div className="glass-panel contest-detail-header">
                <h2>{contest.title}</h2>
                <p className="text-secondary mb-4">{contest.description}</p>
                
                <div className="contest-meta-large flex-between">
                    <div>
                        <strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}
                    </div>
                    <div>
                        <strong>Duration:</strong> {contest.duration} minutes
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h3>Problems</h3>
                {isStarted ? (
                    <div className="glass-panel problems-table-container mt-3">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contest.problems && contest.problems.map(problem => (
                                    <tr key={problem._id}>
                                        <td>
                                            <Link to={`/problems/${problem.slug}`} className="problem-title-link">
                                                {problem.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${problem.difficulty}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <Link to={`/problems/${problem.slug}`} className="btn btn-secondary solve-btn">
                                                Solve
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass-panel text-center mt-3" style={{padding: 60}}>
                        <h4 className="text-secondary">Problems will be revealed when the contest starts.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestDetail;
