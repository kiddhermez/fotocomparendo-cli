export interface keyProps {
    name: string;
    type?: RegExp;
    customName?: string;
    isOptional?: boolean;
    isPrimaryKey?: boolean;
    skip?: boolean;
    format?: Function;
}
