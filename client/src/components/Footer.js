import React from 'react';
import './style/Footer.css'
import { Link } from 'react-router-dom';
import { faGithub, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <div className="footer-clean">
      <footer>
        <div className="footer-container">
          <div className="row">
            <div className="item">
              <h3>Services</h3>
              <ul>
                <li><Link to="/workouts">Workouts</Link></li>
                <li><Link to="in-development">Find a Workout Partner</Link></li>
                <li><Link to="in-development">Workout Challenge</Link></li>
              </ul>
            </div>
            <div className="item">
              <h3>Careers</h3>
              <ul>
                <li><Link to="/in-development">Job openings</Link></li>
                <li><Link to="/in-development">Employee success</Link></li>
                <li><Link to="/in-development">Benefits</Link></li>
              </ul>
            </div>
            <div className="item">
              <h3>About</h3>
              <ul>
                <li><Link to="/about">Company</Link></li>
                <li><Link to="/in-development">Terms & Privacy</Link></li>
              </ul>
            </div>
            <div className="item social">
              <Link to="https://github.com/lowkeyrose" target='blank'><FontAwesomeIcon icon={faGithub} /></Link>
              <Link to="https://www.linkedin.com/in/adam-regev-374567283/" target='blank'><FontAwesomeIcon icon={faLinkedin} /></Link>
              <Link to="https://api.whatsapp.com/send/?phone=972584201997&text&type=phone_number&app_absent=1" target='blank'><FontAwesomeIcon icon={faWhatsapp} /></Link>
              <p className="copyright">ShapeShift © 2024</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Footer;
