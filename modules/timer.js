import React, { Component, PropTypes, createElement } from 'react';

function timer(delay) {
    return function TimerHoc(TimedComponent) {
        class Timer extends Component {
            constructor(props) {
                super(props);
                this.state = { tick: 0 };
                this.setInterval = ::this.setInterval;
                this.stop = ::this.stop;
            }

            setInterval() {
                this.timer = setInterval(() => {
                    this.setState({ tick: this.state.tick + 1 });
                }, delay);
            }

            stop() {
                clearInterval(this.timer);
            }

            componentDidMount() {
                this.setInterval();
            }

            componentWillUnmout() {
                this.stop();
            }

            render() {
                const { props, stop } = this.props;
                const { tick } = this.state;

                return createElement(TimedComponent, { ...props, tick, delay, stop });
            }
        };

        const componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = `Timer@${delay}[${componentName}]`;

        return Timer;
    };
}

export default timer;
