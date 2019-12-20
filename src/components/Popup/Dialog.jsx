import React, { useRef, useState, useCallback, useEffect } from 'react';
import { string, oneOf, arrayOf, shape, bool, func } from 'prop-types';
import classNames from 'classnames';

import './Dialog.css';

import Button from 'components/Button';

import { useSwipeable, UP, DOWN } from 'react-swipeable';
import useLockBody from 'hooks/use-lock-body';

const Dialog = ({ className, disabled, onClose, animationType, type, title, message, children, actions }) => {
    useLockBody(true);

    const wrapperRef = useRef();

    const [bottom, setBottom] = useState(0);
    const [hasScroll, setHasScroll] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [dragging, setDragging] = useState(false);

    const initialWrapper = useCallback(() => {
        if (wrapperRef && wrapperRef.current) {
            const { scrollHeight, offsetHeight } = wrapperRef.current;

            setHasScroll(scrollHeight > offsetHeight);
        }
    }, [wrapperRef]);

    function handleSwiping({ deltaY, event, dir }) {
        if (disabled) {
            return;
        }

        const target = event.target;
        const wrapper = wrapperRef.current;

        if (target && wrapper && hasScroll) {
            const scrolled = wrapper.scrollTop === wrapper.scrollHeight - wrapper.offsetHeight;
            const scrollTop = dir === UP;
            const scrollDown = dir === DOWN;

            setScrolling(true);

            if (scrollDown) {
                // eslint-disable-next-line no-mixed-operators
                if (scrolled || scrolling && !dragging) {
                    return;
                }

                setScrolling(false);
            }

            if (scrollTop) {
                // eslint-disable-next-line no-mixed-operators
                if (!scrolled || scrolling && !dragging) {
                    return;
                }                
            }
        }

        if (!scrolling) {
            event.preventDefault();

            if (!dragging) {
                setDragging(true);
            }

            if (deltaY < 0) {
                setBottom(deltaY);
            }
        }
    }

    function handleSwipedDown() {
        if (scrolling) {
            setScrolling(false);
        }

        if (dragging) {
            setDragging(false);

            if (bottom < -50) {
                onClose();

                return;
            }

            const timerId = setInterval(() => {
                setBottom((bottom) => {
                    if (bottom >= 0) {
                        clearInterval(timerId);
                        return 0;
                    }

                    return bottom + 1;
                });
            }, 1);
        }
    }

    const handlers = useSwipeable({
        onSwiping: handleSwiping,
        onSwipedDown: handleSwipedDown,
        preventDefaultTouchmoveEvent: false,
        trackMouse: true
    });
    
    const handleClick = useCallback((e) => e.stopPropagation(), []);

    const renderAction = useCallback((action, index) => {
        return <Button
            key={index}
            className="Dialog__action"
            theme={action.theme}
            size="medium"
            children={action.title}
            full={action.full}
            backlight={action.backlight}
            onClick={action.action}
            disabled={action.disabled} />;
    }, []);

    useEffect(() => {
        initialWrapper();

        window.addEventListener('resize', initialWrapper);

        return () => {
            window.removeEventListener('resize', initialWrapper);
        };
    }, [initialWrapper]);

    return (
        <div
            className={classNames(
                className,
                'Dialog',
                `Dialog--${type}`,
                `Dialog--slide-down-${animationType}`
            )}
            onClick={handleClick}
            {...handlers}
            style={{ transform: `translate3d(-50%, ${-bottom}px, 0)` }}>
            <div className="Dialog__wrapper" ref={wrapperRef}>
                {title && <h3 className="Dialog__title" children={title} />}
                {message && <p className="Dialog__message" dangerouslySetInnerHTML={{ __html: message }} />}
                {children}

                {(Array.isArray(actions) && actions.length > 0) &&
                    <div className="Dialog__actions" children={actions.map(renderAction)} />}
            </div>
        </div>
    );
};

Dialog.propTypes = {
    className: string,
    animationType: oneOf(['enter', 'leave']).isRequired,
    type: oneOf(['info', 'success', 'danger']),
    title: string,
    message: string,
    actions: arrayOf(shape({
        theme: oneOf(['primary', 'secondary', 'info', 'link']),
        title: string,
        action: func,
        full: bool,
        backlight: bool
    }))
};

Dialog.defaultProps = {
    type: 'info',
};

export default Dialog;