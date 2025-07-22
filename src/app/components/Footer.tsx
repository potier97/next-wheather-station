import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { track } from '@vercel/analytics';

const Footer = () => {
  
  const handleGitHubClick = () => {
    track('footer_github_click', {
      destination: 'telemetry-node-repo',
      timestamp: new Date().toISOString()
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800/50 border-t border-gray-700/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          
          {/* Left: Copyright */}
          <div className="text-xs text-gray-400">
            © 2023 - {currentYear} IoT Dashboard
          </div>

          {/* Right: Repository link */}
          <a
            href="https://github.com/potier97/telemetry-node"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleGitHubClick}
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            <span>Código fuente</span>
            <FontAwesomeIcon icon={faExternalLink} className="w-3 h-3" />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer; 