import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import { getContests } from '../api/contests.api';
import './Contests.css';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            setLoading(true);
            try {
                const res = await getContests();
                if (res.success && res.data) {
                    setContests(res.data);
                }
            } catch (err) {
                console.error(err);
                // Fallback dummy data for visualization
                setContests([
                    { _id: '1', title: 'Weekly Contest 401', startTime: new Date(Date.now() - 86400000).toISOString(), duration: 90, status: 'past' },
                    { _id: '2', title: 'Weekly Contest 402', startTime: new Date(Date.now() + 86400000 * 2).toISOString(), duration: 90, status: 'upcoming' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const upcoming = contests.filter(c => new Date(c.startTime) > new Date());
    const past = contests.filter(c => new Date(c.startTime) <= new Date());

    return (
        <div className="page-wrapper container animate-fade-in">
            <div className="contests-header text-center">
                <Trophy size={48} className="text-gradient mb-4 mx-auto" style={{marginBottom: 16}} />
                <h1 className="text-gradient">Global Contests</h1>
                <p className="text-secondary">Compete with the best and climb the ranks</p>
            </div>

            {loading ? (
                <div className="skeletons-wrapper mt-4">
                    <div className="skeleton" style={{height: 120, marginBottom: 16}}></div>
                    <div className="skeleton" style={{height: 120}}></div>
                </div>
            ) : (
                <div className="contests-grid">
                    <section className="contest-section">
                        <h2>Upcoming Contests</h2>
                        {upcoming.length > 0 ? (
                            upcoming.map(contest => (
                                <div key={contest._id} className="glass-card contest-card upcoming">
                                    <div className="contest-info">
                                        <h3>{contest.title}</h3>
                                        <div className="contest-meta">
                                            <span><Calendar size={14}/> {new Date(contest.startTime).toLocaleString()}</span>
                                            <span><Clock size={14}/> {contest.duration} mins</span>
                                        </div>
                                    </div>
                                    <Link to={`/contests/${contest._id}`} className="btn btn-primary">
                                        View Details <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="glass-panel text-center" style={{padding: 40}}>
                                <p className="text-secondary">No upcoming contests at the moment.</p>
                            </div>
                        )}
                    </section>

                    <section className="contest-section mt-5">
                        <h2>Past Contests</h2>
                        {past.map(contest => (
                            <div key={contest._id} className="glass-card contest-card past">
                                <div className="contest-info">
                                    <h3>{contest.title}</h3>
                                    <div className="contest-meta">
                                        <span>Ended on {new Date(contest.startTime).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Link to={`/contests/${contest._id}`} className="btn btn-secondary">
                                    Practice <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
};

// Simple Clock Icon for the file scope
const Clock = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default Contests;
