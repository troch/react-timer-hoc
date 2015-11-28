import { createRenderer, renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import { expect } from 'chai';
import React, { Component } from 'react';
import h from 'react-hyperscript';
import timer from './timer';
import jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

describe('Timer', function() {
    it('should run', function() {
        class Counter extends Component {
            render() {
                const { tick } = this.props;
                return h('div', { tick });
            }
        }

        const WrappedCounter = timer(1000)(Counter);
        expect(WrappedCounter.displayName).to.equal('Timer@1000[Counter]');

        const wrappedCounter = renderIntoDocument(h(WrappedCounter, { customProp: 1 }));
        const counter = findRenderedComponentWithType(wrappedCounter, Counter);
        expect(counter.props.tick).to.equal(0);
        expect(counter.props.delay).to.equal(1000);
        expect(counter.props.stop).to.be.a.function;
        expect(counter.props.customProp).to.equal(1);

        expect(wrappedCounter.stopped).to.be.false;
        counter.props.stop();
        expect(wrappedCounter.stopped).to.be.true;
    });
});
