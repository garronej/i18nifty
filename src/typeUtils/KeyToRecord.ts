export type KeyToRecord<Key extends string | { K: string }> = {
    [K in Extract<Key, string>]: string;
} & {
    [K in Exclude<Key, string>["K"]]: Helper3<
        (
            params: Helper1<Extract<Key, { K: K }>>
        ) => Helper2<Extract<Key, { K: K }>>
    >;
};

type Helper1<Key extends { K: string }> = Key extends { P: any }
    ? Key["P"]
    : void;
type Helper2<Key extends { K: string }> = Key extends { R: any }
    ? Key["R"]
    : string;
type Helper3<F extends (params: any) => any> = F extends (
    params: infer P
) => infer R
    ? P extends void
        ? R
        : F
    : never;
