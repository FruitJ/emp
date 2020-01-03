import request from '@/utils/request';

export async function loadInitTableDataService(param) {
  return request('/api/loadInitTableData', {
    method: 'POST',
  });
}
