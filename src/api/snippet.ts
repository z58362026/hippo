import { http } from '../utils/http';

export const getSnippetDetail = (params: { snippetId: string }) => {
    return http.get<{ content: string; snippetTitle: string }>({
        url: 'https://maker.weizhipin.com/maker/napi/admin/snippet/detailForPreview',
        params,
    });
};
