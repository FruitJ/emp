import request from "@/utils/request";

export async function uploadPicService(params) {
	
	console.log(params);
	
	return request("/api/uploadPicService", {
		method: 'POST',
		body: params,
	});
}


