import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { string, number, bool, func } from 'prop-types';
import classNames from 'classnames';

import './Input.css';

import { gaps } from 'helpers/numbers';

const MAX_FONT_SIZE = 52;

const Input = ({ className, name, top, placeholder, value: initialValue, maxLength, disabled, postfix: postfixProp, onChange }) => {
    const [value, setValue] = useState(initialValue);
    const [focus, setFocus] = useState(false);

    const root = useRef();
    const input = useRef();
    const postfix = useRef();
    const buffer = useRef();

    const postfixBlur = useMemo(() => {
        let blur = !value;

        if (blur && !focus) {
            return true;
        }

        return blur;
    }, [value, focus]);

    const updateInputStyle = useCallback((value) => {
        const getMaxWidth = () => (postfix.current)
            ? root.current.clientWidth - postfix.current.offsetWidth
            : root.current.clientWidth;
        const getBufferWidth = () => buffer.current.clientWidth;
        
        const setStyleProperty = (node, property, value) => {
            if (node) {
                node.style[property] = value;
            }
        };
    
        if (value !== '') {
            let direction = 'DOWN';
            buffer.current.innerHTML = value;

            const fontSize = buffer.current.style.fontSize;
            
            let size = Number(fontSize.substring(0, fontSize.length - 2)) || MAX_FONT_SIZE;
            
            if (getMaxWidth() < getBufferWidth()) {                
                while (getMaxWidth() < getBufferWidth()) {
                    setStyleProperty(buffer.current, 'fontSize', `${--size}px`);
                    setStyleProperty(postfix.current, 'fontSize', `${size}px`);
                }
            } else if (size < MAX_FONT_SIZE) {
                direction = 'UP';

                while (getBufferWidth() < getMaxWidth() && size < MAX_FONT_SIZE) {
                    setStyleProperty(postfix.current, 'fontSize', `${++size}px`);
                    setStyleProperty(buffer.current, 'fontSize', `${size}px`);
                }
            }

            setStyleProperty(
                input.current,
                'width',
                (direction === 'DOWN')
                    ? `${getBufferWidth()}px`
                    : `${getBufferWidth() - 50}px`
            );
            setStyleProperty(input.current, 'fontSize', `${size}px`);
        }
    }, [root, input, buffer, postfix]);

    const handleFocus = useCallback(() => setFocus(true), []);

    const handleBlur = useCallback(() => setFocus(false), []);

    const handleChange = useCallback((e) => {
        const value = Number(e.currentTarget.value.replace(/\s/g, ''));
        const nextValue = (value) ? gaps(value) : '';
        setValue(nextValue);

        if (onChange) {
            onChange(e);
        }
    }, [onChange]);

    useEffect(() => updateInputStyle(value || placeholder), [updateInputStyle, value, placeholder]);

    return (
        <div className={classNames(className, 'Input', { 'Input--disabled': disabled })} ref={root}>
            <label
                className={classNames('Input__label', {
                    'Input__label--filled': value,
                    'Input__label--focus': focus
                })}
                htmlFor={name}
                children={top} />
            <div className="Input__row">
                <input
                    type="input"
                    inputMode="numeric"
                    id={name}
                    name={name}
                    className="Input__control"
                    placeholder={placeholder}
                    value={value}
                    maxLength={maxLength}
                    disabled={disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    ref={input} />
                {(postfixProp) &&
                    <span
                        className={classNames('Input__postfix', { 'Input__postfix--blur': postfixBlur })}
                        children={postfixProp}
                        ref={postfix} />}
            </div>
            <div className="Input__buffer" children={value} ref={buffer} />
        </div>
    );
};

Input.propTypes = {
    className: string,
    name: string.isRequired,
    top: string.isRequired,
    placeholder: string,
    value: string,
    maxLength: number,
    disabled: bool,
    onChange: func
}; 

Input.defaultProps = {
    maxLength: 12
};

export default Input;