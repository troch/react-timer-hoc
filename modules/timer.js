import React, { Component, PropTypes, createElement } from 'react';

function timer(delay) {
    return function TimerHoc(TimedComponent) {
        class Timer extends Component {
            constructor(props) {
                super(props);
                this.state = { tick: 0 };
                this.setInterval = ::this.setInterval;
            }

            setInterval() {
                this.timer = setInterval(() => {
                    this.setState({ tick: this.state.tick + 1 });
                }, delay);
            }

            componentDidMount() {
                this.setInterval();
            }

            componentWillUnmout() {
                clearInterval(this.timer);
            }

            render() {
                const props = this.props;
                const { tick } = this.state;

                return createElement(TimedComponent, { ...props, tick, delay, timer: this.timer });
            }
        };

        const componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
        Timer.displayName = `Timer@${delay}[${componentName}]`;

        return Timer;
    };
}

export default timer;
