import { useEffect, useRef } from 'react';

function getClosestBody(el) {
    if (!el) {
        return null;
    } else if (el.tagName === 'BODY') {
        return el;
    } else if (el.tagName === 'IFRAME') {
        const document = el.contentDocument;
        return (document) ? document.body : null;
    } else if (!el.offsetParent) {
        return null;
    }

    return getClosestBody(el.offsetParent);
}

const bodies = new Map();
const doc = (typeof document === 'object') ? document : undefined;

export default (!doc)
    ? function useLockBodyMock(_locked = true, _elementRef) { }
    : function useLockBody(locked = true, elementRef) {
        let element = useRef(doc.body);
        if (elementRef) {
            element = elementRef;
        }

        useEffect(() => {
            const body = getClosestBody(element.current);

            if (!body) {
                return;
            }

            function handleTouchMove(e) {
                e.preventDefault();
            }

            const bodyInfo = bodies.get(body);

            if (locked) {
                if (!bodyInfo) {
                    bodies.set(body, { counter: 1, initialOverflow: body.style.overflow });

                    body.addEventListener('touchmove', handleTouchMove);
                    body.style.overflow = 'hidden';
                } else {
                    bodies.set(body, { counter: bodyInfo.counter + 1, initialOverflow: bodyInfo.initialOverflow });
                }
            } else {
                if (bodyInfo) {
                    if (bodyInfo.counter === 1) {
                        bodies.delete(body);

                        body.removeEventListener('touchmove', handleTouchMove);
                        body.style.overflow = bodyInfo.initialOverflow;
                    } else {
                        bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
                    }
                }
            }

            return () => {
                const bodyInfo = bodies.get(body);
                
                if (bodyInfo) {
                    if (bodyInfo.counter === 1) {
                        bodies.delete(body);

                        body.removeEventListener('touchmove', handleTouchMove);
                        body.style.overflow = bodyInfo.initialOverflow;
                    } else {
                        bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
                    }
                }
            };
        }, [locked, element]);
    }