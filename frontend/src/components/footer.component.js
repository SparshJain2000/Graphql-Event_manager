import React from "react";
import "../stylesheets/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faFacebook,
    faInstagram,
    faGithub,
    faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
export default function footer() {
    return (
        <footer class='page-footer darken-3 text-white justify-content-center'>
            <div class='container '>
                <div class='row'>
                    <div class='row align-content-center text-center justify-content-center col-12 mx-auto my-1 icons'>
                        <a
                            href='https://www.facebook.com/sparsh.jain.9699 '
                            className='social'>
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>

                        <a
                            href='https://github.com/SparshJain2000'
                            className='social'>
                            <FontAwesomeIcon icon={faGithub} />
                        </a>

                        <a
                            href='https://www.instagram.com/sparsh._jain/ '
                            className='social'>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>

                        <a
                            href='https://www.linkedin.com/in/sparsh-jain-87379a168/ '
                            className='social'>
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                </div>
            </div>
            <div class='footer-copyright text-center py-2 '>
                <h5>
                    Made with 💝 by{"  "}
                    <a href='https://sparshjain.me' className='color-secondary'>
                        Sparsh Jain
                    </a>
                </h5>
            </div>
        </footer>
    );
}
