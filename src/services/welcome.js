import request from '@/utils/request';
import qs from 'qs';
import axios from 'axios';

export async function test(params) {
  
  return request("/api/test", {
    method: "POST",
    data: params
  });
}
export async function testCrossDomain(params) {
  console.log(params);
  return request("/api/testController", {
    method: "POST",
    data: params,
  });
}

export async function testGetToken(params) {
  
  return request("/api/sendToken", {
    method: "POST",
    body: qs.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export async function uploadPic(params) {
  
  console.log(request);
  
  return request("/api/uploadPic", {
    method: "POST",
    body: params,
    /*ProgressEvent: function(arg_1, arg_2){
      console.log(1100);
      console.log(arg_1,arg_2);
    },*/
  });
}

export async function removePic(params) {
  
  
  return request("/api/removeFile", {
    method: "POST",
    body: qs.stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
