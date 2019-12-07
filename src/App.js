import React, { useState } from 'react';

import '@vkontakte/vkui/dist/vkui.css';

import * as VIEWS from 'constants/views';
import { Root } from '@vkontakte/vkui';

import Main from 'views/Main';
import Loader from 'views/Loader';

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.LOADER);

	return (
		<Root activeView={activeView}>
			<Main id={VIEWS.MAIN} />
			<Loader id={VIEWS.LOADER} />
		</Root>
	);
}

export default App;

