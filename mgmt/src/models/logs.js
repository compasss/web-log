import { queryLogList, deleteLogById } from '../services/logs';

export default {
  namespace: 'logs',

  state: {
    data: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryLogList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *deleteLog({ payload, callback }, { call }) {
      const response = yield call(deleteLogById, payload.id);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
