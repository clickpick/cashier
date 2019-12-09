import { createPortal } from 'react-dom';

const popupRoot = document.getElementById('popup');

export default function PopupContainer({ children }) {
    return createPortal(children, popupRoot);
};