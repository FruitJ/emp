import { uploadPicService } from "@/services/upload";

export default {
	
	namespace: "upload",
	state: {
	
	},
	effects: {
		*uploadFile( { payload: param }, { call, put } ) {
			let formData = new window.FormData();
			let token = "2qKDRQz2JQb45aZjHAmER79xZ3stLOOvSHEq8n34:XGdDt1s53YRLSBxbV84SWMOzDpM=:eyJzY29wZSI6Imh1aXl1bi1hcHAtaW1hZ2VzIiwiZGVhZGxpbmUiOjE1Nzg2NTAyMTh9";
			
			console.log(param.file);
			console.log(token);
			formData.append('file', param.file);
			formData.append('token', token);
			let res = yield call(uploadPicService, formData);
			console.log("uploadFile...");
			console.log(res);
		},
	},
	reducers: {
	
	},
	subscriptions: {
	
	},
}
