import React, { useState, useEffect, useRef } from 'react';

const StickyNavbar = ({ children }) => {
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const lastDirection = useRef('up');

    useEffect(() => {
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;

            // Always show navbar near top
            if (currentScrollY < 10) {
                setShow(true);
                lastDirection.current = 'up';
                lastScrollY.current = currentScrollY;
                ticking.current = false;
                return;
            }

            const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';

            if (direction !== lastDirection.current) {
                setShow(direction === 'up');
                lastDirection.current = direction;
            }

            lastScrollY.current = currentScrollY;
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(updateNavbar);
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            style={{ 
                visibility: show ? 'visible' : 'hidden', 
                transition: 'visibility 0.3s ease',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
            {children}
        </div>
    );
};

export default StickyNavbar;


