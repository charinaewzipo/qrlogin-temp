//AC2.GET: api/v1/member/read
const fetchGetMemberRead=(query:IV1QueryGetMemberRead&IV1QueryPagination):Promise<IAPIResponse<IV1Pagination<IV1RespGetMemberRead>>>=>{
  return Promise.resolve({ code: 200, devMessage: 'OK', data: [] as any })
}
//AC4.POST: api/v1/member/delete
const fetchPostMemberDelete=(query:IV1PostMemberDelete):Promise<IAPIResponse<IV1PostMemberDelete>>=>{
  return Promise.resolve({ code: 200, devMessage: 'OK', data: [] as any })
}
//AC5.GET: api/v1/member/status/stats
const fetchGetMemberStatusStats=():Promise<IAPIResponse<IV1RespGetMemberStatusStats>>=>{
   return Promise.resolve({ code: 200, devMessage: 'OK', data: [] as any })
}
export {
  fetchGetMemberRead,
  fetchPostMemberDelete,
  fetchGetMemberStatusStats
}