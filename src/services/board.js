import request from '../utils/request';

export async function loadParentNodeDataService() {
  return request('/api/loadParentNodeDataService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
