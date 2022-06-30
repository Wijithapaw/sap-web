import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/auth-slice';
import financeReducer from '../features/finance/finance-slice';
import worklogReducer from '../features/worklog/worklog-slice';
import lookupReducer from '../features/lookup/lookup-slice';
import coreReducer from './core-slice';
import projectReducer from '../features/project/project-slice';

export const store = configureStore({
  reducer: {
    core: coreReducer,
    counter: counterReducer,
    auth: authReducer,
    finance: financeReducer,
    worklog: worklogReducer,
    lookup: lookupReducer,
    project: projectReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
