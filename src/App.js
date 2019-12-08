import React, { useCallback, useMemo } from 'react';

import './App.css';

import { useSelector, useDispatch } from 'react-redux';
import { getStory } from 'reducers/story-reducer';
import { setStory } from 'actions/story-actions';

import * as VIEWS from 'constants/views';
import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';

import Payment from 'views/Payment';
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
				text="Лоадер"
				onClick={onStoryChange} />
			<TabbarItem
				selected={activeStory === VIEWS.PAYMENT}
				data-story={VIEWS.PAYMENT}
				text="Main"
				onClick={onStoryChange} />
		</Tabbar>,
		[activeStory, onStoryChange]);

	return (
		<Epic activeStory={activeStory} tabbar={tabbar}>
			<Payment id={VIEWS.PAYMENT} />
			<Loader id={VIEWS.LOADER} />
		</Epic>
	);
}

export default App;

