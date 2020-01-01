import request from '../utils/request';
import qs from 'qs';

export async function loadParentNodeDataService() {
  return request('/api/loadParentNodeDataService', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function getNewParentNamesEleService(param) {
  return request('/api/getNewParentNamesEleService', {
    method: 'POST',
    body: qs.stringify(param),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function loadChildNodeDataService(param) {
  return request('/api/loadChildNodeDataService', {
    method: 'POST',
    body: qs.stringify(param),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
