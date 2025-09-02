// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { __assign } from "tslib";
import { LogLevel, setLogLevel, setLogFunction, TeamsUserCredential, } from "@microsoft/teamsfx";
import { useTeams } from "./useTeams";
import { useData } from "./useData";
/**
 * Initialize TeamsFx SDK with customized configuration.
 *
 * @param authConfig - custom configuration to override default ones.
 * @returns TeamsContextWithCredential object
 *
 * @public
 */
export function useTeamsUserCredential(authConfig) {
    var _a;
    var result = useTeams({})[0];
    var _b = useData(function () {
        if (process.env.NODE_ENV === "development") {
            setLogLevel(LogLevel.Verbose);
            setLogFunction(function (level, message) {
                console.log(message);
            });
        }
        return Promise.resolve(new TeamsUserCredential(authConfig));
    }), data = _b.data, error = _b.error, loading = _b.loading;
    return __assign(__assign({}, result), { teamsUserCredential: data, error: error, loading: loading || ((_a = result.loading) !== null && _a !== void 0 ? _a : true) });
}
