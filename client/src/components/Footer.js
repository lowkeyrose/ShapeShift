import React from 'react';
import './style/Footer.css'
import { Link } from 'react-router-dom';
import { faGithub, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <div className="footer-clean">
      <footer>
        <div className="container">
          <div className="row">
            <div className="item">
              <h3>Services</h3>
              <ul>
                <li><Link to="">Web design</Link></li>
                <li><Link to="">Development</Link></li>
                <li><Link to="">Hosting</Link></li>
              </ul>
            </div>
            <div className="item">
              <h3>About</h3>
              <ul>
                <li><Link to="">Company</Link></li>
                <li><Link to="">Terms & Privacy</Link></li>
              </ul>
            </div>
            <div className="item">
              <h3>Careers</h3>
              <ul>
                <li><Link to="">Job openings</Link></li>
                <li><Link to="">Employee success</Link></li>
                <li><Link to="">Benefits</Link></li>
              </ul>
            </div>
            <div className="item social">

              <Link to=""><FontAwesomeIcon icon={faGithub} /></Link>
              <Link to=""><FontAwesomeIcon icon={faLinkedin} /></Link>
              <Link to=""><FontAwesomeIcon icon={faWhatsapp} /></Link>
              <p className="copyright">ShapeShift © 2024</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
