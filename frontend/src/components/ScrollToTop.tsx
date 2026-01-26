import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Store scroll positions for each route
const scrollPositions: { [key: string]: number } = {};

const ScrollToTop = () => {
    const location = useLocation();
    const navigationType = useNavigationType();
    const prevLocationRef = useRef<string>("");
    const prevNavigationTypeRef = useRef<string>("");
    const isFirstRender = useRef(true);

    // Save scroll position immediately before any DOM updates
    useLayoutEffect(() => {
        const currentPath = location.pathname + location.search;

        // Save the previous page's scroll position before navigating
        if (!isFirstRender.current && prevLocationRef.current && prevLocationRef.current !== currentPath) {
            scrollPositions[prevLocationRef.current] = window.scrollY;
            console.log(`💾 Saved scroll position for ${prevLocationRef.current}: ${window.scrollY}`);
        }

        isFirstRender.current = false;
    }, [location.pathname, location.search]);

    // Handle scroll restoration or scroll to top
    useEffect(() => {
        const currentPath = location.pathname + location.search;

        // If this is a REPLACE navigation to the same path, ignore it
        // This happens when React Query or other libraries update the location state
        if (navigationType === 'REPLACE' && prevLocationRef.current === currentPath) {
            console.log(`🔄 Ignoring REPLACE navigation to same path: ${currentPath}`);
            return;
        }

        // If this is a POP navigation (back/forward button)
        if (navigationType === 'POP') {
            const savedPosition = scrollPositions[currentPath];
            console.log(`🔙 POP navigation to ${currentPath}, saved position: ${savedPosition}`);

            if (savedPosition !== undefined) {
                // Restore saved scroll position
                // Use requestAnimationFrame to ensure DOM is fully rendered
                requestAnimationFrame(() => {
                    window.scrollTo(0, savedPosition);
                    console.log(`📍 Restored scroll to: ${savedPosition}`);
                });
            } else {
                // No saved position, scroll to top
                window.scrollTo(0, 0);
                console.log(`⬆️ No saved position, scrolled to top`);
            }
        } else if (navigationType === 'PUSH') {
            // For PUSH navigation, scroll to top
            window.scrollTo(0, 0);
            console.log(`⬆️ PUSH navigation to ${currentPath}, scrolled to top`);
        }
        // Ignore REPLACE navigations to different paths (let them keep current scroll)

        // Update the previous location and navigation type reference
        prevLocationRef.current = currentPath;
        prevNavigationTypeRef.current = navigationType;
    }, [location.pathname, location.search, navigationType]);

    return null;
};

export default ScrollToTop;
