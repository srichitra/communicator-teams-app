// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useEffect, useReducer } from "react";
var createReducer = function () {
    return function (state, action) {
        switch (action.type) {
            case "loading":
                return { data: state.data, loading: true };
            case "result":
                return { data: action.result, loading: false };
            case "error":
                return { loading: false, error: action.error };
        }
    };
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
export function useData(fetchDataAsync, options) {
    var _a;
    var auto = (_a = options === null || options === void 0 ? void 0 : options.autoLoad) !== null && _a !== void 0 ? _a : true;
    var _b = useReducer(createReducer(), {
        loading: auto,
    }), _c = _b[0], data = _c.data, loading = _c.loading, error = _c.error, dispatch = _b[1];
    function reload() {
        if (!loading)
            dispatch({ type: "loading" });
        fetchDataAsync()
            .then(function (data) { return dispatch({ type: "result", result: data }); })
            .catch(function (error) { return dispatch({ type: "error", error: error }); });
    }
    useEffect(function () {
        if (auto)
            reload();
    }, []);
    return { data: data, loading: loading, error: error, reload: reload };
}
