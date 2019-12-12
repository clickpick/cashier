import React, { useCallback, useMemo, useEffect } from 'react';
import classNames from 'classnames';

import './App.css';

import { useSelector, useDispatch } from 'react-redux';
import { getStory } from 'reducers/story-reducer';
import { setStory } from 'actions/story-actions';
import { getUserSelectedGroup } from 'reducers/user-reducer';

import connect from '@vkontakte/vk-connect';

import { fetchGroups } from 'actions/user-actions';

import * as VIEWS from 'constants/views';
import { ConfigProvider, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';

import { ReactComponent as IconStatistics } from 'svg/statistics.svg';
import { ReactComponent as IconPayment } from 'svg/payment.svg';
import { ReactComponent as IconSettings } from 'svg/settings.svg';

import Payment from 'views/Payment';
import Settings from 'views/Settings';

const App = () => {
	const activeStory = useSelector(getStory);
	const selectedGroup = useSelector(getUserSelectedGroup);

	const dispatch = useDispatch();

	const onStoryChange = useCallback((e) => dispatch(setStory(e.currentTarget.dataset.story)), [dispatch]);

	const tabbar = useMemo(() => {
		const disabledItem = selectedGroup && !selectedGroup.owned;
		const className = classNames({ 'TabbarItem--disabled': disabledItem });
		const handleClick = (disabledItem) ? undefined : onStoryChange;

		return (
			<Tabbar shadow={false}>
				<TabbarItem
					className="TabbarItem--disabled"
					selected={activeStory === VIEWS.LOADER}
					data-story={VIEWS.LOADER}
					children={<IconStatistics />}
					text="Статистика"
					onClick={undefined} />
				<TabbarItem
					selected={activeStory === VIEWS.PAYMENT}
					data-story={VIEWS.PAYMENT}
					children={<IconPayment />}
					text="Выставить счёт"
					onClick={onStoryChange} />
				<TabbarItem
					className={className}
					selected={activeStory === VIEWS.SETTINGS}
					data-story={VIEWS.SETTINGS}
					children={<IconSettings />}
					text="Настройки"
					onClick={handleClick} />
			</Tabbar>
		);
	}, [activeStory, selectedGroup, onStoryChange]);

	useEffect(() => {
		dispatch(fetchGroups);
	}, [dispatch]);

	useEffect(() => {
		connect.send('VKWebAppSetViewSettings', { status_bar_style: 'dark', action_bar_color: '#fff' });
	}, []);

	return (
		<ConfigProvider isWebView>
			<Epic activeStory={activeStory} tabbar={tabbar}>
				<Payment id={VIEWS.PAYMENT} />
				<Settings id={VIEWS.SETTINGS} />
			</Epic>
		</ConfigProvider>
	);
}

export default App;

