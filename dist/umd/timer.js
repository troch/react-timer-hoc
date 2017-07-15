(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'prop-types', 'invariant'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('prop-types'), require('invariant'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.propTypes, global.invariant);
        global.timer = mod.exports;
    }
})(this, function (exports, _react, _propTypes, _invariant) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _propTypes2 = _interopRequireDefault(_propTypes);

    var _invariant2 = _interopRequireDefault(_invariant);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    function checkDelay(delay) {
        (0, _invariant2.default)(typeof delay === 'number' && delay > 0, '[react-timer-hoc] `delay` should be a number greater than 0.');
    }

    function timer(delay) {
        checkDelay(delay);

        return function TimerHoc(TimedComponent) {
            var Timer = function (_React$Component) {
                _inherits(Timer, _React$Component);

                function Timer(props) {
                    _classCallCheck(this, Timer);

                    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this, props));

                    _this.delay = delay;
                    _this.state = { tick: 0, timestamp: Date.now() };

                    _this.synchronizeWith = props.synchronizeWith;
                    _this.synchronized = props.synchronizeWith !== undefined;

                    _this.setTimeout = _this.setTimeout.bind(_this);
                    _this.stop = _this.stop.bind(_this);
                    _this.resume = _this.resume.bind(_this);
                    _this.setDelay = _this.setDelay.bind(_this);
                    return _this;
                }

                _createClass(Timer, [{
                    key: 'setTimeout',
                    value: function (_setTimeout) {
                        function setTimeout() {
                            return _setTimeout.apply(this, arguments);
                        }

                        setTimeout.toString = function () {
                            return _setTimeout.toString();
                        };

                        return setTimeout;
                    }(function () {
                        var _this2 = this;

                        var delay = this.delay,
                            synchronizeWith = this.synchronizeWith;

                        var duration = delay - Math.abs(synchronizeWith - Date.now()) % delay;

                        this.timer = setTimeout(function () {
                            if (!_this2.stopped) _this2.setTimeout();
                            _this2.setState({
                                tick: _this2.state.tick + 1,
                                timestamp: Date.now()
                            });
                        }, duration);
                    })
                }, {
                    key: 'start',
                    value: function start() {
                        this.stopped = false;
                        if (!this.synchronized) {
                            this.synchronizeWith = Date.now();
                        }
                        this.setTimeout();
                    }
                }, {
                    key: 'resume',
                    value: function resume() {
                        if (this.stopped) {
                            this.start();
                        }
                    }
                }, {
                    key: 'stop',
                    value: function stop() {
                        this.stopped = true;
                        clearTimeout(this.timer);
                    }
                }, {
                    key: 'setDelay',
                    value: function setDelay(delay) {
                        checkDelay(delay);
                        this.delay = delay;
                        if (!this.stopped) {
                            this.stop();
                            this.resume();
                        }
                    }
                }, {
                    key: 'componentDidMount',
                    value: function componentDidMount() {
                        this.start();
                    }
                }, {
                    key: 'componentWillUnmount',
                    value: function componentWillUnmount() {
                        this.stop();
                    }
                }, {
                    key: 'render',
                    value: function render() {
                        var props = this.props,
                            delay = this.delay,
                            stop = this.stop,
                            resume = this.resume,
                            setDelay = this.setDelay;
                        var _state = this.state,
                            tick = _state.tick,
                            timestamp = _state.timestamp;


                        var timer = { delay: delay, tick: tick, timestamp: timestamp, stop: stop, resume: resume, setDelay: setDelay };

                        return _react2.default.createElement(TimedComponent, _extends({}, props, { timer: timer }));
                    }
                }]);

                return Timer;
            }(_react2.default.Component);

            Timer.propTypes = {
                synchronizeWith: _propTypes2.default.number
            };

            var componentName = TimedComponent.displayName || TimedComponent.name || 'Component';
            Timer.displayName = 'Timer@' + delay + '[' + componentName + ']';

            return Timer;
        };
    }

    exports.default = timer;
});
