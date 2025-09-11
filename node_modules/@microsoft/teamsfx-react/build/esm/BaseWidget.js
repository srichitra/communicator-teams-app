import { __assign, __awaiter, __extends, __generator } from "tslib";
import React, { Component } from "react";
import { mergeStyles, mergeStyleSets } from "@fluentui/react";
import { tokens } from "@fluentui/react-components";
/**
 * Style definitions for the widget elements
 * @internal
 */
var classNames = mergeStyleSets({
    root: {
        display: "grid",
        padding: "1.25rem 2rem 1.25rem 2rem",
        backgroundColor: tokens.colorNeutralBackground1,
        border: "1px solid var(--colorTransparentStroke)",
        boxShadow: tokens.shadow4,
        borderRadius: tokens.borderRadiusMedium,
        gap: tokens.spacingHorizontalL,
        gridTemplateRows: "max-content 1fr max-content",
    },
    header: {
        display: "grid",
        height: "max-content",
        "& div": {
            display: "grid",
            gap: tokens.spacingHorizontalS,
            alignItems: "center",
            gridTemplateColumns: "min-content 1fr min-content",
        },
        "& svg": {
            height: "1.5rem",
            width: "1.5rem",
        },
        "& span": {
            fontWeight: tokens.fontWeightSemibold,
            lineHeight: tokens.lineHeightBase200,
            fontSize: tokens.fontSizeBase200,
        },
    },
    footer: {
        "& button": {
            width: "fit-content",
        },
    },
});
/**
 * The base component that provides basic functionality to create a widget.
 * @param P the type of props.
 * @param S the type of state.
 */
var BaseWidget = /** @class */ (function (_super) {
    __extends(BaseWidget, _super);
    /**
     * Constructor of BaseWidget.
     * @param {Readonly<P>} props - The props of the component.
     */
    function BaseWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { loading: undefined };
        return _this;
    }
    /**
     * Called after the component is mounted. You can do initialization that requires DOM nodes here. You can also make network requests here if you need to load data from a remote endpoint.
     */
    BaseWidget.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.setState;
                        _b = [{}];
                        return [4 /*yield*/, this.getData()];
                    case 1:
                        _a.apply(this, [__assign.apply(void 0, [__assign.apply(void 0, _b.concat([(_c.sent())])), { loading: false }])]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Defines the default layout for the widget.
     */
    BaseWidget.prototype.render = function () {
        var _a = this.styling(), root = _a.root, header = _a.header, body = _a.body, footer = _a.footer;
        var showLoading = this.state.loading !== false && this.loading() !== undefined;
        return (React.createElement("div", { className: mergeStyles(classNames.root, root) },
            this.header() && (React.createElement("div", { className: mergeStyles(classNames.header, header) }, this.header())),
            showLoading ? (this.loading()) : (React.createElement(React.Fragment, null,
                this.body() !== undefined && React.createElement("div", { className: body }, this.body()),
                this.footer() !== undefined && (React.createElement("div", { className: mergeStyles(classNames.footer, footer) }, this.footer()))))));
    };
    /**
     * Get data required by the widget
     * @returns Data for the widget
     * @public
     */
    BaseWidget.prototype.getData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, undefined];
            });
        });
    };
    /**
     * The purpose of this method is to provide a way for you to add custom header content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's header.
     * If the method is not overridden, the widget will return undefined as the default value for the header, indicating that no custom header content has been defined.
     * @returns An optional JSX.Element representing the header of the widget.
     * @public
     */
    BaseWidget.prototype.header = function () {
        return undefined;
    };
    /**
     * The purpose of this method is to provide a way for you to add custom body content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's body.
     * If the method is not overridden, the widget will return undefined as the default value for the body, indicating that no custom body content has been defined.
     * @returns An optional JSX.Element representing the body of the widget.
     * @public
     */
    BaseWidget.prototype.body = function () {
        return undefined;
    };
    /**
     * The purpose of this method is to provide a way for you to add custom footer content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's footer.
     * If the method is not overridden, the widget will return undefined as the default value for the footer, indicating that no custom footer content has been defined.
     * @returns An optional JSX.Element representing the footer of the widget.
     * @public
     */
    BaseWidget.prototype.footer = function () {
        return undefined;
    };
    /**
     * This method is typically called when the widget is in the process of fetching data.
     * The `undefined` return value is used to indicate that no loading indicator is required.
     * If a loading indicator is required, the method can return a `JSX.Element` containing the necessary components to render the loading indicator.
     * @returns A JSX element or `undefined` if no loading indicator is required.
     * @public
     */
    BaseWidget.prototype.loading = function () {
        return undefined;
    };
    /**
     * Override this method to returns an object that defines the class names for the different parts of the widget.
     * The returned object conforms to the {@link IWidgetClassNames} interface which defines the possible keys and values for the class names.
     * @returns An object that defines the class names for the different parts of the widget.
     * @public
     */
    BaseWidget.prototype.styling = function () {
        return {};
    };
    return BaseWidget;
}(Component));
export { BaseWidget };
