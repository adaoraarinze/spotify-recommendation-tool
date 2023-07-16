import React from 'react';
import './styles/Navbar.css';

const Navbar= ({ code }) => {
    return (
        <>
            <div>
                <nav>
                    <h2>Spotify Recommendation Tool</h2>
                    <ul>
                        {code && 
                        <li><a href={"https://accounts.spotify.com/en/logout "}>Logout</a></li>}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Navbar;