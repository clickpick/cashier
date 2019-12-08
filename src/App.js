import React, { useCallback, useMemo } from 'react';

import '@vkontakte/vkui/dist/vkui.css';

import { useSelector, useDispatch } from 'react-redux';
import { getStory } from 'reducers/story-reducer';
import { setStory } from 'actions/story-actions';

import * as VIEWS from 'constants/views';
import { Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';

import Main from 'views/Main';
import Loader from 'views/Loader';

const App = () => {
	const activeStory = useSelector(getStory);

	const dispatch = useDispatch();

	const onStoryChange = useCallback((e) => dispatch(setStory(e.currentTarget.dataset.story)), [dispatch]);

	const tabbar = useMemo(() =>
		<Tabbar>
			<TabbarItem
				selected={activeStory === VIEWS.LOADER}
				data-story={VIEWS.LOADER}
				text="Лоадер"
				onClick={onStoryChange} />
			<TabbarItem
				selected={activeStory === VIEWS.MAIN}
				data-story={VIEWS.MAIN}
				text="Main"
				onClick={onStoryChange} />
		</Tabbar>,
		[activeStory, onStoryChange]);

	return (
		<Epic activeStory={activeStory} tabbar={tabbar}>
			<Main id={VIEWS.MAIN} />
			<Loader id={VIEWS.LOADER} />
		</Epic>
	);
}

export default App;

