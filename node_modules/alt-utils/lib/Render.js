'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.withData = withData;
exports.toDOM = toDOM;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function withData(fetch, MaybeComponent) {
  function bind(Component) {
    var WithDataClass = (function (_React$Component) {
      _inherits(WithDataClass, _React$Component);

      function WithDataClass(props) {
        _classCallCheck(this, WithDataClass);

        _get(Object.getPrototypeOf(WithDataClass.prototype), 'constructor', this).call(this, props);
      }

      _createClass(WithDataClass, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return { buffer: this.context.buffer };
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          if (!this.context.buffer.locked) {
            this.context.buffer.push(fetch(this.props));
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return this.context.buffer.locked ? _react2['default'].createElement(Component, this.props) : null;
        }
      }]);

      return WithDataClass;
    })(_react2['default'].Component);

    WithDataClass.contextTypes = {
      buffer: _propTypes2['default'].object.isRequired
    };

    WithDataClass.childContextTypes = {
      buffer: _propTypes2['default'].object.isRequired
    };

    return WithDataClass;
  }

  // works as a decorator or as a function
  return MaybeComponent ? bind(MaybeComponent) : function (Component) {
    return bind(Component);
  };
}

function usingDispatchBuffer(buffer, Component) {
  var DispatchBufferClass = (function (_React$Component2) {
    _inherits(DispatchBufferClass, _React$Component2);

    function DispatchBufferClass(props) {
      _classCallCheck(this, DispatchBufferClass);

      _get(Object.getPrototypeOf(DispatchBufferClass.prototype), 'constructor', this).call(this, props);
    }

    _createClass(DispatchBufferClass, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return { buffer: buffer };
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2['default'].createElement(Component, this.props);
      }
    }]);

    return DispatchBufferClass;
  })(_react2['default'].Component);

  DispatchBufferClass.childContextTypes = {
    buffer: _propTypes2['default'].object.isRequired
  };

  return DispatchBufferClass;
}

var DispatchBuffer = (function () {
  function DispatchBuffer(renderStrategy) {
    _classCallCheck(this, DispatchBuffer);

    this.promisesBuffer = [];
    this.locked = false;
    this.renderStrategy = renderStrategy;
  }

  _createClass(DispatchBuffer, [{
    key: 'push',
    value: function push(v) {
      this.promisesBuffer.push(v);
    }
  }, {
    key: 'fill',
    value: function fill(Element) {
      return this.renderStrategy(Element);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.promisesBuffer = [];
    }
  }, {
    key: 'flush',
    value: function flush(alt, Element) {
      var _this = this;

      return Promise.all(this.promisesBuffer).then(function (data) {
        // fire off all the actions synchronously
        data.forEach(function (f) {
          if (!f) return;

          if (Array.isArray(f)) {
            f.forEach(function (x) {
              return x();
            });
          } else {
            f();
          }
        });
        _this.locked = true;

        return {
          html: _this.renderStrategy(Element),
          state: alt.flush(),
          element: Element
        };
      })['catch'](function (err) {
        return Promise.reject({
          err: err,
          state: alt.flush(),
          element: Element
        });
      });
    }
  }]);

  return DispatchBuffer;
})();

function renderWithStrategy(strategy) {
  return function (alt, Component, props) {
    alt.trapAsync = true;

    // create a buffer and use context to pass it through to the components
    var buffer = new DispatchBuffer(function (Node) {
      return _react2['default'][strategy](Node);
    });
    var Container = usingDispatchBuffer(buffer, Component);

    // cache the element
    var Element = _react2['default'].createElement(Container, props);

    // render so we kick things off and get the props
    buffer.fill(Element);

    // flush out the results in the buffer synchronously setting the store
    // state and returning the markup
    return buffer.flush(alt, Element);
  };
}

function toDOM(Component, props, documentNode, shouldLock) {
  var buffer = new DispatchBuffer();
  buffer.locked = !!shouldLock;
  var Node = usingDispatchBuffer(buffer, Component);
  var Element = _react2['default'].createElement(Node, props);
  buffer.clear();
  return _react2['default'].render(Element, documentNode);
}

var toStaticMarkup = renderWithStrategy('renderToStaticMarkup');
exports.toStaticMarkup = toStaticMarkup;
var toString = renderWithStrategy('renderToString');
exports.toString = toString;