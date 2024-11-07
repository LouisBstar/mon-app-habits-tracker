import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import HabitTracker from './utils.js';

const App = () => <HabitTracker />;

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement)
