type State<T> = {
    /**
     * User data.
     */
    data?: T;
    /**
     * Status of data loading.
     */
    loading: boolean;
    /**
     * Error information.
     */
    error?: unknown;
};
export type Data<T> = State<T> & {
    /**
     * reload function.
     */
    reload: () => void;
};
/**
 * Helper function to fetch data with status and error.
 *
 * @param fetchDataAsync - async function of how to fetch data
 * @param options - if autoLoad is true, reload data immediately
 * @returns data, loading status, error and reload function
 *
 * @public
 */
export declare function useData<T>(fetchDataAsync: () => Promise<T>, options?: {
    autoLoad: boolean;
}): Data<T>;
export {};
//# sourceMappingURL=useData.d.ts.map