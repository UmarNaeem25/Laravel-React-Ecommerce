import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3">
            <div>&copy; {new Date().getFullYear()} Laravel React App. All rights reserved.</div>
        </footer>
    );
};

export default Footer;
