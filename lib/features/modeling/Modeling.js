'use strict';

var _ = require('lodash');


/**
 * The basic modeling entry point.
 *
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 */
function Modeling(eventBus, commandStack) {
  this._commandStack = commandStack;
  this._eventBus = eventBus;

  var self = this;

  eventBus.on('diagram.init', function() {
    // register modeling handlers
    self.registerHandlers(commandStack);
  });
}

module.exports = Modeling;


/**
 * Register handlers with the command stack
 *
 * @param {CommandStack} commandStack
 */
Modeling.prototype.registerHandlers = function(commandStack) {
  commandStack.registerHandler('shape.create', require('./cmd/CreateShapeHandler'));
  commandStack.registerHandler('shape.move', require('./cmd/MoveShapeHandler'));

  commandStack.registerHandler('shape.append', require('./cmd/AppendShapeHandler'));

  commandStack.registerHandler('label.create', require('./cmd/CreateLabelHandler'));

  commandStack.registerHandler('connection.create', require('./cmd/CreateConnectionHandler'));
  commandStack.registerHandler('connection.layout', require('./cmd/LayoutConnectionHandler'));
};



///// modeling helpers /////////////////////////////////////////


Modeling.prototype.createConnection = function(source, target, attrs, parent) {

  var context = {
    source: source,
    target: target,
    parent: parent,
    attrs: attrs
  };

  this._commandStack.execute('connection.create', context);

  return context.connection;
};


Modeling.prototype.moveShape = function(shape, delta, newParent) {

  var context = {
    shape: shape,
    delta: delta,
    newParent: newParent
  };

  this._commandStack.execute('shape.move', context);
};


Modeling.prototype.layoutConnection = function(connection) {

  var context = {
    connection: connection
  };

  this._commandStack.execute('connection.layout', context);
};


Modeling.prototype.createShape = function(attrs, position, parent) {

  var context = {
    attrs: attrs,
    position: position,
    parent: parent
  };

  this._commandStack.execute('shape.create', context);

  return context.shape;
};


Modeling.prototype.createLabel = function(labelTarget, position, attrs, parent) {

  var context = {
    labelTarget: labelTarget,
    position: position,
    attrs: attrs,
    parent: parent
  };

  this._commandStack.execute('label.create', context);

  return context.shape;
};


Modeling.prototype.appendShape = function(source, attrs, position, connection, parent) {

  var context = {
    source: source,
    attrs: attrs,
    position: position,
    connection: connection,
    parent: parent
  };

  this._commandStack.execute('shape.append', context);

  return context.shape;
};