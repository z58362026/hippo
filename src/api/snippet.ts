import { http } from '../utils/http';

/** 获取代码片段详情 */
export const apiSnippetDetail = (params: { snippetId: string }) => {
    return http.get<{ content: string; snippetTitle: string }>({
        url: 'https://maker.weizhipin.com/maker/napi/admin/snippet/detailForPreview',
        params,
    });
};

/** 创建代码片段 */
export const apiCreateSnippet = (params: { snippetTitle: string; snippetDesc: string }, token: string) => {
    return http.post<{ snippetId: string }>({
        url: 'https://maker.weizhipin.com/maker/napi/admin/snippet/saveOrUpdate',
        params,
        headers: {
            t_maker: token,
        },
    });
};

/** 保存代码片段 */
export const apiSaveSnippet = (params: { snippetId: string; content: string }, token: string) => {
    return http.post<never>({
        url: 'https://maker.weizhipin.com/maker/napi/admin/snippet/updateCode',
        params,
        headers: {
            t_maker: token,
        },
    });
};

/** 保存代码片段 */
export const apiChatapiTransform = (params: { content: string }) => {
    return http.post<{ data: string }>({
        url: 'https://maker.weizhipin.com/maker/napi/public/chatgpt/transform',
        params,
        // headers: {
        //     t_maker: token,
        // },
    });
};
