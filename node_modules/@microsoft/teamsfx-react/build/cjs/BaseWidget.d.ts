import React, { Component } from "react";
/**
 * Interface for defining the class names of widget elements
 */
export interface IWidgetClassNames {
    /**
     * The class name for the root part of the widget.
     */
    root?: string;
    /**
     * The class name for the header part of the widget.
     */
    header?: string;
    /**
     * The class name for the body part of the widget.
     */
    body?: string;
    /**
     * The class name for the footer part of the widget.
     */
    footer?: string;
}
/**
 * Interface for defining the state of the BaseWidget class
 */
interface BaseWidgetState {
    loading?: boolean;
}
/**
 * The base component that provides basic functionality to create a widget.
 * @param P the type of props.
 * @param S the type of state.
 */
export declare class BaseWidget<P, S> extends Component<P, S & BaseWidgetState> {
    /**
     * Constructor of BaseWidget.
     * @param {Readonly<P>} props - The props of the component.
     */
    constructor(props: Readonly<P>);
    /**
     * Called after the component is mounted. You can do initialization that requires DOM nodes here. You can also make network requests here if you need to load data from a remote endpoint.
     */
    componentDidMount(): Promise<void>;
    /**
     * Defines the default layout for the widget.
     */
    render(): React.JSX.Element;
    /**
     * Get data required by the widget
     * @returns Data for the widget
     * @public
     */
    protected getData(): Promise<S>;
    /**
     * The purpose of this method is to provide a way for you to add custom header content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's header.
     * If the method is not overridden, the widget will return undefined as the default value for the header, indicating that no custom header content has been defined.
     * @returns An optional JSX.Element representing the header of the widget.
     * @public
     */
    protected header(): JSX.Element | undefined;
    /**
     * The purpose of this method is to provide a way for you to add custom body content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's body.
     * If the method is not overridden, the widget will return undefined as the default value for the body, indicating that no custom body content has been defined.
     * @returns An optional JSX.Element representing the body of the widget.
     * @public
     */
    protected body(): JSX.Element | undefined;
    /**
     * The purpose of this method is to provide a way for you to add custom footer content to the widget.
     * By overriding this method, you can add additional functionality or styling to the widget's footer.
     * If the method is not overridden, the widget will return undefined as the default value for the footer, indicating that no custom footer content has been defined.
     * @returns An optional JSX.Element representing the footer of the widget.
     * @public
     */
    protected footer(): JSX.Element | undefined;
    /**
     * This method is typically called when the widget is in the process of fetching data.
     * The `undefined` return value is used to indicate that no loading indicator is required.
     * If a loading indicator is required, the method can return a `JSX.Element` containing the necessary components to render the loading indicator.
     * @returns A JSX element or `undefined` if no loading indicator is required.
     * @public
     */
    protected loading(): JSX.Element | undefined;
    /**
     * Override this method to returns an object that defines the class names for the different parts of the widget.
     * The returned object conforms to the {@link IWidgetClassNames} interface which defines the possible keys and values for the class names.
     * @returns An object that defines the class names for the different parts of the widget.
     * @public
     */
    protected styling(): IWidgetClassNames;
}
export {};
//# sourceMappingURL=BaseWidget.d.ts.map