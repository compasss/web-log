import { stringify } from 'qs';
import request from '../utils/request';

export async function queryLogList(params) {
  return request(`/mid-server/feedback/list?${stringify(params)}`);
}
