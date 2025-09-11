import React, { Component } from "react";
/**
 * The state interface for the BaseDashboard component.
 */
interface BaseDashboardState {
    /**
     * A boolean property that indicates whether the dashboard layout should be optimized for mobile devices.
     */
    isMobile?: boolean;
    /**
     * A boolean property that indicates whether the login page should be displayed.
     */
    showLogin?: boolean;
    /**
     * The resize observer for the dashboard.
     * @internal
     */
    observer?: ResizeObserver;
}
/**
 * The base component that provides basic functionality to create a dashboard.
 * @typeParam P The type of props.
 * @typeParam S The type of state.
 */
export declare class BaseDashboard<P, S> extends Component<P, S & BaseDashboardState> {
    /**
     * @internal
     */
    private ref;
    /**
     * Constructor of BaseDashboard.
     * @param {Readonly<P>} props The properties for the dashboard.
     */
    constructor(props: Readonly<P>);
    /**
     * Called after the component is mounted. You can do initialization that requires DOM nodes here. You can also make network requests here if you need to load data from a remote endpoint.
     */
    componentDidMount(): Promise<void>;
    /**
     * Called before the component is unmounted and destroyed. You can do necessary cleanup here, such as invalidating timers, canceling network requests, or removing any DOM elements.
     */
    componentWillUnmount(): void;
    /**
     * Defines the default layout for the dashboard.
     */
    render(): React.JSX.Element;
    /**
     * Override this method to define the layout of the widget in the dashboard.
     * @returns The layout of the widget in the dashboard.
     * @public
     */
    protected layout(): JSX.Element | undefined;
    /**
     * Override this method to customize the dashboard style.
     * @returns The className for customizing the dashboard style.
     * @public
     */
    protected styling(): string;
}
export {};
//# sourceMappingURL=BaseDashboard.d.ts.map