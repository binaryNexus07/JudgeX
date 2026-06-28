import { Link } from 'react-router-dom';
import { Terminal, Code, Trophy, Cpu } from 'lucide-react';
import bgVideo from '../assets/Landing_page_video.mp4';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section flex-center">
                {/* Background Video */}
                <div className="video-overlay"></div>
                <video autoPlay loop muted playsInline className="hero-video-bg">
                    <source src={bgVideo} type="video/mp4" />
                </video>

                <div className="hero-content animate-slide-up">
                    <h1 className="hero-title">
                        Master Algorithms with <span className="text-gradient">JudgeX</span>
                    </h1>
                    <p className="hero-subtitle">
                        A premium platform for competitive programming. Compile, test, and execute code in real-time across multiple languages with sub-millisecond precision.
                    </p>
                    <div className="hero-cta">
                        <Link to="/problems" className="btn btn-primary hero-btn">
                            Start Coding <Terminal size={18} />
                        </Link>
                        <Link to="/contests" className="btn btn-secondary hero-btn">
                            View Contests <Trophy size={18} />
                        </Link>
                    </div>
                </div>

                {/* Floating Shapes for Glow */}
                <div className="floating-shape shape-1 animate-float"></div>
                <div className="floating-shape shape-2 animate-float delay-200"></div>
                <div className="floating-shape shape-3 animate-float delay-300"></div>

                {/* Explicit Bottom Fade Overlay to guarantee smooth transition */}
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0, height: '250px',
                    background: 'linear-gradient(to bottom, transparent, #050510)',
                    zIndex: 3, pointerEvents: 'none'
                }}></div>
            </section>

            {/* Features Section */}
            <section className="features-section container" style={{ marginTop: '100px', paddingTop: '150px' }}>
                <h2 className="section-title text-center">Why <span className="text-gradient-purple">JudgeX?</span></h2>
                
                <div className="features-grid">
                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrapper blue">
                            <Cpu size={24} />
                        </div>
                        <h3>Lightning Fast Execution</h3>
                        <p>Powered by Judge0 and optimized sandboxing for instantaneous code compilation and execution.</p>
                    </div>

                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrapper purple">
                            <Code size={24} />
                        </div>
                        <h3>Multi-Language Support</h3>
                        <p>Write your solutions in C++, Java, Python, JavaScript, or Go with robust standard libraries.</p>
                    </div>

                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrapper cyan">
                            <Trophy size={24} />
                        </div>
                        <h3>Global Contests</h3>
                        <p>Compete in weekly algorithmic challenges and climb the global leaderboard to prove your skills.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
