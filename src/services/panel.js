import request from '@/utils/request';
import qs from 'qs';

export async function loadSpecsOptionService(param) {
  return request('/api/loadSpecsOptionService', {
    method: 'POST',
    body: qs.stringify(param),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
