import '../styles/common.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>SyncForge</h3>
          <p>Distributed team collaboration platform built for remote-first companies.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/tasks">Tasks</a></li>
            <li><a href="/team">Team</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://github.com">GitHub</a></li>
            <li><a href="https://docs.github.com">Documentation</a></li>
            <li><a href="https://support.github.com">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} SyncForge. All rights reserved.</p>
        <p>Built by a globally distributed team | Made with ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
