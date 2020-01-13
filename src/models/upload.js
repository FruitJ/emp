import { uploadPicService } from "@/services/upload";

let imgUrl = "https://images.ikuanguang.com/";
export default {
	
	namespace: "upload",
	state: {
	
	},
	effects: {
		*uploadFile( { payload: param }, { call, put } ) {
			
			let token = "2qKDRQz2JQb45aZjHAmER79xZ3stLOOvSHEq8n34:XmE6n2KGYXps6PrCbYf-psVcDMY=:eyJzY29wZSI6Imh1aXl1bi1hcHAtaW1hZ2VzIiwiZGVhZGxpbmUiOjE1Nzg4Nzg1NDN9";
			let formData = new window.FormData();
			console.log(param.file);
			console.log(token);
			console.log("upload 分割线");
			console.log(param.file.originFileObj);
			formData.append('file', param.file.originFileObj);
			formData.append('token', token);
			let res = yield call(uploadPicService, formData);
			console.log("uploadFile...");
			console.log(res);
			console.log(`imgUrl: ${ imgUrl }${ res.hash }`);
		},
	},
	reducers: {
	
	},
	subscriptions: {
	
	},
}
