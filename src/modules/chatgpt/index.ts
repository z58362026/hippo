export * from './function.model';

export const transformText = (model: (...args: any) => {}, modelDesc: string) => {
    return (content: string): string => {
        return model(content, modelDesc) as string;
    };
};
