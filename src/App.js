import React, { useCallback, useMemo } from 'react';

import './App.css';

import { useSelector, useDispatch } from 'react-redux';
import { getStory } from 'reducers/story-reducer';
import { setStory } from 'actions/story-actions';

import * as VIEWS from 'constants/views';
import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';

import { ReactComponent as IconStatistics } from 'svg/statistics.svg';
import { ReactComponent as IconPayment } from 'svg/payment.svg';
import { ReactComponent as IconSettings } from 'svg/settings.svg';

import Payment from 'views/Payment';
import Settings from 'views/Settings';
import Loader from 'views/Loader';

const App = () => {
	const activeStory = useSelector(getStory);

	const dispatch = useDispatch();

	const onStoryChange = useCallback((e) => dispatch(setStory(e.currentTarget.dataset.story)), [dispatch]);

	const tabbar = useMemo(() =>
		<Tabbar shadow={false}>
			<TabbarItem
				selected={activeStory === VIEWS.LOADER}
				data-story={VIEWS.LOADER}
				children={<IconStatistics />}
				text="Статистика"
				onClick={onStoryChange} />
			<TabbarItem
				selected={activeStory === VIEWS.PAYMENT}
				data-story={VIEWS.PAYMENT}
				children={<IconPayment />}
				text="Выставить счёт"
				onClick={onStoryChange} />
			<TabbarItem
				selected={activeStory === VIEWS.SETTINGS}
				data-story={VIEWS.SETTINGS}
				children={<IconSettings />}
				text="Настройки"
				onClick={onStoryChange} />
		</Tabbar>,
		[activeStory, onStoryChange]);

	return (
		<Epic activeStory={activeStory} tabbar={tabbar}>
			<Payment id={VIEWS.PAYMENT} />
			<Settings id={VIEWS.SETTINGS} />
			<Loader id={VIEWS.LOADER} />
		</Epic>
	);
}

export default App;

