import { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

export default function useNavigation(initialActivePanel) {
    const [activePanel, setActivePanel] = useState(initialActivePanel);
    const [history, setHistory] = useState([initialActivePanel]);

    useEffect(() => {
        function handlePopState(e) {
            e.preventDefault();

            if (e.state) {
                if (e.state.panel === initialActivePanel) {
                    connect.send('VKWebAppDisableSwipeBack');
                }
                setActivePanel(e.state.panel);
            } else {
                setActivePanel(initialActivePanel);
                connect.send('VKWebAppDisableSwipeBack');
                window.history.pushState({ panel: initialActivePanel }, initialActivePanel);
            }
        }

        window.addEventListener('popstate', handlePopState);
        window.history.pushState({ panel: initialActivePanel }, initialActivePanel);

        return () => {
            window.history.pushState(null, '');
            window.removeEventListener('popstate', handlePopState);
        };
    }, [initialActivePanel]);

    function goForward(nextPanel) {
        const nextHistory = [...history, nextPanel];

        if (activePanel === initialActivePanel) {
            connect.send('VKWebAppEnableSwipeBack');
        }

        setActivePanel(nextPanel);
        setHistory(nextHistory);
        window.history.pushState({ panel: nextPanel }, nextPanel);
    }

    function goBack() {
        const nextHistory = [...history];
        nextHistory.pop();

        setHistory(nextHistory);
        window.history.back();
    }

    return [activePanel, history, goForward, goBack];
}