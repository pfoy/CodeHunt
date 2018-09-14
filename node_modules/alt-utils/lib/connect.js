/*
export default connect({
  resolveAsync(props, context) {
    // must return a promise. component won't render until it resolves
  },

  willMount(props, context) {
    // called on server + client, can do setup work here
  },

  didMount(props, context) {
    // called on client only, here you can kick off other async fetches
  },

  reduceProps(props, context) {
    // called whenever we have new state and we need to compute new props to send down
  },

  listenTo(props, context) {
    // return an array of stores we want to subscribe to
  }
}, MyReactComponent)
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Render = require('./Render');

var _Render2 = _interopRequireDefault(_Render);

function connect(Spec, MaybeComponent) {
  function bind(Component) {
    return (function (_React$Component) {
      _inherits(ConnectComponent, _React$Component);

      function ConnectComponent(props, context) {
        _classCallCheck(this, ConnectComponent);

        _get(Object.getPrototypeOf(ConnectComponent.prototype), 'constructor', this).call(this, props, context);
        this.state = Spec.reduceProps(props, context);
      }

      _createClass(ConnectComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          if (Spec.willMount) Spec.willMount(this.props, this.context);
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this = this;

          var stores = Spec.listenTo(this.props, this.context);
          this.storeListeners = stores.map(function (store) {
            return store.listen(_this.onChange);
          });

          if (Spec.didMount) Spec.didMount(this.props, this.context);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.storeListeners.forEach(function (unlisten) {
            return unlisten();
          });
        }
      }, {
        key: 'onChange',
        value: function onChange() {
          this.setState(Spec.reduceProps(this.props, this.context));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2['default'].createElement(Component, _extends({}, this.props, this.state));
        }
      }]);

      return ConnectComponent;
    })(_react2['default'].Component);
  }

  var createResolver = Spec.resolveAsync ? _Render2['default'].withData(Spec.resolveAsync) : function (x) {
    return x;
  };

  // works as a decorator or as a function
  return MaybeComponent ? createResolver(bind(MaybeComponent)) : function (Component) {
    return createResolver(bind(Component));
  };
}

exports['default'] = connect;
module.exports = exports['default'];