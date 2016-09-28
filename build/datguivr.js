(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _SubdivisionModifier = require('../thirdparty/SubdivisionModifier');

var SubdivisionModifier = _interopRequireWildcard(_SubdivisionModifier);

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var BUTTON_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var BUTTON_HEIGHT = height - Layout.PANEL_MARGIN;
  var BUTTON_DEPTH = Layout.BUTTON_DEPTH;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var divisions = 4;
  var aspectRatio = BUTTON_WIDTH / BUTTON_HEIGHT;
  var rect = new THREE.BoxGeometry(BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_DEPTH, Math.floor(divisions * aspectRatio), divisions, divisions);
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(rect);
  rect.translate(BUTTON_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  hitscanVolume.position.x = width * 0.5;

  var material = new THREE.MeshPhongMaterial({ color: Colors.BUTTON_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var buttonLabel = textCreator.create(propertyName, { scale: 0.866 });
  buttonLabel.position.x = BUTTON_WIDTH * 0.5 - buttonLabel.layout.width * 0.00011 * 0.5;
  buttonLabel.position.z = BUTTON_DEPTH * 1.2;
  buttonLabel.position.y = -0.025;
  filledVolume.add(buttonLabel);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_BUTTON);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, controllerID);

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    object[propertyName]();

    hitscanVolume.position.z = BUTTON_DEPTH * 0.1;

    p.locked = true;
  }

  function handleOnRelease() {
    hitscanVolume.position.z = BUTTON_DEPTH * 0.5;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.color.setHex(Colors.BUTTON_COLOR);
      material.emissive.setHex(Colors.EMISSIVE_COLOR);
    }
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"../thirdparty/SubdivisionModifier":16,"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? false : _ref$initialValue;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var CHECKBOX_WIDTH = height - Layout.PANEL_MARGIN;
  var CHECKBOX_HEIGHT = CHECKBOX_WIDTH;
  var CHECKBOX_DEPTH = depth;

  var INACTIVE_SCALE = 0.001;
  var ACTIVE_SCALE = 0.9;

  var state = {
    value: initialValue,
    listen: false
  };

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  //  base checkbox
  var rect = new THREE.BoxGeometry(CHECKBOX_WIDTH, CHECKBOX_HEIGHT, CHECKBOX_DEPTH);
  rect.translate(CHECKBOX_WIDTH * 0.5, 0, 0);

  //  hitscan volume
  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  outline volume
  var outline = new THREE.BoxHelper(hitscanVolume);
  outline.material.color.setHex(Colors.OUTLINE_COLOR);

  //  checkbox volume
  var material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  filledVolume.scale.set(ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE);
  hitscanVolume.add(filledVolume);

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_CHECKBOX);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, hitscanVolume, outline, controllerID);

  // group.add( filledVolume, outline, hitscanVolume, descriptorLabel );

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handleOnPress);

  updateView();

  function handleOnPress(p) {
    if (group.visible === false) {
      return;
    }

    state.value = !state.value;

    object[propertyName] = state.value;

    if (onChangedCB) {
      onChangedCB(state.value);
    }

    p.locked = true;
  }

  function updateView() {

    if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.emissive.setHex(Colors.EMISSIVE_COLOR);

      if (state.value) {
        material.color.setHex(Colors.DEFAULT_COLOR);
      } else {
        material.color.setHex(Colors.INACTIVE_COLOR);
      }
    }

    if (state.value) {
      filledVolume.scale.set(ACTIVE_SCALE, ACTIVE_SCALE, ACTIVE_SCALE);
    } else {
      filledVolume.scale.set(INACTIVE_SCALE, INACTIVE_SCALE, INACTIVE_SCALE);
    }
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      state.value = object[propertyName];
    }
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    updateView();
  };

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorizeGeometry = colorizeGeometry;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var DEFAULT_COLOR = exports.DEFAULT_COLOR = 0x2FA1D6;
var HIGHLIGHT_COLOR = exports.HIGHLIGHT_COLOR = 0x0FC3FF;
var INTERACTION_COLOR = exports.INTERACTION_COLOR = 0x07ABF7;
var EMISSIVE_COLOR = exports.EMISSIVE_COLOR = 0x222222;
var HIGHLIGHT_EMISSIVE_COLOR = exports.HIGHLIGHT_EMISSIVE_COLOR = 0x999999;
var OUTLINE_COLOR = exports.OUTLINE_COLOR = 0x999999;
var DEFAULT_BACK = exports.DEFAULT_BACK = 0x1a1a1a;
var HIGHLIGHT_BACK = exports.HIGHLIGHT_BACK = 0x494949;
var INACTIVE_COLOR = exports.INACTIVE_COLOR = 0x161829;
var CONTROLLER_ID_SLIDER = exports.CONTROLLER_ID_SLIDER = 0x2fa1d6;
var CONTROLLER_ID_CHECKBOX = exports.CONTROLLER_ID_CHECKBOX = 0x806787;
var CONTROLLER_ID_BUTTON = exports.CONTROLLER_ID_BUTTON = 0xe61d5f;
var CONTROLLER_ID_TEXT = exports.CONTROLLER_ID_TEXT = 0x1ed36f;
var CONTROLLER_ID_DROPDOWN = exports.CONTROLLER_ID_DROPDOWN = 0xfff000;
var DROPDOWN_BG_COLOR = exports.DROPDOWN_BG_COLOR = 0xffffff;
var DROPDOWN_FG_COLOR = exports.DROPDOWN_FG_COLOR = 0x000000;
var BUTTON_COLOR = exports.BUTTON_COLOR = 0xe61d5f;
var SLIDER_BG = exports.SLIDER_BG = 0x444444;

function colorizeGeometry(geometry, color) {
  geometry.faces.forEach(function (face) {
    face.color.setHex(color);
  });
  geometry.colorsNeedUpdate = true;
  return geometry;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCheckbox;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function createCheckbox() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? false : _ref$initialValue;
  var _ref$options = _ref.options;
  var options = _ref$options === undefined ? [] : _ref$options;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var state = {
    open: false,
    listen: false
  };

  var DROPDOWN_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var DROPDOWN_HEIGHT = height - Layout.PANEL_MARGIN;
  var DROPDOWN_DEPTH = depth;
  var DROPDOWN_OPTION_HEIGHT = height - Layout.PANEL_MARGIN * 1.2;
  var DROPDOWN_MARGIN = Layout.PANEL_MARGIN * -0.4;

  var group = new THREE.Group();

  var panel = Layout.createPanel(width, height, depth);
  group.add(panel);

  group.hitscan = [panel];

  var labelInteractions = [];
  var optionLabels = [];

  //  find actually which label is selected
  var initialLabel = findLabelFromProp();

  function findLabelFromProp() {
    if (Array.isArray(options)) {
      return options.find(function (optionName) {
        return optionName === object[propertyName];
      });
    } else {
      return Object.keys(options).find(function (optionName) {
        return object[propertyName] === options[optionName];
      });
    }
  }

  function createOption(labelText, isOption) {
    var label = (0, _textlabel2.default)(textCreator, labelText, DROPDOWN_WIDTH, depth, Colors.DROPDOWN_FG_COLOR, Colors.DROPDOWN_BG_COLOR, 0.866);
    group.hitscan.push(label.back);
    var labelInteraction = (0, _interaction2.default)(label.back);
    labelInteractions.push(labelInteraction);
    optionLabels.push(label);

    if (isOption) {
      labelInteraction.events.on('onPressed', function (p) {
        selectedLabel.setString(labelText);

        var propertyChanged = false;

        if (Array.isArray(options)) {
          propertyChanged = object[propertyName] !== labelText;
          if (propertyChanged) {
            object[propertyName] = labelText;
          }
        } else {
          propertyChanged = object[propertyName] !== options[labelText];
          if (propertyChanged) {
            object[propertyName] = options[labelText];
          }
        }

        collapseOptions();
        state.open = false;

        if (onChangedCB && propertyChanged) {
          onChangedCB(object[propertyName]);
        }

        p.locked = true;
      });
    } else {
      labelInteraction.events.on('onPressed', function (p) {
        if (state.open === false) {
          openOptions();
          state.open = true;
        } else {
          collapseOptions();
          state.open = false;
        }

        p.locked = true;
      });
    }
    label.isOption = isOption;
    return label;
  }

  function collapseOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = false;
        label.back.visible = false;
      }
    });
  }

  function openOptions() {
    optionLabels.forEach(function (label) {
      if (label.isOption) {
        label.visible = true;
        label.back.visible = true;
      }
    });
  }

  //  base option
  var selectedLabel = createOption(initialLabel, false);
  selectedLabel.position.x = Layout.PANEL_MARGIN * 0.5 + width * 0.5;
  selectedLabel.position.z = depth;

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, Colors.DROPDOWN_FG_COLOR);
  downArrow.position.set(DROPDOWN_WIDTH - 0.04, 0, depth * 1.01);
  selectedLabel.add(downArrow);

  function configureLabelPosition(label, index) {
    label.position.y = -DROPDOWN_MARGIN - (index + 1) * DROPDOWN_OPTION_HEIGHT;
    label.position.z = depth * 24;
  }

  function optionToLabel(optionName, index) {
    var optionLabel = createOption(optionName, true);
    configureLabelPosition(optionLabel, index);
    return optionLabel;
  }

  if (Array.isArray(options)) {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(options.map(optionToLabel)));
  } else {
    selectedLabel.add.apply(selectedLabel, _toConsumableArray(Object.keys(options).map(optionToLabel)));
  }

  collapseOptions();

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_DROPDOWN);
  controllerID.position.z = depth;

  panel.add(descriptorLabel, controllerID, selectedLabel);

  updateView();

  function updateView() {

    labelInteractions.forEach(function (interaction, index) {
      var label = optionLabels[index];
      if (label.isOption) {
        if (interaction.hovering()) {
          Colors.colorizeGeometry(label.back.geometry, Colors.HIGHLIGHT_COLOR);
        } else {
          Colors.colorizeGeometry(label.back.geometry, Colors.DROPDOWN_BG_COLOR);
        }
      }
    });
  }

  var onChangedCB = void 0;
  var onFinishChangeCB = void 0;

  group.onChange = function (callback) {
    onChangedCB = callback;
    return group;
  };

  var grabInteraction = Grab.create({ group: group, panel: panel });

  group.listen = function () {
    state.listen = true;
    return group;
  };

  group.update = function (inputObjects) {
    if (state.listen) {
      selectedLabel.setString(findLabelFromProp());
    }
    labelInteractions.forEach(function (labelInteraction) {
      labelInteraction.update(inputObjects);
    });
    grabInteraction.update(inputObjects);
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  return group;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./sharedmaterials":13,"./textlabel":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFolder;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFolder() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var name = _ref.name;


  var width = Layout.FOLDER_WIDTH;
  var depth = Layout.PANEL_DEPTH;

  var spacingPerController = Layout.PANEL_HEIGHT + Layout.PANEL_SPACING;

  var state = {
    collapsed: false,
    previousParent: undefined
  };

  var group = new THREE.Group();
  var collapseGroup = new THREE.Group();
  group.add(collapseGroup);

  //  Yeah. Gross.
  var addOriginal = THREE.Group.prototype.add;

  function addImpl(o) {
    addOriginal.call(group, o);
  }

  addImpl(collapseGroup);

  var panel = Layout.createPanel(width, Layout.FOLDER_HEIGHT, depth);
  addImpl(panel);

  var descriptorLabel = textCreator.create(name);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN * 1.5;
  descriptorLabel.position.y = -0.03;
  descriptorLabel.position.z = depth;
  panel.add(descriptorLabel);

  var downArrow = Layout.createDownArrow();
  Colors.colorizeGeometry(downArrow.geometry, 0xffffff);
  downArrow.position.set(0.05, 0, depth * 1.01);
  panel.add(downArrow);

  group.add = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (obj) {
      var container = new THREE.Group();
      container.add(obj);
      collapseGroup.add(container);
      obj.folder = group;
    });

    performLayout();
  };

  function performLayout() {
    collapseGroup.children.forEach(function (child, index) {
      child.position.y = -(index + 1) * spacingPerController;
      child.position.x = 0.026;
      if (state.collapsed) {
        child.children[0].visible = false;
      } else {
        child.children[0].visible = true;
      }
    });

    if (state.collapsed) {
      downArrow.rotation.z = Math.PI * 0.5;
    } else {
      downArrow.rotation.z = 0;
    }
  }

  var interaction = (0, _interaction2.default)(panel);
  interaction.events.on('onPressed', function (p) {
    state.collapsed = !state.collapsed;
    performLayout();
    p.locked = true;
  });

  group.folder = group;

  // const grabInteraction = Grab.create( { group, panel } );
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    // grabInteraction.update( inputObjects );
    paletteInteraction.update(inputObjects);
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.hitscan = [panel];

  group.beingMoved = false;

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./palette":11,"./sharedmaterials":13,"./textlabel":15}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = image;
exports.fnt = fnt;
/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function image() {
  var image = new Image();
  image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AACAAElEQVR42uy9h3IcyZIlevfZ2u6O2Nl3Z64WfVsrtiSbbKqm1gKCBKEJRWitNWAACopg78z743iFO+5Tp055RGZWZVaBTdAsrAWBiMzICI8T7seP/8o593m+fZNvP+Tb5Xy7kW/38u1xvjXkW1O+teVbZ751S+vKt458a863RvnZ43+2yP8//pkeacc/255vL+Bn78k4l2Xc4/Gf5tsz6aNd+gm1Vunz+Bnr8u15zN9tl989fq96eO/r+XYn3x7KszTKz7TI+2u/ndCwv2Z5huM+n+Tb/Xy7nW8/5dvFfPtrvv0t3z7It8/knc/n29V8u5VvD2AOXkifVsNxHsozx5k7nK9H8nvX8u3HfPsu377Itw/z7S/59sd8+22+/Vqe/Xhu7srv6ZpolbFwPtrk+Z7BHHyZb9/LONa7Nks/L2Xd9EnrlbXTJuPVyfO3w8+9kn92y++3wTp7KuPcknEvyHt+CnN/JYW5vyZz9L2868fyrX+Xb/8n3/7hV/k/+X/+j3z73/n2b/n2p4zWwU/wPf8iz3Im387m2yX5jvfk2+h66ZR92p9vg/k2JG0A5lb3r46l6/p4Tr8VG/JBhvP5fr69J+/0twznrpJnrvQ5qrom8+2/VXlNZvluH8i6+KusleP//iijd+ExPspwzj40+r4NdphtJza0h9r3LfkGx2fe178Sw/R1vp0jA6EHerMcHmog2Dh0ys/Uyz875f8fG5JhaQPy+51icBgEXJLxn8uEvBTj/yrQ+qRPBSEKUrrgYAj9Lhq1S3TA1cMB1yF99kC//dDwWV5Kny3y0evIWH4sH/P4oP0KjPINOSif0hwgiOrxAKp6WWhRc8fzxQvinDzTp7Kg3xdj+wfPouuAQxjnoleeoRVAwLeejcHPrOtrJN9GZe30yzht0l+bvMeA/MyY/HNIflbXWav0jyDgijyHApKLsN7LnXv9vlelbzwMjw3qb8TA/vd8+0cBVH+Qw+yTDNYBfs/3DeNxR76jgvWX8t2GZC4n821K/jkhc6v7V8eqk7FuCnDWtfNxRvP5pczpJ7I2P81oD92q8JkrfY5qr8n/mW//XMU1eTHD9fGFrHW0sWcyehce40yGc/a5nM9nZf60b70MdYjtHICzeYjsYbucZ09l7q/rJUEBgHZ+DQ7BRrgd6IGOBmJCDHSvDPBM/tkrgx///bT87Jj8vz4DBNwFRNcik9EvfY8F2qg8Uy/cbrtlIkZi/K4atTbjdssH3IA8jx4449DwABqAAxBvrbpoz4gx/l7m/EcBBndkLp7Je3SBUR42GhpkPeSi5o7nq0kO57twk/tOnu+MLPCPBFX7Ft2g9ItzMSzP/hK+8znwLPHG0HfVZz5eLzP5NivrZ1TeSYHmS/nvMfm5OfnnJKyzV9IvggAEm18JAr4CwKaxjLnX73ufgOxXYkj/Job12MD+r3z7F/Gq/EXm9guZ8zTXge6nC3J7ULBzyfiOnTD3kzLnC/m2lG+L+TYv32BMvrXul+fG2vlG1kwW8/m9GPqvYA99l8EeulvhM1f6HNVck/8m6/Ff8+33VVqTWb3bWVkj38h7fiv/fU5a2u9ijXEuoznTy/lF6fuWzB9ehobE/k5RG5O+u+U5GuQsuinf4oICgAvSOd/y9PAflgN9BgzEnAw6IEb5BRnnY2OyLIZkFgADeg0a6IbcLn8/Ii8wF2gzMH4XGLNRMVpRvzsmz/rSc7vthVumgplZ+f15aNrflDwP31qb4MZ0Vub6ohyI6A6rhwPulczBpIyLDT9slxyyDTHmjuerRca8LwDosjzXeXnOb+Tw+ATmx1p0MzAns/LMCgI6ZV38COCSN0Y/vOusrJfjdbMqa21SxtJFrGNPyc+uyc8vwPgj0q+CAAWb6lr7Rr6DPtNTOhCj5n6QvBKPKZyirsmPxLAeH/r/JMb2j3Qz/yHldfBAjONFualYYIe/46R8v+N5XM+3TWlrMse4X3Dt4FgaQkp7Pq+Iof9R3uOsrNEs9tCDCp+50ueo1pp8T9bhb+SffyVXc1Zr8lpG60Nt1wU5LC/ImtH1kfa7+MbIYs7UM39N9u8DAd9NMH963i5B0307KudCO8zdPQUBCgAuy/94YNzy9DY/Jx2rgVg0jHM3GJTjv9+Qtiy/PyF/r7dQdid2ipEZF4O0KkbIaksygcPgRhmQMRYCv6dGbQqe3ffe4zLGvIyHz7MO/74CoGgKPAzddGO6JAfQDVkot8kdhh6USXmPZWqL8kwj8rNtcsBFzR3PVysstDvyPNfFtXZJjOz3coDwpu2nRafzsSJj87rA9VVPN3kFLAvy+8frZTvftuR98V07ZDGPyuI+/vkd+fl1+fl56W8EQEgzHVjfilG8LgCoHjwogxFzPwNeiZdGOEVdk3ojfl+M7L9I/PWvgbh8GutAn+OyuMq/luf5Cb5jk/Edl2XOd/MtB/9ch7GGaaxHMNZZOWDSnM/b0m4SGLia0R56WOEzV/oc1ViTXwCn4k/iEfiYXM1ZrcnrGa2PW7IefpK1eI3WR9prxDfG7QzmTD3zyk2rB64b2/x12cNbYpPnZH+/gvO2EbhZNxUAKDJ7Ip3r7WBQOlcDsSlGAY3zMLgv9AY6I3+/LYZkU/57VvrzuROtF9o12o4xPi6mRRnT+t0tObQQADz23G7xgNuUcdU47oOR3JG/X4UPOmqguhvyIR+I8XwMXAsMYejYKzKHO3DQrcrfMbILzZ01X62wGB7L4rovz3dDjMaPYhBCm3Yd5kTXxYysA32+n2h96cYYhsN/Vd5vL98OpE9+1w5AvHPyXXbl53V89hz0Evq9HQAA3eBdWIJvrm1d+p6Cw7CD4mvqmjwrh7x6AX5Nt/9vwfN2h9yilawDPJQ/o3e9J0C32fMdd+Hmvwbj4VhqTJ7DfCrn4EzK8/lY3ueBrJ+bQNS9n8EeelThM1f6DbNekz+Ip+aMgMP35Z9nZJ2gqzmLNXkzg/WBa+SOjHHXsLFprpHQGGmOcxc883r4Kwm6C8LTaPP1XEIA0E8cPOVm3VMAcEsGaKBYssZZl+RmtisGejMmANiUn9+T31/yuBM1FGAdYscv9LP8U1tcAIC/8zrfDj0AoN6IL8/Ce+fkkDmSfx5InwfS52t4rjVCdX2waJVcWS8f4bm0F0YIQ8fekzG0b9wQPQEPgM7dUQAAKHnyufRRJ893X9bENTEcoU27BXOT8yzoG9BHM3hrxmWR6uGv87oFXosZ8gDoHM2Cy3obvsuWbLRZWGcailCDGDoUB8DjpbfiffkGumEx/NVthBnwxvWpuFyPY65/FkDwJdy00DOSxjrQGN8lAwBEGd+c9D1PINq6TfgAQFrzqXvjmdiHJzJP98Q41sn7prmHHlb4zJV+wyzX5HWN+4pn7wwc/t/L/9dMqNsZrcn78h3rU1wfukbqwXY9MWxsWmskaow0xsE1z575diBBj8jcTQUAwBRxo5Cg/VgBwD1wDXZA3H9aDMG6cfirS3/QCAHgB1UQYLkT+wjRRR1i69BCAGCBfnYTDmsLADTC7X8Y4sv63njAa3xU+92Cn8EPOy/zgF6AJ5D21kYpehyPXZM5OwTDvEjEuJeA6JICgC7gTmCK4DP5Fphyw4d3XA+AurRuSn/WPC8BWMNNPw+8BYwB9sAam4Fwz458gz24OWAoAmNr7BZ/Yqz9CXmGFQA5uv6XwDWJXIc64FRoKt7nctP6Lbj/NS6v2RWPgURb7jpoBk6HxuXjAAD2mK3L++l75xICAL0BvahwPjFlt0XGq6P+09xD2n8lz1zpN8xqTT6CuO9V4AScofTcm0CGrstgTVqpypWujw5KPY5Khy73XZKMUck4vOZ9nvkxIzzNAAA5eJNE0P77t1EA8JDcFoPwQVbFuOLtao5IfR2AevCDzoHb4wDcifMGeIh7i50Hwhn20Ulei3m6yYQAwHPjdqnvfQjvvgoEiwUgrG0QUNikmHsvIDtfqp4Vjz0wgJOGFjjlLgkAGJB5G5DfwTRG1EdQEOCLHc8AEW8NOAD8bfWQe05xfJxnPrynjMwFXGNDhK4RRHCIimNrZyAzAb1fTHydpPAEbl4EGBhSwRv49xJz/UDi/+8F4vI+Em3UOuhGRA9Ex/OuoHeg5LJ7NNYA7PM1CHFtQThm0xPWUTclAwDMHuqB9Z1kPjl9FbUgfP2Xu4e4/0rWQKXfMIs1yXHfWwQCUJtDb7YNrpC3nuaaDKUql7s+2A5GpUOXs0aSjlHJOLwm2TM/YNheDE8fwjjbwMGbBxDwX6EUBQCMNkfB9a+GlT/EsJHW1+JZrIp+9g1Eh16AuIfYOKUWdhA60tS0yZgAgA82jC+ja1vToiYhHXKW5ukoEDdFVqiVqofkyZy0DWJiYxuGUEqSuZuAPO9xSGN85fyiL48hfp802+AOoFhfHP8NzDPGrrpdseAUGn+Mf+H32omIrWGqE2YncG48EhT5gFzxsGwtYtyHBAD4ULbi8lHrgEmmTyk96qxkcCjYuGp8B/2O02BMtonXgqBuyJNSdAlY5hZIwzUbNZ+8xkfoUInqP+keGjHc5uWugUq/4QVni8iU8zyvKO7LmhhXI8brAIBVyZrE8eKkKsd5N8sOYupx1BhJ10jSMcbg/IsaZzRiTT4x7C565ncgxH0AIe9Dabt0cS+yzQoA6glhTJDb4oDcu6NGrrdlQEeBD4AIaI1uil0BVqPvFtsvSEYXeJMrKMS9MvgAcQEAjr1HN0q9BQ26gmLaOBxkOZh0y23aBuS3SUgr1DYLXpdV8DjMGj87B2z3vphzx56RBXC1T7pS0RdNYbxDqSdJsw0sDwKTFUMcgiY5cNi9jCkwq/L7bwL96AGtYieoT4DqeJiiOAobjr8LhzpCAEAJgJ+DWx4BgHUrt9YB5uS3U5opMr6/Fb6Bz9uB+13fcQFSMFchs4UBv7qWUVRExWY4FDjrScW15tP6uWly/cbpfz5m31b/1hrAG1doDVT6Da9ArJxFZPrgcjMRsSYnCNSzJgYKzSQZz/c+cceLc3kYi3g3y2bizTbOGBMR71LpGGqbo9aAb/3imqyDiyNfeHboxr8JTT14RxRKwYyDdgUAz+hwQrfqAcQGLfcu5hZijnc3pT+sA2N7y3CRt5cRx26HmyGq93WlAAD4RrkCC2FcJnGIXNlbEWkYfGit0OG5AgtO2wyAKPxZ9UiMA9Etau6WIWVvE1IZV+QbzbhS0ZdnMQ/wULZB1O9bQMU6WO9CHnu7EUqICwA+gIP4PKUpNlAobNJIK/WFsTB/9xIAAM0E+AjS/yoZk7UcUEsDc771PdnbgTHFcsZsBPe/Ao6vxbthkYHXKmgLNH7W/fuIkouB3x0Enknc39HxMK3tOgDR5wRCLC2WVQDg+u/LsJctTQwUxqr2eFGXh0UI/U3HtINI+H2VYIwpo//xlMbAfeMbZyywfnGNNNB5avGmduDytShtBX7mNXlX/+vMUABgiQpgbHbHcC9ZqSb3XanIA/eHLlp09b4sk8neCGlsPldqEg7AGDDTczL2LsRSFlyp+M80bJKQEEOHZ052YYxFuI2PEiDJwc+uJQQAa0DqwuyIXUGLluiLkkWSHuD8je5X+PuYF1spAHgsuc9YD0Dd41aYAz1Yu5AqZwFYTDXkg/FdGdP3XXbLaKg3MkgAIKv+ozJeQr9bzu80gzeFZZpRKEuZ3suQ741pyRq22XK2JgYeyhibr+Z4ocsD2+VhsIGjge/NF624Y3D/IxWMsUZ2nL3lPI51Md6Fi/YCrBEmTk+7Qor9IfCmFiE8PUX8PeWmcd9dCgA4JYNv7Jv0cdAwPwLXIyuNsUcB2Z142A0Rka+cw+FeBQAAZYxHYJIRQe3CYkeG5TyAgSgpxpCXxQo1DBlpjRYgixMC2IEY0S6kMR4Z5JQpMviVAgAs+lNLAKCEqA+BB3ARGPLsiufwzlEAwPpc45oJ8K6MGfouryFdM05LAgDS6j8KABwGfrec30EAYMk0Y8x/FbI1DiDzCNORLU0MFMZidn41x/Ptfcsu97pCUTDf944LAHxj9JU5BsfjmQOWMzKRdIx+8gBvE9F8mS5hPlu3A5dTfL5BI8PqwHOOdysAYInVkPt/AD4qpj1poYIHLiwawx8DjX2tAICVATEHKSn7shgOgBC57QqiKQoGOO+SizFYPAuOga+Bm4ZvZodEpERAFqWhsEcAZh1uJ4fgSmI30csUAADGFnsyBgBHBpkQCVGtkIp3zhXkO1H0hOWGN2Eufw6kGiI5TnkAyo5/V8ZsjzCmmwnaRkIAkEb/tQQAliDZJNzmtuESsAc38E24oe+Cndh2xcJYlhenmuMlOZyVjNyeIQAodwy046hlsgOgyOLMsfiZZfs5kyMuAJiHlGkmbXpF8BQAWK7AHSN2gJOsxWQ0xeOC88uNjhvM+nJusVkBAM6AQJblNtyWdSEdwaJHMLBKbnSOpTcZ6YYr5KZBo2SFI5hEORARPvkZQMMKEP8WwL2nfe97PDOVAgCOLY6Sp8mXvtdjHDaoJ8AeGwsVc5bD8VyhEt81I+8aCawr5G6ziKGYzfKc9gXKAr8LY8YxposJ2iyFpLLuv5YAwCe3jQI5r4FNjmnJmAvO6csrxns212C8pIdzSxUAQDljWGqmeNi+Mdz5QzTHmOq47wEMnWTrhsnW4ZnBBNAoDkQRAAjFv6NSqrC+8JUYOd8547Y7loDIlgUAaHGl+gfI6t8D5LsNcXQGAzvgRrdi6Y2EtqcCOewz5DlRg7ztMchRc7cKuaDjQPCxhHhYg79SANBBrFllvmJ2iOXZ0G+D5DokzfV4QkzYF1YL1BsJKvFZXivLQ6Nzg8B4zeMZY0Ge79+hMeMa08mYbQxuQ+1V6L+WAKDBlYo04U3xDXCFlE0+RaS2RbBdryncih7DthqM90sBAD7l2JBLf9QAC3uePcbE4tbAmfEaQg7LRkg6WAhPAYCPAf/aMOosqnITGM+XY97SUPQlKZM9CwDQapAs+DBRN7+yNjeIVKdAwBdLbzNSOhhsMDDyHWyLxvMnTaFksONLxXuVAgCwUqPWIL4YddBgvNmqS4CHWI5uLWuUA9svhDWfEp+Po7EPruN9A7CwlCeK5PzwDo2ZxJgOxmgaRlMhqKz7ryUA8HGRtoxDReuqDANpbsyISb+mLCYkcVd7vF8KAPApd1rgCb0AVrhg30jRQ20cKw0Q+8B8fyskjbo5Y5Tq3eYDAL5JsyrJIfq/6LmlWRti3+AW1AoA+EIgHGPRWvVzBAY2wVtwSF6TMcoxZs/IDLE6ka3J8Z4cxXuwFHPSuXuVYMFXCgCs75EDrwYKZExHuJrxWdiNjbUb1HOTM4CmpsVdD7he5zxzz+DY+s6aHaM1vX98h8ZM64BWdbRuIHA2VKH/WgIAzsayspHWXXHFzV4ZsydA6Nz12I1qj/dLAQBYJ0G9AJbmDQMoBEt7tLdKRHpcQcHxuQHaFyH7AMncmtW1AamBqBkzgGteAcBLwx2472MOutJa8ioEEqfoCJPZcEPUGgCECGVq/EZcQWVQhXWWiNDhI04+9OR1qktonxYNu2Z91faelzF3VlndoyoCgAPgHaDi3CS5DZ9Rzrl1k0Xy0gp4Fo4IaCoAsIRxfNoVHAtHsIYIn/PBFSCrh+xdGTMtF/2EsytqZt1/LQHAC48t3g2kY3fSITbiuVRYY1d7vF8KALgTQaBcM0DUgnH736OLj1Xx8CF5PFmcjNO7XxM/bROImSgw9HfvqgIAn4GOs2jLBQAHJwgARBHK9APOQNxwxBWqMfEG8M0bq771exB0Dgg36Jq1CHrqjUk6dz0GqaRaAADDJ0yCibplsp49x+C2AEjlIPMBAYDq8N+J8MpsUa7tArHlD4i4yFr5XB3wXRgzLZLegmesrPuvJQDw2S78BpY3ttHZYjFbhh1Hu1ft8X4pAOCGJ4US9xTzqlY8fCsmTLLAV53YwDbIokL1znnyRGNmxmvIzlizsjMsALBQJQ/ASQIAIULZAUwgx1Y0rhN3s9+h26slwnIAhnjFIGNxip6WuS3HAxAKeaQJAPigXjQyEKxbZpdBNnvgIS8xsYbVsfAWc9GVliiO4mWomy7E2eDvgiD5XRkzrTQ9XwXCrPs/iQDgIGLM+jLtXrXH+6UAANS88RXRQ2LkLqRf8/+zUiY17HkXvAzd8l7KvximCyhXBdwCW3jgARudSTkAIQDwncEBiAoBsDJRLbMAQoQyvE1qOgyCgXnnr2qHsp9R0q/qilX0rXHYODewcjgAHPd74+zyr5UCACTLjAGXgoUq+Nsw3+QmubIt4uah4VqbgphwN2SrPCI3nlWimOfe0mWwWM+sX/CujJmGUM9umQAgjf5rCQBaArdqU8kNfr+S7KdqjfdLAQAXiVfT5EqLa1m3fWuvWemS9WDvmolnMCX9YxuHi+isfLMVSEs8ch5Nj7RIgFoN7FICI71/grIALEIZVnE6AJb/HoGBNYjD7HtIgPpu1xKSsXTB7BmbkWOwSbMALOaqL+2zUgCgxXt6YGzWAXjtyhMCiuPFYFGma8Y7+WSw2TORJDWzCZD8uzJmyJjq4RunlQMA0uj/JAKAkL1sygAAZDXeLwUAaMq7r7jWuCfej940PoyR84QllC3BrmVoS5RmqBUxZ41QRIn4XpI0wDiVzy6XYaRPAgBgN84Y5bgiyeIQGJdKtNiF/95xxYIL6NrhG5mVjoVhAKyJ7ZNk1fh41NytABtUdQBmPaxVVmisFAA0QArXS1d9KWAlvbTJc9w0vFSDrlQGmxnwmFu76mE9W8V6HrxDY8YxpnEaF2CJGwKotP+TDgCsYkJZAoA0x/ulAIDvwQugtjEkDrQnfR05v0ogSmxjWe9WD19LG4M0vGDNG5e7ZQsA+Eqr+kq06mZB8o/mG2Oxkbj9Rn28atQC0Fh1L7iqLZIFCwG9kaZ9r1I6G7p2fIIsllE+olzcklKOxJCPqwSo9QtUCdCnXoVx+EoBwCNXqNZY62JAdQYXw8qDZv1sbr6fswrnPHqHxoxrTKMal2BtS0ACrKT/kwQAkhCy0wAAWY/3SwEAX5MXAO15SBzIUnJF0R+rymZUKj0TwwekT19VWxMAWCx4TAHy5Z4/pUwAi6U9YDyMT3GuVgBA4yyvwI2iDUkWiwYY0Nv/Gw+bHW/rVwQAWG7ZUcMt+3PgUGaFvDi1ADQ/dN0V1wJ47YlL6YZ6UCEAqBRApAkAHkVkYyBI1e8ZavvOzpVnL827MmYSYxrVhl1pQZms+z/JWQCbHgKzj2/lO8zjZgGkPd4vBQBogS0usW2lJvvOH5/oD9bWORsAaRaXYBLCdzOUXm5KrWMxIN/H3Pd8TKsgiEVysyra+WRfa50GOAzxE5ZPHAfy2jwx2bFg0K6HPNMi86NFP+pcaalHJmYdufgiLEmqAe674mqAViEPjEvViUenJSMAsEe/P2MQHZ8AEKkUADx0/oI4GwCc1AsTakcufuGcd2HMpMY01HrlcNaSsk+r0P9J0QHg/cEcDDw8ml1Y0S+ODkA1xos6nH0E4jQBQBpjfOIKRbbw3Cs3O8J3+//G2VoNrDOw4Yqr0+JFlRUHzVoAXA44JEATIhzFqTV+6IklvqwAADyVcRvK/AAcqliheCEitlECAwuQf34QkT97X+arUT6sLr4u4wPvBlyulgxr1Nwhl2HPFcoC55y/lKfe7DQPtUvGT/qNNA+9ySA+rkEIwhduagH3vVYWZAWztQQA4IkrLQBliZnsxGz7RmyPhZrelTGTGtOeiNYNh3Q1+j8JSoD9LlwIDFXjeqSf7sDvRSkBVms8H9eMwb/GxbuNcdYSAoAsxvjA/Wfpayy0VWkWWj3d/rWWR0i7g0vVb4o93nTFOitWpde/fxMFAFFV6nIB8o/eNG4TCvLVGq+koA0fLp2wcRtl3I4KAQA+665xmPTLew3Jf08mYLM/Br5Bpyvk4/d5PACWoiCTrlSKOc7cKSpch6b6BvPEW+gCgIV5qMOuuNpUHABwOwEvhONjfWSg9Vn6PJkMryM8CY+cvyAOg5E1Ytxabc3z/Gj4mt+hMZMc0MMxmlZx7CrjtlZO/ye1FgAXuZqGDJdBsEdWsZkdD7Cu9ngdEaBd19SkPM8QjROVsfSqSmO8l2+fyg09CwCgujqfOb/OgF4692B9sXf3tSstUlfE3VEAEFWlLk7BAlQtstiQmNK26cknTgIABmnjarnJPjig05ACVqOyAPnkozIHY7Roog7CeuIb6MLTA5U5AL4Fjp4XLcUcZ+60jsE8NBU1mpB36oewyHNXLDKk6lOzQJCMA3xuUS56r7MFkHCdaWnLYUD2uhFUCcuXybAZSF19SM9hFcRhr9d0oEVVNMT0nndhzLgH9HTMNkkeqaz7PynVAAc94DYHWUaasTEJcd8F5y82w8Wcqj1eSD4YSwlzRTscx6q2x4TUrMeoJgBgnQENUysI2ABiOub85+SbbML3w0qAf1+vCgCiKg6hshqzF9sABDTBDc1Xuch0RbhkBW2maOO+JNAxAR+2XClgdumri3xWJnLGFUQXdNGEUulajdS/SehnzhWK2exFbKRGV1yK+VyCuRtzBeEIrRI1ArftLvqmD1ypdrwKIWHow5pbfe8bAW6IZXDWpR+uDYCuMMzQ2HDhqoKsKGjVQPdpdE8Gbo8+7wNXQut8h8aMc0AvJ2jMpcm6/1oCgKeeb8b7TG90mge+SHHfbfpZtbe8H6o9XmjvIxl1DcZagnHQ7R1i02c9RjUBgKoNthBRfdIVq6quwVrTs3oV7Kja/kE4R54rAAhVHFLjimVx1XU/QLfFNrqhcfWjXWeXyk1S0EY/GJOQGLxgKlPcdBhGwTlXrKe8LpO6Is+isovbrrQ2s8XaZxLcnPSl5XE3XHE526iDTN3/37nkQkDaXolB7YZ4+3M4/G95jJrGhfcAdVq1ClqcLYBkaWcr5yQHaYsYJrLie1vwe1i7PMRXiTISlu4Cx47jCuoMgpfqXRgzdEDvJeAb7CT01qXVfy0BACs24nfDym+61vWGt0lx3wPnL02O+6Ha41n1O5ZdcXU81VbZhgyUbRontM+rMUY1AcA9yDBoNbLVUFUVAcAyeGzUu6scDq1+WacAgPPSrTzGA/rAnOduVStagBiML0UO45VRhximJbGr2Zp0/PnQB7AOpSUAP1hzOQcGJGf8/SYtGmTt+1jwOVdczWkvIuSC7n9li5bDn+iEW5sClEZg3N+WMXxGDdURt1yp1rR6dizt7B6Iac3BTX4H4lYhAIDxvT24pSy5Qu3yAWLZasZKKAwR0l1oldZGIS6fpDH+/rsypu+APiyjJQEAafVfSwDgKzCDld+24SBj6eNDT9x3hvYkVj6s5ngMNnDvb7pifRWr7cfY59UYo5oA4CaQx1mvpt9Ya7uGvR8g7+4LGe+hAoC75AXoMVy+O+ReWDTif1a94m0g/q06f8nXKD3718RojAMADiiNKa4SoMbjtczvDrDyecEcwKTroplztshDU0SaygEwOpcNN1qLkXp57P4/E+j3IBCbV1DyTPp96gp58jfl8L/oSRHdAlC24YrL+bJAjKpmocHBmNYEuLNWpT8r/IHxPQzVqGdmETas1i7H0pqhgjUIFn0enEYgm1rEOuzDykI4HTN5iwMA0uw/CgBsAeM6LgAI/Q4CAM2iajT4LtNgi7HqGxK/8Ja+SofxINnbJzUYD8EG7n312LLYWg4uXNvGOLjP2yFsmfUY5QCA0JoLAYArBghQsm03pfZamWvDED5F7+7xGXJHAQDmMb4AN8MIdb4TOFCsjYk/vxZIM1MBBOsQ87nv4gCAuG6/OiBaqIjDOB1K68aHxNQLPoCGDaKkDwBwX8vg+ud+MPdfizB94ekX3XU+id4ncug/kH5vySK8LIv7ezoE5iBmtgz5p6isxuIq58kLoOSjTmDzq/LinPS35AFAzIZdAm7GFDCVeyFnud4VF8hhsLrgShXwfLoLvtS6Rfr9BSN183TM5G2eAErW/d838rlxrWGbM7Igkv4OynnfgFCZFVKdgv234snoWYVxpuT3BsFGo+BMtcfDeDYe0OPA6VmC8Co2rsSqIIP3eTXGYADwkytonbyICEdba645AAAuAAhQDZl6I9ShBG/WruHLI3p3rykA+MkVy4a2Gu58vNFvechpFtt4GzwGnGbW4ooFEDqN2I2vsQeCxRKSEH+0oEMzgQCNscy6gsACf0wVX7AOoE7pU2/tz11p0aEFw6DO0OHP/ehBdixHeSxI8YmnX6x/Pm/E5htgMdwUUHFFbuw/yCI8Q7d11UBAJvWUK1VWawXPDmtnP6ZNqjWutf9JiF0xAGLPgRJCx4Df0AMbtsEVZHEVNHG4ahJIo9rGDS8ViwipsRwzfn/SWOunYyZvvAay7v+uh3k9EfhdvB0m/R2UVEdpWSZV99P+szJ60A6Nw37ohrhvPaRtV3u8e8be75W1NQLzpcRobNPGONY+r8YYf3UFMSBLAt9HSJ8K2LWnlNX1jYCM7wAE3KBzug1s56grVrkcJfCCoeP/8u4qAFCN+vsBNKhoewVu8+w6tNyFq3BLsIiDT8g12wuxm1D6zhRxEDhNIknqz124mSoI6IFNoJLAkx4DOBE4gBrlg911dtGhSWNxjMoc9EEMDfvh2/+Hnn6xcUodysVekzXwoyzo4wP7a+n7Y0ix7IUUS86l7nelymr6bb92BdWsG7RJtUhQF8W1hiB21QlzqWzYPshHHqTxNc6lG/aurK9L8hzPXWmNbW4DsHnQS4UlQNtdcYVDbv0ekuy7PmaSNkj7IOv+bxnMa1xrQ2Wsz9DvYOGmH8Uw36a0aoz7ogbJuNFGIe6L+6EJDmMEw9Ucj/c+6rZg+vYIpEePwhi4Xrs8+7waY/w53z6Sy5EWwWM1QE5JD605K6vrK7G9X4qdP+8K1XYfQKhDQwF9rljlso/OIfaCHoOKswoA1EXrQ4MDgLbnXLFoDLoOrTQtdA0NGKmD9+WlrtDEDbpoAQ80PJgmMeSSiX9cJxDwQvp8CUzogYARGXAF1TE+gB7LgrzhinUSfAYV++p0BRW8J9DPZVgkn4hLivsdpDbgWXQqPak3/q/k4P9UgMV7sJG0ml+3s9XU2uXn9Hn126pq1nkCASrKozLD2H+3fB8EUhoDa4FNrT/XSePX0eF/Wd7xG1rfnTAeNnyfBpgrLQFaT+vE6qPTkyb7ro+ZpHW5UjXILPu/TsxrXmvdZazP0O88hgPyrHjK9FBG6Wvcfyog1m+0VxASbad5w8P4Ug3G4wuAFgjT+dL11esKAmnaemm9Yjyb93nWY/wx394Hu6Y1Ae54gEfUmsNLsKoA/v1i96tq/HGFwgZXDTSoIOAVuITG6UBv9RBJxg3XEOeY35JxLwCC7jAOGash2nwGLp+o3+12xepylwkE1MEmUEPzMmBEXoIRtA4gPbQfwoL0GTA9zFrF8DbSYXpZDtJvZQF+IIiU++2i9jLGovtSAMXxwf836ff3vzr9c/rn9M/pn9M/v8w/4sr43uMSem6kHvRD7ngbxDBYqrXfcA2jcqCmmR2P+/3plzj9c/rn9M/pn9M/p3+qCwDeg3gDumqvg2voMbhrsZBNJ9yQ8bbZKTdOdaW8gJvxY7nR3oJUs7Piflb3yqcATC4SMAm5JfEGrVK27Gn4Tt71Y3n3uK4wjLVYYjo9hiucx8/6ndLst9rfohrjfCZhgPNEgnrqcd+i56gLYomvjO+O46N3pZrjVfv9bkJ6JxaN0vjnIIW1MKSGoSnLO/idwYJGDx3aoQ7StlDtefXKNUGq6wNx1yovRENDDykkpfK12trILWwV9vL9fL2sPyTEIgOfL1k6N/3gmrbm1CLcIUk463HS7Lfac1ONsf4p3/413/7kSosIsX2Ls+7qKR2wDdY6NvUgN8QBANbhf8PjEvcdhgMUb9aDsZfihC/oYLxNIOA9cUP7vBL1QH6w4uhcI0ANFnIN1IX+hZA54no+lDxiyemOeshwfCBl/U5p9lvtb/FVFcZR4s4lIw2qFQhcFtlxANjEyLYddqUFlNDYVHO8ar8fs5K7oY9xIsnqtxoFUu1EgBx8wciDbgQg2Anx3BAo76I86HoPP6TeIKVyjLiLwo5WYS/+eT0YvgbWOAtjdRHznucNw6o4b5xyh+DsxyqMk2a/1Z6baoz1L/n2W8kc+Nj5ywjHWXftcH7i2fQqRACMAwC+8JC0HhukuF5iUuphOAGMc9aZHwJ2PB6MHAq4KAfyF4D+LXKiHgSDRmqSMvzRYD2LiKOHCJCvKCUQ8y2xoM6MkQ7XZYCArN8pzX6r/S3OZTzOBbgdXzWEUHDzT1C6IxaCUr2CWUiDstQa78i6vlTF8ar9fpg3/5JSh+cpTVbtwgz9nZUeXO8RQcHU0TignJXQ2gMZIiiENmAwxZnL5CvspY3lV5EwZkljj0Du/SLoW0xArjfOm4ru+BQvL1dhnDT7rfbc3KzCWL/Otz+IJ/Uzuv1bAnzWuuN1hOtumNL/SlIA4wCAbwR9WWlaLUZanC83FHPOsdLcJCCoV4a7D0EAuzBvBtITxwxxEhQb6vekpTGT/obhxuTsByy8sAqiGKq8xII4fCApCMjyna6k3G+1v8VlMQBZjfOTeBgu0Te3Nv88CR7ht12AFNdVV1yv4SWk02mK5XU4LLMer9rvp7cnzUnGCqBrIG6lokMqs61CVagRwgqSN5ythY7iUZMBUO7TQrc0In5yxcqHKkzFeeIKVDqdv7AX/vwYiLHgtwkVx1I1TBUFmyMtFp1TVatDnXrUFbhahXHS7Lfac6PAMsuxfgNpg18aa4BLdvvWHa6jNlp3syERoDgAQF2GPqGWProFz7niKkTrrlh5DlWilgFBTQbSATUX1nJhPgEXpiVQhGp6q3AgoDBNKJf+rseNyfoHXHpR5TBVSlIlcflAQtdplu90M+V+q/0tbsp/P8hgHI37/iBgRl1/vmIoKoG6ZXxblSDWokUheddrRuw6q/Ee1uD9nhoCV6gEqntEZYdVpVL3D1aPU0VCNaDswcBbj8pHLxignFXqsBqapRKp4blWA8SgUhwXIPMV9tKGRXF6IGc8TnlsLJ2uSntYVwWLhY0DKOFaIY8zHKcu5X6rPTfIi2lPeSzlgP0OQqlWCIgrxE4b647Xke41rNfjlQGOAwA05nrH+aUUWa990zgMtVY4HoyqOb4SUxAojgtzhJCYSg4fuNKaAyE1Pb15Pgi4MbkoBtYA0HfWohh7ML5P9vheRu+kEo9p9lvtb6GIvN6VKlJWMs4z6fOxvA9Kd6I8M5dD3Ycx9Nsq0N2V/7cewwPw2IhdpzleKwivVPv9ntPhPEZG8sgVF8LRCqPHY2MJXwQA+k4srIKlUFXtcx3ACoJy1KnHevas7Y6kRgQAWmtiB+wYS4iHCntZcuUWAPBJqGvtky0AMQqc3sh7rnsOOVSVY1uexjjIg0jz+as9N8+NWHoaYyEH7I9A/tN0++suXP55ldYdr6MOY6/hml9OCgCQLcxKRlhMQTfcDhz0WB0Py8TqhtQCN3ElgXGSQi5MLFKkh4A+l1am8+npczU9qxzylPOXxdwGT4feonYBGPgKH7XSYZDWOyEzOc1+q/0tGJGnNQ7qM0QV78CSuVqYaZPWPBZZ0mI4Y8ZN445hhJUFn9Z4fcRArvb7tRC3YMwVl3jOwd5X9/wqXB64Qih6cHhfDsHhv0L77gj2H1eqy7noSpGPAgDgMAEACFXgVPfvTVeQWm6jMbUKqdrVdfCgrgDY2QbPybjn21x1xYVxhlxxmfZyxhmhuUvz+as9N9baHatwLF7DfxHy3xki/z0MhB7WBXzvwbjoefIBgKNyAQCnQrAkL5ZT3AXjsEmufowprgI6x99BEGAVBbI2SSu5MNGIYL/omtl0dkU9dF8qG7QObv9YxEHH0Ft/DuJBSg5ZBGCUAyOkhg3LAncYh0Gl79RHiDzNuar2t7AQeaXjvCJEjoDGqvq2COt8E771misuMLXliqticvxaFfWueIzwWIXjIeFHY9ttNXg/rNA4RbHIZXKfTwOQWwG7gTF7rCbJ8dFxw4NxBIf8FgDybVdcJhjru09TvFZvhlkDgO+E6HyDvg+/3xK5f5HfoHO6QmEv/DaPYe3hATNB8eIk48xBDBwVYNN8fuQZZTE3nJEVWrvW/MyQ98maH17Df3OFwkHnwdOO4BaLbWHJbg6P9UOKa6oA4JaRCoGTroe/opItiDXMu+JCCtNAylkgr8EhvJR1O26M4SabIQSWAyLGIrnhNl280ot8sGHZW93QOM4ssM8ngZS2Dm7PXXKfavzUOgzKfacxA5GnOVfIyK/Gt/Ah8krmhxF5nAMS42kLYGDQICxTSEvJhxhXviEAKmSErfGmA+PNGYQfrL1uGdGs3u+WcQiuGvFI3S/KaJ70xC5XXHF1Qis+qjezPdlnGp/FS8gS2B0FjK8pXsvluhuqAAC+MRjgVhXSGeA34Pysgr2dIbIxf5ubsvbwkJsB3la5bYFAfOj5Fz2/73v+6wGekXqisYDaKqw3XrczEWTsezHW7qJBxGPC53LEGv5QMqm+N8AfXzrn4UJzALaMCbKpAwAs/NHhimuu64bbhc22AsSaCVda1GYSUgNnKG67b9yOEYnHIcosGSQJNKgh4o4FAJ57DrYdcCNuwjNjTvMQuT23wA1pVU30HQZJ38mHyNOcKx/zP07/swm+RRxEbo0zA+vLNz+MyNlFHlVW02eEsagU8lmeAdNYK3tFGeEVyprRPPlpMkALhkFdpEMpZETHCJxnYUTXIPyXg/i+umK1VC6HInIGGRC/DXrldoBzswlehGmwQTMUMrI8c5ra2A6ckywBgOaAa8j1IRwEeogOGkS0XfDYoAeDa5o8I2LtBU8cPQd9JmkWIdT3/HqJ2vL8vvX8zEFD/s+UwfvYobW2A5wzXRNTnhThx57vh6GxJQCumgKKKZ/WfDKfBasGIjnXypzBS+euwb/pgqy8VAEAxyOwnjUiki1wsU664nK5WNYW8yMniLmNE8W345aIVJlBQphRKNlK3eEqeBcMQ4Pv/cZzc1CBkR4jvooxVMvYZInIQ3MVQuTWXKWJyGcN7kcaiJzTZqIQOZMaQ2U1o4ww6j1YBa4uC6CNMsIMLlWQZxhygSfJfb/rOZSqbUR9LsxD2QcbYPSHyNgxWF6G0GCvER9FAuEhxV811W8IDPQU2Z0jDyhRu5A1APgCeDXX4Fs1eEKQSKQ88riEWXDsPqXW+tbeGwFRBwmaBQC4imo3eVG3AHzx77MuTByeEYahX0Pfh/A+u0Z20Ah4AdVT4vt+1vdWMZ7OwHxaAACV/64Z5FyLeKhre8UIITdlAQCeQCpPVDxiHg5/vH0hIW4TcuPnAZFjf1uGe6PN2WIZTQbCHI2Jklm8A2NkWgWPiVJoaHRSVwyPRbORCrQG6ZCbQKIaJQCQFSL3zVUcRM5zdZIR+YgrVq6Li8jPuuiymkmNMHJYHsLauiDrOWSEMVyE8XZVAOujdbkJBs86lKptRKMOafb2WSxrJjsNArGxz7gRM7jAOet2hVLBmPWA3jweSy8fWQOATwwvwCNPCHIRboM/S/ORwlopo+aqK4hrtUccWJsJ2oZhb7CKaktCANDliiXTH3vSVpH/sw9rZod4HztACt2njKxJgyuRBAB0Azk5CQA4Y9gcnCvLI7YPczVlhMlTBwBMguPb/z4drGMU996RD3IA6XE5MCDzxksyw1gRztfgLrkF3glEmEkNtHVD0/jsWQ8AsAztNLnyn5GRmgZiIIoiYQgga0TOc9WbYEOy1OnbgMi7Em5Inw53U8pGWG9gZyK++b8b3Bj2MiUBANU2oj43fY5u3PMQFpw3jFZcslMucJNX7Yc2z3c88Fw+dD9nDQA+M26DT+hWhyFIJSDvQQqyL3z6nDJPzgvnIM6BtZigzZL3IcSniQsA6iDMaKXFYU6+cjk2XEHnYRE8kOtGyGfFeO7mKgGArz1eR9QdmKbLMa9tTr9NHQA0RJDgcpTqME3kqwMwJFuQM79PHx2R/64nx1gJEz/CJskSJX8TYEpbsXxcDA3EVEWNc20TRHTJGpErGm+i21ncDYkphb9kRH7xhBjh/5B1yzwTDJUkAQDVNqJRxoxvM2xbfN7Adg+/gEEDe9eeeS4z60ActA7ntioAgC9dsbCWpQQ3Qd6vQ0h3tYiMAwSi9XKjJb7j7o/JmG0MbqTtKQKAe4YXgdNW31A2x6wrlgTHMGcO7NKGcZtuq5K90cyP6x7eEYNmKxzWB1kMj7MAAM88sbwdY4Migsd87DXgAKyC5wAPqWkyRNaCqAVKLnfh1rtiqVqscoaFkfrA3Z01Ir8Lt9pKNuSDXygiP2lG+BAODVTMQ7d2EgBQbSPK7kweT+duGUibyzCX+M7MB2KGdNQB2yYXBRY/mosJHrIGAKwE9ziQ6bBJAEoB0z5luuC7c/rpDwn3x2CMpjVdOsQ2pAkAQmCSSZyq5zAM3JIxmj+1TztgczCeXg17w6RP30V2w5WqZmI4TC+cD7IAAEhIYHcb36hZJjFH6Uv4QKySxOQfa5JrYaArWbh1cNvuBLc0lkbuAKLLKSKvLSI/iUZ4Cw51JrYNJgQA1TaiXEiF1cw4DDBP68EKBapoi+X92I8IyzW4YmliNpJvwKNZbQAQRwluzjN3+vxRc/bUFctrpwUArLK3DSnbG+scWvWkVk9CKLAbSLxWaHiXwlB6HlTD3vjSPvmyvU2hQP62L+Dbpg4AXnhcZkyk4snltBp21fHEsxGzJrkWBvqkeQBOEXm2LrmTaIRzlHK6BB6sJACg2kaUU3VD+5OlgA+MfdoL+zRp+KMF9mStAEBICvgcpDjHUYJDbyYeEpbXhG+JrANQ6YUDyzZ3wVhp2pvQOfTaIGOjGJFFGN0GD5s1djXsTZyL7BqR/6LOrdQBQHMAbeNmmYxwV0zQRPKExAEAtTDQ1sKtFQfgFJFn75I7iUYYxW1yRigg7iFYbSOaxEO3TADSl+us4DouADgJHoA4xYAsJbiOQBolel8XDd6EFSdGHYqrKYYcFzxjpWlvQudQSFelMcB3YsJ0HA9OmvYmyUXW8lx3GZ7r1AFAiASHuew8sbnAAb9vbLQ4AKAWBrq5TGOTdhbAKSLPfkOeVCO8EhEKiAsAqm1EfRwdTr9TW7Hqcf9zrvMTz9pDL9KyEQJgDsC4YSTTAgC4bqYhxKFtlmxPSAmOM6+OiHw9HzMLAgs1XU+RdMz7SDlV1QAABxGk5fqENryaACB0keXc/yjumtZMyRwA4IdDIzdNBB7ewHx73ikDANTCQPsKprCxYUEfi81Zrg7AKSKvzoY8iUZYOTShUEClACArI4q57G2BTCJ9n3XKELLcnVqcx6cL4dPm4NRECzywkRyBsEOlIQAsR7xuABRfmebhQHaE9hGlg8C54prtlEba8W6VAEBLwGb49BuanV306qQAgLgX2STpxVUHAEtA6tIXZnAwbPzuTuDvfQCgFga6KSLlyMrL7Ja+8INyfNNnpE4Ree025EkzwviMOvYerbuFhHHwahpR3atRWiKvIU30wJWqgVpE3c4IN761t5sN8Gm9h+U9SIsEuO/xUPiU4Pg2aGVHWJ7PbeeXVNcbY2jtHbj4omO1BACHLlzi9yQDgLgXWV/lTVSuvS4h65oAgGkPANBJQpLYtrHRRowMAmtB1MJAP49wX7IQ0ijE4Qc9H9QnOHKKyGu7IU+aEcZnnIPU1gNIsV1xhdoN5QKArIxoHG8dhuV2POEjK1WX++I9iSnGSiDsAkLuaET4iect6yyAuEpw7F3VrBqLg2PFjLHGRpy1F6expHatAMCCsyuKnlR7E+ciGyr8YynXVgUAMAfAAgBo/CbppXgS+aV9RLBaGGjLfbloMNexrOkEjDlNLtwjTz5n1ykir/mGPKlGeA7WL6dNqnFICwCkaUQvGznO3Z4c5yMC1FHAPCROhnrpmIGiJNkRYz7fBOxONWoBxFWCwwOBm+/nrIPjUULwGWpcVKstg5BjlCBb6PdPqr2Jc5GNY0NQubZmWQAs4oEuynm63fPhi2WF911psQM9mGthoNl9iepM27CAUfBI31lFb9bg5sbGCbMQThF57V1yJ9UIq8Q2hgJwn5UDALI2olfFOIVUzhAYc3GtcXL/qyzs9RjhP9WUWJJxsES3kvJWnF10yPI8ZA0A4ijBHblCxdRQ2/dkO7HrOMnai2pYVltDNdXkHFklxVudvw6Bb91X095EXWQPA2dhE5H/tLZITXQA5j0u+G0gv2y5giQsigQtyQtuQJ/rnhtALQz0Y1cQ6ekFlKa3B1Sy0xoHSvRR2dscGEqO3aLYzSkiry0AOOlGeDwiFFBpFkDaRvSWrLfHsuaeOX8Rn4OAVw6lTlWp0wopsKbELpBtl4Akq1UhWbHS2pdIXM0SAMRRgvtZfv8woh25eNLnSfdHqPW6QvU+LeCTVdYRzqnlzR1xxUXZQnol5WYdWTyRpPMZp/BPnDD1FcmQ+8pVSQkQ5XzRaLCbH93WGjLAv1fiz7b8DNbwZjnYFzUy0A8oTtMPqT2LAAL2IU6/D+0AXJs7AG5Q013f7xSR1xaRn3QjPGy4ro9g3yTRAaiGEVXJaNXgV5BrsZ33PQaP2c5aShlDCmo80TN34IrrUCBJdgv2rILyDeLxoMpaXRUAQBwlOLUhcdq+4dVg7fik+6MnonW74hK+adobS8J5NUDqHnCFglndgd+LqztiHaSY4txtjLMWMZ9Wqnio8A8T1dUbdkyOP9bI+cJlWAvAd9veoTAAVgHchTjGNrgqN4y/35H/vwz5zXg7flYjA33XFRe+6XYFYR8FAVr5bgfAzgG9m95E9PAfg4yBNldac+EUkVcfkb8NRth32825+EqA1TKiT8F9/lL66qvA4CHb+Sl9K/TMrbpCaetDD4FW9796HJeIL/AK9k81PABRSnAYHlmOaFa2kxVSSQo+o9qQzJsqm6Zpb+IWlsKqtEPS1xCkoutZsedJV1c75as2yWGqSXmeIRpnwUhNZV2LUEgsSaq61q351GVUDTBU0AP126cBBKyCK1zj0gsyAUv09+vgplOBDC12gii8FgYaU5maDBAwBWlaq664pLG+u77bPCzOQWD+KznuFJHXFpGfdCP8ynPbPQQwXm4tgCyMqB6cXfIdhuXvR424/WFgH1oGD0uBqxEdAU/kiuy/bVeoW7JPZNnX4IlcB77AJICAziqRAKMkk3l+pgPN902nygw5TsdsehjqvKVpb6LOIebDzBLvYwbAoZXBxXoTIbEyLFw27wpCeFM0Dv/8MoWa4xb+iRKrOyb/HVcy/SgLAOBTKcJqezuuuOiPZgWg8pVmA2jJ4DlXqow1LX8/BId/iyuIf9TCQF+VOMsDAwSoUZsgV/Yu8BywjCtK/+rh/0Le6+EpIq85Ij/JRlgBAN9212Ed6602TjXAahhRBOt6OM+CbUDi7x6l7rEnjg0eeuYQZCjDf5bi/et0IdkA4HEIfIEVVyxfnbYOgA8AhJTgXhvz49vzkx5CNNfXiEs6Xk7QOKspTXsTOoeQQ6JgbtnD+9imn0VFTSQr+4R5dinMvAZjLUXwS+bpMLdSWaMK/1hy9cfkv8/z7f2AncyVCwA4VYEnJEeEPzQc49DG4KCcAbLaBPz9sHyEXjr8H8sL18JA/yiko9tySCMIeCkfEOdklRZAzjDiXfL7ePjfOUXkNUfkJ9UI49pBHgqHAo4P//8vcChV24haBOJV2CObzl+fA93/KnaCBk89cxhm6JI5GpI+0NbgZUM9duvgNdHvu+Vsga6sAUDUgYOiZmNwicAWNyU6TtrxXgJP6o5nDtK0N6FzaI28X7se3geTsZFsPkwMe3TPj1Gm2h7Yq5zshy3gs+XoWZRfMhPjUrMDzx63YN0x+e+TfHvPlWrWLLtADYo4AOC+QbxD47NBJL912UCLcLOfhU2IhgTdfRq31oXZDIf/PdnwtTDQZ4VkwSDgGXkjxsizwVUPrbz8Ojj8r50i8poj8pNmhH1rpzsQCvj3wKFUbSPqI4rmgET8Gowk9hMSO/maPHMIAjrl3frBAzRGl5FxClVqhhIb6zSlgKMAQBt402aMbCUUDhuB+VHvRBtlKfmKlvHvW2vvsIyWNQDAc6gTDjkkY2/D4cy8j8MAGRsBp7rYeZ/oXluGNbwfmI99Ci3NumKl2FZPFgva77gl64/Jfx/m25+NZ56BM3gWvLF/t61xAMAdgwQ3KC8zCyAgB6x/NRxrhPg1NW7buBn3w63/ubwoHv6Xa2SgvzJAgGoRoFGYAoPCHgB25XRAWtNtOfwvnSLymiPyk2aEfQCgwxMK2I0wyNU2olHpngcQJlsybv9q8Nj9/6V4AhgENMq7qXeuW+apn9ogvPcCpFBukLFGYOgDALsJAMAu7AUGANY6wKwlyzaph7QR5ppDo9hHnNojWxW0cuyNtih7o+cQZn8M0HdkMjZmY4XI2IN0w35C+6QPQr3qPVqjswzd7NvGOBra7gXel66pQQiNswcX7SAqYf4E5L/P8u1v+fYHeuYhsTOj0EaAj9UeBwAwCa5DXmKIQMA6MG+RAY+TswcfRA2+pRan6Xd34PA/XyMD/RmAgEtiiB4GmMHbxAHYMPpEV44WcTh3ishrjshPohG2AECz4Y1bBmDlM8jVNqIWANggo78G5LtxCL8x+Q/FTj6Tm4+CgJuyJh+Dd+4FfNNOat3EF5gDr9EsGesOMtYYekTxrajiVav080seD8AwfAvWMPHFg33k6EX6/QUKecUZM0mbp72B9gbXgu4N/v05V6rAqPHuG+B5fB5Bxl7x8D5WXbEw1KiHjH3fFYpYtRAI0IN6Hm7sq9SWZe7niPTdC/u3Xt5Pz9OBAIcL7eBDOjOOyX8f59tf8u239MzdkHWjDb3sL+IAgKvg+lZUzyBA46zLdMvfCaAjddVy/n0ToZxL4vb7tkYG+gMhWHznCsWI0AMQQrVrxmHTRUxOdOWcIvLaIvKTaIQXnV3Vrg1uDzgPIYNcbSNqeW0W6d3mgSA7DEbyBd3+LwPb+WP55/cCCq7Iu92Rn1cgoMCxiVob8AV0HU0TCRmNdQOF+8aBW6CNgWs7kR/njJ9nm9AFoG4SeCxTwKkaMuLBD419OGb8/qQraI/EHTNJm6Ab60+uWLq9g/au7/d7Xan405UYZOzxAO9jnrhpw/J73QYZ+zYASjxQ9aAeIT7brOFm53F6aD09ovO0y5PFpV5xtYNI/vtOzqbjM+qP+favv0r7jxxOqsH/yAABg7B4ZiKQ0Sogbdz4Q65UgU9JDufEzfFFjQz03+TG8a1MOh+iXCp42XhHPmyeE5NTbzaniLy2iPykGuEx8lQ0wO0hjkFVg1xtI6qZIj1EzONn1O+umT9oJPn2rwbvUwEB34l38JL83E35nXvyHI9l7z+VVueKtQn6ZOxhIiGzsW4ybB4Kb42Ca7WNvuuwKxXqGqU1+Jy+xZDRBggg6d64B4dsO3EguOn3aos5ZpKm31BvrLrecO/inFvvh2sAAaCPjK3fUQ9n5X2MG22UvvFLyFapJz7WDQIBeFD3wVjsYh+F2/sA3LiV9K3r6e6v3oY/cgBfksPDAgHdwLwdBUM0bSAjREe+jc8FDr6XmN9HNTLQ74mx+UaMEBYkQve3uhOnPe/Ih80DVyrjeIrIa4vIT6oR7idQ9BRupZ1kkEIGudpGFN2cvvlQo98N3wMzf65TrvPx7f+vkvL0iVwMvpG/vyA/e1V+76a86x3p664rVidsARumt64uY13cBdCs79LnioW3+mjtPqd5fWX8PK5B3EPqvuX2EgjSDXBR0oJL9QYHglsnfK84YyZpOnd6Y70o3+GegDCc867A7+Ma0LVk8bBQZbLdFYtN9RvtFXzjdnhOJmNfEo8TgoB6mSt9fp3fXo+bHb9XC5C+dT1df1sAwDfigr9MIKAejEcnEOzUgAwbyIjREW78FvroHPN7v0YG+q9idL6SecCSxI1G+hHGbwYN48Y3G3XlfHGKyGuLyE+wEX5ppI1a8xBlkKttRB+Bt6LdMx8v5RlbZR4aDPKvMv/VDvzxV6d/Tv+c/qkKAPjCAAF3wOg3AuEmChn1uWKFutDGt1B/LQz0nyXF4kvxRiCqZanTborfdBnv+Mi42Wge5ykiP0Xkp39O/5z+Of1zYgCAovgmYNK3Q2vzHHDXgNymLvxjpuJvgMCDqTxo2JnF20Es3g5g97MLr4cOlReUHtRhtDb4OXQ9Ws9/TLb43THhIt/+Rdq/yv/7o4QMPgGPwWW5Md8n12O78RztMJf1ArzOew6/59BPpxxuXdJegshMC3AOcL7vCwhohG9r9YXzbT2vHtpJ301d+xzffR/m+bcp9vuRALkPhNfxl5h9d9Cc4Ny2wrrRzJXb4NnJaq6fuOICO7413Sw/F7X+sW9du+cozFMPN3mLsMR7zhfmivPsreCdwctF6LmvUEog2hCrNUO6MYJN3PN68fjf+fZv+fYnWT+fwd68WuG4ZyDDyALnqGsw6AmdWCGzn8h2qOeWsyR86xu/wzMGyxnPd1ZzfSeFZ630ObKct9+BncHzk8/r/0q1j1sLAOP9vZ7bVYdx6+ZCBceG9/fG4Y95vM3kLtRYG98c++DvB40UigGIm7ZQmIJbjyuVHcbn/1qe/2NZlH+FA+q38u8al/wIsgZ+BM7Ak5hxQdzQyr+w3N9qiHthfgalDch/97mCDPAzj3gKxkH1pj5A/bwyYp5ccCjpu9U5W8/6U5lDBQJp9XtGNssXMEZU372BOekDb1GrKxZ2up3xXD+LeG7++aj1jz/7hYAm5rs8h9CZlbLEe85HdH3mksXGfTF3fu44XrkQWHlIex4Jh7+WHGsE92dhb96vYFw83O4Y4TlUNpwEntIEEQ+t9c8XhwbyfvZErO8eCj+xBzOr+c5qrh+k8KyVPkeW8/Yn2F+drrj4VtlpgMx+tYQFBj1xd71Fa4z7Q3nICy6s5NULMfARV6rkNeYKeu+cxjNNzOkuEkaw2LtYe8CqPPadbNQzMtkfywH1Z2nvy//7XH5GSUmXQTegISYzGJnECiDuBAhwwzA/KrOr8zRC+fQ3nS2f2gffdhz6moBY/YizSw5bbPY472YVeMF5/swgfpbb7zlpZ2mMqL6Hgb8wYcwJ1lrAmL4a4AcZzXUzHA7Wc3M56ND657413HeJUl5Z9XIqYs9xqqtqeUQ9O5Nmfax7fu44vBwfWMFsEw0/noPQ3O8FjH4kduw74MCgUFrScZ/LZegS6a0guViVS2chK0jTJ6eNtNnnkC523cObYaXE0Pr2EWaznO+s5vppCs9a6XNkOW9/o/01ZPChEgsBYc3tcYNlrWluughb4RbN7j91VVwJGMgoLW/Mo9XDbs4VSygukvBON4jHzFI+7iykImKaFdYeV9fPWUFcelP9kFKSvpWfOS+/oxoKj11x6ddQbjDmEl8h7kIzGXMurLQIxmHelcqq3iNPBBZQmaC5XhSDg4Wa+HmnXHHVtiTvhkDrmjHP38iNvdJ+r0DjMaL6noLU1nmaW11/I664rLMamnvG2k5rrjFddNKzpifh24fWP/fNhF/NnkERLhV7Cu25NrADSOiLenbOj/fl3fNzx8nMYbAy6IrLcSPH5Udwsb4ne/0zAEgcHkHDGzUugiQmFlvqmvOksaI6KiycpX3qbfeOkT7bSx4FXoe8vq2U2YaM5/v9jOa6IYVnrfQ5spy3j1yhQNswfN+KpIBZfW+JcqxRUlWVyppItIDZ/DciDKRVzWsN8sfXwOioEqEKzljV5LiIzBr1Y5UffQQfXJHfZXmX7yUs8Lm0r0GU5LL87A353TugQRClDsZqYteMtL1e8HpwaeUNmQctr8wKcmgMcL6nwMigZLPm7GttB3zWVVeq4pjk3dRQ3ad5VjfbeZnTSvq9TY3HCPW96goysTwnum70FjZKefqNBsqPO9erMeYai4jMwjNqWwENh35XWjo71LeV8tvkbJGqncCeaydejYKAqGdnhTyf8h4/dxxtDgQrM5Dui7LDqrSG4cuP5Tb6tRGvx/BIryuWxF6OAZLOG+m5XF9DFU9VWVX/uQ59DhvAC7kbrJ0xG7G+tXw765iolzfr+T6TwVw3pvCslT5HlvP2Odm0OfmOFRUDand2ycKcK5bznSC0xfn8ZwGlsIocG0hdmBswlirJ6eLflr/XBaw/w3ryPc6W19V+LMOlpLYnspH0kLopE37RFQSKvpF/1xu/CpGoeM0TY2Nb+uCWct9NjwsWvR4brlRpz6chX0cCMjjfqjqYc7ZinxqIXZjnEACIejddI09kLeA86yH9YwX9PjYajnE9om81hijtrBLXOVdQelwEEPCKwkhoeNOcaz5EV2ENYGGdSSCM6TviXtF1gn1fg5ujpffB++jI2Ef9Bq9GQYCvXrlPI9/S3rfmJKRwuUlgRRVD0UPWARoL9wy79a3cRi+CG/iRoS0y7orLpeuY2x5b8yMccHWuVD4Z6zxsAgCygBfXGXlC3A2U0F4y1jeuw21XKpuN+ipZzvfnwENJc66fpfCslT5HVvN2TubMsmkVlQNuhcWjBW82wSBuEmr3VfFCMp0V67IM5LGOvGrGq0Y9/reW79SKclrilYuK+Ars+ABAs0zyc/nYeqDorVJT036AeOk1+bv7riBF2ih9NIH73qoQFireooxgdFdjGWTV2uf6CxYAwPoFqACo1eS0Whn2pc+nBkj/Lg4ACL1bizHPdTDPt2Tzl9PvM+mTWyOwme8F+tZ1nTPm4gDmaEfmecEV149vo7keSjDXBwBufHOdpCT2CNxQcO9iBUyUGr5NISdL8TO0j9RtibwaBAE+AHAUEwAceeaED9ABV1wvYgvWzTZ4yMYN7w1qkSiH6QKERm4bt2ushaEF0tR+4Trh8q6Wuqh1MGAFy0UAiL5Ko49dqbolF9HaBbvKa5ALZ7FNzWK+FfR/DQTomynOdWMKz1rpc2Qxb9eBY5OoCmUcAIA1vcdh0+agU67AFyLTfe6KqwtyrGsVDnQt8avV7bTYyY6xeHGDsDFOAgA4JQvTqTgV5jK5TLFUMKY5dUK/SQ4zTFN7Sa4d/QZaUGfbCJGwhvxzVyqFjIvuCEDVOrgGFYztw3iVAgBrnjHlSFPqkvbb6kmjs9I9fX1rdUjfXOwC6ELQyWEwrM3NxauOIvo/kDVqzXWLK61pwVUx18BwcPEsLY60SfPX48KFv7DmxxrtozVwMSqvZtiVCkllBQDuulK572GYHyxTvQfvPuPx3jygdFLlLd2jdLp2w4bp3BzC3KCnCN25IQAwSYe93shXwIMUAgDPKCas3I0NWMO75PrH/f7a8KrqOkl7vu+DS/scXaoepzTX9Sk8a6XPkfa8PXQFafbLWQCA58btc5kecp1uQUym4+pFcWrJa932DeAaLMIGWHeFetyh2/+LBABgAFLpUKgmlApzzYiXYpoNp+glOcw4TY2rquFNbhWIZD5yYzOAOSyGtAsH0qbMo/a14IrL7r5JAQBYqW84z02wuJMCgG5PypiV7unr+03EXKgBfUPuaKy7YNVaWI851/hz1lwzuODS1vsUBtDDlt32a6605jiDcy79ve6KSzn/7IrLgG/IO8w5W0o6KwBwyxUXLMOY9yR4FrfJSLP3xkrpvAIZNJxn/dITrz8w4vTMFXlGfT+lCxfu0R0IPW3T+vFxmF4YFwcugb4BfJZ5V1weeR9us+wpSnO+NeSquhGXIBT1ELzFlc714xSetdLnSHPeLAG91AFAA6BSKy7FLkesr44pKVi/mCvpcZ9vDPcTatQj8W+fDLEFROIAgHEjlW7UhbXj78AibYhIs+EUvbjubE5TwzDMAf3uNKRJWumNPvciupyUQDYJzz0H4OywQgAQlXLUTSAgCQDQHPVRT3oZz0dU3zwXE8aGP6DnGIYNqgcYVls8CMw1EjtDc90IB/Sw51vinsT9tQfjW3sW2c1q5GbAxZmD92a3Md4ol8l1qdygrADATQqZtRBDW8OLfJjywdZlgFCrb9RVYGCeg8sLMvWtbBFf332UcbEGfCitorkCAM66eFnehA34XnhpmoD9Pg9A4SjAFblL6cnlzDfqiCgIwMO/3hVXcKxkrh9U+Kztzl/iOu5zpDFvr5wtoX8vCwDAKQtjxo3Duk10gdtF8xZVvQhdU5Z7khfnOORFojHLgbvUZ9TaYwIAX0rWlPNXj3tA8SmMl44BWFFkvQg39DgAwJemtkRzpaV7Q6mNja60prnlEkYCZb9xgFUCAEKpb5OElnXDJAEAg3BgzcVI94zb9zAAOj5MX8PGmgG2b7uRfeK7oWP/cea6PoY3B93D0wRA+FsP0U0JOQZTtN9exwiN7AW4QVlyAJ64YqEh1D6YgMPUymKacAXdDAahcfueN/qeTalv9Q5h33OQimr1zambuN8tz22/YRuQkGZ5XFAhUgH4SMz5Rh0HBAFx+vbN9VRE308of78f4vi+Z8VMAstDYz0HpsZjDn/Uu41HPIvayUEPxyZ1AMC5qdaNg+OJSLzg8r4/ACP+lcc9iW5VZjIj23IfCDJvCIjgwRQFAKJSskIlfVklDfUSFiFcoWl66/BBowBAKE2NAUCc1EbLIPhQ/oDhLagUACxHpBxhvKwLbkNxAcAYzPtajDlJGl7o9xxcPjKpb91ZN6okc/0kwOfYpt9bIMB+ZOwTLPfc5AH72wQUMXQxT6GR1wFuUFYAwFLQ09iqchcwhVk5CyuuUDp72gChz97ivn1r8MggEPYbXl5OS8PwqlVcTQE4luf2PTfqOOBB/SzjvlEILWlKaiuF35L8XgOlEUa92wq9m54ZCwSgEAQ0ZAEAuH483zhytOFngZCirlaUBP3Rg6LWyXiwy2PEYFvuGLFPRLUaj40CAFEpWYjqBmBBNVIq4wC5TNeNFL09GWuzDACAaWpqNF/T/wulNoYMgkUoShMAhOZ5m0gzI+CSjntII4pfp1S3zZQAgAVYfWRS66Djny93rh8aWQZWhs4WxHd9IbsRIokyd2HB2JurgdDItnHDRK9gVgCgziBWsYjOFrhVd8mdvuohbbW8xX13JFizr1y0MM0EXIIeO7u8OgLwzYjnXoCD+hWQ9bLsG4XZkqaktlbwe42uuIpnOe+2BZeZOVda7v1FFgDgbsSNYwtSRvjw7XbFkqCqrGfFUdhwoTdhyCDEICuWb8NsuEMAYJsO510g13EqDB9OTbR5R4xD6BDACcZL94yYbRwAgIfnEfS9D9kQSQEAG4QsAMA2Hfr4DodwsDApLe4hjbHSHDwnxvLLDQHEWUdxAMBuSnN9j4hRVp4/eiaWKIWTdQIwdhziLhwYnr7+QC7zJowzmDEAQKM6aLCqd4m7gLyFfUjbWnSlCppva99x5ppBYEiaFt3OdUY63AzYvh2ydaylsQ0H9SQ9d5Z9xwEAR2UCgKMYACDJu/GZcQCXRwQBqMKbOgBA1qKPuLdHN45p42aBuZ4tHgBwQDHtSXCPMPlKx/IR4uIY7gPI50bXvxqxAw/HYRBc1C3G5sVDyOofb8KHCQDAGvWBoGfdFSv3zUQAABV12vG4BNMCAK+BOGbNM7LdrbS0OIc0Hv6cGbICoaThhCTAtACALwRQ7lzfcba89Iwnzrti8HVQKfAleOraPAcve9jwVo+ePHYbM6BLYjx7EwCA54G0y31gVGs68SaEDw8JhPLcvK19dwTCrDueNYtqgZPUUJbWSuNeINu3S1yRDXivAyLCYigqy75rDQDivJvFsdmkv98kvpt6cFIHANfpxtFJsVArtjhnxBaxQFCLx+AdGG78YXBvrrtioZv5CgEACjYsuWLNd4x7HtBhg7KboRTJA0CjqLO9RKQq33Ojx2Waft8iAWK9BE4Z8ZEAdyjfN20OwM9wE1+leV52pcI0TKaLc0gvGIe/dQt4Be7RxhQ5ADsJOABHKcz1zQAoX4QQ2QG4DXcjQLqmSfkkf63n7jfSmNhtPEluyijjyfMYFwD4lDbRG7IOlwZNKWY9jQ3Da/G29h0V8uMwFAvTLEJboMPG4opwDvsGcUUWPXnurDGQZd+1BgBx3m0TeFHzFA5iG8Ie99QBABa0sYQl2L1oTToXCGpJYPAmCGgww7gSALBLOZsTwMJcoHxsi+PQYQCiNSOuvkApcJhWFSVq0w2pbePGfLHHZByyJlg0IuTetbIABlLIAnhN7v1pmIf5GGS6OIc0gjW8EVlxQMwJTgIAfFkAh3SoIjhkwuW2J+NiKGEWwDUgE3FespXvvwkhrqgwXRzyIgvPvAy4jYcIeMUNjYwarPQQAPBJ6ObgBo1pkZOG/Trw7MO3te82I9Nq2xOyHTL2O3ocfGJUFlcE01ytFEPmjrHHMsu+aw0A4r4bc2xmiHh/YHB5erMAAFgWFKUlLQIfvkCoQFAcALDgeXGeoEoAAMdiB4CUMRsjF/alh8zoy7UegCyBuEJAbfAOQzEAgIoNYa10TRFp8RibvQDBC3UAtl3lOgAjAGjiuNLjkAu34fvvGIRCZgI/iciZPaQ0VJwLDkXte3gnrS6e5kKof99c+0C5T6gLRUV8qp1K1I0TJuLv3uOKK8yx23gI0qF8xvNn41AaA4LhSgQAiErPWoWMCEwPjbMP39a+Q2vwIMYa1zCo9d3Zm+i7TMwZbdkTkhqrQt+1BgChd9szvN/9nvDykYdLlDoAuOAK4gVPnC1xumIgy1CBIJ/cpcUBwPhIjiYoTQCgB04o/mm52aK4DJYbOS4AqHMFNcDuBABA3X/NdOBZ6our4DpH99MiudZUCfBnV7kSYF+KAGCLuAbrBiuac4Hvixs9tFl2DTcjKwGGUuqaAwS91wn6t+YaNdKjhLqOPGEs1CvAVF0rTLTtAecDrlRnfpEaK3OGAABnLszRnITWH5NxVYNjFtzZy5Q6hlVGQ/vwbe3bpxURWoOLNN8MVvVSFwcohhrzVPBbZtl3rQFA6N0swPLS+fVEdhPY4bIBwDlXqMf8KGb6UVSBoOaYB6eV84836inDFbZpMJzLAQBxD1oLYTNSxZ9PAgDQ65IUAKhY0WM48Hza4CxRu+UKmgWbriA9GtKnrwUA0Od6Q3F/VEdDIQ6UG70SsVn2iWiE5MtdAIWs1Y3EV97sS8R5CPUfmusr4pXj2uL9Hu8V366ZyKru/xuBW2NUFgDyD9RtvJEgC+BnF10fYT9GFoBP3EXXcY5SRHfBe+nbh29r31bmFhcR4zW4SWs8Z4QKeqhf3sf7xnNazfcts+y71gDAkvDOubCeSE8KXKyyAcBxAZ+LrlCwwko/SlogiDUFFgzDvuzsnH817pa6le/QTXLgJD1o44YyBsoAAPcrBACqNHZDDo2o6mB7QErE1EJk3R6eEADwMxi/fTqQlyms003uf63jEPXMOUq/wmqA+5RlMAEx9VYi6OE+UcIPV3FMMtdalEarTrJ6H7sWfRyWTgBGqtPh25u7EWGiGcNVmwQAvAGQeQCGfM/Fq5Bo1SzBzBCstIjlUXfg70MH6dvYt28N+qoB7hspZxsAcON4ct5An3GaDwBk1fdJAQBxUjN7IQRcMwBwrN1/XuKOvvSjpAWCmPlqCaVg3Wusca7uS5+CoOWOrYUH4CAFD0BaAOCahHKeAK+A64Or24+Fi7A2+EkCAP8OcW10mfNaYXEUJaPeifHMnLKJAlGbRpYB6kM8dcUV9VDgZcUz17mYc20VpWl3/uJDPq+cpdTZRDnK6IVDzxaGibiIUSjdMMoAbsFNlwW5NikU6OMAoHLmjpE2pu70ZXjuuHH6t6lvaw3ifte88xwBrxxkj1jStm0uWuhqM0GLAwDS6vukAYC4HgAG9lUDAMfV+866/xTwiRt3jCoQ5MtJZ5b0lrMr/Y1C6GHDILFZua1xD5yQfvtmQg6AVazmpAAA/XYqQTkLjHp0SatU73JKJMC0AMBrSpFiLgDX4sb8f+WiJJUvRololhxFprvKfqJm/ysAATjXa8ZcR21yJf+1AgmvzxVK9+Le2I/Jy9FaHY2ePGWuBbANYSIESoeQprVkpBvGMZ7WfLM2+gqBC94jGJZk+WKNsc+4+EW53sa+cQ1iuuYE8DVWwG7vwDrUMTVrB2XQm2JmiyzGbJximGXfJ4kDEKXG2k8X2Lik3FQBwOf59q37Twnfa0bcsZwCQcwj4PzlI1csbbtGxD/VyF41DmirHkHcLIBBYOlzWMPK3c46CyBtANBAWRyoQoW13OepzcXIiKgVCXAJbk2o2xDiAygZMGkBI5wPTRsd9mQZ3KWDGlPlxl1xoSjsd8YlKwakfY6CZ2yWADUDYyszR+veY4iPlcqwGuCh4TbWGyuGYcqpBsjzPQsgFQ9BVHlrDdyUGADpJWIiAZv+bexbPbZaa6ATsonGyGu5C16oTcNucSE0H5nNkmS3mq79GVcqMpRl37UGAKHUzD3wXjLHhkmcb5wt3546APgk375y/1nE54pMYKUFgnz1ndHVeASHm964FoGlumakf616AEccHQAtsGClHlq8Bp8OgCX4sgAHxqTRf7UAwDNPvHHdFQsi6UGkG4k5AjtlHtRZAYApyhaJywdIUsIY25gr6CRYJU21+iWWedXbei/kW48ZfceJ8zGZU9fUDNzs1sGo+/YhanNcEcIvghb0Es1CbBrDIj/DwbEFHhmUXu4FwBHXeFrzPUoNNQZ8IldHdGhotbhpiocnOaTflr5vAFcEQQB7d1bhu+57DhYuhd5qkNPY+4mlhkchTRRDEFgxEXVjsur7JKQBRqUHWxybWeObb7tSOefUAcCH+fal+88yvhfBsFVSIOixx4ihotsRuBs1NrgJoQG8iXD6F8djo5QAdbFoKgwr9e0HMhs4B3vJlUpSotIgxkujlADTBgC+xbtD8fRVSD1agxvCaw9K7TkBAADFlUJ8AHTVJxUC0vZKvnkXGMZnRpbBTYrXN0Osvlf6wX7jEn0sDs0KfLN1+qZxS3V/B0TfJmIgj4Hredn4bug2tqqV6XhJjCfPdx81XXetETdpVuTECnub4HW0RJ163uK+LxsgAG32GAAKFOXyCT6ppPvdGLYfa6jMg+dmAQ6yHKQhoncqy75rDQCi0oP3AhybDcrWQjscVT+mbADwt3z7DMiAP7nKCwQ9McgpU8Qj2IUb52tid2KBnR26xY+54nKyDREpJXx7Yd1lFJexYqgtBvkKSTyV1ALICgBwWtAGcDf2iWmcgwW0Z/AxNE5VawAw7opFdCw+AJP1kkoBq9Z2hxyOLbKOGyDd8pYQZi8ACFADXO8KFffa4Bk6EzJ9ffKxO0AsRF0HXyErdP+flz1+2xXXK+9whXrlo3Ab8X03dLla9cqTGk+dnzYA3Npa5Rkbna0tskFporgPN4ll/zrwDG9r3+cBBDxwdrGnRY8HwFI9VQBw2xXrF4RSDLVU+SqA0y0Ik1qe1Sz7rjUAsAj0SxT+9nFsduEs1AykuHa4bADwl3z7WMiA52RBVVogiBUFx8F9jjn/G3QI+ZjYePgjU/W5GLnQgbMFz8qpXpZ3IWk1QKzchf3vUSpONQAAci8G4dBUj8c2sMYPKUUoB8h0HrI71BNSawAwFABgqB6J6Xq+vg8ChK0mILLWy/p6KAfpDTn8f5Tb9AXI2b8jRviJ/N4z6afJxauNEQcAcBVLroQ4QMD4oezly7K3z8hauSNu3gY5YNtdoRxynPzlfsgVx8P/XsB4HgSMZ5PMF7dGWeOPAyHFLWdXzjyAG9eWC9cjeFv7PvbaqmgUl5BmoSfkADCBkzNGbrnSKoZWiiFWQUUdAyzCZlUyzLLvWgOABuPsi5OKzd99NYEdxvTRxADgT/n2gZABvxPjdt1VViCoweP62oRbvcb9VwxW8JrBxB6Fw1+ZqnVidK0DJwfjbEakvyHAYCPaSB+Uaztve9LINlyxwmE5ACAHB3McAFAHt7peIKQpqXIFXP5bEHZZJ34AFtfpBJaxb+HFAQC5BADA1++IKy4claM5sm6X3DemEFkAQA/9R7K27opBvCYH6XkxvF/KfjkvRvgnMcR35fcegVegxRMX9KUy+QDAFoTLNpxdCbHDyP1XwPKFPOt1+btH8nw+1jfmo1vpSy/AO6J6FJbxxHe1jKfGnbk9lD1yxxNS1JTLTdiDBwDAc3CLzBHpGG+Nb2vf30HY9oFxYUNbsuVJ/WN7pxkjUSmGnOZ6QJeJLbi8cbpuln1HAQBc00kAQNTvKQDgdwulYuN74aVX9zVmIFl2WEODmD1TFLqNAwB+n2/v5dun+fY1aALEKRDkqwve4EGieMgvQmx3zmCmz4LrV+OF3WB46mXCbxPrcsmYkFD624LhXWgH78ITcOv0AGlqBmI3vjSyZVeq+T0ZAQCQuIONy66+MACA3uqaYQEOgmtXY7w6J0vAjWDme6iynrXwFgit+r7HkvMXt4jqt9/IbPAuflcqab1AKURzRtxc5/SWGMJrcsv/UW7R38rh/4kcqN9IGu0FAQg/ye/dAhDNMc+oSmzPPc+ua2oJMjq4EmIz3f6vCMH3K3nmH+Q5r8vB+hBSA3vJy4VlfxeNG6OSDNU7ctlwf/Kcz9MewIPnFrWb8pxXAymX87QHEVStUqrnGux7dH+/rX1/Cxe2++R5xfTtZVg3yp7n1L/nBBofgi3xpRiuGgAP0wzn4YBWgm5bxn0zAOAwA69pLmpX7u/pGo6TmrlK33zDSD+edKV1Tho95GDMnpnGi2wcAPCbfPtzvn0khu2si1cgKFQXHA+1QXh5POBnIO1l3GijwMTWwjdtgq708L8jixVdSdaETHvS3zSNhL0LmEv+AOKl7Ua8dCaQ1mQ9yyik1d1zpVKvo0ZK1CygQY7x3oEY710DBPQAAW0UMhWmoCkbdQSY752U9hZn4Y0CUPN9DzU+mBKUtN8xzxxNkxeHme6cTjRu3Jwxbn5JDvZzctv6SjxlHwto/kj4M1+JMT4nP3+RuDQYRopTi73R8+xTsJ6nXKEQj1UJ0br9fyiA5Qfa4w2GlwvHwvF8N0b1jnAa6gS954QrrWT5FIDsZWiX5PnPe1IuhyGrZ47ABoJaLrQzSymGb2vf37jiWi6cvj3iiks4TwGrftBI/UOC690YKYazcKFAgDcHRNER2Ltqv7Ps2wqHqC2aNtY0eg+aK/i9OvBWhd5tOvBufOl95UrrnFjpwdjUhv/9LIsDAH6db3/It/fFmH3r/AWC4tYFf0q/M2SkRI0CkajfaK/kJbqAkPVMJhoP/0t02x0xJsSXkjUKN0ufd4FJUxgvHfIAGAUv/CzDtGDRy6LiPf2elKhhAw0+pBSv6wQCXki/L11BTGZAnhubVhjsI+Z7o3z/+zEWHr5b1Pdg4xO3XwRgI1GLn5juWnUL2wB4IZo9cfNv5YD/Qm7Qx+Gyv8qe+Yv89ycCDM6IUba4NM2UJsjP0g/PXWc8O5fiHYLfYbB2Dw7lc3D7f88VdD/44HhO8ztstAFXqrVwFzxQ37piIapXxrtiaiUqN96Wm/4Pcgk5K6GW72RO71HKpQqo6BobN4DGGKyTMWroNXlb+7bSt7H2AJdwHgKb222k/ull4seIFEO0Udbzj8M+V5vSBmHbLPvm8HUHpeZae6gbOBDl/t5jmT/fu3F68IRxGRmjS28nHf4PnC0Qhq0XzswXcQDAv+Tb78SofSyLCgsEIbEhbl1w/B19eeuA7wZiA7cOmdxmmYB6OIxuw+F/Dm673UY6Ua8nJasfUo1C3oVr4CrVeKlu5G4PgPGlNfXSgr1BaVltkEJmpURxPvo9WfCa4nWZQIDqyKucbAc8N7YumXOL+X7PFQoNxVl4bTG+Rzel18Xt9wWl2QUXP3yvNum/i9pLV6iq2Bi4OX8st+f3xFv2OwHOvxMOzXsCBD6Wn1cuzTW67Wia4EvjWTphXTw0nr1b5kdbNzz/CwJrN2X/npdD+XN5vj+7gu4H7nH2cnXRWD0Exl8YN0YFGnWwR3xz3gGA/gmtY+VXfClz+bmEJzHl8pkriA7hHmSg0Q97nxuW035b+8b07evgUXxONgrXjAL8VtjnGsa5Ljb1rCfF8AWs354AwOsnkKE2Sy9vWfZ9FcAQekJ9a/olAYhyf0/3nS81k9ODB4wLAH5ftEv/lX78q7T/5Dv9p3z7NzFkH3oMGC5eyxj1AOu6xWP0rAO+FZj23J7L7+vBr4Ssm/KRL4rR+fpXp39O/5z+Of1z+uf0z+mfxADg3yATAPUArsLt4CndJK2GN/WH4E6qtI9rdDP4WLQL3svomZUToWDoewJDihD1lsP5y20CghCV3obccb2RHYdc/phv/wrP2uzJh7Zam4zfAu+haPEhEbPOlzEG9v9CfrfB6F/T4r4XF3g57xJ6hhb6Rln1X0epfZrfz56UFlfQvPd5rVrgVl5nEOXifA9+tgfGjanV816YP/9Y9vl/z7d/lv1eyfou6b/Md4nzHVvJu1HOOKrboDoIn8ne+4N4cf4h3/6fmM/T5vyiUD9RuPC5PEucdytnDh9W8L2+JQ2Bu9JfHaytFkPLwlrnTRF259sK9qxlg7AEOnqCK7WhL2RuGyLe5SKca/ch00fHbvXYhw76FqF3Sfo9HyRdPwgA/iCHqboGkQR4P8KlFMc9eK+CPvDw1A/whbgENe6a9jP/Hubja4ixcTw35OLuCriHzspB+ZHEkH9Lz2q5wfs87m50BbNb7zHFgpOO0Wu4mkPCOAoCynmX0DPwN8qif/1WePhzRT50xaN7FsM+ryDE0QkbtZzvYa2jRxRX7Pa8F3rjGmWf/08I91Wyvkv6L/Nd4nxH5jeUM44qIapr+0vZe38WMPTPAo7iPo8vDHfTE0rpjfONyny3cr/XecNV3UChm25P6BTXeVcMu3O+gj2Ldhrd4hYXLA0b2h7jXRToPYCLQTOFL/o889ZHY/neJen3fJp0/bAQ0Efk+v8J2IzPAqSSOAShKGKKrw9rA58DUpAyr79P+Zn/GNBF4BzPwRhEPySIoCLbp+LJ+AM8q48AOOohvCn3YsAg9jTSAk46BhNeoqRx1cNRzruE3pG/UZr987e64onZdhIZbwRIWahnPwYEpVfOL5YT53sMBwhKyCy2SJZDkMnxQvb5/8q3/9cg/OrtP+76Lum/zHeJ8x2HKL2xnHEeE8HwawE/fxXw/b/z7X/EfB6LiKsExrtGynCIrFrpHD6v4Hv54tQdQN4cDKxzfZ7BGHbncgV7dhjG6Y/IBquGDb0MXh7kbb0EnhvaB653MUL21HqX22V8z8ak6wcBwPvgRv/BIAYhS3vEkwEQShGKSk3hPgY9h6emCF2UQ/QHMV6XUn7muMqIobRDX4rIDQhnaFrWn1yx0uCUkd4260l5s1J7LHnWu2WMgdkdnCL40mCnKvGsnHcJPcMY5emn3T+mZd4IsLaHIPVzGlKzsNLfLMxZpd+Dn+2FKy3lO+FJs8TiKMc//9/E1f1rALjq/r/kEZIJpXFy/0nfRee1P/A7XA2wvcw5e0paGQq+3xNv3/8R70icdcXCLNi/lTLtS1etdA67YD2V872uB1LxBmmdzwbWOacUWuv8WgV7Fm3QGBxiPYanuFIbOk4ZSp0GcL8ON/8mI3NLi33NkH2Yg/TFKG2bB2V8z6akewMBgB526kZnNqnmaQ8ZwhJRIiEPY4hTYB8zxuGJyOgWxJ2vyOK6KX+X1jP/zZXWRrjj/LURljxiNPiB8KZwhVKz/upKSw6vxmiWuIdVoEVT25KOgYIzlkhQl+EKvVHmu/gaC/u0ptw/CzNhDq8vb1vX0qorFoBag3nzFczBtLeo9+Bna3GlAkGzrlRsioujdEiM+x+Fb6Jk3y+B7X3LFVcADQk5Wf0nfRecV60Rwr+jEsdYjrqcOdOCSNflwvCt7O+/EQCIs664/1bYXz7RtEXP3ko6hyxV3gmhqaTfC1nyePgnWeeWqBDbHbV55e5ZFr3CSyKDgEps6CK9i2/P4jmgh7/qXUy5gsAXCjixbVB7GlK3Tfo9XyTdGwgAMC9YD7tHhC5R01hL+qoKoFazYplQ1ZUOSaGivCKWxRx2xSVGn8oGewRiC5bsahrPHFUdkSca5X53XEGtaxRuCk2enGklJCE4WnQFidBQwwqKKOOLhw7OX5Ixdlyx5GyUQhV6asp5F98zWJKbafVvSTOzipel3IbFnnap+UrmDpPRrot4D1+dAp9MKb6XVeUtCQCwJIGj+k/6Ln00r1ojBL+9FudCAFDOnMUFAFHrSmueYGlWVAy1ZNNRUrmSOeRS6Hi5KOd73ad8dzz851yhdgiu8z1Y52obUFaY7c4L8HyWa9/YBlk1YfQbZGVDO+ldUDQLhdsUxGJ9G5UyVtuwDe+CCrQD5PVO+j2bk+4NBABfy430kkFk6YTbBlc1wip6C86uRa6xEksKFau6cZ3kcVdc2/05sNyVDKWFVxqAIJTGM3/iEdh4Bu7XYVda6/mNK66OqEVpOCRy0yAkWR/vwBVKGltNixlhIR88dDi0kXQMq/8VmLcRis+q+6qcd7FaEgBQTv/WgWHpeKN2uxZn0WqVXGBK/9+u8T3QaD8LvMdhGQBgF9ZfVgAg1H+Sd+HDBgvjaHVHLM41CodKOXNWCQDQdYU1T+bBPuHax8uHVTjtTZlzqFVNfVU6y/lej8meDZJd1sMDi6ZhpdYj+XcsyYuFuHoohFvuntVx9pxdFRZtXBY2dMh4F19xOK0LgwW7DsA2HMJY28Ya1+/5oozv2Zx0byAA0MP/mivV/+8hI6i3DaxDvuiJe9e7YpEbRppoVLF63pIr1kXXFIoOEINpBCYxpmV1VPjMjeARwdQo5jEwun/tCqU9dbIxvNBuEJLOC/j6NOLjbbviYh5b4M3YhU3qKw3bHuPAscawSgVvu+IqVRif1ZtQ0nFCLQkAKKd/PjB8lby4epsWtEKdcp2zPfoebLT1RpE2APg5YCD+QfQ+TgIAGDIOGzWaWgd+0bgdtdYIAPxHvv1fV6hgumRcHJ45u8Qtlk7/j4hvFBr/CC4XGBbrozHjfq86V1qlcMYVV6zDQ573DVZBZbs9RodZXZl7dhtu0YcuunJruTbUehffnn3qbFl8rE6KlTqxxDPOG19EJwlsVBUA6OF/B27sVgnLZTisLZSOGxVdwqhw10du1QVw/+EBjZOCKlg9EJex+n1VxjNzv2fAMN50xVrp3cRjWIdDOAc3GKxRzZvhHhij7wRwxPl42JbBHb0NIIArM/ZDCCLJGMsQx9oEAIV1qtFT0wXGNum7hJoVc02z/3ny1MSt5b0JYRHV8tZYHRpQ9AiV8x5pAYBfS8rbb04AAMAS1TxXG+BStkp/1wIA/OwKJXuxKuIYkQGtg2EN5u6oAgDwH3BorNK67SnjezGZlO3ZEXgd1iAWjwWKEBBb6xy9quXsWeUfrNPhiuEh9HSWY0NXY74L8j3QC8xVbg/BU6Hx/gWwD2tgrxWYrBhgo6oAwJK6bTM63ICYgg+lWylPGJPHtJIxIACtARrTA2aGfnaUiCahfuM8s69fFBVSUph1MDC40EWwB2PxAkL9fqzRHvfjaZsGoo4aGd20uHixdHCSMaaByarxwJyB+KfJC/CsjHcJtUkKNbxIuX8rbvkSbv8YY38Nt8BlIPKolvcUhbbwmZbBq9UHOeLVAgB/kIP/L0I6rRUAGANi0wYcNnzzGodDpD3mTTIrALAPXr5dY391gxey13MwcB9J5vBncFfj+sPbdtLv1WSQSVfgIrYPdnge2OtTrri0+JbnMEOC2vMy96xmICzC+fDa8MToOinHhs4anuhDg+/RC54eX9ls9tLMkH2YNuz1rsdeVxUA3HKlxW4wh9ViFS4lSHnimPwcNau065KzK2FNwOaO6tf3zFH9orb2ffKIWAeDLv41cFdZRr8D3ORabU41AZK6UIfhvZdh4x640tLMXWUsEO1/Ar6PGmy8CaGnIekBPRSjDVLGwbMM+sfCNFxLfZFc1HwD0xzlQQpt4U2KiTshQlvoMOuAlhQAvC+H/sfCcfm0RgBA19I6gaotI/baC6BMM4FqBQA2IZaLoSkMs6HHdI4OhhyEAsqZw22PVwlDAeUcGAOeNYu37EnIPcdUWN9hxmXLm8vcsyOQRqn2B/chEzLLtaEYKsY9y56ejggS7hvj99TGDJFHcQs4FZsekmzVAAAKgHDN+2mZnCVXqNO+RodqKOWpgRbagiuub43xeM515FrY1geP6pf7jNMvFknBbIgez8GwD0QYDmWwmwq5EagJkOTj9btCVSlcUGkCgB7ICR7z3BAsL0dLwnFeBZp+Y66IlfQQCLUuV1yYhlOqLHCFno8+cD++Mm4FmOESh9GeZJ6SAIDP5MD/Sngn30irJgBAspQVUkJeiZVOdidDAPCPgb4PIAxmhdn0oEN3+iKEjQ4g7nxYwRyy63iViHdJvpePzHxgrHP1wOmeeWVwHA4CN/PWMvdsL1y45onsmjOyuJKO0WPs2ah5iyLh4trQcsUDYEvx2TDLoaYAwEqfGwO0vgYPnIOUhh2KEc15XKrWg+0CUWIJciJHjRffTfDB0+iXy6Syu2yGDkMkFm4AKAgRhlAT4IcEHw+VpSbhYN4xQgAMPMq5cTLo2YBYVzkkPXYHh9oI8Uo0FzctD0A/5d8+pc2Na8V3w1GJ0i4yqIuuVHditkwPQGiO4gKAbwRo/iBepwvQqgUAMNSnh/825SgPQ1wd86+1Ul0WAOA3Qo6MAgB80C0agHnUAI67kFJXCQDgUB8TppN8L58b+3Vgnbe6YtEh5A34bua9nnBy1HfrcgWBHd9BWwkAQLle6yYfBQCs/cEhmnlXLJY0BN4Wtg01DQHUGelz6KrbAffXPuQ2HlD820oFSYr+fC9e6QdP0i+nQ+Ktlt1lB+S+xHixjzDEmgA/xnyXeWp6yGxA6MFyzSchAbLxVLfmuOEm2wGuRtLY9lyMNu1KtRSeuPQ4AMwwb0iA7sfAS8FlPUchxogNXdtpzlMcAHDeFRQzf3KFMtfaqgEAVukWy+m4yPWwFNguZwAA3hNexB9jAIB1CoFxvJvJfxwuK5cDgO+2CWS1HIUCknwvXueWTbR4A6hzME7r78hjT5PyXQbBbT5spFMekW1Neh6ovPAIhTPWAwADAQB6CZkLZpGEkUMx4WxVWuQ6VZ0E+MzDCEVX3Z4rCJysQWoD/v0mxb1fleHqPAkA4KqRDtlruNw1dVE3IS8GSxOg29maAFHvsm60TcpLzxlpQuWQ89B4+m7EbyrY7Gsxm+XFiEsEi2qLBnB5RsYtyu3YDxyZyRgNZa5bU5ynOADgqoScVLP+ntGyBABMsvKl4yLX44kr1mD/IWUA8JnwIY51OD6IAQBWjFs97m0m/x3QjRCJYpWCqENna6fE/V6dHqAbOsSfRdyAfSA5CUdkkki10wax9sDwPvYmCENNA8l5FgiN20b/M0Y6NWaDIeDbIbKmpgmvSf8IBpQ3h/VWkOtUVQDQZOS3W/n5KgIz74pV0UKMxu63EABcF8NjpUMyuQdv3FZqoI8whGmSVwPvcgQhBauhK5VFMvrhNlVfpvFsTzh37RHvshuz+XgM5eYUc/O59xgArMONi92b6u6fh1RAX1sgYNyR0jztwloLAYDbcgg+Eu9THbWnrlD/IAsAoGlWb+hQnDU8Mcr10AqaV1yhEmhaAEDb15KF83kMALAEITBL78NH/ltLEQBwqh7n4CcBALzOdz3rHBnwWXqIrH3DqbVvKjhnlo22CqnU+55MD04DZL0HFgLak35QFAzBgCUVrp4vXf9VBQDs4sZFhukdesiNAzt8ycOQxcXztgEAzYqwlL0sco8aAUscyMrLtzQBygEABwAAdgCkzVMubiUegDQBwBswqFGtHADws4unALhbIQCYBgbxLBioUEtCAkwyT9peRwAA1fdQwZpmaloLPQsDj0YRAc6GswW5WHtdw2TfpwQAtF0QYHEuAbjgwx1v3z77sJwiAECxnn2yMQsVAgDfOu8BDk5WAMC3b7YgBH3k/IqIof30mgi52HIAoA9dsRYFe7LVZjNfjqWAlS+HIm2vIXyuHl2UVmfZ4aoCgFZXKmxgubj1QfsN90cukD7xtgEALesZpezF6ThTrlQeGNnyzIxFTYBKQgA5I3eX5UKbTwAAiNrs2DbKAAChjc4tDQ8Az4nvcN4vMwtgM0GLCgGgvkcnZC50AZGxI8Y3LzeH/TWkwlkH15TB/q+H/aGlpisFANiuCR/icoK+2b2Pe9tH/ltIEQBMuVLluQNXnIOfFgCohgcgCuweulJ5beuSEyIa/l95L6upPPMeeFE1XXycuGwKSl+AnetxpcWAlsCzsGWAAX4Xlh2uegignQ65FcOFxap2fZQqZTFIxyGu9zYBACwp7FP2QnKPFWNeIw+KpQmgpLa7ZZAAF4AEiDnVuwHAUSkHYI7A3k4FhJ/FGI1BzIuYaYDLMdqSszUaOgOkR14rvmIdObhZHFUAAOLOUxwOAKb49hNpcdAVl3lO08D/B63LVUqrRGlpJklqZTQMBVQCALjdc4WiYj8l2INrhnd0JkD+S1tLYQoI2hgK2IDDJwkAKIcD8ColDsBrF69gj3rRlildFG/n5VwM9uicW3DFQlSoRaFrEXVyhqlpOeBZSJ9HMJAzyILLRniwqgDA90FDiwHTwzAPff8XAAC4LKpV+CdOvJkRP6fVqHF6UEYaoBLPOAzzukJ2vpUFEBILYSJOkpSfOKQ5DmM8LoPs42sWwo/KAkB2tK9c5yq5iisBAFHzFDcLANO3xox+JsigpgUA+HBacKXKiujSxSJgKv+LZMByAYDV6qTvBy6+xoDvlj/vIf8tuWzUFFHmnD0q5WQBrMXMAmgKgIdKvIJxSgLPe+LmGjJKejEIEf/Q9c+ljbsgVX7KY1dURG0aiIZYSXQ/IrW4JgDAYoT63EHdv2AA8NSFy3pq4Z+oWLPGZS0BGXSrJc1tVyGgIYPEkwYTF3UAeim33aeIVo4OwJBxE8WmefqoBpcELA1HtAED4YdyfHmzDsr8K/kK23KKAMA3T0l0AFjHYoG8CPNEeEo7xqsHvCUDbMVd+wEkN7pwqekoAOBrzQIw6hPuQUxJw71tkf/mXTb1FCY8oYAtV74OQJTeRUuAL5bG5WPW0zCFDhVnX1LGSNKLARMqQ/UMkLSNKYCLAc+iZoaMwWVtwfCCVaIE2A8gJTUAENcDYCnR/RIAQIPzC17sxnRbadtztiYAV5gqRykrqRpcuUqA4wYA2jfi9N0uuRJgd4zWKZuwySXXg+8JtC5Az4rwLSXALTKwS0BcGwQ+wKgrlmdOEwB0U8w+6be3Yr7IIeCUp1cuGyng8f+fvff+jjTJrsSoI4laUasVteSKIpfcHY7p8TNtq7qqq7q8rwIKKHiX8Ch4kzAJe4BMmAS6yV251cqbc2R+kf7FENATr3G/m+9FxJfIrBqOqs6JwyEaiO+L+CJe3HjvvvsAIO0F+ADTdAOrVwo41CTcId8/tW/eC7K3NfLfcpMAAB5ACP7F25KiBKjlsmuKl6i8OuRqC2VZsrb1XApmlCYyxFi4DdU7X3rXfJ6LgaZkeBLhUMkFRBNQshQ/RyDkNkMXqdC6tULyR06XWx5QvPJ1cQC0EIDFAdBeEN3d/1ABABf+sSQvtxKaRghaoHzw164+dbu3rlZ4pFEegCnIccdb25GrrXjYzFoA4vFAl3DeQ6DHaFJRUm6AjwJZH8dKrFDEOyZdrTxzMwCA3Fr7GwAAtl22iiXugUkAfs0Al3h71eRt0RsxAu7nlgavLfYApfbNhW99m8wAAIAASURBVH7k0LX2ejMAgFXx9BTY7aFndQeym/LUvNAK4Wjy53ltNbYRAuw9/nu9hsP/Xh1rAy92Wio7a6lIOGqE9rklj/4W+DUyb3lkiq1noAqleDLHwSu4HPmbGgAQ0j8/IlKZZAFMOb3kpXb4aFUFWTpyCSasXgDQqH67XLbwD2c6HJJ7z2rrSt6wJi5xlWpZxSZwALDql8Q2uXgL3xCaWQ2QXcL1HJxt1F77g/+lv1k+9Mxw1H3AA5DdrMJEXqLU2AUixjYaANRbDTAU8z2k2zdWL8Owj0b8rOfweutqq4BWDT5AveWAU9pcIouc+2a7J+Dl0PD2NQMAoGgbCtGcQggytB5C+iZc9RLX+YLLivNwGVxtbdSjQtoHrdcf+l2+rzYPBgW010MQteoZIBBFjQqxPa+V8Dfzwtg2iF1YVADbScBzpd3mGZzJepwD28NeIbVIE6cBxgaFYjeoQ19SfpcPuUHF/ahJOlplE62Duln99jq78I/G6tfanMKar5B3JG+1LKue9Z7ThUHqyQLg/qUOREVJOcJiKLhBGqHUtwGksXpJhkwEewbtqb85PPJpZhcpYTcozUlzs3KddHlHlmfGW8XvAwDQMn00Nr6MZw2yWcoG8Kv3m4y7rICKxWZHQauhOtdwqLFEdx43teYV1G5bM00CABICxDUqN/hvfPZFaD1oCqfrTi/RvEUZKSzOw2VwufZJW51rvR3aayBtPvd794G7lIj+oo5nWKnseOnFol8CZrgq7JYCYnHOMGtrS+G/sKLkkEK+5joQ+AzMDCsRqK4a5MZ+BAChGy/Wf9+kAZWUBcMpaAUi0xWNyS7BApNBHECuqHZQN7NfrpPNRnA94LKKhQ7ypugdRDINjuDdtMM5BWQcGH1XXFaEQyvegm7aV64xSn37sMivoivOqWD3fLvrjcdtf3u4EIb5zBuabmL6ItA9glxeKYYVkmfmVLf3BQB6XK3UN3JaTijdiqW+UbtfI4flHYs2t8gH2AEDPJ14SOdZW1cFZDyH3zq9UmAzAQCvUVRv/TsX14Ww1vk+7XlZ55Y4D6azWbHzevfsc98YsF/s3QttiC9dPiEnK87OGRWo8MprXQNOOy6rx1J2WREw2U9l2nPMOZB1zvozG2R/jpX9iqmGsmc5ZPn9mYMA4I1y68GYr3zkA/8zfFhoMOOUV6wdipIjzAsMhVVC6SXN6NdSRQyVAkWXlUYePDLc8ylCGbFMgxMYq3Y4x8IM3wT6lgVdgduAVrwlhaiVkjlRpcXbaABwx9/0v/TtmjcgH7vflcp96S4LfgxDqAtdnpjLK8CO5ZklFnygkNuuMo5YOdJUl+8K7PEK7BkczwmBHT6UR6/g4uW55VoBZYUPMNygtdUIj4yWGaRJfzcTAMhBpNVvOY086yXYfQ4nbIJXsQprABsL2mAhOI09f5U9e18B7F/6W/+FOuSFnPPP6iSITgZu2RoRsk8BTuh2F9XLqmIbTsCmHimXKZy3Hno/tD+Hxn5FddhjZc/OIPkcAQDfeuaUWw8eBjygIzh8mMDTpxCrMPYni6nqatXTDlyt7CYeBs3qV0txFFZ/KI7fHkkfrMDtJsX4pGQZ4C20BHEh7XDO+wxE/ttK/1y85YWzRY0qdbZUAIDfJ0UO9hN/6P/GH/w/d78rDPPUZatjjgLpqQhucVkTh7Afjtxliel9f7huQhgjhcsQG8ebQDy/EiCAcsGvOQABO8Z4cCxSuGfZiIvmHUs/zC3vXfw75rI0am3l3YMWj2GDfo/duZZYVCoAiK0H9FYuKe9jPUvEzrAK7FsAAaXEdbHj9FLwKJ37tAF79obft18AYL/Yu784bx+dtx9eYQ1O55w7BE5IvJOiQruReTsg28BZL50uq0L7lkDATkL/clnjPStk6nYEAFjzfkS59ey6rJwhlgVmDXothadTWajriiE9pD45xYIPg2b1y6CCmf1WkYjngdga/v2mqy3XyzGfrcRWgrjtMjDTtcO5nmeUIOyDIhzYPxZvuXuFsWhtw9VqUMT65+9jFYT5mTceP/YG5F/4uOJzH7fsVkDAMhjILXdZGVPaNs3bChAZueBNPePQlNhKyjdjIpaAGtzjc2C4sDAKti0igs0qxLyXdY5lUIljx75/o9ZWPXsQx4Ax4M3A3FtiUdo3qmcOUZN+Dmx27FkPaZ0PAgiYp3WxHVgXXNRGDn+s5/CggXtWijf93O/di0qO//K8/fM6n8FKr5sJcyfAiUHAApC/Zd40+7BJtoHttZCUuwz7Y+3XbToTipSuLIJq32XUIAB45i6lb/mBK7AxMXd4FxYCFjXQBmMVT2BDug2D2HC1IgvrxDpvVr8DRFRidn+NO8UfgE+N2Br3say46BGNLkayC0IiGVxWEg/nep6xBIxpSXlDEY43MHbRbK93LNb45ihtMta/9X0ee7LfNX97+Mgbj785b3913v7CG5tHHjAxCJAbHSp8rVIrwsZDNcMxQN/ClahnHG1KeGJZmTN2xT4HoyIgQMYj7OGiMZ5lWF8TYEjwhlfPWHpgn1h7jb9/o9ZWPXsQxzACN+blwNxbYlHaN6pnDt/QhSN1Pdzx+0EqQPZAevdUjnWx4LLiPHj4i0fwToP37AVg/1u/d//6vP3n5+3P63wGe6JS5u6ZAgLGXa3oT2jeRNHxrWGvQ/bH6r9IZ8IcXNYKsGe/0zNAAPDQeOAUHWBc9lTS4PBh2mBeQVwVD2tcrEVoK5TqtgQHEbofm9Wv9CcflRn+byk3Hd3fHFubcLVCMXhQi4tejKH1TKtNQ5qjiGQMwG0RD+d6nvEWbjyjYISFpcuH//UrjMUa3yQRDWP9W9/ngX/Hz/1N4if+8P9n5+3PztufekbxXW94ZE/IoVmAjSjlX+eozbpLmWBhvA8DYOqAQ7OecXB4YkpZX9NAThVD90gBAcIkn4qMB4EfG5Jnfl7rGcubhL3G37+RayvvHsQxDMLcheZ+xOliUdo3qmcO+eKWuh6+8mTYJwACxPYPQ6p3bF1MuVpxHjn8Rb75ZhP2rAD2i4P/Pz1v/3Gdz+gOfEtr7h4CCOgAr+QIzNtMYN5mwDaMGJepx3Qm9/s5HsvxXUTnYgguHrJnHyIAuKs8UBbvBCCbeZfVD58DFDMBt2cejMRVO2DDsyHFhgePJt8qN5Bm9dsBqU0jThemwEnFgiVPCR1afQzDXIkxFBQ+bGQWWE3IUdKf3BRfAonmVp3PGHZZ1TQ5xF4r/Uts/Spj0eZaQIcotsX6t77PXR9L/NTHDn/kXYcXh/8/Pm//yMcYGQS8BuAhB+eI34zjShuD9x6EAxMB04M6x8HhiYIxbwW6jd0hECDjGYiMZ4y+gezt7w2Jv6HVM5aWxL2G37+RayvvHsQx9MBhGZp7XC+xb1TPHL6ocz1cU0BAm1+nvdRXbF2g3XmtHP5fNGnP/qk/+P/kvP1xnc9oj3xLbe6+BhAgfXT5fT6YMG+jcCkQJUq+TLH96cyxX0fJ9shlsAX3LAIA69aDB9iYu1Q0Qq32MUAxMpg2GswDmKw3hiHFJhNkybeKQW1Kv3/04d+Hfx/+ffj34d+Hf/9/+OcPa0ExvZTSdtXGN9JWf1h3G8/qVRDLA7hdx94V/76VkG1Pwu/zDak38n553gcRu/U+8jeMChHohOYOb+ixsYTm+2ni83DuYr/fiPVz3d9c7vg18dDfFJ7B+mr3Y8b34Lm57r0W9wH4tsK37IG48AC0fnqvdpdVJZNbzx97r8KfeXflD87bT30c8ws/hvt1rOkWCrncIeAeWlexxs/5hWdby23xrp/vp8pcy5z1BNaHrK3bCfvyqmsFPTni+WiBTB3t+/aDlwMLBcmNVhTnUvYVvovctPOuM5k/zeP2Vz4O/jNPjrvm5/UBuKetvdgb+Dnbj0feq4f7RTwGr2mf5R0Deg1/6d37KXObZx383M9PPetBG0MbefFuX8GmP0ncBzieL5Xv3AlhiAK0IcMjL3N/DXUAGuVWi7nZYq5xyxX0GGL+KW4edLuGXDz8+xwjHYm8X163U4q7bliJC9XjLo2NJTTfqc/DuYv9fiPWz9dwaD/zm6/Fz2sHHKID9B48N7eMA7iPvuVYxMXWC5sTXZ9/4mOTf+GzC37ijdyn3qV5t441rblHH+YIC6SEW/A5H5OrGA+wNyCKInNdoPfn9SHFVO4lul7zNnTV3jTcqCH3tuWexXDavcR9he/CbvbYOhsDz+qQwbn5gSfD/dKnxd3MEYKUfocT7Mczf3hq+6Ub0hdHjL3CY1APIr/Wfp44t3nWwW88fyC0HkJueysEhpelem36i8R9gDZQO/z7iLchbTJACP8OzKIUcKOINTGiTYwcZ5FBngPrfyhCGsJ4flcCyYPj//0B8g6/X17iSYzANaOk2bVDHncewlRsLKH5Tn0ezl3s9xuxfh75xf8K+ABdEP4ZArLMJLwHzw0aMzyARyIEKI3gN6CQn/6JJxf+tY9b/hwO1NtEvL0KQepJIjEwlfCJz7HixFp4cBK4NdPG+pCUwUcJ+7IesiiSte4GiFTW90WCFnOasOpcbF/xu2hEuxBhDPlKE0bWzU/94S+329s5SMhvjbWm2Y9XcHg+UfbLKDzD2isToOHAt1HxqgjJL8Vm5VkHnxHgZmLvcOJ+n4QxIBB/VqdNx1S/2D5AG3ifuG+cish1VLSU8O/BLJYDblTaVizVJpQex6kaYvRbSKsgluqBjP6+QMqO9vuowDRn/D6+X97Uk1gK14rThXxkoYznSJmKjcWa79bE5/HcxdInG7F+2EXINykmrS4Zc8O37yHIg5aNZKXaLFOKn5b+dOH6/0ty/X8OB6omxFJPitTzxNTA1JRPfI7GFO8JEIQlu2bZWB9dkNsd25f1rBVM14plNmmpVEVKoULDi8Yztq/4XV5Qqt0YvMei8R4yf5buxq+9N+maP+Du+HmVvRuys/KdFxPsx2vvdXtE40DAivsMx4FjmDa0Qx77d//ShwJSbFaedXAdSHtWal1oPfAYJiidt6UOm26J/VhpiGgDnxjZb6hIiHVUULSN1/FjAQCNFG6JiW1ImcNFQ/hD08lvo/z6ycC7cjEKLINaVIQeWAOA5YU3Iu+XV3wiJuJiSfniQllMFE3hKo8bkfnCin6azGhsrguR32/E+nmtpOVNAHqeB8O2BmPmudGM2XREzEP+twigrCgCKHLIiev/x+T6v0Pgg6VYU4SnUCTlhUsTB0pp/Jy7Rq74GKUIF2GuS/BsXh9yoDxN2Jd5Gwu2PI1om6wZ33fTXRYKWoDU5kF3qXoY21f8Lq1003tL62zTZQVjULPEUt783K+n2x6kiVtYPEohOyvfeTXBfrQTYMWLgQDWVZiD7RxjQKEgSfVLsVl51oFwbUJaN8uB9cBCWDMEAtpz2nTUE2AhIm0fsA18SZcWrbAW1lHBssa4jr+7qAgAaKR0a0xuk+sco8yuVsZWXFHtsDjk7y2Z3iUDAKDesyY1O6YYpm16P5YBlkNPkwW15CdRxpVlgqWYj5RDnYD4Ki4U6++4BLBWAQ7Hg2Uv0QvAuvH8t9pc81zsN2H9sItQKi9y+eIt2Aya2iMbZTFmKOcp8ytymyi1yRKoKH39xrv+fwgkJHT9czhLK+iSKpP60s/JgAvLA8ea9hwOU1gHGM61yGyXlfUhRv+Zsi93rrhWWLIVAZambspyqqgWKjKtqwACxBZ10r5Kkfl9o3g8RKyM15mmWqrJxd70YFJImS8gNq/t+7LyndleabLb7UpoYcRlSzpvQT+8V0JjYLGf6wlzm3cdiPcipHYrctgHxhhQClvzmMZsulUjJ0WKmG1gm3JpQQVckcHnImQLykXldQgASFEBrV1o6F8Umjh1+QtuFFxtoRwuZMLVxroUI4ca+1K8QSoRhm7csqDO6Hl42PL7HbvLwkHbhMhG4COU3GWJVX6fSSUksejC5VCxCAXWr8ZyzWcuq0G+QN4TqwLcN662eiN6AfgdsTAUljXGudYAQDVnk7VlrR/NRbhKNymsunViGLd2xSiLMdt3l/UvuDgOFvrBCmhcFllc/78GElLI9c/lWKW4TQwAvIK9wQeq9HMWadZzYnrxCJQOYX5O6wQAxznXSqjgTay+ySHZKq22ySbYokkYg3VIWe/C74HFj2SdiS3FOdSqb8reRl2HViBYWweSVPXcg4OsBHv0wGWLGIkHoM0ILWAp3AOwRSc0l8fKQcQS6sIFuBGY23Lk5r9vAIB7fr3Vux6wGNa2YStDNl3WxI7i2S24cDEirYyvFjJcg7PwBED4sbKOM6WNQwAgVErzEA7EvCU3rUOc641zTWl2/2tV+rbocB4klxIvetwQuLnYwyDlNY/pQ04qY7HAxTi4X/h2rZWiRCA05fSKX1i1CheKPKsTbm1aDXMue4mH2HjkG/HCHDAAQN527LJ1snn9aC5CPvSP4XCwKj52Gl4OrEiH1SRFBhuNHYO1t2A40fX/pctKr1pV2LZhnv9VIgBoIcM8T8D12GXrXlhNe06sYhwDpUPqLy8AyLtWKrSGsaRqu0urcMrVQg8T1nleAKB5LhHAY8ndfadXWS2Rd+8h8GE6gQszBPsXvZ6HtKfQM3BCdhcP6PZAaAHHcQqgeBf2Y1UZwzR5GCQM8FVgbg/gsoIxctw3ZWXuH0KYLLQerOqxCAwsj2l3gi05ULwAXI6YS2JvEwAtKJe6VQBhCFS2CfSht/L7izVzAObAJWK1bQIAW5Hf5zrHvYSWeBGVFbd8v6stsIOHs1aGU9BZNx1M6/A8NLBLECeZUTwMZ/Ac/P0JZaOdGW5nrSrbvGL8cTwyf9bCwrKpuFB6IW6rHTRW2cu3gdt/bGEyP2MjR9sCg2EZ3/6AgThWDqKjAADoUdYFj1Pc/Ov+UF2n+bcOn37F9c9FhoYMEHjismVD8wAAzYt3DOOItTXyVlk14zcBrFXJTcoFqqwbH18ENnI2+VbapWGEAB6H8+SWL0XM1oHzsQt7+FAB/IU6AEB/wqUH7WgJxveN4alE7wyy2VGobQHW9TFdkop0SPA4R+Fwex4JLTBgWoezouxqy6hzZb0XCQBgRwlzIpjaMwDAY8iSGVTsNa6HXXj/dQgVVQjws5eZbbp2UdO8rVPG7f/I6aWI+41vsE8hg3XwQlQgFFNjRwQAcDGJRaMVDQCwEvibOSI+8G1l1dXWM99RwgBWiV3eqHgoddOHnyf3qHZQa+91DAudf3+KjO6xARRk/Jyyxe7fIxrTOrCr1w0DhYsKeRMtrrZi4nIAdKEXYI7iWafOrpHd7/TylYsJjT0gVXIZprpfj1y2RKm1TgUAsCeBwzd7QIpC+WverJanQnP9x779Iayd40QA0KqA3A0AAHggLUXaAsVorcqWu3AzkprjG8T8XqT+xCPV4o0ylyZezLFe8OCpKGt3kOaED0K8kRXh267QTUy7uY4EDsIzAwBovKJDuLHJ+2tjPFM8lZNAYkXvzCytVV4LyGFCO4jvvACuYnl3JprOKsAHv8MCXdKqAWCUCgC2YK2tKlyobQMAWHuEL4J4Q18ARv4GhcQ1z1a9dlbzylYDXtnuBJLkOgC89RiZWAAAMiMnXFZMYAoWVzFiWLW/m4C8Uk59mFGM74kRBtC4A0eBW5gQxkILlzfsnLFADuEDMRp/qyx2K/7frdwCJxJu90Vw9YS8BOPEVkbXnRVvOjW8AEuJQAFrwndDbvCksR6mIFd2SeFAIJ9hMZGAte/newtunjEA0G8YGi18MwU5yRrXQwMAn4DrH0lUmvdniw60nRwA4DV5eZh/wTcvLCDFjStJdhLwLhrvuu6yFQO5QBXnID922dLEE5G1MmXwWDRAKgd0j0E4rio33tBtDA82sS1a36kAYNVlq6ru0YGi2ZMTBQC8MsJY69RK4B6WtbRO9q0Mh8e6EqvXAEAx4PGcNYBaDADcigCAPTqABdTtwzfgZzxN2CM4v4uw33G9MREcAcCLgJ0NXaAWlFC2dqlDcnEoTXLTZavfbsTSiQUAoDDCkMvKCRaMj24ZVv5bVNR6TbEk7bC1DnQtjn9iAAZMYWlPuO2hMdB+pwK3B0bjM4ZHQov/dypx4BHDbcQLJoUnMAzjfqmwXzXGqXW4s7FHFxaGClAwhNXBCkobMeLeVXJ9MZ9BS8FaAiO3DrfcYiIA4HWNMXH+fY597sM7awDgmjdoDyBWG3L9H8P48wCAtsCBdEpjX4b/a5UrRsGZbiW1U4A3345XXG05Uuwbc5BfQDonFlCx2piSyVJVwlHaTSl0SOM34wtJGeLCO+R+zwsA+mkMa3RIF8HTZV0oGABYoZ9dAhd7QAjjn+/Dd7QAyTABgBBoFju6TMAeSYYaB+CFu5QHDgGAbfrmm5SRUw5kg4T2iBYCiaWO4+X0ccDOcmgRQ7Za6M+61El6sSaUxGfzIQEVU1BMAABWPOvyG6gbjHkeANBHf4+a2s+NeEzRcKuiS39cYbWeRTIHWgH9WS7SEzKy/IwqxDcrihtIe3+Lx/BGyakdSGD4bydmCgy4bI32EAM25t7fIBcZgzI0tqLzLkpx2jrqgVTGOWPxo1tW4zO8VDwni3SYzeYAAKM07xgPZ32I8cABgUZnHNK07rmsUp9mHHbAHSzjzwMA2iMu6TKNa4vGuOJsxTDtEEWXrrj+N8FAbyl9Yw6yXASEvf5GWSu4ZqwsFoscJ4BUO0jKgVu9BfC0wzcvAMBbG7vpF8CTqHmFzoywaIz7ga0KXkNu39D/r91wxZPYG7mICeN8A27NVeVWi5wQrKfxNAIASgBW5Bll+G8aAECtj9GcACBVPI5FhjTPrhZe1Ijs207XDBD7p5Xztjwy+B1VSXEBAI/AgLf4jdkacft8E8kdlT5afL9PA4zMZWMxoUt6KuD+t7QDXsJGsXgApxQbm6dnHENesHarYta1FifClBpNBrZgpNZU4WA4IEatphXA4hq3wQvwJhDP1dDplnILstxS4m0QZbpX8P1Z7nLGYODy4tf4DE9crcwpuq/Hc6xTMeLiSuN4+CJs8lHKe942bja4/tD1jyQhzT1YpfFfBQCg0TyFuOk+5CaXIWyy6XTFsC7jxlcmkLtHeezI2C45PZe+w2WLCqHNaaWbzqgRK7V4P0I01OxL2Qj7jQdSWE8aAABQspWJepMQAplTeAgcn5YLRQgAcIbHCXx3bEdGlggDgKdwieBQrEas3KPDfxe8erMw3wUghsseDwGANTr098lDWjZSMFG4aC7hG6MUsCU3zGXpW41Q+kLgoNeAAdoSJmO2uawSan8OAIDZdN8XFRMAIAVWxIg/SYj7xADAc3dZxOehvw3dppiMFte3YkoaUDhWYjecbmQJpWxRnG8biDiYYVCBeMoeGZ9VxaOgpRai0eZCMOjSwUMG5+JY8QggSsTDmOU178MC7TZS/DR0ikQoLYUF3VLibbgD6wgLCuH4LMOxS65/vjFK4Q0udDIMHJE865Rj0FpMfMKI10tMVWMFy/p7QN4XjNVy2g/O+2pOAGDt0QoAK0xlEq0FCV9gnjmDO4u8JsDiwPdRpdsmplBqHh0paiLVHMXmPEngrRwSyOYUPQlHaYe0FvabB67SdGL8PS8AEECDRaqGYP1OwuG/ASTLUyUTQdbYK4PgzJkd++QtKQG7HVMD2fuF9vQJPM/yWGIq3RGA2h2IRc8pvA50Sb+JAADkFexQOMACAJyjvwoZSto3XqW2TGl7WpGrF8oFC0nQyxTqOwEAfqSEdOXv5hXg/CgHJ8NKw5UL+QMBANe9y/K2N+IPGgQA7ntwcdv3fw0Ovs4As/9UQfiaq72ipMdg/YAnlMIyotwITiGOu6a8RxluSeh+xFg1GpdD451E9QpLwaI85aDiZpYD4kKD4FuFnY6Gjw9jKbDxtYsrebE3xArHaG6pF96I31ZIb1hQaJJiageK6xA9GgWKGT/yY3lGrmMpQZt3nb4m3suw0SYpXs8McQ0YdSoAiGWcOT6KZM8UANAO/VsH9RmlRYpSX8VlhVsODCa9JdYjwEL6PoDb2AEYNY3TIcbsGticr2HdvMp5+19QgP/zQNhPY/fPgReIwWkjAICU8m6n8NgQgUI+/DVgLGvsFcXl3wL7folAzwmF95BzhXsDvV/4rJfkSp9wl7UEUBOiCiGFA3cpnCNzzJlBC/AcCSfGAMA6rDP8hhYA0ESRdsArhgBgR2mcGquVuX5lhLW1FHoE5mVln2DDLCgJaz9oAAB4JhdyAQAXVco+g8OpkQDgpu/3M58X/QAOZUsgQwsDaKk8WgywD5ilDyMs0D2FSLhKaTryc+YFHABZY0thDa8YbFdhh39tuIg1NvI35BWxcv5lzCKr+bGrVaCzZH7Zq3JsxFk5pUtKS96kfHe++Vo3BsujgeRCKX170/eP9ehf17lOn8PNrBuARI+zi2ygcQ55YrSKiiHXP2Y9xACA1J8Qt6mlArjvamWLkQewBymnlgAX503Le/09vfsmGK1NSlW1iHq/BZtzEwAx81W0rBVNkGWA1qQW9ttW2NYbdCtED8/fNQgAPIDLyKtAeuUOHf6sNDkJ4BslYaU2g3iuNI0MXGPo4WR587fKzbxVcaUvQZoZKxpqMrSaNsiaEiaNAQC0wzvQRyoAwNRuAcGn8P8fG2RvPISlkt8rSO+1wjGagNUJzFNIUE8D/o0EADcEAFyIlkhd6WYAgE99/z/zhpxd0tYmRbLOMpGQLFGGHnAZIwnLUks7ogOd0//E1c8kKDRsO4prkiU1ZU6+AHa45SJmdjh7ADTVvy4g49333/ELV1t+1hKt2KFbo2a88aaFgENqenO+e78SP98BQ35ImQWaR0PGc8sDJ3EdP7piqOohhIgQSPAtB41znvd+neDZYY/OXAQAvDXcpswyX3fZgiRrwPyXLAktq4TnSDNoHIoSsp+m66Bl6cga+pkHAdcJDMcyVjDFltVCsUzym4AXAQWM9iBtahdi5hh+45tgCABo6W63KOyniRRtKdkwWq0JSYdlSVi+/TMrfBtc2iUYJ16yNC2IzoDnkLXnyy4r5oUhIE0dVDs7YgAAeQDo1cgLAA4BbJ3Rz6RZAEAIi4+8bQoBgGOjnVJ4l9s7BQA/egcA4Bfud8VRbhubXVOXQtd8MZKfO06u9sfkju5Qcpq1/vCQR6PIH/UIiHF7CmrkDycKaMIBSHURn7msLrWWJ8835sf+GTfcZRW6u662drwlEfx3RrhhVLlp4XMeK/nuk0r8vGqkvKDrvw3Sgx75NXmHXMdXWafCe3miuDitIhucqhh6744IAGIVRzHAFgCw3LPtCsscS8wW4W/e+nFpHiaNGBdimO8RscvK1T91ehEtsTfsoUq9/bPkN5YavkvpkdoaPIab3yHdCsuRNM8YAOC19iVcfF67sEjRicKdqCni4rLS6DLnJSXOf0y2raR4BkJqkN3kTWGi8gm5/DFbir0YnFpdDwAogVcLz4AUAMC58izws620NSW7rIW4bRoAWDNCCjvKc63f+4MEABj/jmkC4CFh/ZwFQPAWcItCDhYzGDkHWxDf5HQ/Dg/su1q1K07XYQW0r5XbeMhFLN4J/v85ZssHkMTlfwteB84+0EIO+G0tyV8u43nR/2+cLXW7rDCbkfSCcdw+iK21QoztuZ+/3zZoncqNTKvVPq3ccpipi8JRw0TCfOL0Up9bxBWxJHq1jBKLoMVlZmeVJvm/w4E8bk3QKAYA8HY0nHP+USbZ4qhot39NtrpP4aNoqZd5qtcxpwcvGnkBwA1Kyc0rUiSHfzfs724jcyFPBsCRi9eD6HZpui1yWPLlBbMAtCySPAAAdUNQAGw9AAB6iYAsYYR15SDeANAsbUkhmUp22wsP6l4pF8xlhVC4Gniu9rsrCrftHzwAEKLYEyVFjzWa+WbOxlOT/uXqUtrGm1JiYcdABDl0tWp+MwZBMJZf3A+pcg8TyH9WpT/WAUglA/4ywQuQJ3e+Q8k0+MR/X6wcZ+W7s9rVErkctXzwTr9wXzVwnT6i3F0udbtGt5xj42Ym3hepWCnkPDby2ncNFedB4xpK0bIMXBFCZ5izzHnc5QAA0FJnWeoaDwtLH1+b/08NfkpIqyIk/INr/qYBRkP163fAziAwKgdSSBkAWJUnhePA3KdpxSWveWL48H8cAAD15v+fBACAJaqkCYStGDyfnUCoFNdyCABsOF0HYDMAADSAvBA4iBcJPE/TBQttkux1K8S8bbQUz8O24Un+Bw8AvqCYdEwTQBZYiATEKUDCGL8GYKM14KbB29Yepf/JRnyrbLRDcnmx2tWIMh8p6X9aoR6O2aamA/7U386Re9CobyuZBhe69x+52spxmkfjOOD615rUgRB1ukatUyQqDhCTepWIkZgKyXntmNKFOc3WIZGnLPK39DNtU4dcnNtKrNzK67ckjbUSw1r52FEjFdGa/y8UbgrHmTciXr9RAti47zEcxaGdeYiT442r6HSxIfY4aN8WlfRiAEA75LS/10jEEt6z6j9gw2pwrABYhTg6Ng0AxESV8NCdVzgmVfAwnCg8jtizQkqAZRdWAkTv3oizy94z+BnzbdSwS0LE7YxwAA6NFuIeHP4hcwAQ+ePNvOB0sR88mI9duGQwl5b83GXFcKyUqQrdtrTDfNLZIkGHLlxSU7wSd126AFBqLYBNV6vOh276d/ltkUCnkRm16oUx/XfWk2/UWFpdVuzmLRivTcrZ5ZrsonPPbRzCAZabN09Z5CqkO+0btyar9vuh0wtdTSi/q1WcGzc8RJp2xjzMgSW0xWJd6JGyslNCt3/2+j2DNfkZEIBfEQgYc1kJVUkBXKBvb4kNDSkxfHHtopY+2ib0RLYBPwZz062/ZxKxjLFLCTFhH0wAXCdXOR56miwxxrxTih9hbRStTG1VyaBhHkenS68FgJk5oVoALMI0lQgAYg33eggAVIxWhbnQ2h8sAPgYmL8pmgBnkM7Eefaa9K+QgMQ1jeOJlbSsEGrGD6CRB7FymxX/R9LIHReXAE6tBviN4n7TJIHf5bdFVnJK9cKUxhXlGjUWrsWANxeNq7AG72O1WeJKMKhNLXWrkQAxdQqzXkLr+RDefcmPcd6FVSD5e2ueOa1iovS97MJS22KMbhmZKVoZ6pjsL3r9JP31jqstBYuM+UXYV8Iu34Q9yAB7hpjxA8QXWXG14jGyFr4MgB3++6Ly98y7+Uohmc65bMVKJgCuKKmByONgWWKc3xhnYZfStecMDs23LlxRNAYAysSPSKkG2EMpvYtGyGQvp11CzyXL26PnU2sMPKzfq6ne94cAAKRMqkbQC2kCYLpeSPr3kb/1CzGN0XeP03W/WcWMD3M2hMhmPzXi/wPwXkJOSi0ChAZv1ul141OKAr3Lb1tQxqTVC89T9503QaPGwtwTFPo5osN/PaGtER8jdOiEWigNUANElr4Fl1bmfHft2/AhbXnmuHIj941hLOsWzXyU0O1fE/7hgxFDUr8i1n0IjEnMX+rNH7laaWYWwNL6kz5Q/EbWwk3DBqX+/YBi317DRQIrKi7S7ZZLAKNnYIc8KiJLPKJkHBSof03FbgM8GJKVsO2yugpo28QDMJnAAdhxtZLISxT6sJQARylFdsNYX6k2aZ3OHy19ddFl6wdIszwP2u/WVO/7QwAAv/A38xsurgmwA8/6O5cm/YtuwF/6GwHyALqdXkFL8u2tYj4FgwX794FUJy1mHisDfOp0wR+uoFdxaWWB3+W31W4JMbGLWONF3KixaDFU9lbs5WgcP29X3M4xt2JMB0ALiVgpWmUAqGWXVTrbS8gqGTI8c1ou/T71XVH4Hnyg3QeiXkiXgrXwZ+km3qIQUn8eAP1aOKYCYbwTuGlqOg+dBolvHzIJdih9TFur7LU5CPw9p599DaHELnBxa5UEcf2sKZ4BPCyHXLZ6q5AOLYCG7n1ZY7suq7RXgXV4bJCY8TZtAQBk/OMhiZkBqToA+5AKWo9t0pQe24hrIoJM2GKhB/79mup9fwgA4KdGChAWN9DcmSHpX8xLF0PwsTcE19yl0IgmwsHpbxbxx1IV+8bZYicsSnSD3Krsiv3G1YrMIMEKhVF2A+ECTI96nwBAQjjf+G9YzdnK7xgAoJypxZ7Wmkagw9iz6L8XAm08EQAUiBRpFXlCkZZTeM9jyoHnEAen1vHhjATJI6XvE+ib1eBwXzwEkh7ue66edqQQxjTOj6SjCiE1BgCYkHkM5Cu8hWs6D32BdEotRTJlrVbIllgCNI8hfBoLa/KFacPwDOCFpRPScIV0qBE0MUvm2FhjGPs/cLU1AxhkjQbmthxwlW8B2EgVApJ9ntc2aUqPj2m/DwLhVloq+RD/pqZ63+8LAECyQt5D4sfeRSfPwpuA5c5EYoS2aFH6F/PSP6JwQ6iudRmeo2lAs5Gy/kZD7QJMrju7Dj2PEW/zQ5QehUayQhuEF/+7/Laaka1coV0VAITGYgGAet+VAYDkB7d5o9odaBrbPkYGkrRILvI0QyCA8921nPd1cjeK94jTRTlLQjwJ3HcZ+sZKg3iLtoi5PH5N9pdB/11KR/1RIgCQ/uVw2naXFQyXIA7POg8WNyLFA2Ad2PswdzEBmq8ja39LWZfo+agYvAy5sEh++0M/txZvATUVysYaE+/QJowTvy0TTy0AkNpSAEDlio2fcQ/2e7ufKwln9EXIgdr+lr+rqd6XYPNCKcNXAgAz4AJE5LVBaW+9kUPih/5m/rGLawIIKzdEjOBbNkoP/0jJOmgzCEf4DD6AB5Rc2JS/0XgJsfnUbkx9Bm9gy3iHmZwAoFHfNjSn9TZOY2vUWLqNOG69bZNYzZLyyeWRtbK3nJkSW/NYDRCVF4XsJCAA891ZZQx5AUuQJVCg72zpJBSdnku/DX0XXbbM8BCAl4euVqHTGv+64Z3QQP+Fh/FfKhwAa22iwNIqEBplPobhZixaAz1KFsAmpV5iyONGhAMQ+3vNlqSufbEJ2p7UVP9kXd3zQOOGy4plsaaCtQ52AFCtgbt+M7JvOLyykXMfajYwZm+3rviMW+5SVfSFn8M2P2cp5EBtf7f7PlodVO+LhJI2XFg0jDPSvhQAILH5TylnleNzwvLFGMwyEDm0tLcbEJf7W785P4Lc9NvkDkRX04LyPI0Y8QqQsbCAL7TGfwBAg1m4GIdfUsaE+tt9Suw+5W84LfGzhPlcMW5MXa5WqW4l8A7iJn2X3zY0P/W2JUpxbNRYML4904D3XYYUwRH/ve/4by91C7hp+e9517zUXuggEID57itOVxmTzIBpijV2wG3zpatVShTWeazvOYhjDkHY4qVyI46Nf1bJ+EHBLwH9Fx7Gv3a6/oe2NqVGwiIc/FOQ/90Lh/8zb6s0rwgKMC0Ri/86XXRS/34ikAWQuvbFJmh7UrMznFHxmZFOOQ7rYNFYB0XYF7PGt+V9g7LWc4Z9jO1DtoExe7tyxWdcd5f1Hh66y7LWqeRAa38/c5c1B+65yzooDCQnYT9iY9nwGo+0AIC/pVu5phg36gc8TUQFyZHX9OhlEf3WI/Mf+M2Jt1KrWp1UuEohRqD0rwjT/OS8/QsCGiw5OgzGksc05bL62/X8TatyWMbmc0Yxmm0KAtdIJvwOne/424bmp942TTexRo0FZZit+czbpoCd/4V/x6/cZblbbI1a81JUCkHAkJ+HCSXfXRqqnI0qsUY5XJ8oIEBY52+NvuWdJ4A/0+OyUsl5xs9r4A3dhq/5dSig/y9z7HesgCdzMUw8ixY4/L9WvCLyzqweJ+9rSXFbEs7895r6Zuran4axTSfYGdZR+ZUHG0+VODeug5nAGpM06qmEfYMCaZN12BHNBsbs7cwVn/GJ/8Y3/Lq762rl7kN2O7S/7/o+b7pLYTtMb+2n74BtyuhXMtK+EADAt3JZrOgCHHCXcp9MVCi4SzlUFOX4SjmQ/9IfSlo1MHQ1DShECosYwUVpJA74zwNAoxPiMyPKc4Rs1Q2umLx/g5MtRio2n2KA2GjGSCbWO7zLbxubn3qafG9xwzZqLHxgNuJ98eD4jTcMn/tvf51ao9b8bQIBskb6YVxj3hBgG4N++ynW+AwOAQYBXfSNU/ru8n8r5VPv1zl+dsXfo4yfi9v/35y3/yznfh92l+pu/f5dUH5a3K/iEn+pvPOYy6rH4fuiFPdjA1CF/p6rYuZd+4XAuNnOaBLftwgE8DqQb6atA7RJwwn7RtIb+/3f1bMv2QbG7O3oFZ/xC2/bPwXgfyeRHJhypl3za/y3Lps+j3Ml34HboNLv96FyAQA/84b8M5ctuSoxzBY/kVI7vdc/tN9PgrR+IC7IBmpxl4Vc7vu+v/TP+vV7fra4bqzndbnLGvF9RmOihrh9sf73a4gHidyljKEPYj5yO7rvjeNjcBdjRbyv/Lt/CnP4vp77QyB13oSbyUsgwPXStxpQnv8UgMXvkKn/d/7//zvn7R+dt//EG/e/8QBPUkq/hANFNoYImPQGvl1Kk7zvDt/vczgYQ8SfWH+oJ/4aXH6P/Bze8nP9SeKY8NB6AYZcQPHH/ptJWe6feCD+N8oNrxsMsBj2CcoVHwdD2A/f8iUYGSlJ/ZF/7iewxwW0tMIaGXRhGWhcJ1KCuln9fgyGto1SOqfIazAGxrYPDHIBDgr2rnzU5HdvVt/XCBi+oLU5AAf3GAHEMZirIQBbUmDnuV//d7wtYeDGIIMPzhBQwcN3zACsBeWdxPNzw11Wl30O/B1tzFbfA4oteQSA645hwxC8jAVAFsoTZ/r/o9A/OIBvAMOUWcyYzjSivMyYMdgQkv7sPT8byRsvjecNB5Crht4eAZDgw1fbHOwifQnxoxanV8TTwMz7eu5PEz05Y8rmNW8ftD7//fP2j8/bn523vwIPEtc4eN6gG0TMC5IH3Wv94Y1TgFAHMLCfgNG9njgmvvU8B4LcDd/PFx4M/NaDtp95IKXFeEfBBTvnY56oFjcLYZVR+JYCArAktRxG143DiKVaLRloDiF81cR+v3C1SqUo6qTxBrDiIuo+ML/iVZPn5Ism9m15hWRtjpHrfpZCAuLynoR12wd7Cw9FLXQzC32x6/xeIFQxTqEafCdeywXF+8IXDB7zlBFuwzDImGJLnkMo6+EV+5f1V9N/DAB8CgfwQ8WdiEZ8EuIY2sedhoXEsbRWiqXdeM/PZrTYTc+bALRvxYN4EcoHxJtvARYh6pDPUhxOdM1fgwdCq4j3VJnD9/XcXzm7shvGSPl7heKPt2Bt/rvn7T88b3963v7Chxp+As/VqhxeJYY4k8CDyBPf0/rD+NxoxFV+KyEuqsU9xd33wH+XO76vm0Du+o33olgsbyFNSS0K1KovAonwrcsqE7YRQ/9jf3PEG5qEYPqAyIRSrah6iOuEvQzN6vemC9cqKUEWxbK7lIcVezEPz5ohQl97k+fkZhP7tsIYAnpmiHxaJFIgkk9ngCfCh9ZDg3hdpPU3A+/72Om1H97CWJcT34mzPx7Aeuii/TgDoLBI7yjvKetg0hjvfQpXaf0vG/0j0VLtPwYArtMB3KoQiqZyfNwFIndoiOohEMne17OfKGhxjJ4neuHLLk2uEYvMDCuHLy8UYeKipkEXuRGHImDm+nt87scKyUnL5lih72UxkL8jGMLa/A/O2z85b3/uOR2YRnrN1VaU6yVm7FVZv1omxEOXT/6T1wtqpiMRb9Bwv8aY0RrzWQ7hF/6bPfbvjeldclO08rxX3aWcq6j87VGKF1ZHHFMAyF3/HLw5vlJSF6WGuki1igw0phFqXoZm9XvXZYWKMN1K8ullLjbdpULdgsuWHF5ztRoLXU2ek7tN7BuJjJweKoBxDdLtrBTRVdhbU3RoiZ3RRNO2IY1V9Cskg+C5Asqnwf6sU7olvlPJ1dZxQBLmEwBR/ZCSPRcYM/a9ZowX1SxfudqKqtw/v/t2Sv8xAHDLcBMVlNvAWiT/F19mIYCongFz/309+4XBrl+g55WU/FUrh5O1/vnwXaNcVK6+1gWs1QlyzRUMYtBX7/G5QnL72tUWX2E9B8xB13Jfv08x9Ovy3ztv/9F5+6eePCqERqkn8ZXhdRin3Nir5PxqWgjaOGMFQLS8c+0WPaSERWK50Vruc4fvQzgGLa5W4EVCDAzYUORFhFtQ4e3IXQoJYYlkS6WPCXCcTobiRSIhu++yQkLoZUCSbbP6ZeVQVgGVORGVu10/F2vuMt9eVAXxWTI/N5r87vea1DfuNU5lFE2AbZeVWMZWhnkRDXw+tCRMYlVuPXK68FmL0ws1SaGnXXcpAHXo+0HBopACJJ4VCMZX3GX9CxyzJobE4+W9wlViZ6H/7UD/B0r/WF+hPQYA7hHCQTcRioqUYKBl5ePiYEuAfhlRMZP3XT+7xXBV880HddM1VTtNxUkrMoOHLy4Urf46l6ddNMAMpwa9r+ded3q9BXGZYu0E2XSaxj8LOmnEvx8T8e8OGTn2Ooj2+VVUvzQ1RAEAeUuAVsAA7oIRLAbcry9cXB2NlcmQGIsEQZR4fQKcDqueAMq8HsNeO3LZolWo0z+u5JRrKXB4Q9Pki7EMM3oZMM32dRP7febidd5F9hjlbuViIlK8B8YautXkd38KvKZG9v3S6QXNUB2y4nQJavxZxV1WEZRDi3UPNIXIi36+dbokryVdLWAMpatPjHfacboQE1eVxAvGrjHm0HhnySP0ijyKDNKs/lGieNdl6yt8r5oZAwCPIKZjuYlkEhl9VAhVhTS1NVnNd/3sXni2dWjg82TSRdNemqXTrknM4uF75Gz9+AEY/zwgagQzuEnwwHxfz72RAABQZz9Vp/qPDeLfbxXiXxvFC1kuGXW/z1y67ne9AOAE1gg3ef4x3aJZMncQ3KEWAPhGMYQhhnCfwjN44GqVMbGi4CkYL3E5ygHI1f4WIFTSDSD/jtNFcFhStgwHUZkAxip4SrACaLP6fRnx8uDlQIrcnLhsSfEy3MzYi3TnHbz7G+A1NarvVmOvYZGoMxg/Fszah+ecKocWV3dlALANlz/NA9ABY9Wqp1bhfJDCRfgNrSqQhQAXRA7nUxozrw+uf8AeIay6OKl4m6pG/wdK/zVquTEA8AxegF2o64BoT8BobZMLcguMQ5k2ALtVhsjgX+XZW1d4Ni/kIhwaUinqotrfvz5v/+V5+698+9c5AYAswEN4P+sgZnS552rlQVGXXwQj3tdzv4oAANwoZfiGG4YHQIST/sQg/n0WIP5hvJALJp3CzSFP5a96AYBUseP+ynBAnNEtcc1lVdH6AKSmAABNiGUG0tUw8wJT0rT+pQgXFuMpAjjcg1tIyKMjXr6QDC5WlisD0MC69VI+lvXxm9VvS4TngTLLe3AInEHfW7B/mEdyr8nvrvGortq3pHpqpdtxrx3B+DeAPLoBlysEl1jOHAGkxgHYAvvPHADcj/POLl9dMt7pRFnPAtranV4D4oD+Tt6LQ0FYNZFtSj/Nq4y3pLyX1T+W/y6xzY4BAHY/oGY2LowDcFuuKszgVXqpI3KrYHU7jPXU+2wkldXz7F5lIe+Bm+m/OG//5rz92/P23/v2b+sEAFiO1TqIWet/24WLXLxJAADNfu5XxAHAtKlxxZODOvFsXESH/I4n/v0zhfiHpFGN+DdPt4VTAEB4Y02t/b1GRqY3BwDYp75KQOTBsrkncPPikrzdiQBA2xNFYKjPQVy3QJ4wq2DKGd205lxtNcwUj47I1oYK4VRov65T+GbP2GvN6rc1kOkxCxwhBADolq04vcoiZpI0890xljwN71xv35hhMkixeQSMDCAWIX10CUIFB5EDt4/sM8slFwFY4V6xLkFYsXUZ3mnRAApYgGrMxas4IpBZJDLotrFf8QLWQTYTizqdKetpXulfq5j7Xf8xAPCabsPo6kLX0BYhD2YGI8NT4kFHLlv1ad7VasunPntHaduECPM8u5/cRbiQLw75//a8/Y/n7X89b/+7/78pAAAPBU4ZCh3E7L7epw0V8wC8j+cKEfCW0/Xdpyh7YwUOpZBOtRD/fqAQ/+5HiH/ojjyB23eVxr+Y0BYo1ai7DgCwSNkkRQjRVOCmzZ4RMYQxABDaF0g4tFLSNFerdbjz75wmAIDHFOYLERrXIatn3cWLpjzP0a8cICn9tippZcxr2QFv4SG4ZNEDtGWAuvs53z3PnLSSV2+JvDfc97IC0qXvFcgwKRjzsAs3egSMEkKYhBRu9Age0YHLFw22z8jg3za8iFz1cR+4K1ilcRJSIYuRsNpYICShgYYZ4LBheeazgAe2i85AnCPtZj+heArQvmUKPcUAwBvF3YK34TKQQzaATXlIzOAyxHSKhPT2lcOkP+HZB7BQ94iNjHwAeXYpx7M1ksmhv/3/1+ftf/AH//913v7vRAAQEg2JHcSa+xrnXgNPkqP7rp8r4kD33KXgiFbhDWNxeSpVxYh/rwLsdUbz2wYAEDZurI3TrRnFOlIBAOpJzIPB3aWDlA+MwQgAqCp7ghnCyDPQyv5aZKuq4t5HA36sjFMLATxPSBvboHCeVIoTAGsVTXlK8VlOlVyN9K3lkwswwuykbgMAVCDcWCLP03EA1D0G72efkroq771J770FniltTiSbhg+TbWrrLltoaRbA8zYBSCy/zmClBDybY/IcCH9gCDwofHs+CdyKrXr3hwHQOUweXRwLVx4cS+TVWABgh4AyAoBxmqMYALCI0+gl4bNmSrE74ulA+1qIAQBO21olNzC7iQ4hfnQAcc0qER00d/IquH4HE5+9RoMsw60OCSwYr0x5toa4jn3c/8L1/z+dt//jvP0/OQCAJRs6FzmIMUaHZJddinVJvjjLr76L57JOuoAPFhzRvumOy1erOoX416NwOLYMg6QBAFkLY0ZDhT2UcmWlrlQAIKp9kwSM+H3X6VYXAgAnSkbMIbmjjyCExi7pvgQAIGOYVciVFvEIQzotSphvwcjuqRCo36N4L4OXF0b61DKEEfcifVsETK4jMEz9C2BG72MM1Mm7X+W99+FwLipkvc5A5sIhfVPRoeC1dWiQYPuNtXhGBzna2W4jfr5HHuRUAGCFnZjTtUwhgxXwgomY3LzhRt+i1No3gffhEMAC9F2McHYsAIA264TswqTxfY+tcykGAHoM9HEMNwB0kVfBoJQI+Vbh4yzDQI6VuNJw4rOXFQBQgrgqEi3K3kClPNu6vf0rDwD+5/P2f563/zcHAGBhoYJhXPkg1lirOPezLqvFPko5us1+LmqeDxD4sARHtAV6mggAmPh309kV0NhzdESEGwYAuJlmAw1TILGalqbMFwMArNqH6H03cOMeSeQAcNtReAYHhochFQAsBg44Kw3wMR10yNPYpGwbLWXsGMJ46wp4YRa9RiCW/o4IHMUImCzMIsBtyWWFWXZcViBpk0DdLhnvQs73Pqb3RkI0goBJ2EtDOYGptrYsABA6BDl23q+EUBaIPyYXNky9668DAPC+nKH9zEJdRQCh6F1Gr41wEkKCUFU6r1aNvkPeaM17YdmsSQI6oT2bBAB6FfbhAaF7jEngz5fogD4m8hi6ZMsRl5L17AUDACwBO3QPNsYW5MFbzx5pkgcApYU7A8aVD+JF8rBwOgo2FI5BV2gznrsIz8Ra6agSpgmOTFBWwb7hzrKyAH6kEP8eKcS/KQXFc8qN5SIrRlpNPq033Ja72TK0lmqfFXPXMg9SsgBQJnRN4RkcK+7B4RwAgHky6CnitCbkieDtSeNpCGlun26FFUiftG7SWu73GqVPya1XDuhd4ogcKATMQcXLxDf0fQVQ4DisLImRxPc+ovdmUHek8HTEJjQLAGjiPFYcHDlDCHYk/MN2bTbA0UoBAKyGKjVjQkJd20AaZy0EJClr2RqYBmh9L1kjVoqh2D6Nv2CFDSaIiHllABASGtkC4gwewPih5+El9iCFrGj0hwgx9uyVAAAQ414iD8AWGNzQs5vBAbgPt+GOxIOYiY9MCGO0vKq4Wxv93DVIk5FnLrta7fculyZmUgnkjWtZAD9ViH/PFOLfLB0oJ8SqXzEAwHZCWzcY1iHSFhtaTQlwBTwCltEtJuwRLV4pNRcWyE3N3hcE4akAIER8miXXPGrIW+uxEknP2ibwsqvcgrTc701YC0fADVqDvcS/owGjDiW9lIVZqpBxVKHwqAXqxhLfG7kbqxQyCe2nwjsCALhW+FBGzYM24oCI2ugkNSlm0wdznwcAYD0ULIkdEuo6hPnmMBlmjbUEspuQDIohuSOwOWXKSJuhC1weADCeY88mAQCe6C2IN7E7XXNTzgCZB106S8SCPDTSyqxnlyBlgwEAC0wcKQdnnmdrWQD/xmcB/C/n7X9LBAC33aWMaOpBvEyuInTVFiGrYQ8QP7vPG/lczPDAVELWfhdXKUuDouAIhoaOlfCC5jK+uDVeVEv7VCH+oZsvRvzTvEenRsyc234gxSqmzFeFHGduuAZTCUh5AIBUXZx0tRKqeY26BgAs4tOc4R16qZAlWaFxn/b6AoV0QkSo7kDudxVu98JmnyPOSwWA0Sa5Zi1hFlzPB5R1wbc+S7Uu9b0le2MOSJMbAbcyejffJwDg0J5kgUip6UEgB0pDrk1rHQDgsb+MtLrLKoXWPJzAPq3Cd9x0tUqI/a5WCZC1CVAcqwr9n0GGiMVl6fp9AwDbitucAQA+QGJj7KaeocGkAADt2drHO6EPeUhZAHMJzw7pAFxsgAsdgP/GpwP+dy5NB6CegxgNIiL6ZYprnwQ2WaOeu+03wxHFZQ+NXPVBJe1PExxBV+uqqy1eI5r1Un74gvh3zSD+FRKJf8sKB+HMYM1zqwcAyDjPgKCH7fAdAYBCg4w6r/Gi4s1BeVP2Dgk/JaVmwpqS5x01bIHY6QmFPLQQTwkAP4OzcSU7yfIyrdE7bxBQ0ljuofc+olv9WwB1MdKarIHfBwDwrj0AWJ641/AA7LpaZcJDChVtKtlPoZANiqyV4dK0r/w3i8vyewMALLd5Xg/AqhI3zAMAYiEAVlc7oayBhYRnW0qAKGmJSoDSUgDAy0DuKOZqozAG596vUwz3LAEAXOW5SPLEWGY54CotKC551hOoGmQrMSgSA8Pyw0L8u+d0ydQZBbSdUvriAoAR3iA7CS0PAEAPDRraPWrNBgBYhz6F4ZwHACxR7P6UgLdVGTBUNbEIYTyMy+KNOgQANBGdMh28obYPbvyQkS06W3AFyaTzialfoffWwMigwqIvE98F+3+XACDGX3lXHAAsTzwC2Txol9YpzFQC0mVVIZ/LOLTUZkw1R/VDjaB+7GqVAPHbpgKA+XfFASjTQuQDGN1lGgcgFIdnAGC5U7fBBRbLAjhQCDexZ2u1ALioxTG4cqR9GzBIXBaXizuwYhve8PHwwti8LLAQAGjEc5HkKTe7DQIGmuwra8kL0j5yuiraNGQUYCtAhkGM+Ke5cTENlNuOq5XLXI20FfJ0iFgRj3dVIRvi+lhXQmPTCuC+KgcAjekiAPc9p0uFirs4FQAwex9BwL7TKwP2KfyQGcV9ekBxWWzVwH7rD8zNcWK4xzqktbCFJbk6Dodbyg2u38hDD5Hpho00seN3CABSswBm3kMWABZ2e2tk9vAeWVZ4SpqanhXGOqQLzqq71F9h5cMq2aiQJ6v0PrIA+OFHShbAsZIFsKRkAVhMfI6zacIS5StkAeB/iz27VVk0mJ+8Ta6cMhzIlkG6CYQ1dlnPuEuddmb9IqOai2uUwZhYAKARz90lAFcEpFsOpPBpxqyssPEx9iU6BdimwH2MxL/XhpcBXbJnCjeEm+aqnAu0WXdZplR0+V/Su0zDbSZkaDk0NuHSFMVSswDWldvNJqTsnQWMTyoAYJC8D8DU4ncMOl3sa53cpyeutshX2WULtVgAwDqQqkbIUGt5DtETp8vwDtcBAEKHGxcQKvweAgBLlhqBc+c70gGISQejqiEKc2mhIyZWhmSGObvmLfQfytNnDYP3pgPAxVswN3kf4upcQWoLbuExHQDeNKzehAPfU8gt1iEfAgexZ78gtxErlK2Ce7IEizYEAK67WrW6XojLTgRy7zfh1rZLaXkWAJADsxHP5UyDZXqXY2MeBw23IJKr5FCYcFmlQmwYGtCIf1wrYgeM/bcJRt4Ko4wbbQwATpe71FtohxvtaA5Di3oKmu4F3ixZFz0EADSwsw+ZHae0Z/mAzhNPZJC8ByDASgvUhKHQq4RpepgtUUoIAcT02fdyND6ELINvGWROZy4D8IoBgFQPgJUn/q4AQF8gFGGlmQ66xioBnkUuIpZ0MLv1hyMAD79v6IZ+qKTpFYwbekjEqODyKQGmvHsuJUAu8FAh9y0eBhyLx4/Janx8o+fqVUwQ2laenQoAKuCKiT37CRBHeiDONgmhjUXD02AZJNart6rVrSuH/JpxOy8ZAAAPzKs+l+NxzEGoulp54Alg8E4q4FG7KXGtAmzY70OD+DdPYLTqsjW+6wEAwwojGZsoL/a4bCnpvIIrw7C+tJLFxwbHIgQATgPE2FPYk1jLo14lQJFFfgvfAUHAqZHyZhm3Y+K9rLmsXkIKCbAe74jV2A3Nl6KQQR4OuPQPAwRDKwRgcQBCXId3AQB6nF06mrMuZmHNXLUWQF4AUCQ7ygp8AsZTAV7MRc91Bpi0GQMAVi2AUMjpbcR78b2NjgEArRThhpGWJiAAq1+hCAaqU20qN00WrOhwtsIS/h3mcPIhyGlF24nPvkcgQFJU8NasuXJSAIAw161qdVjsSA5JZLSjyIcGAPjAvMpzZV6m4GDaoMM/VFnRckexoZwGEtgGhVZ4wz11tlraBrn0U296xwZZaTLSRHlRdOLl3fLWApiCkAF6V44UJnpqLYBjI90QZWMxhVO+A6YgpQKABTDqCAK0wwiNeUjl7JAITrMKr6geEuCp4srV2gp4u5iIlscgTxDxkr1gDIpCmvpHiidl3CB2fuP0qp0WKNfCeJM5AAAfVKtO1/lYBwL3HMTcuU5LqBpgXgBgcdkwDLMO58Y8rIFNJWyJh6jmotdCQss0Zittk0MAHTlJp9J/kcbJNqTuaoBF5bAoAYFsm2LGwi7XqgGGFJDaDILItsuK05RcbRWrRWLvo/twN+HZXxEIeO0/RA/kqhZyGPiL3/0ikJLHojUauNoDngXGQXEhaAfmVZ47BwZ9xfD0yE1K1PHewk1D0/0/Ulj5SwYxRou5vXRxtbQzWpuh251FVlpIaPN0aNZbDXDRZQu9aCp9GwSw+hJvuVtKk4I3azDWaVdb9CYFAKxCP0II1BjvKQBAi49jmdMl8i6kpAFahhl5CcK/mAXjWYKMjxVKTx0wvKJnCrdlHvZPyellaDn0qR0onDVTJIO/oswLEztHjbDckQKAUXdhzcU1IzRJXH53FnZaBV7KFoWN0D5j2l33FTkACDSRgb8NewJDvLuKzcI1rAEf1h7ZcVnhNBS00sAFho/ajfAK3uzxMrwKXlRME99X1kJfDADE4qwVdylziCV/2X22CszefYVRzjfwTuWWpyluac9edtkyq0I4ROARe/Y1AAGPPOHslQclb+q44RV8n18HDgkkJh6S8cMFq7VvyW2KAOAqz2WXLsb8D+DwR0INKmUNGPE9JIdhXHeL3MYaan0NecMW8c9K++NmsZVTXcOrZLzzAgBsSC6N6fSLQmJqFsCKq5UdXqKb+xgc/hLOSAEAkiWySQYUgYzlzg15AHDs6y5bGRAPCisDJXQjPSUbsApzg8azAqE2vKVrXlHrQMHsGqyVoBUi49DnnJHRsmcY/DzETm1Pojoiqqluw83cAgBceXFeSZ9GXseuXx+7kFJ8DO+xZ9jnenQAWFyJhZuqcHnacVmxs0PKJOIKjh0uTc56Txkz7/NNVyuE9lq5CK+5WjXMA+h/h97dKszVEwMAzxSDaxWnKEM+c0lJx9uF3624rFAIEiTk9q9VdptNfPYGPRslGVOe/bG/Od/0pLP73rg/q9PFmwcAHBBaWwRjqjUMAewoKLLe587S4SqKVgK6tNzpLSOnWSvKc+ayAhn7ASOAN98U4h8aP/lbdt9b6Up5yGFsBFMBwIHL6lVgxTsUJTow4vP97rJcbKoOwAw1cfFiISc8/J8mAgAU6GIDWgYDp6nSWSTjI3cpmIT97lF2QIi70RG4kR6BYdwjT8kOXFKqxq1PO1C26ECp0HzwYYJrO6UM+i7sm6OIwWcSL/IFQrdJTN1E0iiKWVkAQLsscmYIpm7iBeYE3tsqZoT2ud5iQKFsk1OXLTqFVTMP4Z1WCIhrtQA4G8bq+xS+5Zbije7182qFO3ddVnraenfzshsDAI/I5VoA42kVv6i42rK8cls/goMKD2BMqepwl9KvyFofruPZ+0D2yPPsizrzF4pzF6IzX3pvwJ06Xbx5QgBrYIjkZjAH8UhuGgdg1WWL1dT73EnDTXgSyJtmxrEWPkIwcQK3uCr1j0Zgjm5IQwHin4amJ4i8Z9X7zpMeVqkTAHwD48V2Cpu44vSStBifb3X5lQBHoQnBUWRWOyGb4akHvSkAYM8woCfwPct02xWD3unCQlFncMNho7nvwkIzXGlwTll/pxBWYw14DnEtKrc+BqHbcNHQ5oML9RSVCwiHXecIhB/RWrHmBr1faOOs22SZ9iOnQh5QPJnnm9NytfTpHTgPDuHdZf73wT5r5YzFPlukvooBANpoTjW9iTK9k4SJDyBsUYRQkFV1koHPrtL3MYHmTaeXnu5UCM+TCh/LmtMyvPsKkBy/D7PHAACqrXW4cPnLHTpwtYnEGtnLdAD3g2GT0q9I+HqXz/6x+129+YuiM58k3KK5mEQ9JEAsS4mu9Cl3WcgFG8ZMeeHPwIeu97lagZZYYwDAhnKe4qt482VyGhsB+U4W6YbfY00xfl0urtefp+UFAJUIMe+APFlMzsP4/IuEsWjqmn1wEIjCYrt/7+d+DBd775azC/XgGrf2Hhr1bZfVexCDjiTjkOCWHERHAI6Qya2NVasPweEsNMxMWt53tkZ7m+IVXQIgzQeKhB0PXFaWfF7x6vB7TwXemyW58UBZpQNlwK9LTTUTL1MsuFR2WTXQsgG4HgXSpxcgnRhLJaMC6RZkfCzT4S/v/trbZ9YXsXhgKAWM6c8IAlYhtKS9F2ahaO/0nNaDNuatwJjXgc+h7fPHxpqYg8ubNaebQLqcp/PuuzB7DACI3rpUW8ODWCZxgWJnW4qbml9mEVi1eAC/9hP60N9aG/XsUs5n/815++F5++i8/UYBAKka5hhvuQASN1y2dj2CKknfmCUynaQRYR463jpCC7/vCs8dN4iUobapxOuFTY4gYJliutiQy6FtuG7lBqP1ge4uuTW3u3DFvrxtg1zaedaH1pAcheMfV+LzTxLGwrFrcTG3e6PV6i5rLDzxa/+OB4zXFLLbprLGce+xEdoCILMErHi57aYIbu0QoZg1RrbBvqDm/bPA+mPDvKeQlq337lW8omKPFgMHimaQeW23umxly9B747zs0txYB0qb08XAlmDOt5Sw3oar1T1ZJ3b+XSN9egwuMUJ2LTpdXXMJCJmTMDdSO+KFBxpc8nuZOC5L5Pl7CnZPvhmKdS0ZXtYiZYFMKe/0OGHMVt8rQFh/a/BwWPRMQMAknIHanBYhhMzv/v15FwMAX/qD76FyEBdooAuBj8svg4cbH8CPvBF6n8/+Cw8CfuK9AOJGf+guNfUtDXNchDNA5viN74dBlSxK1qke8T/r9X8vDfkQS5GF33WF5+KtbFkZ34pBLsOKgC8AHYsxm4KFu2TMW8gIYOnNGaOPZXB3FQBNv1ZcaaljW0l4Tp71sWKMfVEZ/6ASn7+fMJZlV1tcSfg1z7zBfuTXxV2/Rm54r9HHyu1cM7S49ywjJNkSeIi+cXHBraKrrSRahG/Oam649h4F1h8bZiZ28nuPw3t3EJBOPVCKdAGZMg64h5H3Xgq8d8qB8sq4DeNByvOKpOolWKdoa74y0qcH4KIxBdkWmrrmNPBSCi4rtPXCH7Z3wQaMQgot8ltkrckl6AHwt+SbDUFKtyj/We80RWcGfq97CvAZ8GtwPND3HHBxJsDu8j4X2fPnBALwDJw25nSG3r0GTMUAwGfeIPBB/AYGih93OvBx8WXwcOtQDuCbDX72dM5n//l5+2sfCvilfxeUoGUN87cGyQoNxy/8bZyBTYurrVQlrlqpn94BDb0gsYX/5grPRSQ7k6OhbO9jxZiJR2MyMG9ITmMj0E5GV+tjmjw8HX687EqbVOYwT+Pn5FkfM8bYp9ylvkABDE47Hf63EsYyTQeNZNc88Ybrjl8TX/n1cQEUP/Wg8ed0O58KvO90glEXvYRe+B7a7WkUxjKnpF3OwjhZzx0VMO8G1h8bZn7GXOS9Uw6U2QQbyAb5ceC9R6hvLpozB3MwAf3zgaLdhnHOeU7xO7NEN9qaawoIEMDeC6nTo4pHcxwuHwV4b7HPODc3aV4KxG0ZdZdlj/v882/TN3sD6YRDcAHSVD9lHw4CVwbfSRuzhBoH3aXIl9X3MJAzu5R9fsPvUwQBHbBfQnOK/SPP5/v5jAGAX9NB/MC/2Cv6uPIhYhOpDbbFfxg8gD9vwrMLOZ79T8/bX523v/WG8GNXW3/+DXyE4cAiFMPxkTGmJy5bq/oNuGlb/aJ66Z+JXhBZuKGF31rnc9sJZI3maMgoZ2PWCf0OGX0LOU0U9njDsdEdMea+QB6eZ4orrWD8fWrj5+RZH6H+UGFQjOBL/83k8L+eOJYCHTQS5rrl1/Q1v+Y/8Qf/BeD96Xn7UcI6GInsvTGaIzmMWoDnExLcGne1wkvj5LEaU7xXUgNDW39omMdcbfnZCbIZ2nvfBnuU50AZU2xgm3LA8Xt30Z7X3nuc5gD7xwOFD8IeWj88p7Intfa9rfmjD//+8P4Zi2WANihv9iHl1tbiD5pW/79f+AXJMceP/Y2VDduocqDj4cqGRENgY8SELhADWjwBL+l9XwE56r7f/F/6A1XCAyi1+4qM2ZC7LAiCG2dIea9hcgM1q99mvvMrf6BgyV7svw+8Deh1kMNO4qAP/FzfhT60Q3WM1p6sCc1z1OX0EsPiZen0vyNkqQ4IHXT4v8G/l/dFD5IGAEbgMMNDrOCyNdAnwP2JIO5Zk/tudJ/NfNf7Tez7N37tMlB+7m3Ca2WtWDdRDYQKGP/c6UWtLCA3onghnvi9ccN7bQQ4PAKbjaBbpJ0HYS8PkNcPb9ziJfoqcAnrSOi71/f9xs/zCyCaiufptp8LFl7rDvQ9AH13QN/43il2h/sfhHeXC0h3zjE+h6yrvM/nfpGk+9R/g5R+eUzYX1sqANDcRWNGLGcWXNAY22qHSQyxjgUE/FZxbXIMheOJmitxRIk7zZJrVOMCdMDG7lbSox76zSAb7wYgdjZKLBuMrrMJcrnNKISvZvXbzHduc9mSvS8VQ63dMtAgy2K/BzFRLLTDa1ALuWjckSFXW2LYMmBiCProljRMXgrkkDxwtfoV4m6eIzf2lMtWZFyg2P8wpaY2s+9G99nMd33cxL4FuN6hUFnsINVi0VoY6tf+knMdSMUpYSle25IF8sB7cj4nrwG6ifnCNmF4DXA9t4PH6Z4SOmTPAbqgrb77jL5vE7Bgb0pK39Z7p9gdnpcJ8lgPgOclNn/s1bnK88fIfd8BHqiUfscV0Ps9DyAVAFjpExrprggELmS3YvynoMQj8IOJC14jNyGhBgl2QwEyETJPV4DUwsxOzAbAG/AQxdHkpiAg4LrfgEjcYaPEhYMW4dBaclmlNlTR629iv8185w6/qe+5rJDUkJJxgEBiAohq7UCIekpscSFb4RpcUdjaVvYIlxi2jCO7gkeBt4BxVgQBYtBZwVK0ztcppWjWZatLooYDi1M1s+9G99nMd33WxL453tqacJBOGGx0jYj6ubvUFbnr13YKMZUJxZ0AhuQywrwBjSg2R9wB5g0g4VQO08cGeVjjDsxFOAnc9xOFT9FDfIpQ39ORvmN2ZxrA4TxxQJDPNJFjjBhuS3n+dOT5TEBtSbSns9TnDPKBUgEAG+8Zyr/fppxGTcABiXoaIxEXmrD/NQUvfJakoAjj10onkrSZTUhv2aLcThRHGKAb8GTEFfkVpddpRmkV0pYwHRFFOFiER4q9NKvfZr5zJyB6AZB9xIgvUkPhokHwAjwn7YIRSIEUeedtJV97VDn8UfMAKyZOkYcJNzduxLfA8F5yuo4EG3ROVZR0rRIA5nVIRRMN+WVXqw7XzL4b3Wcz3/VFE/u+k8C4nqGDAMW6SoEU0V53KSh2311WtUxJTeWU4m6/vp9ABoeWOWCliqFEO1/cxugwfQEgXEvFng/0vQJ7Rev7ZWJGRT19v0iwO0t0uVyH/70MqZSp78GE29TnW/0uKCmoqfZ0hcaEWgCFVAAQklAU0QgRubAkHNHwYgqMfDAkJ8mhygIkIvoh0rEszckHhKbEhAIpKDaDh88o3YAX6HbKrsg7ThfYYaOEddh33aXyUwnmUasj3qx+m/nOXQo5ir8n5xqzXjmS/yStTkCKKMZJdUQR0WFd9TfK4b8M+cxYI4A34bqSB4xiLJqSZH/AoKM2OMrAFmltoz481j/vaHLfje6zme/6sol9P1AO/5HEgxRrlGhCOX3eKyaS4i8hEyck6KSJinW7Wg0HSztAE4tBiWLWDsDDtAuIyNp+Qv0A6Xs3se9uI7NH01TI27d45GJ2x5oXFABibQdr/rhgVN8Vny/2lr3dqfaU3zVTCCgVAGgFNUQR6gQWO0r97rlsOUysHbBO+bos8fjIu48tCVJL4pQLRKCk6JHLlkaV6kha9SWUl92AD8DuwtfAYrYkdlnWFNXMDuDjiEzxjnKbbla/zXznTugb06P4e4rSmFaDHHkZ/J7ch2jGMxhB6U+uISE66avGJtQMAcrIci0JcfM+Dxh0qfrFlfRwHMeuVk2RAUAz+m50n81811dNeudul1UeTVFd44Og7LLVAFGUq1ch0HW6sDplNQAAuoCk2gIHtKYeiGqNITnaVZfVUpBU4rbAfmIFwZS+xe53uqx8sKWqaKlMhvoO2QysAWHNCypB4nscKWPEglGojRB7/lbg+Qfk7cYw60DEnkqNGDz7MoA0FQBYJTWl0x1wU+0ZCBsLzmD98Xm6NYpL647hARCgwTrvY05XXtuBRYPFa7CcLddf5qIh24q7sI9IOKlV9qTARtnVanjjjQErQeHGa2S/zXznDlerNobxs1At91kgaMmt+qWza2KXaS1inW68IXIVSSyhiVraXGWRtcCtapLi5hUNAPGqYJW7XQDMOxCC2gQjwJX/cE6b2Xej+2zmu75U1tZV+ka3LXKehuHwR931/cBBcOT0qm6DAGaRQMdEwlQAgGzxXmDM4wGN9QOkYAwenliLA/cDFrsZBKCheYJ34DKI/cu8YG2CTbL7w5D5E6urUKW+pe4BvnfRZasqdgcukifGvMh/k0vFAQA7lJc/gvFhZUkOTcdqaRzQGpL/LfUYykaYNdavrJ2qM+qWpAIAzc1Wdtla1kKu2wIjircx2YAHxo2PY1p3XG01LJS83YRbu0y0dZAhOl8FRCw3BS4cwaUWLT31NwAAxP3GGvXrcFvGuvTbcKiWXVYrfZHQN7r0GtlvM9+5nVz2SBwsBgAAxq+w+M8LV1sTG0NROxTOwZKtbFSxpKkYD6lQdub0YjZYwhQLIh0obl6cVy7mgnHdddg3KMGKRUF4TpvZd0qfxRx9NvNdXwTWFve97LLSwth3keOi9M7oFePKa9qhcQa2j8OgwxCbZpIb5vKnAADO/Rd3M9e8x8qKWuXDHVrTWO6Ww3Fc5pfL6WI5WvSOVOC/75NnWG6zWsEw9DJbfWMxJ61qaF/goDxVbszbxpwcuGyVwh1lfKfKhWgs8vyKq612iWM7o7EtQnjB6vcMgF0FLnD79QIAyzV1DIhHJF0ZHKy72lKWXAPb8gAwml0kdu2iyxbn0CrccdW8ErjvKsrkziku8D1l0bIHIHSYcrxnheJJSEjkgiNdiktvyeh3OWe/zXznViV0tEb9MgDA/4YemWEglGnVvFaJtIOETrx9LoJLEUFAFTYabpg9cs2dEUjQyvQOO7swiFX/YBsOpQ1na8+nFAVZjfTNhZ6w4IjV5wrsCf5GK0SUwjWQ+q5Mzt2C0JtWC6Lbr4XQ2kK36azLyhhz/YBMXNTVFifCm+4h3Wj50OAy1iVXW36VM1lYzW8hAgD4d2ch/GSFRLAkbAkuQqvgIZC9eKDMSZ+zSwgfu2zpYSTRbYDH7QxCt3yb7SNPHXqZT8gVvwp7aBcOSryozcFatA7KbwHwlIDHsUZjk31fgXXP4zuE0DSHREPPP4axbdBZhRU2y662jLbV798p/W5QOPs7QN0IAICDtQAAIsVQDWzmAGjuWy5EgYiIK9xh3u863V4r5JYqwhgQrLD7ZZI4AMJgZaOPIKR4RaPP8fkStVWYG82QYlGQMTLQWLSG3/mqBtqqhodVxqpgGLDyGJfyfGSko067Wt1rLvCExpZBQNVl65/LBheuygZ4PrCOOR/+ePi1OLsmulYB8RBc1nvOrj7XTSmbBSMWuxfpWys5iqCNc9G53jp/I0yV4kqF9b7rPhzOWknYzsja4huzVvr50OnVHHE/zLnaUtNHLlu+dZUOjENY08wvKiiglPX818HbyQCAf2eNAIZWIhfLom+Bx2MB1qVciL4x5qRPmZNtONjxUrcAKW0SSt2Hm/yeQvhFG4eeZOx7DS5p8+RVrioX0slADB7BziZw0uZoTg7hoEb3/jyMr0TvwDykkAcAz5clGBs+3yq9nKffRSK0fwf+8wIAKwSwDrfzLeW/lWABHLhstTjOwcUsAAvNlo1DAgHABKTqaAaCy32u0ocvGzEdyZHtp/TFZhp97UOXiVyz67L1oCuuts40E3uabaAtAIDxdbx9H0OGB39bLAutEQtRibLgsqIgPQqJdZtuJXgzWgLjuEQkqphx73G1dbvnIRtl39WWcOV4ZjkQWuGUzRkiNpahvyNyTx8TcOH1YKW9MQA4M74RK0HmeVd2pZ8EMoqG4Zvy2joxXObaBcY67LjSpLjR+dAoKpyZsnJzLblsxTzNru0ZDQGA9t+ZyNhHqdPryg1wVQEdWwkAgOd7lzx4eEMdV0KxGDrU+Az8+0fkkSgqDb/7idL3cEKsHH9/PLBOtuncQk7cPsTaUwEAP38azq2UdZrSr6y7KUrB/w6I5iUBIolnn0hgG+QOQRbsDhweO4bxwfKmonNueR4sA2TdZIvkIsTYDcalVgis7BOrE8VhRimNpZlGP/ah9yGr4RiM4CkYfY2Q1GwDHeNk8Dh2iCSK39Yq5CHzI42189uUuOgGGA3+/lL5bRJuwPNEpgoZd8nR7ac5xRtiVQk17BFpp6wQ4AYDKZvb8Pcc09wlV60GwgddbaGR/pwAQG7+opaZ8q6aK32P/rvlSm8WAGDPYwkM/BHZMLyFHkGMuqLc3GYDvBTkFWCrAhmNm5bJwGB+EXLEuTzxrrL+QgCgoBx6J8pFcAry+C2v5Rrd0gsKyRw9BtuBtqO4ynFd5gEAedZJowFA3ufn6bcA7XvSaCoAQAY636CQwLAPP9sH13GZYu1cox21jrFgRV4AEItll8i1vQ/GeEsBK9uwULlS2FswRJ1NNvoxV48Wuz6AlMkj8GTggmi2gY5xMrQFi3XBMeTClbZYqrkb0qJQi/uNywpKoSfpTOGjyCZkedd5w+3Jxj2UeoR/twNhLAw1VAC4ae5MTQthE4yxFtNcV35nTwmh3XGX5XPf1AkARKXvfuK7sisdPWaViLelWQAgZHfwJqjd/reIYHzoavUGQvn+3I6ALKY1BgCaoBem0pWJaa6BDWtO8BKIoMhaq8xbwoYhyQEKiaBtrlJ40GrVwLr8AAAuSfYZGf56hIBCt8QTyp1EIgcebvMuq6GsuQ+f5gQAIwoA2CC3/w7E0TYVALBl8BS0mtusyNVMox8ie1TBe1Ail94+bOwD5bbabANtcTJiC1akNacgpIB1HrhYETasgPY6cpAx4WmGeAzdlPa0TIbv0MgltzwfKOpSAvLcguKZOAlsYgTjeABxTHNeiWlWADhu0ri/8l6WRgCAeznetWjEjTVvC5KgmgUAWEtkywB92u1/nQ4E7ZYeU/zDhiEA7b9v0oWhx+mCXpxKV4FwXhmAQR4AUIbwHY9x0GWVCLmEMHNGtL5P4X1T2wcAEAYAIhz1XcGkVAAQihOj0pDEpDbpJsmiGCizqhGIBATEAABPiMY6R4NTIXb3ERmXPYqTSvhgk27tmuFrptEPpXtUXFanYAGIRTESSbMNtMTr+yCenCcWh5raTLIUwzJFDbX5Ow1ghgBg30h5anO1UrOae1IDAJoeBRvuNUh9i6VG8rtZ4TgkIGnxUjSsnNo63gQAEHrXIyUcOG54GS1vy7sAANa4l43b/0oCAIhp/q8EsgD4d5YpnMoXtRK56jGVTgBEKdEron1LHKPm1p8EHtYC2X7kDIW8Czs52wcAEE+z/046OhUAoOoWS0BKfB1vx4iMOca6qvzugpGW1JdzQjqUeHaJ4v0n5K04ABBTodssHnRHEO7QDF8zjX7Kh14GBnzqfDXbQGPhkJ46FizXMmeS5TzEOBfBezAFKYAdLi4Esm5slJYAkTEEAFgwBdNXi5SxsRVJjdTmBA38JtzEDiOx0m0llo3v3mgAEHpXDYAMGmTjU8Pb0kwAEAoBbAVu/4sJACBW9S+mA8C/i5LqFthFZrgAxBUAHykAIC8HAO3wGnlRWbCnkHCgriY2Dh9+AAC6zs6NVAAQqqg2R8hOS6OTWPomeAt2yVuwqOQR5wUAbXCoTbqsnO823Pz3yVuBYAXj2agadxoxfM00+s1aQM020Fg6tOMKC/aFy+oKIAjZoMYCHCEp0KrBGhYA2lanB4ArK864rJDVHmRsVIx4pjUn/YFvfJwYL7Xcto0GAP1G+t1Z5JY5lXiQvk8OgHX7X07gAHCmxYi7LAmbqgSIvy+33B7DA4pgF8NsM0qYoxFZAJLKzIqs6EXVCGpTSrYQhulWKOV3zmXlmVddts5MSDL3AwBw7noqALBqqo/ArXDK1apDITIWSUfWctbEVIT9nhcAoH433hIxjr8BPIA1uuFj7iTXOzhKMHzNMvrNWkDNNtBfO73eQD0LttXgeGCOs3YYp3AANhViag94LTRiZ9Uw7vJMS7EQOTOHRiz2OAIAtLF8AwYopb1LABBzpWMGReH3AACkZAFYt/9VIz8eVUQl06IT8uvrlQIeJE+ZlXbLh/S8y1ZK3UngAAw6vTgbk2kXIU9+SUnV0wCAeE/njDRdrN6I3BZ8f06lHoPsoA8A4AoA4GsCAZiCxWl3yHznTACJwx9AbjnLqaKefF4AIBsLS2FOuKzaFrqLmacgG3mFxlGGm7Fl+Jpp9JsNAJploG83AACI+z8EAKqB23goC+BUITBKdkcB3JhvFSKdxkMZA+4BGzRWZNt32RoaJSBX5gUA+I33crR3DQBSAWYozvwuAEB35Ea6b9z+OVVUy4/HEtUS+x53YSlgjRuEKckjLqswOKF4u5CIvAEueST0VpWcd8xusZQAkb+kqfUh+ZSzbiQFNcRdqCrvjop9WH1RvDMYXvgAAK4IAG54ECD13bV47KKRRoebpwJsdRRWOTJIJHkBgKQwtYGLjfW2pyg3dZ/SFlHzG8dhAQC5MTbT6L8rANBoA31VANAP4KpeAMDFaBYVAiOTHWeAVCjlX4uUIaEVkRKQZNVWOKYw0xqRuVJ5EdY3PoQ9l9JYRa6ZHIBQOh2HmEL8hncBAHgvFwk0Him3fzmMUJqWwSWm36I3TSPJaQJBmhQwk+msctlVIkLvQEj0ELxC37raSqvjEGIoUAgObdyx0zXtQynDo7DPC0SixjoDmEaNhL99Inl/AABNAABfuN8J8zx0unocF2/AnH90nyFhDSUUT+owdtqE3PXpYi/cpZiJpHINKrfzXSXnX/MKlAwAgKUnm2n03wUHoBkG+ioAYALy8XuI35HXA9BHvBC+yWO6o9QTEC/Rsstqcx85Wz9gBIyZBZRYK1wqH87XAQDwG5wqbOwF42BZBfY46sg3GgBoRcQO4DBA17mQTKeUb2TdSq2YtCYIk4cciyV18XKzC4Q6OXB2lcPolPY8ezZZsGwlB2hbj5Dpeum98SCVYkUsRnYMXtnTwIXMqgaIXs5TV1sxFC9Am5QKXgASNeoXaH3zu7Mo2a7LVm39EAJoEAC47v/gibPV4zaMNDpLNpgnrhEA4KYHAY+8EXql5KIzckWwUgTEjGhVAwAlcmM10+g3awE120DXCwBEbAlJoZ0Q1plJJFsNUGroLKxVvKkJCEB54w0AsNsuWx0M5YM3gJw0aaTqaTnTaxArRbnhvcQ0QI2UyOqV8y4rh42SxhsuWwVvuElpgBqBEsldW5RmumC40rUCNYPKejpSwjNIUF5zcd37Vldb04M9g1UlRx2zixBQzlNmSpcBXvbqaLw+sPbFDB2kXHMepYs34bZeMdZeiOeE/Ws8LywBv0Beiw7qe8LgUJWVvisuW5VUwBZKzFv6LJVE+1lJBAAV8LDEAEAjnp+n3yuHAO65y/remtjEtpJGt3RFABCLd/KEfOFBgEU+03gKaITQQB1SjB5vxmXlIzfT6DcLADTbQIvX6GUkHx+FaVYhhrhIh0vBACCWsA3fxheVzI4qvAOXz+RqgKcw3lMCAciVCIFB5LwgEXWLPAwYP8ZDlrUueB7wnVbB27RGKbG7ABSaFQLoCpC7Tsnzsk5xXQRolpIlF5Bhr46McR3i3dsuWwlS2xcvFTc9q/4d0GF3SC7qEuwbLJTVGUktzdM0W9HussWyZgD4lFy2dLaEIzcCacsYunjlaotxYUXOEqRUS9uG7yuAE1VUpXBYrG+WMZa+uSrpLICtPsXuFIGXpo0zJNDE+5zFlrBZ1QAb+fw8/V4JAFwcqvc9ya7dcENqpXOXlEO+BLmnCA7yMp61jfvb83bNA4DHRh43buJDOpg3YBxa+5Zc+iEA0Eij3ywA0GwDfStyoGwpbnjRKLfCFRoBSXv+MDD5NZERmb+yy9Z4PyM2PZb/rcBNpKoQWGPFZI7cpa57mWKxSBQNpZxqqpyYyaLVfOe67yw7PdskAKARYzFFGGutW6505udgOCq0JrDCI4O5kwQAoEl7I/N/xzjsMMw3TzyhbuAnaQCgkrNpNhOLZeFBKqWQi0rO/BKlLa/Az2fAm/bU6H8aLjUr1H8RQmqYnjcI6+WF0fc4ZXJx39L/EnB3JvxaFDJuK4VzFlyt8BKOU3gImkDTMnn60AvCc7fosqWUm/H8PP0K+Hzlz8aLM/JaIwHAnqstnbugkAB3cpAA8wKA3+QAAAcESAQAWOpSGALYUd63mUa/WQCg2QZaWzcjhsHGioCpfIUDly3pzM/vUr4LFmhCZrG4MGNuxg2IS2oprMNGjBdB8hnFSk9ctsb8obPVLrno1Bx5kjAGfUhppyewDrXCU40GAJKRMwQgc4X4FKeGKx3nA6t1TkGacA99Wy3eXVXSHw9cVu+C5zgUsqoQeNIOuwXjsJPKoSmiYamNb3naQToGhFbOoZ91l/K8LDD0Fg6lXpctxsUVObF0ND9DSLXjYM+wkurjSN8T8H7a+0vxrjE4GDv9+nsOFx2cB2ucIYEmeY5wfRCkWH0ONfH5efqV0vIv/FxfXM4+b1QIYBXcS5KHOU0M2gOIj6H2NLKwmSwTyt/WNu6vfRjgdiQEsKa4auYMhLlqcACESCXv20yj3ywA0GwDfcNzMp66rKwuczEOFFeqxlcYJnLTJsVa+fntxFd5SyAAc4vRhWm5GeWbr8PPNRGrdgWdr1KcFWPGR+BdwFCaxqvADJwRuCEVwTODIAYPvgqlanHp6RQAECrHzQCA33Uq8K74nhybXoU5HgNuB3ORrHj0IfXJZcU1D0DMdSzgiQ8jPuy4bPgTFxYNy9v4lscHqcTAC662dLbUYhnx7zpKbQSIhR3OrsiJgkZjyjNErAgLv7XBfNyL9D0U6FvevwCZClgM7JG7LAk+kDDOkEDTiMuWGu+Fd+M+hwn4NeP5efrt8PP6xNvkC9v8aSNIgGKAlgEBzwIywmpU+3S7QoOklQjWDBAKv/DG/dUFqgFD9lwhAc7ChiuCYZky0CvG8ytk+ER6d7jJRt9SsjtMBACHkZtOswz0dfDGvDIMnxzkfOhyvAvJTdNAalsnYhE+v9Vl6wcgCCgSiAu5GcXQzlNccpUOf8lYaCV0/lYBylw/Y4tIh9sQP2V5ZVGSG3BZwasVIE1tKzn/2wBklsBlKjcEDQBwqAFLumohl9ce8N11l7ohsXfFudil+ZA4Os9xm5KNpMWjcS6lz3VlHFgk64Wxn5fp4BWyGR5Goy5bclVuoi/gsGMynXaDTG2ZW94fffj34V+j/wXSALEoywwgYInDjJOhLymGvqQcIJoUsNy8UPZ1jXKwf3HePoGb5xOXLUgzDBtuFtxfgtYZYSJxbEtB/2+BbNJMo88AgA3bOgEAdLFzOWQk6TXbQAsYkzAAG75pSk1jVyrGu9rhb2V+51xteWaOLb6Evx2kv50DEDcJ6yLkZpwgVySP+w0cIPxMBMprlI9fBACCtSJWCBij1gUKXk0RuNUqWMq8YoZFAW4INw1P3ySAYWyL5EHoglvGHbIX2rsuBd51BW7Yb51eLMwijs3DYc1zKQRkHscspNI9VfbzlOKOnQCXtngs+yCtrd3Ph9xE7/r9IO8t60O7vaW2zC3vw2n14V8zAMCncKhqZVllASMC7lMM/bJyu1p2djEgrkDIhV8WwABd/N1PPQ/gCyCgYUGaXr/hxJ0k7iNxTQ1Aw9SxJcXthgajq8lGv49uzVzlDb0uyJTX+p2HeGGzDfQFGPvSHwaPyfDhQT5ruFIx3sVGc8RdijtNGLHWx/4wYhAwQre2QsSFiW5GdqWOKuN+rDwT46RcP2MeQMYMgFMEqQJuUOsCv9sw3Sa1Z8wBkBlV3IP4rVBWewTisFzSVYsxPvQuXetdsb9Z4AuhuI2MG5XuuFy4Fu/meDS2GXhvHssEgPlHtJ81F6scvBJv7vDv1u5v/HLwS+W1Ox5gffHhRPnw7x8aAJBD9St/QxCjKnrWPd5QIALuIENvkVBC5YD55j6lNDRAPwYvwJcuK2Hc4jenxG7wfSVG1wENix5NB9B/n3/fZhr9bnIXaoYNbyOjMN/8e1PAK2i2gf41eAHuuUsVST7Ix5QDd5TiXU9B10G8Q6KhPmjEWu/ResW/xVtbj/9bWRcD1PrdpcJfD/2OrB8cNz8T46QCHlD6VdzICEzHFJDaA1oX+N1QU148WRPGM3Be5Xu1+D2CwPm5yxatGfJ9cxtUYoz3/Htq79rlsrVEtHcdp3FzVcin3qvEMeMeJR6NbdQYwzAe5h8s/od/H/5lAcDPz9vHnmEvxvyRNxItfmO+IQSMhh4RtEYQKRgHiGhmy829oLQBMEA/OG8f+YPnM5eVMH7iLqvKtdP7tnpj/dJd6s5z0aMQ+m9tstHXDkw2bAU4jAbgIOCGLNymGugPO+fDvw//Pvz78O8fPgC4QbfpV3Dz6IEbFVa1GqQbUgcxP+/72wYyPvvgZq55FNoAEPQrDRmmL3L+Ptatt96jG25Mzw0PCPffBWz0nsj4NA8Fth5Kb4k9P8/c8fhS5i+14Xvf8O5QAZCtAbbyBIGlMbqtdSk3fiu+isAKXd8fkafiPhHtUhm5r/3f3ff9fO77ZXlqBrQ81kkAx/gMrL6pzcsIzYvsgcfeI/aF94rdptDYG/B+9EHrpfXwFPbsFz4syMBR3lMD5y0BQI8gUtb2j31I71cezN8EL1ILhfQ4BKl5JsQzI9/mV1435FN/sbnhx3bHz89j/x6v/DtxAbQRAuC4pvog/Q6/5ZBiDzFU8NC/49f+Pa/7d/0E1uhNumywHcZm/Uxs3l0YZyvYH7aBuB46COg/8O/zGC5Yb+rs577v55kfG14uu2g8PYatt8YcmwvZK3f9HH9GdqrFsOMa/6NDyXLQvNF8fob6Qs/Xz0DzJnU/W2ONZwO42mqAMYM9abhy2VV6X8n5bNTtti3n73fCxrXeAzd5Kxi9YeNv8BZv/R6OL3bLH4YDJ+X5eeaOx5cyfymN3xs3FR+yYxS6mKP49QyFHTjm/0QhC04RQZVzY3/tvVtWxkJqTm4HiWxc9/1qBaowpIVhMQ6xYLx+gvKscV60cEw3bPYv4XC7T961mJdLSyG65Q3Hc4U/MmGE5zrgeRzSm6Dc5ot18Us6oEXd8yUR/5D3YH3jN/7vHsG3+cT3exP4Cg/9GJ/DJadDSUfjUNw0ZVMMAzGav88oaJwgWbAVBHEe+e90xwOBL4GHdQfmIZYGpv2sAOsjFEYapT08EggdaSG2oTr6wcslHvr9CllyGLzGuAYLxpgLkbmQvfLIz/GXZKc6DcCp8YS0cKR2fg7SeWOFQNkzroHi2H7WxipcnWsxAIAIo5MQLhqx+YgRG1IG00OKUo2Kb3fm/P1eiPlrMXnc5D3KARGL41u/h+MbJGIc/x4fOLHnp86dNr7OhL9JafzeWnwZx8CKZUKYROLhrML6l82mpQsuAwmS098+9wfCzYBmQYoqF6fA3fT9conq2FjXSeFsntTQrHlZ8u+Da1o2O4bBnsMhGuK5WCIiYszuBtIRF0mZrQA3Ek7HXYT3RhDAN/O7YOiQEzNDab0rkJ0gJN1u8NCIF+CGN373/Hie+vG10G2yXxGkmaNncv151Bxhwizaw2GwPV0UjnwGAjl3/Fq67d/1uZLeqmUpWD+T9WERSaeImzRD710gYKiRbCcImCE4s/rBw5EP/Qkaz5TLVmJFWzWtjNn6Oe4V8T7Jwch2ioH7rJEppBGSY+dnqC8+N/H2/yhhP/NY5QIpXrEbMQDwFFjBfXRQphoxLV3qlSLk0SiGe0+O3x8mEZ9l5T14k7OAznKEyW/93jJkFGDO8Yrye3Nk1ELP576HA3OhjS82f6mN3/upwjCfgjGsKWmTqFu+TnPLMqtaNbRNyANHAZxRfxjIzfghaUfk0eWWQ1IMiNzgcKyjCWPFNEvM2Uc9dG1esLgPa8+j6xFvV7FMF5YRbYPw0GPlG4qGBKboIgjAwx/TelcUEIAH9AO4jXF+/hJpH2xRXv8oEHXlhvcAbvxPiRvUqXg3xQOEIAyfyeVnWXUU9fZRTwIFgwYpPCA8qud+rm8p3hsEXqxTsGz8DG3e60Aq6TKBKnzvCfKutCnZT3n76VC8sHjoz0N/y2Rbe8m+aWO2fo5FiTrhYLwP84xrfNbpsspF6pPtEqejW5cAK10Xz03xBt1TQLG2n/G7o0iaeAFuxQDAS0NQJ2bEtDx/zhXHwiZrlLd+lRz3voTfx0IoctgtgpoYNt7kmvY/5/IX3WVlOuv3UFMA63hv0u9tKKproedvK2pv0ncpYXyx+Utt/N7owh2GA1Gqre2AituRq61ctuuyyn8o/oMCVVwPXUScsITvBMUdUTfAqkRpVebqA7T/Am5w7YqBwrEeuGyFtmMSidpy2YpooXmRAjRo5PsU12M/3PgsrQuWmOU44ktFJwBVJHn9TSiHv9R90Coq3qED+hUYUS4CtAWCVfiNsSqk3DJfQcydY9+9lEmBhw+DsF2nFwXTNP7LMCcbrrYc81viCfTTXL+CuD9nR2FxLFQqLBk/Q5uHwlys/1EiUKUJSA252lK+eIFZh+eH+pELG3th8dCXud9UbCvWbFiBd9+CPWH9nPeKhPKeuNqCULLGWbyMx6bZpdTzcztybnYrujwhUIzfHWXSO1GzIwYAtPKYKIm6rxgx1FBnyVScGG3DNELlTjvADly2CBAeBFxmln+X6xRYxX+sv8EDCY0Vvjdqg7PaXykBAODcYb36BVdbDQ9/bycAALT5Tm2aXCy7cLnUKhZrkXWkyQ+z/O8waDloqolSj4EN9lOKO2IaaB5Z5T742zdguDvpwBJDhGVlUbtfDnf5mdQgkLoR1cC87BmbvSVATuPqlVaJUo67tjtdKXCXDmIEAXz4y3rSKio+ogNaquh1Gd9Yam4cw97mstBdQLZtgdhuH+lDTNHtbBUANtfwSAEALMXMRYNQT2PCyIziuD/qoyDwwloF2s9QYZSluVkBlAsPbSvelX4CuKiAyv2UlX7Q6ziohE824LCVuefvqxUZKwOILgV+rpUP1sKJswpwPyQ7atmlHqUv3AcHZFutc1PmW9Pr4PfEse7CGsV3avN77H4MADDC4LKqJ2TEBARIgZcD41bRE9gwjS51K8V5cONuwO1bq4iHxUKKLlunoNtw90n/+9T/vHIgHdKNVKvxzpUHsbQjhgBEq3zf6bXh52gTVKFvMb64Ga0DMKVM6bfOLhhjoVWZFzzkd8izVIH33jcOO9Zvx8NTAzucQ45s3DzrbUDRFhBGbsHpJWVlz5RdttiSjBX/exX20i7MCxZmOnR6VcT2CDkNqyRWlbWrxV27nF0roOouKw6isV8iuxGqqPhcOaCHoGllpU8I3M/BzUnaALmc+12tQuiCcjvjstDyrBQAIO92Bn+3T2GtIrnHJ0kbheP+WIluHYCXjN/6GSqn9isXnz2aS/E4nRgetCHF6yZ26CjSj+zDScgeYS/snqst0MXf1zqbeOzWz7kmRrerrXmzSHNaJdB+QnaJy5LHzk8G9bgveL41dVUEYFiIjku1i41H4vKjGAAIud2q8FE1I1alw2iZbk3NAgCIivAwwPrx+Df4kffoIC+5rFZ4H93sUvrng/3v6QBeVLwVVQIJEksfdLUFYbAaGtaGx0W+AWPjkrDzRGjTAMBeQisD8NM8F9p3wbWEJYjXXLYg0w4AM/ayoKsaqxuuu6z8NIMdZJRrOhUp683StuglTgIftFwmehVuPf9fe3fiHNWV3XE8f0xSSSUTJ5mZ2B4H29gYDDarBNpACyCxaEP7LpWW1gK2/+aXwfWu+fWvz32LBNhJfT9Vr6ZGRi11q/vdc+8995z0Af5ZBo59+7femjm97zZtqfdBJjktDTraCts/d69sT1mrU+Ze61wQ4P/9tMh3VLwTDNDP7NKVB82L0MDwWVDDYkJ+/4mit4xyWuLV7Sid5BzZAK43aO/ytxlsa50V3Y3Rdi1PwKujjmb2/V/ZZ14/c9HXNFges8+hTnzS3yUtR+9KUOATp4ngOe8U3Y3eosfZDx5n3CZB2ppdB0oPAKLVaW37fSQBR+7rryx3ZiCzipzeu0cWiOfu15MyMYhm6GcSSO7IY53a+KCBWzoR4/1VpoPx46dgxfuZJcderwsAHmT+yMc22PlNbMdm0tEL86ECgL4i3y/8LHhRcoOvL+WPyxGP3DZD9EZIbZMP5Ubi0ZkGV0d2Q/eI0muVTxe97Xx1kF+pCA5eWTLM/aK3+56XA/Zrw4ILj171tRsPolX9vrTHNy+nSxaDAOYgyP3QlRFv3LNi2fsTRW8zmdngqnq/Rf9e9zajQOpQlvx25AYU/bw3wefnlbwuSzXvu0l5zauS06IAQPe8fd/1Uea1rgoC6gb/qKPihCVfRVcatNdkWT33b2fkvejLptr74qDoboLVsb18X8LXJdonthfuuQPa/VJXefyxdXDsz+z7a6fVQ9n39a+t2H73cHDv3Q22MJdl4HudWdWLHkd7njR9nCgA2JfHya0A+AqXvjaHwWw69/U5S0TNTYL2JahasdXf3BZUtFp8LIO8PtaWvU5bFtB/I6eVdCV6LlgRO7aAyyeyvybH1gUAA5mB2pfTF+yGvSGR71GDF+Z9BgB3i7hf+I68KBrN+izeappYawAAIH9JREFUW/POWO7C3WCbQQeoE9t70T/Mify7I1tWW7UIOoqUh4ruWuXjRXc7X90K0DdY9LVFW0IflKMvepxuLnND9b3f1xWR9UPLrvcZ8bEFXC9k5jeX2Z7xzoneHOZlMDjrsUSNnj1Y0Ct6v+X+rZ4y8OeryTmaLOqnLLQFtb4PopMW6/a33bVl6dwqxKHcXPU9s5fZd/U8mKgRT1UQ0GTw18SyaIC+yLVqqz/RwHVoS7w+269K4hvLHM3z0wMbwfJ21LJZ72d+amPJgu6OrH7413zfXvOvcgnYGxK86Gw1WtWr+jtp10VflVjPBADzMhBuyHJ5boD1kzYvg61FXQnJfX3JTixFk6DUiG7DPsd1AcB4sMp8GmwDL9hKcSe4x0XJfy8tF+1U3ktntpWtK8m/NvA67wqAz/bW7FzyqmUWR7OIDxUARAlY0ex6S2YMniewHyy/DEsS0UDN8pd+WNaCQb9jN2zfJji2Pet04x0oupvrjMgxFd0KOJQBeUdubIfB7HxCnpsmG+kZaF1KjZYgXwdJXb63lsstiAb09H3RMtzrzH6vVokbC5b104mPh5mEMt0u8Evfb7l/E82+c8dz1oIbybbNlt/I+6DqtMWezFZ9X/phcDLiMFiK1gDA20BHN2xvxFMXBDQd/Pszk47dhttQuSvKDYjuPW+K7lbdPtufk3PaT4vq3u9Pi+7mRJ5YuCVbBMeWd+Q5TX5qY9cmFBuZr/nSf9rjrjqCvWR5RSc1227RSo2egjiULZBodXBMPovT8jlZtPEmGmA1P2IsSLjdl/vprgzg0dc90TqXJHkgE9uOBY11AcB6MDAvyWu3VhMAfG/jj2+nHsln1lcaPD/o7Wf3XpscgNmKHIC9orvv9mrRWzzF9xE/VACQi5D0D68DSN0Wge6b3JHjbH4EZUtu3Bpg6DLtgWwHnFl+xIYN3FEC4n07EzwQfJg9YeXInle09K9HQ25ZclxKwnqcWYI8q4imxyW4iAajo4ob34gl4uiHJ/qwaXOYFHBECXrprHWUUX6Sud6+Z36R2Vp0+e+j+7baGjtlSe/bloBex3J6ocmpi9cNAwD92ZqcpYlqp3IccV8GE71B3mgYBKTPqX4mqgb/WxWrjqfnvE4aBgAnkoh6WBMEaLLeuJwE0dMW2gzsVcXgrwm2dQHAgtxPTiUgjb62WvE5zxVh0zbme8FS9ZLdj6KqjNGprhMJrDaD7cHocWYbBADa9v2h5Uis2eTnIFgF0K/r+zva4t2T7+nI6YbDFisAFw0AUsAznElS1GDNtxM8P+jX1aC2pwB0eeXQ9rJ0NuHFW7xIwsAHDAB0jyTa//SklrokPs+c1D/C4+A4oC/v6PLXns30daDflsF63/a4tYjDl0V3O9/c0aD0u/zUcOn/7fO6Ysfj/AY/a4+f2/fXwhPpHHaUOd6xUwNeYGe8RQDg/Sr65QjZAzsG9kNFABANImdlAHDWYpDxgkoaNB3LzPjkPQQAnUxm+rAliy7b6sOOvE9+DrLUNyRTXW/Y3t55smIF4LUEKOddAdB7Q9sr+tv46t2WzFiPW2wDTNsqmp628OV/31rJ/RzPbYm2M/X1PZBVpMOKPBxd6btvg+5LWerWTP4TO+Lme+XRzH3JthV2ZPA8ySRX68rd44rA3P+Ovh2qM/YtS9zbtn12/7qubPjqsY8P+vl431sA+xUBwC2ZlOvkczPIHVgPtoQ8p22oSQAwZEuZi5mjGqfyQT8u4iIlzz7CMcCrtg0QLYG+thmJ/hGjbNdhOTvpFZii44C67KKR2bZtF+hSf9WSTXrN3g7U3hzFZ5q+B/ZTzaxAC2BctuDCS6+22ffX0pM3LrAC4AFW1QpAVFJUG1QNSx5HFADklpD1/dZ0mTmXiHoqy/sHRXfxLN8C6DTYAqgq7KTJoqmUrR510+zvjg0eqSqZnlVP75k+G/xf2raQ5wActdgGyAUA+xe4ovPjujKznEnWq0sEXLQZsWajr0qg5Y/52mbFvtKglU0fBAm/vpe9J4NRp0HAPxSs2qTBUZf9dfD38s25vXutmLksKwrRzDd91nXl7lGLACBKiF4MBr+01Zr7um9Z5upN6MRxpUGOwmiDMWK9RRLg3SDYWQ3+7uvB6Y79ILgcqQsABi0hLCVU5UqUHtrRmY69ETWb/UMFAKnmfF+DWfpOsDUQnXdNA9n3QYARHQfUWfy+ZeUuWTbqfib5w4//peW7r8s8gKiy3lyQvPMmuLF7MKblIW8E2wsv7Yxu031/nXXnsuLrcgCm7STFm0zGu9fb1vyFKdmzfWhn2aflhh0lkEXvtyaJZtGKx5EclUzLoVo+25MATyybusmlRVa8TrvPkA5sG++46K0RoeWq0wkAvy+8khvYgXyOD2UW2CQIGLW8o1kZnC96aUKvBi9e43/NjvB1Ko4CrmbqAKzaEv+JBEQaTORWFbR+e10BoCaJgB70ewLsmv3tjmTyVvU6RonQR/J51oTAqgDgus1umwYA/bZCra/9kQVCua97QaDhzH29YysAOgHOJeGO1WyhdyQA3LHjj9ExwP6aiYUmli8Gr7uPK2N1AYAXMfCs52U77qLFM06CY0x6ZvZDBQCXM7P0KFlvr+HRu/vFu65iVyzPIHcc8MgSM3RlQQf8w5rIL/0Oqab5lYbJLydyzOi0yBf/GbWZuu6paYKhBxZV+/5R8ZWqc/HHlhCZsquftzwF4P0qtHvejC1faiQ9U3HMLPd+qztqlqtMqPvheuRxpuiuzPcmSCiNmi7N2uxMmztF+SqLNlCk135TBoBo8NBtKL8vVA3+WoilKgjwY2/p8efk+fmlTZK0tkF06cy1v4gb2MzY8cKoGNCbol0lwDZFgJ4Xvd1Kb2WOAi7b3+xQEq5zRwGfyWN7Auyh/Z5NVlJyidBnEuTsWSAVbW9ePWcA4EXRluz561ZI7utRSeCHweRjX97bmtvQKeIic5ooGW2hHwVbgOk+nSsEdD/zt4tm+bljh12r23UBQFRqUTOfN2XJShNdNm25Nvqw5BJxosSMZy0CgC+L3mIJUbKeRnPRC+SlE1PP92+Kd33jq44Ddore6lMrRVzyd8f+iLktiBtF3BQkWvp/LTdhHzhXLSlTtwL6ZH/wWcW+f3TOuKr4ymARV2g8DlYo5mXw9tnOWWY5azDYqlqxEyo6CGhd9Vyxmbr3W9XzzS0j+vt7Vj4/vgLwJthimZXvWbAZsldHrLqp6g1507YEvFjUjKxq9GfuC7nBf6HoLQNcVQlQV5+8zbB2d/NiT9u2nOvfo62H0/s8JYt6OWDP2vfjeycNA4Bof9/LAKeATcsAp62qe/Z591oDuuWis9roazqpaZP/UpXn4lusWtbbH69T5CvDnjcAGA6Owu1KEmv63OS+7luWqSmQV9jT7RFN2j2U53uUSSgczGyhR6WAdWUot11btXWpKxC61apblV2/X9MAwG+GnliQoti5INkhFy3rMp/+od9Y1mI6h75gN6lcAODlEv1Mpw/S0fJJz3nJcvn/66K7FnOT44C+/D8TbAPobCx3/O+OZemP1Cz96xEXrd1wYMcyvRa2lxxdtA+QHi9MM8QmxVeq6lZ7JcBcxbvzVAJM+/M+QN6RlYlHRXfZ2DYrTrlys1EiUccGdS+gtSUJU1HynG4X+Pf4a5IaMEUneTblZrYt2xfaV2JPPoO5AGDaArTj4uK9AFL+yYBsFY7LFW25HRdxwTH9vtR1b6B418f+jiQepkAgagi0GLzeTQIA3d+PagikoCRqBHRbEnO1tXQuH0B/XvQ1DeTa5L9U5bnkGnttW96G1pyIesPUBQB1eTb6WU0/c1eS0KOv58oA/2D5Y5oguWHHdreK3m6ha0W+kFOuGZA/3kqwNTaYWc3zrcsleX9Fhdy0X8F4XQAwXHGUTm9M68GN7KCIi7zk9kZ0YO/ITXtForhtmWnkbsifl9sA38tsYswG6W07vxnVTdZ2ojeLd72iUxb+zWA25HvbZ5mz1FHd/7Oa43+3yg/KvSAxM5eZv1nkS+7mtgKqale/tsCiTfGVur4SZ0FinNe8z5U3fVSRuZvLgk3bHSkreqDoLgPaphlQ1HAmWkY8sOS4XcuUPrT3Qu64bfQ9B8FRn6hjmB712im6C3kty1HBDVmN8VoYw8Fy9PvqBnit/L3vyt9lsCZB7JeKGWr63oHy83qnXMW7Ws6uUyCQGg8Ny1n+XEvgdRnUc6WAN4rqVsCPi95WwPeK7q6F35UTjqtFXABsJhgEVjNf80Y+TfJf6j7TUWvvBRl01uU+oZUaPfHzu4rtqtWKn+/biqtBvkLu67lGQH6P1YJo2uJ4WY64ezvtGVm219ykXDtgfbwFOTWnr1GfnfrKbV3OyHssKuSmJ/IeNUkCHC/iimx+Y9qxm9JpZikxfTBHit46xrrPclTzuLkb8n/LNsDNij2dtA3wS9FblMcz72+UN40vyuvbikRDfR6/ZGb1nr35c4Pjf2k24NGpL/37LPlVsDUQHX9JPyvXYetMfsfzzBY0Y3cyMys8laDsxJYRO8E54ibdAH/OrEJdKd61hr0lwUAuADgrqtsBe8vZaBlRg53Xtv+nHf800Sg6bht1BDwIZnrXg0xpbf+qWyMaHFQd341q08/JwLha9LZ8nQiCgHXblknL85fLz+6N8vN7W1ZrcvufJ0W+5Pj98vtvl493vfwMf1V+prX18G0JBNJJEk0o1YTBBQmOolLAKR8hKh6UVopSUHK3fO+kVtJXytfhUvm7Xs6s/kWDwFzma97Kty7/pcmq3l1ZqUm5FDroaA6G5zno0U9vcFM3wGl5cT2lNB/kfeS+nmsF/E1wzFUDQc2/mS6/Ni1X2tLxltyaoDwpW1me06OdIUeL7hoZtxtsXaZtyFwhN33swSaFgHzwjLoBntoNW+tcb2eSiarOt+Ye91ROGuSOj/1FBukbRdzdSZfFPalstujtnXytjMQ/kxUGTTQcL3orl50U+a6C0WpB3fG/6+XP9Zr6K3b0yjtTRbUBTm3GqFseufP6P8nZ9PMUX/mxyPfG9vbSmmDje6jLduN9FBz51H1pbVGrR+Qula/nleJdC9q+mmXF/YoA4AdJEr0cbHn43p92OevIHuKenTTYKuLOaMeySrAry6s60/OZYzpZ8VwSCGfkpvxCbt4zkoA7aqdF7smM/Ikl683b4D8cDFh+I34spzPS4Pxt+funFYH+zL0o1/DJk2evlYP9N+U94rPyZ30pgUAKCG8X7+pgDMlWxGPJSXhRdHdJ9FLAL4reNr+6zN9X3j9+LD/bV8vn/HX53vy8nMykHvDfWj5AbhCYynztqfw96gaRqkvzXH6wIMAHHc/B8OqJaWD7uugu6tNkgBspuktST2byPiZr8kHSvv/18jW+JKcS+i0QfFw+B70eF+/aZj+RLZ3UOO47O6I8XD7/FFhGj5e2hFLvmbe/S3Xjng+hiAvN+A37MHMz0xtZtN+iN20vIqJZt3qz0x7pR5kA4D+Ld32Tvw/26n32cJQ7I2nH4y6VH8ZPi+6uTFXdB4+KuPCFH0s8qshB0CDkqyKuDKaP4a07PVDQXt+7QdZq7vha26uqalfdnpiX2PUz0i/sxnuvIjN9O0gQe1r+Lf9W5ox8I8Fi3bLiatFbIvqerBL9T/m4uWAnVQPMPc+UHf6q6K5DvpX5nk2Zsc/bTO+y7Hf3yaCdEt4m7aasN+9Jy0ZPS6TXMkGAJutN2mDjA1Z0Ix4oBxMfnD2QHw8SPasaPmkC75fl4/7p79d/lD/r0/LvpQHhNVkZSlsRg5YnMCFJe4P2+o7Lv9Gb+X3Z308DfwpKvirfO2+f+1//fv3X369PyvvZZ+XvfiUYTDx/Zazia0OyIlL1/VWX5rmkwPmOvEZaf0NzMMYswfG3ga187ds8t/Tzb9u/HQ/yPnJfH5H33A+yxfvZP+C3AOBW5oa9UHNj2rL9L58R9AUfaC1IsVFzg/SCE7pk/olsA+jekm85ePKGJ5XpzPub8ibx5/LDeSlzHLDusZ8FWyrRc4lmMCkIiWqDbwWJKAuSaOPnfaued5TgtXWOy/s/XAmWw/TInu6J+VHTxZpZ6c3M2fQlOx+v+36flDfZzzNHR3PLivMSzGqJ6LRC83n5uLlgZz4YuPR5auGdF7L3vFTzPTMSGKXPWQpuUhBwT/IctEzycHDzHpVZzL3yPZiWSK/VJOv5TfqO7K+P1tyI/1QOeikQSEm3fi+Kujh6wydfwXv7t/kLd3agWQBQdcOuujFpMsPLYEZwW5ZYvJZ43Q1yoejtM6BJRP8m2wDRkb10tC1K3piWvcMH5e+YZt6flbOGP5fBQJvH9qzXJzZIRc8lmsF8UfR2B/PXYykY7Or+rT5vT/BaDL6nyeX9H76y5TDdE3tqe2J6U5+x5KkJWx67WQ5MXp3uhe2t+d7cP5dBwKeWM1K3rOgz3H5JHvqyfLxPMp+dSckun614nlOytJj2nuu+RxPLfp3pcQcDcJEAIHfDTkkRL4Ib9qzdcNNRKR3803l2byjytOYG+TKTdKFR/7/IspnPHlKyyrPgcV7Yjb1PCu9cKmf+/37Bxx4LBqmq5xLNYLzgjf+sKBGl6t/689YEr+eZ72l66R7p34IgIO2xPrI9Me/iF52Rvmuz0ltBgRfdW3tie3P/WM42NVi83mBZMZrhXpck0b+Uj5vb+0vZ5ZMVz3NUEjLH5GjaZHA9kSX8NJv+dXmVOxiAiwQAfsPuD5JinmZuZp7M0C+D/xVZEr6dGQhyN7so6WJc9hH/qRyo/yo1AW5Yssp4RfKG3thTffy0/P+v53xsT3wZssEg91y0SU/KQdBgbCz4WVEiSpN/Oyx7lIP2tzjvlfaQh/g0AcD/rQDAO8MNnPN6YOdcvW3rw5prWGY21yypKSoW4vuLab8y7UP6449IkKL7pX4Oue2VzobfDZKxPLNUg5zxTPJV+v6BzPMYtj3bq7IPfC3IcH6Q+X01Q/lm+fv3l/9Nr375m+qMfqTi76i/37UywPo0k+TU9LHqWgGPWAJU274BP0gy2JBktlddw/KeunOO93yTz0R6/jeLuB+9rxKMZd5vGgC+j+d63Z5vk8eoeszb3I2Bjx8A+Ox87JzXqByB6S+62z8+CZZqo6MRaQatdfBHZTui6qiHzmongsfXm2CT4KLpNSaDyM3gONYz2/dO2xy541d9FUvcXkM8DbKeBKZnnEcrMnVTwJUbVB/Z39QH1KcNf7/vbAn+zjke63bR21I0CqrSikjbvgF1KzxPGqzCVL3nz3P5a+nH0KaD5LjJYNvupSXovo/nGv092q4eda1McTcGPn4A0G/781Mtz4x68YG0B67Z/1Fxhag4QtpLvmX1CXINQ7TYg+9rT2cSxMYbBhdNryk5q+6lPF9Ikt2yJTpGR92igi7+umkXsYHyuUTHwCbk7xmd1U0B17AVw4i2ZNLAMWwD6kyD3y/NFr8uujscjrR8LE/c80Fu2nIiztM3oCrHY7pBHkbVe77t5c//flCIZik4HjddxA109Ojg+3iufcHfo23+SFduCndj4OMHAHqjnA7KCja95qyusZ//13KIUblFzSbX8r56nK6u/ee4ZLYvFfkWqk2Ci6bXnPzeUTMPrS+tRx1XgmI3XnVwPnid5mxgGKwoBDMdVOyak4BrUnIXvB20D6zjQdGb5aDM5ZxVHUyFQKIOh1MNHyuqCLYQBFVaQaxt34C6Ux5LNScxxmre822v6Pn78dJNeU9pWdQ1e7+tWfGg9/FctVX2dOb0SZPH/O10Cndj4OMHAH6jbFoz2q+VortBgtbmXy26GyKsS6GU7aK3Icmdorez3HpR3bYyaturP1MrxDUJLppe2nBnSM6D601aq9+lwkFRudv7RW/3LX2dNmz14IktX0crD1qz2+t1z8iJhFw76AWpWaB/jzV7fdPvp1UHx+SYYyoSlOtwGD2WF23ylps+yGkRoLZ9A7QnRlTnYStTi6Hpe77t5c8/17MjlQ3elQJDW1K86zAon/s+nutgUOWzbR2JrvoU3I2Bjx8ARFXh9s5xRR3UvHNWuiFtSPnZTlDfvCoAOMuUoc3Vd+8ENeLrgoumlz/uw6D3gXYlPJRByBvePC2qOw8eSvC0LD0HxjPLw9oMZq+IO3YtSkGaqB101HntedHb5EcHoXUrUJTqLdws4iYzKzZgpb+XD4A+oOv3HFkvhqlz9A3IvX9y12HR2xY0955ve+X6Efjvpw2p9qUwlz7XNp+VNs819xlqWkVy3ytUcjcG/hgBQKdhPfh0HTUMAE5/hwDgtEUAcNbiih43amSiA9SWDZo7RXe3sej32pMyzEdF3Pt70Gaf2g42/S3T75x6du9IMDEfBBzRa+xbAKmFsDcg0naUac/4rlXyizocnsjqyLItgUcD+nHFgN62b0DV+ye6mgYAJ+e4os9T1JBqLwiAoue61eKz0vS55j5DTe8ZBADAHzgAuOiM5SIBQK65z4cOAJrOXnIBgD7n1BnOZ/vapKjq95q3Wvf7RXdHNH29Rmx5WH/Ga/kbaTCgwUTaR9fBuJNZOp6QvWN9PsdyY/dWvmPW6MVbBXeK7tbTUX5EbgXgxAZAndG36RsQvX/qVr2qAoBVK3Pd9toMgjzNAVi2ba51qUipz3UryAF4H881F6y2uQgAgD9QAOB7zhfZs2waAEQDmu4T63L6oQxo2w0DgDYDbZNrT2YxbQOAFRtk/fujEsDLtpoQBUzR4KjdFLUn/X45WKcWs/syUKTZ/FnxrpOgDkIPZGD1PvEaOOzKoKMJkr69kQZxHfxXZa9ZT0hEOQBRl7gUdLTtGzBs/RdWGua9zAerFDOZUtdtrmVbRYkSV5cssXa24rlqb4P38VwHglWntnlDy7ICM8bdGPj4AUBV1vlFspZzAcB+EAD46oFn9GuXu9floOGDU1UA4Evt581gXqsJAHK9zI/Lf7tt+8K6ijFV0QTIVwC2LHfAuyCm5fETmWktS5e6PVm2P5GVjWMJsHYsSWtCTmf4QKTJjrmWugOZ98S+BCGr0lNh0mokRKcAqrrEte0bMGABQ5PTMHqU85GtkESlrtte+th3i+7OfH7UNZ3WiJ6rl4J+H8/VA5LZc5wcmtVkVu7GwO8TALyvxjDasKcqAFiXAKBqMNeM/rS/eCwzzFe2z1wXAKTVgvOcYZ5vEABEHQN1Dz/977Esq/pRRm8DfGA5AJ5o97gm+UyDn/kyEEh792kJXfMa9GfojHq06O4N/ihIOqxqqfvAApXlzL+ftp4KfUEDn6ngyKJ3iWvbN6DP6iE0qYcxJcWcBqWT3XhFXf82lxbH+rGm2JX2GHhcxP3Hh6UK5EWfq74PHp+zfkgq5PVrzQjuxsDvtwVw0daw3rK3TQDg+4vRYH4gS9abtsc8WhEAHAcBQNsqZrnB1QOAocw+7a6cADgsvy86BjhUczpB93r1qF3V8TN9rXTpWM/F66kG/xlpRj1clh3+MahKF9VS8Ja6/baMn/v3aUl+SGoIfB/8zZ4EvSl+67HAJxsA2uUA6HnptleTJEA9OrctA8+6BQC+R6lL15u2H/lYaovnEpt0z3yyZR3zurPdmkme26ddk8Bq07LvX1hRH88j2CivdVvq1udeVYBmyX7Oc8kv0BoB6xU/I3UtvGz9CoZqqinqsvMdWzmYqvn398vB/+3f6ls+qQDwcQKATssjcVEAULXcu2wDz4qcax8L9ijn5Xs0Q/yplJytSmxatSzoK+XAcrMcmO6VA5pf9xtUd9MKg748ngbbV7K1slh+z2yQ6PZAfl563gvllar4+VL3QIMStPpztG3wXKay4bT1WUhdC7+wvgN1/RS0pW5aORho+O9TC9633Rgv8UkFgI8TAJynKE5UuCS33DuXKaebKtvpHuVTSzLyGvpDMrDkEpvmrBb6l+VAdrUcZG6U+9t+3WswuGqPgWifdqr8fV9aDfQp2+Ptk583Jg1fXpTX83LgfxK0E65rQqM/Z8T2fnO9DXpaFvNpAYD/XwGAJ66tnbMkrid9VS33+v9/ZglGUQLXVJCMpEliVYlNU7JHPFy2pv2iDAQul8HAt3Zdk6ZEVYOrdhm8Zm2J02A7YTkFE9ZFMD0Hf97j5b+dsM6DQ9KCmIEZAHCuAEBnuDMXaIrjSV9Vy71jmZa6g+VgeL0cDPvKxxgpB0RtOzwoA+f3/CUBAGgXANyX1qyTF2iL+5zWngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgd/C9+dIkHiNlEbwAAAABJRU5ErkJggg==";
  return image;
}

function fnt() {
  return "info face=\"Roboto\" size=32 bold=0 italic=0 charset=\"\" unicode=0 stretchH=100 smooth=1 aa=1 padding=4,4,4,4 spacing=-8,-8\ncommon lineHeight=38 base=30 scaleW=512 scaleH=512 pages=1 packed=0\npage id=0 file=\"roboto.png\"\nchars count=194\nchar id=0       x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=0    page=0    chnl=0\nchar id=10      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=0    page=0    chnl=0\nchar id=32      x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=8    page=0    chnl=0\nchar id=33      x=332  y=146  width=12   height=32   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=34      x=22   y=267  width=15   height=17   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=35      x=365  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=36      x=487  y=0    width=24   height=38   xoffset=-4   yoffset=-1   xadvance=18   page=0    chnl=0\nchar id=37      x=0    y=210  width=30   height=31   xoffset=-4   yoffset=3    xadvance=23   page=0    chnl=0\nchar id=38      x=392  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=39      x=50   y=267  width=11   height=16   xoffset=-4   yoffset=1    xadvance=6    page=0    chnl=0\nchar id=40      x=0    y=0    width=17   height=41   xoffset=-4   yoffset=0    xadvance=11   page=0    chnl=0\nchar id=41      x=17   y=0    width=17   height=41   xoffset=-4   yoffset=0    xadvance=11   page=0    chnl=0\nchar id=42      x=240  y=241  width=22   height=23   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=43      x=183  y=241  width=24   height=25   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=44      x=37   y=267  width=13   height=17   xoffset=-4   yoffset=22   xadvance=6    page=0    chnl=0\nchar id=45      x=194  y=267  width=17   height=11   xoffset=-4   yoffset=14   xadvance=9    page=0    chnl=0\nchar id=46      x=182  y=267  width=12   height=11   xoffset=-4   yoffset=23   xadvance=8    page=0    chnl=0\nchar id=47      x=471  y=41   width=21   height=34   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=48      x=481  y=178  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=49      x=171  y=146  width=18   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=50      x=189  y=146  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=51      x=434  y=178  width=23   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=52      x=213  y=146  width=26   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=53      x=239  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=54      x=262  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=55      x=285  y=146  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=56      x=457  y=178  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=57      x=309  y=146  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=58      x=171  y=241  width=12   height=25   xoffset=-4   yoffset=9    xadvance=8    page=0    chnl=0\nchar id=59      x=161  y=210  width=14   height=30   xoffset=-4   yoffset=9    xadvance=7    page=0    chnl=0\nchar id=60      x=310  y=241  width=21   height=22   xoffset=-4   yoffset=9    xadvance=16   page=0    chnl=0\nchar id=61      x=0    y=267  width=22   height=18   xoffset=-4   yoffset=9    xadvance=18   page=0    chnl=0\nchar id=62      x=331  y=241  width=22   height=22   xoffset=-4   yoffset=9    xadvance=17   page=0    chnl=0\nchar id=63      x=344  y=146  width=21   height=32   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=64      x=0    y=41   width=35   height=38   xoffset=-4   yoffset=3    xadvance=29   page=0    chnl=0\nchar id=65      x=68   y=113  width=29   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=66      x=97   y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=67      x=395  y=178  width=27   height=31   xoffset=-4   yoffset=3    xadvance=21   page=0    chnl=0\nchar id=68      x=122  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=69      x=148  y=113  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=70      x=172  y=113  width=23   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=71      x=195  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=72      x=222  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=73      x=492  y=79   width=12   height=32   xoffset=-4   yoffset=2    xadvance=9    page=0    chnl=0\nchar id=74      x=249  y=113  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=75      x=273  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=76      x=299  y=113  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=77      x=322  y=113  width=32   height=32   xoffset=-4   yoffset=2    xadvance=28   page=0    chnl=0\nchar id=78      x=354  y=113  width=27   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=79      x=381  y=113  width=28   height=32   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=80      x=409  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=81      x=294  y=41   width=28   height=36   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=82      x=434  y=113  width=26   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=83      x=460  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=84      x=0    y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=85      x=485  y=113  width=25   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=86      x=27   y=146  width=28   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=87      x=55   y=146  width=36   height=32   xoffset=-4   yoffset=2    xadvance=28   page=0    chnl=0\nchar id=88      x=91   y=146  width=28   height=32   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=89      x=119  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=90      x=146  y=146  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=91      x=34   y=0    width=15   height=40   xoffset=-4   yoffset=-1   xadvance=8    page=0    chnl=0\nchar id=92      x=0    y=79   width=21   height=34   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=93      x=49   y=0    width=15   height=40   xoffset=-4   yoffset=-1   xadvance=8    page=0    chnl=0\nchar id=94      x=484  y=241  width=21   height=20   xoffset=-4   yoffset=2    xadvance=13   page=0    chnl=0\nchar id=95      x=211  y=267  width=23   height=11   xoffset=-4   yoffset=25   xadvance=14   page=0    chnl=0\nchar id=96      x=139  y=267  width=15   height=14   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=97      x=363  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=98      x=49   y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=99      x=386  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=100     x=72   y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=101     x=409  y=210  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=102     x=95   y=79   width=20   height=33   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=103     x=115  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=104     x=138  y=79   width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=105     x=422  y=178  width=12   height=31   xoffset=-4   yoffset=3    xadvance=8    page=0    chnl=0\nchar id=106     x=136  y=0    width=16   height=39   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=107     x=160  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=16   page=0    chnl=0\nchar id=108     x=492  y=41   width=12   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=109     x=432  y=210  width=32   height=26   xoffset=-4   yoffset=8    xadvance=28   page=0    chnl=0\nchar id=110     x=464  y=210  width=22   height=26   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=111     x=147  y=241  width=24   height=25   xoffset=-4   yoffset=9    xadvance=18   page=0    chnl=0\nchar id=112     x=183  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=113     x=206  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=114     x=486  y=210  width=17   height=26   xoffset=-4   yoffset=8    xadvance=11   page=0    chnl=0\nchar id=115     x=0    y=241  width=23   height=26   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=116     x=142  y=210  width=19   height=30   xoffset=-4   yoffset=4    xadvance=10   page=0    chnl=0\nchar id=117     x=23   y=241  width=22   height=26   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=118     x=45   y=241  width=24   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=119     x=69   y=241  width=32   height=26   xoffset=-4   yoffset=8    xadvance=24   page=0    chnl=0\nchar id=120     x=101  y=241  width=24   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=121     x=229  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=15   page=0    chnl=0\nchar id=122     x=125  y=241  width=22   height=26   xoffset=-4   yoffset=8    xadvance=16   page=0    chnl=0\nchar id=123     x=152  y=0    width=18   height=39   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=124     x=322  y=41   width=12   height=36   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=125     x=170  y=0    width=18   height=39   xoffset=-4   yoffset=1    xadvance=11   page=0    chnl=0\nchar id=126     x=113  y=267  width=26   height=15   xoffset=-4   yoffset=12   xadvance=22   page=0    chnl=0\nchar id=127     x=419  y=146  width=20   height=32   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=160     x=0    y=0    width=0    height=0    xoffset=-4   yoffset=0    xadvance=8    page=0    chnl=0\nchar id=161     x=30   y=210  width=12   height=31   xoffset=-4   yoffset=9    xadvance=8    page=0    chnl=0\nchar id=162     x=252  y=79   width=24   height=33   xoffset=-4   yoffset=5    xadvance=18   page=0    chnl=0\nchar id=163     x=439  y=146  width=25   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=164     x=175  y=210  width=29   height=30   xoffset=-4   yoffset=5    xadvance=23   page=0    chnl=0\nchar id=165     x=464  y=146  width=27   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=166     x=334  y=41   width=12   height=36   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=167     x=64   y=0    width=26   height=40   xoffset=-4   yoffset=2    xadvance=20   page=0    chnl=0\nchar id=168     x=234  y=267  width=19   height=11   xoffset=-4   yoffset=3    xadvance=13   page=0    chnl=0\nchar id=169     x=0    y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=170     x=446  y=241  width=19   height=21   xoffset=-4   yoffset=2    xadvance=14   page=0    chnl=0\nchar id=171     x=353  y=241  width=21   height=22   xoffset=-4   yoffset=10   xadvance=15   page=0    chnl=0\nchar id=172     x=61   y=267  width=22   height=16   xoffset=-4   yoffset=12   xadvance=18   page=0    chnl=0\nchar id=173     x=253  y=267  width=17   height=11   xoffset=-4   yoffset=14   xadvance=9    page=0    chnl=0\nchar id=174     x=31   y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=175     x=270  y=267  width=21   height=11   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=176     x=83   y=267  width=16   height=16   xoffset=-4   yoffset=3    xadvance=12   page=0    chnl=0\nchar id=177     x=340  y=210  width=23   height=28   xoffset=-4   yoffset=6    xadvance=17   page=0    chnl=0\nchar id=178     x=374  y=241  width=18   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=179     x=392  y=241  width=18   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=180     x=154  y=267  width=16   height=14   xoffset=-4   yoffset=1    xadvance=10   page=0    chnl=0\nchar id=181     x=276  y=79   width=22   height=33   xoffset=-4   yoffset=8    xadvance=18   page=0    chnl=0\nchar id=182     x=62   y=178  width=21   height=32   xoffset=-4   yoffset=2    xadvance=16   page=0    chnl=0\nchar id=183     x=170  y=267  width=12   height=12   xoffset=-4   yoffset=12   xadvance=8    page=0    chnl=0\nchar id=184     x=99   y=267  width=14   height=16   xoffset=-4   yoffset=25   xadvance=8    page=0    chnl=0\nchar id=185     x=410  y=241  width=14   height=22   xoffset=-4   yoffset=2    xadvance=12   page=0    chnl=0\nchar id=186     x=465  y=241  width=19   height=21   xoffset=-4   yoffset=2    xadvance=15   page=0    chnl=0\nchar id=187     x=424  y=241  width=22   height=22   xoffset=-4   yoffset=10   xadvance=15   page=0    chnl=0\nchar id=188     x=83   y=178  width=30   height=32   xoffset=-4   yoffset=2    xadvance=23   page=0    chnl=0\nchar id=189     x=113  y=178  width=31   height=32   xoffset=-4   yoffset=2    xadvance=25   page=0    chnl=0\nchar id=190     x=42   y=210  width=31   height=31   xoffset=-4   yoffset=3    xadvance=25   page=0    chnl=0\nchar id=191     x=144  y=178  width=21   height=32   xoffset=-4   yoffset=8    xadvance=15   page=0    chnl=0\nchar id=192     x=188  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=193     x=217  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=194     x=35   y=41   width=29   height=38   xoffset=-4   yoffset=-4   xadvance=21   page=0    chnl=0\nchar id=195     x=187  y=41   width=29   height=37   xoffset=-4   yoffset=-3   xadvance=21   page=0    chnl=0\nchar id=196     x=346  y=41   width=29   height=36   xoffset=-4   yoffset=-2   xadvance=21   page=0    chnl=0\nchar id=197     x=246  y=0    width=29   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=198     x=165  y=178  width=39   height=32   xoffset=-4   yoffset=2    xadvance=30   page=0    chnl=0\nchar id=199     x=64   y=41   width=27   height=38   xoffset=-4   yoffset=3    xadvance=21   page=0    chnl=0\nchar id=200     x=275  y=0    width=24   height=39   xoffset=-4   yoffset=-5   xadvance=18   page=0    chnl=0\nchar id=201     x=299  y=0    width=24   height=39   xoffset=-4   yoffset=-5   xadvance=18   page=0    chnl=0\nchar id=202     x=91   y=41   width=24   height=38   xoffset=-4   yoffset=-4   xadvance=18   page=0    chnl=0\nchar id=203     x=375  y=41   width=24   height=36   xoffset=-4   yoffset=-2   xadvance=18   page=0    chnl=0\nchar id=204     x=323  y=0    width=15   height=39   xoffset=-4   yoffset=-5   xadvance=9    page=0    chnl=0\nchar id=205     x=338  y=0    width=16   height=39   xoffset=-4   yoffset=-5   xadvance=9    page=0    chnl=0\nchar id=206     x=115  y=41   width=19   height=38   xoffset=-4   yoffset=-4   xadvance=9    page=0    chnl=0\nchar id=207     x=399  y=41   width=19   height=36   xoffset=-4   yoffset=-2   xadvance=9    page=0    chnl=0\nchar id=208     x=204  y=178  width=28   height=32   xoffset=-4   yoffset=2    xadvance=21   page=0    chnl=0\nchar id=209     x=216  y=41   width=27   height=37   xoffset=-4   yoffset=-3   xadvance=23   page=0    chnl=0\nchar id=210     x=354  y=0    width=28   height=39   xoffset=-4   yoffset=-5   xadvance=22   page=0    chnl=0\nchar id=211     x=382  y=0    width=28   height=39   xoffset=-4   yoffset=-5   xadvance=22   page=0    chnl=0\nchar id=212     x=134  y=41   width=28   height=38   xoffset=-4   yoffset=-4   xadvance=22   page=0    chnl=0\nchar id=213     x=243  y=41   width=28   height=37   xoffset=-4   yoffset=-3   xadvance=22   page=0    chnl=0\nchar id=214     x=418  y=41   width=28   height=36   xoffset=-4   yoffset=-2   xadvance=22   page=0    chnl=0\nchar id=215     x=262  y=241  width=23   height=23   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=216     x=21   y=79   width=28   height=34   xoffset=-4   yoffset=2    xadvance=22   page=0    chnl=0\nchar id=217     x=410  y=0    width=25   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=218     x=435  y=0    width=25   height=39   xoffset=-4   yoffset=-5   xadvance=21   page=0    chnl=0\nchar id=219     x=162  y=41   width=25   height=38   xoffset=-4   yoffset=-4   xadvance=21   page=0    chnl=0\nchar id=220     x=446  y=41   width=25   height=36   xoffset=-4   yoffset=-2   xadvance=21   page=0    chnl=0\nchar id=221     x=460  y=0    width=27   height=39   xoffset=-4   yoffset=-5   xadvance=19   page=0    chnl=0\nchar id=222     x=232  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=223     x=256  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=224     x=298  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=225     x=321  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=226     x=280  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=227     x=73   y=210  width=23   height=31   xoffset=-4   yoffset=3    xadvance=17   page=0    chnl=0\nchar id=228     x=204  y=210  width=23   height=30   xoffset=-4   yoffset=4    xadvance=17   page=0    chnl=0\nchar id=229     x=344  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=230     x=207  y=241  width=33   height=25   xoffset=-4   yoffset=9    xadvance=27   page=0    chnl=0\nchar id=231     x=367  y=79   width=23   height=33   xoffset=-4   yoffset=8    xadvance=17   page=0    chnl=0\nchar id=232     x=390  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=233     x=413  y=79   width=23   height=33   xoffset=-4   yoffset=1    xadvance=17   page=0    chnl=0\nchar id=234     x=303  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=17   page=0    chnl=0\nchar id=235     x=227  y=210  width=23   height=30   xoffset=-4   yoffset=4    xadvance=17   page=0    chnl=0\nchar id=236     x=436  y=79   width=16   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=237     x=452  y=79   width=16   height=33   xoffset=-4   yoffset=1    xadvance=8    page=0    chnl=0\nchar id=238     x=491  y=146  width=20   height=32   xoffset=-4   yoffset=2    xadvance=8    page=0    chnl=0\nchar id=239     x=250  y=210  width=20   height=30   xoffset=-4   yoffset=4    xadvance=8    page=0    chnl=0\nchar id=240     x=326  y=178  width=23   height=32   xoffset=-4   yoffset=2    xadvance=19   page=0    chnl=0\nchar id=241     x=96   y=210  width=22   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=242     x=468  y=79   width=24   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=243     x=0    y=113  width=24   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=244     x=349  y=178  width=24   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=245     x=118  y=210  width=24   height=31   xoffset=-4   yoffset=3    xadvance=18   page=0    chnl=0\nchar id=246     x=270  y=210  width=24   height=30   xoffset=-4   yoffset=4    xadvance=18   page=0    chnl=0\nchar id=247     x=285  y=241  width=25   height=23   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=248     x=316  y=210  width=24   height=29   xoffset=-4   yoffset=7    xadvance=18   page=0    chnl=0\nchar id=249     x=24   y=113  width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=250     x=46   y=113  width=22   height=33   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=251     x=373  y=178  width=22   height=32   xoffset=-4   yoffset=2    xadvance=18   page=0    chnl=0\nchar id=252     x=294  y=210  width=22   height=30   xoffset=-4   yoffset=4    xadvance=18   page=0    chnl=0\nchar id=253     x=90   y=0    width=23   height=40   xoffset=-4   yoffset=1    xadvance=15   page=0    chnl=0\nchar id=254     x=113  y=0    width=23   height=40   xoffset=-4   yoffset=1    xadvance=18   page=0    chnl=0\nchar id=255     x=271  y=41   width=23   height=37   xoffset=-4   yoffset=4    xadvance=15   page=0    chnl=0\nkernings count=560\nkerning first=193 second=34 amount=-2\nkerning first=221 second=44 amount=-3\nkerning first=87 second=45 amount=-1\nkerning first=47 second=47 amount=-3\nkerning first=80 second=74 amount=-3\nkerning first=208 second=89 amount=-1\nkerning first=221 second=115 amount=-1\nkerning first=114 second=116 amount=1\nkerning first=193 second=119 amount=-1\nkerning first=110 second=34 amount=-2\nkerning first=89 second=196 amount=-1\nkerning first=76 second=210 amount=-1\nkerning first=76 second=218 amount=-1\nkerning first=221 second=220 amount=-1\nkerning first=211 second=221 amount=-1\nkerning first=34 second=229 amount=-1\nkerning first=39 second=235 amount=-1\nkerning first=221 second=251 amount=-1\nkerning first=196 second=255 amount=-1\nkerning first=194 second=84 amount=-2\nkerning first=89 second=110 amount=-1\nkerning first=89 second=241 amount=-1\nkerning first=76 second=87 amount=-2\nkerning first=192 second=87 amount=-1\nkerning first=104 second=39 amount=-2\nkerning first=89 second=227 amount=-1\nkerning first=89 second=230 amount=-1\nkerning first=225 second=39 amount=-1\nkerning first=119 second=46 amount=-2\nkerning first=87 second=44 amount=-2\nkerning first=89 second=97 amount=-1\nkerning first=80 second=193 amount=-2\nkerning first=193 second=253 amount=-1\nkerning first=84 second=251 amount=-1\nkerning first=84 second=119 amount=-1\nkerning first=84 second=122 amount=-1\nkerning first=76 second=221 amount=-4\nkerning first=214 second=89 amount=-1\nkerning first=87 second=226 amount=-1\nkerning first=221 second=193 amount=-1\nkerning first=84 second=118 amount=-1\nkerning first=84 second=235 amount=-2\nkerning first=84 second=112 amount=-2\nkerning first=76 second=199 amount=-1\nkerning first=221 second=224 amount=-1\nkerning first=114 second=97 amount=-1\nkerning first=87 second=195 amount=-1\nkerning first=213 second=89 amount=-1\nkerning first=208 second=46 amount=-2\nkerning first=65 second=87 amount=-1\nkerning first=195 second=39 amount=-2\nkerning first=84 second=198 amount=-3\nkerning first=39 second=97 amount=-1\nkerning first=221 second=233 amount=-1\nkerning first=214 second=221 amount=-1\nkerning first=34 second=245 amount=-1\nkerning first=192 second=86 amount=-1\nkerning first=109 second=34 amount=-2\nkerning first=221 second=111 amount=-1\nkerning first=214 second=46 amount=-2\nkerning first=228 second=34 amount=-1\nkerning first=221 second=249 amount=-1\nkerning first=34 second=101 amount=-1\nkerning first=87 second=173 amount=-1\nkerning first=197 second=118 amount=-1\nkerning first=80 second=197 amount=-2\nkerning first=84 second=195 amount=-1\nkerning first=221 second=97 amount=-1\nkerning first=221 second=103 amount=-1\nkerning first=39 second=227 amount=-1\nkerning first=65 second=39 amount=-2\nkerning first=212 second=198 amount=-1\nkerning first=221 second=242 amount=-1\nkerning first=84 second=248 amount=-1\nkerning first=208 second=221 amount=-1\nkerning first=86 second=46 amount=-4\nkerning first=243 second=34 amount=-2\nkerning first=34 second=196 amount=-2\nkerning first=70 second=196 amount=-3\nkerning first=75 second=119 amount=-1\nkerning first=195 second=84 amount=-2\nkerning first=227 second=34 amount=-1\nkerning first=84 second=244 amount=-2\nkerning first=34 second=195 amount=-2\nkerning first=70 second=195 amount=-3\nkerning first=76 second=89 amount=-4\nkerning first=76 second=39 amount=-5\nkerning first=192 second=39 amount=-2\nkerning first=70 second=44 amount=-4\nkerning first=65 second=255 amount=-1\nkerning first=86 second=242 amount=-1\nkerning first=84 second=114 amount=-1\nkerning first=34 second=193 amount=-2\nkerning first=39 second=197 amount=-2\nkerning first=87 second=65 amount=-1\nkerning first=39 second=245 amount=-1\nkerning first=221 second=99 amount=-1\nkerning first=70 second=227 amount=-1\nkerning first=34 second=227 amount=-1\nkerning first=86 second=196 amount=-1\nkerning first=76 second=118 amount=-2\nkerning first=86 second=228 amount=-1\nkerning first=192 second=118 amount=-1\nkerning first=39 second=101 amount=-1\nkerning first=86 second=97 amount=-1\nkerning first=39 second=228 amount=-1\nkerning first=39 second=243 amount=-1\nkerning first=81 second=84 amount=-1\nkerning first=84 second=45 amount=-4\nkerning first=84 second=187 amount=-3\nkerning first=194 second=63 amount=-1\nkerning first=197 second=84 amount=-2\nkerning first=76 second=250 amount=-1\nkerning first=84 second=231 amount=-2\nkerning first=44 second=34 amount=-3\nkerning first=212 second=44 amount=-2\nkerning first=245 second=39 amount=-2\nkerning first=192 second=255 amount=-1\nkerning first=76 second=255 amount=-2\nkerning first=86 second=101 amount=-1\nkerning first=196 second=119 amount=-1\nkerning first=194 second=89 amount=-1\nkerning first=34 second=226 amount=-1\nkerning first=221 second=232 amount=-1\nkerning first=70 second=226 amount=-1\nkerning first=65 second=118 amount=-1\nkerning first=194 second=221 amount=-1\nkerning first=89 second=252 amount=-1\nkerning first=89 second=220 amount=-1\nkerning first=39 second=196 amount=-2\nkerning first=89 second=246 amount=-1\nkerning first=221 second=171 amount=-1\nkerning first=84 second=110 amount=-2\nkerning first=89 second=46 amount=-3\nkerning first=86 second=246 amount=-1\nkerning first=114 second=46 amount=-2\nkerning first=221 second=218 amount=-1\nkerning first=34 second=244 amount=-1\nkerning first=86 second=224 amount=-1\nkerning first=86 second=192 amount=-1\nkerning first=89 second=101 amount=-1\nkerning first=246 second=34 amount=-2\nkerning first=89 second=245 amount=-1\nkerning first=39 second=246 amount=-1\nkerning first=89 second=228 amount=-1\nkerning first=86 second=233 amount=-1\nkerning first=109 second=39 amount=-2\nkerning first=195 second=255 amount=-1\nkerning first=221 second=187 amount=-1\nkerning first=195 second=118 amount=-1\nkerning first=86 second=197 amount=-1\nkerning first=242 second=39 amount=-2\nkerning first=221 second=194 amount=-1\nkerning first=87 second=225 amount=-1\nkerning first=84 second=226 amount=-2\nkerning first=76 second=86 amount=-3\nkerning first=197 second=89 amount=-1\nkerning first=66 second=221 amount=-1\nkerning first=81 second=89 amount=-1\nkerning first=241 second=34 amount=-2\nkerning first=89 second=226 amount=-1\nkerning first=87 second=227 amount=-1\nkerning first=89 second=171 amount=-1\nkerning first=214 second=198 amount=-1\nkerning first=65 second=86 amount=-1\nkerning first=75 second=253 amount=-1\nkerning first=89 second=242 amount=-1\nkerning first=89 second=65 amount=-1\nkerning first=193 second=221 amount=-1\nkerning first=114 second=226 amount=-1\nkerning first=229 second=34 amount=-1\nkerning first=221 second=219 amount=-1\nkerning first=75 second=118 amount=-1\nkerning first=34 second=115 amount=-1\nkerning first=89 second=42 amount=-1\nkerning first=84 second=121 amount=-1\nkerning first=34 second=234 amount=-1\nkerning first=193 second=63 amount=-1\nkerning first=221 second=250 amount=-1\nkerning first=84 second=192 amount=-1\nkerning first=84 second=255 amount=-1\nkerning first=208 second=198 amount=-1\nkerning first=80 second=194 amount=-2\nkerning first=227 second=39 amount=-1\nkerning first=89 second=194 amount=-1\nkerning first=39 second=233 amount=-1\nkerning first=212 second=89 amount=-1\nkerning first=89 second=113 amount=-1\nkerning first=70 second=74 amount=-4\nkerning first=70 second=228 amount=-1\nkerning first=196 second=34 amount=-2\nkerning first=244 second=34 amount=-2\nkerning first=39 second=103 amount=-1\nkerning first=89 second=197 amount=-1\nkerning first=87 second=192 amount=-1\nkerning first=221 second=225 amount=-1\nkerning first=197 second=39 amount=-2\nkerning first=84 second=227 amount=-2\nkerning first=193 second=87 amount=-1\nkerning first=84 second=230 amount=-2\nkerning first=87 second=229 amount=-1\nkerning first=221 second=65 amount=-1\nkerning first=39 second=242 amount=-1\nkerning first=89 second=244 amount=-1\nkerning first=86 second=103 amount=-1\nkerning first=242 second=34 amount=-2\nkerning first=84 second=252 amount=-1\nkerning first=39 second=244 amount=-1\nkerning first=194 second=118 amount=-1\nkerning first=196 second=63 amount=-1\nkerning first=76 second=252 amount=-1\nkerning first=65 second=121 amount=-1\nkerning first=76 second=220 amount=-1\nkerning first=89 second=103 amount=-1\nkerning first=214 second=44 amount=-2\nkerning first=224 second=39 amount=-1\nkerning first=89 second=198 amount=-1\nkerning first=221 second=46 amount=-3\nkerning first=76 second=79 amount=-1\nkerning first=84 second=113 amount=-2\nkerning first=84 second=197 amount=-1\nkerning first=34 second=242 amount=-1\nkerning first=111 second=34 amount=-2\nkerning first=39 second=34 amount=-2\nkerning first=84 second=74 amount=-4\nkerning first=197 second=255 amount=-1\nkerning first=84 second=245 amount=-2\nkerning first=84 second=32 amount=-1\nkerning first=76 second=213 amount=-1\nkerning first=84 second=229 amount=-2\nkerning first=89 second=217 amount=-1\nkerning first=84 second=101 amount=-2\nkerning first=89 second=115 amount=-1\nkerning first=192 second=121 amount=-1\nkerning first=76 second=121 amount=-2\nkerning first=39 second=231 amount=-1\nkerning first=194 second=39 amount=-2\nkerning first=86 second=44 amount=-4\nkerning first=221 second=196 amount=-1\nkerning first=86 second=231 amount=-1\nkerning first=221 second=228 amount=-1\nkerning first=76 second=67 amount=-1\nkerning first=221 second=117 amount=-1\nkerning first=80 second=46 amount=-5\nkerning first=89 second=218 amount=-1\nkerning first=65 second=84 amount=-2\nkerning first=70 second=192 amount=-3\nkerning first=34 second=192 amount=-2\nkerning first=195 second=121 amount=-1\nkerning first=221 second=241 amount=-1\nkerning first=34 second=113 amount=-1\nkerning first=70 second=229 amount=-1\nkerning first=196 second=253 amount=-1\nkerning first=86 second=194 amount=-1\nkerning first=88 second=173 amount=-1\nkerning first=70 second=197 amount=-3\nkerning first=34 second=197 amount=-2\nkerning first=97 second=34 amount=-1\nkerning first=192 second=89 amount=-1\nkerning first=86 second=226 amount=-1\nkerning first=221 second=110 amount=-1\nkerning first=253 second=46 amount=-2\nkerning first=196 second=221 amount=-1\nkerning first=89 second=231 amount=-1\nkerning first=86 second=244 amount=-1\nkerning first=221 second=112 amount=-1\nkerning first=221 second=246 amount=-1\nkerning first=80 second=196 amount=-2\nkerning first=76 second=84 amount=-4\nkerning first=221 second=85 amount=-1\nkerning first=114 second=44 amount=-2\nkerning first=89 second=187 amount=-1\nkerning first=192 second=84 amount=-2\nkerning first=221 second=173 amount=-1\nkerning first=39 second=115 amount=-1\nkerning first=194 second=87 amount=-1\nkerning first=111 second=39 amount=-2\nkerning first=39 second=39 amount=-2\nkerning first=70 second=224 amount=-1\nkerning first=84 second=234 amount=-2\nkerning first=34 second=224 amount=-1\nkerning first=89 second=44 amount=-3\nkerning first=39 second=194 amount=-2\nkerning first=197 second=86 amount=-1\nkerning first=211 second=46 amount=-2\nkerning first=255 second=46 amount=-2\nkerning first=65 second=89 amount=-1\nkerning first=210 second=221 amount=-1\nkerning first=70 second=193 amount=-3\nkerning first=86 second=65 amount=-1\nkerning first=84 second=120 amount=-1\nkerning first=226 second=34 amount=-1\nkerning first=87 second=228 amount=-1\nkerning first=193 second=118 amount=-1\nkerning first=86 second=234 amount=-1\nkerning first=80 second=195 amount=-2\nkerning first=34 second=103 amount=-1\nkerning first=195 second=63 amount=-1\nkerning first=89 second=225 amount=-1\nkerning first=76 second=85 amount=-1\nkerning first=244 second=39 amount=-2\nkerning first=34 second=233 amount=-1\nkerning first=221 second=100 amount=-1\nkerning first=76 second=211 amount=-1\nkerning first=84 second=253 amount=-1\nkerning first=195 second=119 amount=-1\nkerning first=221 second=235 amount=-1\nkerning first=84 second=193 amount=-1\nkerning first=195 second=89 amount=-1\nkerning first=89 second=249 amount=-1\nkerning first=197 second=34 amount=-2\nkerning first=39 second=99 amount=-1\nkerning first=79 second=89 amount=-1\nkerning first=68 second=221 amount=-1\nkerning first=89 second=112 amount=-1\nkerning first=194 second=86 amount=-1\nkerning first=89 second=192 amount=-1\nkerning first=75 second=121 amount=-1\nkerning first=82 second=84 amount=-1\nkerning first=39 second=193 amount=-2\nkerning first=39 second=226 amount=-1\nkerning first=75 second=255 amount=-1\nkerning first=97 second=39 amount=-1\nkerning first=84 second=224 amount=-2\nkerning first=211 second=44 amount=-2\nkerning first=255 second=44 amount=-2\nkerning first=119 second=44 amount=-2\nkerning first=84 second=233 amount=-2\nkerning first=194 second=255 amount=-1\nkerning first=86 second=225 amount=-1\nkerning first=89 second=229 amount=-1\nkerning first=221 second=198 amount=-1\nkerning first=192 second=63 amount=-1\nkerning first=68 second=89 amount=-1\nkerning first=194 second=34 amount=-2\nkerning first=195 second=221 amount=-1\nkerning first=79 second=221 amount=-1\nkerning first=84 second=111 amount=-2\nkerning first=89 second=99 amount=-1\nkerning first=79 second=46 amount=-2\nkerning first=194 second=121 amount=-1\nkerning first=221 second=195 amount=-1\nkerning first=84 second=249 amount=-1\nkerning first=84 second=103 amount=-2\nkerning first=39 second=225 amount=-1\nkerning first=65 second=63 amount=-1\nkerning first=89 second=219 amount=-1\nkerning first=229 second=39 amount=-1\nkerning first=87 second=224 amount=-1\nkerning first=39 second=65 amount=-2\nkerning first=114 second=229 amount=-1\nkerning first=208 second=44 amount=-2\nkerning first=241 second=39 amount=-2\nkerning first=196 second=118 amount=-1\nkerning first=87 second=197 amount=-1\nkerning first=221 second=248 amount=-1\nkerning first=210 second=89 amount=-1\nkerning first=197 second=253 amount=-1\nkerning first=84 second=242 amount=-2\nkerning first=68 second=46 amount=-2\nkerning first=224 second=34 amount=-1\nkerning first=82 second=89 amount=-1\nkerning first=114 second=224 amount=-1\nkerning first=195 second=86 amount=-1\nkerning first=32 second=84 amount=-1\nkerning first=39 second=100 amount=-1\nkerning first=221 second=244 amount=-1\nkerning first=221 second=114 amount=-1\nkerning first=80 second=198 amount=-2\nkerning first=210 second=46 amount=-2\nkerning first=39 second=113 amount=-1\nkerning first=89 second=233 amount=-1\nkerning first=84 second=243 amount=-2\nkerning first=221 second=231 amount=-1\nkerning first=34 second=111 amount=-1\nkerning first=84 second=99 amount=-2\nkerning first=39 second=229 amount=-1\nkerning first=221 second=45 amount=-1\nkerning first=89 second=173 amount=-1\nkerning first=118 second=46 amount=-2\nkerning first=80 second=65 amount=-2\nkerning first=226 second=39 amount=-1\nkerning first=213 second=44 amount=-2\nkerning first=89 second=234 amount=-1\nkerning first=34 second=243 amount=-1\nkerning first=84 second=109 amount=-2\nkerning first=86 second=113 amount=-1\nkerning first=70 second=194 amount=-3\nkerning first=34 second=194 amount=-2\nkerning first=194 second=253 amount=-1\nkerning first=84 second=232 amount=-2\nkerning first=213 second=221 amount=-1\nkerning first=89 second=100 amount=-1\nkerning first=76 second=217 amount=-1\nkerning first=76 second=249 amount=-1\nkerning first=44 second=39 amount=-3\nkerning first=86 second=173 amount=-1\nkerning first=196 second=39 amount=-2\nkerning first=84 second=171 amount=-5\nkerning first=196 second=87 amount=-1\nkerning first=221 second=109 amount=-1\nkerning first=34 second=34 amount=-2\nkerning first=89 second=74 amount=-1\nkerning first=76 second=81 amount=-1\nkerning first=213 second=46 amount=-2\nkerning first=34 second=99 amount=-1\nkerning first=65 second=119 amount=-1\nkerning first=34 second=39 amount=-2\nkerning first=88 second=45 amount=-1\nkerning first=84 second=115 amount=-2\nkerning first=197 second=121 amount=-1\nkerning first=75 second=173 amount=-1\nkerning first=87 second=193 amount=-1\nkerning first=39 second=234 amount=-1\nkerning first=80 second=44 amount=-5\nkerning first=76 second=119 amount=-1\nkerning first=221 second=226 amount=-1\nkerning first=192 second=119 amount=-1\nkerning first=84 second=194 amount=-1\nkerning first=89 second=117 amount=-1\nkerning first=82 second=221 amount=-1\nkerning first=121 second=46 amount=-2\nkerning first=34 second=232 amount=-1\nkerning first=86 second=229 amount=-1\nkerning first=65 second=34 amount=-2\nkerning first=87 second=196 amount=-1\nkerning first=86 second=235 amount=-1\nkerning first=114 second=228 amount=-1\nkerning first=34 second=97 amount=-1\nkerning first=89 second=109 amount=-1\nkerning first=89 second=195 amount=-1\nkerning first=196 second=84 amount=-2\nkerning first=193 second=39 amount=-2\nkerning first=213 second=198 amount=-1\nkerning first=79 second=198 amount=-1\nkerning first=89 second=193 amount=-1\nkerning first=34 second=246 amount=-1\nkerning first=87 second=194 amount=-1\nkerning first=76 second=71 amount=-1\nkerning first=89 second=248 amount=-1\nkerning first=212 second=221 amount=-1\nkerning first=70 second=65 amount=-3\nkerning first=193 second=121 amount=-1\nkerning first=89 second=111 amount=-1\nkerning first=89 second=85 amount=-1\nkerning first=221 second=243 amount=-1\nkerning first=87 second=97 amount=-1\nkerning first=84 second=250 amount=-1\nkerning first=221 second=192 amount=-1\nkerning first=39 second=224 amount=-1\nkerning first=246 second=39 amount=-2\nkerning first=76 second=212 amount=-1\nkerning first=121 second=44 amount=-2\nkerning first=86 second=193 amount=-1\nkerning first=80 second=192 amount=-2\nkerning first=195 second=253 amount=-1\nkerning first=84 second=97 amount=-2\nkerning first=193 second=89 amount=-1\nkerning first=210 second=198 amount=-1\nkerning first=34 second=100 amount=-1\nkerning first=196 second=86 amount=-1\nkerning first=39 second=111 amount=-1\nkerning first=70 second=46 amount=-4\nkerning first=221 second=217 amount=-1\nkerning first=84 second=225 amount=-2\nkerning first=39 second=195 amount=-2\nkerning first=221 second=227 amount=-1\nkerning first=197 second=87 amount=-1\nkerning first=84 second=65 amount=-1\nkerning first=34 second=225 amount=-1\nkerning first=110 second=39 amount=-2\nkerning first=70 second=225 amount=-1\nkerning first=68 second=198 amount=-1\nkerning first=66 second=89 amount=-1\nkerning first=192 second=34 amount=-2\nkerning first=197 second=221 amount=-1\nkerning first=76 second=34 amount=-5\nkerning first=81 second=221 amount=-1\nkerning first=221 second=230 amount=-1\nkerning first=76 second=214 amount=-1\nkerning first=212 second=46 amount=-2\nkerning first=89 second=235 amount=-1\nkerning first=221 second=252 amount=-1\nkerning first=86 second=245 amount=-1\nkerning first=86 second=111 amount=-1\nkerning first=34 second=228 amount=-1\nkerning first=193 second=84 amount=-2\nkerning first=197 second=63 amount=-1\nkerning first=196 second=121 amount=-1\nkerning first=114 second=227 amount=-1\nkerning first=70 second=97 amount=-1\nkerning first=243 second=39 amount=-2\nkerning first=79 second=44 amount=-2\nkerning first=86 second=243 amount=-1\nkerning first=65 second=253 amount=-1\nkerning first=84 second=46 amount=-3\nkerning first=89 second=232 amount=-1\nkerning first=65 second=221 amount=-1\nkerning first=221 second=113 amount=-1\nkerning first=86 second=45 amount=-1\nkerning first=221 second=101 amount=-1\nkerning first=221 second=245 amount=-1\nkerning first=76 second=251 amount=-1\nkerning first=192 second=253 amount=-1\nkerning first=221 second=197 amount=-1\nkerning first=196 second=89 amount=-1\nkerning first=221 second=74 amount=-1\nkerning first=76 second=219 amount=-1\nkerning first=192 second=221 amount=-1\nkerning first=221 second=229 amount=-1\nkerning first=34 second=231 amount=-1\nkerning first=194 second=119 amount=-1\nkerning first=84 second=228 amount=-2\nkerning first=39 second=192 amount=-2\nkerning first=75 second=45 amount=-1\nkerning first=86 second=195 amount=-1\nkerning first=76 second=253 amount=-2\nkerning first=68 second=44 amount=-2\nkerning first=89 second=45 amount=-1\nkerning first=76 second=117 amount=-1\nkerning first=89 second=224 amount=-1\nkerning first=193 second=86 amount=-1\nkerning first=245 second=34 amount=-2\nkerning first=46 second=34 amount=-3\nkerning first=89 second=251 amount=-1\nkerning first=86 second=227 amount=-1\nkerning first=39 second=232 amount=-1\nkerning first=76 second=216 amount=-1\nkerning first=84 second=196 amount=-1\nkerning first=84 second=100 amount=-2\nkerning first=34 second=65 amount=-2\nkerning first=84 second=117 amount=-1\nkerning first=197 second=119 amount=-1\nkerning first=84 second=241 amount=-2\nkerning first=84 second=44 amount=-3\nkerning first=228 second=39 amount=-1\nkerning first=253 second=44 amount=-2\nkerning first=210 second=44 amount=-2\nkerning first=118 second=44 amount=-2\nkerning first=193 second=255 amount=-1\nkerning first=89 second=114 amount=-1\nkerning first=211 second=89 amount=-1\nkerning first=195 second=34 amount=-2\nkerning first=86 second=232 amount=-1\nkerning first=89 second=243 amount=-1\nkerning first=34 second=235 amount=-1\nkerning first=87 second=46 amount=-2\nkerning first=195 second=87 amount=-1\nkerning first=86 second=100 amount=-1\nkerning first=84 second=246 amount=-2\nkerning first=211 second=198 amount=-1\nkerning first=221 second=42 amount=-1\nkerning first=46 second=39 amount=-3\nkerning first=84 second=173 amount=-4\nkerning first=114 second=225 amount=-1\nkerning first=221 second=234 amount=-1\nkerning first=86 second=99 amount=-1\nkerning first=104 second=34 amount=-2\nkerning first=89 second=250 amount=-1\nkerning first=225 second=34 amount=-1\n";
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var group = _ref.group;
  var panel = _ref.panel;


  var interaction = (0, _interaction2.default)(panel);

  interaction.events.on('onPressed', handleOnPress);
  interaction.events.on('onReleased', handleOnRelease);

  var tempMatrix = new THREE.Matrix4();

  var oldParent = void 0;

  function handleOnPress(p) {
    var inputObject = p.inputObject;
    var input = p.input;


    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (folder.beingMoved === true) {
      return;
    }

    tempMatrix.getInverse(inputObject.matrixWorld);

    folder.matrix.premultiply(tempMatrix);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);

    oldParent = folder.parent;
    inputObject.add(folder);

    p.locked = true;

    folder.beingMoved = true;

    input.events.emit('grabbed', input);
  }

  function handleOnRelease() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var inputObject = _ref2.inputObject;
    var input = _ref2.input;

    var folder = group.folder;
    if (folder === undefined) {
      return;
    }

    if (oldParent === undefined) {
      return;
    }

    if (folder.beingMoved === false) {
      return;
    }

    folder.matrix.premultiply(inputObject.matrixWorld);
    folder.matrix.decompose(folder.position, folder.quaternion, folder.scale);
    oldParent.add(folder);
    oldParent = undefined;

    folder.beingMoved = false;

    input.events.emit('grabReleased', input);
  }

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = DATGUIVR;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

var _checkbox = require('./checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _button = require('./button');

var _button2 = _interopRequireDefault(_button);

var _folder = require('./folder');

var _folder2 = _interopRequireDefault(_folder);

var _dropdown = require('./dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _sdftext = require('./sdftext');

var SDFText = _interopRequireWildcard(_sdftext);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                    * dat-guiVR Javascript Controller Library for VR
                                                                                                                                                                                                    * https://github.com/dataarts/dat.guiVR
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                    *
                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                    *
                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                    */

function DATGUIVR() {

  /*
    SDF font
  */
  var textCreator = SDFText.creator();

  /*
    Lists.
    InputObjects are things like VIVE controllers, cardboard headsets, etc.
    Controllers are the DAT GUI sliders, checkboxes, etc.
    HitscanObjects are anything raycasts will hit-test against.
  */
  var inputObjects = [];
  var controllers = [];
  var hitscanObjects = [];

  var mouseEnabled = false;

  function setMouseEnabled(flag) {
    mouseEnabled = flag;
  }

  /*
    The default laser pointer coming out of each InputObject.
  */
  var laserMaterial = new THREE.LineBasicMaterial({ color: 0x55aaff, transparent: true, blending: THREE.AdditiveBlending });
  function createLaser() {
    var g = new THREE.Geometry();
    g.vertices.push(new THREE.Vector3());
    g.vertices.push(new THREE.Vector3(0, 0, 0));
    return new THREE.Line(g, laserMaterial);
  }

  /*
    A "cursor", eg the ball that appears at the end of your laser.
  */
  var cursorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, blending: THREE.AdditiveBlending });
  function createCursor() {
    return new THREE.Mesh(new THREE.SphereGeometry(0.006, 4, 4), cursorMaterial);
  }

  /*
    Creates a generic Input type.
    Takes any THREE.Object3D type object and uses its position
    and orientation as an input device.
      A laser pointer is included and will be updated.
    Contains state about which Interaction is currently being used or hover.
  */
  function createInput() {
    var inputObject = arguments.length <= 0 || arguments[0] === undefined ? new THREE.Group() : arguments[0];

    return {
      raycast: new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3()),
      laser: createLaser(),
      cursor: createCursor(),
      object: inputObject,
      pressed: false,
      gripped: false,
      events: new _events2.default(),
      interaction: {
        grip: undefined,
        press: undefined,
        hover: undefined
      }
    };
  }

  /*
    MouseInput is a special input type that is on by default.
    Allows you to click on the screen when not in VR for debugging.
  */
  var mouseInput = createMouseInput();

  function createMouseInput() {
    var mouse = new THREE.Vector2(-1, -1);

    window.addEventListener('mousemove', function (event) {
      mouse.x = event.clientX / window.innerWidth * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    window.addEventListener('mousedown', function (event) {
      input.pressed = true;
    }, false);

    window.addEventListener('mouseup', function (event) {
      input.pressed = false;
    }, false);

    var input = createInput();
    input.mouse = mouse;
    return input;
  }

  /*
    Public function users run to give DAT GUI an input device.
    Automatically detects for ViveController and binds buttons + haptic feedback.
      Returns a laser pointer so it can be directly added to scene.
      The laser will then have two methods:
    laser.pressed(), laser.gripped()
      These can then be bound to any button the user wants. Useful for binding to
    cardboard or alternate input devices.
      For example...
      document.addEventListener( 'mousedown', function(){ laser.pressed( true ); } );
  */
  function addInputObject(object) {
    var input = createInput(object);

    input.laser.add(input.cursor);

    input.laser.pressed = function (flag) {
      input.pressed = flag;
    };

    input.laser.gripped = function (flag) {
      input.gripped = flag;
    };

    input.laser.cursor = input.cursor;

    if (THREE.ViveController && object instanceof THREE.ViveController) {
      bindViveController(input, object, input.laser.pressed, input.laser.gripped);
    }

    inputObjects.push(input);

    return input.laser;
  }

  /*
    Here are the main dat gui controller types.
  */

  function addSlider(object, propertyName) {
    var min = arguments.length <= 2 || arguments[2] === undefined ? 0.0 : arguments[2];
    var max = arguments.length <= 3 || arguments[3] === undefined ? 100.0 : arguments[3];

    var slider = (0, _slider2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, min: min, max: max,
      initialValue: object[propertyName]
    });

    controllers.push(slider);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(slider.hitscan));

    return slider;
  }

  function addCheckbox(object, propertyName) {
    var checkbox = (0, _checkbox2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object,
      initialValue: object[propertyName]
    });

    controllers.push(checkbox);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(checkbox.hitscan));

    return checkbox;
  }

  function addButton(object, propertyName) {
    var button = (0, _button2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object
    });

    controllers.push(button);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(button.hitscan));
    return button;
  }

  function addDropdown(object, propertyName, options) {
    var dropdown = (0, _dropdown2.default)({
      textCreator: textCreator, propertyName: propertyName, object: object, options: options
    });

    controllers.push(dropdown);
    hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(dropdown.hitscan));
    return dropdown;
  }

  /*
    An implicit Add function which detects for property type
    and gives you the correct controller.
      Dropdown:
      add( object, propertyName, objectType )
      Slider:
      add( object, propertyOfNumberType, min, max )
      Checkbox:
      add( object, propertyOfBooleanType )
      Button:
      add( object, propertyOfFunctionType )
  */

  function add(object, propertyName, arg3, arg4) {

    if (object === undefined) {
      console.warn('object is undefined');
      return new THREE.Group();
    } else if (object[propertyName] === undefined) {
      console.warn('no property named', propertyName, 'on object', object);
      return new THREE.Group();
    }

    if (isObject(arg3) || isArray(arg3)) {
      return addDropdown(object, propertyName, arg3);
    }

    if (isNumber(object[propertyName])) {
      return addSlider(object, propertyName, arg3, arg4);
    }

    if (isBoolean(object[propertyName])) {
      return addCheckbox(object, propertyName);
    }

    if (isFunction(object[propertyName])) {
      return addButton(object, propertyName);
    }

    //  add couldn't figure it out, so at least add something THREE understands
    return new THREE.Group();
  }

  /*
    Creates a folder with the name.
      Folders are THREE.Group type objects and can do group.add() for siblings.
    Folders will automatically attempt to lay its children out in sequence.
  */

  function addFolder(name) {
    var folder = (0, _folder2.default)({
      textCreator: textCreator,
      name: name
    });

    controllers.push(folder);
    if (folder.hitscan) {
      hitscanObjects.push.apply(hitscanObjects, _toConsumableArray(folder.hitscan));
    }

    return folder;
  }

  /*
    Perform the necessary updates, raycasts on its own RAF.
  */

  var tPosition = new THREE.Vector3();
  var tDirection = new THREE.Vector3(0, 0, -1);
  var tMatrix = new THREE.Matrix4();

  function update() {
    requestAnimationFrame(update);

    if (mouseEnabled) {
      mouseInput.intersections = performMouseInput(hitscanObjects, mouseInput);
    }

    inputObjects.forEach(function () {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var box = _ref.box;
      var object = _ref.object;
      var raycast = _ref.raycast;
      var laser = _ref.laser;
      var cursor = _ref.cursor;
      var index = arguments[1];

      object.updateMatrixWorld();

      tPosition.set(0, 0, 0).setFromMatrixPosition(object.matrixWorld);
      tMatrix.identity().extractRotation(object.matrixWorld);
      tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

      raycast.set(tPosition, tDirection);

      laser.geometry.vertices[0].copy(tPosition);

      //  debug...
      // laser.geometry.vertices[ 1 ].copy( tPosition ).add( tDirection.multiplyScalar( 1 ) );

      var intersections = raycast.intersectObjects(hitscanObjects, false);
      parseIntersections(intersections, laser, cursor);

      inputObjects[index].intersections = intersections;
    });

    var inputs = inputObjects.slice();

    if (mouseEnabled) {
      inputs.push(mouseInput);
    }

    controllers.forEach(function (controller) {
      controller.update(inputs);
    });
  }

  function parseIntersections(intersections, laser, cursor) {
    if (intersections.length > 0) {
      var firstHit = intersections[0];
      laser.geometry.vertices[1].copy(firstHit.point);
      laser.visible = true;
      laser.geometry.computeBoundingSphere();
      laser.geometry.computeBoundingBox();
      laser.geometry.verticesNeedUpdate = true;
      cursor.position.copy(firstHit.point);
      cursor.visible = true;
    } else {
      laser.visible = false;
      cursor.visible = false;
    }
  }

  function performMouseInput(hitscanObjects) {
    var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var box = _ref2.box;
    var object = _ref2.object;
    var raycast = _ref2.raycast;
    var laser = _ref2.laser;
    var cursor = _ref2.cursor;
    var mouse = _ref2.mouse;

    raycast.setFromCamera(mouse, camera);
    var intersections = raycast.intersectObjects(hitscanObjects, false);
    parseIntersections(intersections, laser, cursor);
    return intersections;
  }

  update();

  /*
    Public methods.
  */

  return {
    addInputObject: addInputObject,
    add: add,
    addFolder: addFolder,
    setMouseEnabled: setMouseEnabled
  };
}

/*
  Set to global scope if exporting as a standalone.
*/

if (window) {
  window.DATGUIVR = DATGUIVR;
}

/*
  Bunch of state-less utility functions.
*/

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isBoolean(n) {
  return typeof n === 'boolean';
}

function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

//  only {} objects not arrays
//                    which are technically objects but you're just being pedantic
function isObject(item) {
  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
}

function isArray(o) {
  return Array.isArray(o);
}

/*
  Controller-specific support.
*/

function bindViveController(input, controller, pressed, gripped) {
  controller.addEventListener('triggerdown', function () {
    return pressed(true);
  });
  controller.addEventListener('triggerup', function () {
    return pressed(false);
  });
  controller.addEventListener('gripsdown', function () {
    return gripped(true);
  });
  controller.addEventListener('gripsup', function () {
    return gripped(false);
  });

  var gamepad = controller.getGamepad();
  function vibrate(t, a) {
    if (gamepad && gamepad.haptics.length > 0) {
      gamepad.haptics[0].vibrate(t, a);
    }
  }

  function hapticsTap() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(1 - a, 0.5);
    }, 10, 20);
  }

  function hapticsEcho() {
    setIntervalTimes(function (x, t, a) {
      return vibrate(4, 1.0 * (1 - a));
    }, 100, 4);
  }

  input.events.on('onControllerHeld', function (input) {
    vibrate(0.3, 0.3);
  });

  input.events.on('grabbed', function () {
    hapticsTap();
  });

  input.events.on('grabReleased', function () {
    hapticsEcho();
  });

  input.events.on('pinned', function () {
    hapticsTap();
  });

  input.events.on('pinReleased', function () {
    hapticsEcho();
  });
}

function setIntervalTimes(cb, delay, times) {
  var x = 0;
  var id = setInterval(function () {
    cb(x, times, x / times);
    x++;
    if (x >= times) {
      clearInterval(id);
    }
  }, delay);
  return id;
}

},{"./button":1,"./checkbox":2,"./dropdown":4,"./folder":5,"./font":6,"./sdftext":12,"./slider":14,"events":21}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createInteraction;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createInteraction(hitVolume) {
  var events = new _events2.default();

  var anyHover = false;
  var anyPressing = false;

  var hover = false;
  var anyActive = false;

  var tVector = new THREE.Vector3();
  var availableInputs = [];

  function update(inputObjects) {

    hover = false;
    anyPressing = false;
    anyActive = false;

    inputObjects.forEach(function (input) {

      if (availableInputs.indexOf(input) < 0) {
        availableInputs.push(input);
      }

      var _extractHit = extractHit(input);

      var hitObject = _extractHit.hitObject;
      var hitPoint = _extractHit.hitPoint;


      hover = hover || hitVolume === hitObject;

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'pressed',
        interactionName: 'press',
        downName: 'onPressed',
        holdName: 'pressing',
        upName: 'onReleased'
      });

      performStateEvents({
        input: input,
        hover: hover,
        hitObject: hitObject, hitPoint: hitPoint,
        buttonName: 'gripped',
        interactionName: 'grip',
        downName: 'onGripped',
        holdName: 'gripping',
        upName: 'onReleaseGrip'
      });
    });
  }

  function extractHit(input) {
    if (input.intersections.length <= 0) {
      return {
        hitPoint: tVector.setFromMatrixPosition(input.cursor.matrixWorld).clone(),
        hitObject: undefined
      };
    } else {
      return {
        hitPoint: input.intersections[0].point,
        hitObject: input.intersections[0].object
      };
    }
  }

  function performStateEvents() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var input = _ref.input;
    var hover = _ref.hover;
    var hitObject = _ref.hitObject;
    var hitPoint = _ref.hitPoint;
    var buttonName = _ref.buttonName;
    var interactionName = _ref.interactionName;
    var downName = _ref.downName;
    var holdName = _ref.holdName;
    var upName = _ref.upName;


    if (input[buttonName] === true && hitObject === undefined) {
      return;
    }

    //  hovering and button down but no interactions active yet
    if (hover && input[buttonName] === true && input.interaction[interactionName] === undefined) {

      var payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };
      events.emit(downName, payload);

      if (payload.locked) {
        input.interaction[interactionName] = interaction;
        input.interaction.hover = interaction;
      }

      anyPressing = true;
      anyActive = true;
    }

    //  button still down and this is the active interaction
    if (input[buttonName] && input.interaction[interactionName] === interaction) {
      var _payload = {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object,
        locked: false
      };

      events.emit(holdName, _payload);

      anyPressing = true;

      input.events.emit('onControllerHeld');
    }

    //  button not down and this is the active interaction
    if (input[buttonName] === false && input.interaction[interactionName] === interaction) {
      input.interaction[interactionName] = undefined;
      input.interaction.hover = undefined;
      events.emit(upName, {
        input: input,
        hitObject: hitObject,
        point: hitPoint,
        inputObject: input.object
      });
    }
  }

  function isMainHover() {

    var noMainHover = true;
    for (var i = 0; i < availableInputs.length; i++) {
      if (availableInputs[i].interaction.hover !== undefined) {
        noMainHover = false;
        break;
      }
    }

    if (noMainHover) {
      return hover;
    }

    if (availableInputs.filter(function (input) {
      return input.interaction.hover === interaction;
    }).length > 0) {
      return true;
    }

    return false;
  }

  var interaction = {
    hovering: isMainHover,
    pressing: function pressing() {
      return anyPressing;
    },
    update: update,
    events: events
  };

  return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"events":21}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER_HEIGHT = exports.FOLDER_WIDTH = exports.BUTTON_DEPTH = exports.CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_WIDTH = exports.PANEL_VALUE_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = exports.PANEL_MARGIN = exports.PANEL_SPACING = exports.PANEL_DEPTH = exports.PANEL_HEIGHT = exports.PANEL_WIDTH = undefined;
exports.alignLeft = alignLeft;
exports.createPanel = createPanel;
exports.createControllerIDBox = createControllerIDBox;
exports.createDownArrow = createDownArrow;

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function alignLeft(obj) {
  if (obj instanceof THREE.Mesh) {
    obj.geometry.computeBoundingBox();
    var width = obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.max.y;
    obj.geometry.translate(width, 0, 0);
    return obj;
  } else if (obj instanceof THREE.Geometry) {
    obj.computeBoundingBox();
    var _width = obj.boundingBox.max.x - obj.boundingBox.max.y;
    obj.translate(_width, 0, 0);
    return obj;
  }
}

function createPanel(width, height, depth) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), SharedMaterials.PANEL);
  panel.geometry.translate(width * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, Colors.DEFAULT_BACK);
  return panel;
}

function createControllerIDBox(height, color) {
  var panel = new THREE.Mesh(new THREE.BoxGeometry(CONTROLLER_ID_WIDTH, height, CONTROLLER_ID_DEPTH), SharedMaterials.PANEL);
  panel.geometry.translate(CONTROLLER_ID_WIDTH * 0.5, 0, 0);
  Colors.colorizeGeometry(panel.geometry, color);
  return panel;
}

function createDownArrow() {
  var w = 0.0096;
  var h = 0.016;
  var sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.lineTo(-w, h);
  sh.lineTo(w, h);
  sh.lineTo(0, 0);

  var geo = new THREE.ShapeGeometry(sh);
  geo.translate(0, -h * 0.5, 0);

  return new THREE.Mesh(geo, SharedMaterials.PANEL);
}

var PANEL_WIDTH = exports.PANEL_WIDTH = 1.0;
var PANEL_HEIGHT = exports.PANEL_HEIGHT = 0.08;
var PANEL_DEPTH = exports.PANEL_DEPTH = 0.001;
var PANEL_SPACING = exports.PANEL_SPACING = 0.002;
var PANEL_MARGIN = exports.PANEL_MARGIN = 0.015;
var PANEL_LABEL_TEXT_MARGIN = exports.PANEL_LABEL_TEXT_MARGIN = 0.06;
var PANEL_VALUE_TEXT_MARGIN = exports.PANEL_VALUE_TEXT_MARGIN = 0.02;
var CONTROLLER_ID_WIDTH = exports.CONTROLLER_ID_WIDTH = 0.02;
var CONTROLLER_ID_DEPTH = exports.CONTROLLER_ID_DEPTH = 0.001;
var BUTTON_DEPTH = exports.BUTTON_DEPTH = 0.01;
var FOLDER_WIDTH = exports.FOLDER_WIDTH = 1.026;
var FOLDER_HEIGHT = exports.FOLDER_HEIGHT = 0.08;

},{"./colors":3,"./sharedmaterials":13}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function create() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var group = _ref.group;
    var panel = _ref.panel;


    var interaction = (0, _interaction2.default)(panel);

    interaction.events.on('onGripped', handleOnGrip);
    interaction.events.on('onReleaseGrip', handleOnGripRelease);

    var oldParent = void 0;
    var oldPosition = new THREE.Vector3();
    var oldRotation = new THREE.Euler();

    var rotationGroup = new THREE.Group();
    rotationGroup.scale.set(0.3, 0.3, 0.3);
    rotationGroup.position.set(-0.015, 0.015, 0.0);

    function handleOnGrip(p) {
        var inputObject = p.inputObject;
        var input = p.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (folder.beingMoved === true) {
            return;
        }

        oldPosition.copy(folder.position);
        oldRotation.copy(folder.rotation);

        folder.position.set(0, 0, 0);
        folder.rotation.set(0, 0, 0);
        folder.rotation.x = -Math.PI * 0.5;

        oldParent = folder.parent;

        rotationGroup.add(folder);

        inputObject.add(rotationGroup);

        p.locked = true;

        folder.beingMoved = true;

        input.events.emit('pinned', input);
    }

    function handleOnGripRelease() {
        var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var inputObject = _ref2.inputObject;
        var input = _ref2.input;


        var folder = group.folder;
        if (folder === undefined) {
            return;
        }

        if (oldParent === undefined) {
            return;
        }

        if (folder.beingMoved === false) {
            return;
        }

        oldParent.add(folder);
        oldParent = undefined;

        folder.position.copy(oldPosition);
        folder.rotation.copy(oldRotation);

        folder.beingMoved = false;

        input.events.emit('pinReleased', input);
    }

    return interaction;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

},{"./interaction":9}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMaterial = createMaterial;
exports.creator = creator;

var _sdf = require('three-bmfont-text/shaders/sdf');

var _sdf2 = _interopRequireDefault(_sdf);

var _threeBmfontText = require('three-bmfont-text');

var _threeBmfontText2 = _interopRequireDefault(_threeBmfontText);

var _parseBmfontAscii = require('parse-bmfont-ascii');

var _parseBmfontAscii2 = _interopRequireDefault(_parseBmfontAscii);

var _font = require('./font');

var Font = _interopRequireWildcard(_font);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createMaterial(color) {

  var texture = new THREE.Texture();
  var image = Font.image();
  texture.image = image;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  //  and what about anisotropic filtering?

  return new THREE.RawShaderMaterial((0, _sdf2.default)({
    side: THREE.DoubleSide,
    transparent: true,
    color: color,
    map: texture
  }));
}

var textScale = 0.0012;

function creator() {

  var font = (0, _parseBmfontAscii2.default)(Font.fnt());

  var colorMaterials = {};

  function createText(str, font) {
    var color = arguments.length <= 2 || arguments[2] === undefined ? 0xffffff : arguments[2];
    var scale = arguments.length <= 3 || arguments[3] === undefined ? 1.0 : arguments[3];


    var geometry = (0, _threeBmfontText2.default)({
      text: str,
      align: 'left',
      width: 1000,
      flipY: true,
      font: font
    });

    var layout = geometry.layout;

    var material = colorMaterials[color];
    if (material === undefined) {
      material = colorMaterials[color] = createMaterial(color);
    }
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiply(new THREE.Vector3(1, -1, 1));

    var finalScale = scale * textScale;

    mesh.scale.multiplyScalar(finalScale);

    mesh.position.y = layout.height * 0.5 * finalScale;

    return mesh;
  }

  function create(str) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$color = _ref.color;
    var color = _ref$color === undefined ? 0xffffff : _ref$color;
    var _ref$scale = _ref.scale;
    var scale = _ref$scale === undefined ? 1.0 : _ref$scale;

    var group = new THREE.Group();

    var mesh = createText(str, font, color, scale);
    group.add(mesh);
    group.layout = mesh.geometry.layout;

    group.update = function (str) {
      mesh.geometry.update(str);
    };

    return group;
  }

  return {
    create: create,
    getMaterial: function getMaterial() {
      return material;
    }
  };
}

},{"./font":6,"parse-bmfont-ascii":27,"three-bmfont-text":29,"three-bmfont-text/shaders/sdf":32}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FOLDER = exports.LOCATOR = exports.PANEL = undefined;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var PANEL = exports.PANEL = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: THREE.VertexColors }); /**
                                                                                                                * dat-guiVR Javascript Controller Library for VR
                                                                                                                * https://github.com/dataarts/dat.guiVR
                                                                                                                *
                                                                                                                * Copyright 2016 Data Arts Team, Google Inc.
                                                                                                                * 
                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                * You may obtain a copy of the License at
                                                                                                                * 
                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                * 
                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                * limitations under the License.
                                                                                                                */

var LOCATOR = exports.LOCATOR = new THREE.MeshBasicMaterial();
var FOLDER = exports.FOLDER = new THREE.MeshBasicMaterial({ color: 0x000000 });

},{"./colors":3}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;

var _textlabel = require('./textlabel');

var _textlabel2 = _interopRequireDefault(_textlabel);

var _interaction = require('./interaction');

var _interaction2 = _interopRequireDefault(_interaction);

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _layout = require('./layout');

var Layout = _interopRequireWildcard(_layout);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

var _grab = require('./grab');

var Grab = _interopRequireWildcard(_grab);

var _palette = require('./palette');

var Palette = _interopRequireWildcard(_palette);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSlider() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var textCreator = _ref.textCreator;
  var object = _ref.object;
  var _ref$propertyName = _ref.propertyName;
  var propertyName = _ref$propertyName === undefined ? 'undefined' : _ref$propertyName;
  var _ref$initialValue = _ref.initialValue;
  var initialValue = _ref$initialValue === undefined ? 0.0 : _ref$initialValue;
  var _ref$min = _ref.min;
  var min = _ref$min === undefined ? 0.0 : _ref$min;
  var _ref$max = _ref.max;
  var max = _ref$max === undefined ? 1.0 : _ref$max;
  var _ref$step = _ref.step;
  var step = _ref$step === undefined ? 0.1 : _ref$step;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? Layout.PANEL_WIDTH : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? Layout.PANEL_HEIGHT : _ref$height;
  var _ref$depth = _ref.depth;
  var depth = _ref$depth === undefined ? Layout.PANEL_DEPTH : _ref$depth;


  var SLIDER_WIDTH = width * 0.5 - Layout.PANEL_MARGIN;
  var SLIDER_HEIGHT = height - Layout.PANEL_MARGIN;
  var SLIDER_DEPTH = depth;

  var state = {
    alpha: 1.0,
    value: initialValue,
    step: step,
    useStep: false,
    precision: 1,
    listen: false,
    min: min,
    max: max,
    onChangedCB: undefined,
    onFinishedChange: undefined,
    pressing: false
  };

  state.step = getImpliedStep(state.value);
  state.precision = numDecimals(state.step);
  state.alpha = getAlphaFromValue(state.value, state.min, state.max);

  var group = new THREE.Group();

  //  filled volume
  var rect = new THREE.BoxGeometry(SLIDER_WIDTH, SLIDER_HEIGHT, SLIDER_DEPTH);
  rect.translate(SLIDER_WIDTH * 0.5, 0, 0);
  // Layout.alignLeft( rect );

  var hitscanMaterial = new THREE.MeshBasicMaterial();
  hitscanMaterial.visible = false;

  var hitscanVolume = new THREE.Mesh(rect.clone(), hitscanMaterial);
  hitscanVolume.position.z = depth;
  hitscanVolume.position.x = width * 0.5;

  //  sliderBG volume
  var sliderBG = new THREE.Mesh(rect.clone(), SharedMaterials.PANEL);
  Colors.colorizeGeometry(sliderBG.geometry, Colors.SLIDER_BG);
  sliderBG.position.z = depth * 0.5;
  sliderBG.position.x = SLIDER_WIDTH + Layout.PANEL_MARGIN;

  var material = new THREE.MeshPhongMaterial({ color: Colors.DEFAULT_COLOR, emissive: Colors.EMISSIVE_COLOR });
  var filledVolume = new THREE.Mesh(rect.clone(), material);
  hitscanVolume.add(filledVolume);

  var endLocator = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05, 1, 1, 1), SharedMaterials.LOCATOR);
  endLocator.position.x = SLIDER_WIDTH;
  hitscanVolume.add(endLocator);
  endLocator.visible = false;

  var valueLabel = textCreator.create(state.value.toString());
  valueLabel.position.x = Layout.PANEL_VALUE_TEXT_MARGIN + width * 0.5;
  valueLabel.position.z = depth * 2;
  valueLabel.position.y = -0.03;

  var descriptorLabel = textCreator.create(propertyName);
  descriptorLabel.position.x = Layout.PANEL_LABEL_TEXT_MARGIN;
  descriptorLabel.position.z = depth;
  descriptorLabel.position.y = -0.03;

  var controllerID = Layout.createControllerIDBox(height, Colors.CONTROLLER_ID_SLIDER);
  controllerID.position.z = depth;

  var panel = Layout.createPanel(width, height, depth);
  panel.add(descriptorLabel, hitscanVolume, sliderBG, valueLabel, controllerID);

  group.add(panel);

  updateValueLabel(state.value);
  updateSlider(state.alpha);

  function updateValueLabel(value) {
    if (state.useStep) {
      valueLabel.update(roundToDecimal(state.value, state.precision).toString());
    } else {
      valueLabel.update(state.value.toString());
    }
  }

  function updateView() {
    if (state.pressing) {
      material.color.setHex(Colors.INTERACTION_COLOR);
    } else if (interaction.hovering()) {
      material.color.setHex(Colors.HIGHLIGHT_COLOR);
      material.emissive.setHex(Colors.HIGHLIGHT_EMISSIVE_COLOR);
    } else {
      material.color.setHex(Colors.DEFAULT_COLOR);
      material.emissive.setHex(Colors.EMISSIVE_COLOR);
    }
  }

  function updateSlider(alpha) {
    alpha = getClampedAlpha(alpha);
    filledVolume.scale.x = Math.max(alpha * width, 0.000001);
  }

  function updateObject(value) {
    object[propertyName] = value;
  }

  function updateStateFromAlpha(alpha) {
    state.alpha = getClampedAlpha(alpha);
    state.value = getValueFromAlpha(state.alpha, state.min, state.max);
    if (state.useStep) {
      state.value = getSteppedValue(state.value, state.step);
    }
    state.value = getClampedValue(state.value, state.min, state.max);
  }

  function listenUpdate() {
    state.value = getValueFromObject();
    state.alpha = getAlphaFromValue(state.value, state.min, state.max);
    state.alpha = getClampedAlpha(state.alpha);
  }

  function getValueFromObject() {
    return parseFloat(object[propertyName]);
  }

  group.onChange = function (callback) {
    state.onChangedCB = callback;
    return group;
  };

  group.step = function (step) {
    state.step = step;
    state.precision = numDecimals(state.step);
    state.useStep = true;
    return group;
  };

  group.listen = function () {
    state.listen = true;
    return group;
  };

  var interaction = (0, _interaction2.default)(hitscanVolume);
  interaction.events.on('onPressed', handlePress);
  interaction.events.on('pressing', handleHold);
  interaction.events.on('onReleased', handleRelease);

  function handlePress(p) {
    if (group.visible === false) {
      return;
    }
    state.pressing = true;
    p.locked = true;
  }

  function handleHold() {
    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var point = _ref2.point;

    if (group.visible === false) {
      return;
    }

    state.pressing = true;

    filledVolume.updateMatrixWorld();
    endLocator.updateMatrixWorld();

    var a = new THREE.Vector3().setFromMatrixPosition(filledVolume.matrixWorld);
    var b = new THREE.Vector3().setFromMatrixPosition(endLocator.matrixWorld);

    var previousValue = state.value;

    updateStateFromAlpha(getPointAlpha(point, { a: a, b: b }));
    updateValueLabel(state.value);
    updateSlider(state.alpha);
    updateObject(state.value);

    if (previousValue !== state.value && state.onChangedCB) {
      state.onChangedCB(state.value);
    }
  }

  function handleRelease() {
    state.pressing = false;
  }

  group.interaction = interaction;
  group.hitscan = [hitscanVolume, panel];

  var grabInteraction = Grab.create({ group: group, panel: panel });
  var paletteInteraction = Palette.create({ group: group, panel: panel });

  group.update = function (inputObjects) {
    interaction.update(inputObjects);
    grabInteraction.update(inputObjects);
    paletteInteraction.update(inputObjects);

    if (state.listen) {
      listenUpdate();
      updateValueLabel(state.value);
      updateSlider(state.alpha);
    }
    updateView();
  };

  group.name = function (str) {
    descriptorLabel.update(str);
    return group;
  };

  group.min = function (m) {
    state.min = m;
    return group;
  };

  group.max = function (m) {
    state.max = m;
    return group;
  };

  return group;
} /**
  * dat-guiVR Javascript Controller Library for VR
  * https://github.com/dataarts/dat.guiVR
  *
  * Copyright 2016 Data Arts Team, Google Inc.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

var ta = new THREE.Vector3();
var tb = new THREE.Vector3();
var tToA = new THREE.Vector3();
var aToB = new THREE.Vector3();

function getPointAlpha(point, segment) {
  ta.copy(segment.b).sub(segment.a);
  tb.copy(point).sub(segment.a);

  var projected = tb.projectOnVector(ta);

  tToA.copy(point).sub(segment.a);

  aToB.copy(segment.b).sub(segment.a).normalize();

  var side = tToA.normalize().dot(aToB) >= 0 ? 1 : -1;

  var length = segment.a.distanceTo(segment.b) * side;

  var alpha = projected.length() / length;
  if (alpha > 1.0) {
    alpha = 1.0;
  }
  if (alpha < 0.0) {
    alpha = 0.0;
  }
  return alpha;
}

function lerp(min, max, value) {
  return (1 - value) * min + value * max;
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getClampedAlpha(alpha) {
  if (alpha > 1) {
    return 1;
  }
  if (alpha < 0) {
    return 0;
  }
  return alpha;
}

function getClampedValue(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function getImpliedStep(value) {
  if (value === 0) {
    return 1; // What are we, psychics?
  } else {
    // Hey Doug, check this out.
    return Math.pow(10, Math.floor(Math.log(Math.abs(value)) / Math.LN10)) / 10;
  }
}

function getValueFromAlpha(alpha, min, max) {
  return map_range(alpha, 0.0, 1.0, min, max);
}

function getAlphaFromValue(value, min, max) {
  return map_range(value, min, max, 0.0, 1.0);
}

function getSteppedValue(value, step) {
  if (value % step != 0) {
    return Math.round(value / step) * step;
  }
  return value;
}

function numDecimals(x) {
  x = x.toString();
  if (x.indexOf('.') > -1) {
    return x.length - x.indexOf('.') - 1;
  } else {
    return 0;
  }
}

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

},{"./colors":3,"./grab":7,"./interaction":9,"./layout":10,"./palette":11,"./sharedmaterials":13,"./textlabel":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTextLabel;

var _colors = require('./colors');

var Colors = _interopRequireWildcard(_colors);

var _sharedmaterials = require('./sharedmaterials');

var SharedMaterials = _interopRequireWildcard(_sharedmaterials);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function createTextLabel(textCreator, str) {
  var width = arguments.length <= 2 || arguments[2] === undefined ? 0.4 : arguments[2];
  var depth = arguments.length <= 3 || arguments[3] === undefined ? 0.029 : arguments[3];
  var fgColor = arguments.length <= 4 || arguments[4] === undefined ? 0xffffff : arguments[4];
  var bgColor = arguments.length <= 5 || arguments[5] === undefined ? Colors.DEFAULT_BACK : arguments[5];
  var scale = arguments.length <= 6 || arguments[6] === undefined ? 1.0 : arguments[6];


  var group = new THREE.Group();
  var internalPositioning = new THREE.Group();
  group.add(internalPositioning);

  var text = textCreator.create(str, { color: fgColor, scale: scale });
  internalPositioning.add(text);

  group.setString = function (str) {
    text.update(str.toString());
  };

  group.setNumber = function (str) {
    text.update(str.toFixed(2));
  };

  text.position.z = 0.015;

  var backBounds = 0.01;
  var margin = 0.01;
  var totalWidth = width;
  var totalHeight = 0.04 + margin * 2;
  var labelBackGeometry = new THREE.BoxGeometry(totalWidth, totalHeight, depth, 1, 1, 1);
  labelBackGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(totalWidth * 0.5 - margin, 0, 0));

  var labelBackMesh = new THREE.Mesh(labelBackGeometry, SharedMaterials.PANEL);
  Colors.colorizeGeometry(labelBackMesh.geometry, bgColor);

  labelBackMesh.position.y = 0.03;
  internalPositioning.add(labelBackMesh);
  internalPositioning.position.y = -totalHeight * 0.5;

  group.back = labelBackMesh;

  return group;
}

},{"./colors":3,"./sharedmaterials":13}],16:[function(require,module,exports){
'use strict';

/*
 *	@author zz85 / http://twitter.com/blurspline / http://www.lab4games.net/zz85/blog
 *	@author centerionware / http://www.centerionware.com
 *
 *	Subdivision Geometry Modifier
 *		using Loop Subdivision Scheme
 *
 *	References:
 *		http://graphics.stanford.edu/~mdfisher/subdivision.html
 *		http://www.holmes3d.net/graphics/subdivision/
 *		http://www.cs.rutgers.edu/~decarlo/readings/subdiv-sg00c.pdf
 *
 *	Known Issues:
 *		- currently doesn't handle "Sharp Edges"
 */

THREE.SubdivisionModifier = function (subdivisions) {

	this.subdivisions = subdivisions === undefined ? 1 : subdivisions;
};

// Applies the "modify" pattern
THREE.SubdivisionModifier.prototype.modify = function (geometry) {

	var repeats = this.subdivisions;

	while (repeats-- > 0) {

		this.smooth(geometry);
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
};

(function () {

	// Some constants
	var WARNINGS = !true; // Set to true for development
	var ABC = ['a', 'b', 'c'];

	function getEdge(a, b, map) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		return map[key];
	}

	function processEdge(a, b, vertices, map, face, metaVertices) {

		var vertexIndexA = Math.min(a, b);
		var vertexIndexB = Math.max(a, b);

		var key = vertexIndexA + "_" + vertexIndexB;

		var edge;

		if (key in map) {

			edge = map[key];
		} else {

			var vertexA = vertices[vertexIndexA];
			var vertexB = vertices[vertexIndexB];

			edge = {

				a: vertexA, // pointer reference
				b: vertexB,
				newEdge: null,
				// aIndex: a, // numbered reference
				// bIndex: b,
				faces: [] // pointers to face

			};

			map[key] = edge;
		}

		edge.faces.push(face);

		metaVertices[a].edges.push(edge);
		metaVertices[b].edges.push(edge);
	}

	function generateLookups(vertices, faces, metaVertices, edges) {

		var i, il, face, edge;

		for (i = 0, il = vertices.length; i < il; i++) {

			metaVertices[i] = { edges: [] };
		}

		for (i = 0, il = faces.length; i < il; i++) {

			face = faces[i];

			processEdge(face.a, face.b, vertices, edges, face, metaVertices);
			processEdge(face.b, face.c, vertices, edges, face, metaVertices);
			processEdge(face.c, face.a, vertices, edges, face, metaVertices);
		}
	}

	function newFace(newFaces, a, b, c) {

		newFaces.push(new THREE.Face3(a, b, c));
	}

	function midpoint(a, b) {

		return Math.abs(b - a) / 2 + Math.min(a, b);
	}

	function newUv(newUvs, a, b, c) {

		newUvs.push([a.clone(), b.clone(), c.clone()]);
	}

	/////////////////////////////

	// Performs one iteration of Subdivision
	THREE.SubdivisionModifier.prototype.smooth = function (geometry) {

		var tmp = new THREE.Vector3();

		var oldVertices, oldFaces, oldUvs;
		var newVertices,
		    newFaces,
		    newUVs = [];

		var n, l, i, il, j, k;
		var metaVertices, sourceEdges;

		// new stuff.
		var sourceEdges, newEdgeVertices, newSourceVertices;

		oldVertices = geometry.vertices; // { x, y, z}
		oldFaces = geometry.faces; // { a: oldVertex1, b: oldVertex2, c: oldVertex3 }
		oldUvs = geometry.faceVertexUvs[0];

		var hasUvs = oldUvs !== undefined && oldUvs.length > 0;

		/******************************************************
   *
   * Step 0: Preprocess Geometry to Generate edges Lookup
   *
   *******************************************************/

		metaVertices = new Array(oldVertices.length);
		sourceEdges = {}; // Edge => { oldVertex1, oldVertex2, faces[]  }

		generateLookups(oldVertices, oldFaces, metaVertices, sourceEdges);

		/******************************************************
   *
   *	Step 1.
   *	For each edge, create a new Edge Vertex,
   *	then position it.
   *
   *******************************************************/

		newEdgeVertices = [];
		var other, currentEdge, newEdge, face;
		var edgeVertexWeight, adjacentVertexWeight, connectedFaces;

		for (i in sourceEdges) {

			currentEdge = sourceEdges[i];
			newEdge = new THREE.Vector3();

			edgeVertexWeight = 3 / 8;
			adjacentVertexWeight = 1 / 8;

			connectedFaces = currentEdge.faces.length;

			// check how many linked faces. 2 should be correct.
			if (connectedFaces != 2) {

				// if length is not 2, handle condition
				edgeVertexWeight = 0.5;
				adjacentVertexWeight = 0;

				if (connectedFaces != 1) {

					if (WARNINGS) console.warn('Subdivision Modifier: Number of connected faces != 2, is: ', connectedFaces, currentEdge);
				}
			}

			newEdge.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < connectedFaces; j++) {

				face = currentEdge.faces[j];

				for (k = 0; k < 3; k++) {

					other = oldVertices[face[ABC[k]]];
					if (other !== currentEdge.a && other !== currentEdge.b) break;
				}

				tmp.add(other);
			}

			tmp.multiplyScalar(adjacentVertexWeight);
			newEdge.add(tmp);

			currentEdge.newEdge = newEdgeVertices.length;
			newEdgeVertices.push(newEdge);

			// console.log(currentEdge, newEdge);
		}

		/******************************************************
   *
   *	Step 2.
   *	Reposition each source vertices.
   *
   *******************************************************/

		var beta, sourceVertexWeight, connectingVertexWeight;
		var connectingEdge, connectingEdges, oldVertex, newSourceVertex;
		newSourceVertices = [];

		for (i = 0, il = oldVertices.length; i < il; i++) {

			oldVertex = oldVertices[i];

			// find all connecting edges (using lookupTable)
			connectingEdges = metaVertices[i].edges;
			n = connectingEdges.length;

			if (n == 3) {

				beta = 3 / 16;
			} else if (n > 3) {

				beta = 3 / (8 * n); // Warren's modified formula
			}

			// Loop's original beta formula
			// beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );

			sourceVertexWeight = 1 - n * beta;
			connectingVertexWeight = beta;

			if (n <= 2) {

				// crease and boundary rules
				// console.warn('crease and boundary rules');

				if (n == 2) {

					if (WARNINGS) console.warn('2 connecting edges', connectingEdges);
					sourceVertexWeight = 3 / 4;
					connectingVertexWeight = 1 / 8;

					// sourceVertexWeight = 1;
					// connectingVertexWeight = 0;
				} else if (n == 1) {

					if (WARNINGS) console.warn('only 1 connecting edge');
				} else if (n == 0) {

					if (WARNINGS) console.warn('0 connecting edges');
				}
			}

			newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);

			tmp.set(0, 0, 0);

			for (j = 0; j < n; j++) {

				connectingEdge = connectingEdges[j];
				other = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
				tmp.add(other);
			}

			tmp.multiplyScalar(connectingVertexWeight);
			newSourceVertex.add(tmp);

			newSourceVertices.push(newSourceVertex);
		}

		/******************************************************
   *
   *	Step 3.
   *	Generate Faces between source vertices
   *	and edge vertices.
   *
   *******************************************************/

		newVertices = newSourceVertices.concat(newEdgeVertices);
		var sl = newSourceVertices.length,
		    edge1,
		    edge2,
		    edge3;
		newFaces = [];

		var uv, x0, x1, x2;
		var x3 = new THREE.Vector2();
		var x4 = new THREE.Vector2();
		var x5 = new THREE.Vector2();

		for (i = 0, il = oldFaces.length; i < il; i++) {

			face = oldFaces[i];

			// find the 3 new edges vertex of each old face

			edge1 = getEdge(face.a, face.b, sourceEdges).newEdge + sl;
			edge2 = getEdge(face.b, face.c, sourceEdges).newEdge + sl;
			edge3 = getEdge(face.c, face.a, sourceEdges).newEdge + sl;

			// create 4 faces.

			newFace(newFaces, edge1, edge2, edge3);
			newFace(newFaces, face.a, edge1, edge3);
			newFace(newFaces, face.b, edge2, edge1);
			newFace(newFaces, face.c, edge3, edge2);

			// create 4 new uv's

			if (hasUvs) {

				uv = oldUvs[i];

				x0 = uv[0];
				x1 = uv[1];
				x2 = uv[2];

				x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
				x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
				x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));

				newUv(newUVs, x3, x4, x5);
				newUv(newUVs, x0, x3, x5);

				newUv(newUVs, x1, x4, x3);
				newUv(newUVs, x2, x5, x4);
			}
		}

		// Overwrite old arrays
		geometry.vertices = newVertices;
		geometry.faces = newFaces;
		if (hasUvs) geometry.faceVertexUvs[0] = newUVs;

		// console.log('done');
	};
})();

},{}],17:[function(require,module,exports){
var str = Object.prototype.toString

module.exports = anArray

function anArray(arr) {
  return (
       arr.BYTES_PER_ELEMENT
    && str.call(arr.buffer) === '[object ArrayBuffer]'
    || Array.isArray(arr)
  )
}

},{}],18:[function(require,module,exports){
module.exports = function numtype(num, def) {
	return typeof num === 'number'
		? num 
		: (typeof def === 'number' ? def : 0)
}
},{}],19:[function(require,module,exports){
module.exports = function(dtype) {
  switch (dtype) {
    case 'int8':
      return Int8Array
    case 'int16':
      return Int16Array
    case 'int32':
      return Int32Array
    case 'uint8':
      return Uint8Array
    case 'uint16':
      return Uint16Array
    case 'uint32':
      return Uint32Array
    case 'float32':
      return Float32Array
    case 'float64':
      return Float64Array
    case 'array':
      return Array
    case 'uint8_clamped':
      return Uint8ClampedArray
  }
}

},{}],20:[function(require,module,exports){
/*eslint new-cap:0*/
var dtype = require('dtype')
module.exports = flattenVertexData
function flattenVertexData (data, output, offset) {
  if (!data) throw new TypeError('must specify data as first parameter')
  offset = +(offset || 0) | 0

  if (Array.isArray(data) && Array.isArray(data[0])) {
    var dim = data[0].length
    var length = data.length * dim

    // no output specified, create a new typed array
    if (!output || typeof output === 'string') {
      output = new (dtype(output || 'float32'))(length + offset)
    }

    var dstLength = output.length - offset
    if (length !== dstLength) {
      throw new Error('source length ' + length + ' (' + dim + 'x' + data.length + ')' +
        ' does not match destination length ' + dstLength)
    }

    for (var i = 0, k = offset; i < data.length; i++) {
      for (var j = 0; j < dim; j++) {
        output[k++] = data[i][j]
      }
    }
  } else {
    if (!output || typeof output === 'string') {
      // no output, create a new one
      var Ctor = dtype(output || 'float32')
      if (offset === 0) {
        output = new Ctor(data)
      } else {
        output = new Ctor(data.length + offset)
        output.set(data, offset)
      }
    } else {
      // store output in existing array
      output.set(data, offset)
    }
  }

  return output
}

},{"dtype":19}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],22:[function(require,module,exports){
module.exports = function compile(property) {
	if (!property || typeof property !== 'string')
		throw new Error('must specify property for indexof search')

	return new Function('array', 'value', 'start', [
		'start = start || 0',
		'for (var i=start; i<array.length; i++)',
		'  if (array[i]["' + property +'"] === value)',
		'      return i',
		'return -1'
	].join('\n'))
}
},{}],23:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],24:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],25:[function(require,module,exports){
var wordWrap = require('word-wrapper')
var xtend = require('xtend')
var findChar = require('indexof-property')('id')
var number = require('as-number')

var X_HEIGHTS = ['x', 'e', 'a', 'o', 'n', 's', 'r', 'c', 'u', 'm', 'v', 'w', 'z']
var M_WIDTHS = ['m', 'w']
var CAP_HEIGHTS = ['H', 'I', 'N', 'E', 'F', 'K', 'L', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


var TAB_ID = '\t'.charCodeAt(0)
var SPACE_ID = ' '.charCodeAt(0)
var ALIGN_LEFT = 0, 
    ALIGN_CENTER = 1, 
    ALIGN_RIGHT = 2

module.exports = function createLayout(opt) {
  return new TextLayout(opt)
}

function TextLayout(opt) {
  this.glyphs = []
  this._measure = this.computeMetrics.bind(this)
  this.update(opt)
}

TextLayout.prototype.update = function(opt) {
  opt = xtend({
    measure: this._measure
  }, opt)
  this._opt = opt
  this._opt.tabSize = number(this._opt.tabSize, 4)

  if (!opt.font)
    throw new Error('must provide a valid bitmap font')

  var glyphs = this.glyphs
  var text = opt.text||'' 
  var font = opt.font
  this._setupSpaceGlyphs(font)
  
  var lines = wordWrap.lines(text, opt)
  var minWidth = opt.width || 0

  //clear glyphs
  glyphs.length = 0

  //get max line width
  var maxLineWidth = lines.reduce(function(prev, line) {
    return Math.max(prev, line.width, minWidth)
  }, 0)

  //the pen position
  var x = 0
  var y = 0
  var lineHeight = number(opt.lineHeight, font.common.lineHeight)
  var baseline = font.common.base
  var descender = lineHeight-baseline
  var letterSpacing = opt.letterSpacing || 0
  var height = lineHeight * lines.length - descender
  var align = getAlignType(this._opt.align)

  //draw text along baseline
  y -= height
  
  //the metrics for this text layout
  this._width = maxLineWidth
  this._height = height
  this._descender = lineHeight - baseline
  this._baseline = baseline
  this._xHeight = getXHeight(font)
  this._capHeight = getCapHeight(font)
  this._lineHeight = lineHeight
  this._ascender = lineHeight - descender - this._xHeight
    
  //layout each glyph
  var self = this
  lines.forEach(function(line, lineIndex) {
    var start = line.start
    var end = line.end
    var lineWidth = line.width
    var lastGlyph
    
    //for each glyph in that line...
    for (var i=start; i<end; i++) {
      var id = text.charCodeAt(i)
      var glyph = self.getGlyph(font, id)
      if (glyph) {
        if (lastGlyph) 
          x += getKerning(font, lastGlyph.id, glyph.id)

        var tx = x
        if (align === ALIGN_CENTER) 
          tx += (maxLineWidth-lineWidth)/2
        else if (align === ALIGN_RIGHT)
          tx += (maxLineWidth-lineWidth)

        glyphs.push({
          position: [tx, y],
          data: glyph,
          index: i,
          line: lineIndex
        })  

        //move pen forward
        x += glyph.xadvance + letterSpacing
        lastGlyph = glyph
      }
    }

    //next line down
    y += lineHeight
    x = 0
  })
  this._linesTotal = lines.length;
}

TextLayout.prototype._setupSpaceGlyphs = function(font) {
  //These are fallbacks, when the font doesn't include
  //' ' or '\t' glyphs
  this._fallbackSpaceGlyph = null
  this._fallbackTabGlyph = null

  if (!font.chars || font.chars.length === 0)
    return

  //try to get space glyph
  //then fall back to the 'm' or 'w' glyphs
  //then fall back to the first glyph available
  var space = getGlyphById(font, SPACE_ID) 
          || getMGlyph(font) 
          || font.chars[0]

  //and create a fallback for tab
  var tabWidth = this._opt.tabSize * space.xadvance
  this._fallbackSpaceGlyph = space
  this._fallbackTabGlyph = xtend(space, {
    x: 0, y: 0, xadvance: tabWidth, id: TAB_ID, 
    xoffset: 0, yoffset: 0, width: 0, height: 0
  })
}

TextLayout.prototype.getGlyph = function(font, id) {
  var glyph = getGlyphById(font, id)
  if (glyph)
    return glyph
  else if (id === TAB_ID) 
    return this._fallbackTabGlyph
  else if (id === SPACE_ID) 
    return this._fallbackSpaceGlyph
  return null
}

TextLayout.prototype.computeMetrics = function(text, start, end, width) {
  var letterSpacing = this._opt.letterSpacing || 0
  var font = this._opt.font
  var curPen = 0
  var curWidth = 0
  var count = 0
  var glyph
  var lastGlyph

  if (!font.chars || font.chars.length === 0) {
    return {
      start: start,
      end: start,
      width: 0
    }
  }

  end = Math.min(text.length, end)
  for (var i=start; i < end; i++) {
    var id = text.charCodeAt(i)
    var glyph = this.getGlyph(font, id)

    if (glyph) {
      //move pen forward
      var xoff = glyph.xoffset
      var kern = lastGlyph ? getKerning(font, lastGlyph.id, glyph.id) : 0
      curPen += kern

      var nextPen = curPen + glyph.xadvance + letterSpacing
      var nextWidth = curPen + glyph.width

      //we've hit our limit; we can't move onto the next glyph
      if (nextWidth >= width || nextPen >= width)
        break

      //otherwise continue along our line
      curPen = nextPen
      curWidth = nextWidth
      lastGlyph = glyph
    }
    count++
  }
  
  //make sure rightmost edge lines up with rendered glyphs
  if (lastGlyph)
    curWidth += lastGlyph.xoffset

  return {
    start: start,
    end: start + count,
    width: curWidth
  }
}

//getters for the private vars
;['width', 'height', 
  'descender', 'ascender',
  'xHeight', 'baseline',
  'capHeight',
  'lineHeight' ].forEach(addGetter)

function addGetter(name) {
  Object.defineProperty(TextLayout.prototype, name, {
    get: wrapper(name),
    configurable: true
  })
}

//create lookups for private vars
function wrapper(name) {
  return (new Function([
    'return function '+name+'() {',
    '  return this._'+name,
    '}'
  ].join('\n')))()
}

function getGlyphById(font, id) {
  if (!font.chars || font.chars.length === 0)
    return null

  var glyphIdx = findChar(font.chars, id)
  if (glyphIdx >= 0)
    return font.chars[glyphIdx]
  return null
}

function getXHeight(font) {
  for (var i=0; i<X_HEIGHTS.length; i++) {
    var id = X_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getMGlyph(font) {
  for (var i=0; i<M_WIDTHS.length; i++) {
    var id = M_WIDTHS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx]
  }
  return 0
}

function getCapHeight(font) {
  for (var i=0; i<CAP_HEIGHTS.length; i++) {
    var id = CAP_HEIGHTS[i].charCodeAt(0)
    var idx = findChar(font.chars, id)
    if (idx >= 0) 
      return font.chars[idx].height
  }
  return 0
}

function getKerning(font, left, right) {
  if (!font.kernings || font.kernings.length === 0)
    return 0

  var table = font.kernings
  for (var i=0; i<table.length; i++) {
    var kern = table[i]
    if (kern.first === left && kern.second === right)
      return kern.amount
  }
  return 0
}

function getAlignType(align) {
  if (align === 'center')
    return ALIGN_CENTER
  else if (align === 'right')
    return ALIGN_RIGHT
  return ALIGN_LEFT
}
},{"as-number":18,"indexof-property":22,"word-wrapper":34,"xtend":35}],26:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],27:[function(require,module,exports){
module.exports = function parseBMFontAscii(data) {
  if (!data)
    throw new Error('no data provided')
  data = data.toString().trim()

  var output = {
    pages: [],
    chars: [],
    kernings: []
  }

  var lines = data.split(/\r\n?|\n/g)

  if (lines.length === 0)
    throw new Error('no data in BMFont file')

  for (var i = 0; i < lines.length; i++) {
    var lineData = splitLine(lines[i], i)
    if (!lineData) //skip empty lines
      continue

    if (lineData.key === 'page') {
      if (typeof lineData.data.id !== 'number')
        throw new Error('malformed file at line ' + i + ' -- needs page id=N')
      if (typeof lineData.data.file !== 'string')
        throw new Error('malformed file at line ' + i + ' -- needs page file="path"')
      output.pages[lineData.data.id] = lineData.data.file
    } else if (lineData.key === 'chars' || lineData.key === 'kernings') {
      //... do nothing for these two ...
    } else if (lineData.key === 'char') {
      output.chars.push(lineData.data)
    } else if (lineData.key === 'kerning') {
      output.kernings.push(lineData.data)
    } else {
      output[lineData.key] = lineData.data
    }
  }

  return output
}

function splitLine(line, idx) {
  line = line.replace(/\t+/g, ' ').trim()
  if (!line)
    return null

  var space = line.indexOf(' ')
  if (space === -1) 
    throw new Error("no named row at line " + idx)

  var key = line.substring(0, space)

  line = line.substring(space + 1)
  //clear "letter" field as it is non-standard and
  //requires additional complexity to parse " / = symbols
  line = line.replace(/letter=[\'\"]\S+[\'\"]/gi, '')  
  line = line.split("=")
  line = line.map(function(str) {
    return str.trim().match((/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g))
  })

  var data = []
  for (var i = 0; i < line.length; i++) {
    var dt = line[i]
    if (i === 0) {
      data.push({
        key: dt[0],
        data: ""
      })
    } else if (i === line.length - 1) {
      data[data.length - 1].data = parseData(dt[0])
    } else {
      data[data.length - 1].data = parseData(dt[0])
      data.push({
        key: dt[1],
        data: ""
      })
    }
  }

  var out = {
    key: key,
    data: {}
  }

  data.forEach(function(v) {
    out.data[v.key] = v.data;
  })

  return out
}

function parseData(data) {
  if (!data || data.length === 0)
    return ""

  if (data.indexOf('"') === 0 || data.indexOf("'") === 0)
    return data.substring(1, data.length - 1)
  if (data.indexOf(',') !== -1)
    return parseIntList(data)
  return parseInt(data, 10)
}

function parseIntList(data) {
  return data.split(',').map(function(val) {
    return parseInt(val, 10)
  })
}
},{}],28:[function(require,module,exports){
var dtype = require('dtype')
var anArray = require('an-array')
var isBuffer = require('is-buffer')

var CW = [0, 2, 3]
var CCW = [2, 1, 3]

module.exports = function createQuadElements(array, opt) {
    //if user didn't specify an output array
    if (!array || !(anArray(array) || isBuffer(array))) {
        opt = array || {}
        array = null
    }

    if (typeof opt === 'number') //backwards-compatible
        opt = { count: opt }
    else
        opt = opt || {}

    var type = typeof opt.type === 'string' ? opt.type : 'uint16'
    var count = typeof opt.count === 'number' ? opt.count : 1
    var start = (opt.start || 0) 

    var dir = opt.clockwise !== false ? CW : CCW,
        a = dir[0], 
        b = dir[1],
        c = dir[2]

    var numIndices = count * 6

    var indices = array || new (dtype(type))(numIndices)
    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
        var x = i + start
        indices[x + 0] = j + 0
        indices[x + 1] = j + 1
        indices[x + 2] = j + 2
        indices[x + 3] = j + a
        indices[x + 4] = j + b
        indices[x + 5] = j + c
    }
    return indices
}
},{"an-array":17,"dtype":19,"is-buffer":24}],29:[function(require,module,exports){
var createLayout = require('layout-bmfont-text')
var inherits = require('inherits')
var createIndices = require('quad-indices')
var buffer = require('three-buffer-vertex-data')
var assign = require('object-assign')

var vertices = require('./lib/vertices')
var utils = require('./lib/utils')

var Base = THREE.BufferGeometry

module.exports = function createTextGeometry (opt) {
  return new TextGeometry(opt)
}

function TextGeometry (opt) {
  Base.call(this)

  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use these as default values for any subsequent
  // calls to update()
  this._opt = assign({}, opt)

  // also do an initial setup...
  if (opt) this.update(opt)
}

inherits(TextGeometry, Base)

TextGeometry.prototype.update = function (opt) {
  if (typeof opt === 'string') {
    opt = { text: opt }
  }

  // use constructor defaults
  opt = assign({}, this._opt, opt)

  if (!opt.font) {
    throw new TypeError('must specify a { font } in options')
  }

  this.layout = createLayout(opt)

  // get vec2 texcoords
  var flipY = opt.flipY !== false

  // the desired BMFont data
  var font = opt.font

  // determine texture size from font file
  var texWidth = font.common.scaleW
  var texHeight = font.common.scaleH

  // get visible glyphs
  var glyphs = this.layout.glyphs.filter(function (glyph) {
    var bitmap = glyph.data
    return bitmap.width * bitmap.height > 0
  })

  // provide visible glyphs for convenience
  this.visibleGlyphs = glyphs

  // get common vertex data
  var positions = vertices.positions(glyphs)
  var uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY)
  var indices = createIndices({
    clockwise: true,
    type: 'uint16',
    count: glyphs.length
  })

  // update vertex data
  buffer.index(this, indices, 1, 'uint16')
  buffer.attr(this, 'position', positions, 2)
  buffer.attr(this, 'uv', uvs, 2)

  // update multipage data
  if (!opt.multipage && 'page' in this.attributes) {
    // disable multipage rendering
    this.removeAttribute('page')
  } else if (opt.multipage) {
    var pages = vertices.pages(glyphs)
    // enable multipage rendering
    buffer.attr(this, 'page', pages, 1)
  }
}

TextGeometry.prototype.computeBoundingSphere = function () {
  if (this.boundingSphere === null) {
    this.boundingSphere = new THREE.Sphere()
  }

  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    this.boundingSphere.radius = 0
    this.boundingSphere.center.set(0, 0, 0)
    return
  }
  utils.computeSphere(positions, this.boundingSphere)
  if (isNaN(this.boundingSphere.radius)) {
    console.error('THREE.BufferGeometry.computeBoundingSphere(): ' +
      'Computed radius is NaN. The ' +
      '"position" attribute is likely to have NaN values.')
  }
}

TextGeometry.prototype.computeBoundingBox = function () {
  if (this.boundingBox === null) {
    this.boundingBox = new THREE.Box3()
  }

  var bbox = this.boundingBox
  var positions = this.attributes.position.array
  var itemSize = this.attributes.position.itemSize
  if (!positions || !itemSize || positions.length < 2) {
    bbox.makeEmpty()
    return
  }
  utils.computeBox(positions, bbox)
}

},{"./lib/utils":30,"./lib/vertices":31,"inherits":23,"layout-bmfont-text":25,"object-assign":26,"quad-indices":28,"three-buffer-vertex-data":33}],30:[function(require,module,exports){
var itemSize = 2
var box = { min: [0, 0], max: [0, 0] }

function bounds (positions) {
  var count = positions.length / itemSize
  box.min[0] = positions[0]
  box.min[1] = positions[1]
  box.max[0] = positions[0]
  box.max[1] = positions[1]

  for (var i = 0; i < count; i++) {
    var x = positions[i * itemSize + 0]
    var y = positions[i * itemSize + 1]
    box.min[0] = Math.min(x, box.min[0])
    box.min[1] = Math.min(y, box.min[1])
    box.max[0] = Math.max(x, box.max[0])
    box.max[1] = Math.max(y, box.max[1])
  }
}

module.exports.computeBox = function (positions, output) {
  bounds(positions)
  output.min.set(box.min[0], box.min[1], 0)
  output.max.set(box.max[0], box.max[1], 0)
}

module.exports.computeSphere = function (positions, output) {
  bounds(positions)
  var minX = box.min[0]
  var minY = box.min[1]
  var maxX = box.max[0]
  var maxY = box.max[1]
  var width = maxX - minX
  var height = maxY - minY
  var length = Math.sqrt(width * width + height * height)
  output.center.set(minX + width / 2, minY + height / 2, 0)
  output.radius = length / 2
}

},{}],31:[function(require,module,exports){
module.exports.pages = function pages (glyphs) {
  var pages = new Float32Array(glyphs.length * 4 * 1)
  var i = 0
  glyphs.forEach(function (glyph) {
    var id = glyph.data.page || 0
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
    pages[i++] = id
  })
  return pages
}

module.exports.uvs = function uvs (glyphs, texWidth, texHeight, flipY) {
  var uvs = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data
    var bw = (bitmap.x + bitmap.width)
    var bh = (bitmap.y + bitmap.height)

    // top left position
    var u0 = bitmap.x / texWidth
    var v1 = bitmap.y / texHeight
    var u1 = bw / texWidth
    var v0 = bh / texHeight

    if (flipY) {
      v1 = (texHeight - bitmap.y) / texHeight
      v0 = (texHeight - bh) / texHeight
    }

    // BL
    uvs[i++] = u0
    uvs[i++] = v1
    // TL
    uvs[i++] = u0
    uvs[i++] = v0
    // TR
    uvs[i++] = u1
    uvs[i++] = v0
    // BR
    uvs[i++] = u1
    uvs[i++] = v1
  })
  return uvs
}

module.exports.positions = function positions (glyphs) {
  var positions = new Float32Array(glyphs.length * 4 * 2)
  var i = 0
  glyphs.forEach(function (glyph) {
    var bitmap = glyph.data

    // bottom left position
    var x = glyph.position[0] + bitmap.xoffset
    var y = glyph.position[1] + bitmap.yoffset

    // quad size
    var w = bitmap.width
    var h = bitmap.height

    // BL
    positions[i++] = x
    positions[i++] = y
    // TL
    positions[i++] = x
    positions[i++] = y + h
    // TR
    positions[i++] = x + w
    positions[i++] = y + h
    // BR
    positions[i++] = x + w
    positions[i++] = y
  })
  return positions
}

},{}],32:[function(require,module,exports){
var assign = require('object-assign')

module.exports = function createSDFShader (opt) {
  opt = opt || {}
  var opacity = typeof opt.opacity === 'number' ? opt.opacity : 1
  var alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001
  var precision = opt.precision || 'highp'
  var color = opt.color
  var map = opt.map

  // remove to satisfy r73
  delete opt.map
  delete opt.color
  delete opt.precision
  delete opt.opacity

  return assign({
    uniforms: {
      opacity: { type: 'f', value: opacity },
      map: { type: 't', value: map || new THREE.Texture() },
      color: { type: 'c', value: new THREE.Color(color) }
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}'
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',

      'float aastep(float value) {',
      '  #ifdef GL_OES_standard_derivatives',
      '    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;',
      '  #else',
      '    float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));',
      '  #endif',
      '  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);',
      '}',

      'void main() {',
      '  vec4 texColor = texture2D(map, vUv);',
      '  float alpha = aastep(texColor.a);',
      '  gl_FragColor = vec4(color, opacity * alpha);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}'
    ].join('\n')
  }, opt)
}

},{"object-assign":26}],33:[function(require,module,exports){
var flatten = require('flatten-vertex-data')
var warned = false;

module.exports.attr = setAttribute
module.exports.index = setIndex

function setIndex (geometry, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 1
  if (typeof dtype !== 'string') dtype = 'uint16'

  var isR69 = !geometry.index && typeof geometry.setIndex !== 'function'
  var attrib = isR69 ? geometry.getAttribute('index') : geometry.index
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    if (isR69) geometry.addAttribute('index', newAttrib)
    else geometry.index = newAttrib
  }
}

function setAttribute (geometry, key, data, itemSize, dtype) {
  if (typeof itemSize !== 'number') itemSize = 3
  if (typeof dtype !== 'string') dtype = 'float32'
  if (Array.isArray(data) &&
    Array.isArray(data[0]) &&
    data[0].length !== itemSize) {
    throw new Error('Nested vertex array has unexpected size; expected ' +
      itemSize + ' but found ' + data[0].length)
  }

  var attrib = geometry.getAttribute(key)
  var newAttrib = updateAttribute(attrib, data, itemSize, dtype)
  if (newAttrib) {
    geometry.addAttribute(key, newAttrib)
  }
}

function updateAttribute (attrib, data, itemSize, dtype) {
  data = data || []
  if (!attrib || rebuildAttribute(attrib, data, itemSize)) {
    // create a new array with desired type
    data = flatten(data, dtype)
    if (attrib && !warned) {
      warned = true;
      console.warn([
        'A WebGL buffer is being updated with a new size or itemSize, ',
        'however ThreeJS only supports fixed-size buffers.\nThe old buffer may ',
        'still be kept in memory.\n',
        'To avoid memory leaks, it is recommended that you dispose ',
        'your geometries and create new ones, or support the following PR in ThreeJS:\n',
        'https://github.com/mrdoob/three.js/pull/9631'
      ].join(''));
    }
    attrib = new THREE.BufferAttribute(data, itemSize)
    attrib.needsUpdate = true
    return attrib
  } else {
    // copy data into the existing array
    flatten(data, attrib.array)
    attrib.needsUpdate = true
    return null
  }
}

// Test whether the attribute needs to be re-created,
// returns false if we can re-use it as-is.
function rebuildAttribute (attrib, data, itemSize) {
  if (attrib.itemSize !== itemSize) return true
  if (!attrib.array) return true
  var attribLength = attrib.array.length
  if (Array.isArray(data) && Array.isArray(data[0])) {
    // [ [ x, y, z ] ]
    return attribLength !== data.length * itemSize
  } else {
    // [ x, y, z ]
    return attribLength !== data.length
  }
  return false
}

},{"flatten-vertex-data":20}],34:[function(require,module,exports){
var newline = /\n/
var newlineChar = '\n'
var whitespace = /\s/

module.exports = function(text, opt) {
    var lines = module.exports.lines(text, opt)
    return lines.map(function(line) {
        return text.substring(line.start, line.end)
    }).join('\n')
}

module.exports.lines = function wordwrap(text, opt) {
    opt = opt||{}

    //zero width results in nothing visible
    if (opt.width === 0 && opt.mode !== 'nowrap') 
        return []

    text = text||''
    var width = typeof opt.width === 'number' ? opt.width : Number.MAX_VALUE
    var start = Math.max(0, opt.start||0)
    var end = typeof opt.end === 'number' ? opt.end : text.length
    var mode = opt.mode

    var measure = opt.measure || monospace
    if (mode === 'pre')
        return pre(measure, text, start, end, width)
    else
        return greedy(measure, text, start, end, width, mode)
}

function idxOf(text, chr, start, end) {
    var idx = text.indexOf(chr, start)
    if (idx === -1 || idx > end)
        return end
    return idx
}

function isWhitespace(chr) {
    return whitespace.test(chr)
}

function pre(measure, text, start, end, width) {
    var lines = []
    var lineStart = start
    for (var i=start; i<end && i<text.length; i++) {
        var chr = text.charAt(i)
        var isNewline = newline.test(chr)

        //If we've reached a newline, then step down a line
        //Or if we've reached the EOF
        if (isNewline || i===end-1) {
            var lineEnd = isNewline ? i : i+1
            var measured = measure(text, lineStart, lineEnd, width)
            lines.push(measured)
            
            lineStart = i+1
        }
    }
    return lines
}

function greedy(measure, text, start, end, width, mode) {
    //A greedy word wrapper based on LibGDX algorithm
    //https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/BitmapFontCache.java
    var lines = []

    var testWidth = width
    //if 'nowrap' is specified, we only wrap on newline chars
    if (mode === 'nowrap')
        testWidth = Number.MAX_VALUE

    while (start < end && start < text.length) {
        //get next newline position
        var newLine = idxOf(text, newlineChar, start, end)

        //eat whitespace at start of line
        while (start < newLine) {
            if (!isWhitespace( text.charAt(start) ))
                break
            start++
        }

        //determine visible # of glyphs for the available width
        var measured = measure(text, start, newLine, testWidth)

        var lineEnd = start + (measured.end-measured.start)
        var nextStart = lineEnd + newlineChar.length

        //if we had to cut the line before the next newline...
        if (lineEnd < newLine) {
            //find char to break on
            while (lineEnd > start) {
                if (isWhitespace(text.charAt(lineEnd)))
                    break
                lineEnd--
            }
            if (lineEnd === start) {
                if (nextStart > start + newlineChar.length) nextStart--
                lineEnd = nextStart // If no characters to break, show all.
            } else {
                nextStart = lineEnd
                //eat whitespace at end of line
                while (lineEnd > start) {
                    if (!isWhitespace(text.charAt(lineEnd - newlineChar.length)))
                        break
                    lineEnd--
                }
            }
        }
        if (lineEnd >= start) {
            var result = measure(text, start, lineEnd, testWidth)
            lines.push(result)
        }
        start = nextStart
    }
    return lines
}

//determines the visible number of glyphs within a given width
function monospace(text, start, end, width) {
    var glyphs = Math.min(width, end-start)
    return {
        start: start,
        end: start+glyphs
    }
}
},{}],35:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcYnV0dG9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNoZWNrYm94LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGNvbG9ycy5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxkcm9wZG93bi5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxmb2xkZXIuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcZm9udC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxncmFiLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGluZGV4LmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGludGVyYWN0aW9uLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXGxheW91dC5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFxwYWxldHRlLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNkZnRleHQuanMiLCJtb2R1bGVzXFxkYXRndWl2clxcc2hhcmVkbWF0ZXJpYWxzLmpzIiwibW9kdWxlc1xcZGF0Z3VpdnJcXHNsaWRlci5qcyIsIm1vZHVsZXNcXGRhdGd1aXZyXFx0ZXh0bGFiZWwuanMiLCJtb2R1bGVzXFx0aGlyZHBhcnR5XFxTdWJkaXZpc2lvbk1vZGlmaWVyLmpzIiwibm9kZV9tb2R1bGVzL2FuLWFycmF5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzLW51bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kdHlwZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0dGVuLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaW5kZXhvZi1wcm9wZXJ0eS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sYXlvdXQtYm1mb250LXRleHQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZS1ibWZvbnQtYXNjaWkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcXVhZC1pbmRpY2VzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RocmVlLWJtZm9udC10ZXh0L2xpYi91dGlscy5qcyIsIm5vZGVfbW9kdWxlcy90aHJlZS1ibWZvbnQtdGV4dC9saWIvdmVydGljZXMuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYuanMiLCJub2RlX21vZHVsZXMvdGhyZWUtYnVmZmVyLXZlcnRleC1kYXRhL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dvcmQtd3JhcHBlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94dGVuZC9pbW11dGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztrQkM0QndCLGM7O0FBVHhCOztJQUFZLG1COztBQUVaOzs7O0FBQ0E7Ozs7QUFDQTs7SUFBWSxNOztBQUNaOztJQUFZLE07O0FBQ1o7O0lBQVksZTs7QUFDWjs7SUFBWSxJOzs7Ozs7QUFFRyxTQUFTLGNBQVQsR0FPUDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsTUFOTixXQU1NLFFBTk4sV0FNTTtBQUFBLE1BTE4sTUFLTSxRQUxOLE1BS007QUFBQSwrQkFKTixZQUlNO0FBQUEsTUFKTixZQUlNLHFDQUpTLFdBSVQ7QUFBQSx3QkFITixLQUdNO0FBQUEsTUFITixLQUdNLDhCQUhFLE9BQU8sV0FHVDtBQUFBLHlCQUZOLE1BRU07QUFBQSxNQUZOLE1B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QTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBTdWJkaXZpc2lvbk1vZGlmaWVyIGZyb20gJy4uL3RoaXJkcGFydHkvU3ViZGl2aXNpb25Nb2RpZmllcic7XHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBCVVRUT05fV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQlVUVE9OX0RFUFRIID0gTGF5b3V0LkJVVFRPTl9ERVBUSDtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICk7XHJcbiAgZ3JvdXAuYWRkKCBwYW5lbCApO1xyXG5cclxuICAvLyAgYmFzZSBjaGVja2JveFxyXG4gIGNvbnN0IGRpdmlzaW9ucyA9IDQ7XHJcbiAgY29uc3QgYXNwZWN0UmF0aW8gPSBCVVRUT05fV0lEVEggLyBCVVRUT05fSEVJR0hUO1xyXG4gIGNvbnN0IHJlY3QgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIEJVVFRPTl9XSURUSCwgQlVUVE9OX0hFSUdIVCwgQlVUVE9OX0RFUFRILCBNYXRoLmZsb29yKCBkaXZpc2lvbnMgKiBhc3BlY3RSYXRpbyApLCBkaXZpc2lvbnMsIGRpdmlzaW9ucyApO1xyXG4gIGNvbnN0IG1vZGlmaWVyID0gbmV3IFRIUkVFLlN1YmRpdmlzaW9uTW9kaWZpZXIoIDEgKTtcclxuICBtb2RpZmllci5tb2RpZnkoIHJlY3QgKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQlVUVE9OX1dJRFRIICogMC41LCAwLCAwICk7XHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBCVVRUT05fREVQVEggKiAwLjU7XHJcbiAgaGl0c2NhblZvbHVtZS5wb3NpdGlvbi54ID0gd2lkdGggKiAwLjU7XHJcblxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5CVVRUT05fQ09MT1IsIGVtaXNzaXZlOiBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgfSk7XHJcbiAgY29uc3QgZmlsbGVkVm9sdW1lID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgbWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLmFkZCggZmlsbGVkVm9sdW1lICk7XHJcblxyXG5cclxuICBjb25zdCBidXR0b25MYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lLCB7IHNjYWxlOiAwLjg2NiB9ICk7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueCA9IEJVVFRPTl9XSURUSCAqIDAuNSAtIGJ1dHRvbkxhYmVsLmxheW91dC53aWR0aCAqIDAuMDAwMTEgKiAwLjU7XHJcbiAgYnV0dG9uTGFiZWwucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDEuMjtcclxuICBidXR0b25MYWJlbC5wb3NpdGlvbi55ID0gLTAuMDI1O1xyXG4gIGZpbGxlZFZvbHVtZS5hZGQoIGJ1dHRvbkxhYmVsICk7XHJcblxyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9CVVRUT04gKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICB1cGRhdGVWaWV3KCk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUHJlc3MoIHAgKXtcclxuICAgIGlmKCBncm91cC52aXNpYmxlID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSgpO1xyXG5cclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuMTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblJlbGVhc2UoKXtcclxuICAgIGhpdHNjYW5Wb2x1bWUucG9zaXRpb24ueiA9IEJVVFRPTl9ERVBUSCAqIDAuNTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoKXtcclxuXHJcbiAgICBpZiggaW50ZXJhY3Rpb24uaG92ZXJpbmcoKSApe1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuSElHSExJR0hUX0VNSVNTSVZFX0NPTE9SICk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5CVVRUT05fQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBncm91cC5pbnRlcmFjdGlvbiA9IGludGVyYWN0aW9uO1xyXG4gIGdyb3VwLmhpdHNjYW4gPSBbIGhpdHNjYW5Wb2x1bWUsIHBhbmVsIF07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgY3JlYXRlVGV4dExhYmVsIGZyb20gJy4vdGV4dGxhYmVsJztcclxuaW1wb3J0IGNyZWF0ZUludGVyYWN0aW9uIGZyb20gJy4vaW50ZXJhY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBMYXlvdXQgZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5pbXBvcnQgKiBhcyBHcmFiIGZyb20gJy4vZ3JhYic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVDaGVja2JveCgge1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG9iamVjdCxcclxuICBwcm9wZXJ0eU5hbWUgPSAndW5kZWZpbmVkJyxcclxuICBpbml0aWFsVmFsdWUgPSBmYWxzZSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuICBjb25zdCBDSEVDS0JPWF9XSURUSCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgQ0hFQ0tCT1hfSEVJR0hUID0gQ0hFQ0tCT1hfV0lEVEg7XHJcbiAgY29uc3QgQ0hFQ0tCT1hfREVQVEggPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgSU5BQ1RJVkVfU0NBTEUgPSAwLjAwMTtcclxuICBjb25zdCBBQ1RJVkVfU0NBTEUgPSAwLjk7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgdmFsdWU6IGluaXRpYWxWYWx1ZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICBjb25zdCBwYW5lbCA9IExheW91dC5jcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKTtcclxuICBncm91cC5hZGQoIHBhbmVsICk7XHJcblxyXG4gIC8vICBiYXNlIGNoZWNrYm94XHJcbiAgY29uc3QgcmVjdCA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggQ0hFQ0tCT1hfV0lEVEgsIENIRUNLQk9YX0hFSUdIVCwgQ0hFQ0tCT1hfREVQVEggKTtcclxuICByZWN0LnRyYW5zbGF0ZSggQ0hFQ0tCT1hfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuXHJcblxyXG4gIC8vICBoaXRzY2FuIHZvbHVtZVxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIG91dGxpbmUgdm9sdW1lXHJcbiAgY29uc3Qgb3V0bGluZSA9IG5ldyBUSFJFRS5Cb3hIZWxwZXIoIGhpdHNjYW5Wb2x1bWUgKTtcclxuICBvdXRsaW5lLm1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLk9VVExJTkVfQ09MT1IgKTtcclxuXHJcbiAgLy8gIGNoZWNrYm94IHZvbHVtZVxyXG4gIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IENvbG9ycy5ERUZBVUxUX0NPTE9SLCBlbWlzc2l2ZTogQ29sb3JzLkVNSVNTSVZFX0NPTE9SIH0pO1xyXG4gIGNvbnN0IGZpbGxlZFZvbHVtZSA9IG5ldyBUSFJFRS5NZXNoKCByZWN0LmNsb25lKCksIG1hdGVyaWFsICk7XHJcbiAgZmlsbGVkVm9sdW1lLnNjYWxlLnNldCggQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUsQUNUSVZFX1NDQUxFICk7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGZpbGxlZFZvbHVtZSApO1xyXG5cclxuXHJcbiAgY29uc3QgZGVzY3JpcHRvckxhYmVsID0gdGV4dENyZWF0b3IuY3JlYXRlKCBwcm9wZXJ0eU5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTjtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGNvbnRyb2xsZXJJRCA9IExheW91dC5jcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgQ29sb3JzLkNPTlRST0xMRVJfSURfQ0hFQ0tCT1ggKTtcclxuICBjb250cm9sbGVySUQucG9zaXRpb24ueiA9IGRlcHRoO1xyXG5cclxuICBwYW5lbC5hZGQoIGRlc2NyaXB0b3JMYWJlbCwgaGl0c2NhblZvbHVtZSwgb3V0bGluZSwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIC8vIGdyb3VwLmFkZCggZmlsbGVkVm9sdW1lLCBvdXRsaW5lLCBoaXRzY2FuVm9sdW1lLCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBjcmVhdGVJbnRlcmFjdGlvbiggaGl0c2NhblZvbHVtZSApO1xyXG4gIGludGVyYWN0aW9uLmV2ZW50cy5vbiggJ29uUHJlc3NlZCcsIGhhbmRsZU9uUHJlc3MgKTtcclxuXHJcbiAgdXBkYXRlVmlldygpO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVPblByZXNzKCBwICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnZhbHVlID0gIXN0YXRlLnZhbHVlO1xyXG5cclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBzdGF0ZS52YWx1ZTtcclxuXHJcbiAgICBpZiggb25DaGFuZ2VkQ0IgKXtcclxuICAgICAgb25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcblxyXG4gICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmVtaXNzaXZlLnNldEhleCggQ29sb3JzLkVNSVNTSVZFX0NPTE9SICk7XHJcblxyXG4gICAgICBpZiggc3RhdGUudmFsdWUgKXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5ERUZBVUxUX0NPTE9SICk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZXtcclxuICAgICAgICBtYXRlcmlhbC5jb2xvci5zZXRIZXgoIENvbG9ycy5JTkFDVElWRV9DT0xPUiApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIHN0YXRlLnZhbHVlICl7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIEFDVElWRV9TQ0FMRSwgQUNUSVZFX1NDQUxFLCBBQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGZpbGxlZFZvbHVtZS5zY2FsZS5zZXQoIElOQUNUSVZFX1NDQUxFLCBJTkFDVElWRV9TQ0FMRSwgSU5BQ1RJVkVfU0NBTEUgKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLmludGVyYWN0aW9uID0gaW50ZXJhY3Rpb247XHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgaGl0c2NhblZvbHVtZSwgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgZ3JhYkludGVyYWN0aW9uID0gR3JhYi5jcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gKTtcclxuXHJcbiAgZ3JvdXAubGlzdGVuID0gZnVuY3Rpb24oKXtcclxuICAgIHN0YXRlLmxpc3RlbiA9IHRydWU7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc3RhdGUudmFsdWUgPSBvYmplY3RbIHByb3BlcnR5TmFtZSBdO1xyXG4gICAgfVxyXG4gICAgaW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIGdyYWJJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gICAgdXBkYXRlVmlldygpO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09MT1IgPSAweDJGQTFENjtcclxuZXhwb3J0IGNvbnN0IEhJR0hMSUdIVF9DT0xPUiA9IDB4MEZDM0ZGO1xyXG5leHBvcnQgY29uc3QgSU5URVJBQ1RJT05fQ09MT1IgPSAweDA3QUJGNztcclxuZXhwb3J0IGNvbnN0IEVNSVNTSVZFX0NPTE9SID0gMHgyMjIyMjI7XHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IE9VVExJTkVfQ09MT1IgPSAweDk5OTk5OTtcclxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQkFDSyA9IDB4MWExYTFhXHJcbmV4cG9ydCBjb25zdCBISUdITElHSFRfQkFDSyA9IDB4NDk0OTQ5O1xyXG5leHBvcnQgY29uc3QgSU5BQ1RJVkVfQ09MT1IgPSAweDE2MTgyOTtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfU0xJREVSID0gMHgyZmExZDY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0NIRUNLQk9YID0gMHg4MDY3ODc7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0JVVFRPTiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9URVhUID0gMHgxZWQzNmY7XHJcbmV4cG9ydCBjb25zdCBDT05UUk9MTEVSX0lEX0RST1BET1dOID0gMHhmZmYwMDA7XHJcbmV4cG9ydCBjb25zdCBEUk9QRE9XTl9CR19DT0xPUiA9IDB4ZmZmZmZmO1xyXG5leHBvcnQgY29uc3QgRFJPUERPV05fRkdfQ09MT1IgPSAweDAwMDAwMDtcclxuZXhwb3J0IGNvbnN0IEJVVFRPTl9DT0xPUiA9IDB4ZTYxZDVmO1xyXG5leHBvcnQgY29uc3QgU0xJREVSX0JHID0gMHg0NDQ0NDQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVHZW9tZXRyeSggZ2VvbWV0cnksIGNvbG9yICl7XHJcbiAgZ2VvbWV0cnkuZmFjZXMuZm9yRWFjaCggZnVuY3Rpb24oZmFjZSl7XHJcbiAgICBmYWNlLmNvbG9yLnNldEhleChjb2xvcik7XHJcbiAgfSk7XHJcbiAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XHJcbiAgcmV0dXJuIGdlb21ldHJ5O1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUNoZWNrYm94KCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IGZhbHNlLFxyXG4gIG9wdGlvbnMgPSBbXSxcclxuICB3aWR0aCA9IExheW91dC5QQU5FTF9XSURUSCxcclxuICBoZWlnaHQgPSBMYXlvdXQuUEFORUxfSEVJR0hULFxyXG4gIGRlcHRoID0gTGF5b3V0LlBBTkVMX0RFUFRIXHJcbn0gPSB7fSApe1xyXG5cclxuXHJcbiAgY29uc3Qgc3RhdGUgPSB7XHJcbiAgICBvcGVuOiBmYWxzZSxcclxuICAgIGxpc3RlbjogZmFsc2VcclxuICB9O1xyXG5cclxuICBjb25zdCBEUk9QRE9XTl9XSURUSCA9IHdpZHRoICogMC41IC0gTGF5b3V0LlBBTkVMX01BUkdJTjtcclxuICBjb25zdCBEUk9QRE9XTl9IRUlHSFQgPSBoZWlnaHQgLSBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG4gIGNvbnN0IERST1BET1dOX0RFUFRIID0gZGVwdGg7XHJcbiAgY29uc3QgRFJPUERPV05fT1BUSU9OX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU4gKiAxLjI7XHJcbiAgY29uc3QgRFJPUERPV05fTUFSR0lOID0gTGF5b3V0LlBBTkVMX01BUkdJTiAqIC0wLjQ7XHJcblxyXG4gIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIGdyb3VwLmFkZCggcGFuZWwgKTtcclxuXHJcbiAgZ3JvdXAuaGl0c2NhbiA9IFsgcGFuZWwgXTtcclxuXHJcbiAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbnMgPSBbXTtcclxuICBjb25zdCBvcHRpb25MYWJlbHMgPSBbXTtcclxuXHJcbiAgLy8gIGZpbmQgYWN0dWFsbHkgd2hpY2ggbGFiZWwgaXMgc2VsZWN0ZWRcclxuICBjb25zdCBpbml0aWFsTGFiZWwgPSBmaW5kTGFiZWxGcm9tUHJvcCgpO1xyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIGZpbmRMYWJlbEZyb21Qcm9wKCl7XHJcbiAgICBpZiggQXJyYXkuaXNBcnJheSggb3B0aW9ucyApICl7XHJcbiAgICAgIHJldHVybiBvcHRpb25zLmZpbmQoIGZ1bmN0aW9uKCBvcHRpb25OYW1lICl7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbk5hbWUgPT09IG9iamVjdFsgcHJvcGVydHlOYW1lIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob3B0aW9ucykuZmluZCggZnVuY3Rpb24oIG9wdGlvbk5hbWUgKXtcclxuICAgICAgICByZXR1cm4gb2JqZWN0W3Byb3BlcnR5TmFtZV0gPT09IG9wdGlvbnNbIG9wdGlvbk5hbWUgXTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVPcHRpb24oIGxhYmVsVGV4dCwgaXNPcHRpb24gKXtcclxuICAgIGNvbnN0IGxhYmVsID0gY3JlYXRlVGV4dExhYmVsKFxyXG4gICAgICB0ZXh0Q3JlYXRvciwgbGFiZWxUZXh0LFxyXG4gICAgICBEUk9QRE9XTl9XSURUSCwgZGVwdGgsXHJcbiAgICAgIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiwgQ29sb3JzLkRST1BET1dOX0JHX0NPTE9SLFxyXG4gICAgICAwLjg2NlxyXG4gICAgKTtcclxuICAgIGdyb3VwLmhpdHNjYW4ucHVzaCggbGFiZWwuYmFjayApO1xyXG4gICAgY29uc3QgbGFiZWxJbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBsYWJlbC5iYWNrICk7XHJcbiAgICBsYWJlbEludGVyYWN0aW9ucy5wdXNoKCBsYWJlbEludGVyYWN0aW9uICk7XHJcbiAgICBvcHRpb25MYWJlbHMucHVzaCggbGFiZWwgKTtcclxuXHJcblxyXG4gICAgaWYoIGlzT3B0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBzZWxlY3RlZExhYmVsLnNldFN0cmluZyggbGFiZWxUZXh0ICk7XHJcblxyXG4gICAgICAgIGxldCBwcm9wZXJ0eUNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgaWYoIHByb3BlcnR5Q2hhbmdlZCApe1xyXG4gICAgICAgICAgICBvYmplY3RbIHByb3BlcnR5TmFtZSBdID0gbGFiZWxUZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgcHJvcGVydHlDaGFuZ2VkID0gb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSAhPT0gb3B0aW9uc1sgbGFiZWxUZXh0IF07XHJcbiAgICAgICAgICBpZiggcHJvcGVydHlDaGFuZ2VkICl7XHJcbiAgICAgICAgICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSBvcHRpb25zWyBsYWJlbFRleHQgXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBjb2xsYXBzZU9wdGlvbnMoKTtcclxuICAgICAgICBzdGF0ZS5vcGVuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKCBvbkNoYW5nZWRDQiAmJiBwcm9wZXJ0eUNoYW5nZWQgKXtcclxuICAgICAgICAgIG9uQ2hhbmdlZENCKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgICAgICBpZiggc3RhdGUub3BlbiA9PT0gZmFsc2UgKXtcclxuICAgICAgICAgIG9wZW5PcHRpb25zKCk7XHJcbiAgICAgICAgICBzdGF0ZS5vcGVuID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIGNvbGxhcHNlT3B0aW9ucygpO1xyXG4gICAgICAgICAgc3RhdGUub3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcC5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGxhYmVsLmlzT3B0aW9uID0gaXNPcHRpb247XHJcbiAgICByZXR1cm4gbGFiZWw7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjb2xsYXBzZU9wdGlvbnMoKXtcclxuICAgIG9wdGlvbkxhYmVscy5mb3JFYWNoKCBmdW5jdGlvbiggbGFiZWwgKXtcclxuICAgICAgaWYoIGxhYmVsLmlzT3B0aW9uICl7XHJcbiAgICAgICAgbGFiZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9wZW5PcHRpb25zKCl7XHJcbiAgICBvcHRpb25MYWJlbHMuZm9yRWFjaCggZnVuY3Rpb24oIGxhYmVsICl7XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGxhYmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIGxhYmVsLmJhY2sudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gIGJhc2Ugb3B0aW9uXHJcbiAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IGNyZWF0ZU9wdGlvbiggaW5pdGlhbExhYmVsLCBmYWxzZSApO1xyXG4gIHNlbGVjdGVkTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9NQVJHSU4gKiAwLjUgKyB3aWR0aCAqIDAuNTtcclxuICBzZWxlY3RlZExhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gTGF5b3V0LmNyZWF0ZURvd25BcnJvdygpO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9GR19DT0xPUiApO1xyXG4gIGRvd25BcnJvdy5wb3NpdGlvbi5zZXQoIERST1BET1dOX1dJRFRIIC0gMC4wNCwgMCwgZGVwdGggKiAxLjAxICk7XHJcbiAgc2VsZWN0ZWRMYWJlbC5hZGQoIGRvd25BcnJvdyApO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gY29uZmlndXJlTGFiZWxQb3NpdGlvbiggbGFiZWwsIGluZGV4ICl7XHJcbiAgICBsYWJlbC5wb3NpdGlvbi55ID0gLURST1BET1dOX01BUkdJTiAtIChpbmRleCsxKSAqICggRFJPUERPV05fT1BUSU9OX0hFSUdIVCApO1xyXG4gICAgbGFiZWwucG9zaXRpb24ueiA9IGRlcHRoICogMjQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvcHRpb25Ub0xhYmVsKCBvcHRpb25OYW1lLCBpbmRleCApe1xyXG4gICAgY29uc3Qgb3B0aW9uTGFiZWwgPSBjcmVhdGVPcHRpb24oIG9wdGlvbk5hbWUsIHRydWUgKTtcclxuICAgIGNvbmZpZ3VyZUxhYmVsUG9zaXRpb24oIG9wdGlvbkxhYmVsLCBpbmRleCApO1xyXG4gICAgcmV0dXJuIG9wdGlvbkxhYmVsO1xyXG4gIH1cclxuXHJcbiAgaWYoIEFycmF5LmlzQXJyYXkoIG9wdGlvbnMgKSApe1xyXG4gICAgc2VsZWN0ZWRMYWJlbC5hZGQoIC4uLm9wdGlvbnMubWFwKCBvcHRpb25Ub0xhYmVsICkgKTtcclxuICB9XHJcbiAgZWxzZXtcclxuICAgIHNlbGVjdGVkTGFiZWwuYWRkKCAuLi5PYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoIG9wdGlvblRvTGFiZWwgKSApO1xyXG4gIH1cclxuXHJcblxyXG4gIGNvbGxhcHNlT3B0aW9ucygpO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHByb3BlcnR5TmFtZSApO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi54ID0gTGF5b3V0LlBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnkgPSAtMC4wMztcclxuXHJcbiAgY29uc3QgY29udHJvbGxlcklEID0gTGF5b3V0LmNyZWF0ZUNvbnRyb2xsZXJJREJveCggaGVpZ2h0LCBDb2xvcnMuQ09OVFJPTExFUl9JRF9EUk9QRE9XTiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBjb250cm9sbGVySUQsIHNlbGVjdGVkTGFiZWwgKTtcclxuXHJcblxyXG4gIHVwZGF0ZVZpZXcoKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmlldygpe1xyXG5cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBpbnRlcmFjdGlvbiwgaW5kZXggKXtcclxuICAgICAgY29uc3QgbGFiZWwgPSBvcHRpb25MYWJlbHNbIGluZGV4IF07XHJcbiAgICAgIGlmKCBsYWJlbC5pc09wdGlvbiApe1xyXG4gICAgICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgICAgICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWwuYmFjay5nZW9tZXRyeSwgQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIGxhYmVsLmJhY2suZ2VvbWV0cnksIENvbG9ycy5EUk9QRE9XTl9CR19DT0xPUiApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgb25DaGFuZ2VkQ0I7XHJcbiAgbGV0IG9uRmluaXNoQ2hhbmdlQ0I7XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBvbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdyYWJJbnRlcmFjdGlvbiA9IEdyYWIuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLmxpc3RlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgICBzdGF0ZS5saXN0ZW4gPSB0cnVlO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgc2VsZWN0ZWRMYWJlbC5zZXRTdHJpbmcoIGZpbmRMYWJlbEZyb21Qcm9wKCkgKTtcclxuICAgIH1cclxuICAgIGxhYmVsSW50ZXJhY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBsYWJlbEludGVyYWN0aW9uICl7XHJcbiAgICAgIGxhYmVsSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIH0pO1xyXG4gICAgZ3JhYkludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICB1cGRhdGVWaWV3KCk7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubmFtZSA9IGZ1bmN0aW9uKCBzdHIgKXtcclxuICAgIGRlc2NyaXB0b3JMYWJlbC51cGRhdGUoIHN0ciApO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG5cclxuICByZXR1cm4gZ3JvdXA7XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0IGNyZWF0ZVRleHRMYWJlbCBmcm9tICcuL3RleHRsYWJlbCc7XHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuaW1wb3J0ICogYXMgTGF5b3V0IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgR3JhYiBmcm9tICcuL2dyYWInO1xyXG5pbXBvcnQgKiBhcyBQYWxldHRlIGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVGb2xkZXIoe1xyXG4gIHRleHRDcmVhdG9yLFxyXG4gIG5hbWVcclxufSA9IHt9ICl7XHJcblxyXG4gIGNvbnN0IHdpZHRoID0gTGF5b3V0LkZPTERFUl9XSURUSDtcclxuICBjb25zdCBkZXB0aCA9IExheW91dC5QQU5FTF9ERVBUSDtcclxuXHJcbiAgY29uc3Qgc3BhY2luZ1BlckNvbnRyb2xsZXIgPSBMYXlvdXQuUEFORUxfSEVJR0hUICsgTGF5b3V0LlBBTkVMX1NQQUNJTkc7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgIHByZXZpb3VzUGFyZW50OiB1bmRlZmluZWRcclxuICB9O1xyXG5cclxuICBjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gIGNvbnN0IGNvbGxhcHNlR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBncm91cC5hZGQoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgLy8gIFllYWguIEdyb3NzLlxyXG4gIGNvbnN0IGFkZE9yaWdpbmFsID0gVEhSRUUuR3JvdXAucHJvdG90eXBlLmFkZDtcclxuXHJcbiAgZnVuY3Rpb24gYWRkSW1wbCggbyApe1xyXG4gICAgYWRkT3JpZ2luYWwuY2FsbCggZ3JvdXAsIG8gKTtcclxuICB9XHJcblxyXG4gIGFkZEltcGwoIGNvbGxhcHNlR3JvdXAgKTtcclxuXHJcbiAgY29uc3QgcGFuZWwgPSBMYXlvdXQuY3JlYXRlUGFuZWwoIHdpZHRoLCBMYXlvdXQuRk9MREVSX0hFSUdIVCwgZGVwdGggKTtcclxuICBhZGRJbXBsKCBwYW5lbCApO1xyXG5cclxuICBjb25zdCBkZXNjcmlwdG9yTGFiZWwgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIG5hbWUgKTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9MQUJFTF9URVhUX01BUkdJTiAqIDEuNTtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG4gIGRlc2NyaXB0b3JMYWJlbC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcbiAgcGFuZWwuYWRkKCBkZXNjcmlwdG9yTGFiZWwgKTtcclxuXHJcbiAgY29uc3QgZG93bkFycm93ID0gTGF5b3V0LmNyZWF0ZURvd25BcnJvdygpO1xyXG4gIENvbG9ycy5jb2xvcml6ZUdlb21ldHJ5KCBkb3duQXJyb3cuZ2VvbWV0cnksIDB4ZmZmZmZmICk7XHJcbiAgZG93bkFycm93LnBvc2l0aW9uLnNldCggMC4wNSwgMCwgZGVwdGggICogMS4wMSApO1xyXG4gIHBhbmVsLmFkZCggZG93bkFycm93ICk7XHJcblxyXG4gIGdyb3VwLmFkZCA9IGZ1bmN0aW9uKCAuLi5hcmdzICl7XHJcbiAgICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uKCBvYmogKXtcclxuICAgICAgY29uc3QgY29udGFpbmVyID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgIGNvbnRhaW5lci5hZGQoIG9iaiApO1xyXG4gICAgICBjb2xsYXBzZUdyb3VwLmFkZCggY29udGFpbmVyICk7XHJcbiAgICAgIG9iai5mb2xkZXIgPSBncm91cDtcclxuICAgIH0pO1xyXG5cclxuICAgIHBlcmZvcm1MYXlvdXQoKTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBwZXJmb3JtTGF5b3V0KCl7XHJcbiAgICBjb2xsYXBzZUdyb3VwLmNoaWxkcmVuLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCwgaW5kZXggKXtcclxuICAgICAgY2hpbGQucG9zaXRpb24ueSA9IC0oaW5kZXgrMSkgKiBzcGFjaW5nUGVyQ29udHJvbGxlciA7XHJcbiAgICAgIGNoaWxkLnBvc2l0aW9uLnggPSAwLjAyNjtcclxuICAgICAgaWYoIHN0YXRlLmNvbGxhcHNlZCApe1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGNoaWxkLmNoaWxkcmVuWzBdLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiggc3RhdGUuY29sbGFwc2VkICl7XHJcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gTWF0aC5QSSAqIDAuNTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGRvd25BcnJvdy5yb3RhdGlvbi56ID0gMDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IGludGVyYWN0aW9uID0gY3JlYXRlSW50ZXJhY3Rpb24oIHBhbmVsICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgZnVuY3Rpb24oIHAgKXtcclxuICAgIHN0YXRlLmNvbGxhcHNlZCA9ICFzdGF0ZS5jb2xsYXBzZWQ7XHJcbiAgICBwZXJmb3JtTGF5b3V0KCk7XHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIGdyb3VwLmZvbGRlciA9IGdyb3VwO1xyXG5cclxuICAvLyBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICAvLyBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLm5hbWUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICBkZXNjcmlwdG9yTGFiZWwudXBkYXRlKCBzdHIgKTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5oaXRzY2FuID0gWyBwYW5lbCBdO1xyXG5cclxuICBncm91cC5iZWluZ01vdmVkID0gZmFsc2U7XHJcblxyXG4gIHJldHVybiBncm91cDtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaW1hZ2UoKXtcclxuICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gIGltYWdlLnNyYyA9IGBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQWdBQUFBSUFDQVlBQUFEMGVOVDZBQUNBQUVsRVFWUjQydXk5aDNJY3laSWxldmZaMnU2TzJObDNaNjRXZlZzcnRpU2JiS3FtMWdLQ0JLRUpSV2l0TldBQUNvcGc3OHo3NDNpRk8rNVRwMDU1UkdaV1pWYUJUZEFzckFXQmlNeklDSThUN3NlUC84bzU5M20rZlpOdlArVGI1WHk3a1cvMzh1MXh2alhrVzFPK3RlVmJaNzUxUyt2S3Q0NThhODYzUnZuWjQzKzJ5UDgvL3BrZWFjYy8yNTV2TCtCbjc4azRsMlhjNC9HZjV0c3o2YU5kK2dtMVZ1bnorQm5yOHUxNXpOOXRsOTg5ZnE5NmVPL3IrWFluM3g3S3N6VEt6N1RJKzJ1L25kQ3d2Mlo1aHVNK24rVGIvWHk3blc4LzVkdkZmUHRydnYwdDN6N0l0OC9rbmMvbjI5Vjh1NVZ2RDJBT1hraWZWc054SHNveng1azduSzlIOG52WDh1M0hmUHN1Mzc3SXR3L3o3Uy81OXNkOCsyMisvVnFlL1hodTdzcnY2WnBvbGJGd1B0cmsrWjdCSEh5WmI5L0xPTmE3TmtzL0wyWGQ5RW5ybGJYVEp1UFZ5Zk8zdzgrOWtuOTJ5Kyszd1RwN0t1UGNrbkV2eUh0K0NuTi9KWVc1dnlaejlMMjg2OGZ5clgrWGIvOG4zLzdoVi9rLytYLytqM3o3My9uMmIvbjJwNHpXd1Uvd1BmOGl6M0ltMzg3bTJ5WDVqdmZrMitoNjZaUjkycDl2Zy9rMkpHMEE1bGIzcjQ2bDYvcDRUcjhWRy9KQmh2UDVmcjY5SisvMHR3em5ycEpucnZRNXFyb204KzIvVlhsTlp2bHVIOGk2K0t1c2xlUC8vaWlqZCtFeFBzcHd6ajQwK3I0TmRwaHRKemEwaDlyM0xma0d4MmZlMTc4U3cvUjF2cDBqQTZFSGVyTWNIbW9nMkRoMHlzL1V5ejg3NWY4Zkc1SmhhUVB5KzUxaWNCZ0VYSkx4bjh1RXZCVGoveXJRK3FSUEJTRUtVcnJnWUFqOUxocTFTM1RBMWNNQjF5Rjk5a0MvL2REd1dWNUtueTN5MGV2SVdINHNIL1A0b1AwS2pQSU5PU2lmMGh3Z2lPcnhBS3A2V1doUmM4Znp4UXZpbkR6VHA3S2czeGRqK3dmUG91dUFReGpub2xlZW9SVkF3TGVlamNIUHJPdHJKTjlHWmUzMHl6aHQwbCtidk1lQS9NeVkvSE5JZmxiWFdhdjBqeURnaWp5SEFwS0xzTjdMblh2OXZsZWxiendNanczcWI4VEEvdmQ4KzBjQlZIK1F3K3lURE5ZQmZzLzNEZU54Ujc2amd2V1g4dDJHWkM0bjgyMUsvamtoYzZ2N1Y4ZXFrN0Z1Q25EV3RmTnhSdlA1cGN6cEo3STJQODFvRDkycThKa3JmWTVxcjhuL21XLy9YTVUxZVRIRDlmR0ZySFcwc1djeWVoY2U0MHlHYy9hNW5NOW5aZjYwYjcwTWRZanRISUN6ZVlqc1lidWNaMDlsN3EvckpVRUJnSForRFE3QlJyZ2Q2SUdPQm1KQ0RIU3ZEUEJNL3Rrcmd4Ly8vYlQ4N0pqOHZ6NERCTndGUk5jaWs5RXZmWThGMnFnOFV5L2NicnRsSWtaaS9LNGF0VGJqZHNzSDNJQThqeDQ0NDlEd0FCcUFBeEJ2cmJwb3o0Z3gvbDdtL0VjQkJuZGtMcDdKZTNTQlVSNDJHaHBrUGVTaTVvN25xMGtPNTd0d2svdE9udStNTFBDUEJGWDdGdDJnOUl0ek1TelAvaEsrOHpud0xQSEcwSGZWWno1ZUx6UDVOaXZyWjFUZVNZSG1TL252TWZtNU9mbm5KS3l6VjlJdmdnQUVtMThKQXI0Q3dLYXhqTG5YNzN1ZmdPeFhZa2ovSm9iMTJNRCtyM3o3Ri9HcS9FWG05Z3VaOHpUWGdlNm5DM0o3VUxCenlmaU9uVEQza3pMbkMvbTJsRytMK1RZdjMyQk12clh1bCtmRzJ2bEcxa3dXOC9tOUdQcXZZQTk5bDhFZXVsdmhNMWY2SE5WY2svOG02L0ZmOCszM1ZWcVRXYjNiV1ZrajM4aDdmaXYvZlU1YTJ1OWlqWEV1b3puVHkvbEY2ZnVXekI5ZWhvYkUvazVSRzVPK3UrVTVHdVFzdWluZjRvSUNnQXZTT2QveTlQQWZsZ045Qmd6RW5BdzZJRWI1QlJublkyT3lMSVprRmdBRGVnMGE2SWJjTG44L0lpOHdGMmd6TUg0WEdMTlJNVnBSdnpzbXovclNjN3Z0aFZ1bWdwbForZjE1YU5yZmxEd1AzMXFiNE1aMFZ1YjZvaHlJNkE2cmh3UHVsY3pCcEl5TERUOXNseHl5RFRIbWp1ZXJSY2E4THdEb3NqelhlWG5PYitUdytBVG14MXAwTXpBbnMvTE1DZ0k2WlYzOENPQ1NOMFkvdk91c3JKZmpkYk1xYTIxU3h0SkZyR05QeWMrdXljOHZ3UGdqMHErQ0FBV2I2bHI3UnI2RFB0TlRPaENqNW42UXZCS1BLWnlpcnNtUHhMQWVIL3IvSk1iMmozUXoveUhsZGZCQWpPTkZ1YWxZWUllLzQ2Ujh2K041WE0rM1RXbHJNc2U0WDNEdDRGZ2FRa3A3UHErSW9mOVIzdU9zck5Fczl0Q0RDcCs1MHVlbzFwcDhUOWJoYitTZmZ5VlhjMVpyOGxwRzYwTnQxd1U1TEMvSW10SDFrZmE3K01iSVlzN1VNMzlOOXU4REFkOU5NSDk2M2k1QjAzMDdLdWRDTzh6ZFBRVUJDZ0F1eS85NFlOenk5RFkvSngycmdWZzBqSE0zR0pUanY5K1F0aXkvUHlGL3I3ZFFkaWQyaXBFWkY0TzBLa2JJYWtzeWdjUGdSaG1RTVJZQ3Y2ZEdiUXFlM2ZmZTR6TEd2SXlIejdNTy83NENvR2dLUEF6ZGRHTzZKQWZRRFZrb3Q4a2RoaDZVU1htUFpXcUw4a3dqOHJOdGNzQkZ6UjNQVnlzc3REdnlQTmZGdFhaSmpPejNjb0R3cHUyblJhZnpzU0pqODdyQTlWVlBOM2tGTEF2eSs4ZnJaVHZmdHVSOThWMDdaREdQeXVJKy92a2QrZmwxK2ZsNTZXOEVRRWd6SFZqZmlsRzhMZ0NvSGp3b2d4RnpQd05laVpkR09FVmRrM29qZmwrTTdMOUkvUFd2Z2JoOEd1dEFuK095dU1xL2x1ZjVDYjVqay9FZGwyWE9kL010Qi85Y2g3R0dhYXhITU5aWk9XRFNuTS9iMG00U0dMaWEwUjU2V09FelYvb2MxVmlUWHdDbjRrL2lFZmlZWE0xWnJjbnJHYTJQVzdJZWZwSzFlSTNXUjlwcnhEZkc3UXptVEQzenlrMnJCNjRiMi94MTJjTmJZcFBuWkgrL2d2TzJFYmhaTnhVQUtESjdJcDNyN1dCUU9sY0RzU2xHQVkzek1MZ3Y5QVk2STMrL0xZWmtVLzU3VnZyenVST3RGOW8xMm80eFBpNm1SUm5UK3QwdE9iUVFBRHoyM0c3eGdOdVVjZFU0N29PUjNKRy9YNFVQT21xZ3VodnlJUitJOFh3TVhBc01ZZWpZS3pLSE8zRFFyY3JmTWJJTHpaMDFYNjJ3R0I3TDRyb3Z6M2REak1hUFloQkNtM1lkNWtUWHhZeXNBMzIrbjJoOTZjWVloc04vVmQ1dkw5OE9wRTkrMXc1QXZIUHlYWGJsNTNWODloejBFdnE5SFFBQTNlQmRXSUp2cm0xZCtwNkN3N0NENG12cW1qd3JoN3g2QVg1TnQvOXZ3Zk4yaDl5aWxhd0RQSlEvbzNlOUowQzMyZk1kZCtIbXZ3Ymo0VmhxVEo3RGZDcm40RXpLOC9sWTN1ZUJySitiUU5TOW44RWVlbFRoTTFmNkRiTmVreitJcCthTWdNUDM1WjluWkoyZ3F6bUxOWGt6Zy9XQmErU09qSEhYc0xGcHJwSFFHR21PY3hjODgzcjRLd202QzhMVGFQUDFYRUlBMEU4Y1BPVm0zVk1BY0VzR2FLQllzc1pabCtSbXRpc0dlak1tQU5pVW45K1QzMS95dUJNMUZHQWRZc2N2OUxQOFUxdGNBSUMvOHpyZkRqMEFvTjZJTDgvQ2UrZmtrRG1TZng1SW53ZlM1MnQ0cmpWQ2RYMndhSlZjV1M4ZjRibTBGMFlJUThmZWt6RzBiOXdRUFFFUGdNN2RVUUFBS0hueXVmUlJKODkzWDliRU5URWNvVTI3QlhPVDh5em9HOUJITTNocnhtV1I2dUd2ODdvRlhvc1o4Z0RvSE0yQ3kzb2J2c3VXYkxSWldHY2FpbENER0RvVUI4RGpwYmZpZmZrR3VtRXgvTlZ0aEJud3h2V3B1RnlQWTY1L0ZrRHdKZHkwMERPU3hqclFHTjhsQXdCRUdkK2M5RDFQSU5xNlRmZ0FRRnJ6cVh2am1kaUhKekpQOThRNDFzbjdwcm1ISGxiNHpKVit3eXpYNUhXTis0cG43d3djL3QvTC85ZE1xTnNacmNuNzhoM3JVMXdmdWticXdYWTlNV3hzV21za2FvdzB4c0UxejU3NWRpQkJqOGpjVFFVQXdCUnhvNUNnL1ZnQndEMXdEWFpBM0g5YURNRzZjZmlyUzMvUUNBSGdCMVVRWUxrVCt3alJSUjFpNjlCQ0FHQ0JmbllURG1zTEFEVEM3WDhZNHN2NjNuakFhM3hVKzkyQ244RVBPeS96Z0Y2QUo1RDIxa1lwZWh5UFhaTTVPd1REdkVqRXVKZUE2SklDZ0M3Z1RtQ0s0RFA1RnBoeXc0ZDNYQStBdXJSdVNuL1dQQzhCV01OTlB3KzhCWXdCOXNBYW00Rnd6NDU4Z3oyNE9XQW9BbU5yN0JaL1lxejlDWG1HRlFBNXV2Nlh3RFdKWEljNjRGUm9LdDduY3RQNkxiai9OUzZ2MlJXUGdVUmI3anBvQms2SHh1WGpBQUQybUszTCsrbDc1eElDQUwwQnZhaHdQakZsdDBYR3E2UCswOXhEMm44bHoxenBOOHhxVFQ2Q3VPOVY0QVNjb2ZUY20wQ0dyc3RnVFZxcHlwV3VqdzVLUFk1S2h5NzNYWktNVWNrNHZPWjludmt4SXp6TkFBQTVlSk5FMFA3N3QxRUE4SkRjRm9Qd1FWYkZ1T0x0YW81SWZSMkFldkNEem9IYjR3RGNpZk1HZUloN2k1MEh3aG4yMFVsZWkzbTZ5WVFBd0hQamRxbnZmUWp2dmdvRWl3VWdyRzBRVU5pa21Ic3ZJRHRmcXA0Vmp6MHdnSk9HRmpqbExna0FHSkI1RzVEZndUUkcxRWRRRU9DTEhjOEFFVzhOT0FEOGJmV1FlMDV4Zkp4blByeW5qTXdGWEdORGhLNFJSSENJaW1Oclp5QXpBYjFmVEh5ZHBQQUVibDRFR0JoU3dSdjQ5eEp6L1VEaS8rOEY0dkkrRW0zVU91aEdSQTlFeC9PdW9IZWc1TEo3Tk5ZQTdQTTFDSEZ0UVRobTB4UFdVVGNsQXdETUh1cUI5WjFrUGpsOUZiVWdmUDJYdTRlNC8wcldRS1hmTUlzMXlYSGZXd1FDVUp0RGI3WU5ycEMzbnVhYURLVXFsN3MrMkE1R3BVT1hzMGFTamxISk9Md20yVE0vWU5oZURFOGZ3ampid01HYkJ4RHdYNkVVQlFDTU5rZkI5YStHbFQvRXNKSFcxK0packlwKzlnMUVoMTZBdUlmWU9LVVdkaEE2MHRTMHlaZ0FnQTgyakMramExdlRvaVloSFhLVzV1a29FRGRGVnFpVnFvZmt5WnkwRFdKaVl4dUdVRXFTdVp1QVBPOXhTR044NWZ5aUw0OGhmcDgwMitBT29GaGZIUDhOekRQR3JycGRzZUFVR24rTWYrSDMyb21JcldHcUUyWW5jRzQ4RWhUNWdGenhzR3d0WXR5SEJBRDRVTGJpOGxIcmdFbW1UeWs5NnF4a2NDall1R3A4Qi8yTzAyQk10b25YZ3FCdXlKTlNkQWxZNWhaSXd6VWJOWis4eGtmb1VJbnFQK2tlR2pIYzV1V3VnVXEvNFFWbmk4aVU4enl2S083TG1oaFhJOGJyQUlCVnlackU4ZUtrS3NkNU44c09ZdXB4MUJoSjEwalNNY2JnL0lzYVp6UmlUVDR4N0M1NjVuY2d4SDBBSWU5RGFidDBjUyt5elFvQTZnbGhUSkRiNG9EY3U2TkdycmRsUUVlQkQ0QUlhSTF1aWwwQlZxUHZGdHN2U0VZWGVKTXJLTVM5TXZnQWNRRUFqcjFITjBxOUJRMjZnbUxhT0J4a09aaDB5MjNhQnVTM1NVZ3IxRFlMWHBkVjhEak1Hajg3QjJ6M3ZwaHp4NTZSQlhDMVQ3cFMwUmROWWJ4RHFTZEpzdzBzRHdLVEZVTWNnaVk1Y05pOWpDa3dxL0w3YndMOTZBR3RZaWVvVDREcWVKaWlPQW9ianI4TGh6cENBRUFKZ0orRFd4NEJnSFVydDlZQjV1UzNVNW9wTXI2L0ZiNkJ6OXVCKzEzZmNRRlNNRmNoczRVQnY3cVdVVlJFeFdZNEZEanJTY1cxNXRQNnVXbHkvY2JwZno1bTMxYi8xaHJBRzFkb0RWVDZEYTlBckp4RlpQcmdjak1Sc1NZbkNOU3pKZ1lLelNRWnovYytjY2VMYzNrWWkzZzN5MmJpelRiT0dCTVI3MUxwR0dxYm85YUFiLzNpbXF5RGl5TmZlSGJveHI4SlRUMTRSeFJLd1l5RGRnVUF6K2h3UXJmcUFjUUdMZmN1NWhaaWpuYzNwVCtzQTJON3kzQ1J0NWNSeDI2SG15R3E5M1dsQUFENFJya0NDMkZjSm5HSVhObGJFV2tZZkdpdDBPRzVBZ3RPMnd5QUtQeFo5VWlNQTlFdGF1NldJV1Z2RTFJWlYrUWJ6YmhTMFpkbk1RL3dVTFpCMU85YlFNVTZXTzlDSG51N0VVcUlDd0ErZ0lQNFBLVXBObEFvYk5KSUsvV0ZzVEIvOXhJQUFNMEUrQWpTL3lvWms3VWNVRXNEYzc3MVBkbmJnVEhGY3Nac0JQZS9BbzZ2eGJ0aGtZSFhLbWdMTkg3Vy9mdUlrb3VCM3gwRW5rbmMzOUh4TUszdE9nRFI1d1JDTEMyV1ZRRGcrdS9Mc0pjdFRRd1V4cXIyZUZHWGgwVUkvVTNIdElOSStIMlZZSXdwby8veGxNYkFmZU1iWnl5d2ZuR05OTkI1YXZHbWR1RHl0U2h0Qlg3bU5YbFgvK3ZNVUFCZ2lRcGdiSGJIY0M5WnFTYjNYYW5JQS9lSExscDA5YjRzazhuZUNHbHNQbGRxRWc3QUdERFRjekwyTHNSU0ZseXArTTgwYkpLUUVFT0haMDUyWVl4RnVJMlBFaURKd2MrdUpRUUFhMERxd3V5SVhVR0xsdWlMa2tXU0h1RDhqZTVYK1B1WUYxc3BBSGdzdWM5WUQwRGQ0MWFZQXoxWXU1QXFad0ZZVERYa2cvRmRHZFAzWFhiTGFLZzNNa2dBSUt2K296SmVRcjlienU4MGd6ZUZaWnBSS0V1WjNzdVE3NDFweVJxMjJYSzJKZ1lleWhpYnIrWjRvY3NEMitWaHNJR2pnZS9ORjYyNFkzRC9JeFdNc1VaMm5MM2xQSTUxTWQ2RmkvWUNyQkVtVGsrN1FvcjlJZkNtRmlFOFBVWDhQZVdtY2Q5ZENnQTRKWU52N0p2MGNkQXdQd0xYSXl1TnNVY0IyWjE0MkEwUmthK2N3K0ZlQlFBQVpZeEhZSklSUWUzQ1lrZUc1VHlBZ1NncHhwQ1h4UW8xREJscGpSWWdpeE1DMklFWTBTNmtNUjRaNUpRcE12aVZBZ0FzK2xOTEFLQ0VxQStCQjNBUkdQTHNpdWZ3emxFQXdQcGM0NW9KOEs2TUdmb3VyeUZkTTA1TEFnRFM2ajhLQUJ3R2ZyZWMzMEVBWU1rMFk4eC9GYkkxRGlEekNOT1JMVTBNRk1aaWRuNDF4L1B0ZmNzdTk3cENVVERmOTQ0TEFIeGo5SlU1QnNmam1RT1dNektSZEl4KzhnQnZFOUY4bVM1aFBsdTNBNWRUZkw1Qkk4UHF3SE9PZHlzQVlJblZrUHQvQUQ0cXBqMXBvWUlITGl3YXd4OERqWDJ0QUlDVkFURUhLU243c2hnT2dCQzU3UXFpS1FvR09PK1NpekZZUEF1T2dhK0JtNFp2Wm9kRXBFUkFGcVdoc0VjQVpoMXVKNGZnU21JMzBjc1VBQURHRm5zeUJnQkhCcGtRQ1ZHdGtJcDN6aFhrTzFIMGhPV0dOMkV1Znc2a0dpSTVUbmtBeW81L1Y4WnNqekNtbXduYVJrSUFrRWIvdFFRQWxpRFpKTnptdHVFU3NBYzM4RTI0b2UrQ25kaDJ4Y0pZbGhlbm11TWxPWnlWak55ZUlRQW9kd3kwNDZobHNnT2d5T0xNc2ZpWlpmczVreU11QUppSGxHa21iWHBGOEJRQVdLN0FIU04yZ0pPc3hXUTB4ZU9DODh1Tmpodk0rbkp1c1ZrQkFNNkFRSmJsTnR5V2RTRWR3YUpITUxCS2JuU09wVGNaNllZcjVLWkJvMlNGSTVoRU9SQVJQdmtaUU1NS0VQOFd3TDJuZmU5N1BET1ZBZ0NPTFk2U3A4bVh2dGRqSERhb0o4QWVHd3NWYzViRDhWeWhFdDgxSSs4YUNhd3I1RzZ6aUtHWXpmS2M5Z1hLQXI4TFk4WXhwb3NKMml5RnBMTHV2NVlBd0NlM2pRSTVyNEZOam1uSm1Bdk82Y3NyeG5zMjEyQzhwSWR6U3hVQVFEbGpXR3FtZU5pK01kejVRelRIbU9xNDd3RU1uV1RyaHNuVzRabkJCTkFvRGtRUkFBakZ2Nk5TcXJDKzhKVVlPZDg1NDdZN2xvRElsZ1VBYUhHbCtnZkk2dDhENUxzTmNYUUdBenZnUnJkaTZZMkV0cWNDT2V3ejVEbFJnN3p0TWNoUmM3Y0t1YURqUVBDeGhIaFlnNzlTQU5CQnJGbGx2bUoyaU9YWjBHK0Q1RG9remZWNFFrellGMVlMMUJzSkt2RlpYaXZMUTZOemc4QjR6ZU1aWTBHZTc5K2hNZU1hMDhtWWJReHVRKzFWNkwrV0FLREJsWW8wNFUzeERYQ0ZsRTArUmFTMlJiQmRyeW5jaWg3RHRocU05MHNCQUQ3bDJKQkxmOVFBQzN1ZVBjYkU0dGJBbWZFYVFnN0xSa2c2V0FoUEFZQ1BBZi9hTU9vc3FuSVRHTStYWTk3U1VQUWxLWk05Q3dEUWFwQXMrREJSTjcreU5qZUlWS2RBd0JkTGJ6TlNPaGhzTUREeUhXeUx4dk1uVGFGa3NPTkx4WHVWQWdDd1VxUFdJTDRZZGRCZ3ZObXFTNENIV0k1dUxXdVVBOXN2aERXZkVwK1BvN0VQcnVOOUE3Q3dsQ2VLNVB6d0RvMlp4SmdPeG1nYVJsTWhxS3o3cnlVQThIR1J0b3hEUmV1cURBTnBic3lJU2IrbUxDWWtjVmQ3dkY4S0FQQXBkMXJnQ2IwQVZyaGczMGpSUTIwY0t3MFErOEI4Znlza2pibzVZNVRxM2VZREFMNUpzeXJKSWZxLzZMbWxXUnRpMytBVzFBb0ErRUlnSEdQUld2VnpCQVkyd1Z0d1NGNlRNY294WnMvSURMRTZrYTNKOFo0Y3hYdXdGSFBTdVh1VllNRlhDZ0NzNzVFRHJ3WUtaRXhIdUpyeFdkaU5qYlViMUhPVE00Q21wc1ZkRDdoZTV6eHp6K0RZK3M2YUhhTTF2WDk4aDhaTTY0QldkYlJ1SUhBMlZLSC9XZ0lBenNheXNwSFdYWEhGelY0WnN5ZEE2TnoxMkkxcWovZExBUUJZSjBHOUFKYm1EUU1vQkV0N3RMZEtSSHBjUWNIeHVRSGFGeUg3QU1uY210VzFBYW1CcUJremdHdGVBY0JMd3gyNDcyTU91dEphOGlvRUVxZm9DSlBaY0VQVUdnQ0VDR1ZxL0VaY1FXVlFoWFdXaU5EaEkwNCs5T1IxcWt0b254WU51Mlo5MWZhZWx6RjNWbG5kb3lvQ2dBUGdIYURpM0NTNURaOVJ6cmwxazBYeTBncDRGbzRJYUNvQXNJUnhmTm9WSEF0SHNJWUluL1BCRlNDcmgreGRHVE10Ri8yRXN5dHFadDEvTFFIQUM0OHQzZzJrWTNmU0lUYml1VlJZWTFkN3ZGOEtBTGdUUWFCY00wRFVnbkg3MzZPTGoxWHg4Q0Y1UEZtY2pOTzdYeE0vYlJPSW1TZ3c5SGZ2cWdJQW40R09zMmpMQlFBSEp3Z0FSQkhLOUFQT1FOeHd4QldxTWZFRzhNMGJxNzcxZXhCMERnZzM2SnExQ0hycWpVazZkejBHcWFSYUFBRERKMHlDaWJwbHNwNDl4K0MyQUVqbElQTUJBWURxOE4rSjhNcHNVYTd0QXJIbEQ0aTR5RnI1WEIzd1hSZ3pMWkxlZ21lc3JQdXZKUUR3MlM3OEJwWTN0dEhaWWpGYmhoMUh1MWZ0OFg0cEFPQ0dKNFVTOXhUenFsWThmQ3NtVExMQVY1M1l3RGJJb2tMMXpubnlSR05teG12SXpsaXpzak1zQUxCUUpRL0FTUUlBSVVMWkFVd2d4MVkwcmhOM3M5K2gyNnNsd25JQWhuakZJR054aXA2V3VTM0hBeEFLZWFRSkFQaWdYalF5RUt4YlpwZEJObnZnSVM4eHNZYlZzZkFXYzlHVmxpaU80bVdvbXk3RTJlRHZnaUQ1WFJrenJUUTlYd1hDclBzL2lRRGdJR0xNK2pMdFhyWEgrNlVBQU5TODhSWFJRMkxrTHFSZjgvK3pVaVkxN0hrWHZBemQ4bDdLdnhpbUN5aFhCZHdDVzNqZ0FSdWRTVGtBSVFEd25jRUJpQW9Cc0RKUkxiTUFRb1F5dkUxcU9neUNnWG5ucjJxSHNwOVIwcS9xaWxYMHJYSFlPRGV3Y2pnQUhQZDc0K3p5cjVVQ0FDVExqQUdYZ29VcStOc3czK1FtdWJJdDR1YWg0VnFiZ3Bod04yU3JQQ0kzbmxXaW1PZmUwbVd3V00rc1gvQ3VqSm1HVU05dW1RQWdqZjVyQ1FCYUFyZHFVOGtOZnIrUzdLZHFqZmRMQVFBWGlWZlQ1RXFMYTFtM2ZXdXZXZW1TOVdEdm1vbG5NQ1g5WXh1SGkraXNmTE1WU0VzOGNoNU5qN1JJZ0ZvTjdGSUNJNzEvZ3JJQUxFSVpWbkU2QUpiL0hvR0JOWWpEN0h0SWdQcHUxeEtTc1hUQjdCbWJrV093U2JNQUxPYXFMKzJ6VWdDZ3hYdDZZR3pXQVhqdHloTUNpdVBGWUZHbWE4WTcrV1N3MlRPUkpEV3pDWkQ4dXpKbXlKanE0UnVubFFNQTB1ai9KQUtBa0wxc3lnQUFaRFhlTHdVQWFNcTdyN2pXdUNmZWo5NDBQb3lSODRRbGxDM0JybVZvUzVSbXFCVXhaNDFRUkluNFhwSTB3RGlWenk2WFlhUlBBZ0JnTjg0WTViZ2l5ZUlRR0pkS3ROaUYvOTV4eFlJTDZOcmhHNW1Wam9WaEFLeUo3Wk5rMWZoNDFOeXRBQnRVZFFCbVBheFZWbWlzRkFBMFFBclhTMWQ5S1dBbHZiVEpjOXcwdkZTRHJsUUdteG53bUZ1NzZtRTlXOFY2SHJ4RFk4WXhwbkVhRjJDSkd3S290UCtURGdDc1lrSlpBb0EweC91bEFJRHZ3UXVndGpFa0RyUW5mUjA1djBvZ1NteGpXZTlXRDE5TEc0TTB2R0RORzVlN1pRc0ErRXFyK2txMDZtWkI4by9tRzJPeGtiajlSbjI4YXRRQzBGaDFMN2lxTFpJRkN3RzlrYVo5cjFJNkc3cDJmSUlzbGxFK29semNrbEtPeEpDUHF3U285UXRVQ2RDblhvVngrRW9Cd0NOWHFOWlk2MkpBZFFZWHc4cURadjFzYnI2ZnN3cm5QSHFIeG94clRLTWFsMkJ0UzBBQ3JLVC9rd1FBa2hDeTB3QUFXWS8zU3dFQVg1TVhBTzE1U0J6SVVuSkYwUityeW1aVUtqMFR3d2VrVDE5Vld4TUFXQ3g0VEFIeTVaNC9wVXdBaTZVOVlEeU1UM0d1VmdCQTR5eXZ3STJpRFVrV2l3WVkwTnYvR3crYkhXL3JWd1FBV0c3WlVjTXQrM1BnVUdhRnZEaTFBRFEvZE4wVjF3SjQ3WWxMNllaNlVDRUFxQlJBcEFrQUhrVmtZeUJJMWU4WmF2dk96cFZuTDgyN01tWVNZeHJWaGwxcFFabXMrei9KV1FDYkhnS3pqMi9sTzh6alpnR2tQZDR2QlFCb2dTMHVzVzJsSnZ2T0g1L29EOWJXT1JzQWFSYVhZQkxDZHpPVVhtNUtyV014SU4vSDNQZDhUS3NnaUVWeXN5cmErV1JmYTUwR09BenhFNVpQSEFmeTJqd3gyYkZnMEs2SFBOTWk4Nk5GUCtwY2FhbEhKbVlkdWZnaUxFbXFBZTY3NG1xQVZpRVBqRXZWaVVlbkpTTUFzRWUvUDJNUUhaOEFFS2tVQUR4MC9vSTRHd0NjMUFzVGFrY3VmdUdjZDJITXBNWTAxSHJsY05hU3NrK3IwUDlKMFFIZy9jRWNERHc4bWwxWTBTK09Ea0ExeG9zNm5IMEU0alFCUUJwamZPSUtSYmJ3M0NzM084SjMrLy9HMlZvTnJET3c0WXFyMCtKRmxSVUh6Vm9BWEE0NEpFQVRJaHpGcVRWKzZJa2x2cXdBQUR5VmNSdksvQUFjcWxpaGVDRWl0bEVDQXd1UWYzNFFrVDk3WCthclVUNnNMcjR1NHdQdkJseXVsZ3hyMU53aGwySFBGY29DNTV5L2xLZmU3RFFQdFV2R1QvcU5OQSs5eVNBK3JrRUl3aGR1YWdIM3ZWWVdaQVd6dFFRQTRJa3JMUUJsaVpuc3hHejdSbXlQaFpyZWxUR1RHdE9laU5ZTmgzUTErajhKU29EOUxsd0lERlhqZXFTZjdzRHZSU2tCVm1zOEg5ZU13Yi9HeGJ1TmNkWVNBb0FzeHZqQS9XZnBheXkwVldrV1dqM2QvcldXUjBpN2cwdlZiNG85M25URk9pdFdwZGUvZnhNRkFGRlY2bklCOG8vZU5HNFRDdkxWR3Era29BMGZMcDJ3Y1J0bDNJNEtBUUErNjY1eG1QVExldzNKZjA4bVlMTS9CcjVCcHl2azQvZDVQQUNXb2lDVHJsU0tPYzdjS1NwY2g2YjZCdlBFVytnQ2dJVjVxTU91dU5wVUhBQndPd0V2aE9OamZXU2c5Vm42UEprTXJ5TThDWStjdnlBT2c1RTFZdHhhYmMzei9HajRtdCtoTVpNYzBNTXhtbFp4N0NyanRsWk8veWUxRmdBWHVacUdESmRCc0VkV3Naa2REN0N1OW5nZEVhQmQxOVNrUE04UWpST1ZzZlNxU21POGwyK2Z5ZzA5Q3dDZ3VqcWZPYi9PZ0Y0NjkyQjlzWGYzdFNzdFVsZkUzVkVBRUZXbExrN0JBbFF0c3RpUW1OSzI2Y2tuVGdJQUJtbmphcm5KUGppZzA1QUNWcU95QVBua296SUhZN1Jvb2c3Q2V1SWI2TUxUQTVVNUFMNEZqcDRYTGNVY1orNjBqc0U4TkJVMW1wQjM2b2V3eUhOWExES2s2bE96UUpDTUEzeHVVUzU2cjdNRmtIQ2RhV25MWVVEMnVoRlVDY3VYeWJBWlNGMTlTTTloRmNSaHI5ZDBvRVZWTk1UMG5uZGh6TGdIOUhUTU5ra2VxYXo3UHluVkFBYzk0RFlIV1VhYXNURUpjZDhGNXk4Mnc4V2NxajFlU0Q0WVN3bHpSVHNjeDZxMng0VFVyTWVvSmdCZ25RRU5VeXNJMkFCaU91Yjg1K1NiYk1MM3cwcUFmMSt2Q2dDaUtnNmhzaHF6RjlzQUJEVEJEYzFYdWNoMFJiaGtCVzJtYU9PK0pOQXhBUisyWENsZ2R1bXJpM3hXSm5MR0ZVUVhkTkdFVXVsYWpkUy9TZWhuemhXSzJleEZiS1JHVjF5SytWeUN1UnR6QmVFSXJSSTFBcmZ0THZxbUQxeXBkcndLSVdIb3c1cGJmZThiQVc2SVpYRFdwUit1RFlDdU1NelEySERocW9Lc0tHalZRUGRwZEU4R2JvOCs3d05YUXV0OGg4YU1jMEF2SjJqTXBjbTYvMW9DZ0tlZWI4YjdURzkwbWdlK1NISGZiZnBadGJlOEg2bzlYbWp2SXhsMURjWmFnbkhRN1IxaTAyYzlSalVCZ0tvTnRoQlJmZElWcTZxdXdWclRzM29WN0tqYS9rRTRSNTRyQUFoVkhGTGppbVZ4MVhVL1FMZkZOcnFoY2ZXalhXZVh5azFTMEVZL0dKT1FHTHhnS2xQY2RCaEd3VGxYcktlOExwTzZJcytpc292YnJyUTJzOFhhWnhMY25QU2w1WEUzWEhFNTI2aURUTjMvMzdua1FrRGFYb2xCN1laNCszTTQvRzk1akpyR2hmY0FkVnExQ2xxY0xZQmthV2NyNXlRSGFZc1lKckxpZTF2d2UxaTdQTVJYaVRJU2x1NEN4NDdqQ3VvTWdwZnFYUmd6ZEVEdkplQWI3Q1QwMXFYVmZ5MEJBQ3MyNG5mRHltKzYxdldHdDBseDN3UG5MMDJPKzZIYTQxbjFPNVpkY1hVODFWYlpoZ3lVYlJvbnRNK3JNVVkxQWNBOXlEQm9OYkxWVUZVVkFjQXllR3pVdTZzY0RxMStXYWNBZ1BQU3JUekdBL3JBbk9kdVZTdGFnQmlNTDBVTzQ1VlJoeGltSmJHcjJacDAvUG5RQjdBT3BTVUFQMWh6T1FjR0pHZjgvU1l0R21UdCsxandPVmRjeldrdkl1U0M3bjlsaTViRG4raUVXNXNDbEVaZzNOK1dNWHhHRGRVUnQxeXAxclI2ZGl6dDdCNklhYzNCVFg0SDRsWWhBSUR4dlQyNHBTeTVRdTN5QVdMWmFzWktLQXdSMGwxb2xkWkdJUzZmcERIKy9yc3lwdStBUGl5akpRRUFhZlZmU3dEZ0t6Q0RsZCsyNFNCajZlTkRUOXgzaHZZa1ZqNnM1bmdNTm5EdmI3cGlmUldyN2NmWTU5VVlvNW9BNENhUXgxbXZwdDlZYTd1R3ZSOGc3KzRMR2UraEFvQzc1QVhvTVZ5K08rUmVXRFRpZjFhOTRtMGcvcTA2ZjhuWEtEMzcxOFJvakFNQURpaU5LYTRTb01ianRjenZEckR5ZWNFY3dLVHJvcGx6dHNoRFUwU2F5Z0V3T3BjTk4xcUxrWHA1N1A0L0UrajNJQkNiVjFEeVRQcDk2Z3A1OGpmbDhML29TUkhkQWxDMjRZckwrYkpBaktwbW9jSEJtTllFdUxOV3BUOHIvSUh4UFF6VnFHZG1FVGFzMWk3SDBwcWhnalVJRm4wZW5FWWdtMXJFT3V6RHlrSTRIVE41aXdNQTB1dy9DZ0JzQWVNNkxnQUkvUTRDQU0yaWFqVDRMdE5naTdIcUd4Sy84SmErU29meElObmJKelVZRDhFRzduMzEyTExZV2c0dVhOdkdPTGpQMnlGc21mVVk1UUNBMEpvTEFZQXJCZ2hRc20wM3BmWmFtV3ZERUQ1RjcrN3hHWEpIQVFEbU1iNEFOOE1JZGI0VE9GQ3NqWWsvdnhaSU0xTUJCT3NRODdudjRnQ0F1RzYvT2lCYXFJakRPQjFLNjhhSHhOUUxQb0NHRGFLa0R3QndYOHZnK3VkK01QZGZpekI5NGVrWDNYVStpZDRuY3VnL2tINXZ5U0s4TEl2N2V6b0U1aUJtdGd6NXA2aXN4dUlxNThrTG9PU2pUbUR6cS9MaW5QUzM1QUZBeklaZEFtN0dGRENWZXlGbnVkNFZGOGhoc0xyZ1NoWHdmTG9MdnRTNlJmcjlCU04xODNUTTVHMmVBRXJXL2Q4MzhybHhyV0diTTdJZ2t2NE95bm5mZ0ZDWkZWS2RndjIzNHNub1dZVnhwdVQzQnNGR28rQk10Y2ZEZURZZTBPUEE2Vm1DOENvMnJzU3FJSVAzZVRYR1lBRHdreXRvbmJ5SUNFZGJhNjQ1QUFBdUFBaFFEWmw2STlTaEJHL1dydUhMSTNwM3J5a0ErTWtWeTRhMkd1NTh2TkZ2ZWNocEZ0dDRHendHbkdiVzRvb0ZFRHFOMkkydnNRZUN4UktTRUgrMG9FTXpnUUNOc2N5NmdzQUNmMHdWWDdBT29FN3BVMi90ejExcDBhRUZ3NkRPME9IUC9laEJkaXhIZVN4SThZbW5YNngvUG0vRTVodGdNZHdVVUhGRmJ1dy95Q0k4UTdkMTFVQkFKdldVSzFWV2F3WFBEbXRuUDZaTnFqV3V0ZjlKaUYweEFHTFBnUkpDeDREZjBBTWJ0c0VWWkhFVk5IRzRhaEpJbzlyR0RTOFZpd2lwc1J3emZuL1NXT3VuWXladnZBYXk3dit1aDNrOUVmaGR2QjBtL1IyVVZFZHBXU1pWOTlQK3N6SjYwQTZOdzM3b2hyaHZQYVJ0VjN1OGU4YmU3NVcxTlFMenBjUm9iTlBHT05ZK3I4WVlmM1VGTVNCTEF0OUhTSjhLMkxXbmxOWDFqWUNNN3dBRTNLQnp1ZzFzNTZnclZya2NKZkNDb2VQLzh1NHFBRkNOK3ZzQk5LaG9ld1Z1OCt3NnROeUZxM0JMc0lpRFQ4ZzEyd3V4bTFENnpoUnhFRGhOSWtucXoxMjRtU29JNklGTm9KTEFreDRET0JFNGdCcmxnOTExZHRHaFNXTnhqTW9jOUVFTURmdmgyLytIbm42eGNVb2R5c1Zla3pYd295em80d1A3YStuN1kwaXg3SVVVUzg2bDduZWx5bXI2YmI5MkJkV3NHN1JKdFVoUUY4VzFoaUIyMVFsenFXellQc2hISHFUeE5jNmxHL2F1cks5TDhoelBYV21OYlc0RHNIblFTNFVsUU50ZGNZVkRidjBla3V5N1BtYVNOa2o3SU92K2J4bk1hMXhyUTJXc3o5RHZZT0dtSDhVdzM2YTBhb3o3b2diSnVORkdJZTZMKzZFSkRtTUV3OVVjai9jKzZyWmcrdllJcEVlUHdoaTRYcnM4Kzd3YVkvdzUzejZTeTVFV3dXTTFRRTVKRDYwNUs2dnJLN0c5WDRxZFArOEsxWFlmUUtoRFF3RjlybGpsc28vT0lmYUNIb09Lc3dvQTFFWHJRNE1EZ0xiblhMRm9ETG9PclRRdGRBME5HS21EOStXbHJ0REVEYnBvQVE4MFBKZ21NZVNTaVg5Y0p4RHdRdnA4Q1V6b2dZQVJHWEFGMVRFK2dCN0xncnpoaW5VU2ZBWVYrK3AwQlJXOEo5RFBaVmdrbjRoTGl2c2RwRGJnV1hRcVBhazMvcS9rNFA5VWdNVjdzSkcwbWwrM3M5WFUydVhuOUhuMTI2cHExbmtDQVNyS296TEQySCszZkI4RVVob0RhNEZOclQvWFNlUFgwZUYvV2Q3eEcxcmZuVEFlTm55ZkJwZ3JMUUZhVCt2RTZxUFRreWI3cm8rWnBIVzVValhJTFB1L1RzeHJYbXZkWmF6UDBPODhoZ1B5ckhqSzlGQkc2V3ZjZnlvZzFtKzBWeEFTYmFkNXc4UDRVZzNHNHd1QUZnalQrZEwxMWVzS0FtbmFlbW05WWp5YjkzbldZL3d4Mzk0SHU2WTFBZTU0Z0VmVW1zTkxzS29BL3YxaTk2dHEvSEdGd2daWERUU29JT0FWdUlURzZVQnY5UkJKeGczWEVPZVkzNUp4THdDQzdqQU9HYXNoMm53R0xwK28zKzEyeGVweWx3a0UxTUVtVUVQek1tQkVYb0lSdEE0Z1BiUWZ3b0wwR1RBOXpGckY4RGJTWVhwWkR0SnZaUUYrSUlpVSsrMmk5akxHb3Z0U0FNWHh3ZjgzNmZmM3Z6cjljL3JuOU0vcG45TS92OHcvNHNyNDN1TVNlbTZrSHZSRDduZ2J4REJZcXJYZmNBMmpjcUNtbVIyUCsvM3Bsemo5Yy9ybjlNL3BuOU0vcDMrcUN3RGVnM2dEdW1xdmcydm9NYmhyc1pCTko5eVE4YmJaS1RkT2RhVzhnSnZ4WTduUjNvSlVzN1BpZmxiM3lxY0FUQzRTTUFtNUpmRUdyVksyN0duNFR0NzFZM24zdUs0d2pMVllZam85aGl1Y3g4LzZuZExzdDlyZm9ocmpmQ1poZ1BORWducnFjZCtpNTZnTFlvbXZqTytPNDZOM3BacmpWZnY5YmtKNkp4YU4wdmpuSUlXMU1LU0dvU25MTy9pZHdZSkdEeDNhb1E3U3RsRHRlZlhLTlVHcTZ3TngxeW92UkVORER5a2twZksxMnRySUxXd1Y5dkw5Zkwyc1B5VEVJZ09mTDFrNk4vM2dtcmJtMUNMY0lVazQ2M0hTN0xmYWMxT05zZjRwMy80MTMvN2tTb3NJc1gyTHMrN3FLUjJ3RGRZNk52VWdOOFFCQU5iaGY4UGpFdmNkaGdNVWI5YURzWmZpaEMvb1lMeE5JT0E5Y1VQN3ZCTDFRSDZ3NHVoY0kwQU5GbklOMUlYK2haQTU0bm8rbER4aXllbU9lc2h3ZkNCbC9VNXA5bHZ0Yi9GVkZjWlI0czRsSXcycUZRaGNGdGx4QU5qRXlMWWRkcVVGbE5EWVZITzhhcjhmczVLN29ZOXhJc25xdHhvRlV1MUVnQng4d2NpRGJnUWcyQW54M0JBbzc2STg2SG9QUDZUZUlLVnlqTGlMd281V1lTLytlVDBZdmdiV09BdGpkUkh6bnVjTnc2bzRiNXh5aCtEc3h5cU1rMmEvMVo2YmFvejFML24yVzhrYytOajV5d2pIV1hmdGNIN2kyZlFxUkFDTUF3Qys4SkMwSGh1a3VGNWlVdXBoT0FHTWM5YVpId0oyUEI2TUhBcTRLQWZ5RjREK0xYS2lIZ1NEUm1xU012elJZRDJMaUtPSENKQ3ZLQ1VROHkyeG9NNk1rUTdYWllDQXJOOHB6WDZyL1MzT1pUek9CYmdkWHpXRVVIRHpUMUM2SXhhQ1VyMkNXVWlEc3RRYTc4aTZ2bFRGOGFyOWZwZzMvNUpTaCtjcFRWYnR3Z3o5blpVZVhPOFJRY0hVMFRpZ25KWFEyZ01aSWlpRU5tQXd4Wm5MNUN2c3BZM2xWNUV3WmtsamowRHUvU0xvVzB4QXJqZk9tNHJ1K0JRdkwxZGhuRFQ3cmZiYzNLekNXTC9PdHorSUovVXp1djFiQW56V3V1TjFoT3R1bU5ML1NsSUE0d0NBYndSOVdXbGFMVVphbkM4M0ZIUE9zZExjSkNDb1Y0YTdEMEVBdXpCdkJ0SVR4d3h4RWhRYjZ2ZWtwVEdUL29iaHh1VHNCeXk4c0FxaUdLcTh4SUk0ZkNBcENNanluYTZrM0crMXY4VmxNUUJaamZPVGVCZ3UwVGUzTnY4OENSN2h0MTJBRk5kVlYxeXY0U1drMDJtSzVYVTRMTE1lcjlydnA3Y256VW5HQ3FCcklHNmxva01xczYxQ1ZhZ1J3Z3FTTjV5dGhZN2lVWk1CVU83VFFyYzBJbjV5eGNxSEtrekZlZUlLVkRxZHY3QVgvdndZaUxIZ3R3a1Z4MUkxVEJVRm15TXRGcDFUVmF0RG5YclVGYmhhaFhIUzdMZmFjNlBBTXN1eGZnTnBnMThhYTRCTGR2dldIYTZqTmxwM3N5RVJvRGdBUUYyR1BxR1dQcm9GejduaUtrVHJybGg1RGxXaWxnRkJUUWJTQVRVWDFuSmhQZ0VYcGlWUWhHcDZxM0Fnb0RCTktKZityc2VOeWZvSFhIcFI1VEJWU2xJbGNmbEFRdGRwbHU5ME0rVitxLzB0YnNwL1A4aGdISTM3L2lCZ1JsMS92bUlvS29HNlpYeGJsU0RXb2tVaGVkZHJSdXc2cS9FZTF1RDluaG9DVjZnRXFudEVaWWRWcFZMM0QxYVBVMFZDTmFEc3djQmJqOHBITHhpZ25GWHFzQnFhcFJLcDRibFdBOFNnVWh3WElQTVY5dEtHUlhGNklHYzhUbmxzTEoydVNudFlWd1dMaFkwREtPRmFJWTh6SEtjdTVYNnJQVGZJaTJsUGVTemxnUDBPUXFsV0NJZ3J4RTRiNjQ3WGtlNDFyTmZqbFFHT0F3QTA1bnJIK2FVVVdhOTkwemdNdFZZNEhveXFPYjRTVXhBb2pndHpoSkNZU2c0ZnVOS2FBeUUxUGIxNVBnaTRNYmtvQnRZQTBIZldvaGg3TUw1UDl2aGVSdStrRW85cDlsdnRiNkdJdk42VktsSldNczR6NmZPeHZBOUtkNkk4TTVkRDNZY3g5TnNxME4yVi83Y2V3d1B3MkloZHB6bGVLd2l2VlB2OW50UGhQRVpHOHNnVkY4TFJDcVBIWTJNSlh3UUErazRzcklLbFVGWHRjeDNBQ29KeTFLbkhldmFzN1k2a1JnUUFXbXRpQit3WVM0aUhDbnRaY3VVV0FQQkpxR3Z0a3kwQU1RcWMzc2g3cm5zT09WU1ZZMXVleGpqSWcwanorYXM5TjgrTldIb2FZeUVIN0k5QS90TjArK3N1WFA1NWxkWWRyNk1PWTYvaG1sOU9DZ0NRTGN4S1JsaE1RVGZjRGh6MFdCMFB5OFRxaHRRQ04zRWxnWEdTUWk1TUxGS2toNEErbDFhbTgrbnBjelU5cXh6eWxQT1h4ZHdHVDRmZW9uWUJHUGdLSDdYU1laRFdPeUV6T2MxK3EvMHRHSkduTlE3cU0wUVY3OENTdVZxWWFaUFdQQlpaMG1JNFk4Wk40NDVoaEpVRm45WjRmY1JBcnZiN3RSQzNZTXdWbDNqT3dkNVg5L3dxWEI2NFFpaDZjSGhmRHNIaHYwTDc3Z2oySDFlcXk3bm9TcEdQQWdEZ01BRUFDRlhnVlBmdlRWZVFXbTZqTWJVS3FkclZkZkNncmdEWTJRYlB5YmpuMjF4MXhZVnhobHh4bWZaeXhobWh1VXZ6K2FzOU45YmFIYXR3TEY3RGZ4SHkzeGtpL3owTWhCN1dCWHp2d2Jqb2VmSUJnS055QVFDblFyQWtMNVpUM0FYanNFbXVmb3dwcmdJNng5OUJFR0FWQmJJMlNTdTVNTkdJWUwvb210bDBka1U5ZEY4cUc3UU9idjlZeEVISDBGdC9EdUpCU2c1WkJHQ1VBeU9raGczTEFuY1loMEdsNzlSSGlEek51YXIydDdBUWVhWGp2Q0pFam9ER3F2cTJDT3Q4RTc3MW1pc3VNTFhsaXF0aWN2eGFGZld1ZUl6d1dJWGpJZUZIWTl0dE5YZy9yTkE0UmJISVpYS2ZUd09RV3dHN2dURjdyQ2JKOGRGeHc0TnhCSWY4RmdEeWJWZGNKaGpydTA5VHZGWnZobGtEZ08rRTZIeUR2ZysvM3hLNWY1SGZvSE82UW1Fdi9EYVBZZTNoQVROQjhlSWs0OHhCREJ3VllOTjhmdVFaWlRFM25KRVZXcnZXL015UTk4bWFIMTdEZjNPRndrSG53ZE9PNEJhTGJXSEpiZzZQOVVPS2E2b0E0SmFSQ29HVHJvZS9vcEl0aURYTXUrSkNDdE5BeWxrZ3I4RWh2SlIxTzI2TTRTYWJJUVNXQXlMR0lybmhObDI4MG90OHNHSFpXOTNRT000c3NNOG5nWlMyRG03UFhYS2ZhdnpVT2d6S2ZhY3hBNUduT1ZmSXlLL0d0L0FoOGtybWh4RjVuQU1TNDJrTFlHRFFJQ3hUU0V2Smh4aFh2aUVBS21TRXJmR21BK1BOR1lRZnJMMXVHZEdzM3UrV2NRaXVHdkZJM1MvS2FKNzB4QzVYWEhGMVFpcytxamV6UGRsbkdwL0ZTOGdTMkIwRmpLOHBYc3ZsdWh1cUFBQytNUmpnVmhYU0dlQTM0UHlzZ3IyZEliSXhmNXVic3Zid2tKc0IzbGE1YllGQWZPajVGejIvNzN2KzZ3R2VrWHFpc1lEYUtxdzNYcmN6RVdUc2V6SFc3cUpCeEdQQzUzTEVHdjVRTXFtK044QWZYenJuNFVKekFMYU1DYktwQXdBcy9OSGhpbXV1NjRiYmhjMjJBc1NhQ1ZkYTFHWVNVZ05uS0c2N2I5eU9FWW5ISWNvc0dTUUpOS2doNG80RkFKNTdEcllkY0NOdXdqTmpUdk1RdVQyM3dBMXBWVTMwSFFaSjM4bUh5Tk9jS3gvelAwNy9zd20rUlJ4RWJvMHpBK3ZMTnorTXlObEZIbFZXMDJlRXNhZ1U4bG1lQWROWUszdEZHZUVWeXByUlBQbHBNa0FMaGtGZHBFTXBaRVRIQ0p4bllVVFhJUHlYZy9pK3VtSzFWQzZISW5JR0dSQy9EWHJsZG9CenN3bGVoR213UVRNVU1ySThjNXJhMkE2Y2t5d0JnT2FBYThqMUlSd0Vlb2dPR2tTMFhmRFlvQWVEYTVvOEkyTHRCVThjUFFkOUpta1dJZFQzL0hxSjJ2TDh2dlg4ekVGRC9zK1V3ZnZZb2JXMkE1d3pYUk5UbmhUaHg1N3ZoNkd4SlFDdW1nS0tLWi9XZkRLZkJhc0dJam5YeXB6QlMrZXV3Yi9wZ3F5OFZBRUF4eU93bmpVaWtpMXdzVTY2NG5LNVdOWVc4eU1uaUxtTkU4VzM0NWFJVkpsQlFwaFJLTmxLM2VFcWVCY01RNFB2L2NaemMxQ0JrUjRqdm9veFZNdllaSW5JUTNNVlF1VFdYS1dKeUdjTjdrY2FpSnpUWnFJUU9aTWFRMlUxbzR3dzZqMVlCYTR1QzZDTk1zSU1MbFdRWnhoeWdTZkpmYi9yT1pTcWJVUjlMc3hEMlFjYllQU0h5Tmd4V0Y2RzBHQ3ZFUjlGQXVFaHhWODExVzhJRFBRVTJaMGpEeWhSdTVBMUFQZ0NlRFhYNEZzMWVFS1FTS1E4OHJpRVdYRHNQcVhXK3RiZUd3RlJCd21hQlFDNGltbzNlVkczQUh6eDc3TXVUQnllRVlhaFgwUGZoL0ErdTBaMjBBaDRBZFZUNHZ0KzF2ZFdNWjdPd0h4YUFBQ1YvNjRaNUZ5TGVLaHJlOFVJSVRkbEFRQ2VRQ3BQVkR4aUhnNS92SDBoSVc0VGN1UG5BWkZqZjF1R2U2UE4yV0laVFFiQ0hJMkprbG04QTJOa1dnV1BpVkpvYUhSU1Z3eVBSYk9SQ3JRRzZaQ2JRS0lhSlFDUUZTTDN6VlVjUk01emRaSVIrWWdyVnE2TGk4alB1dWl5bWttTk1ISllIc0xhdWlEck9XU0VNVnlFOFhaVkFPdWpkYmtKQnM4NmxLcHRSS01PYWZiMldTeHJKanNOQXJHeHo3Z1JNN2pBT2V0MmhWTEJtUFdBM2p3ZVN5OGZXUU9BVHd3dndDTlBDSElSYm9NL1MvT1J3bG9wbythcUs0aHJ0VWNjV0pzSjJvWmhiN0NLYWt0Q0FORGxpaVhUSDN2U1ZwSC9zdzlyWm9kNEh6dEFDdDJuakt4Smd5dVJCQUIwQXprNUNRQTRZOWdjbkN2TEk3WVBjelZsaE1sVEJ3Qk1ndVBiL3o0ZHJHTVU5OTZSRDNJQTZYRTVNQ0R6eGtzeXcxZ1J6dGZnTHJrRjNnbEVtRWtOdEhWRDAvanNXUThBc0F6dE5MbnluNUdSbWdaaUlJb2lZUWdnYTBUT2M5V2JZRU95MU9uYmdNaTdFbTVJbnc1M1U4cEdXRzlnWnlLKytiOGIzQmoyTWlVQkFOVTJvajQzZlk1dTNQTVFGcHczakZaY3NsTXVjSk5YN1ljMnozYzg4RncrZEQ5bkRRQStNMjZEVCtoV2h5RklKU0R2UVFxeUwzejZuREpQemd2bklNNkJ0WmlnelpMM0ljU25pUXNBNmlETWFLWEZZVTYrY2prMlhFSG5ZUkU4a090R3lHZkZlTzdtS2dHQXJ6MWVSOVFkbUtiTE1hOXRUcjlOSFFBMFJKRGdjcFRxTUUza3F3TXdKRnVRTTc5UEh4MlIvNjRueDFnSkV6L0NKc2tTSlg4VFlFcGJzWHhjREEzRVZFV05jMjBUUkhUSkdwRXJHbStpMjFuY0RZa3BoYjlrUkg3eGhCamgvNUIxeXp3VERKVWtBUURWTnFKUnhveHZNMnhiZk43QWRnKy9nRUVEZTllZWVTNHo2MEFjdEE3bnRpb0FnQzlkc2JDV3BRUTNRZDZ2UTBoM3RZaU1Bd1NpOVhLakpiN2o3by9KbUcwTWJxVHRLUUtBZTRZWGdkTlczMUEyeDZ3cmxnVEhNR2NPN05LR2NadHVxNUs5MGN5UDZ4N2VFWU5tS3h6V0Ixa01qN01BQU04OHNid2RZNE1pZ3NkODdEWGdBS3lDNXdBUHFXa3lSTmFDcUFWS0xuZmgxcnRpcVZxc2NvYUZrZnJBM1owMUlyOEx0OXBLTnVTRFh5Z2lQMmxHK0JBT0RWVE1RN2QyRWdCUWJTUEs3a3dlVCtkdUdVaWJ5ekNYK003TUIyS0dkTlFCMnlZWEJSWS9tb3NKSHJJR0FLd0U5emlRNmJCSkFFb0IwejVsdXVDN2MvcnBEd24zeDJDTXBqVmRPc1EycEFrQVFtQ1NTWnlxNXpBTTNKSXhtaisxVHp0Z2N6Q2VYZzE3dzZSUDMwVjJ3NVdxWm1JNFRDK2NEN0lBQUVoSVlIY2IzNmhaSmpGSDZVdjRRS3lTeE9RZmE1SnJZYUFyV2JoMWNOdnVCTGMwbGtidUFLTExLU0t2TFNJL2lVWjRDdzUxSnJZTkpnUUExVGFpWEVpRjFjdzREREJQNjhFS0JhcG9pK1g5Mkk4SXl6VzRZbWxpTnBKdndLTlpiUUFRUndsdXpqTjMrdnhSYy9iVUZjdHJwd1VBckxLM0RTbmJHK3NjV3ZXa1ZrOUNLTEFiU0x4V2FIaVh3bEI2SGxURDN2alNQdm15dlUyaFFQNjJMK0RicGc0QVhuaGNaa3lrNHNubHRCcDIxZkhFc3hHekpya1dCdnFrZVFCT0VYbTJMcm1UYUlSemxISzZCQjZzSkFDZzJrYVVVM1ZEKzVPbGdBK01mZG9MK3pScCtLTUY5bVN0QUVCSUN2Z2NwRGpIVVlKRGJ5WWVFcGJYaEcrSnJBTlE2WVVEeXpaM3dWaHAycHZRT2ZUYUlHT2pHSkZGR04wR0Q1czFkalhzVFp5TDdCcVIvNkxPcmRRQlFITUFiZU5tbVl4d1YwelFSUEtFeEFFQXRURFExc0t0RlFmZ0ZKRm43NUk3aVVZWXhXMXlSaWdnN2lGWWJTT2F4RU8zVEFEU2wrdXM0RG91QURnSkhvQTR4WUFzSmJpT1FCb2xlbDhYRGQ2RUZTZEdIWXFyS1lZY0Z6eGpwV2x2UXVkUVNGZWxNY0IzWXNKMEhBOU9tdllteVVYVzhseDNHWjdyMUFGQWlBU0h1ZXc4c2JuQUFiOXZiTFE0QUtBV0JycTVUR09UZGhiQUtTTFBma09lVkNPOEVoRUtpQXNBcW0xRWZSd2RUcjlUVzdIcWNmOXpydk1UejlwREw5S3lFUUpnRHNDNFlTVFRBZ0M0YnFZaHhLRnRsbXhQU0FtT002K09pSHc5SHpNTEFnczFYVStSZE16N1NEbFYxUUFBQnhHazVmcUVOcnlhQUNCMGtlWGMveWp1bXRaTXlSd0E0SWRESXpkTkJCN2V3SHg3M2lrREFOVENRUHNLcHJDeFlVRWZpODFacmc3QUtTS3Z6b1k4aVVaWU9UU2hVRUNsQUNBckk0cTU3RzJCVENKOW4zWEtFTExjblZxY3g2Y0w0ZFBtNE5SRUN6eXdrUnlCc0VPbElRQXNSN3h1QUJSZm1lYmhRSGFFOWhHbGc4QzU0cHJ0bEViYThXNlZBRUJMd0diNDlCdWFuVjMwNnFRQWdMZ1gyU1RweFZVSEFFdEE2dElYWm5Bd2JQenVUdUR2ZlFDZ0ZnYTZLU0xseU1yTDdKYSs4SU55Zk5ObnBFNFJlZTAyNUVrend2aU1PdlllcmJ1RmhISHdhaHBSM2F0UldpS3ZJVTMwd0pXcWdWcEUzYzRJTjc2MXQ1c044R205aCtVOVNJc0V1Ty94VVBpVTRQZzJhR1ZIV0o3UGJlZVhWTmNiWTJqdEhiajRvbU8xQkFDSExsemk5eVFEZ0xnWFdWL2xUVlN1dlM0aDY1b0FnR2tQQU5CSlFwTFl0ckhSUm93TUFtdEIxTUpBUDQ5d1g3SVEwaWpFNFFjOUg5UW5PSEtLeUd1N0lVK2FFY1pubklQVTFnTklzVjF4aGRvTjVRS0FySXhvSEc4ZGh1VjJQT0VqSzFXWCsrSTlpU25HU2lEc0FrTHVhRVQ0aWVjdDZ5eUF1RXB3N0YzVnJCcUxnMlBGakxIR1JweTFGNmV4cEhhdEFNQ0NzeXVLbmxSN0UrY2lHeXI4WXluWFZnVUFNQWZBQWdCby9DYnBwWGdTK2FWOVJMQmFHR2pMZmJsb01OZXhyT2tFakRsTkx0d2pUejVuMXlraXIvbUdQS2xHZUE3V0w2ZE5xbkZJQ3dDa2FVUXZHem5PM1o0YzV5TUMxRkhBUENST2hucnBtSUdpSk5rUll6N2ZCT3hPTldvQnhGV0N3d09CbSsvbnJJUGpVVUx3R1dwY1ZLc3RnNUJqbENCYjZQZFBxcjJKYzVHTlkwTlF1YlptV1FBczRvRXV5bm02M2ZQaGkyV0Y5MTFwc1FNOW1HdGhvTmw5aWVwTTI3Q0FVZkJJMzFsRmI5Ymc1c2JHQ2JNUVRoRjU3VjF5SjlVSXE4UTJoZ0p3bjVVREFMSTJvbGZGT0lWVXpoQVljM0d0Y1hML3F5enM5UmpoUDlXVVdKSnhzRVMza3ZKV25GMTB5UEk4WkEwQTRpakJIYmxDeGRSUTIvZGtPN0hyT01uYWkycFlWbHRETmRYa0hGa2x4VnVkdnc2QmI5MVgwOTVFWFdRUEEyZGhFNUgvdExaSVRYUUE1ajB1K0cwZ3YyeTVnaVFzaWdRdHlRdHVRSi9ybmh0QUxRejBZMWNRNmVrRmxLYTNCMVN5MHhvSFN2UlIyZHNjR0VxTzNhTFl6U2tpcnkwQU9PbEdlRHdpRkZCcEZrRGFSdlNXckxmSHN1YWVPWDhSbjRPQVZ3NmxUbFdwMHdvcHNLYkVMcEJ0bDRBa3ExVWhXYkhTMnBkSVhNMFNBTVJSZ3Z0WmZ2OHdvaDI1ZU5MblNmZEhxUFc2UXZVK0xlQ1RWZFlSenFubHpSMXh4VVhaUW5vbDVXWWRXVHlScFBNWnAvQlBuREQxRmNtUSs4cFZTUWtRNVh6UmFMQ2JIOTNXR2pMQXYxZml6N2I4RE5id1pqbllGelV5MEE4b1R0TVBxVDJMQUFMMklVNi9EKzBBWEpzN0FHNVEwMTNmN3hTUjF4YVJuM1FqUEd5NHJvOWczeVRSQWFpR0VWWEphTlhnVjVCcnNaMzNQUWFQMmM1YVNobERDbW84MFROMzRJcnJVQ0JKZGd2MnJJTHlEZUx4b01wYVhSVUFRQndsT0xVaGNkcSs0ZFZnN2Zpays2TW5vblc3NGhLK2Fkb2JTOEo1TlVEcUhuQ0ZnbG5kZ2QrTHF6dGlIYVNZNHR4dGpMTVdNWjlXcW5pbzhBOFQxZFViZGt5T1A5YkkrY0psV0F2QWQ5dmVvVEFBVmdIY2hUakdOcmdxTjR5LzM1SC92d3o1elhnN2ZsWWpBMzNYRlJlKzZYWUZZUjhGQVZyNWJnZkF6Z0c5bTk1RTlQQWZnNHlCTmxkYWMrRVVrVmNma2I4TlJ0aDMyODI1K0VxQTFUS2lUOEY5L2xMNjZxdkE0Q0hiK1NsOUsvVE1yYnBDYWV0REQ0Rlc5Nzk2SEplSUwvQUs5azgxUEFCUlNuQVlIbG1PYUZhMmt4VlNTUW8rbzlxUXpKc3FtNlpwYitJV2xzS3F0RVBTMXhDa291dFpzZWRKVjFjNzVhczJ5V0dxU1htZUlScG53VWhOWlYyTFVFZ3NTYXE2MXEzNTFHVlVEVEJVMEFQMTI2Y0JCS3lDSzF6ajBnc3lBVXYwOSt2Z3BsT0JEQzEyZ2lpOEZnWWFVNW1hREJBd0JXbGFxNjY0cExHK3U3N2JQQ3pPUVdEK0t6bnVGSkhYRnBHZmRDUDh5blBiUFFRd1htNHRnQ3lNcUI2Y1hmSWRodVh2UjQyNC9XRmdIMW9HRDB1QnF4RWRBVS9raXV5L2JWZW9XN0pQWk5uWDRJbGNCNzdBSklDQXppcVJBS01razNsK3BnUE45MDJueWd3NVRzZHNlaGpxdktWcGI2TE9JZWJEekJMdll3YkFvWlhCeFhvVEliRXlMRncyN3dwQ2VGTTBEdi84TW9XYTR4YitpUktyT3liL0hWY3kvU2dMQU9CVEtjSnFlenV1dU9pUFpnV2c4cFZtQTJqSjREbFhxb3cxTFg4L0JJZC9peXVJZjlUQ1FGK1ZPTXNEQXdTb1Vac2dWL1l1OEJ5d2pDdEsvK3JoLzBMZTYrRXBJcTg1SWovSlJsZ0JBTjkyMTJFZDY2MDJUalhBYWhoUkJPdDZPTStDYlVEaTd4Nmw3ckVuamcwZWV1WVFaQ2pEZjViaS9ldDBJZGtBNEhFSWZJRVZWeXhmbmJZT2dBOEFoSlRnWGh2ejQ5dnpreDVDTk5mWGlFczZYazdRT0tzcFRYc1RPb2VRUTZKZ2J0bkQrOWltbjBWRlRTUXIrNFI1ZGluTXZBWmpMVVh3UyticE1MZFNXYU1LLzFoeTljZmt2OC96N2YyQW5jeVZDd0E0VllFbkpFZUVQelFjNDlERzRLQ2NBYkxhQlB6OXNIeUVYanI4SDhzTDE4SkEveWlrbzl0eVNDTUllQ2tmRU9ka2xSWkF6akRpWGZMN2VQamZPVVhrTlVma0o5VUk0OXBCSGdxSEFvNFAvLzh2Y0NoVjI0aGFCT0pWMkNPYnpsK2ZBOTMvS25hQ0JrODljeGhtNkpJNUdwSSswTmJnWlVNOWR1dmdOZEh2dStWc2dhNnNBVURVZ1lPaVptTndpY0FXTnlVNlR0cnhYZ0pQNm81bkR0SzBONkZ6YUkyOFg3c2UzZ2VUc1pGc1Brd01lM1RQajFHbTJoN1lxNXpzaHkzZ3MrWG9XWlJmTWhQalVyTUR6eDYzWU4weCtlK1RmSHZQbFdyV0xMdEFEWW80QU9DK1FieEQ0N05CSkw5MTJVQ0xjTE9maFUySWhnVGRmUnEzMW9YWkRJZi9QZG53dFREUVo0Vmt3U0RnR1hranhzaXp3VlVQcmJ6OE9qajhyNTBpOHBvajhwTm1oSDFycHpzUUN2ajN3S0ZVYlNQcUk0cm1nRVQ4R293azloTVNPL21hUEhNSUFqcmwzZnJCQXpSR2w1RnhDbFZxaGhJYjZ6U2xnS01BUUJ0NDAyYU1iQ1VVRGh1QitWSHZSQnRsS2ZtS2x2SHZXMnZ2c0l5V05RREFjNmdURGpra1kyL0Q0Y3k4ajhNQUdSc0JwN3JZZVovb1hsdUdOYndmbUk5OUNpM051bUtsMkZaUEZndmE3N2dsNjQvSmZ4L20yNStOWjU2Qk0zZ1d2TEYvdDYxeEFNQWRnd1EzS0M4ekN5QWdCNngvTlJ4cmhQZzFOVzdidUJuM3c2My91YndvSHY2WGEyU2d2ekpBZ0dvUm9GR1lBb1BDSGdCMjVYUkFXdE50T2Z3dm5TTHltaVB5azJhRWZRQ2d3eE1LMkkwd3lOVTJvbEhwbmdjUUpsc3lidjlxOE5qOS82VjRBaGdFTk1xN3FYZXVXK2FwbjlvZ3ZQY0NwRkJ1a0xGR1lPZ0RBTHNKQU1BdTdBVUdBTlk2d0t3bHl6YXBoN1FSNXBwRG85aEhuTm9qV3hXMGN1eU50aWg3bytjUVpuOE0wSGRrTWpabVk0WEkySU4wdzM1Qys2UVBRcjNxUFZxanN3emQ3TnZHT0JyYTdnWGVsNjZwUVFpTnN3Y1g3U0FxWWY0RTVML1A4dTF2K2ZZSGV1WWhzVE9qMEVhQWo5VWVCd0F3Q2E1RFhtS0lRTUE2TUcrUkFZK1Rzd2NmUkEyK3BSYW42WGQzNFBBL1h5TUQvUm1BZ0V0aWlCNEdtTUhieEFIWU1QcEVWNDRXY1RoM2lzaHJqc2hQb2hHMkFFQ3o0WTFiQm1EbE04alZOcUlXQU5nZ283OEc1THR4Q0w4eCtRL0ZUajZUbTQrQ2dKdXlKaCtEZCs0RmZOTk9hdDNFRjVnRHI5RXNHZXNPTXRZWWVrVHhyYWppVmF2MDgwc2VEOEF3ZkF2V01QSEZnMzNrNkVYNi9RVUtlY1VaTTBtYnA3MkI5Z2JYZ3U0Ti92MDVWNnJBcVBIdUcrQjVmQjVCeGw3eDhENVdYYkV3MUtpSGpIM2ZGWXBZdFJBSTBJTjZIbTdzcTlTV1plN25pUFRkQy91M1h0NVB6OU9CQUljTDdlQkRPak9PeVg4ZjU5dGY4dTIzOU16ZGtIV2pEYjNzTCtJQWdLdmcrbFpVenlCQTQ2ekxkTXZmQ2FBamRkVnkvbjBUb1p4TDR2Yjd0a1lHK2dNaFdIem5Dc1dJMEFNUVFyVnJ4bUhUUlV4T2RPV2NJdkxhSXZLVGFJUVhuVjNWcmcxdUR6Z1BJWU5jYlNOcWVXMFc2ZDNtZ1NBN0RFYnlCZDMrTHdQYitXUDU1L2NDQ3E3SXU5MlJuMWNnb01DeGlWb2I4QVYwSFUwVENSbU5kUU9GKzhhQlc2Q05nV3M3a1IvbmpKOW5tOUFGb0c0U2VDeFR3S2thTXVMQkQ0MTlPR2I4L3FRcmFJL0VIVE5KbTZBYjYwK3VXTHE5Zy9hdTcvZDdYYW40MDVVWVpPenhBTzlqbnJocHcvSjczUVlaK3pZQVNqeFE5YUFlSVQ3YnJPRm01M0Y2YUQwOW92TzB5NVBGcFY1eHRZTkkvdnRPenFiak0rcVArZmF2djByN2p4eE9xc0gveUFBQmc3QjRaaUtRMFNvZ2JkejRRNjVVZ1U5SkR1ZkV6ZkZGalF6MDMrVEc4YTFNT2graVhDcDQyWGhIUG15ZUU1TlRiemFuaUx5MmlQeWtHdUV4OGxRMHdPMGhqa0ZWZzF4dEk2cVpJajFFek9ObjFPK3VtVDlvSlBuMnJ3YnZVd0VCMzRsMzhKTDgzRTM1blh2eUhJOWw3eitWVnVlS3RRbjZaT3hoSWlHenNXNHliQjRLYjQyQ2E3V052dXV3S3hYcUdxVTErSnkreFpEUkJnZ2c2ZDY0QjRkc08zRWd1T24zYW9zNVpwS20zMUJ2ckxyZWNPL2luRnZ2aDJzQUFhQ1BqSzNmVVE5bjVYMk1HMjJVdnZGTHlGYXBKejdXRFFJQmVGRDN3VmpzWWgrRjIvc0EzTGlWOUszcjZlNnYzb1kvY2dCZmtzUERBZ0hkd0x3ZEJVTTBiU0FqUkVlK2pjOEZEcjZYbU45SE5UTFE3NG14K1VhTUVCWWtRdmUzdWhPblBlL0loODBEVnlyamVJcklhNHZJVDZvUjdpZFE5QlJ1cFoxa2tFSUd1ZHBHRk4yY3Z2bFFvOThOM3dNemY2NVRydlB4N2Yrdmt2TDBpVndNdnBHL3Z5QS9lMVYrNzZhODZ4M3A2NjRyVmlkc0FSdW10NjR1WTEzY0JkQ3M3OUxuaW9XMyttanRQcWQ1ZldYOFBLNUIzRVBxdnVYMkVnalNEWEJSMG9KTDlRWUhnbHNuZks4NFl5WnBPbmQ2WTcwbzMrR2VnRENjODY3QTcrTWEwTFZrOGJCUVpiTGRGWXROOVJ2dEZYempkbmhPSm1OZkVvOFRnb0I2bVN0OWZwM2ZYbytiSGI5WEM1QytkVDFkZjFzQXdEZmlncjlNSUtBZWpFY25FT3pVZ0F3YnlJalJFVzc4RnZyb0hQTjd2MFlHK3E5aWRMNlNlY0NTeEkxRytoSEdid1lONDhZM0czWGxmSEdLeUd1THlFK3dFWDVwcEkxYTh4QmxrS3R0UkIrQnQ2TGRNeDh2NVJsYlpSNGFEUEt2TXYvVkR2enhWNmQvVHYrYy9xa0tBUGpDQUFGM3dPZzNBdUVtQ2huMXVXS0Z1dERHdDFCL0xRejBueVhGNGt2eFJpQ3FaYW5UYm9yZmRCbnYrTWk0MldnZTV5a2lQMFhrcDM5Ty81eitPZjF6WWdDQW92Z21ZTkszUTJ2ekhIRFhnTnltTHZ4anB1SnZnTUNEcVR4bzJKbkYyMEVzM2c1Zzk3TUxyNGNPbFJlVUh0Umh0RGI0T1hROVdzOS9UTGI0M1RIaEl0LytSZHEveXYvN280UU1QZ0dQd1dXNU1kOG4xMk83OFJ6dE1KZjFBcnpPZXc2LzU5QlBweHh1WGRKZWdzaE1DM0FPY0w3dkN3aG9oRzlyOVlYemJUMnZIdHBKMzAxZCt4emZmUi9tK2JjcDl2dVJBTGtQaE5meGw1aDlkOUNjNE55MndyclJ6SlhiNE5uSmFxNmZ1T0lDTzc0MTNTdy9GN1grc1c5ZHUrY296Rk1QTjNtTHNNUjd6aGZtaXZQc3JlQ2R3Y3RGNkxtdlVFb2cyaENyTlVPNk1ZSk4zUE42OGZqZitmWnYrZlluV1QrZndkNjhXdUc0WnlERHlBTG5xR3N3NkFtZFdDR3puOGgycU9lV3N5Ujg2eHUvd3pNR3l4blBkMVp6ZlNlRlo2MzBPYktjdDkrQm5jSHprOC9yLzBxMWoxc0xBT1A5dlo3YlZZZHg2K1pDQmNlRzkvZkc0WTk1dk0za0x0UllHOThjKytEdkI0MFVpZ0dJbTdaUW1JSmJqeXVWSGNibi8xcWUvMk5abEgrRkErcTM4dThhbC93SXNnWitCTTdBazVoeFFkelF5cit3M045cWlIdGhmZ2FsRGNoLzk3bUNEUEF6ajNnS3hrSDFwajVBL2J3eVlwNWNjQ2pwdTlVNVc4LzZVNWxEQlFKcDlYdEdOc3NYTUVaVTM3MkJPZWtEYjFHckt4WjJ1cDN4WEQrTGVHNysrYWoxanovN2hZQW01cnM4aDlDWmxiTEVlODVIZEgzbWtzWEdmVEYzZnU0NFhya1FXSGxJZXg0Smg3K1dIR3NFOTJkaGI5NnZZRnc4M080WTRUbFVOcHdFbnRJRUVRK3Q5YzhYaHdieWZ2WkVyTzhlQ2oreEJ6T3IrYzVxcmgrazhLeVZQa2VXOC9ZbjJGK2Rycmo0VnRscGdNeCt0WVFGQmoxeGQ3MUZhNHo3UTNuSUN5NnM1TlVMTWZBUlY2cmtOZVlLZXUrY3hqTk56T2t1RWthdzJMdFllOENxUFBhZGJOUXpNdGtmeXdIMVoybnZ5Ly83WEg1R1NVbVhRVGVnSVNZekdKbkVDaUR1QkFod3d6QS9Lck9yOHpSQytmUTNuUzJmMmdmZmRoejZtb0JZL1lpelN3NWJiUFk0NzJZVmVNRjUvc3dnZnBiYjd6bHBaMm1NcUw2SGdiOHdZY3dKMWxyQW1MNGE0QWNaelhVekhBN1djM001Nk5ENjU3NDEzSGVKVWw1WjlYSXFZczl4cXF0cWVVUTlPNU5tZmF4N2Z1NDR2QndmV01Gc0V3MC9ub1BRM084RmpINGtkdXc3NE1DZ1VGclNjWi9MWmVnUzZhMGd1VmlWUzJjaEswalRKNmVOdE5ubmtDNTIzY09iWWFYRTBQcjJFV2F6bk8rczV2cHBDczlhNlhOa09XOS9vLzAxWlBDaEVnc0JZYzN0Y1lObHJXbHV1Z2hiNFJiTjdqOTFWVndKR01nb0xXL01vOVhEYnM0VlN5Z3VrdkJPTjRqSHpGSSs3aXlrSW1LYUZkWWVWOWZQV1VGY2VsUDlrRktTdnBXZk9TKy9veG9LajExeDZkZFFiakRtRWw4aDdrSXpHWE11ckxRSXhtSGVsY3FxM2lOUEJCWlFtYUM1WGhTRGc0V2ErSG1uWEhIVnRpVHZoa0RybWpIUDM4aU52ZEorcjBEak1hTDZub0xVMW5tYVcxMS9JNjY0ckxNYW1udkcyazVycmpGZGROS3pwaWZoMjRmV1AvZk5oRi9ObmtFUkxoVjdDdTI1TnJBRFNPaUxlbmJPai9mbDNmTnp4OG5NWWJBeTZJckxjU1BINVVkd3NiNG5lLzB6QUVnY0hrSERHelV1Z2lRbUZsdnFtdk9rc2FJNktpeWNwWDNxYmZlT2tUN2JTeDRGWG9lOHZxMlUyWWFNNS92OWpPYTZJWVZucmZRNXNweTNqMXloUU5zd2ZOK0twSUJaZlcrSmNxeFJVbFdWeXBwSXRJRFovRGNpREtSVnpXc044c2ZYd09pb0VxRUt6bGpWNUxpSXpCcjFZNVVmZlFRZlhKSGZaWG1YN3lVczhMbTByMEdVNUxMODdBMzUzVHVnUVJDbERzWnFZdGVNdEwxZThIcHdhZVVObVFjdHI4d0tjbWdNY0w2bndNaWdaTFBtN0d0dEIzeldWVmVxNHBqazNkUlEzYWQ1VmpmYmVablRTdnE5VFkzSENQVzk2Z295c1R3bnVtNzBGalpLZWZxTkJzcVBPOWVyTWVZYWk0ak13ak5xV3dFTmgzNVhXam83MUxlVjh0dmtiSkdxbmNDZWF5ZGVqWUtBcUdkbmhUeWY4aDQvZHh4dERnUXJNNUR1aTdMRHFyU0c0Y3VQNVRiNnRSR3Z4L0JJcnl1V3hGNk9BWkxPRyttNVhGOURGVTlWV1ZYL3VRNTlEaHZBQzdrYnJKMHhHN0crdFh3NzY1aW9semZyK1Q2VHdWdzNwdkNzbFQ1SGx2UDJPZG0wT2ZtT0ZSVURhbmQyeWNLY0s1YnpuU0MweGZuOFp3R2xzSW9jRzBoZG1Cc3dsaXJKNmVMZmxyL1hCYXcvdzNyeVBjNlcxOVYrTE1PbHBMWW5zcEgwa0xvcEUzN1JGUVNLdnBGLzF4dS9DcEdvZU0wVFkyTmIrdUNXY3Q5Tmp3c1d2UjRicmxScHo2Y2hYMGNDTWpqZnFqcVljN1ppbnhxSVhaam5FQUNJZWpkZEkwOWtMZUE4NnlIOVl3WDlQallham5FOW9tODFoaWp0ckJMWE9WZFFlbHdFRVBDS3draG9lTk9jYXo1RVYyRU5ZR0dkU1NDTTZUdmlYdEYxZ24xZmc1dWpwZmZCKytqSTJFZjlCcTlHUVlDdlhybFBJOS9TM3JmbUpLUnd1VWxnUlJWRDBVUFdBUm9MOXd5NzlhM2NSaStDRy9pUm9TMHk3b3JMcGV1WTJ4NWI4eU1jY0hXdVZENFo2enhzQWdDeWdCZlhHWGxDM0EyVTBGNHkxamV1dzIxWEtwdU4raXBaenZmbndFTkpjNjZmcGZDc2xUNUhWdk4yVHViTXNta1ZsUU51aGNXakJXODJ3U0J1RW1yM1ZmRkNNcDBWNjdJTTVMR092R3JHcTBZOS9yZVc3OVNLY2xyaWxZdUsrQXJzK0FCQXMwenljL25ZZXFEb3JWSlQwMzZBZU9rMStidjdyaUJGMmloOU5JSDczcW9RRmlyZW9veGdkRmRqR1dUVjJ1ZjZDeFlBd1BvRnFBQ28xZVMwV2huMnBjK25Ca2ovTGc0QUNMMWJpekhQZFREUHQyVHpsOVB2TSttVFd5T3dtZThGK3RaMW5UUG00Z0RtYUVmbWVjRVYxNDl2bzdrZVNqRFhCd0J1ZkhPZHBDVDJDTnhRY085aUJVeVVHcjVOSVNkTDhUTzBqOVJ0aWJ3YUJBRStBSEFVRXdBY2VlYUVEOUFCVjF3dllndld6VFo0eU1ZTjd3MXFrU2lINlFLRVJtNGJ0MnVzaGFFRjB0Uis0VHJoOHE2V3VxaDFNR0FGeTBVQWlMNUtvNDlkcWJvbEY5SGFCYnZLYTVBTFo3Rk56V0srRmZSL0RRVG9teW5PZFdNS3oxcnBjMlF4YjllQlk1T29DbVVjQUlBMXZjZGgwK2FnVTY3QUZ5TFRmZTZLcXd0eXJHc1ZEblF0OGF2VjdiVFl5WTZ4ZUhHRHNERk9BZ0E0SlF2VHFUZ1Y1aks1VExGVU1LWTVkVUsvU1E0elRGTjdTYTRkL1FaYVVHZmJDSkd3aHZ4elZ5cUZqSXZ1Q0VEVk9yZ0dGWXp0dzNpVkFnQnJuakhsU0ZQcWt2YmI2a21qczlJOWZYMXJkVWpmWE93QzZFTFF5V0V3ck0zTnhhdU9Jdm8va0RWcXpYV0xLNjFwd1ZVeDE4QndjUEVzTFk2MFNmUFg0OEtGdjdEbXh4cnRvelZ3TVNxdlp0aVZDa2xsQlFEdXVsSzU3MkdZSHl4VHZRZnZQdVB4M2p5Z2RGTGxMZDJqZExwMnc0YnAzQnpDM0tDbkNOMjVJUUF3U1llOTNzaFh3SU1VQWdEUEtDYXMzSTBOV01PNzVQckgvZjdhOEtycU9rbDd2dStEUy9zY1hhb2VwelRYOVNrOGE2WFBrZmE4UFhRRmFmYkxXUUNBNThidGM1a2VjcDF1UVV5bTQrcEZjV3JKYTkzMkRlQWFMTUlHV0hlRmV0eWgyLytMQkFCZ0FGTHBVS2dtbEFwenpZaVhZcG9OcCtnbE9jdzRUWTJycXVGTmJoV0laRDV5WXpPQU9TeUd0QXNIMHFiTW8vYTE0SXJMN3I1SkFRQllxVzg0ejAyd3VKTUNnRzVQeXBpVjd1bnIrMDNFWEtnQmZVUHVhS3k3WU5WYVdJODUxL2h6MWx3enVPRFMxdnNVQnRERGx0MzJhNjYwNWppRGN5Nzl2ZTZLU3puLzdJckxnRy9JTzh3NVcwbzZLd0J3eXhVWExNT1k5eVI0RnJmSlNMUDN4a3JwdkFJWk5KeG4vZElUcno4dzR2VE1GWGxHZlQrbEN4ZnUwUjBJUFczVCt2RnhtRjRZRndjdWdiNEJmSlo1VjF3ZWVSOXVzK3dwU25PK05lU3F1aEdYSUJUMUVMekZsYzcxNHhTZXRkTG5TSFBlTEFHOTFBRkFBNkJTS3k3RkxrZXNyNDRwS1ZpL21DdnBjWjl2RFBjVGF0UWo4VytmRExFRlJPSUFnSEVqbFc3VWhiWGo3OEFpYlloSXMrRVV2Ymp1YkU1VHd6RE1BZjN1TktSSld1bU5QdmNpdXB5VVFEWUp6ejBINE95d1FnQVFsWExVVFNBZ0NRRFFIUFZSVDNvWnowZFUzendYRThhR1A2RG5HSVlOcWdjWVZsczhDTXcxRWp0RGM5MElCL1N3NTF2aW5zVDl0UWZqVzNzVzJjMXE1R2JBeFptRDkyYTNNZDRvbDhsMXFkeWdyQURBVFFxWnRSQkRXOE9MZkpqeXdkWmxnRkNyYjlSVllHQ2VnOHNMTXZXdGJCRmYzMzJVY2JFR2ZDaXRvcmtDQU02NmVGbmVoQTM0WG5ocG1vRDlQZzlBNFNqQUZibEw2Y25sekRmcWlDZ0l3TU8vM2hWWGNLeGtyaDlVK0t6dHpsL2lPdTV6cERGdnI1d3RvWDh2Q3dEQUtRdGp4bzNEdWsxMGdkdEY4eFpWdlFoZFU1WjdraGZuT09SRm9qSExnYnZVWjlUYVl3SUFYMHJXbFBOWGozdEE4U21NbDQ0QldGRmt2UWczOURnQXdKZW10a1J6cGFWN1E2bU5qYTYwcHJubEVrWUNaYjl4Z0ZVQ0FFS3BiNU9FbG5YREpBRUFnM0JnemNWSTk0emI5ekFBT2o1TVg4UEdtZ0cyYjd1UmZlSzdvV1AvY2VhNlBvWTNCOTNEMHdSQStGc1AwVTBKT1FaVHROOWV4d2lON0FXNFFWbHlBSjY0WXFFaDFENllnTVBVeW1LYWNBWGREQWFoY2Z1ZU4vcWVUYWx2OVE1aDMzT1FpbXIxemFtYnVOOHR6MjIvWVJ1UWtHWjVYRkFoVWdINFNNejVSaDBIQkFGeCt2Yk45VlJFMzA4b2Y3OGY0dmkrWjhWTUFzdERZejBIcHNaakRuL1V1NDFIUEl2YXlVRVB4eVoxQU1DNXFkYU5nK09KU0x6ZzhyNC9BQ1ArbGNjOWlXNVZaaklqMjNJZkNESnZDSWpnd1JRRkFLSlNza0lsZlZrbERmVVNGaUZjb1dsNjYvQkJvd0JBS0UyTkFVQ2MxRWJMSVBoUS9vRGhMYWdVQUN4SHBCeGh2S3dMYmtOeEFjQVl6UHRhakRsSkdsN285eHhjUGpLcGI5MVpONm9rYy8wa3dPZllwdDliSU1CK1pPd1RMUGZjNUFINzJ3UVVNWFF4VDZHUjF3RnVVRllBd0ZMUTA5aXFjaGN3aFZrNUN5dXVVRHA3MmdDaHo5N2l2bjFyOE1nZ0VQWWJYbDVPUzhQd3FsVmNUUUU0bHVmMlBUZnFPT0JCL1N6anZsRUlMV2xLYWl1RjM1TDhYZ09sRVVhOTJ3cTltNTRaQ3dTZ0VBUTBaQUVBdUg0ODN6aHl0T0ZuZ1pDaXJsYVVCUDNSZzZMV3lYaXd5MlBFWUZ2dUdMRlBSTFVhajQwQ0FGRXBXWWpxQm1CQk5WSXE0d0M1VE5lTkZMMDlHV3V6REFDQWFXcHFORi9UL3d1bE5vWU1na1VvU2hNQWhPWjVtMGd6SStDU2pudElJNHBmcDFTM3paUUFnQVZZZldSUzY2RGpueTkzcmg4YVdRWldoczRXeEhkOUlic1JJb2t5ZDJIQjJKdXJnZERJdG5IRFJLOWdWZ0NnemlCV3NZak9GcmhWZDhtZHZ1b2hiYlc4eFgxM0pGaXpyMXkwTU0wRVhJSWVPN3U4T2dMd3pZam5Yb0NEK2hXUTliTHNHNFhaa3Fha3RsYndlNDJ1dUlwbk9lKzJCWmVaT1ZkYTd2MUZGZ0RnYnNTTll3dFNSdmp3N1hiRmtxQ3FyR2ZGVWRod29UZGh5Q0RFSUN1V2I4TnN1RU1BWUpzTzUxMGcxM0VxREI5T1RiUjVSNHhENkJEQUNjWkw5NHlZYlJ3QWdJZm5FZlM5RDlrUVNRRUFHNFFzQU1BMkhmcjREb2R3c0RBcExlNGhqYkhTSER3bnh2TExEUUhFV1VkeEFNQnVTbk45ajRoUlZwNC9laWFXS0lXVGRRSXdkaHppTGh3WW5yNytRQzd6Sm93em1ERUFRS002YUxDcWQ0bTdnTHlGZlVqYlduU2xDcHB2YTk5eDVwcEJZRWlhRnQzT2RVWTYzQXpZdmgyeWRheWxzUTBIOVNROWQ1Wjl4d0VBUjJVQ2dLTVlBQ0RKdS9HWmNRQ1hSd1FCcU1LYk9nQkExcUtQdUxkSE40NXA0MmFCdVo0dEhnQndRREh0U1hDUE1QbEt4L0lSNHVJWTdnUEk1MGJYdnhxeEF3L0hZUkJjMUMzRzVzVkR5T29mYjhLSENRREFHdldCb0dmZEZTdjN6VVFBQUJWMTJ2RzRCTk1DQUsrQk9HYk5NN0xkcmJTME9JYzBIdjZjR2JJQ29hVGhoQ1RBdEFDQUx3UlE3bHpmY2JhODlJd256cnRpOEhWUUtmQWxlT3JhUEFjdmU5andWbytlUEhZYk02QkxZang3RXdDQTU0RzB5MzFnVkdzNjhTYUVEdzhKaFBMY3ZLMTlkd1RDckR1ZU5ZdHFnWlBVVUpiV1N1TmVJTnUzUzF5UkRYaXZBeUxDWWlncXk3NXJEUURpdkp2RnNkbWt2OThrdnB0NmNGSUhBTmZweHRGSnNWQXJ0amhueEJheFFGQ0x4K0FkR0c3OFlYQnZycnRpb1p2NUNnRUFDallzdVdMTmQ0eDdIdEJoZzdLYm9SVEpBMENqcUxPOVJLUXEzM09qeDJXYWZ0OGlBV0s5QkU0WjhaRUFkeWpmTjIwT3dNOXdFMStsZVY1MnBjSTBUS2FMYzBndkdJZS9kUXQ0QmU3UnhoUTVBRHNKT0FCSEtjejF6UUFvWDRRUTJRRzREWGNqUUxxbVNma2tmNjNuN2pmU21OaHRQRWx1eWlqanlmTVlGd0Q0bERiUkc3SU9sd1pOS1dZOWpRM0RhL0cyOWgwVjh1TXdGQXZUTEVKYm9NUEc0b3B3RHZzR2NVVVdQWG51ckRHUVpkKzFCZ0J4M20wVGVGSHpGQTVpRzhJZTk5UUJBQmEwc1lRbDJMMW9UVG9YQ0dwSllQQW1DR2d3dzdnU0FMQkxPWnNUd01KY29IeHNpK1BRWVFDaU5TT3V2a0FwY0poV0ZTVnEwdzJwYmVQR2ZMSEhaQnl5SmxnMEl1VGV0YklBQmxMSUFuaE43djFwbUlmNUdHUzZPSWMwZ2pXOEVWbHhRTXdKVGdJQWZGa0FoM1NvSWpoa3d1VzJKK05pS0dFV3dEVWdFM0Zlc3BYdnZ3a2hycWd3WFJ6eUlndlB2QXk0alljSWVNVU5qWXdhclBRUUFQQko2T2JnQm8xcGtaT0cvVHJ3N01PM3RlODJJOU5xMnhPeUhUTDJPM29jZkdKVUZsY0UwMXl0RkVQbWpySEhNc3UrYXcwQTRyNGJjMnhtaUhoL1lIQjVlck1BQUZnV0ZLVWxMUUlmdmtDb1FGQWNBTERnZVhHZW9Fb0FBTWRpQjRDVU1Sc2pGL2FsaDh6b3k3VWVnQ3lCdUVKQWJmQU9RekVBZ0lvTllhMTBUUkZwOFJpYnZRREJDM1VBdGwzbE9nQWpBR2ppdU5MamtBdTM0ZnZ2R0lSQ1pnSS9pY2laUGFRMFZKd0xEa1h0ZTNnbnJTNmU1a0tvZjk5YyswQzVUNmdMUlVWOHFwMUsxSTBUSnVMdjN1T0tLOHl4MjNnSTBxRjh4dk5uNDFBYUE0TGhTZ1FBaUVyUFdvV01DRXdQamJNUDM5YStRMnZ3SU1ZYTF6Q285ZDNabStpN1RNd1piZGtUa2hxclF0KzFCZ0NoZDlzenZOLzludkR5a1lkTGxEb0F1T0FLNGdWUG5DMXh1bUlneTFDQklKL2NwY1VCd1BoSWppWW9UUUNnQjA0by9tbTUyYUs0REpZYk9TNEFxSE1GTmNEdUJBQkEzWC9OZE9CWjZvdXI0RHBIOTlNaXVkWlVDZkJuVjdrU1lGK0tBR0NMdUFickJpdWFjNEh2aXhzOXRGbDJEVGNqS3dHR1V1cWFBd1M5MXduNnQrWWFOZEtqaExxT1BHRXMxQ3ZBVkYwclRMVHRBZWNEcmxSbmZwRWFLM09HQUFCbkxzelJuSVRXSDVOeFZZTmpGdHpaeTVRNmhsVkdRL3Z3YmUzYnB4VVJXb09MTk44TVZ2VlNGd2NvaGhyelZQQmJadGwzclFGQTZOMHN3UExTK2ZWRWRoUFk0YklCd0RsWHFNZjhLR2I2VVZTQm9PYVlCNmVWODQ4MzZpbkRGYlpwTUp6TEFRQnhEMW9MWVROU3haOVBBZ0RRNjVJVUFLaFkwV000OEh6YTRDeFJ1K1VLbWdXYnJpQTlHdEtucndVQTBPZDZRM0YvVkVkRElRNlVHNzBTc1ZuMmlXaUU1TXRkQUlXczFZM0VWOTdzUzhSNUNQVWZtdXNyNHBYajJ1TDlIdThWMzY2WnlLcnUveHVCVzJOVUZnRHlEOVJ0dkpFZ0MrQm5GMTBmWVQ5R0ZvQlAzRVhYY1k1U1JIZkJlK25iaDI5cjMxYm1GaGNSNHpXNFNXczhaNFFLZXFoZjNzZjd4bk5hemZjdHMreTcxZ0RBa3ZET3ViQ2VTRThLWEt5eUFjQnhBWitMcmxDd3drby9TbG9naURVRkZnekR2dXpzbkg4MTdwYTZsZS9RVFhMZ0pEMW80NFl5QnNvQUFQY3JCQUNxTkhaRERvMm82bUI3UUVyRTFFSmszUjZlRUFEd014aS9mVHFRbHltczAwM3VmNjNqRVBYTU9VcS93bXFBKzVSbE1BRXg5VllpNk9FK1VjSVBWM0ZNTXRkYWxFYXJUcko2SDdzV2ZSeVdUZ0JHcXRQaDI1dTdFV0dpR2NOVm13UUF2QUdRZVFDR2ZNL0ZxNUJvMVN6QnpCQ3N0SWpsVVhmZzcwTUg2ZHZZdDI4Titxb0I3aHNwWnhzQWNPTjRjdDVBbjNHYUR3QmsxZmRKQVFCeFVqTjdJUVJjTXdCd3JOMS9YdUtPdnZTanBBV0NtUGxxQ2FWZzNXdXNjYTd1UzUrQ29PV09yWVVINENBRkQwQmFBT0NhaEhLZUFLK0E2NE9yMjQrRmk3QTIrRWtDQVA4T2NXMTBtZk5hWVhFVUphUGVpZkhNbkxLSkFsR2JScFlCNmtNOGRjVVY5VkRnWmNVejE3bVljMjBWcFdsMy91SkRQcStjcGRUWlJEbks2SVZEenhhR2liaUlVU2pkTU1vQWJzRk5sd1c1TmlrVTZPTUFvSExtanBFMnB1NzBaWGp1dUhINnQ2bHZhdzNpZnRlODh4d0JyeHhrajFqU3RtMHVXdWhxTTBHTEF3RFM2dnVrQVlDNEhnQUc5bFVEQU1mVis4NjYveFR3aVJ0M2pDb1E1TXRKWjViMGxyTXIvWTFDNkdIRElMRlp1YTF4RDV5UWZ2dG1RZzZBVmF6bXBBQUEvWFlxUVRrTGpIcDBTYXRVNzNKS0pNQzBBTUJyU3BGaUxnRFg0c2I4ZitXaUpKVXZSb2xvbGh4RnBydktmcUptL3lzQUFUalhhOFpjUjIxeUpmKzFBZ212enhWSzkrTGUySS9KeTlGYUhZMmVQR1d1QmJBTllTSUVTb2VRcHJWa3BCdkdNWjdXZkxNMitncUJDOTRqR0paaytXS05zYys0K0VXNTNzYStjUTFpdXVZRThEVld3Rzd2d0RyVU1UVnJCMlhRbTJKbWl5ekdiSnhpbUdYZko0a0RFS1hHMms4WDJMaWszRlFCd09mNTlxMzdUd25mYTBiY3Nad0NRY3dqNFB6bEkxY3NiYnRHeEQvVnlGNDFEbWlySGtIY0xJQkJZT2x6V01QSzNjNDZDeUJ0QU5CQVdSeW9Rb1cxM09lcHpjWElpS2dWQ1hBSmJrMm8yeERpQXlnWk1Ha0JJNXdQVFJzZDltUVozS1dER2xQbHhsMXhvU2pzZDhZbEt3YWtmWTZDWjJ5V0FEVURZeXN6Uit2ZVk0aVBsY3F3R3VDaDRUYldHeXVHWWNxcEJzanpQUXNnRlE5QlZIbHJEZHlVR0FEcEpXSWlBWnYrYmV4YlBiWmFhNkFUc29uR3lHdTVDMTZvVGNOdWNTRTBINW5Oa21TM21xNzlHVmNxTXBSbDM3VUdBS0hVekQzd1hqTEhoa21jYjV3dDM1NDZBUGdrMzc1eS8xbkU1NHBNWUtVRmduejFuZEhWZUFTSG05NjRGb0dsdW1ha2Y2MTZBRWNjSFFBdHNHQ2xIbHE4QnA4T2dDWDRzZ0FIeHFUUmY3VUF3RE5QdkhIZEZRc2k2VUdrRzRrNUFqdGxIdFJaQVlBcHloYUp5d2RJVXNJWTI1Z3I2Q1JZSlUyMStpV1dlZFhiZWkva1c0OFpmY2VKOHpHWlU5ZlVETnpzMXNHbysvWWhhbk5jRWNJdmdoYjBFczFDYkJyRElqL0R3YkVGSGhtVVh1NEZ3QkhYZUZyelBVb05OUVo4SWxkSGRHaG90YmhwaW9jbk9hVGZscjV2QUZjRVFRQjdkMWJodSs1N0RoWXVoZDVxa05QWSs0bWxoa2NoVFJSREVGZ3hFWFZqc3VyN0pLUUJScVVIV3h5YldlT2JiN3RTT2VmVUFjQ0grZmFsKzg4eXZoZkJzRlZTSU9peHg0aWhvdHNSdUJzMU5yZ0pvUUc4aVhENkY4ZGpvNVFBZGJGb0tnd3I5ZTBITWhzNEIzdkpsVXBTb3RJZ3hrdWpsQURUQmdDK3hidEQ4ZlJWU0QxYWd4dkNhdzlLN1RrQkFBREZsVUo4QUhUVkp4VUMwdlpLdm5rWEdNWm5ScGJCVFlyWE4wT3N2bGY2d1g3akVuMHNEczBLZkxOMStxWnhTM1YvQjBUZkptSWdqNEhyZWRuNGJ1ZzJ0cXFWNlhoSmpDZlBkeDgxWFhldEVUZHBWdVRFQ251YjRIVzBSSjE2M3VLK0x4c2dBRzMyR0FBS0ZPWHlDVDZwcFB2ZEdMWWZhNmpNZytkbUFRNnlIS1Fob25jcXk3NXJEUUNpMG9QM0FoeWJEY3JXUWpzY1ZUK21iQUR3dDN6N0RNaUFQN25LQ3dROU1jZ3BVOFFqMklVYjUydGlkMktCblIyNnhZKzU0bkt5RFJFcEpYeDdZZDFsRkpleFlxZ3RCdmtLU1R5VjFBTElDZ0J3V3RBR2NEZjJpV21jZ3dXMFovQXhORTVWYXdBdzdvcEZkQ3crQUpQMWtrb0JxOVoyaHh5T0xiS09HeURkOHBZUVppOEFDRkFEWE84S0ZmZmE0Qms2RXpKOWZmS3hPMEFzUkYwSFh5RXJkUCtmbHoxKzJ4WFhLKzl3aFhybG8zQWI4WDAzZExsYTljcVRHaytkbnpZQTNOcGE1UmtibmEwdHNrRnBvcmdQTjRsbC96cndERzlyMytjQkJEeHdkckduUlk4SHdGSTlWUUJ3MnhYckY0UlNETFZVK1NxQTB5MElrMXFlMVN6N3JqVUFzQWowU3hUKzluRnNkdUVzMUF5a3VIYTRiQUR3bDN6N1dNaUE1MlJCVlZvZ2lCVUZ4OEY5ampuL0czUUkrWmpZZVBnalUvVzVHTG5RZ2JNRno4cXBYcFozSVdrMVFLemNoZjN2VVNwT05RQUFjaThHNGRCVWo4YzJzTVlQS1VVb0I4aDBIckk3MUJOU2F3QXdGQUJncUI2SjZYcSt2ZzhDaEswbUlMTFd5L3A2S0FmcERUbjhmNVRiOUFYSTJiOGpSdmlKL040ejZhZkp4YXVORVFjQWNCVkxyb1E0UU1ENG9lemx5N0szejhoYXVTTnUzZ1k1WU50ZG9SeHluUHpsZnNnVng4UC9Yc0I0SGdTTVo1UE1GN2RHV2VPUEF5SEZMV2RYemp5QUc5ZVdDOWNqZUZ2N1B2YmFxbWdVbDVCbW9TZmtBRENCa3pOR2JyblNLb1pXaWlGV1FVVWRBeXpDWmxVeXpMTHZXZ09BQnVQc2k1T0t6ZDk5TllFZHh2VFJ4QURnVC9uMmdaQUJ2eFBqZHQxVlZpQ293ZVA2Mm9SYnZjYjlWd3hXOEpyQnhCNkZ3MStacW5WaWRLMERKd2ZqYkVha3Z5SEFZQ1BhU0IrVWF6dHZlOUxJTmx5eHdtRTVBQ0FIQjNNY0FGQUh0N3BlSUtRcHFYSUZYUDViRUhaWkozNEFGdGZwQkpheGIrSEZBUUM1QkFEQTErK0lLeTRjbGFNNXNtNlgzRGVtRUZrQVFBLzlSN0syN29wQnZDWUg2WGt4dkYvS2Zqa3ZSdmduTWNSMzVmY2VnVmVneFJNWDlLVXkrUURBRm9UTE5weGRDYkhEeVAxWHdQS0ZQT3QxK2J0SDhudysxamZtbzF2cFN5L0FPNko2RkpieHhIZTFqS2ZHbmJrOWxEMXl4eE5TMUpUTFRkaURCd0RBYzNDTHpCSHBHRytOYjJ2ZjMwSFk5b0Z4WVVOYnN1VkovV043cHhralVTbUduT1o2UUplSkxiaThjYnB1bG4xSEFRQmMwMGtBUU5UdktRRGdkd3VsWXVONzRhVlg5elZtSUZsMldFT0RtRDFURkxxTkF3QituMi92NWR1bitmWTFhQUxFS1JEa3F3dmU0RUdpZU1ndlFteDN6bUNtejRMclYrT0YzV0I0Nm1YQ2J4UHJjc21Za0ZENjI0TGhYV2dINzhJVGNPdjBBR2xxQm1JM3ZqU3laVmVxK1QwWkFRQ1F1SU9OeTY2K01BQ0EzdXFhWVFFT2dtdFhZN3c2SjB2QWpXRG1lNml5bnJYd0ZnaXQrcjdIa3ZNWHQ0anF0OS9JYlBBdWZsY3FhYjFBS1VSelJ0eGM1L1NXR01KcmNzdi9VVzdSMzhyaC80a2NxTjlJR3UwRkFRZy95ZS9kQWhETk1jK29TbXpQUGMrdWEyb0pNanE0RW1JejNmNnZDTUgzSzNubUgrUTVyOHZCK2hCU0Ezdkp5NFZsZnhlTkc2T1NETlU3Y3Rsd2YvS2N6OU1ld0lQbkZyV2I4cHhYQXltWDg3UUhFVlN0VXFybkd1eDdkSCsvclgxL0N4ZTIrK1I1eGZUdFpWZzN5cDduMUwvbkJCb2ZnaTN4cFJpdUdnQVAwd3puNFlCV2dtNWJ4bjB6QU9Bd0E2OXBMbXBYN3UvcEdvNlRtcmxLMzN6RFNEK2VkS1YxVGhvOTVHRE1ucG5HaTJ3Y0FQQ2JmUHR6dm4wa2h1MnNpMWNnS0ZRWEhBKzFRWGg1UE9CbklPMWwzR2lqd01UV3dqZHRncTcwOEw4aml4VmRTZGFFVEh2UzN6U05oTDBMbUV2K0FPS2w3VWE4ZENhUTFtUTl5eWlrMWQxenBWS3ZvMFpLMUN5Z1FZN3gzb0VZNzEwREJQUUFBVzBVTWhXbW9Da2JkUVNZNzUyVTloWm40WTBDVVBOOUR6VSttQktVdE44eHp4eE5reGVIbWU2Y1RqUnUzSnd4Ym41SkR2WnpjdHY2U2p4bEh3dG8va2o0TTErSk1UNG5QMytSdURRWVJvcFRpNzNSOCt4VHNKNm5YS0VRajFVSjBicjlmeWlBNVFmYTR3Mkdsd3ZId3ZGOE4wYjFqbkFhNmdTOTU0UXJyV1Q1RklEc1pXaVg1UG5QZTFJdWh5R3JaNDdBQm9KYUxyUXpTeW1HYjJ2ZjM3amlXaTZjdmozaWlrczRUd0dyZnRCSS9VT0M2OTBZS1lhemNLRkFnRGNIUk5FUjJMdHF2N1BzMndxSHFDMmFOdFkwZWcrYUsvaTlPdkJXaGQ1dE92QnVmT2w5NVVycm5GanB3ZGpVaHYvOUxJc0RBSDZkYjMvSXQvZkZtSDNyL0FXQzR0WUZmMHEvTTJTa1JJMENrYWpmYUsva0picUFrUFZNSmhvUC8wdDAyeDB4SnNTWGtqVUtOMHVmZDRGSlV4Z3ZIZklBR0FVdi9DekR0R0RSeTZMaVBmMmVsS2hoQXcwK3BCU3Y2d1FDWGtpL0wxMUJUR1pBbmh1YlZoanNJK1o3bzN6Lyt6RVdIcjViMVBkZzR4TzNYd1JnSTFHTG41anVXblVMMndCNElabzljZk52NVlEL1FtN1F4K0d5djhxZStZdjg5eWNDRE02SVViYTROTTJVSnNqUDBnL1BYV2M4TzVmaUhZTGZZYkIyRHc3bGMzRDdmODhWZEQvNDRIaE84enRzdEFGWHFyVndGenhRMzdwaUlhcFh4cnRpYWlVcU45NldtLzRQY2drNUs2R1c3MlJPNzFIS3BRcW82Qm9iTjRER0dLeVRNV3JvTlhsYis3YlN0N0gyQUpkd0hnS2IyMjJrL3VsbDRzZUlGRU8wVWRiemo4TStWNXZTQm1IYkxQdm04SFVIcGVaYWU2Z2JPQkRsL3Q1am1UL2Z1M0Y2OElSeEdSbWpTMjhuSGY0UG5DMFFocTBYenN3WGNRREF2K1RiNzhTb2ZTeUxDZ3NFSWJFaGJsMXcvQjE5ZWV1QTd3WmlBN2NPbWR4bW1ZQjZPSXh1dytGL0RtNjczVVk2VWE4bkphc2ZVbzFDM29WcjRDclZlS2x1NUc0UGdQR2xOZlhTZ3IxQmFWbHRrRUptcFVSeFB2bzlXZkNhNG5XWlFJRHF5S3VjYkFjOE43WXVtWE9MK1g3UEZRb054Vmw0YlRHK1J6ZWwxOFh0OXdXbDJRVVhQM3l2TnVtL2k5cExWNmlxMkJpNE9YOHN0K2YzeEZ2Mk93SE92eE1PelhzQ0JENlduMWN1elRXNjdXaWE0RXZqV1RwaFhUdzBucjFiNWtkYk56ei9Dd0pyTjJYL25wZEQrWE41dmorN2d1NEg3bkgyY25YUldEMEV4bDhZTjBZRkduV3dSM3h6M2dHQS9nbXRZK1ZYZkNseitibUVKekhsOHBrcmlBN2hIbVNnMFE5N254dVcwMzViKzhiMDdldmdVWHhPTmdyWGpBTDhWdGpuR3NhNUxqYjFyQ2ZGOEFXczM1NEF3T3Nua0tFMlN5OXZXZlo5RmNBUWVrSjlhL29sQVloeWYwLzNuUzgxazlPREI0d0xBSDVmdEV2L2xYNzhxN1QvNUR2OXAzejdOekZrSDNvTUdDNWV5eGoxQU91NnhXUDByQU8rRlpqMjNKN0w3K3ZCcjRTc20vS1JMNHJSK2ZwWHAzOU8vNXorT2Yxeit1ZjB6K21meEFEZzN5QVRBUFVBcnNMdDRDbmRKSzJHTi9XSDRFNnF0STlyZERQNFdMUUwzc3ZvbVpVVG9XRG9ld0pEaWhEMWxzUDV5MjBDZ2hDVjNvYmNjYjJSSFlkYy9waHYvd3JQMnV6Smg3WmFtNHpmQXUraGFQRWhFYlBPbHpFRzl2OUNmcmZCNkYvVDRyNFhGM2c1N3hKNmhoYjZSbG4xWDBlcGZacmZ6NTZVRmxmUXZQZDVyVnJnVmw1bkVPWGlmQTkrdGdmR2phblY4MTZZUC85WTl2bC96N2QvbHYxZXlmb3U2Yi9NZDRuekhWdkp1MUhPT0tyYm9Eb0luOG5lKzRONGNmNGgzLzZmbU0vVDV2eWlVRDlSdVBDNVBFdWNkeXRuRGg5VzhMMitKUTJCdTlKZkhheXRGa1BMd2xyblRSRjI1OXNLOXF4bGc3QUVPbnFDSzdXaEwyUnVHeUxlNVNLY2EvY2gwMGZIYnZYWWh3NzZGcUYzU2ZvOUh5UmRQd2dBL2lDSHFib0drUVI0UDhLbEZNYzllSytDUHZEdzFBL3doYmdFTmU2YTlqUC9IdWJqYTRpeGNUdzM1T0x1Q3JpSHpzcEIrWkhFa0g5THoycTV3ZnM4N201MEJiTmI3ekhGZ3BPTzBXdTRta1BDT0FvQ3lubVgwRFB3TjhxaWYvMVdlUGh6UlQ1MHhhTjdGc00rcnlERTBRa2J0Wnp2WWEyalJ4Ulg3UGE4RjNyakdtV2YvMDhJOTFXeXZrdjZML05kNG54SDVqZVVNNDRxSWFwciswdlplMzhXTVBUUEFvN2lQbzh2REhmVEUwcnBqZk9OeW55M2NyL1hlY05WM1VDaG0yNVA2QlRYZVZjTXUzTytnajJMZGhyZDRoWVhMQTBiMmg3alhSVG9QWUNMUVRPRkwvbzg4OVpIWS9uZUplbjNmSnAwL2JBUTBFZmsrdjhKMkl6UEFxU1NPQVNoS0dLS3J3OXJBNThEVXBBeXI3OVArWm4vR05CRjRCelB3UmhFUHlTSW9DTGJwK0xKK0FNOHE0OEFPT29odkNuM1lzQWc5alRTQWs0NkJoTmVvcVJ4MWNOUnpydUUzcEcvVVpyOTg3ZTY0b25aZGhJWmJ3UklXYWhuUHdZRXBWZk9MNVlUNTNzTUJ3aEt5Q3kyU0paRGtNbnhRdmI1LzhxMy85Y2cvT3J0UCs3Nkx1bS96SGVKOHgySEtMMnhuSEVlRThId2F3RS9meFh3L2IvejdYL0VmQjZMaUtzRXhydEd5bkNJckZycEhENnY0SHY1NHRRZFFONGNES3h6Zlo3QkdIYm5jZ1Y3ZGhqRzZZL0lCcXVHRGIwTVhoN2tiYjBFbmh2YUI2NTNNVUwyMUhxWDIyVjh6OGFrNndjQndQdmdSdi9CSUFZaFMzdkVrd0VRU2hHS1NrM2hQZ1k5aDZlbUNGMlVRL1FITVY2WFVuN211TXFJb2JSRFg0cklEUWhuYUZyV24xeXgwdUNVa2Q0MjYwbDVzMUo3TEhuV3UyV01nZGtkbkNMNDBtQ25LdkdzbkhjSlBjTVk1ZW1uM1QrbVpkNElzTGFISVBWekdsS3pzTkxmTE14WnBkK0RuKzJGS3kzbE8rRkpzOFRpS01jLy85L0UxZjFyQUxqcS9yL2tFWklKcFhGeS8wbmZSZWUxUC9BN1hBMnd2Y3c1ZTBwYUdRcSszeE52My84UjcwaWNkY1hDTE5pL2xUTHRTMWV0ZEE2N1lEMlY4NzJ1QjFMeEJtbWR6d2JXT2FjVVd1djhXZ1Y3Rm0zUUdCeGlQWWFudUZJYk9rNFpTcDBHY0w4T04vOG1JM05MaTMzTmtIMllnL1RGS0cyYkIyVjh6NmFrZXdNQmdCNTI2a1puTnFubWFROFp3aEpSSWlFUFk0aFRZQjh6eHVHSnlPZ1d4SjJ2eU9LNktYK1gxalAvelpYV1JyamovTFVSbGp4aU5QaUI4S1p3aFZLei91cEtTdzZ2eG1pV3VJZFZvRVZUMjVLT2dZSXpsa2hRbCtFS3ZWSG11L2dhQy91MHB0dy9Dek5oRHE4dmIxdlgwcW9yRm9CYWczbnpGY3pCdExlbzkrQm5hM0dsQWtHenJsUnNpb3VqZEVpTSt4K0ZiNkprM3krQjdYM0xGVmNBRFFrNVdmMG5mUmVjVjYwUndyK2pFc2RZanJxY09kT0NTTmZsd3ZDdDdPKy9FUUNJczY2NC8xYllYejdSdEVYUDNrbzZoeXhWM2dtaHFhVGZDMW55ZVBnbldlZVdxQkRiSGJWNTVlNVpGcjNDU3lLRGdFcHM2Q0s5aTIvUDRqbWdoNy9xWFV5NWdzQVhDaml4YlZCN0dsSzNUZm85WHlUZEd3Z0FNQzlZRDd0SGhDNVIwMWhMK3FvS29GYXpZcGxRMVpVT1NhR2l2Q0tXeFJ4MnhTVkduOG9HZXdSaUM1YnNhaHJQSEZVZGtTY2E1WDUzWEVHdGF4UnVDazJlbkdrbEpDRTRXblFGaWRCUXd3cUtLT09MaHc3T1g1SXhkbHl4NUd5VVFoVjZhc3A1Rjk4eldKS2JhZlZ2U1RPemlwZWwzSWJGbm5hcCtVcm1EcFBScm90NEQxK2RBcDlNS2I2WFZlVXRDUUN3SklHaitrLzZMbjAwcjFvakJMKzlGdWRDQUZET25NVUZBRkhyU211ZVlHbFdWQXkxWk5OUlVybVNPZVJTNkhpNUtPZDczYWQ4ZHp6ODUxeWhkZ2l1OHoxWTUyb2JVRmFZN2M0TDhIeVdhOS9ZQmxrMVlmUWJaR1ZETytsZFVEUUxoZHNVeEdKOUc1VXlWdHV3RGUrQ0NyUUQ1UFZPK2oyYmsrNE5CQUJmeTQzMGtrRms2WVRiQmxjMXdpcDZDODZ1UmE2eEVrc0tGYXU2Y1oza2NWZGMyLzA1c055VkRLV0ZWeHFBSUpUR00zL2lFZGg0QnU3WFlWZGE2L21OSzY2T3FFVnBPQ1J5MHlBa1dSL3Z3QlZLR2x0Tml4bGhJUjg4ZERpMGtYUU1xLzhWbUxjUmlzK3ErNnFjZDdGYUVnQlFUdi9XZ1dIcGVLTjJ1eFpuMFdxVlhHQksvOSt1OFQzUWFEOEx2TWRoR1FCZ0Y5WmZWZ0FnMUgrU2QrSERCZ3ZqYUhWSExNNDFDb2RLT1hOV0NRRFFkWVUxVCtiQlB1SGF4OHVIVlRqdFRabHpxRlZOZlZVNnkvbGVqOG1lRFpKZDFzTURpNlpocGRZaitYY3N5WXVGdUhvb2hGdnVudFZ4OXB4ZEZSWnRYQlkyZE1oNEYxOXhPSzBMZ3dXN0RzQTJITUpZMjhZYTErLzVvb3p2Mlp4MGJ5QUEwTVAvbWl2Vi8rOGhJNmkzRGF4RHZ1aUplOWU3WXBFYlJwcG9WTEY2M3BJcjFrWFhGSW9PRUlOcEJDWXhwbVYxVlBqTWplQVJ3ZFFvNWpFd3VuL3RDcVU5ZGJJeHZOQnVFSkxPQy9qNk5PTGpiYnZpWWg1YjRNM1loVTNxS3czYkh1UEFzY2F3U2dWdnUrSXFWUmlmMVp0UTBuRkNMUWtBS0tkL1BqQjhsYnk0ZXBzV3RFS2RjcDJ6UGZvZWJMVDFScEUyQVBnNVlDRCtRZlErVGdJQUdESU9HeldhV2dkKzBiZ2R0ZFlJQVB4SHZ2MWZWNmhndW1SY0hKNDV1OFF0bGs3L2o0aHZGQnIvQ0M0WEdCYnJvekhqZnE4NlYxcWxjTVlWVjZ6RFE1NzNEVlpCWmJzOVJvZFpYWmw3ZGh0dTBZY3V1bkpydVRiVWVoZmZubjNxYkZsOHJFNktsVHF4eERQT0cxOUVKd2xzVkJVQTZPRi9CMjdzVmduTFpUaXNMWlNPR3hWZHdxaHcxMGR1MVFWdy8rRUJqWk9DS2xnOUVKZXgrbjFWeGpOenYyZkFNTjUweFZycDNjUmpXSWRET0FjM0dLeFJ6WnZoSGhpajd3Und4UGw0MkpiQkhiME5JSUFyTS9aRENDTEpHTXNReDlvRUFJVjFxdEZUMHdYR051bTdoSm9WYzAyei8zbnkxTVN0NWIwSllSSFY4dFpZSFJwUTlBaVY4eDVwQVlCZlM4cmJiMDRBQU1BUzFUeFhHK0JTdGtwLzF3SUEvT3dLSlh1eEt1SVlrUUd0ZzJFTjV1Nm9BZ0R3SDNCb3JOSzY3U25qZXpHWmxPM1pFWGdkMWlBV2p3V0tFQkJiNnh5OXF1WHNXZVVmck5QaGl1RWg5SFNXWTBOWFk3NEw4ajNRQzh4VmJnL0JVNkh4L2dXd0QydGdyeFdZckJoZ282b0F3Sks2YlRNNjNJQ1lnZytsV3lsUEdKUEh0Skl4SUFDdEFSclRBMmFHZm5hVWlDYWhmdU04czY5ZkZCVlNVcGgxTURDNDBFV3dCMlB4QWtMOWZxelJIdmZqYVpzR29vNGFHZDIwdUhpeGRIQ1NNYWFCeWFyeHdKeUIrS2ZKQy9Dc2pIY0p0VWtLTmJ4SXVYOHJidmtTYnY4WVkzOE50OEJsSVBLb2x2Y1VoYmJ3bVpiQnE5VUhPZUxWQWdCL2tJUC9MMEk2clJVQUdBTmkwd1ljTm56ekdvZERwRDNtVFRJckFMQVBYcjVkWTM5MWd4ZXkxM013Y0I5SjV2Qm5jRmZqK3NQYmR0THYxV1NRU1ZmZ0lyWVBkbmdlMk90VHJyaTArSmJuTUVPQzJ2TXk5NnhtSUN6QytmRGE4TVRvT2luSGhzNGFudWhEZysvUkM1NGVYOWxzOXRMTWtIMllOdXoxcnNkZVZ4VUEzSEtseFc0d2g5VmlGUzRsU0huaW1Qd2NOYXUwNjVLeksyRk53T2FPNnRmM3pGSDlvcmIyZmZLSVdBZURMdjQxY0ZkWlJyOEQzT1JhYlU0MUFaSzZVSWZodlpkaDR4NjQwdExNWFdVc0VPMS9BcjZQR215OENhR25JZWtCUFJTakRWTEd3Yk1NK3NmQ05GeExmWkZjMUh3RDB4emxRUXB0NFUyS2lUc2hRbHZvTU91QWxoUUF2QytIL3NmQ2NmbTBSZ0JBMTlJNmdhb3RJL2JhQzZCTU00RnFCUUEySVphTG9Ta01zNkhIZEk0T2hoeUVBc3FadzIyUFZ3bERBZVVjR0FPZU5ZdTM3RW5JUGNkVVdOOWh4bVhMbTh2Y3N5T1FScW4yQi9jaEV6TEx0YUVZS3NZOXk1NmVqZ2dTN2h2ajk5VEdESkZIY1FzNEZac2VrbXpWQUFBS2dIRE4rMm1abkNWWHFOTytSb2RxS09XcGdSYmFnaXV1YjQzeGVNNTE1RnJZMWdlUDZwZjdqTk12RmtuQmJJZ2V6OEd3RDBRWURtV3dtd3E1RWFnSmtPVGo5YnRDVlNsY1VHa0NnQjdJQ1I3ejNCQXNMMGRMd25GZUJacCtZNjZJbGZRUUNMVXVWMXlZaGxPcUxIQ0ZubzgrY0QrK01tNEZtT0VTaDlHZVpKNlNBSURQNU1EL1NuZ24zMGlySmdCQXNwUVZVa0plaVpWT2RpZERBUENQZ2I0UElBeG1oZG4wb0VOMytpS0VqUTRnN254WXdSeXk2M2lWaUhkSnZwZVB6SHhnckhQMXdPbWVlV1Z3SEE0Q04vUFdNdmRzTDF5NDVvbnNtak95dUpLTzBXUHMyYWg1aXlMaDR0clFjc1VEWUV2eDJURExvYVlBd0VxZkd3TzB2Z1lQbklPVWhoMktFYzE1WEtyV2crMENVV0lKY2lKSGpSZmZUZkRCMCtpWHk2U3l1MnlHRGtNa0ZtNEFLQWdSaGxBVDRJY0VIdytWcFNiaFlONHhRZ0FNUE1xNWNUTG8yWUJZVnpra1BYWUhoOW9JOFVvMEZ6Y3REMEEvNWQ4K3BjMk5hOFYzdzFHSjBpNHlxSXV1VkhkaXRrd1BRR2lPNGdLQWJ3Um8vaUJlcHd2UXFnVUFNTlNuaC84MjVTZ1BRMXdkODYrMVVsMFdBT0EzUW82TUFnQjgwQzBhZ0huVUFJNjdrRkpYQ1FEZ1VCOFRwcE44TDU4YiszVmduYmU2WXRFaDVBMzRidWE5bm5CeTFIZnJjZ1dCSGQ5Qld3a0FRTGxlNnlZZkJRQ3MvY0VobW5sWExKWTBCTjRXdGcwMURRSFVHZWx6NktyYkFmZlhQdVEySGxEODIwb0ZTWXIrZkM5ZTZRZFAwaStuUStLdGx0MWxCK1MreEhpeGp6REVtZ0EveG55WGVXcDZ5R3hBNk1GeXpTY2hBYkx4VkxmbXVPRW0yd0d1UnRMWTlseU1OdTFLdFJTZXVQUTRBTXd3YjBpQTdzZkFTOEZsUFVjaHhvZ05YZHRwemxNY0FIRGVGUlF6ZjNLRk10ZmFxZ0VBVnVrV3krbTR5UFd3Rk5ndVp3QUEzaE5leEI5akFJQjFDb0Z4dkp2SmZ4d3VLNWNEZ08rMkNXUzFISVVDa253dlh1ZVdUYlI0QTZoek1FN3I3OGhqVDVQeVhRYkJiVDVzcEZNZWtXMU5laDZvdlBBSWhUUFdBd0FEQVFCNkNaa0xacEdFa1VNeDRXeFZXdVE2VlowRStNekRDRVZYM1o0ckNKeXNRV29EL3YwbXhiMWZsZUhxUEFrQTRLcVJEdGxydU53MWRWRTNJUzhHU3hPZzI5bWFBRkh2c202MFRjcEx6eGxwUXVXUTg5QjQrbTdFYnlyWTdHc3htK1hGaUVzRWkycUxCbkI1UnNZdHl1M1lEeHlaeVJnTlphNWJVNXluT0FEZ3FvU2NWTFArbnRHeUJBQk1zdktsNHlMWDQ0a3IxbUQvSVdVQThKbndJWTUxT0Q2SUFRQldqRnM5N20wbS94M1FqUkNKWXBXQ3FFTm5hNmZFL1Y2ZEhxQWJPc1NmUmR5QWZTQTVDVWRra2tpMTB3YXg5c0R3UHZZbUNFTk5BOGw1RmdpTjIwYi9NMFk2TldhREllRGJJYkttcGdtdlNmOElCcFEzaC9WV2tPdFVWUURRWk9TM1cvbjVLZ0l6NzRwVjBVS014dTYzRUFCY0Y4TmpwVU15dVFkdjNGWnFvSTh3aEdtU1Z3UHZjZ1FoQmF1aEs1VkZNdnJoTmxWZnB2RnNUemgzN1JIdnNodXorWGdNNWVZVWMvTzU5eGdBck1PTmk5MmI2dTZmaDFSQVgxc2dZTnlSMGp6dHdsb0xBWURiY2dnK0V1OVRIYlducmxEL0lBc0FvR2xXYitoUW5EVThNY3IxMEFxYVYxeWhFbWhhQUVEYjE1S0Y4M2tNQUxBRUlUQkw3OE5IL2x0TEVRQndxaDduNENjQkFMek9kejNySEJud1dYcUlySDNEcWJWdktqaG5sbzIyQ3FuVSs1NU1EMDREWkwwSEZnTGFrMzVRRkF6QmdDVVZycDR2WGY5VkJRRHM0c1pGaHVrZGVzaU5BenQ4eWNPUXhjWHp0Z0VBellxd2xMMHNjbzhhQVVzY3lNckx0elFCeWdFQUJ3QUFkZ0NrelZNdWJpVWVnRFFCd0Jzd3FGR3RIQUR3czR1bkFMaGJJUUNZQmdieExCaW9VRXRDQWt3eVQ5cGVSd0FBMWZkUXdacG1hbG9MUFFzRGowWVJBYzZHc3dXNVdIdGR3MlRmcHdRQXRGMFFZSEV1QWJqZ3d4MXYzejc3c0p3aUFFQ3hubjJ5TVFzVkFnRGZPdThCRGs1V0FNQzNiN1lnQkgzay9JcUlvZjMwbWdpNTJISUFvQTlkc1JZRmU3TFZaak5manFXQWxTK0hJbTJ2SVh5dUhsMlVWbWZaNGFvQ2dGWlhLbXhndWJqMVFmc045MGN1a0Q3eHRnRUFMZXNacGV6RjZUaFRybFFlR05ueXpJeEZUWUJLUWdBNUkzZVg1VUtiVHdBQWlOcnMyRGJLQUFDaGpjNHREUThBejRudmNONHZNd3RnTTBHTENnR2d2a2NuWkM1MEFaR3hJOFkzTHplSC9UV2t3bGtIMTVUQi9xK0gvYUdscGlzRkFOaXVDUi9pY29LKzJiMlBlOXRIL2x0SUVRQk11VkxsdVFOWG5JT2ZGZ0NvaGdjZ0N1d2V1bEo1YmV1U0V5SWEvbDk1TDZ1cFBQTWVlRkUxWFh5Y3VHd0tTbCtBbmV0eHBjV0Fsc0N6c0dXQUFYNFhsaDJ1ZWdpZ25RNjVGY09GeGFwMmZaUXFaVEZJeHlHdTl6WUJBQ3dwN0ZQMlFuS1BGV05lSXcrS3BRbWdwTGE3WlpBQUY0QUVpRG5WdXdIQVVTa0hZSTdBM2s0RmhKL0ZHSTFCekl1WWFZRExNZHFTc3pVYU9nT2tSMTRydm1JZE9iaFpIRlVBQU9MT1V4d09BS2I0OWhOcGNkQVZsM2xPMDhEL0I2M0xWVXFyUkdscEprbHFaVFFNQlZRQ0FMamRjNFdpWWo4bDJJTnJobmQwSmtEK1MxdExZUW9JMmhnSzJJRERKd2tBS0ljRDhDb2xEc0JyRjY5Z2ozclJsaWxkRkcvbjVWd005dWljVzNERlFsU29SYUZyRVhWeWhxbHBPZUJaU0o5SE1KQXp5SUxMUm5pd3FnREE5MEZEaXdIVHd6QVBmZjhYQUFDNExLcFYrQ2RPdkprUlA2ZlZxSEY2VUVZYW9CTFBPQXp6dWtKMnZwVUZFQklMWVNKT2twU2ZPS1E1RG1NOExvUHM0MnNXd28vS0FrQjJ0SzljNXlxNWlpc0JBRkh6RkRjTEFOTzN4b3grSnNpZ3BnVUErSEJhY0tYS2l1alN4U0pnS3YrTFpNQnlBWURWNnFUdkJ5Nit4b0R2bGovdklmOHR1V3pVRkZIbW5EMHE1V1FCck1YTUFtZ0tnSWRLdklKeFNnTFBlK0xtR2pKS2VqRUlFZi9ROWMrbGpic2dWWDdLWTFkVVJHMGFpSVpZU1hRL0lyVzRKZ0RBWW9UNjNFSGR2MkFBOE5TRnkzcHE0WitvV0xQR1pTMEJHWFNySmMxdFZ5R2dJWVBFa3dZVEYzVUFlaW0zM2FlSVZvNE93SkJ4RThXbWVmcW9CcGNFTEExSHRBRUQ0WWR5ZkhtekRzcjhLL2tLMjNLS0FNQTNUMGwwQUZqSFlvRzhDUE5FZUVvN3hxc0h2Q1VEYk1WZCt3RWtON3B3cWVrb0FPQnJ6UUl3NmhQdVFVeEp3NzF0a2YvbVhUYjFGQ1k4b1lBdFY3NE9RSlRlUlV1QUw1Ykc1V1BXMHpDRkRoVm5YMUxHU05LTEFSTXFRL1VNa0xTTktZQ0xBYytpWm9hTXdXVnR3ZkNDVmFJRTJBOGdKVFVBRU5jRFlDblIvUklBUUlQekMxN3N4blJiYWR0enRpWUFWNWdxUnlrcnFScGN1VXFBNHdZQTJqZmk5TjB1dVJKZ2Q0eldLWnV3eVNYWGcrOEp0QzVBejRyd0xTWEFMVEt3UzBCY0d3USt3S2dybG1kT0V3QjBVOHcrNmJlM1lyN0lJZUNVcDFjdUd5bmc4ZitmdmZmK2pqVEpyc1NvSTRsYVVhc1Z0ZVNLSXBmY0hZN3A4VE50cTdxcXE3cThyd0lLS0hpWDhDaDRrekFKZTRCTW1BUzZ5VjI1MWNxYmMyUitrZjdGRU5BVHIzRy9tKzlGeEpmSXJCcU9xczZKd3lFYWlPK0wrQ0plM0hqdnZ2c0FJTzBGK0FEVGRBT3JWd280MUNUY0lkOC90Vy9lQzdLM05mTGZjcE1BQUI1QUNQN0YyNUtpQktqbHNtdUtsNmk4T3VScUMyVlpzcmIxWEFwbWxDWXl4Rmk0RGRVN1gzclhmSjZMZ2Faa2VCTGhVTWtGUkJOUXNoUS9SeURrTmtNWHFkQzZ0VUx5UjA2WFd4NVF2UEoxY1FDMEVJREZBZEJlRU4zZC8xQUJBQmYrc1NRdnR4S2FSZ2hhb0h6dzE2NCtkYnUzcmxaNHBGRWVnQ25JY2NkYjI1R3JyWGpZekZvQTR2RkFsM0RlUTZESGFGSlJVbTZBandKWkg4ZEtyRkRFT3laZHJUeHpNd0NBM0ZyN0d3QUF0bDIyaWlYdWdVa0FmczBBbDNoNzFlUnQwUnN4QXU3bmxnYXZMZllBcGZiTmhXOTltOHdBQUlBQVNVUkJWSDdrMExYMmVqTUFnRlh4OUJUWTdhRm5kUWV5bS9MVXZOQUs0V2p5NTNsdE5iWVJBdXc5L251OWhzUC9YaDFyQXk5MldpbzdhNmxJT0dxRTlya2xqLzRXK0RVeWIzbGtpcTFub0FxbGVETEh3U3U0SFBtYkdnQVEwajgvSWxLWlpBRk1PYjNrcFhiNGFGVUZXVHB5Q1Nhc1hnRFFxSDY3WExid0QyYzZISko3ejJyclN0NndKaTV4bFdwWnhTWndBTERxbDhRMnVYZ0wzeENhV1EyUVhjTDFISnh0MUY3N2cvK2x2MWsrOU14dzFIM0FBNURkck1KRVhxTFUyQVVpeGpZYUFOUmJEVEFVOHoyazJ6ZFdMOE93ajBiOHJPZndldXRxcTRCV0RUNUF2ZVdBVTlwY0lvdWMrMmE3SitEbDBQRDJOUU1Bb0dnYkN0R2NRZ2d5dEI1QytpWmM5UkxYK1lMTGl2TndHVnh0YmRTalF0b0hyZGNmK2wyK3J6WVBCZ1cwMTBNUXRlb1pJQkJGalFxeFBhK1Y4RGZ6d3RnMmlGMVlWQURiU2NCenBkM21HWnpKZXB3RDI4TmVJYlZJRTZjQnhnYUZZamVvUTE5U2ZwY1B1VUhGL2FoSk9scGxFNjJEdWxuOTlqcTc4SS9HNnRmYW5NS2FyNUIzSkcrMUxLdWU5WjdUaFVIcXlRTGcvcVVPUkVWSk9jSmlLTGhCR3FIVXR3R2tzWHBKaGt3RWV3YnRxYjg1UFBKcFpoY3BZVGNvelVsenMzS2RkSGxIbG1mR1c4WHZBd0RRTW4wME5yNk1adzJ5V2NvRzhLdjNtNHk3cklDS3hXWkhRYXVoT3Rkd3FMRkVkeDQzdGVZVjFHNWJNMDBDQUJJQ3hEVXFOL2h2ZlBaRmFEMW9DcWZyVGkvUnZFVVpLU3pPdzJWd3VmWkpXNTFydlIzYWF5QnRQdmQ3OTRHN2xJaitvbzVuV0tuc2VPbkZvbDhDWnJncTdKWUNZbkhPTUd0clMrRy9zS0xra0VLKzVqb1ErQXpNRENzUnFLNGE1TVorQkFDaEd5L1dmOStrQVpXVUJjTXBhQVVpMHhXTnlTN0JBcE5CSEVDdXFIWlFON05mcnBQTlJuQTk0TEtLaFE3eXB1Z2RSRElOanVEZHRNTTVCV1FjR0gxWFhGYUVReXZlZ203YVY2NHhTbjM3c01pdm9pdk9xV0QzZkx2cmpjZHRmM3U0RUliNXpCdWFibUw2SXRBOWdseGVLWVlWa21mbVZMZjNCUUI2WEszVU4zSmFUaWpkaXFXK1VidGZJNGZsSFlzMnQ4Z0gyQUVEUEoxNFNPZFpXMWNGWkR5SDN6cTlVbUF6QVFDdlVWUnYvVHNYMTRXdzF2ays3WGxaNTVZNEQ2YXpXYkh6ZXZmc2M5OFlzRi9zM1F0dGlDOWRQaUVuSzg3T0dSV284TXByWFFOT095NnJ4MUoyV1JFdzJVOWwyblBNT1pCMXp2b3pHMlIvanBYOWlxbUdzbWM1WlBuOW1ZTUE0STF5NjhHWXIzemtBLzh6ZkZob01PT1VWNndkaXBJanpBc01oVlZDNlNYTjZOZFNSUXlWQWtXWGxVWWVQRExjOHlsQ0diRk1neE1ZcTNZNHg4SU0zd1Q2bGdWZGdkdUFWcndsaGFpVmtqbFJwY1hiYUFCd3g5LzB2L1R0bWpjZ0g3dmZsY3A5NlM0TGZneERxQXRkbnBqTEs4Q081WmtsRm55Z2tOdXVNbzVZT2RKVWwrOEs3UEVLN0JrY3p3bUJIVDZVUjYvZzR1VzU1Vm9CWllVUE1OeWd0ZFVJajR5V0dhUkpmemNUQU1oQnBOVnZPWTA4NnlYWWZRNG5iSUpYc1FwckFCc0wybUFoT0kwOWY1VTllMThCN0YvNlcvK0ZPdVNGblBQUDZpU0lUZ1p1MlJvUnNrOEJUdWgyRjlYTHFtSWJUc0NtSGltWEtaeTNIbm8vdEQrSHhuNUZkZGhqWmMvT0lQa2NBUURmZXVhVVd3OGVCanlnSXpoOG1NRFRweENyTVBZbmk2bnFhdFhURGx5dDdDWWVCczNxVjB0eEZGWi9LSTdmSGtrZnJNRHRKc1g0cEdRWjRDMjBCSEVoN1hETyt3eEUvdHRLLzF5ODVZV3pSWTBxZGJaVUFJRGZKMFVPOWhOLzZQL0dIL3cvZDc4ckRQUFVaYXRqamdMcHFRaHVjVmtUaDdBZmp0eGxpZWw5ZjdodVFoZ2poY3NRRzhlYlFEeS9FaUNBY3NHdk9RQUJPOFo0Y0N4U3VHZlppSXZtSFVzL3pDM3ZYZnc3NXJJMGFtM2wzWU1XajJHRGZvL2R1WlpZVkNvQWlLMEg5Rll1S2U5alBVdkV6ckFLN0ZzQUFhWEVkYkhqOUZMd0tKMzd0QUY3OW9iZnQxOEFZTC9ZdTc4NGJ4K2R0eDllWVExTzU1dzdCRTVJdkpPaVFydVJlVHNnMjhCWkw1MHVxMEw3bGtEQVRrTC9jbG5qUFN0azZuWUVBRmp6ZmtTNTlleTZySndobGdWbURYb3RoYWRUV2FqcmlpRTlwRDQ1eFlJUGcyYjF5NkNDbWYxV2tZam5nZGdhL3YybXF5M1h5ekdmcmNSV2dyanRNakRUdGNPNW5tZVVJT3lESWh6WVB4WnZ1WHVGc1dodHc5VnFVTVQ2NSs5akZZVDVtVGNlUC9ZRzVGLzR1T0p6SDdmc1ZrREFNaGpJTFhkWkdWUGFOczNiQ2hBWnVlQk5QZVBRbE5oS3lqZGpJcGFBR3R6amMyQzRzREFLdGkwaWdzMHF4THlYZFk1bFVJbGp4NzUvbzlaV1BYc1F4NEF4NE0zQTNGdGlVZG8zcW1jT1VaTitEbXgyN0ZrUGFaMFBBZ2lZcDNXeEhWZ1hYTlJHRG4rczUvQ2dnWHRXaWpmOTNPL2RpMHFPLy9LOC9mTTZuOEZLcjVzSmN5ZkFpVUhBQXBDL1pkNDArN0JKdG9IdHRaQ1V1d3o3WSszWGJUb1RpcFN1TElKcTMyWFVJQUI0NWk2bGIvbUJLN0F4TVhkNEZ4WUNGalhRQm1NVlQyQkR1ZzJEMkhDMUlndnJ4RHB2VnI4RFJGUmlkbitOTzhVZmdFK04yQnIzc2F5NDZCR05Ma2F5QzBJaUdWeFdFZy9uZXA2eEJJeHBTWGxERVk0M01IYlJiSzkzTE5iNDVpaHRNdGEvOVgwZWU3TGZOWDk3K01nYmo3ODViMzkxM3Y3Q0c1dEhIakF4Q0pBYkhTcDhyVklyd3NaRE5jTXhRTi9DbGFobkhHMUtlR0pabVROMnhUNEhveUlnUU1ZajdPR2lNWjVsV0Y4VFlFandobGZQV0hwZ24xaDdqYjkvbzlaV1BYc1F4ekFDTitibHdOeGJZbEhhTjZwbkR0L1FoU04xUGR6eCswRXFRUFpBZXZkVWpuV3g0TExpUEhqNGkwZndUb1AzN0FWZy8xdS9kLy82dlAzbjUrM1A2M3dHZTZKUzV1NlpBZ0xHWGEzb1QyamVSTkh4cldHdlEvYkg2cjlJWjhJY1hOWUtzR2UvMHpOQUFQRFFlT0FVSFdCYzlsVFM0UEJoMm1CZVFWd1ZEMnRjckVWb0s1VHF0Z1FIRWJvZm05V3Y5Q2NmbFJuK2J5azNIZDNmSEZ1YmNMVkNNWGhRaTR0ZWpLSDFUS3ROUTVxamlHUU13RzBSRCtkNm52RVdianlqWUlTRnBjdUgvL1Vyak1VYTN5UVJEV1A5VzkvbmdYL0h6LzFONGlmKzhQOW41KzNQenR1ZmVrYnhYVzk0WkUvSW9WbUFqU2psWCtlb3picExtV0JodkE4RFlPcUFRN09lY1hCNFlrcFpYOU5BVGhWRDkwZ0JBY0lrbjRxTUI0RWZHNUpuZmw3ckdjdWJoTDNHMzcrUmF5dnZIc1F4RE1MY2hlWit4T2xpVWRvM3FtY08rZUtXdWg2KzhtVFlKd0FDeFBZUFE2cDNiRjFNdVZweEhqbjhSYjc1WmhQMnJBRDJpNFAvUHoxdi8zR2R6K2dPZkV0cjdoNENDT2dBcitRSXpOdE1ZTjVtd0RhTUdKZXB4M1FtOS9zNUhzdnhYVVRuWWdndUhySm5IeUlBdUtzOFVCYnZCQ0NiZVpmVkQ1OERGRE1CdDJjZWpNUlZPMkREc3lIRmhnZVBKdDhxTjVCbTlkc0JxVTBqVGhlbXdFbkZnaVZQQ1IxYWZRekRYSWt4RkJRK2JHUVdXRTNJVWRLZjNCUmZBb25tVnAzUEdIWloxVFE1eEY0ci9VdHMvU3BqMGVaYVFJY290c1g2dDc3UFhSOUwvTlRIRG4va1hZY1hoLzgvUG0vL3lNY1lHUVM4QnVBaEIrZUkzNHpqU2h1RDl4NkVBeE1CMDRNNng4SGhpWUl4YndXNmpkMGhFQ0RqR1lpTVo0eStnZXp0N3cySnY2SFZNNWFXeEwyRzM3K1JheXZ2SHNReDlNQmhHWnA3WEMreGIxVFBITDZvY3oxY1UwQkFtMStudmRSWGJGMmczWG10SFA1Zk5HblAvcWsvK1Ava3ZQMXhuYzlvajN4TGJlNitCaEFnZlhUNWZUNllNRytqY0NrUUpVcStUTEg5NmN5eFgwZko5c2hsc0FYM0xBSUE2OWFEQjlpWXUxUTBRcTMyTVVBeE1wZzJHc3dEbUt3M2hpSEZKaE5reWJlS1FXMUt2My8wNGQrSGZ4LytmZmozNGQrSGYvOS8rT2NQYTBFeHZaVFNkdFhHTjlKV2YxaDNHOC9xVlJETEE3aGR4OTRWLzc2VmtHMVB3dS96RGFrMzhuNTUzZ2NSdS9VKzhqZU1DaEhvaE9ZT2IraXhzWVRtKzJuaTgzRHVZci9maVBWejNkOWM3dmcxOGREZkZKN0IrbXIzWThiMzRMbTU3cjBXOXdINHRzSzM3SUc0OEFDMGZucXZkcGRWSlpOYnp4OTdyOEtmZVhmbEQ4N2JUMzBjOHdzL2h2dDFyT2tXQ3JuY0llQWVXbGV4eHMvNWhXZGJ5MjN4cnAvdnA4cGN5NXoxQk5hSHJLM2JDZnZ5cW1zRlBUbmkrV2lCVEIzdCsvYURsd01MQmNtTlZoVG5VdllWdm92Y3RQT3VNNWsvemVQMlZ6NE8vak5QanJ2bTUvVUJ1S2V0dmRnYitEbmJqMGZlcTRmN1JUd0dyMm1mNVIwRGVnMS82ZDM3S1hPYlp4MzgzTTlQUGV0QkcwTWJlZkZ1WDhHbVAwbmNCemllTDVYdjNBbGhpQUswSWNNakwzTi9EWFVBR3VWV2k3blpZcTV4eXhYMEdHTCtLVzRlZEx1R1hEejgreHdqSFltOFgxNjNVNHE3YmxpSkM5WGpMbzJOSlRUZnFjL0R1WXY5ZmlQV3o5ZHdhRC96bTYvRnoyc0hIS0lEOUI0OE43ZU1BN2lQdnVWWXhNWFdDNXNUWFo5LzRtT1RmK0d6QzM3aWpkeW4zcVY1dDQ0MXJibEhIK1lJQzZTRVcvQTVINU9yR0Erd055Q0tJbk5kb1BmbjlTSEZWTzRsdWw3ek5uVFYzalRjcUNIM3R1V2V4WERhdmNSOWhlL0NidmJZT2hzRHorcVF3Ym41Z1NmRC9kS254ZDNNRVlLVWZvY1Q3TWN6ZjNocSs2VWIwaGRIakwzQ1kxQVBJci9XZnA0NHQzbld3Vzg4ZnlDMEhrSnVleXNFaHBlbGVtMzZpOFI5Z0RaUU8vejdpTGNoYlRKQUNQOE96S0lVY0tPSU5UR2lUWXdjWjVGQm5nUHJmeWhDR3NKNGZsY0N5WVBqLy8wQjhnNi9YMTdpU1l6QU5hT2syYlZESG5jZXdsUnNMS0g1VG4wZXpsM3M5eHV4Zmg3NXhmOEsrQUJkRVA0WkFyTE1KTHdIencwYU16eUFSeUlFS0kzZ042Q1FuLzZKSnhmK3RZOWIvaHdPMU50RXZMMEtRZXBKSWpFd2xmQ0p6N0hpeEZwNGNCSzROZFBHK3BDVXdVY0orN0llc2lpU3RlNEdpRlRXOTBXQ0ZuT2FzT3BjYkYveHUyaEV1eEJoRFBsS0UwYld6VS85NFMrMzI5czVTTWh2amJXbTJZOVhjSGcrVWZiTEtEekQyaXNUb09IQXQxSHhxZ2pKTDhWbTVWa0hueEhnWm1MdmNPSituNFF4SUJCL1ZxZE54MVMvMkQ1QUczaWZ1RytjaXNoMVZMU1U4Ty9CTEpZRGJsVGFWaXpWSnBRZXg2a2FZdlJiU0tzZ2x1cUJqUDYrUU1xTzl2dW93RFJuL0Q2K1g5N1VrMWdLMTRyVGhYeGtvWXpuU0ptS2pjV2E3OWJFNS9IY3hkSW5HN0YrMkVYSU55a21yUzRaYzhPMzd5SElnNWFOWktYYUxGT0tuNWIrZE9INi8wdHkvWDhPQjZvbXhGSlBpdFR6eE5UQTFKUlBmSTdHRk84SkVJUWx1MmJaV0I5ZGtOc2QyNWYxckJWTTE0cGxObW1wVkVWS29VTERpOFl6dHEvNFhWNVFxdDBZdk1laThSNHlmNWJ1eHErOU4rbWFQK0R1K0htVnZSdXlzL0tkRnhQc3gydnZkWHRFNDBEQWl2c014NEZqbURhMFF4NzdkLy9TaHdKU2JGYWVkWEFkU0h0V2FsMW9QZkFZSmlpZHQ2VU9tMjZKL1ZocGlHZ0RueGpaYjZoSWlIVlVVTFNOMS9GakFRQ05GRzZKaVcxSW1jTkZRL2hEMDhsdm8vejZ5Y0M3Y2pFS0xJTmFWSVFlV0FPQTVZVTNJdStYVjN3aUp1SmlTZm5pUWxsTUZFM2hLbzhia2ZuQ2luNmF6R2hzcmd1UjMyL0Urbm10cE9WTkFIcWVCOE8yQm1QbXVkR00yWFJFekVQK3R3aWdyQ2dDS0hMSWlldi94K1Q2djBQZ2c2VllVNFNuVUNUbGhVc1RCMHBwL0p5N1JxNzRHS1VJRjJHdVMvQnNYaDl5b0R4TjJKZDVHd3UyUEkxb202d1ozM2ZUWFJZS1dvRFU1a0YzcVhvWTIxZjhMcTEwMDN0TDYyelRaUVZqVUxQRVV0NzgzSytuMng2a2lWdFlQRW9oT3l2ZmVUWEJmclFUWU1XTGdRRFdWWmlEN1J4alFLRWdTZlZMc1ZsNTFvRndiVUphTjh1QjljQkNXRE1FQXRwejJuVFVFMkFoSW0wZnNBMThTWmNXcmJBVzFsSEJzc2E0anIrN3FBZ0FhS1IwYTB4dWsrc2NvOHl1VnNaV1hGSHRzRGprN3kyWjNpVURBS0Rlc3lZMU82WVlwbTE2UDVZQmxrTlBrd1cxNUNkUnhwVmxncVdZajVSRG5ZRDRLaTRVNisrNEJMQldBUTdIZzJVdjBRdkF1dkg4dDlwYzgxenNOMkg5c0l0UUtpOXkrZUl0MkF5YTJpTWJaVEZtS09jcDh5dHlteWkxeVJLb0tIMzl4cnYrZndna0pIVDljemhMSytpU0twUDYwcy9KZ0F2TEE4ZWE5aHdPVTFnSEdNNjF5R3lYbGZVaFJ2K1pzaTkzcnJoV1dMSVZBWmFtYnNweXFxZ1dLakt0cXdBQ3hCWjEwcjVLa2ZsOW8zZzhSS3lNMTVtbVdxckp4ZDcwWUZKSW1TOGdOcS90KzdMeW5kbGVhYkxiN1Vwb1ljUmxTenB2UVQrOFYwSmpZTEdmNndsem0zY2RpUGNpcEhZcmN0Z0h4aGhRQ2x2em1NWnN1bFVqSjBXS21HMWdtM0pwUVFWY2tjSG5JbVFMeWtYbGRRZ0FTRkVCclYxbzZGOFVtamgxK1F0dUZGeHRvUnd1Wk1MVnhyb1VJNGNhKzFLOFFTb1JobTdjc3FETzZIbDQyUEw3SGJ2THdrSGJoTWhHNENPVTNHV0pWWDZmU1NVa3NlakM1VkN4Q0FYV3I4Wnl6V2N1cTBHK1FONFRxd0xjTjY2MmVpTjZBZmdkc1RBVWxqWEd1ZFlBUURWbms3VmxyUi9OUmJoS055bXN1blZpR0xkMnhTaUxNZHQzbC9VdnVEZ09GdnJCQ21oY0ZsbGMvNzhHRWxMSTljL2xXS1c0VFF3QXZJSzl3UWVxOUhNV2FkWnpZbnJ4Q0pRT1lYNU82d1FBeHpuWFNxamdUYXkreVNIWktxMjJ5U2JZb2trWWczVklXZS9DNzRIRmoyU2RpUzNGT2RTcWI4cmVSbDJIVmlCWVd3ZVNWUFhjZzRPc0JIdjB3R1dMR0lrSG9NMElMV0FwM0FPd1JTYzBsOGZLUWNRUzZzSUZ1QkdZMjNMazVyOXZBSUI3ZnIzVnV4NndHTmEyWVN0RE5sM1d4STdpMlMyNGNERWlyWXl2RmpKY2c3UHdCRUQ0c2JLT002V05Rd0FnVkVyekVBN0V2Q1UzclVPYzY0MXpUV2wyLzJ0VityYm9jQjRrbHhJdmV0d1F1TG5Zd3lEbE5ZL3BRMDRxWTdIQXhUaTRYL2gyclpXaVJDQTA1ZlNLWDFpMUNoZUtQS3NUYm0xYURYTXVlNG1IMkhqa0cvSENIREFBUU41MjdMSjFzbm45YUM1Q1B2U1A0WEN3S2o1MkdsNE9yRWlIMVNSRkJodU5IWU8xdDJBNDBmWC9wY3RLcjFwVjJMWmhudjlWSWdCb0ljTThUOEQxMkdYclhsaE5lMDZzWWh3RHBVUHFMeThBeUx0V0tyU0dzYVJxdTB1cmNNclZRZzhUMW5sZUFLQjVMaEhBWThuZGZhZFhXUzJSZCs4aDhHRTZnUXN6QlBzWHZaNkh0S2ZRTTNCQ2RoY1A2UFpBYUFISGNRcWdlQmYyWTFVWnd6UjVHQ1FNOEZWZ2JnL2dzb0l4Y3R3M1pXWHVIMEtZTExRZXJPcXhDQXdzajJsM2dpMDVVTHdBWEk2WVMySnZFd0F0S0plNlZRQmhDRlMyQ2ZTaHQvTDdpelZ6QU9iQUpXSzFiUUlBVzVIZjV6ckh2WVNXZUJHVkZiZDh2NnN0c0lPSHMxYUdVOUJaTngxTTYvQThOTEJMRUNlWlVUd01aL0FjL1AwSlphT2RHVzVuclNyYnZHTDhjVHd5ZjliQ3dyS3B1RkI2SVc2ckhUUlcyY3UzZ2R0L2JHRXlQMk1qUjlzQ2cyRVozLzZBZ1RoV0RxS2pBQURvVWRZRmoxUGMvT3YrVUYybitiY09uMzdGOWM5RmhvWU1FSGppc21WRDh3QUF6WXQzRE9PSXRUWHlWbGsxNHpjQnJGWEpUY29GcXF3YkgxOEVObkkyK1ZiYXBXR0VBQjZIOCtTV0wwWE0xb0h6c1F0NytGQUIvSVU2QUVCL3dxVUg3V2dKeHZlTjRhbEU3d3l5MlZHb2JRSFc5VEZka29wMFNQQTRSK0Z3ZXg0SkxUQmdXb2V6b3V4cXk2aHpaYjBYQ1FCZ1J3bHpJcGphTXdEQVk4aVNHVlRzTmE2SFhYai9kUWdWVlFqd3M1ZVpiYnAyVWRPOHJWUEc3Zi9JNmFXSSs0MXZzRThoZzNYd1FsUWdGRk5qUndRQWNER0pSYU1WRFFDd0V2aWJPU0krOEcxbDFkWFdNOTlSd2dCV2lWM2VxSGdvZGRPSG55ZjNxSFpRYSs5MURBdWRmMytLak82eEFSUmsvSnl5eGU3Zkl4clRPckNyMXcwRGhZc0tlUk10cnJaaTRuSUFkS0VYWUk3aVdhZk9ycEhkNy9UeWxZc0pqVDBnVlhJWnBycGZqMXkyUkttMVRnVUFzQ2VCd3pkN1FJcEMrV3ZlckphblFuUDl4Nzc5SWF5ZDQwUUEwS3FBM0EwQUFIZ2dMVVhhQXNWb3JjcVd1M0F6a3Byakc4VDhYcVQreENQVjRvMHlseVplekxGZThPQ3BLR3Qza09hRUQwSzhrUlhoMjY3UVRVeTd1WTRFRHNJekF3Qm92S0pEdUxISisydGpQRk04bFpOQVlrWHZ6Q3l0VlY0THlHRkNPNGp2dkFDdVlubDNKcHJPS3NBSHY4TUNYZEtxQVdDVUNnQzJZSzJ0S2x5b2JRTUFXSHVFTDRKNFExOEFSdjRHaGNRMXoxYTlkbGJ6eWxZRFh0bnVCSkxrT2dDODlSaVpXQUFBTWlNblhGWk1ZQW9XVnpGaVdMVy9tNEM4VWs1OW1GR003NGtSQnRDNEEwZUJXNWdReGtJTGx6ZnNuTEZBRHVFRE1ScC9xeXgySy83ZnJkd0NKeEp1OTBWdzlZUzhCT1BFVmtiWG5SVnZPalc4QUV1SlFBRnJ3bmREYnZDa3NSNm1JRmQyU2VGQUlKOWhNWkdBdGUvbmV3dHVuakVBMEc4WUdpMThNd1U1eVJyWFF3TUFuNERySDBsVW12ZG5pdzYwblJ3QTREVjVlWmgvd1RjdkxDREZqU3RKZGhMd0xocnZ1dTZ5RlFPNVFCWG5JRDkyMmRMRUU1RzFNbVh3V0RSQUtnZDBqMEU0cmlvMzN0QnREQTgyc1MxYTM2a0FZTlZscTZydTBZR2kyWk1UQlFDOE1zSlk2OVJLNEI2V3RiUk85cTBNaDhlNkVxdlhBRUF4NFBHY05ZQmFEQURjaWdDQVBUcUFCZFR0d3pmZ1p6eE4yQ000djR1dzMzRzlNUkVjQWNDTGdKME5YYUFXbEZDMmRxbERjbkVvVFhMVFphdmZic1RTaVFVQW9ERENrTXZLQ1JhTWoyNFpWdjViVk5SNlRiRWs3YkMxRG5RdGpuOWlBQVpNWVdsUHVPMmhNZEIrcHdLM0IwYmpNNFpIUW92L2R5cHg0QkhEYmNRTEpvVW5NQXpqZnFtd1h6WEdxWFc0czdGSEZ4YUdDbEF3aE5YQkNrb2JNZUxlVlhKOU1aOUJTOEZhQWlPM0RyZmNZaUlBNEhXTk1YSCtmWTU5N3NNN2F3RGdtamRvRHlCV0czTDlIOFA0OHdDQXRzQ0JkRXBqWDRiL2E1VXJSc0daYmlXMVU0QTMzNDVYWEcwNVV1d2JjNUJmUURvbkZsQ3gycGlTeVZKVndsSGFUU2wwU09NMzR3dEpHZUxDTytSK3p3c0ErbWtNYTNSSUY4SFRaVjBvR0FCWW9aOWRBaGQ3UUFqam4rL0RkN1FBeVRBQmdCQm9GanU2VE1BZVNZWWFCK0NGdTVRSERnR0FiZnJtbTVTUlV3NWtnNFQyaUJZQ2lhV080K1gwY2NET2NtZ1JRN1phNk0rNjFFbDZzU2FVeEdmeklRRVZVMUJNQUFCV1BPdnlHNmdiakhrZUFOQkhmNCthMnMrTmVFelJjS3VpUzM5Y1liV2VSVElIV2dIOVdTN1NFekt5L0l3cXhEY3JpaHRJZTMrTHgvQkd5YWtkU0dENGJ5ZG1DZ3k0YkkzMkVBTTI1dDdmSUJjWmd6STB0cUx6TGtweDJqcnFnVlRHT1dQeG8xdFc0ek84VkR3bmkzU1l6ZVlBQUtNMDd4Z1BaMzJJOGNBQmdVWm5ITkswN3Jtc1VwOW1ISGJBSFN6anp3TUEyaU11NlRLTmE0dkd1T0pzeFREdEVFV1hycmorTjhGQWJ5bDlZdzZ5WEFTRXZmNUdXU3U0WnF3c0Zvc2NKNEJVTzBqS2dWdTlCZkMwd3pjdkFNQmJHN3ZwRjhDVHFIbUZ6b3l3YUl6N2dhMEtYa051MzlEL3I5MXd4WlBZRzdtSUNlTjhBMjdOVmVWV2k1d1FyS2Z4TkFJQVNnQlc1QmxsK0c4YUFFQ3RqOUdjQUNCVlBJNUZoalRQcmhaZTFJanMyMDdYREJEN3A1WHp0and5K0IxVlNYRUJBSS9BZ0xmNGpka2FjZnQ4RThrZGxUNWFmTDlQQTR6TVpXTXhvVXQ2S3VEK3Q3UURYc0pHc1hnQXB4UWJtNmRuSEVOZXNIYXJZdGExRmlmQ2xCcE5CclpncE5aVTRXQTRJRWF0cGhYQTRocTN3UXZ3SmhEUDFkRHBsbklMc3R4UzRtMFFaYnBYOFAxWjduTEdZT0R5NHRmNERFOWNyY3dwdXEvSGM2eFRNZUxpU3VONCtDSnM4bEhLZTk0MmJqYTQvdEQxanlRaHpUMVlwZkZmQlFDZzBUeUZ1T2srNUNhWElXeXk2WFRGc0M3anhsY21rTHRIZWV6STJDNDVQWmUrdzJXTENxSE5hYVdienFnUks3VjRQMEkwMU94TDJRajdqUWRTV0U4YUFBQlFzcFdKZXBNUUFwbFRlQWdjbjVZTFJRZ0FjSWJIQ1h4M2JFZEdsZ2dEZ0tkd2llQlFyRWFzM0tQRGZ4ZThlck13M3dVZ2hzc2VEd0dBTlRyMDk4bERXalpTTUZHNGFDN2hHNk1Vc0NVM3pHWHBXNDFRK2tMZ29OZUFBZG9TSm1PMnVhd1NhbjhPQUlEWmROOFhGUk1BSUFWV3hJZy9TWWo3eEFEQWMzZFp4T2VodnczZHBwaU1GdGUzWWtvYVVEaFdZamVjYm1RSnBXeFJuRzhiaURpWVlWQ0JlTW9lR1o5VnhhT2dwUmFpMGVaQ01PalN3VU1HNStKWThRZ2dTc1REbU9VMTc4TUM3VFpTL0RSMGlrUW9MWVVGM1ZMaWJiZ0Q2d2dMQ3VINExNT3hTNjUvdmpGSzRRMHVkRElNSEpFODY1UmowRnBNZk1LSTEwdE1WV01GeS9wN1FONFhqTlZ5MmcvTysycE9BR0R0MFFvQUsweGxFcTBGQ1Y5Z25qbURPNHU4SnNEaXdQZFJwZHNtcGxCcUhoMHBhaUxWSE1YbVBFbmdyUndTeU9ZVVBRbEhhWWUwRnZhYkI2N1NkR0w4UFM4QUVFQ0RSYXFHWVAxT3d1Ry9BU1RMVXlVVFFkYllLNFBnekprZCsrUXRLUUc3SFZNRDJmdUY5dlFKUE0veVdHSXEzUkdBMmgySVJjOHB2QTUwU2IrSkFBRGtGZXhRT01BQ0FKeWp2d29aU3RvM1hxVzJUR2w3V3BHckY4b0ZDMG5ReXhUcU93RUFmcVNFZE9YdjVoWGcvQ2dISjhOS3c1VUwrUU1CQU5lOXkvSzJOK0lQR2dRQTdudHdjZHYzZncwT3ZzNEFzLzlVUWZpYXE3MmlwTWRnL1lBbmxNSXlvdHdJVGlHT3U2YThSeGx1U2VoK3hGZzFHcGRENDUxRTlRcEx3YUk4NWFEaVpwWUQ0a0tENEZ1Rm5ZNkdqdzlqS2JEeHRZc3JlYkUzeEFySGFHNnBGOTZJMzFaSWIxaFFhSkppYWdlSzZ4QTlHZ1dLR1QveVkzbEdybU1wUVp0M25iNG0zc3V3MFNZcFhzOE1jUTBZZFNvQWlHV2NPVDZLWk04VUFOQU8vVnNIOVJtbFJZcFNYOFZsaFZzT0RDYTlKZFlqd0VMNlBvRGIyQUVZTlkzVEljYnNHdGljcjJIZHZNcDUrMTlRZ1AvelFOaFBZL2ZQZ1JlSXdXa2pBSUNVOG02bjhOZ1FnVUkrL0RWZ0xHdnNGY1hsM3dMN2ZvbEF6d21GOTVCemhYc0R2Vi80ckpma1NwOXdsN1VFVUJPaUNpR0ZBM2NwbkNOenpKbEJDL0FjQ1NmR0FNQTZyRFA4aGhZQTBFU1Jkc0FyaGdCZ1IybWNHcXVWdVg1bGhMVzFGSG9FNW1WbG4yRERMQ2dKYXo5b0FBQjRKaGR5QVFBWFZjbytnOE9wa1FEZ3B1LzNNNThYL1FBT1pVc2dRd3NEYUtrOFdneXdENWlsRHlNczBEMkZTTGhLYVRyeWMrWUZIQUJaWTB0aERhOFliRmRoaDM5dHVJZzFOdkkzNUJXeGN2NWx6Q0tyK2JHclZhQ3paSDdacTNKc3hGazVwVXRLUzk2a2ZIZSsrVm8zQnN1amdlUkNLWDE3MC9lUDllaGYxN2xPbjhQTnJCdUFSSSt6aTJ5Z2NRNTVZclNLaWlIWFAyWTl4QUNBMUo4UXQ2bWxBcmp2YW1XTGtRZXdCeW1ubGdBWDUwM0xlLzA5dmZzbUdLMU5TbFcxaUhxL0JadHpFd0F4ODFXMHJCVk5rR1dBMXFRVzl0dFcyTlliZEN0RUQ4L2ZOUWdBUElETHlLdEFldVVPSGY2c05Ea0o0QnNsWWFVMmczaXVOSTBNWEdQbzRXUjU4N2ZLemJ4VmNhVXZRWm9aS3hwcU1yU2FOc2lhRWlhTkFRQzB3enZRUnlvQXdOUnVBY0duOFA4ZkcyUnZQSVNsa3Q4clNPKzF3akdhZ05VSnpGTklVRThEL28wRUFEY0VBRnlJbGtoZDZXWUFnRTk5L3ovemhweGQwdFltUmJMT01wR1FMRkdHSG5BWkl3bkxVa3M3b2dPZDAvL0UxYzhrS0RSc080cHJraVUxWlU2K0FIYTQ1U0ptZGpoN0FEVFZ2eTRnNDkzMzMvRUxWMXQrMWhLdDJLRmJvMmE4OGFhRmdFTnFlbk8rZTc4U1A5OEJRMzVJbVFXYVIwUEdjOHNESjNFZFA3cGlxT29oaElnUVNQQXRCNDF6bnZkK25lRFpZWS9PWEFRQXZEWGNwc3d5WDNmWmdpUnJ3UHlYTEFrdHE0VG5TRE5vSElvU3NwK202NkJsNmNnYStwa0hBZGNKRE1jeVZqREZsdFZDc1V6eW00QVhBUVdNOWlCdGFoZGk1aGgrNDV0Z0NBQm82VzYzS095bmlSUnRLZGt3V3EwSlNZZGxTVmkrL1RNcmZCdGMyaVVZSjE2eU5DMkl6b0Rua0xYbnl5NHI1b1VoSUUwZFZEczdZZ0FBZVFEbzFjZ0xBQTRCYkozUno2UlpBRUFJaTQrOGJRb0JnR09qblZKNGw5czdCUUEvZWdjQTRCZnVkOFZSYmh1YlhWT1hRdGQ4TVpLZk8wNnU5c2ZranU1UWNwcTEvdkNRUjZQSUgvVUlpSEY3Q21ya0R5Y0thTUlCU0hVUm43bXNMcldXSjg4MzVzZitHVGZjWlJXNnU2NjJkcndsRWZ4M1JyaGhWTGxwNFhNZUsvbnVrMHI4dkdxa3ZLRHJ2dzNTZ3g3NU5YbUhYTWRYV2FmQ2UzbWl1RGl0SWh1Y3FoaDY3NDRJQUdJVlJ6SEFGZ0N3M0xQdENzc2NTOHdXNFcvZStuRnBIaWFOR0JkaW1POFJzY3ZLMVQ5MWVoRXRzVGZzb1VxOS9iUGtONVlhdmt2cGtkb2FQSWFiM3lIZENzdVJOTThZQU9DMTlpVmNmRjY3c0VqUmljS2RxQ25pNHJMUzZETG5KU1hPZjB5MnJhUjRCa0pxa04za1RXR2k4Z201L0RGYmlyMFluRnBkRHdBb2dWY0x6NEFVQU1DNThpendzNjIwTlNXN3JJVzRiUm9BV0ROQ0NqdktjNjNmKzRNRUFCai9qbWtDNENGaC9ad0ZRUEFXY0l0Q0RoWXpHRGtIV3hEZjVIUS9EZy9zdTFxMUswN1hZUVcwcjVYYmVNaEZMTjRKL3Y4NVpzc0hrTVRsZnd0ZUI4NCswRUlPK0cwdHlWOHU0M25SLzIrY0xYVzdyRENia2ZTQ2NkdytpSzIxUW96dHVaKy8zelpvbmNxTlRLdlZQcTNjY3BpcGk4SlJ3MFRDZk9MMFVwOWJ4Qld4SkhxMWpCS0xvTVZsWm1lVkp2bS93NEU4YmszUUtBWUE4SFkwbkhQK1VTYlo0cWhvdDM5TnRycFA0YU5vcVpkNXF0Y3hwd2N2R25rQndBMUt5YzByVWlTSGZ6ZnM3MjRqY3lGUEJzQ1JpOWVENkhacHVpMXlXUExsQmJNQXRDeVNQQUFBZFVOUUFHdzlBQUI2aVlBc1lZUjE1U0RlQU5Bc2JVa2htVXAyMndzUDZsNHBGOHhsaFZDNEduaXU5cnNyQ3JmdEh6d0FFS0xZRXlWRmp6V2ErV2JPeGxPVC91WHFVdHJHbTFKaVljZEFCRGwwdFdwK013WkJNSlpmM0ErcGNnOFR5SDlXcFQvV0FVZ2xBLzR5d1F1UUozZStROGswK01SL1g2d2NaK1c3czlyVkVya2N0WHp3VHI5d1h6VnduVDZpM0YwdWRidEd0NXhqNDJZbTNoZXBXQ25rUERieTJuY05GZWRCNHhwSzBiSU1YQkZDWjVpenpIbmM1UUFBMEZKbldlb2FEd3RMSDErYi8wOE5ma3BJcXlJay9JTnIvcVlCUmtQMTYzZkF6aUF3S2dkU1NCa0FXSlVuaGVQQTNLZHB4U1d2ZVdMNDhIOGNBQUQxNXYrZkJBQ0FKYXFrQ1lTdEdEeWZuVUNvRk5keUNBQnNPRjBIWURNQUFEU0F2QkE0aUJjSlBFL1RCUXR0a3V4MUs4UzhiYlFVejhPMjRVbitCdzhBdnFDWWRFd1RRQlpZaUFURUtVRENHTDhHWUtNMTRLYkIyOVllcGYvSlJueXJiTFJEY25teDJ0V0lNaDhwNlg5YW9SNk8yYWFtQS83VTM4NlJlOUNvYnl1WkJoZTY5eCs1MnNweG1rZmpPT0Q2MTVyVWdSQjF1a2F0VXlRcURoQ1RlcFdJa1pnS3lYbnRtTktGT2MzV0laR25MUEszOUROdFU0ZGNuTnRLck56SzY3Y2tqYlVTdzFyNTJGRWpGZEdhL3k4VWJnckhtVGNpWHI5UkF0aTQ3ekVjeGFHZGVZaVQ0NDJyNkhTeElmWTRhTjhXbGZSaUFFQTc1TFMvMTBqRUV0Nno2ajlndzJwd3JBQlloVGc2TmcwQXhFU1Y4TkNkVnpnbVZmQXduQ2c4anRpelFrcUFaUmRXQWtUdjNvaXp5OTR6K0JuemJkU3dTMExFN1l4d0FBNk5GdUllSFA0aGN3QVErZVBOdk9CMHNSODhtSTlkdUdRd2w1YjgzR1hGY0t5VXFRcmR0clREZk5MWklrR0hMbHhTVTd3U2QxMjZBRkJxTFlCTlY2dk9oMjc2ZC9sdGtVQ25rUm0xNm9VeC9YZldrMi9VV0ZwZFZ1em1MUml2VGNyWjVacnNvblBQYlJ6Q0FaYWJOMDlaNUNxa08rMGJ0eWFyOXZ1aDB3dGRUU2kvcTFXY0d6YzhSSnAyeGp6TWdTVzB4V0pkNkpHeXNsTkN0My8yK2oyRE5ma1pFSUJmRVFnWWMxa0pWVWtCWEtCdmI0a05EU2t4ZkhIdG9wWSsyaWIwUkxZQlB3WnowNjIvWnhLeGpMRkxDVEZoSDB3QVhDZFhPUjU2bWl3eHhyeFRpaDloYlJTdFRHMVZ5YUJoSGtlblM2OEZnSms1b1ZvQUxNSTBsUWdBWWczM2VnZ0FWSXhXaGJuUTJoOHNBUGdZbUw4cG1nQm5rTTdFZWZhYTlLK1FnTVExamVPSmxiU3NFR3JHRDZDUkI3RnlteFgvUjlMSUhSZVhBRTZ0QnZpTjRuN1RKSUhmNWJkRlZuSks5Y0tVeGhYbEdqVVdyc1dBTnhlTnE3QUc3Mk8xV2VKS01LaE5MWFdya1FBeGRRcXpYa0xyK1JEZWZjbVBjZDZGVlNENWUydWVPYTFpb3ZTOTdNSlMyMktNYmhtWktWb1o2cGpzTDNyOUpQMzFqcXN0Qll1TStVWFlWOEl1MzRROXlBQjdocGp4QThRWFdYRzE0akd5RnI0TWdCMysrNkx5OTh5NytVb2htYzY1Yk1WS0pnQ3VLS21CeU9OZ1dXS2MzeGhuWVpmU3RlY01EczIzTGx4Uk5BWUF5c1NQU0trRzJFTXB2WXRHeUdRdnAxMUN6eVhMMjZQblUyc01QS3pmcTZuZTk0Y0FBS1JNcWtiUUMya0NZTHBlU1ByM2tiLzFDekdOMFhlUDAzVy9XY1dNRDNNMmhNaG1QelhpL3dQd1hrSk9TaTBDaEFadjF1bDE0MU9LQXIzTGIxdFF4cVRWQzg5VDk1MDNRYVBHd3R3VEZQbzVvc04vUGFHdEVSOGpkT2lFV2lnTlVBTkVscjRGbDFibWZIZnQyL0FoYlhubXVISWo5NDFoTE9zV3pYeVUwTzFmRS83aGd4RkRVcjhpMW4wSWpFbk1YK3JOSDdsYWFXWVd3Tkw2a3o1US9FYld3azNEQnFYKy9ZQmkzMTdEUlFJcktpN1M3WlpMQUtObllJYzhLaUpMUEtKa0hCU29mMDNGYmdNOEdKS1ZzTzJ5dWdwbzI4UURNSm5BQWRoeHRaTElTeFQ2c0pRQVJ5bEZkc05ZWDZrMmFaM09IeTE5ZGRGbDZ3ZElzendQMnUvV1ZPLzdRd0FBdi9BMzh4c3VyZ213QTgvNk81Y20vWXR1d0YvNkd3SHlBTHFkWGtGTDh1MnRZajRGZ3dYNzk0RlVKeTFtSGlzRGZPcDB3Uit1b0ZkeGFXV0IzK1czMVc0Sk1iR0xXT05GM0tpeGFERlU5bGJzNVdnY1AyOVgzTTR4dDJKTUIwQUxpVmdwV21VQXFHV1hWVHJiUzhncUdUSThjMW91L1Q3MVhWSDRIbnlnM1FlaVhraVhnclh3WitrbTNxSVFVbjhlQVAxYU9LWUNZYndUdUdscU9nK2RCb2x2SHpJSmRpaDlURnVyN0xVNUNQdzlwNTk5RGFIRUxuQnhhNVVFY2Yyc0taNEJQQ3lIWExaNnE1QU9MWUNHN24xWlk3c3VxN1JYZ1hWNGJKQ1k4VFp0QVFCay9PTWhpWmtCcVRvQSs1QUtXbzl0MHBRZTI0aHJJb0pNMkdLaEIvNzltdXA5ZndnQTRLZEdDaEFXTjlEY21TSHBYOHhMRjBQd3NUY0UxOXlsMElnbXdzSHBieGJ4eDFJVis4YlpZaWNzU25TRDNLcnNpdjNHMVlyTUlNRUtoVkYyQStFQ1RJOTZud0JBUWpqZitHOVl6ZG5LN3hnQW9KeXB4WjdXbWthZ3c5aXo2TDhYQW0wOEVRQVVpQlJwRlhsQ2taWlRlTTlqeW9IbkVBZW4xdkhoakFUSkk2WHZFK2liMWVCd1h6d0VraDd1ZTY2ZWRxUVF4alRPajZTakNpRTFCZ0NZa0hrTTVDdThoV3M2RDMyQmRFb3RSVEpsclZiSWxsZ0NOSThoZkJvTGEvS0ZhY1B3RE9DRnBSUFNjSVYwcUJFME1Vdm0yRmhqR1BzL2NMVTFBeGhralFibXRoeHdsVzhCMkVnVkFwSjludGMyYVVxUGoybS9Ed0xoVmxvcStSRC9wcVo2Mys4TEFFQ3lRdDVENHNmZVJTZlB3cHVBNWM1RVlvUzJhRkg2Ri9QU1A2SndRNml1ZFJtZW8ybEFzNUd5L2taRDdRSk1yanU3RGoyUEVXL3pRNVFlaFVheVFodUVGLys3L0xhYWthMWNvVjBWQUlUR1lnR0FldCtWQVlEa0I3ZDVvOW9kYUJyYlBrWUdrclJJTHZJMFF5Q0E4OTIxblBkMWNqZUs5NGpUUlRsTFFqd0ozSGNaK3NaS2czaUx0b2k1UEg1TjlwZEIvMTFLUi8xUklnQ1EvdVZ3Mm5hWEZReVhJQTdQT2c4V055TEZBMkFkMlBzd2R6RUJtcThqYTM5TFdaZm8rYWdZdkF5NXNFaCsrME0vdHhadkFUVVZ5c1lhRSsvUUpvd1R2eTBUVHkwQWtOcFNBRURsaW8yZmNRLzJlN3VmS3dsbjlFWElnZHIrbHIrcnFkNlhZUE5DS2NOWEFnQXo0QUpFNUxWQmFXKzlrVVBpaC81bS9yR0xhd0lJS3pkRWpPQmJOa29QLzBqSk9tZ3pDRWY0REQ2QUI1UmMySlMvMFhnSnNmblVia3g5Qm05Z3kzaUhtWndBb0ZIZk5qU245VFpPWTJ2VVdMcU5PRzY5YlpOWXpaTHl5ZVdSdGJLM25Ka1NXL05ZRFJDVkY0WHNKQ0FBODkxWlpReDVBVXVRSlZDZzcyenBKQlNkbmt1L0RYMFhYYmJNOEJDQWw0ZXVWcUhUR3YrNjRaM1FRUCtGaC9GZktod0FhMjJpd05JcUVCcGxQb2JoWml4YUF6MUtGc0FtcFY1aXlPTkdoQU1RKzN2TmxxU3VmYkVKMnA3VVZQOWtYZDN6UU9PR3k0cGxzYWFDdFE1MkFGQ3RnYnQrTTdKdk9MeXlrWE1mYWpZd1ptKzNydmlNVys1U1ZmU0ZuOE0yUDJjcDVFQnRmN2Y3UGxvZFZPK0xoSkkyWEZnMGpEUFN2aFFBSUxINVR5bG5sZU56d3ZMRkdNd3lFRG0wdExjYkVKZjdXNzg1UDRMYzlOdmtEa1JYMDRMeVBJMFk4UXFRc2JDQUw3VEdmd0JBZzFtNEdJZGZVc2FFK3R0OVN1dys1Vzg0TGZHemhQbGNNVzVNWGE1V3FXNGw4QTdpSm4yWDN6WTBQL1cySlVweGJOUllNTDQ5MDREM1hZWVV3UkgvdmUvNGJ5OTFDN2hwK2U5NTE3elVYdWdnRUlENTdpdE9WeG1UeklCcGlqVjJ3RzN6cGF0VlNoVFdlYXp2T1loakRrSFk0cVZ5STQ2TmYxYkorRUhCTHdIOUZ4N0d2M2E2L29lMk5xVkd3aUljL0ZPUS85MExoLzh6YjZzMHJ3Z0tNQzBSaS84NlhYUlMvMzRpa0FXUXV2YkZKbWg3VXJNem5GSHhtWkZPT1E3cllORllCMFhZRjdQR3QrVjlnN0xXYzRaOWpPMUR0b0V4ZTd0eXhXZGNkNWYxSGg2Nnk3TFdxZVJBYTM4L2M1YzFCKzY1eXpvb0RDUW5ZVDlpWTlud0dvKzBBSUMvcFZ1NXBoZzM2Z2M4VFVRRnlaSFg5T2hsRWYzV0kvTWYrTTJKdDFLcldwMVV1RW9oUnFEMHJ3alQvT1M4L1FzQ0dpdzVPZ3pHa3NjMDViTDYyL1g4VGF0eVdNYm1jMFl4bW0wS0F0ZElKdndPbmUvNDI0Ym1wOTQyVFRleFJvMEZaWml0K2N6YnBvQ2QvNFYveDYvY1pibGJiSTFhODFKVUNrSEFrSitIQ1NYZlhScXFuSTBxc1VZNVhKOG9JRUJZNTIrTnZ1V2RKNEEvMCtPeVVzbDV4czlyNEEzZGhxLzVkU2lnL3k5ejdIZXNnQ2R6TVV3OGl4WTQvTDlXdkNMeXpxd2VKKzlyU1hGYkVzNzg5NXI2WnVyYW40YXhUU2ZZR2RaUitaVUhHMCtWT0RldWc1bkFHcE0wNnFtRWZZTUNhWk4xMkJITkJzYnM3Y3dWbi9HSi84WTMvTHE3NjJybDdrTjJPN1MvNy9vK2I3cExZVHRNYisybjc0QnR5dWhYTXRLK0VBREF0M0pack9nQ0hIQ1hjcDlNVkNpNFN6bFVGT1g0U2ptUS85SWZTbG8xTUhRMURTaEVDb3NZd1VWcEpBNzR6d05Bb3hQaU15UEtjNFJzMVEydW1MeC9nNU10UmlvMm4yS0EyR2pHU0NiV083ekxieHVibjNxYWZHOXh3elpxTEh4Z051Sjk4ZUQ0alRjTW4vdHZmNTFhbzliOGJRSUJza2I2WVZ4ajNoQmdHNE4rK3luVytBd09BUVlCWGZTTlUvcnU4bjhyNVZQdjF6bCtkc1hmbzR5Zmk5di8zNXkzL3l6bmZoOTJsK3B1L2Y1ZFVINWEzSy9pRW4rcHZQT1l5NnJINGZ1aUZQZGpBMUNGL3A2cll1WmQrNFhBdU5uT2FCTGZ0d2dFOERxUWI2YXRBN1JKd3duN1J0SWIrLzNmMWJNdjJRYkc3TzNvRloveEMyL2JQd1hnZnllUkhKaHlwbDN6YS95M0xwcytqM01sMzRIYm9OTHY5NkZ5QVFBLzg0YjhNNWN0dVNveHpCWS9rVkk3dmRjL3ROOVBnclIrSUM3SUJtcHhsNFZjN3Z1K3YvVFArdlY3ZnJhNGJxem5kYm5MR3ZGOVJtT2locmg5c2Y3M2E0Z0hpZHlsaktFUFlqNXlPN3J2amVOamNCZGpSYnl2L0x0L0NuUDR2cDc3UXlCMTNvU2J5VXNnd1BYU3R4cFFudjhVZ01YdmtLbi9kLzcvL3p2bjdSK2R0Ly9FRy9lLzhRQlBVa3EvaEFORk5vWUltUFFHdmwxS2s3enZEdC92Y3pnWVE4U2ZXSCtvSi80YVhINlAvQnplOG5QOVNlS1k4TkI2QVlaY1FQSEgvcHRKV2U2ZmVDRCtOOG9OcnhzTXNCajJDY29WSHdkRDJBL2Y4aVVZR1NsSi9aRi83aWV3eHdXMHRNSWFHWFJoR1doY0oxS0N1bG45Zmd5R3RvMVNPcWZJYXpBR3hyWVBESElCRGdyMnJuelU1SGR2VnQvWENCaStvTFU1QUFmM0dBSEVNWmlySVFCYlVtRG51Vi8vZDd3dFllREdJSU1QemhCUXdjTjN6QUNzQmVXZHhQTnp3MTFXbDMwTy9CMXR6RmJmQTRvdGVRU0E2NDVod3hDOGpBVkFGc29UWi9yL285QS9PSUJ2QU1PVVdjeVl6alNpdk15WU1kZ1FrdjdzUFQ4YnlSc3ZqZWNOQjVDcmh0NGVBWkRndzFmYkhPd2lmUW54b3hhblY4VFR3TXo3ZXU1UEV6MDVZOHJtTlc4ZnRENy8vZlAyajgvYm41MjN2d0lQRXRjNGVONmdHMFRNQzVJSDNXdjk0WTFUZ0ZBSE1MQ2ZnTkc5bmpnbXZ2VThCNExjRGQvUEZ4NE0vTmFEdHA5NUlLWEZlRWZCQlR2blk1Nm9GamNMWVpWUitKWUNBckFrdFJ4RzE0M0RpS1ZhTFJsb0RpRjgxY1IrdjNDMVNxVW82cVR4QnJEaUl1bytNTC9pVlpQbjVJc205bTE1aFdSdGpwSHJmcFpDQXVMeW5vUjEyd2Q3Q3c5RkxYUXpDMzJ4Ni94ZUlGUXhUcUVhZkNkZXl3WEYrOElYREI3emxCRnV3ekRJbUdKTG5rTW82K0VWKzVmMVY5Ti9EQUI4Q2dmd1E4V2RpRVo4RXVJWTJzZWRob1hFc2JSV2lxWGRlTS9QWnJUWVRjK2JBTFJ2eFlONEVjb0h4SnR2QVJZaDZwRFBVaHhPZE0xZmd3ZENxNGozVkpuRDkvWGNYem03c2h2R1NQbDdoZUtQdDJCdC9ydm43VDg4YjM5NjN2N0NoeHArQXMvVnFoeGVKWVk0azhDRHlCUGYwL3JEK054b3hGVitLeUV1cXNVOXhkMzN3SCtYTzc2dm0wRHUrbzMzb2xnc2J5Rk5TUzBLMUtvdkFvbndyY3NxRTdZUlEvOWpmM1BFRzVxRVlQcUF5SVJTcmFoNmlPdUV2UXpONnZlbUM5Y3FLVUVXeGJLN2xJY1ZlekVQejVvaFFsOTdrK2ZrWmhQN3RzSVlBbnBtaUh4YUpGSWdrazluZ0NmQ2g5WkRnM2hkcFBVM0ErLzcyT20xSDk3Q1dKY1QzNG16UHg3QWV1aWkvVGdEb0xCSTd5anZLZXRnMGhqdmZRcFhhZjB2Ry8wajBWTHRQd1lBcnRNQjNLb1FpcVp5Zk53RkluZG9pT29oRU1uZTE3T2ZLR2h4ako0bmV1SExMazJ1RVl2TURDdUhMeThVWWVLaXBrRVh1UkdISW1EbStudDg3c2NLeVVuTDVsaWg3MlV4a0w4akdNTGEvQS9PMno4NWIzL3VPUjJZUm5yTjFWYVU2eVZtN0ZWWnYxb214RU9YVC82VDF3dHFwaU1SYjlCd3Y4YVkwUnJ6V1E3aEYvNmJQZmJ2amVsZGNsTzA4cnhYM2FXY3E2ajg3VkdLRjFaSEhGTUF5RjMvSEx3NXZsSlNGNldHdWtpMWlndzBwaEZxWG9abTlYdlhaWVdLTU4xSzh1bGxMamJkcFVMZGdzdVdIRjV6dFJvTFhVMmVrN3RON0J1SmpKd2VLb0J4RGRMdHJCVFJWZGhiVTNSb2laM1JSTk8ySVkxVjlDc2tnK0M1QXNxbndmNnNVN29sdmxQSjFkWnhRQkxtRXdCUi9aQ1NQUmNZTS9hOVpvd1gxU3hmdWRxS3F0dy92L3QyU3Y4eEFIRExjQk1WbE52QVdpVC9GMTltSVlDb25nRnovMzA5KzRYQnJsK2c1NVdVL0ZVcmg1TzEvdm53WGFOY1ZLNisxZ1dzMVFseXpSVU1ZdEJYNy9HNVFuTDcydFVXWDJFOUI4eEIxM0pmdjA4eDlPdnkzenR2LzlGNSs2ZWVQQ3FFUnFrbjhaWGhkUmluM05pcjVQeHFXZ2phT0dNRlFMUzhjKzBXUGFTRVJXSzUwVnJ1YzRmdlF6Z0dMYTVXNEVWQ0RBellVT1JGaEZ0UTRlM0lYUW9KWVlsa1M2V1BDWENjVG9iaVJTSWh1Kyt5UWtMb1pVQ1NiYlA2WmVWUVZnR1ZPUkdWdTEwL0YydnVNdDllVkFYeFdUSS9ONXI4N3ZlYTFEZnVOVTVsRkUyQWJaZVZXTVpXaG5rUkRYdyt0Q1JNWWxWdVBYSzY4Rm1MMHdzMVNhR25YWGNwQUhYbyswSEJvcEFDSko0VkNNWlgzR1g5Q3h5ekpvYkU0K1c5d2xWaVo2SC83VUQvQjByL1dGK2hQUVlBN2hIQ1FUY1Jpb3FVWUtCbDVlUGlZRXVBZmhsUk1aUDNYVCs3eFhCVjg4MEhkZE0xVlR0TnhVa3JNb09ITHk0VXJmNDZsNmRkTk1BTXB3YTlyK2RlZDNxOUJYR1pZdTBFMlhTYXhqOExPbW5Fdng4VDhlOE9HVG4yT29qMitWVlV2elExUkFFQWVVdUFWc0FBN29JUkxBYmNyeTljWEIyTmxjbVFHSXNFUVpSNGZRS2NEcXVlQU1xOEhzTmVPM0xab2xXbzB6K3U1SlJyS1hCNFE5UGtpN0VNTTNvWk1NMzJkUlA3ZmViaWRkNUY5aGpsYnVWaUlsSzhCOFlhdXRYa2QzOEt2S1pHOXYzUzZRWE5VQjJ5NG5RSmF2eFp4VjFXRVpSRGkzVVBOSVhJaTM2K2Rib2tyeVZkTFdBTXBhdFBqSGZhY2JvUUUxZVZ4QXZHcmpIbTBIaG55U1AwaWp5S0ROS3MvbEdpZU5kbDZ5dDhyNW9aQXdDUElLWmp1WWxrRWhsOVZBaFZoVFMxTlZuTmQvM3NYbmkyZFdqZzgyVFNSZE5lbXFYVHJrbk00dUY3NUd6OStBRVkvendnYWdRenVFbnd3SHhmejcyUkFBQlFaejlWcC9xUERlTGZieFhpWHh2RkMxa3VHWFcvejF5NjduZTlBT0FFMWdnM2VmNHgzYUpaTW5jUTNLRVdBUGhHTVlRaGhuQ2Z3ak40NEdxVk1iR2k0Q2tZTDNFNXlnSEkxZjRXSUZUU0RTRC9qdE5GY0ZoU3Rnd0hVWmtBeGlwNFNyQUNhTFA2ZlJueDh1RGxRSXJjbkxoc1NmRXkzTXpZaTNUbkhiejdHK0ExTmFydlZtT3ZZWkdvTXhnL0ZzemFoK2VjS29jV1YzZGxBTEFObHovTkE5QUJZOVdxcDFiaGZKRENSZmdOclNxUWhRQVhSQTduVXhvenJ3K3VmOEFlSWF5Nk9LbDRtNnBHL3dkSy96VnF1VEVBOEF4ZWdGMm82NEJvVDhCb2JaTUxjZ3VNUTVrMkFMdFZoc2pnWCtYWlcxZDROaS9rSWh3YVVpbnFvdHJmdno1di8rVjUrNjk4KzljNUFZQXN3RU40UCtzZ1puUzU1MnJsUVZHWFh3UWozdGR6djRvQUFOd29aZmlHRzRZSFFJU1Qvc1FnL24wV0lQNWh2SkFMSnAzQ3pTRlA1YTk2QVlCVXNlUCt5bkJBbk5FdGNjMWxWZEg2QUtTbUFBQk5pR1VHMHRVdzh3SlQwclQrcFFnWEZ1TXBBampjZzF0SXlLTWpYcjZRREM1V2xpc0QwTUM2OVZJK2x2WHhtOVZ2UzRUbmdUTExlM0FJbkVIZlc3Qi9tRWR5cjhudnJ2R29ydHEzcEhwcXBkdHhyeDNCK0RlQVBMb0JseXNFbDFqT0hBR2t4Z0hZQXZ2UEhBRGNqL1BPTGw5ZE10N3BSRm5QQXRyYW5WNEQ0b0QrVHQ2TFEwRllOWkZ0U2ovTnE0eTNwTHlYMVQrVy95Nnh6WTRCQUhZL29HWTJMb3dEY0Z1dUtzemdWWHFwSTNLcllIVTdqUFhVKzJ3a2xkWHo3RjVsSWUrQm0rbS9PRy8vNXJ6OTIvUDIzL3YyYitzRUFGaU8xVHFJV2V0LzI0V0xYTHhKQUFETmZ1NVh4QUhBdEtseHhaT0RPdkZzWEVTSC9JNG4vdjB6aGZpSHBGR04rRGRQdDRWVEFFQjRZMDJ0L2IxR1JxWTNCd0RZcDc1S1FPVEJzcmtuY1BQaWtyemRpUUJBMnhORllLalBRVnkzUUo0d3EyREtHZDIwNWx4dE5jd1VqNDdJMW9ZSzRWUm92NjVUK0diUDJHdk42cmMxa09reEN4d2hCQURvbHEwNHZjb2lacEkwODkweGxqd043MXh2MzVoaE1raXhlUVNNRENBV0lYMTBDVUlGQjVFRHQ0L3NNOHNsRndGWTRWNnhMa0ZZc1hVWjNtblJBQXBZZ0dyTXhhczRJcEJaSkRMb3RyRmY4UUxXUVRZVGl6cWRLZXRwWHVsZnE1ajdYZjh4QVBDYWJzUG82a0xYMEJZaEQyWUdJOE5UNGtGSExsdjFhZDdWYXN1blBudEhhZHVFQ1BNOHU1L2NSYmlRTHc3NS8vYTgvWS9uN1g4OWIvKzcvNzhwQUFBUEJVNFpDaDNFN0w3ZXB3MFY4d0M4aitjS0VmQ1cwL1hkcHloN1l3VU9wWkJPdFJEL2ZxQVEvKzVIaUgvb2pqeUIyM2VWeHIrWTBCWW8xYWk3RGdDd1NOa2tSUWpSVk9DbXpaNFJNWVF4QUJEYUYwZzR0RkxTTkZlcmRiano3NXdtQUlESEZPWUxFUnJYSWF0bjNjV0xwanpQMGE4Y0lDbjl0aXBwWmN4cjJRRnY0U0c0Wk5FRHRHV0F1dnM1M3ozUG5MU1NWMitKdkRmYzk3SUMwcVh2RmNnd0tSanpzQXMzZWdTTUVrS1loQlJ1OUFnZTBZSExGdzIyejhqZzN6YThpRnoxY1IrNEsxaWxjUkpTSVl1UnNOcFlJQ1NoZ1lZWjRMQmhlZWF6Z0FlMmk4NUFuQ1B0WmoraGVBclF2bVVLUGNVQXdCdkYzWUszNFRLUVF6YUFUWGxJek9BeXhIU0toUFQybGNPa1ArSFpCN0JROTRpTmpId0FlWFlweDdNMWtzbWh2LzMvMStmdGYvQUgvLzkxM3Y3dlJBQVFFZzJKSGNTYSt4cm5YZ05Qa3FQN3JwOHI0a0QzM0tYZ2lGYmhEV054ZVNwVnhZaC9yd0xzZFViejJ3WUFFRFp1ckkzVHJSbkZPbElCQU9wSnpJUEIzYVdEbEErTXdRZ0FxQ3A3Z2huQ3lEUFF5djVhWkt1cTR0NUhBMzZzakZNTEFUeFBTQnZib0hDZVZJb1RBR3NWVFhsSzhWbE9sVnlOOUszbGt3c3d3dXlrYmdNQVZDRGNXQ0xQMDNFQTFEMEc3MmVma3JvcTc3MUo3NzBGbmlsdFRpU2JoZytUYldyckxsdG9hUmJBOHpZQlNDeS96bUNsQkR5YlkvSWNDSDlnQ0R3b2ZIcytDZHlLclhyM2h3SFFPVXdlWFJ3TFZ4NGNTK1RWV0FCZ2g0QXlBb0J4bXFNWUFMQ0kwK2dsNGJObVNyRTc0dWxBKzFxSUFRQk8yMW9sTnpDN2lRNGhmblFBY2MwcUVSMDBkL0lxdUg0SEU1KzlSb01zdzYwT0NTd1lyMHg1dG9hNGpuM2MvOEwxL3orZHQvL2p2UDAvT1FDQUpSczZGem1JTVVhSFpKZGRpblZKdmpqTHI3Nkw1N0pPdW9BUEZoelJ2dW1PeTFlck9vWDQxNk53T0xZTWc2UUJBRmtMWTBaRGhUMlVjbVdscmxRQUlLcDlrd1NNK0gzWDZWWVhBZ0FuU2tiTUlibWpqeUNFeGk3cHZnUUFJR09ZVmNpVkZ2RUlRem90U3BodndjanVxUkNvMzZONEw0T1hGMGI2MURLRUVmY2lmVnNFVEs0ak1FejlDMkJHNzJNTTFNbTdYK1c5OStGd0xpcGt2YzVBNXNJaGZWUFJvZUMxZFdpUVlQdU50WGhHQnpuYTJXNGpmcjVISHVSVUFHQ0ZuWmpUdFV3aGd4WHdnb21ZM0x6aFJ0K2kxTm8zZ2ZmaEVNQUM5RjJNY0hZc0FJQTI2NFRzd3FUeGZZK3RjeWtHQUhvTTlIRU1Od0Iwa1ZmQm9KUUkrVmJoNHl6RFFJNlZ1Tkp3NHJPWEZRQlFncmdxRWkzSzNrQ2xQTnU2dmYwckR3RCs1L1AyZjU2My96Y0hBR0Job1lKaFhQa2cxbGlyT1BlekxxdkZQa281dXMxK0xtcWVEeEQ0c0FSSHRBVjZtZ2dBbVBoMzA5a1YwTmh6ZEVTRUd3WUF1SmxtQXcxVElMR2FscWJNRndNQXJOcUg2SDAzY09NZVNlUUFjTnRSZUFZSGhvY2hGUUFzQmc0NEt3M3dNUjEweU5QWXBHd2JMV1hzR01KNDZ3cDRZUmE5UmlDVy9vNElITVVJbUN6TUlzQnR5V1dGV1haY1ZpQnBrMERkTGhudlFzNzNQcWIzUmtJMGdvQkoyRXRET1lHcHRyWXNBQkE2QkRsMjNxK0VVQmFJUHlZWE5reTk2NjhEQVBDK25LSDl6RUpkUlFDaDZGMUdyNDF3RWtLQ1VGVTZyMWFOdmtQZWFNMTdZZG1zU1FJNm9UMmJCQUI2RmZiaEFhRjdqRW5nejVmb2dENG04aGk2Wk1zUmw1TDE3QVVEQUN3Qk8zUVBOc1lXNU1GYnp4NXBrZ2NBcFlVN0E4YVZEK0pGOHJCd09nbzJGSTVCVjJnem5yc0l6OFJhNmFnU3BnbU9URkJXd2I3aHpyS3lBSDZrRVA4ZUtjUy9LUVhGYzhxTjVTSXJSbHBOUHEwMzNKYTcyVEswbG1xZkZYUFhNZzlTc2dCUUpuUk40UmtjSys3QjRSd0FnSGt5NkNuaXRDYmtpZUR0U2VOcENHbHVuMjZGRlVpZnRHN1NXdTczR3FWUHlhMVhEdWhkNG9nY0tBVE1RY1hMeERmMGZRVlE0RGlzTEltUnhQYytvdmRtVUhlazhIVEVKalFMQUdqaVBGWWNIRGxEQ0hZay9NTjJiVGJBMFVvQkFLeUdLalZqUWtKZDIwQWFaeTBFSkNscjJScVlCbWg5TDFralZvcWgyRDZOdjJDRkRTYUlpSGxsQUJBU0d0a0M0Z3dld1BpaDUrRWw5aUNGckdqMGh3Z3g5dXlWQUFBUTQxNGlEOEFXR056UXM1dkJBYmdQdCtHT3hJT1lpWTlNQ0dPMHZLcTRXeHY5M0RWSWs1Rm5McnRhN2ZjdWx5Wm1VZ25rald0WkFEOVZpSC9QRk9MZkxCMG9KOFNxWHpFQXdIWkNXemNZMWlIU0ZodGFUUWx3QlR3Q2x0RXRKdXdSTFY0cE5SY1d5RTNOM2hjRTRha0FJRVI4bWlYWFBHcklXK3V4RWtuUDJpYndzcXZjZ3JUYzcwMVlDMGZBRFZxRHZjUy9vd0dqRGlXOWxJVlpxcEJ4VktId3FBWHF4aExmRzdrYnF4UXlDZTJud2pzQ0FMaFcrRkJHellNMjRvQ0kydWdrTlNsbTB3ZHpud2NBWUQwVUxJa2RFdW82aFBubU1CbG1qYlVFc3B1UURJb2h1U093T1dYS1NKdWhDMXdlQURDZVk4OG1BUUNlNkMySU43RTdYWE5UemdDWkIxMDZTOFNDUERUU3lxeG5seUJsZ3dFQUMwd2NLUWRubm1kcldRRC94bWNCL0MvbjdYOUxCQUMzM2FXTWFPcEJ2RXl1SW5UVkZpR3JZUThRUDd2UEcvbGN6UERBVkVMV2ZoZFhLVXVEb3VBSWhvYU9sZkNDNWpLK3VEVmVWRXY3VkNIK29ac3ZSdnpUdkVlblJzeWMyMzRneFNxbXpGZUZIR2R1dUFaVENVaDVBSUJVWFp4MHRSS3FlWTI2QmdBczR0T2M0UjE2cVpBbFdhRnhuL2I2QW9WMFFrU283a0R1ZHhWdTk4Sm1ueVBPU3dXQTBTYTVaaTFoRmx6UEI1UjF3YmMrUzdVdTliMGxlMk1PU0pNYkFiY3llamZmSndEZzBKNWtnVWlwNlVFZ0IwcERyazFySFFEZ3NiK010THJMS29YV1BKekFQcTNDZDl4MHRVcUkvYTVXQ1pDMUNWQWNxd3I5bjBHR2lNVmw2ZnA5QXdEYml0dWNBUUErUUdKajdLYWVvY0drQUFEdDJkckhPNkVQZVVoWkFITUp6dzdwQUZ4c2dBc2RnUC9HcHdQK2R5NU5CNkNlZ3hnTklpTDZaWXBybndRMldhT2V1KzAzd3hIRlpRK05YUFZCSmUxUEV4eEJWK3VxcXkxZUk1cjFVbjc0Z3ZoM3pTRCtGUktKZjhzS0IrSE1ZTTF6cXdjQXlEalBnS0NIN2ZBZEFZQkNnNHc2ci9HaTRzMUJlVlAyRGdrL0phVm13cHFTNXgwMWJJSFk2UW1GUExRUVR3a0FQNE96Y1NVN3lmSXlyZEU3YnhCUTBsanVvZmMrb2x2OVd3QjFNZEthcklIZkJ3RHdyajBBV0o2NDEvQUE3THBhWmNKRENoVnRLdGxQb1pBTmlxeVY0ZEswci93M2k4dnlld01BTExkNVhnL0FxaEkzekFNQVlpRUFWbGM3b2F5QmhZUm5XMHFBS0dtSlNvRFNVZ0RBeTBEdUtPWnFvekFHNTk2dlV3ejNMQUVBWE9XNVNQTEVXR1k1NENvdEtDNTUxaE9vR21Rck1TZ1NBOFB5dzBMOHUrZDB5ZFFaQmJTZFV2cmlBb0FSM2lBN0NTMFBBRUFQRFJyYVBXck5CZ0JZaHo2RjRad0hBQ3hSN1A2VWdMZFZHVEJVTmJFSVlUeU15K0tOT2dRQU5CR2RNaDI4b2JZUGJ2eVFrUzA2VzNBRnlhVHppYWxmb2ZmV3dNaWd3cUl2RTk4RiszK1hBQ0RHWDNsWEhBQXNUendDMlR4b2w5WXB6RlFDMG1WVklaL0xPTFRVWmt3MVIvVkRqYUIrN0dxVkFQSGJwZ0tBK1hmRkFTalRRdVFER04xbEdnY2dGSWRuQUdDNVU3ZkJCUmJMQWpoUUNEZXhaMnUxQUxpb3hURzRjcVI5R3pCSVhCYVhpenV3WWh2ZThQSHd3dGk4TExBUUFHakVjNUhrS1RlN0RRSUdtdXdyYThrTDBqNXl1aXJhTkdRVVlDdEFoa0dNK0tlNWNURU5sTnVPcTVYTFhJMjBGZkowaUZnUmozZFZJUnZpK2xoWFFtUFRDdUMrS2djQWpla2lBUGM5cDB1RmlyczRGUUF3ZXg5QndMN1RLd1AyS2Z5UUdjVjlla0J4V1d6VndIN3JEOHpOY1dLNHh6cWt0YkNGSmJrNkRvZGJ5ZzJ1MzhoREQ1SHBobzAwc2VOM0NBQlNzd0JtM2tNV0FCWjJlMnRrOXZBZVdWWjRTcHFhbmhYR09xUUx6cXE3MUY5aDVjTXEyYWlRSjZ2MFBySUErT0ZIU2hiQXNaSUZzS1JrQVZoTWZJNnphY0lTNVN0a0FlQi9pejI3VlZrMG1KKzhUYTZjTWh6SWxrRzZDWVExZGxuUHVFdWRkbWI5SXFPYWkydVV3WmhZQUtBUno5MGxBRmNFcEZzT3BQQnB4cXlzc1BFeDlpVTZCZGltd0gyTXhML1hocGNCWGJKbkNqZUVtK2FxbkF1MFdYZFpwbFIwK1YvU3UwekRiU1prYURrME51SFNGTVZTc3dEV2xkdk5KcVRzblFXTVR5b0FZSkM4RDhEVTRuY01PbDNzYTUzY3B5ZXV0c2hYMldVTHRWZ0F3RHFRcWtiSVVHdDVEdEVUcDh2d0R0Y0JBRUtIR3hjUUt2d2VBZ0JMbGhxQmMrYzcwZ0dJU1FlanFpRUtjMm1oSXlaV2htU0dPYnZtTGZRZnl0Tm5EWVAzcGdQQXhWc3dOM2tmNHVwY1FXb0xidUV4SFFEZU5LemVoQVBmVThndDFpRWZBZ2V4Wjc4Z3R4RXJsSzJDZTdJRWl6WUVBSzY3V3JXNlhvakxUZ1J5N3pmaDFyWkxhWGtXQUpBRHN4SFA1VXlEWlhxWFkyTWVCdzIzSUpLcjVGQ1ljRm1sUW13WUd0Q0lmMXdyWWdlTS9iY0pSdDRLbzR3YmJRd0FUcGU3MUZ0b2h4dnRhQTVEaTNvS211NEYzaXhaRnowRUFEU3dzdytaSGFlMFovbUF6aE5QWkpDOEJ5REFTZ3ZVaEtIUXE0UnBlcGd0VVVvSUFjVDAyZmR5TkQ2RUxJTnZHV1JPWnk0RDhJb0JnRlFQZ0pVbi9xNEFRRjhnRkdHbG1RNjZ4aW9CbmtVdUlwWjBNTHYxaHlNQUQ3OXY2SVorcUtUcEZZd2Jla2pFcU9EeUtRR212SHN1SlVBdThGQWg5eTBlQmh5THg0L0phbng4bytmcVZVd1EybGFlblFvQUt1Q0tpVDM3Q1JCSGVpRE9OZ21oalVYRDAyQVpKTmFydDZyVnJTdUgvSnB4T3k4WkFBQVB6S3MrbCtOeHpFR291bHA1NEFsZzhFNHE0Rkc3S1hHdEFtelk3ME9EK0RkUFlMVHFzalcrNndFQXd3b2pHWnNvTC9hNGJDbnB2SUlydzdDK3RKTEZ4d2JISWdRQVRnUEUyRlBZazFqTG8xNGxRSkZGZmd2ZkFVSEFxWkh5WmhtM1krSzlyTG1zWGtJS0NiQWU3NGpWMkEzTmw2S1FRUjRPdVBRUEF3UkRLd1JnY1FCQ1hJZDNBUUI2bkYwNm1yTXVabUhOWExVV1FGNEFVQ1E3eWdwOEFzWlRBVjdNUmM5MUJwaTBHUU1BVmkyQVVNanBiY1I3OGIyTmpnRUFyUlRoaHBHV0ppQUFxMStoQ0FhcVUyMHFOMDBXck9od3RzSVMvaDNtY1BJaHlHbEYyNG5QdmtjZ1FGSlU4TmFzdVhKU0FJQXcxNjFxZFZqc1NBNUpaTFNqeUljR0FQakF2TXB6WlY2bTRHRGFvTU0vVkZuUmNrZXhvWndHRXRnR2hWWjR3ejExdGxyYUJybjBVMjk2eHdaWmFUTFNSSGxSZE9MbDNmTFdBcGlDa0FGNlY0NFVKbnBxTFlCakk5MFFaV014aFZPK0E2WWdwUUtBQlREcUNBSzB3d2lOZVVqbDdKQUlUck1LcjZnZUV1Q3A0c3JWMmdwNHU1aUlsc2NnVHhEeGtyMWdESXBDbXZwSGlpZGwzQ0IyZnVQMHFwMFdLTmZDZUpNNUFBQWZWS3RPMS9sWUJ3TDNITVRjdVU1THFCcGdYZ0JnY2Rrd0RMTU81OFk4cklGTkpXeUpoNmptb3RkQ1FzczBaaXR0azBNQUhUbEpwOUova2NiSk5xVHVhb0JGNWJBb0FZRnNtMkxHd2k3WHFnR0dGSkRhRElMSXRzdUswNVJjYlJXclJXTHZvL3R3TitIWlh4RUllTzAvUkEva3FoWnlHUGlMMy8waWtKTEhvalVhdU5vRG5nWEdRWEVoYUFmbVZaNDdCd1o5eGZEMHlFMUsxUEhld2sxRDAvMC9VbGo1U3dZeFJvdTV2WFJ4dGJReldwdWgyNTFGVmxwSWFQTjBhTlpiRFhEUlpRdTlhQ3A5R3dTdytoSnZ1VnRLazRJM2F6RFdhVmRiOUNZRkFLeENQMElJMUJqdktRQkFpNDlqbWRNbDhpNmtwQUZhaGhsNUNjSy9tQVhqV1lLTWp4VktUeDB3dktKbkNyZGxIdlpQeWVsbGFEbjBxUjBvbkRWVEpJTy9vc3dMRXp0SGpiRGNrUUtBVVhkaHpjVTFJelJKWEg1M0ZuWmFCVjdLRm9XTjBENWoybDMzRlRrQUNEU1JnYjhOZXdKRHZMdUt6Y0kxckFFZjFoN1pjVm5oTkJTMDBzQUZoby9hamZBSzN1enhNcndLWGxSTUU5OVgxa0pmREFERTRxd1ZkeWx6aUNWLzJYMjJDc3plZllWUnpqZndUdVdXcHlsdWFjOWVkdGt5cTBJNFJPQVJlL1kxQUFHUFBPSHNsUWNsYitxNDRSVjhuMThIRGdra0poNlM4Y01GcTdWdnlXMktBT0FxejJXWExzYjhEK0R3UjBJTkttVU5HUEU5SklkaFhIZUwzTVlhYW4wTmVjTVc4YzlLKytObXNaVlRYY09yWkx6ekFnQnNTQzZONmZTTFFtSnFGc0NLcTVVZFhxS2IreGdjL2hMT1NBRUFraVd5U1FZVWdZemx6ZzE1QUhEczZ5NWJHUkFQQ2lzREpYUWpQU1Vic0Fwemc4YXpBcUUydktWclhsSHJRTUhzR3F5Vm9CVWk0OURubkpIUnNtY1kvRHpFVG0xUG9qb2lxcWx1dzgzY0FnQmNlWEZlU1o5R1hzZXVYeCs3a0ZKOERPK3haOWpuZW5RQVdGeUpoWnVxY0huYWNWbXhzMFBLSk9JS2poMHVUYzU2VHhrejcvTk5WeXVFOWxxNUNLKzVXalhNQStoL2g5N2RLc3pWRXdNQXp4U0RheFduS0VNK2MwbEp4OXVGMzYyNHJGQUlFaVRrOXE5VmRwdE5mUFlHUFJzbEdWT2UvYkcvT2QvMHBMUDczcmcvcTlQRm13Y0FIQkJhV3dSanFqVU1BZXdvS0xMZTU4N1M0U3FLVmdLNnROenBMU09uV1N2S2MrYXlBaG43QVNPQU45OFU0aDhhUC9sYmR0OWI2VXA1eUdGc0JGTUJ3SUhMNmxWZ3hUc1VKVG93NHZQOTdySmNiS29Pd0F3MWNmRmlJU2M4L0o4bUFnQVU2R0lEV2dZRHA2blNXU1RqSTNjcG1JVDk3bEYyUUlpNzBSRzRrUjZCWWR3alQ4a09YRktxeHExUE8xQzI2RUNwMEh6d1lZSnJPNlVNK2k3c202T0l3V2NTTC9JRlFyZEpUTjFFMGlpS1dWa0FRTHNzY21ZSXBtN2lCZVlFM3RzcVpvVDJ1ZDVpUUtGc2sxT1hMVHFGVlRNUDRaMVdDSWhydFFBNEc4YnEreFMrNVpiaWplNzE4MnFGTzNkZFZucmFlbmZ6c2hzREFJL0k1Vm9BNDJrVnY2aTQycks4Y2xzL2dvTUtEMkJNcWVwd2w5S3Z5Rm9mcnVQWiswRDJ5UFBzaXpyekY0cHpGNkl6WDNwdndKMDZYYng1UWdCcllJamtaakFIOFVodUdnZGcxV1dMMWRUNzNFbkRUWGdTeUp0bXhyRVdQa0l3Y1FLM3VDcjFqMFpnam01SVF3SGluNGFtSjRpOFo5WDd6cE1lVnFrVEFId0Q0OFYyQ3B1NDR2U1N0QmlmYjNYNWxRQkhvUW5CVVdSV095R2I0YWtIdlNrQVlNOHdvQ2Z3UGN0MDJ4V0QzdW5DUWxGbmNNTmhvN252d2tJelhHbHdUbGwvcHhCV1l3MTREbkV0S3JjK0JxSGJjTkhRNW9NTDlSU1ZDd2lIWGVjSWhCL1JXckhtQnIxZmFPT3MyMlNaOWlPblFoNVFQSm5ubTlOeXRmVHBIVGdQRHVIZFpmNzN3VDVyNVl6RlBsdWt2b29CQU5wb1RqVzlpVEs5azRTSkR5QnNVWVJRa0ZWMWtvSFBydEwzTVlIbVRhZVhudTVVQ00rVENoL0xtdE15dlBzS2tCeS9EN1BIQUFDcXJYVzRjUG5MSFRwd3RZbkVHdG5MZEFEM2cyR1QwcTlJK0hxWHovNngrMTI5K1l1aU01OGszS0s1bUVROUpFQXNTNG11OUNsM1djZ0ZHOFpNZWVIUHdJZXU5N2xhZ1paWVl3REFobktlNHF0NDgyVnlHaHNCK1U0VzZZYmZZMDB4ZmwwdXJ0ZWZwK1VGQUpVSU1lK0FQRmxNenNQNC9JdUVzV2pxbW4xd0VJakNZcnQvNytkK0RCZDc3NWF6Qy9YZ0dyZjJIaHIxYlpmVmV4Q0RqaVRqa09DV0hFUkhBSTZReWEyTlZhc1B3ZUVzTk14TVd0NTN0a1o3bStJVlhRSWd6UWVLaEIwUFhGYVdmRjd4NnZCN1R3WGVteVc1OFVCWnBRTmx3SzlMVFRVVEwxTXN1RlIyV1RYUXNnRzRIZ1hTcHhjZ25SaExKYU1DNlJaa2ZDelQ0Uy92L3RyYlo5WVhzWGhnS0FXTTZjOElBbFlodEtTOUYyYWhhTy8wbk5hRE51YXR3SmpYZ2MraDdmUEh4cHFZZzh1Yk5hZWJRTHFjcC9QdXV6QjdEQUNJM3JwVVc4T0RXQ1p4Z1dKblc0cWJtbDltRVZpMWVBQy85aFA2ME45YUcvWHNVczVuLzgxNSsrRjUrK2k4L1VZQkFLa2E1aGh2dVFBU04xeTJkajJDS2tuZm1DVXluYVFSWVI0NjNqcENDNy92Q3M4ZE40aVVvYmFweE91RlRZNGdZSmxpdXRpUXk2RnR1RzdsQnFQMWdlNHV1VFczdTNERnZyeHRnMXphZWRhSDFwQWNoZU1mVitMelR4TEd3ckZyY1RHM2U2UFY2aTVyTER6eGEvK09CNHpYRkxMYnByTEdjZSt4RWRvQ0lMTUVySGk1N2FZSWJ1MFFvWmcxUnJiQnZxRG0vYlBBK21QRHZLZVFscTMzN2xXOG9tS1BGZ01IaW1hUWVXMjN1bXhseTlCNzQ3enMwdHhZQjBxYjA4WEFsbURPdDVTdzNvYXIxVDFaSjNiK1hTTjllZ3d1TVVKMkxUcGRYWE1KQ0ptVE1EZFNPK0tGQnhwYzhudVpPQzVMNVBsN0NuWlB2aG1LZFMwWlh0WWlaWUZNS2UvME9HSE1WdDhyUUZoL2EvQndXUFJNUU1Ba25JSGFuQlloaE16di92MTVGd01BWC9xRDc2RnlFQmRvb0F1Qmo4c3ZnNGNiSDhDUHZCRjZuOC8rQ3c4Q2Z1SzlBT0pHZitndU5mVXREWE5jaEROQTV2aU43NGRCbFN4SzFxa2U4VC9yOVg4dkRma1FTNUdGMzNXRjUrS3RiRmtaMzRwQkxzT0tnQzhBSFlzeG00S0Z1MlRNVzhnSVlPbk5HYU9QWlhCM0ZRQk52MVpjYWFsalcwbDRUcDcxc1dLTWZWRVovNkFTbjcrZk1KWmxWMXRjU2ZnMXo3ekJmdVRYeFYyL1JtNTRyOUhIeXUxY003UzQ5eXdqSk5rU2VJaStjWEhCcmFLcnJTUmFoRy9PYW02NDloNEYxaDhiWmlaMjhudVB3M3QzRUpCT1BWQ0tkQUdaTWc2NGg1SDNYZ3E4ZDhxQjhzcTREZU5CeXZPS3BPb2xXS2RvYTc0eTBxY0g0S0l4QmRrV21ycm1OUEJTQ2k0cnRQWENIN1ozd1FhTVFnb3Q4bHRrcmNrbDZBSHd0K1NiRFVGS3R5ai9XZTgwUldjR2ZxOTdDdkFaOEd0d1BORDNISEJ4SnNEdThqNFgyZlBuQkFMd0RKdzI1blNHM3IwR1RNVUF3R2ZlSVBCQi9BWUdpaDkzT3ZCeDhXWHdjT3RRRHVDYkRYNzJkTTVuLy9sNSsyc2ZDdmlsZnhlVW9HVU44N2NHeVFvTnh5LzhiWnlCVFl1cnJWUWxybHFwbjk0QkRiMGdzWVgvNWdyUFJTUTdrNk9oYk85anhaaUpSMk15TUc5SVRtTWowRTVHVit0am1qdzhIWDY4N0VxYlZPWXdUK1BuNUZrZk04YllwOXlsdmtBQkRFNDdIZjYzRXNZeVRRZU5aTmM4OFlicmpsOFRYL24xY1FFVVAvV2c4ZWQwTzU4S3ZPOTBnbEVYdllSZStCN2E3V2tVeGpLbnBGM093amhaengwVk1POEcxaDhiWm43R1hPUzlVdzZVMlFRYnlBYjVjZUM5UjZodkxwb3pCM013QWYzemdhTGRobkhPZVU3eE83TkVOOXFhYXdvSUVNRGVDNm5UbzRwSGN4d3VId1Y0YjdIUE9EYzNhVjRLeEcwWmRaZGxqL3Y4ODIvVE4zc0Q2WVJEY0FIU1ZEOWxIdzRDVndiZlNSdXpoQm9IM2FYSWw5WDNNSkF6dTVSOWZzUHZVd1FCSGJCZlFuT0svU1BQNS92NWpBR0FYOU5CL01DLzJDdjZ1UEloWWhPcERiYkZmeGc4Z0Q5dndyTUxPWjc5VDgvYlg1MjN2L1dHOEdOWFczLytEWHlFNGNBaUZNUHhrVEdtSnk1YnEvb051R2xiL2FKNjZaK0pYaEJadUtHRjMxcm5jOXNKWkkzbWFNZ29aMlBXQ2YwT0dYMExPVTBVOW5qRHNkRWRNZWErUUI2ZVo0b3JyV0Q4ZldyajUrUlpINkgrVUdGUWpPQkwvODNrOEwrZU9KWUNIVFFTNXJybDEvUTF2K1kvOFFmL0JlRDk2WG43VWNJNkdJbnN2VEdhSXptTVdvRG5FeExjR25lMXdrdmo1TEVhVTd4WFVnTkRXMzlvbU1kY2JmblpDYklaMm52ZkJudVU1MEFaVTJ4Z20zTEE4WHQzMFo3WDNudWM1Z0Q3eHdPRkQ4SWVXajg4cDdJbnRmYTlyZm1qRC8vKzhQNFppMldBTmlodjlpSGwxdGJpRDVwVy83OWYrQVhKTWNlUC9ZMlZEZHVvY3FEajRjcUdSRU5nWThTRUxoQURXandCTCtsOVh3RTU2cjdmL0YvNkExWENBeWkxKzRxTTJaQzdMQWlDRzJkSWVhOWhjZ00xcTk5bXZ2TXJmNkJneVY3c3Z3KzhEZWgxa01OTzRxQVAvRnpmaFQ2MFEzV00xcDZzQ2MxejFPWDBFc1BpWmVuMHZ5TmtxUTRJSFhUNHY4Ry9sL2RGRDVJR0FFYmdNTU5Eck9DeU5kQW53UDJKSU81WmsvdHVkSi9OZk5mN1RlejdOMzd0TWxCKzdtM0NhMld0V0RkUkRZUUtHUC9jNlVXdExDQTNvbmdobnZpOWNjTjdiUVE0UEFLYmphQmJwSjBIWVM4UGtOY1BiOXppSmZvcWNBbnJTT2k3MS9mOXhzL3pDeUNhaXVmcHRwOExGbDdyRHZROUFIMTNRTi80M2lsMmgvc2ZoSGVYQzBoM3pqRStoNnlydk0vbmZwR2srOVIvZzVSK2VVellYMXNxQU5EY1JXTkdMR2NXWE5BWTIycUhTUXl4amdVRS9GWnhiWElNaGVPSm1pdHhSSWs3elpKclZPTUNkTURHN2xiU294NzZ6U0FiN3dZZ2RqWktMQnVNcnJNSmNybk5LSVN2WnZYYnpIZHVjOW1TdlM4VlE2M2RNdEFneTJLL0J6RlJMTFREYTFBTHVXamNrU0ZYVzJMWU1tQmlDUHJvbGpSTVhncmtrRHh3dGZvVjRtNmVJemYybE10V1pGeWcyUDh3cGFZMnMrOUc5OW5NZDMzY3hMNEZ1TjZoVUZuc0lOVmkwVm9ZNnRmK2tuTWRTTVVwWVNsZTI1SUY4c0I3Y2o0bnJ3RzZpZm5DTm1GNERYQTl0NFBINlo0U09tVFBBYnFncmI3N2pMNXZFN0JnYjBwSzM5WjdwOWdkbnBjSjhsZ1BnT2NsTm4vczFibks4OGZJZmQ4QkhxaVVmc2NWMFBzOUR5QVZBRmpwRXhycHJnZ0VMbVMzWXZ5bm9NUWo4SU9KQzE0ak55R2hCZ2wyUXdFeUVUSlBWNERVd3N4T3pBYkFHL0FReGRIa3BpQWc0THJmZ0VqY1lhUEVoWU1XNGRCYWNsbWxObFRSNjI5aXY4MTg1dzYvcWUrNXJKRFVrSkp4Z0VCaUFvaHE3VUNJZWtwc2NTRmI0UnBjVWRqYVZ2WUlseGkyakNPN2drZUJ0NEJ4VmdRQll0Qlp3VkswenRjcHBXaldaYXRMb29ZRGkxTTFzKzlHOTluTWQzM1d4TDQ1M3RxYWNKQk9HR3gwallqNnVidlVGYm5yMTNZS01aVUp4WjBBaHVReXdyd0JqU2cyUjl3QjVnMGc0VlFPMDhjR2VWampEc3hGT0FuYzl4T0ZUOUZEZklwUTM5T1J2bU4yWnhyQTRUeHhRSkRQTkpGampCaHVTM24rZE9UNVRFQnRTYlNuczlUbkRQS0JVZ0VBRys4WnlyL2ZwcHhHVGNBQmlYb2FJeEVYbXJEL05RVXZmSmFrb0FqajEwb25rclNaVFVodjJhTGNUaFJIR0tBYjhHVEVGZmtWcGRkcFJta1YwcFl3SFJGRk9GaUVSNHE5Tkt2ZlpyNXpKeUI2QVpCOXhJZ3ZVa1Bob2tId0Fqd243WUlSU0lFVWVlZHRKVjk3VkRuOFVmTUFLeVpPa1ljSk56ZHV4TGZBOEY1eXVvNEVHM1JPVlpSMHJSSUE1blZJUlJNTitXVlhxdzdYekw0YjNXY3ozL1ZGRS91K2s4QzRucUdEQU1XNlNvRVUwVjUzS1NoMjMxMVd0VXhKVGVXVTRtNi92cDlBQm9lV09XQ2xpcUZFTzEvY3h1Z3dmUUVnWEV2Rm5nLzB2UUo3UmV2N1pXSkdSVDE5djBpd08wdDB1VnlILzcwTXFaU3A3OEdFMjlUblcvMHVLQ21vcWZaMGhjYUVXZ0NGVkFBUWtsQVUwUWdSdWJBa0hOSHdZZ3FNZkRBa0o4bWh5Z0lrSXZvaDByRXN6Y2tIaEtiRWhBSXBLRGFEaDg4bzNZQVg2SGJLcnNnN1RoZllZYU9FZGRoMzNhWHlVd25tVWFzajNxeCttL25PWFFvNWlyOG41eHF6WGptUy95U3RUa0NLS01aSmRVUVIwV0ZkOVRmSzRiOE0rY3hZSTRBMzRicVNCNHhpTEpxU1pIL0FvS00yT01yQUZtbHRvejQ4MWovdmFITGZqZTZ6bWUvNnNvbDlQMUFPLzVIRWd4UnJsR2hDT1gzZUt5YVM0aThoRXljazZLU0ppblc3V2cwSFN6dEFFNHRCaVdMV0RzRER0QXVJeU5wK1F2MEE2WHMzc2U5dUk3TkgwMVRJMjdkNDVHSjJ4NW9YRkFCaWJRZHIvcmhnVk44Vm55LzJscjNkcWZhVTN6VlRDQ2dWQUdnRk5VUVI2Z1FXTzByOTdybHNPVXlzSGJCTytib3M4ZmpJdTQ4dENWSkw0cFFMUktDazZKSExsa2FWNmtoYTlTV1VsOTJBRDhEdXd0ZkFZcllrZGxuV0ZOWE1EdURqaUV6eGpuS2JibGEvelh6blR1Z2IwNlA0ZTRyU21GYURISGtaL0o3Y2gyakdNeGhCNlUrdUlTRTY2YXZHSnRRTUFjckljaTBKY2ZNK0R4aDBxZnJGbGZSd0hNZXVWazJSQVVBeittNTBuODE4MTFkTmV1ZHVsMVVlVFZGZDQ0T2c3TExWQUZHVXExY2gwSFc2c0RwbE5RQUF1b0NrMmdJSHRLWWVpR3FOSVRuYVZaZlZVcEJVNHJiQWZtSUZ3WlMreGU1M3VxeDhzS1dxYUtsTWh2b08yUXlzQVdITkN5cEI0bnNjS1dQRWdsR29qUkI3L2xiZytRZms3Y1l3NjBERW5rcU5HRHo3TW9BMEZRQllKVFdsMHgxd1UrMFpDQnNMem1EOThYbTZOWXBMNjQ3aEFSQ2d3VHJ2WTA1WFh0dUJSWVBGYTdDY0xkZGY1cUloMjRxN3NJOUlPS2xWOXFUQVJ0blZhbmpqalFFclFlSEdhMlMvelh6bkRsZXJOb2J4czFBdDkxa2dhTW10K3FXemEyS1hhUzFpblc2OElYSVZTU3loaVZyYVhHV1J0Y0N0YXBMaTVoVU5BUEdxWUpXN1hRRE1PeENDMmdRandKWC9jRTZiMlhlaisyem11NzVVMXRaVitrYTNMWEtlaHVId1I5MzEvY0JCY09UMHFtNkRBR2FSUU1kRXdsUUFnR3p4WG1ETTR3R045UU9rWUF3ZW5saUxBL2NERnJzWkJLQ2hlWUozNERLSS9jdThZRzJDVGJMN3c1RDVFNnVyVUtXK3BlNEJ2bmZSWmFzcWRnY3VraWZHdk1oL2swdkZBUUE3bEpjL2d2RmhaVWtPVGNkcWFSelFHcEwvTGZVWXlrYVlOZGF2ckoycU0rcVdwQUlBemMxV2R0bGExa0t1MndJamlyY3gyWUFIeG8yUFkxcDNYRzAxTEpTODNZUmJ1MHkwZFpBaE9sOEZSQ3czQlM0Y3dhVVdMVDMxTndBQXhQM0dHdlhyY0Z2R3V2VGJjS2lXWFZZcmZaSFFON3IwR3Rsdk05KzVuVnoyU0J3c0JnQUF4cSt3K004TFYxc1RHME5ST3hUT3daS3RiRlN4cEtrWUQ2bFFkdWIwWWpaWXdoUUxJaDBvYmw2Y1Z5N21nbkhkZGRnM0tNR0tSVUY0VHB2WmQwcWZ4Ung5TnZOZFh3VFdGdmU5N0xMU3d0aDNrZU9pOU03b0ZlUEthOXFoY1FhMmo4T2d3eENiWnBJYjV2S25BQURPL1JkM005ZTh4OHFLV3VYREhWclRXTzZXdzNGYzVwZkw2V0k1V3ZTT1ZPQy83NU5uV0c2eldzRXc5REpiZldNeEo2MXFhRi9nb0R4VmJzemJ4cHdjdUd5VndoMWxmS2ZLaFdnczh2eUtxNjEyaVdNN283RXRRbmpCNnZjTWdGMEZMbkQ3OVFJQXl6VjFESWhISkYwWkhLeTcybEtXWEFQYjhnQXdtbDBrZHUyaXl4Ym4wQ3JjY2RXOEVyanZLc3JremlrdThEMWwwYklISUhTWWNyeG5oZUpKU0Vqa2dpTmRpa3R2eWVoM09XZS96WHpuVmlWMHRFYjlNZ0RBLzRZZW1XRWdsR25WdkZhSnRJT0VUcng5TG9KTEVVRkFGVFlhYnBnOWNzMmRFVWpReXZRT083c3dpRlgvWUJzT3BRMW5hOCtuRkFWWmpmVE5oWjZ3NElqVjV3cnNDZjVHSzBTVXdqV1ErcTVNenQyQzBKdFdDNkxicjRYUTJrSzM2YXpMeWhoei9ZQk1YTlRWRmlmQ20rNGgzV2o1ME9BeTFpVlhXMzZWTTFsWXpXOGhBZ0Q0ZDJjaC9HU0ZSTEFrYkFrdVFxdmdJWkM5ZUtETVNaK3pTd2dmdTJ6cFlTVFJiWURIN1F4Q3QzeWI3U05QSFhxWlQ4Z1Z2d3A3YUJjT1NyeW96Y0ZhdEE3S2J3SHdsSURIc1VaamszMWZnWFhQNHp1RTBEU0hSRVBQUDRheGJkQlpoUlUyeTY2MmpMYlY3OThwL1c1UU9QczdRTjBJQUlDRHRRQUFJc1ZRRFd6bUFHanVXeTVFZ1lpSUs5eGgzdTg2M1Y0cjVKWXF3aGdRckxEN1paSTRBTUpnWmFPUElLUjRSYVBQOGZrU3RWV1lHODJRWWxHUU1UTFFXTFNHMy9tcUJ0cXFob2RWeHFwZ0dMRHlHSmZ5ZkdTa28wNjdXdDFyTHZDRXhwWkJRTlZsNjUvTEJoZXV5Z1o0UHJDT09SLytlUGkxT0xzbXVsWUI4UkJjMW52T3JqN1hUU21iQlNNV3V4ZnBXeXM1aXFDTmM5RzUzanAvSTB5VjRrcUY5YjdyUGh6T1drbll6c2phNGh1elZ2cjUwT25WSEhFL3pMbmFVdE5ITGx1K2RaVU9qRU5ZMDh3dktpaWdsUFg4MThIYnlRQ0FmMmVOQUlaV0loZkxvbStCeDJNQjFxVmNpTDR4NXFSUG1aTnRPTmp4VXJjQUtXMFNTdDJIbS95ZVF2aEZHNGVlWk94N0RTNXA4K1JWcmlvWDBzbEFEQjdCemladzB1Wm9UZzdob0ViMy9qeU1yMFR2d0R5a2tBY0F6NWNsR0JzKzN5cTluS2ZmUlNLMGZ3Zis4d0lBS3dTd0RyZnpMZVcvbFdBQkhMaHN0VGpPd2NVc0FBdk5sbzFEQWdIQUJLVHFhQWFDeTMydTBvY3ZHekVkeVpIdHAvVEZaaHA5N1VPWGlWeXo2N0wxb0N1dXRzNDBFM3VhYmFBdEFJRHhkYng5SDBPR0IzOWJMQXV0RVF0UmliTGdzcUlnUFFxSmRadHVKWGd6V2dManVFUWtxcGh4NzNHMWRidm5JUnRsMzlXV2NPVjRaamtRV3VHVXpSa2lOcGFodnlOeVR4OFRjT0gxWUtXOU1RQTRNNzRSSzBIbWVWZDJwWjhFTW9xRzRadnkyam94WE9iYUJjWTY3TGpTcExqUitkQW9LcHlac25KekxibHN4VHpOcnUwWkRRR0E5dCtaeU5oSHFkUHJ5ZzF3VlFFZFd3a0FnT2Q3bHp4NGVFTWRWMEt4R0RyVStBejgrMGZra1NncURiLzdpZEwzY0VLc0hIOS9QTEJPdHVuY1FrN2NQc1RhVXdFQVAzOGF6cTJVZFpyU3I2eTdLVXJCL3c2STVpVUJJb2xubjBoZ0crUU9RUmJzRGh3ZU80Ynh3Zkttb25OdWVSNHNBMlRkWkl2a0lzVFlEY2FsVmdpczdCT3JFOFZoUmltTnBabEdQL2FoOXlHcjRSaU00Q2tZZlkyUTFHd0RIZU5rOERoMmlDU0szOVlxNUNIekk0MjE4OXVVdU9nR0dBMysvbEw1YlJKdXdQTkVwZ29aZDhuUjdhYzV4UnRpVlFrMTdCRnBwNndRNEFZREtadmI4UGNjMDl3bFY2MEd3Z2RkYmFHUi9wd0FRRzcrb3BhWjhxNmFLMzJQL3J2bFNtOFdBR0RQWXdrTS9CSFpNTHlGSGtHTXVxTGMzR1lEdkJUa0ZXQ3JBaG1ObTViSndHQitFWExFdVR6eHJyTCtRZ0Nnb0J4Nko4cEZjQXJ5K0MydjVScmQwZ3NLeVJ3OUJ0dUJ0cU80eW5GZDVnRUFlZFpKb3dGQTN1Zm42YmNBN1h2U2FDb0FRQVk2MzZDUXdMQVBQOXNIMTNHWll1MWNveDIxanJGZ1JWNEFFSXRsbDhpMXZRL0dlRXNCSzl1d1VMbFMyRnN3UkoxTk52b3hWNDhXdXo2QWxNa2o4R1RnZ21pMmdZNXhNclFGaTNYQk1lVENsYlpZcXJrYjBxSlFpL3VOeXdwS29TZnBUT0dqeUNaa2VkZDV3KzNKeGoyVWVvUi90d05oTEF3MVZBQzRhZTVNVFF0aEU0eXhGdE5jVjM1blR3bWgzWEdYNVhQZjFBa0FSS1h2ZnVLN3Npc2RQV2FWaUxlbFdRQWdaSGZ3SnFqZC9yZUlZSHpvYXZVR1F2biszSTZBTEtZMUJnQ2FvQmVtMHBXSmFhNkJEV3RPOEJLSW9NaGFxOHhid29ZaHlRRUtpYUJ0cmxKNDBHclZ3THI4QUFBdVNmWVpHZjU2aElCQ3Q4UVR5cDFFSWdjZWJ2TXVxNkdzdVErZjVnUUFJd29BMkNDMy93N0UwVFlWQUxCbDhCUzBtdHVzeU5WTW94OGllMVRCZTFBaWw5NCtiT3dENWJiYWJBTnRjVEppQzFha05hY2dwSUIxSHJoWUVUYXNnUFk2Y3BBeDRXbUdlQXpkbFBhMFRJYnYwTWdsdHp3ZktPcFNBdkxjZ3VLWk9BbHNZZ1RqZUFCeFRITmVpV2xXQURodTByaS84bDZXUmdDQWV6bmV0V2pFalRWdkM1S2dtZ1VBV0V0a3l3QjkydTEvblE0RTdaWWVVL3pEaGlFQTdiOXYwb1doeCttQ1hweEtWNEZ3WGhtQVFSNEFVSWJ3SFk5eDBHV1ZDTG1FTUhOR3RMNVA0WDFUMndjQUVBWUFJaHoxWGNHa1ZBQVFpaE9qMHBERXBEYnBKc21pR0NpenFoR0lCQVRFQUFCUGlNWTZSNE5USVhiM0VSbVhQWXFUU3ZoZ2syN3RtdUZycHRFUHBYdFVYRmFuWUFHSVJURVNTYk1OdE1Ucit5Q2VuQ2NXaDVyYVRMSVV3ekpGRGJYNU93MWdoZ0JnMzBoNWFuTzFVck9hZTFJREFKb2VCUnZ1TlVoOWk2Vkc4cnRaNFRna0lHbnhValNzbk5vNjNnUUFFSHJYSXlVY09HNTRHUzF2eTdzQUFOYTRsNDNiLzBvQ0FJaHAvcThFc2dENGQ1WXBuTW9YdFJLNTZqR1ZUZ0JFS2RFcm9uMUxIS1BtMXA4RUh0WUMyWDdrRElXOEN6czUyd2NBRUUrei8wNDZPaFVBb09vV1MwQktmQjF2eDRpTU9jYTZxdnp1Z3BHVzFKZHpRanFVZUhhSjR2MG41SzA0QUJCVG9kc3NIblJIRU83UURGOHpqWDdLaDE0R0JuenFmRFhiUUdQaGtKNDZGaXpYTW1lUzVUekVPQmZCZXpBRktZQWRMaTRFc201c2xKWUFrVEVFQUZnd0JkTlhpNVN4c1JWSmpkVG1CQTM4SnR6RURpT3gwbTBsbG8zdjNtZ0FFSHBYRFlBTUdtVGpVOFBiMGt3QUVBb0JiQVZ1LzRzSkFDQlc5UyttQThDL2k1THFGdGhGWnJnQXhCVUFIeWtBSUM4SEFPM3dHbmxSV2JDbmtIQ2dyaVkyRGg5K0FBQzZ6czZOVkFBUXFxZzJSOGhPUzZPVFdQb21lQXQyeVZ1d3FPUVI1d1VBYlhDb1RicXNuTzgyM1B6M3lWdUJZQVhqMmFnYWR4b3hmTTAwK3MxYVFNMDIwRmc2dE9NS0MvYUZ5K29LSUFqWm9NWUNIQ0VwMEtyQkdoWUEybGFuQjRBcks4NjRySkRWSG1Sc1ZJeDRwalVuL1lGdmZKd1lMN1hjdG8wR0FQMUcrdDFaNUpZNWxYaVF2azhPZ0hYN1gwN2dBSENteFlpN0xBbWJxZ1NJdnkrMzNCN0RBNHBnRjhOc00wcVlveEZaQUpMS3pJcXM2RVhWQ0dwVFNyWVFodWxXS09WM3ptWGxtVmRkdHM1TVNETDNBd0J3N25vcUFMQnFxby9BclhESzFhcERJVElXU1VmV2N0YkVWSVQ5bmhjQW9INDMzaEl4anI4QlBJQTF1dUZqN2lUWE96aEtNSHpOTXZyTldrRE5OdEJmTzczZVFEMEx0dFhnZUdDT3MzWVlwM0FBTmhWaWFnOTRMVFJpWjlVdzd2Sk1TN0VRT1RPSFJpejJPQUlBdExGOEF3WW9wYjFMQUJCenBXTUdSZUgzQUFDa1pBRll0LzlWSXo4ZVZVUWwwNklUOHV2cmxRSWVKRStabFhiTGgvUzh5MVpLM1VuZ0FBdzZ2VGdiazJrWElVOStTVW5WMHdDQWVFL25qRFJkck42STNCWjhmMDZsSG9Qc29BOEE0QW9BNEdzQ0FaaUN4V2wzeUh6blRBQ0p3eDlBYmpuTHFhS2VmRjRBSUJzTFMyRk91S3phRnJxTG1hY2dHM21GeGxHR203RmwrSnBwOUpzTkFKcGxvRzgzQUFDSSt6OEVBS3FCMjNnb0MrQlVJVEJLZGtjQjNKaHZGU0tkeGtNWkErNEJHelJXWk50MzJSb2FKU0JYNWdVQStJMzNjclIzRFFCU0FXWW96dnd1QUVCMzVFYTZiOXorT1ZWVXk0L0hFdFVTK3g1M1lTbGdqUnVFS2Nrakxxc3dPS0Y0dTVDSXZBRXVlU1QwVnBXY2Q4eHVzWlFBa2Ira3FmVWgrWlN6YmlRRk5jUmRxQ3J2am9wOVdIMVJ2RE1ZWHZnQUFLNElBRzU0RUNEMTNiVjQ3S0tSUm9lYnB3SnNkUlJXT1RKSUpIa0JnS1F3dFlHTGpmVzJweWczZFovU0ZsSHpHOGRoQVFDNU1UYlQ2TDhyQU5Cb0EzMVZBTkFQNEtwZUFNREZhQllWQWlPVEhXZUFWQ2psWDR1VUlhRVZrUktRWk5WV09LWXcweHFSdVZKNUVkWTNQb1E5bDlKWVJhNlpISUJRT2gySG1FTDhobmNCQUhndkZ3azBIaW0zZnptTVVKcVd3U1dtMzZJM1RTUEphUUpCbWhRd2srbXNjdGxWSWtMdlFFajBFTHhDMzdyYVNxdmpFR0lvVUFnT2JkeXgwelh0UXluRG83RFBDMFNpeGpvRG1FYU5oTDk5SW5sL0FBQk5BQUJmdU44Sjh6eDB1bm9jRjIvQW5IOTBueUZoRFNVVVQrb3dkdHFFM1BYcFlpL2NwWmlKcEhJTktyZnpYU1huWC9NS2xBd0FnS1VubTJuMDN3VUhvQmtHK2lvQVlBTHk4WHVJMzVIWEE5Qkh2QkMreVdPNm85UVRFQy9Sc3N0cWN4ODVXejlnQkl5WkJaUllLMXdxSDg3WEFRRHdHNXdxYk93RjQyQlpCZlk0NnNnM0dnQm9SY1FPNERCQTE3bVFUS2VVYjJUZFNxMll0Q1lJazRjY2l5VjE4WEt6QzRRNk9YQjJsY1BvbFBZOGV6WlpzR3dsQjJoYmo1RHBldW05OFNDVllrVXNSbllNWHRuVHdJWE1xZ2FJWHM1VFYxc3hGQzlBbTVRS1hnQVNOZW9YYUgzenU3TW8yYTdMVm0zOUVBSm9FQUM0N3YvZ2liUFY0emFNTkRwTE5wZ25yaEVBNEtZSEFZKzhFWHFsNUtJemNrV3dVZ1RFakdoVkF3QWxjbU0xMCtnM2F3RTEyMERYQ3dCRWJBbEpvWjBRMXBsSkpGc05VR3JvTEt4VnZLa0pDRUI1NHcwQXNOc3VXeDBNNVlNM2dKdzBhYVRxYVRuVGF4QXJSYm5odmNRMFFJMlV5T3FWOHk0cmg0MlN4aHN1V3dWdnVFbHBnQnFCRXNsZFc1Um11bUM0MHJVQ05ZUEtlanBTd2pOSVVGNXpjZDM3VmxkYjA0TTlnMVVsUngyeml4QlF6bE5tU3BjQlh2YnFhTHcrc1BiRkRCMmtYSE1lcFlzMzRiWmVNZFplaU9lRS9XczhMeXdCdjBCZWl3N3FlOExnVUpXVnZpc3VXNVZVd0JaS3pGdjZMSlZFKzFsSkJBQVY4TERFQUVBam5wK24zeXVIQU82NXkvcmVtdGpFdHBKR3QzUkZBQkNMZC9LRWZPRkJnRVUrMDNnS2FJVFFRQjFTakI1dnhtWGxJemZUNkRjTEFEVGJRSXZYNkdVa0h4K0ZhVlloaHJoSWgwdkJBQ0NXc0EzZnhoZVZ6STRxdkFPWHorUnFnS2N3M2xNQ0FjaVZDSUZCNUx3Z0VYV0xQQXdZUDhaRGxyVXVlQjd3blZiQjI3UkdLYkc3QUJTYUZRTG9DcEM3VHNuenNrNXhYUVJvbHBJbEY1QmhyNDZNY1IzaTNkc3VXd2xTMnhjdkZUYzlxLzRkMEdGM1NDN3FFdXdiTEpUVkdVa3R6ZE0wVzlIdXNzV3laZ0Q0bEZ5MmRMYUVJemNDYWNzWXVuamxhb3R4WVVYT0VxUlVTOXVHN3l1QUUxVlVwWEJZckcrV01aYSt1U3JwTElDdFBzWHVGSUdYcG8wekpOREUrNXpGbHJCWjFRQWIrZnc4L1Y0SkFGd2NxdmM5eWE3ZGNFTnFwWE9YbEVPK0JMbW5DQTd5TXA2MWpmdmI4M2JOQTRESFJoNDNidUpET3BnM1lCeGErNVpjK2lFQTBFaWozeXdBMEd3RGZTdHlvR3dwYm5qUktMZkNGUm9CU1h2K01ERDVOWkVSbWIreXk5WjRQeU0yUFpiL3JjQk5wS29RV0dQRlpJN2NwYTU3bVdLeFNCUU5wWnhxcXB5WXlhTFZmT2U2N3l3N1Bkc2tBS0FSWXpGRkdHdXRXNjUwNXVkZ09DcTBKckRDSTRPNWt3UUFvRWw3SS9OL3h6anNNTXczVHp5aGJ1QW5hUUNna3JOcE5oT0xaZUZCS3FXUWkwck8vQktsTGEvQXoyZkFtL2JVNkg4YUxqVXIxSDhSUW1xWW5qY0k2K1dGMGZjNFpYSngzOUwvRW5CM0p2eGFGREp1SzRWekZseXQ4QktPVTNnSW1rRFRNbm42MEF2Q2M3Zm9zcVdVbS9IOFBQMEsrSHpsejhhTE0vSmFJd0hBbnFzdG5idWdrQUIzY3BBQTh3S0EzK1FBQUFjRVNBUUFXT3BTR0FMWVVkNjNtVWEvV1FDZzJRWmFXemNqaHNIR2lvQ3BmSVVEbHkzcHpNL3ZVcjRMRm1oQ1pyRzRNR051eGcySVMyb3ByTU5HakJkQjhobkZTazljdHNiOG9iUFZMcm5vMUJ4NWtqQUdmVWhwcHlld0RyWENVNDBHQUpLUk13UWdjNFg0RktlR0t4M25BNnQxVGtHYWNBOTlXeTNlWFZYU0h3OWNWdStDNXpnVXNxb1FlTklPdXdYanNKUEtvU21pWWFtTmIzbmFRVG9HaEZiT29aOTFsL0s4TEREMEZnNmxYcGN0eHNVVk9iRjBORDlEU0xYallNK3drdXJqU044VDhIN2ErMHZ4cmpFNEdEdjkrbnNPRngyY0IydWNJWUVtZVk1d2ZSQ2tXSDBPTmZINWVmcVYwdkl2L0Z4ZlhNNCtiMVFJWUJYY1M1S0hPVTBNMmdPSWo2SDJOTEt3bVN3VHl0L1dOdTZ2ZlJqZ2RpUUVzS2E0YXVZTWhMbHFjQUNFU0NYdjIweWozeXdBMEd3RGZjTnpNcDY2ckt3dWN6RU9GRmVxeGxjWUpuTFRKc1ZhK2ZudHhGZDVTeUFBYzR2UmhXbTVHZVdicjhQUE5SR3JkZ1dkcjFLY0ZXUEdSK0Jkd0ZDYXhxdkFESndSdUNFVndUT0RJQVlQdmdxbGFuSHA2UlFBRUNySHpRQ0EzM1VxOEs3NG5oeWJYb1U1SGdOdUIzT1JySGowSWZYSlpjVTFEMERNZFN6Z2lROGpQdXk0YlBnVEZ4WU55OXY0bHNjSHFjVEFDNjYyZExiVVlobng3enBLYlFTSWhSM09yc2lKZ2taanlqTkVyQWdMdjdYQmZOeUw5RDBVNkZ2ZXZ3Q1pDbGdNN0pHN0xBaytrRERPa0VEVGlNdVdHdStGZCtNK2h3bjROZVA1ZWZydDhQUDZ4TnZrQzl2OGFTTklnR0tBbGdFQnp3SXl3bXBVKzNTN1FvT2tsUWpXREJBS3YvREcvZFVGcWdGRDlsd2hBYzdDaGl1Q1laa3kwQ3ZHOHl0aytFUjZkN2pKUnQ5U3NqdE1CQUNIa1p0T3N3ejBkZkRHdkRJTW54emtmT2h5dkF2SlRkTkFhbHNuWWhFK3Y5Vmw2d2NnQ0NnU2lBdTVHY1hRemxOY2NwVU9mOGxZYUNWMC9sWUJ5bHcvWTR0SWg5c1FQMlY1WlZHU0czQlp3YXNWSUUxdEt6bi8yd0JrbHNCbEtqY0VEUUJ3cUFGTHVtb2hsOWNlOE4xMWw3b2hzWGZGdWRpbCtaQTRPczl4bTVLTnBNV2pjUzZsejNWbEhGZ2s2NFd4bjVmcDRCV3lHUjVHb3k1YmNsVnVvaS9nc0dNeW5YYURURzJaVzk0ZmZmajM0VitqL3dYU0FMRW95d3dnWUluRGpKT2hMeW1HdnFRY0lKb1VzTnk4VVBaMWpYS3dmM0hlUG9HYjV4T1hMVWd6REJ0dUZ0eGZndFlaWVNKeGJFdEIvMitCYk5KTW84OEFnQTNiT2dFQWRMRnpPV1FrNlRYYlFBc1lrekFBRzc1cFNrMWpWeXJHdTlyaGIyVis1MXh0ZVdhT0xiNkV2eDJrdjUwREVEY0o2eUxrWnB3Z1Z5U1ArdzBjSVB4TUJNcHJsSTlmQkFDQ3RTSldDQmlqMWdVS1hrMFJ1TlVxV01xOFlvWkZBVzRJTncxUDN5U0FZV3lMNUVIb2dsdkdIYklYMnJzdUJkNTFCVzdZYjUxZUxNd2lqczNEWWMxektRUmtIc2NzcE5JOVZmYnpsT0tPblFDWHRuZ3MreUN0cmQzUGg5eEU3L3I5SU84dDYwTzd2YVcyekMzdncybjE0Vjh6QU1DbmNLaHFaVmxsQVNNQzdsTU0vYkp5dTFwMmRqRWdya0RJaFY4V3dBQmQvTjFQUFEvZ0N5Q2dZVUdhWHIvaHhKMGs3aU54VFExQXc5U3hKY1h0aGdhanE4bEd2NDl1elZ6bERiMHV5SlRYK3AySGVHR3pEZlFGR1B2U0h3YVB5ZkRoUVQ1cnVGSXgzc1ZHYzhSZGlqdE5HTEhXeC80d1loQXdRcmUyUXNTRmlXNUdkcVdPS3VOK3JEd1Q0NlJjUDJNZVFNWU1nRk1FcVFKdVVPc0N2OXN3M1NhMVo4d0JrQmxWM0lQNHJWQldld1Rpc0Z6U1ZZc3hQdlF1WGV0ZHNiOVo0QXVodUkyTUc1WHV1Rnk0RnUvbWVEUzJHWGh2SHNzRWdQbEh0SjgxRjZzY3ZCSnY3dkR2MXU1di9ITHdTK1cxT3g1Z2ZmSGhSUG53N3g4YUFKQkQ5U3QvUXhDaktucldQZDVRSUFMdUlFTnZrVkJDNVlENTVqNmxORFJBUHdZdndKY3VLMkhjNGplbnhHN3dmU1ZHMXdFTml4NU5COUIvbjMvZlpocjlibklYYW9ZTmJ5T2pNTi84ZTFQQUsyaTJnZjQxZUFIdXVVc1ZTVDdJeDVRRGQ1VGlYVTlCMTBHOFE2S2hQbWpFV3UvUmVzVy94VnRiai85YldSY0QxUHJkcGNKZkQvMk9yQjhjTno4VDQ2UUNIbEQ2VmR6SUNFekhGSkRhQTFvWCtOMVFVMTQ4V1JQR00zQmU1WHUxK0QyQ3dQbTV5eGF0R2ZKOWN4dFVZb3ozL0h0cTc5cmxzclZFdEhjZHAzRnpWY2luM3F2RU1lTWVKUjZOYmRRWXd6QWU1aDhzL29kL0gvNWxBY0RQejl2SG5tRXZ4dnlSTnhJdGZtTytJUVNNaGg0UnRFWVFLUmdIaUdobXk4MjlvTFFCTUVBL09HOGYrWVBuTTVlVk1IN2lMcXZLdGRQN3RucGovZEpkNnM1ejBhTVErbTl0c3RIWERrdzJiQVU0akFiZ0lPQ0dMTnltR3VnUE8rZkR2dy8vUHZ6NzhPOGZQZ0M0UWJmcFYzRHo2SUViRlZhMUdxUWJVZ2N4UCsvNzJ3WXlQdnZnWnE1NUZOb0FFUFFyRFJtbUwzTCtQdGF0dDk2akcyNU16dzBQQ1BmZkJXejBuc2o0TkE4RnRoNUtiNGs5UDgvYzhmaFM1aSsxNFh2ZjhPNVFBWkN0QWJieUJJR2xNYnF0ZFNrM2ZpdStpc0FLWGQ4ZmthZmlQaEh0VWhtNXIvM2YzZmY5Zk83N1pYbHFCclE4MWtrQXgvZ01yTDZwemNzSXpZdnNnY2ZlSS9hRjk0cmRwdERZRy9CKzlFSHJwZlh3RlBic0Z6NHN5TUJSM2xNRDV5MEJRSThnVXRiMmozMUk3MWNlek44RUwxSUxoZlE0QktsNUpzUXpJOS9tVjE0MzVGTi9zYm5oeDNiSHo4OWoveDZ2L0R0eEFiUVJBdUM0cHZvZy9RNi81WkJpRHpGVThOQy80OWYrUGEvN2QvMEUxdWhOdW15d0hjWm0vVXhzM2wwWVp5dllIN2FCdUI0NkNPZy84Ty96R0M1WWIrcnM1Nzd2NTVrZkcxNHV1Mmc4UFlhdHQ4WWNtd3ZaSzNmOUhIOUdkcXJGc09NYS82TkR5WExRdk5GOGZvYjZRcy9YejBEekpuVS9XMk9OWndPNDJtcUFNWU05YWJoeTJWVjZYOG41Yk5UdHRpM243M2ZDeHJYZUF6ZDVLeGk5WWVOdjhCWnYvUjZPTDNiTEg0WURKK1g1ZWVhT3g1Y3lmeW1OM3hzM0ZSK3lZeFM2bUtQNDlReUZIVGptLzBRaEMwNFJRWlZ6WTMvdHZWdFd4a0pxVG00SGlXeGM5LzFxQmFvd3BJVmhNUTZ4WUx4K2d2S3NjVjYwY0V3M2JQWXY0WEM3VDk2MW1KZExTeUc2NVEzSGM0VS9NbUdFNXpyZ2VSelNtNkRjNW90MThVczZvRVhkOHlVUi81RDNZSDNqTi83dkhzRzMrY1QzZXhQNENnLzlHSi9ESmFkRFNVZmpVTncwWlZNTUF6R2F2ODhvYUp3Z1diQVZCSEVlK2U5MHh3T0JMNEdIZFFmbUlaWUdwdjJzQU9zakZFWWFwVDA4RWdnZGFTRzJvVHI2d2NzbEh2cjlDbGx5R0x6R3VBWUx4cGdMa2JtUXZmTEl6L0dYWktjNkRjQ3A4WVMwY0tSMmZnN1NlV09GUU5renJvSGkySDdXeGlwY25Xc3hBSUFJbzVNUUxocXgrWWdSRzFJRzAwT0tVbzJLYjNmbS9QMWVpUGxyTVhuYzVEM0tBUkdMNDF1L2grTWJKR0ljL3g0Zk9MSG5wODZkTnI3T2hMOUphZnplV253Wng4Q0taVUtZUk9MaHJNTDZsODJtcFFzdUF3bVMwOTgrOXdmQ3pZQm1RWW9xRjZmQTNmVDljb25xMkZqWFNlRnNudFRRckhsWjh1K0RhMW8yTzRiQm5zTWhHdUs1V0NJaVlzenVCdElSRjBtWnJRQTNFazdIWFlUM1JoREFOL083WU9pUUV6TkRhYjBya0owZ0pOMXU4TkNJRitDR04zNzMvSGllK3ZHMTBHMnlYeEdrbWFObmN2MTUxQnhod2l6YXcyR3dQVjBVam53R0FqbDMvRnE2N2QvMXVaTGVxbVVwV0QrVDlXRVJTYWVJbXpSRDcxMGdZS2lSYkNjSW1DRTRzL3JCdzVFUC9Ra2F6NVRMVm1KRld6V3RqTm42T2U0VjhUN0p3Y2gyaW9IN3JKRXBwQkdTWStkbnFDOCtOL0gyL3loaFAvTlk1UUlwWHJFYk1RRHdGRmpCZlhSUXBob3hMVjNxbFNMazBTaUdlMCtPM3g4bUVaOWw1VDE0azdPQXpuS0V5Vy85M2pKa0ZHRE84WXJ5ZTNOazFFTFA1NzZIQTNPaGpTODJmNm1OMy91cHdqQ2ZnakdzS1dtVHFGdStUblBMTXF0YU5iUk55QU5IQVp4UmZ4akl6ZmdoYVVmazBlV1dRMUlNaU56Z2NLeWpDV1BGTkV2TTJVYzlkRzFlc0xnUGE4K2o2eEZ2VjdGTUY1WVJiWVB3MEdQbEc0cUdCS2JvSWdqQXd4L1RlbGNVRUlBSDlBTzRqWEYrL2hKcEgyeFJYdjhvRUhYbGh2Y0FidnhQaVJ2VXFYZzN4UU9FSUF5ZnllVm5XWFVVOWZaUlR3SUZnd1lwUENBOHF1ZCtybThwM2hzRVhxeFRzR3o4REczZTYwQXE2VEtCS256dkNmS3V0Q25aVDNuNzZWQzhzSGpvejBOL3kyUmJlOG0rYVdPMmZvNUZpVHJoWUx3UDg0eHJmTmJwc3NwRjZwUHRFcWVqVzVjQUsxMFh6MDN4QnQxVFFMRzJuL0c3bzBpYWVBRnV4UURBUzBOUUoyYkV0RHgvemhYSHdpWnJsTGQrbFJ6M3ZvVGZ4MElvY3RndGdwb1lOdDdrbXZZLzUvSVgzV1ZsT3V2M1VGTUE2M2h2MHU5dEtLcHJvZWR2SzJwdjBuY3BZWHl4K1V0dC9ON293aDJHQTFHcXJlMkFpdHVScTYxY3R1dXl5bjhvL29NQ1ZWd1BYVVNjc0lUdkJNVWRVVGZBcWtScFZlYnFBN1QvQW01dzdZcUJ3ckVldUd5RnRtTVNpZHB5Mllwb29YbVJBalJvNVBzVTEyTS8zUGdzclF1V21PVTQ0a3RGSndCVkpIbjlUU2lIdjlSOTBDb3EzcUVEK2hVWVVTNEN0QVdDVmZpTnNTcWszREpmUWN5ZFk5KzlsRW1CaHcrRHNGMm5Gd1hUTlA3TE1DY2JyclljODF2aUNmVFRYTCtDdUQ5blIyRnhMRlFxTEJrL1E1dUh3bHlzLzFFaVVLVUpTQTI1MmxLK2VJRlpoK2VIK3BFTEczdGg4ZENYdWQ5VWJDdldiRmlCZDkrQ1BXSDluUGVLaFBLZXVOcUNVTExHV2J5TXg2YlpwZFR6Y3p0eWJuWXJ1andoVUl6ZkhXWFNPMUd6SXdZQXRQS1lLSW02cnhneDFGQm55VlNjR0czRE5FTGxUanZBRGx5MkNCQWVCRnhtbG4rWDZ4Ull4WCtzdjhFRENZMFZ2amRxZzdQYVh5a0JBT0RjWWIzNkJWZGJEUTkvYnljQUFMVDVUbTJhWEN5N2NMblVLaFpya1hXa3lRK3ovTzh3YURsb3FvbFNqNEVOOWxPS08ySWFhQjVaNVQ3NDJ6ZGd1RHZwd0JKRGhHVmxVYnRmRG5mNW1kUWdrTG9SMWNDODdCbWJ2U1ZBVHVQcWxWYUpVbzY3dGp0ZEtYQ1hEbUlFQVh6NHkzclNLaW8rb2dOYXF1aDFHZDlZYW00Y3c5N21zdEJkUUxadGdkaHVIK2xEVE5IdGJCVUFOdGZ3U0FFQUxNWE1SWU5RVDJQQ3lJeml1RC9xb3lEd3dsb0YyczlRWVpTbHVWa0JsQXNQYlN2ZWxYNEN1S2lBeXYyVWxYN1E2emlvaEU4MjRMQ1Z1ZWZ2cXhVWkt3T0lMZ1YrcnBVUDFzS0pzd3B3UHlRN2F0bWxIcVV2M0FjSFpGdXRjMVBtVzlQcjRQZkVzZTdDR3NWM2F2Tjc3SDRNQUREQzRMS3FKMlRFQkFSSWdaY0Q0MWJSRTlnd2pTNTFLOFY1Y09OdXdPMWJxNGlIeFVLS0xsdW5vTnR3OTBuLys5VC92SElnSGRLTlZLdnh6cFVIc2JRamhnQkVxM3pmNmJYaDUyZ1RWS0Z2TWI2NEdhMERNS1ZNNmJmT0xoaGpvVldaRnp6a2Q4aXpWSUgzM2pjT085WnZ4OE5UQXp1Y1E0NXMzRHpyYlVEUkZoQkdic0hwSldWbHo1UmR0dGlTakJYL2V4WDIwaTdNQ3habU9uUjZWY1QyQ0RrTnF5UldsYldyeFYyN25GMHJvT291S3c2aXNWOGl1eEdxcVBoY09hQ0hvR2xscFU4STNNL0J6VW5hQUxtYysxMnRRdWlDY2p2anN0RHlyQlFBSU85MkJuKzNUMkd0SXJuSEowa2JoZVArV0lsdUhZQ1hqTi82R1Nxbjlpc1huejJhUy9FNG5SZ2V0Q0hGNnlaMjZDalNqK3pEU2NnZVlTL3NucXN0ME1YZjF6cWJlT3pXejdrbVJyZXJyWG16U0hOYUpkQitRbmFKeTVMSHprOEc5Ymd2ZUw0MWRWVUVZRmlJamt1MWk0MUg0dktqR0FBSXVkMnE4RkUxSTFhbHcyaVpiazNOQWdDSWl2QXd3UHJ4K0RmNGtmZm9JQys1ckZaNEg5M3NVdnJuZy8zdjZRQmVWTHdWVlFJSkVrc2ZkTFVGWWJBYUd0YUd4MFcrQVdQamtyRHpSR2pUQU1CZVFpc0Q4Tk04RjlwM3diV0VKWWpYWExZZzB3NEFNL2F5b0tzYXF4dXV1Nno4TklNZFpKUnJPaFVwNjgzU3R1Z2xUZ0lmdEZ3bWVoVnVQZjlmZTNmaUhOV1YzWEU4ZjB4U1NTVVRKNW1aMkI0SDI5Z1lERGFyQk5wQUN5Q3hhRVA3THBXVzFnSzIvK2FYd2ZXdStmV3Z6MzJMQk5oSmZUOVZyNlpHUmkxMXEvdmRjKzg5OTV6MEFmNVpCbzU5KzdmZW1qbTk3elp0cWZkQkpqa3REVHJhQ3RzL2Q2OXNUMW1yVStaZTYxd1E0UC85dE1oM1ZMd1RETkRQN05LVkI4MkwwTUR3V1ZERFlrSisvNG1pdDR4eVd1TFY3U2lkNUJ6WkFLNDNhTy95dHhsc2E1MFYzWTNSZGkxUHdLdWpqbWIyL1YvWloxNC9jOUhYTkZnZXM4K2hUbnpTM3lVdFIrOUtVT0FUcDRuZ09lOFUzWTNlb3NmWkR4NW4zQ1pCMnBwZEIwb1BBS0xWYVczN2ZTUUJSKzdycnl4M1ppQ3ppcHpldTBjV2lPZnUxNU15TVlobTZHY1NTTzdJWTUzYStLQ0JXem9SNC8xVnBvUHg0NmRneGZ1WkpjZGVyd3NBSG1UK3lNYzIyUGxOYk1kbTB0RUw4NkVDZ0w0aTN5LzhMSGhSY29PdkwrV1B5eEdQM0RaRDlFWkliWk1QNVViaTBaa0dWMGQyUS9lSTBtdVZUeGU5N1h4MWtGK3BDQTVlV1RMTS9hSzMrNTZYQS9acnc0SUxqMTcxdFJzUG9sWDl2clRITnkrblN4YURBT1lneVAzUWxSRnYzTE5pMmZzVFJXOHptZG5ncW5xL1JmOWU5emFqUU9wUWx2eDI1QVlVL2J3M3dlZm5sYnd1U3pYdnUwbDV6YXVTMDZJQVFQZThmZC8xVWVhMXJnb0M2Z2IvcUtQaWhDVmZSVmNhdE5ka1dUMzNiMmZrdmVqTHB0cjc0cURvYm9MVnNiMThYOExYSmRvbnRoZnV1UVBhL1ZKWGVmeXhkWERzeit6N2E2ZlZROW4zOWErdDJINzNjSER2M1EyMk1KZGw0SHVkV2RXTEhrZDdualI5bkNnQTJKZkh5YTBBK0FxWHZqYUh3V3c2OS9VNVMwVE5UWUwySmFoYXNkWGYzQlpVdEZwOExJTzhQdGFXdlU1YkZ0Qi9JNmVWZENWNkxsZ1JPN2FBeXlleXZ5YkgxZ1VBQTVtQjJwZlRGK3lHdlNHUjcxR0RGK1o5QmdCM2k3aGYrSTY4S0JyTitpemVhcHBZYXdBQUlIOUpSRUZVVy9QT1dPN0MzV0NiUVFlb0U5dDcwVC9NaWZ5N0kxdFdXN1VJT29xVWg0cnVXdVhqUlhjN1g5MEswRGRZOUxWRlcwSWZsS012ZXB4dUxuTkQ5YjNmMXhXUjlVUExydmNaOGJFRlhDOWs1amVYMlo3eHpvbmVIT1psTURqcnNVU05uajFZMEN0NnYrWCtyWjR5OE9lcnlUbWFMT3FuTExRRnRiNFBvcE1XNi9hMzNiVmw2ZHdxeEtIY1hQVTlzNWZaZC9VOG1LZ1JUMVVRMEdUdzE4U3lhSUMreUxWcXF6L1J3SFZvUzd3KzI2OUs0aHZMSE0zejB3TWJ3ZkoyMUxKWjcyZCthbVBKZ3U2T3JINzQxM3pmWHZPdmNnbllHeEs4Nkd3MVd0V3IranRwMTBWZmxWalBCQUR6TWhCdXlISjVib0Qxa3pZdmc2MUZYUW5KZlgzSlRpeEZrNkRVaUc3RFBzZDFBY0I0c01wOEdtd0RMOWhLY1NlNHgwWEpmeTh0RisxVTNrdG50cFd0SzhtL052QTY3d3FBei9iVzdGenlxbVVXUjdPSUR4VUFSQWxZMGV4NlMyWU1uaWV3SHl5L0RFc1MwVUROOHBkK1dOYUNRYjlqTjJ6ZkpqaTJQZXQwNHgwb3VwdnJqTWd4RmQwS09KUUJlVWR1YklmQjdIeENucHNtRytrWmFGMUtqWllnWHdkSlhiNjNsc3N0aUFiMDlIM1JNdHpyekg2dlZva2JDNWIxMDRtUGg1bUVNdDB1OEV2ZmI3bC9FODIrYzhkejFvSWJ5YmJObHQvSSs2RHF0TVdlekZaOVgvcGhjRExpTUZpSzFnREEyMEJITjJ4dnhGTVhCRFFkL1Bzems0N2RodHRRdVN2S0RZanVQVytLN2xiZFB0dWZrM1BhVDR2cTN1OVBpKzdtUko1WXVDVmJCTWVXZCtRNVRYNXFZOWNtRkJ1WnIvblNmOXJqcmpxQ3ZXUjVSU2MxMjI3UlNvMmVnamlVTFpCb2RYQk1Qb3ZUOGpsWnRQRW1HbUExUDJJc1NMamRsL3Zwcmd6ZzBkYzkwVHFYSkhrZ0U5dU9CWTExQWNCNk1EQXZ5V3UzVmhNQWZHL2pqMituSHNsbjFsY2FQRC9vN1dmM1hwc2NnTm1LSElDOW9ydnY5bXJSV3p6Rjl4RS9WQUNRaTVEMEQ2OERTTjBXZ2U2YjNKSGpiSDRFWlV0dTNCcGc2REx0Z1d3SG5GbCt4SVlOM0ZFQzRuMDdFendRZkpnOVllWElubGUwOUs5SFEyNVpjbHhLd25xY1dZSThxNGlteHlXNGlBYWpvNG9iMzRnbDR1aUhKL3F3YVhPWUZIQkVDWHJwckhXVVVYNlN1ZDYrWjM2UjJWcDArZStqKzdiYUdqdGxTZS9ibG9CZXgzSjZvY21waTljTkF3RDkyWnFjcFlscXAzSWNjVjhHRTcxQjNtZ1lCS1RQcVg0bXFnYi9XeFdyanFmbnZFNGFCZ0Fua29oNldCTUVhTExldUp3RTBkTVcyZ3pzVmNYZ3J3bTJkUUhBZ3R4UFRpVWdqYjYyV3ZFNXp4VmgwemJtZThGUzlaTGRqNktxak5HcHJoTUpyRGFEN2NIb2NXWWJCQURhOXYyaDVVaXMyZVRuSUZnRjBLL3IrenZhNHQyVDcrbkk2WWJERmlzQUZ3MEFVc0F6bkVsUzFHRE50eE04UCtqWDFhQzJwd0IwZWVYUTlySjBOdUhGVzd4SXdzQUhEQUIwanlUYS8vU2tscm9rUHMrYzFEL0M0K0E0b0MvdjZQTFhuczMwZGFEZmxzRjYzL2E0dFlqRGwwVjNPOS9jMGFEMHUvelVjT24vN2ZPNllzZmovQVkvYTQrZjIvZlh3aFBwSEhhVU9kNnhVd05lWUdlOFJRRGcvU3I2NVFqWkF6c0c5a05GQUJBTkltZGxBSERXWXBEeGdrb2FOQjNMelBqa1BRUUFuVXhtK3JBbGl5N2I2c09PdkU5K0RyTFVOeVJUWFcvWTN0NTVzbUlGNExVRUtPZGRBZEI3UTlzcit0djQ2dDJXekZpUFcyd0RUTnNxbXA2MjhPVi8zMXJKL1J6UGJZbTJNL1gxUFpCVnBNT0tQQnhkNmJ0dmcrNUxXZXJXVFA0VE8rTG1lK1hSekgzSnRoVjJaUEE4eVNSWDY4cmQ0NHJBM1ArT3ZoMnFNL1l0Uzl6YnRuMTIvN3F1YlBqcXNZOFArdmw0MzFzQSt4VUJ3QzJabE92a2N6UElIVmdQdG9ROHAyMm9TUUF3WkV1Wmk1bWpHcWZ5UVQ4dTRpSWx6ejdDTWNDcnRnMFFMWUcrdGhtSi9oR2piTmRoT1R2cEZaaWk0NEM2N0tLUjJiWnRGK2hTZjlXU1RYck4zZzdVM2h6Rlo1cStCL1pUemF4QUMyQmN0dURDUzYrMjJmZlgwcE0zTHJBQzRBRlcxUXBBVkZKVUcxUU5TeDVIRkFEa2xwRDEvZFowbVRtWGlIb3F5L3NIUlhmeExOOEM2RFRZQXFncTdLVEpvcW1VclI1MTArenZqZzBlcVNxWm5sVlA3NWsrRy94ZjJyYVE1d0FjdGRnR3lBVUEreGU0b3ZQanVqS3puRW5XcTBzRVhMUVpzV2FqcjBxZzVZLzUybWJGdnRLZ2xVMGZCQW0vdnBlOUo0TlJwMEhBUHhTczJxVEJVWmY5ZGZEMzhzMjV2WHV0bUxrc0t3clJ6RGQ5MW5YbDdsR0xBQ0JLaUY0TUJyKzAxWnI3dW05WjV1cE42TVJ4cFVHT3dtaURNV0s5UlJMZzNTRFlXUTMrN3V2QjZZNzlJTGdjcVFzQUJpMGhMQ1ZVNVVxVUh0clJtWTY5RVRXYi9VTUZBS25tZkYrRFdmcE9zRFVRblhkTkE5bjNRWUFSSFFmVVdmeStaZVV1V1RicWZpYjV3NC8vcGVXN3I4czhnS2l5M2x5UXZQTW11TEY3TUtibElXOEUyd3N2N1l4dTAzMS9uWFhuc3VMcmNnQ203U1RGbTB6R3U5ZmIxdnlGS2RtemZXaG4yYWZsaGgwbGtFWHZ0eWFKWnRHS3g1RWNsVXpMb1ZvKzI1TUFUeXlidXNtbFJWYThUcnZQa0E1c0crKzQ2SzBSb2VXcTB3a0F2eSs4a2h2WWdYeU9EMlVXMkNRSUdMVzhvMWtabkM5NmFVS3ZCaTllNDMvTmp2QjFLbzRDcm1icUFLemFFditKQkVRYVRPUldGYlIrZTEwQm9DYUpnQjcwZXdMc212M3RqbVR5VnZVNlJvblFSL0o1MW9UQXFnRGd1czF1bXdZQS9iWkNyYS85a1FWQ3VhOTdRYURoekgyOVl5c0FPZ0hPSmVHTzFXeWhkeVFBM0xIamo5RXh3UDZhaVlVbWxpOEdyN3VQSzJOMUFZQVhNZkNzNTJVNzdxTEZNMDZDWTB4Nlp2WkRCUUNYTTdQMEtGbHZyK0hSdS92RnU2NWlWeXpQSUhjYzhNZ1NNM1JsUVFmOHc1cklMLzBPcWFiNWxZYkpMeWR5ek9pMHlCZi9HYldadXU2cGFZS2hCeFpWKy81UjhaV3FjL0hIbGhDWnNxdWZ0endGNFAwcXRIdmVqQzFmYWlROVUzSE1MUGQrcXp0cWxxdE1xUHZoZXVSeHB1aXV6UGNtU0NpTm1pN04ydXhNbXp0RitTcUxObENrMTM1VEJvQm84TkJ0S0w4dlZBMytXb2lsS2dqd1kyL3A4ZWZrK2ZtbFRaSzB0a0YwNmN5MXY0Z2IyTXpZOGNLb0dOQ2JvbDBsd0RaRmdKNFh2ZDFLYjJXT0FpN2IzK3hRRXE1elJ3R2Z5V043QXV5aC9aNU5WbEp5aWRCbkV1VHNXU0FWYlc5ZVBXY0E0RVhSbHV6NTYxWkk3dXRSU2VDSHdlUmpYOTdibXR2UUtlSWljNW9vR1cyaEh3VmJnT2srblNzRWREL3p0NHRtK2JsamgxMnIyM1VCUUZScVVUT2ZOMlhKU2hOZE5tMjVOdnF3NUJKeG9zU01aeTBDZ0MrTDNtSUpVYktlUm5QUkMrU2xFMVBQOTIrS2QzM2pxNDREZG9yZTZsTXJSVnp5ZDhmK2lMa3RpQnRGM0JRa1d2cC9MVGRoSHpoWExTbFR0d0w2Wkgvd1djVytmM1RPdUtyNHltQVJWMmc4RGxZbzVtWHc5dG5PV1dZNWF6RFlxbHF4RXlvNkNHaGQ5Vnl4bWJyM1c5WHp6UzBqK3Z0N1ZqNC92Z0x3SnRoaW1aWHZXYkFac2xkSHJMcXA2ZzE1MDdZRXZGalVqS3hxOUdmdUM3bkJmNkhvTFFOY1ZRbFFWNSs4emJCMmQvTmlUOXUybk92Zm82MkgwL3M4Sll0Nk9XRFAydmZqZXljTkE0Qm9mOS9MQUtlQVRjc0FwNjJxZS9aNTkxb0R1dVdpczlyb2F6cXBhWlAvVXBYbjRsdXNXdGJiSDY5VDVDdkRuamNBR0E2T3d1MUtFbXY2M09TKzdsdVdxU21RVjlqVDdSRk4yajJVNTN1VVNTZ2N6R3loUjZXQWRXVW90MTFidFhXcEt4QzYxYXBibFYyL1g5TUF3RytHbmxpUW90aTVJTmtoRnkzck1wLytvZDlZMW1JNmg3NWdONmxjQU9EbEV2MU1wdy9TMGZKSnozbkpjdm4vNjZLN0ZuT1Q0NEMrL0Q4VGJBUG9iQ3gzL08rT1plbVAxQ3o5NnhFWHJkMXdZTWN5dlJhMmx4eGR0QStRSGk5TU04UW14VmVxNmxaN0pjQmN4YnZ6VkFKTSsvTStRTjZSbFlsSFJYZloyRFlyVHJseXMxRWlVY2NHZFMrZ3RTVUpVMUh5bkc0WCtQZjRhNUlhTUVVbmVUYmxacll0MnhmYVYySlBQb081QUdEYUFyVGo0dUs5QUZMK3lZQnNGWTdMRlcyNUhSZHh3VEg5dnRSMWI2QjQxOGYramlRZXBrQWdhZ2kwR0x6ZVRRSUEzZCtQYWdpa29DUnFCSFJiRW5PMXRYUXVIMEIvWHZRMURlVGE1TDlVNWJua0dudHRXOTZHMXB5SWVzUFVCUUIxZVRiNldVMC9jMWVTMEtPdjU4b0EvMkQ1WTVvZ3VXSEhkcmVLM202aGEwVytrRk91R1pBLzNrcXdOVGFZV2MzenJjc2xlWDlGaGR5MFg4RjRYUUF3WEhHVVRtOU02OEdON0tDSWk3ems5a1owWU8vSVRYdEZvcmh0bVdua2JzaWZsOXNBMzh0c1lzd0c2VzA3dnhuVlRkWjJvamVMZDcyaVV4Yit6V0EyNUh2Ylo1bXoxRkhkLzdPYTQzKzN5Zy9LdlNBeE01ZVp2MW5rUys3bXRnS3FhbGUvdHNDaVRmR1Z1cjRTWjBGaW5OZTh6NVUzZlZTUnVadkxnazNiSFNrcmVxRG9MZ1BhcGhsUTFIQW1Xa1k4c09TNFhjdVVQclQzUXU2NGJmUTlCOEZSbjZoam1CNzEyaW02QzNrdHkxSEJEVm1OOFZvWXc4Rnk5UHZxQm5pdC9MM3Z5dDlsc0NaQjdKZUtHV3I2M29IeTgzcW5YTVc3V3M2dVV5Q1FHZzhOeTFuK1hFdmdkUm5VYzZXQU40cnFWc0NQaTk1V3dQZUs3cTZGMzVVVGpxdEZYQUJzSmhnRVZqTmY4MFkrVGZKZjZqN1RVV3Z2QlJsMDF1VStvWlVhUGZIenU0cnRxdFdLbisvYmlxdEJ2a0x1NjdsR1FINlAxWUpvMnVKNFdZNjRlenZ0R1ZtMjE5eWtYRHRnZmJ3Rk9UV25yMUdmbmZyS2JWM095SHNzS3VTbUovSWVOVWtDSEMvaWlteCtZOXF4bTlKcFppa3hmVEJIaXQ0NnhyclBjbFR6dUxrYjhuL0xOc0ROaWoyZHRBM3dTOUZibE1jejcyK1VONDB2eXV2YmlrUkRmUjYvWkdiMW5yMzVjNFBqZjJrMjROR3BMLzM3TFBsVnNEVVFIWDlKUHl2WFlldE1mc2Z6ekJZMFkzY3lNeXM4bGFEc3hKWVJPOEU1NGliZEFIL09yRUpkS2Q2MWhyMGx3VUF1QURncnF0c0JlOHZaYUJsUmc1M1h0dituSGY4MDBTZzZiaHQxQkR3SVpuclhnMHhwYmYrcVd5TWFIRlFkMzQxcTA4L0p3TGhhOUxaOG5RaUNnSFhibGtuTDg1Zkx6KzZOOHZON1cxWnJjdnVmSjBXKzVQajk4dnR2bDQ5M3Zmd01mMVYrcHJYMThHMEpCTkpKRWswbzFZVEJCUW1Pb2xMQUtSOGhLaDZVVm9wU1VISzNmTytrVnRKWHl0ZmhVdm03WHM2cy9rV0R3RnptYTk3S3R5Ny9wY21xM2wxWnFVbTVGRHJvYUE2RzV6bm8wVTl2Y0ZNM3dHbDVjVDJsTkIva2ZlUytubXNGL0Uxd3pGVURRYzIvbVM2L05pMVgydEx4bHR5YW9Ed3BXMW1lMDZPZElVZUw3aG9adHh0c1hhWnR5RndoTjMzc3dTYUZnSHp3akxvQm50b05XK3RjYjJlU2lhck90K1llOTFST0d1U09qLzFGQnVrYlJkemRTWmZGUGFsc3R1anRuWHl0ak1RL2t4VUdUVFFjTDNvcmw1MFUrYTZDMFdwQjNmRy82K1hQOVpyNkszYjB5anRUUmJVQlRtM0dxRnNldWZQNlA4blo5UE1VWC9teHlQZkc5dmJTbW1EamU2akxkdU45RkJ6NTFIMXBiVkdyUitRdWxhL25sZUpkQzlxK21tWEYvWW9BNEFkSkVyMGNiSG40M3A5Mk9ldklIdUtlblRUWUt1TE9hTWV5U3JBcnk2czYwL09aWXpwWjhWd1NDR2ZrcHZ4Q2J0NHprb0E3YXFkRjdzbU0vSWtsNjgzYjREOGNERmgrSTM0c3B6UFM0UHh0K2Z1bkZZSCt6TDBvMS9ESmsyZXZsWVA5TitVOTRyUHlaMzBwZ1VBS0NHOFg3K3BnRE1sV3hHUEpTWGhSZEhkSjlGTEFMNHJlTnIrNnpOOVgzajkrTEQvYlY4dm4vSFg1M3Z5OG5NeWtIdkRmV2o1QWJoQ1l5bnp0cWZ3OTZnYVJxa3Z6WEg2d0lNQUhIYy9COE9xSmFXRDd1dWd1NnROa2dCc3B1a3RTVDJieVBpWnI4a0hTdnYvMThqVytKS2NTK2kwUWZGdytCNzBlRisvYVpqK1JMWjNVT080N082SThYRDcvRkZoR2o1ZTJoRkx2bWJlL1MzWGpuZytoaUF2TitBMzdNSE16MHh0WnROK2lOMjB2SXFKWnQzcXoweDdwUjVrQTREK0xkMzJUdncvMjZuMzJjSlE3STJuSDR5NlZIOFpQaSs2dVRGWGRCNCtLdVBDRkgwczhxc2hCMENEa3F5S3VES2FQNGEwN1BWRFFYdCs3UWRacTd2aGEyNnVxYWxmZG5waVgyUFV6MGkvc3hudXZJak45TzBnUWUxcitMZjlXNW94OEk4RmkzYkxpYXRGYkl2cWVyQkw5VC9tNHVXQW5WUVBNUGMrVUhmNnE2SzVEdnBYNW5rMlpzYy9iVE8reTdIZjN5YUNkRXQ0bTdhYXNOKzlKeTBaUFM2VFhNa0dBSnV0TjJtRGpBMVowSXg0b0J4TWZuRDJRSHc4U1Bhc2FQbWtDNzVmbDQvN3A3OWQvbEQvcjAvTHZwUUhoTlZrWlNsc1JnNVluTUNGSmU0UDIrbzdMdjlHYitYM1ozMDhEZndwS3ZpcmZPMitmKzEvL2Z2M1gzNjlQeXZ2WlorWHZmaVVZVER4L1phemlhME95SWxMMS9WV1g1cm1rd1BtT3ZFWmFmME56TU1Zc3dmRzNnYTE4N2RzOHQvVHpiOXUvSFEveVBuSmZINUgzM0EreXhmdlpQK0MzQU9CVzVvYTlVSE5qMnJMOUw1OFI5QVVmYUMxSXNWRnpnL1NDRTdway9vbHNBK2pla204NWVQS0dKNVhwelB1YjhpYng1L0xEZVNsekhMRHVzWjhGV3lyUmM0bG1NQ2tJaVdxRGJ3V0pLQXVTYU9QbmZhdWVkNVRndFhXT3kvcy9YQW1Xdy9USW51NkorVkhUeFpwWjZjM00yZlFsT3grdiszNmZsRGZaenpOSFIzUExpdk1TekdxSjZMUkM4M241dUxsZ1p6NFl1UFI1YXVHZEY3TDN2RlR6UFRNU0dLWFBXUXB1VWhCd1QvSWN0RXp5Y0hEekhwVlp6TDN5UFppV1NLL1ZKT3Y1VGZxTzdLK1AxdHlJLzFRT2Vpa1FTRW0zZmkrS3VqaDZ3eWRmd1h2N3Qva0xkM2FnV1FCUWRjT3V1akZwTXNQTFlFWndXNVpZdkpaNDNRMXlvZWp0TTZCSlJQOG0yd0RSa2IxMHRDMUszcGlXdmNNSDVlK1ladDZmbGJPR1A1ZkJRSnZIOXF6WEp6WklSYzhsbXNGOFVmUjJCL1BYWXlrWTdPcityVDV2VC9CYURMNm55ZVg5SDc2eTVURGRFM3RxZTJKNlU1K3g1S2tKV3g2N1dRNU1YcDN1aGUydCtkN2NQNWRCd0tlV00xSzNyT2d6M0g1Skh2cXlmTHhQTXArZFNja3VuNjE0bmxPeXRKajJudXUrUnhQTGZwM3BjUWNEY0pFQUlIZkRUa2tSTDRJYjlxemRjTk5SS1IzODAzbDJieWp5dE9ZRytUS1RkS0ZSLzcvSXNwblBIbEt5eXJQZ2NWN1lqYjFQQ3U5Y0ttZisvMzdCeHg0TEJxbXE1eExOWUx6Z2pmK3NLQkdsNnQvNjg5WUVyK2VaNzJsNjZSN3AzNElnSU8yeFBySTlNZS9pRjUyUnZtdXowbHRCZ1JmZFczdGllM1AvV000Mk5WaTgzbUJaTVpyaFhwY2swYitVajV2Yiswdlo1Wk1WejNOVUVqTEg1R2phWkhBOWtTWDhOSnYrZFhtVk94aUFpd1FBZnNQdUQ1SmlubVp1WnA3TTBDK0QveFZaRXI2ZEdRaHlON3NvNldKYzloSC9xUnlvL3lvMUFXNVlzc3A0UmZLRzN0aFRmZnkwL1ArdjUzeHNUM3dac3NFZzkxeTBTVS9LUWRCZ2JDejRXVkVpU3BOL095eDdsSVAydHpqdmxmYVFoL2cwQWNEL3JRREFPOE1OblBONllPZGN2VzNydzVwcldHWTIxeXlwS1NvVzR2dUxhYjh5N1VQNjQ0OUlrS0w3cFg0T3VlMlZ6b2JmRFpLeFBMTlVnNXp4VFBKVit2NkJ6UE1ZdGozYnE3SVBmQzNJY0g2UStYMDFRL2xtK2Z2M2wvOU5yMzc1bStxTWZxVGk3NmkvMzdVeXdQbzBrK1RVOUxIcVdnR1BXQUpVMjc0QlAwZ3kySkJrdGxkZHcvS2V1bk9POTN5VHowUjYvamVMdUIrOXJ4S01aZDV2R2dDK2orZDYzWjV2azhlb2VzemIzSTJCang4QStPeDg3SnpYcUJ5QjZTKzYyejgrQ1pacW82TVJhUWF0ZGZCSFpUdWk2cWlIem1vbmdzZlhtMkNUNEtMcE5TYUR5TTNnT05ZejIvZE8yeHk1NDFkOUZVdmNYa004RGJLZUJLWm5uRWNyTW5WVHdKVWJWQi9aMzlRSDFLY05mNy92YkFuK3pqa2U2M2JSMjFJMENxclNpa2pidmdGMUt6eFBHcXpDVkwzbnozUDVhK25IMEthRDVMakpZTnZ1cFNYb3ZvL25HdjA5MnE0ZWRhMU1jVGNHUG40QTBHLzc4MU10ejR4NjhZRzBCNjdaLzFGeGhhZzRRdHBMdm1YMUNYSU5RN1RZZys5clQyY1N4TVliQmhkTnJ5azVxKzZsUEY5SWt0MnlKVHBHUjkyaWdpNyt1bWtYc1lIeXVVVEh3Q2JrN3htZDFVMEIxN0FWdzRpMlpOTEFNV3dENmt5RDN5L05Gcjh1dWpzY2pyUjhMRS9jODBGdTJuSWl6dE0zb0NySFk3cEJIa2JWZTc3dDVjLy9mbENJWmlrNEhqZGR4QTEwOU9qZyszaXVmY0hmbzIzK1NGZHVDbmRqNE9NSEFIcWpuQTdLQ2phOTVxeXVzWi8vMTNLSVVibEZ6U2JYOHI1Nm5LNnUvZWU0WkxZdkZma1dxazJDaTZiWG5QemVVVE1QclMrdFJ4MVhnbUkzWG5Wd1BuaWQ1bXhnR0t3b0JETWRWT3lhazRCclVuSVh2QjIwRDZ6alFkR2I1YURNNVp4VkhVeUZRS0lPaDFNTkh5dXFDTFlRQkZWYVFheHQzNEM2VXg1TE5TY3h4bXJlODIydjZQbjc4ZEpOZVU5cFdkUTFlNyt0V2ZHZzkvRmN0VlgyZE9iMFNaUEgvTzEwQ25kajRPTUhBSDZqYkZvejJxK1ZvcnRCZ3RibVh5MjZHeUtzUzZHVTdhSzNJY21kb3JlejNIcFIzYll5YXR1clAxTXJ4RFVKTHBwZTJuQm5TTTZENjAxYXE5K2x3a0ZSdWR2N1JXLzNMWDJkTm16MTRJa3RYMGNyRDFxejIrdDF6OGlKaEZ3NzZBV3BXYUIvanpWN2ZkUHZwMVVIeCtTWVl5b1NsT3R3R0QyV0YyM3lscHMreUdrUm9MWjlBN1FuUmxUbllTdFRpNkhwZTc3dDVjOC8xN01qbFEzZWxRSkRXMUs4NnpBb24vcytudXRnVU9XemJSMkpydm9VM0kyQmp4OEFSRlhoOXM1eFJSM1V2SE5XdWlGdFNQblpUbERmdkNvQU9NdVVvYzNWZCs4RU5lTHJnb3VtbHovdXc2RDNnWFlsUEpSQnlCdmVQQzJxT3c4ZVN2QzBMRDBIeGpQTHc5b01acStJTzNZdFNrR2FxQjEwMUhudGVkSGI1RWNIb1hVclVKVHFMZHdzNGlZekt6WmdwYitYRDRBK29PdjNIRmt2aHFsejlBM0l2WDl5MTJIUjJ4WTA5NTV2ZStYNkVmanZwdzJwOXFVd2x6N1hOcCtWTnM4MTl4bHFXa1Z5M3l0VWNqY0cvaGdCUUtkaFBmaDBIVFVNQUU1L2h3RGd0RVVBY05iaWloNDNhbVNpQTlTV0RabzdSWGUzc2VqMzJwTXl6RWRGM1B0NzBHYWYyZzQyL1MzVDc1eDZkdTlJTURFZkJCelJhK3hiQUttRnNEY2cwbmFVYWMvNHJsWHlpem9jbnNqcXlMSXRnVWNEK25IRmdONjJiMERWK3llNm1nWUFKK2U0b3M5VDFKQnFMd2lBb3VlNjFlS3owdlM1NWo1RFRlOFpCQURBSHpnQXVPaU01U0lCUUs2NXo0Y09BSnJPWG5JQmdEN24xQm5PWi92YXBLanE5NXEzV3ZmN1JYZEhOSDI5Um14NVdIL0dhL2tiYVRDZ3dVVGFSOWZCdUpOWk9wNlF2V045UHNkeVkvZFd2bVBXNk1WYkJYZUs3dGJUVVg1RWJnWGd4QVpBbmRHMzZSc1F2WC9xVnIycUFvQlZLM1BkOXRvTWdqek5BVmkyYmE1MXFVaXB6M1VyeUFGNEg4ODFGNnkydVFnQWdEOVFBT0I3emhmWnMyd2FBRVFEbXU0VDYzTDZvUXhvMncwRGdEWURiWk5yVDJZeGJRT0FGUnRrL2Z1akVzREx0cG9RQlV6UjRLamRGTFVuL1g0NVdLY1dzL3N5VUtUWi9GbnhycE9nRGtJUFpHRDFQdkVhT096S29LTUprcjY5a1FaeEhmeFhaYTlaVDBoRU9RQlJsN2dVZExUdEd6QnMvUmRXR3VhOXpBZXJGRE9aVXRkdHJtVmJSWWtTVjVjc3NYYTI0cmxxYjRQMzhWd0hnbFdudG5sRHk3SUNNOGJkR1BqNEFVQlYxdmxGc3BaekFjQitFQUQ0Nm9GbjlHdVh1OWZsb09HRFUxVUE0RXZ0NTgxZ1hxc0pBSEs5ekkvTGY3dHQrOEs2aWpGVjBRVElWd0MyTEhmQXV5Q201ZkVUbVdrdFM1ZTZQVm0yUDVHVmpXTUpzSFlzU1d0Q1RtZjRRS1RKanJtV3VnT1o5OFMrQkNHcjBsTmgwbW9rUktjQXFyckV0ZTBiTUdBQlE1UFRNSHFVODVHdGtFU2xydHRlK3RoM2krN09mSDdVTlozV2lKNnJsNEorSDgvVkE1TFpjNXdjbXRWa1Z1N0d3TzhUQUx5dnhqRGFzS2NxQUZpWEFLQnFNTmVNL3JTL2VDd3p6RmUyejF3WEFLVFZndk9jWVo1dkVBQkVIUU4xRHovOTc3RXNxL3BSUm04RGZHQTVBSjVvOTdnbStVeURuL2t5RUVoNzkya0pYZk1hOUdmb2pIcTA2TzROL2loSU9xeHFxZnZBQXBYbHpMK2Z0cDRLZlVFRG42bmd5S0ozaVd2Yk42RFA2aUUwcVljeEpjV2NCcVdUM1hoRlhmODJseGJIK3JHbTJKWDJHSGhjeFAzSGg2VUs1RVdmcTc0UEhwK3pma2dxNVBWcnpRanV4c0R2dHdWdzBkYXczckszVFFEZys0dlJZSDRnUzlhYnRzYzhXaEVBSEFjQlFOc3Facm5CMVFPQW9jdys3YTZjQURnc3Z5ODZCamhVY3pwQjkzcjFxRjNWOFROOXJYVHBXTS9GNjZrRy94bHBSajFjbGgzK01haEtGOVZTOEphNi9iYU1uL3YzYVVsK1NHb0lmQi84elo0RXZTbCs2N0hBSnhzQTJ1VUE2SG5wdGxlVEpFQTlPcmN0QTgrNkJRQytSNmxMMTV1MkgvbFlhb3ZuRXB0MHozeXlaUjN6dXJQZG1rbWUyNmRkazhCcTA3THZYMWhSSDg4ajJDaXZkVnZxMXVkZVZZQm15WDdPYzhrdjBCb0I2eFUvSTNVdHZHejlDb1pxcWlucXN2TWRXem1ZcXZuMzk4dkIvKzNmNmxzK3FRRHdjUUtBVHNzamNWRUFVTFhjdTJ3RHo0cWNheDhMOWlqbjVYczBRL3lwbEp5dFNteGF0U3pvSytYQWNyTWNtTzZWQTVwZjl4dFVkOU1LZzc0OG5nYmJWN0sxc2xoK3oyeVE2UFpBZmw1NjNndmxsYXI0K1ZMM1FJTVN0UHB6dEczd1hLYXk0YlQxV1VoZEM3K3d2Z04xL1JTMHBXNWFPUmhvK085VEM5NjMzUmd2OFVrRmdJOFRBSnluS0U1VXVDUzMzRHVYS2FlYkt0dnBIdVZUU3pMeUd2cERNckRrRXB2bXJCYjZsK1ZBZHJVY1pHNlUrOXQrM1dzd3VHcVBnV2lmZHFyOGZWOWFEZlFwMitQdGs1ODNKZzFmWHBUWDgzTGdmeEswRTY1clFxTS9aOFQyZm5POURYcGFGdk5wQVlEL1h3R0FKNjZ0bmJNa3JpZDlWUzMzK3Y5L1pnbEdVUUxYVkpDTXBFbGlWWWxOVTdKSFBGeTJwdjJpREFRdWw4SEF0M1pkazZaRVZZT3JkaG04Wm0ySjAyQTdZVGtGRTlaRk1EMEhmOTdqNWIrZHNNNkRROUtDbUlFWkFIQ3VBRUJudURNWGFJcmpTVjlWeTcxam1aYTZnK1ZnZUwwY0RQdkt4eGdwQjBSdE96d29BK2YzL0NVQkFHZ1hBTnlYMXF5VEYyaUwrNXpXbmdBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFQZ2QvQzkrZElrSGlObEVid0FBQUFCSlJVNUVya0pnZ2c9PWA7XHJcbiAgcmV0dXJuIGltYWdlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm50KCl7XHJcbiAgcmV0dXJuIGBpbmZvIGZhY2U9XCJSb2JvdG9cIiBzaXplPTMyIGJvbGQ9MCBpdGFsaWM9MCBjaGFyc2V0PVwiXCIgdW5pY29kZT0wIHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9NCw0LDQsNCBzcGFjaW5nPS04LC04XHJcbmNvbW1vbiBsaW5lSGVpZ2h0PTM4IGJhc2U9MzAgc2NhbGVXPTUxMiBzY2FsZUg9NTEyIHBhZ2VzPTEgcGFja2VkPTBcclxucGFnZSBpZD0wIGZpbGU9XCJyb2JvdG8ucG5nXCJcclxuY2hhcnMgY291bnQ9MTk0XHJcbmNoYXIgaWQ9MCAgICAgICB4PTAgICAgeT0wICAgIHdpZHRoPTAgICAgaGVpZ2h0PTAgICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MCAgICB4YWR2YW5jZT0wICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMCAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MCAgICBoZWlnaHQ9MCAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTAgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTMyICAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0wICAgIGhlaWdodD0wICAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzMgICAgICB4PTMzMiAgeT0xNDYgIHdpZHRoPTEyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNCAgICAgIHg9MjIgICB5PTI2NyAgd2lkdGg9MTUgICBoZWlnaHQ9MTcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM1ICAgICAgeD0zNjUgIHk9MTQ2ICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzYgICAgICB4PTQ4NyAgeT0wICAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTEgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0zNyAgICAgIHg9MCAgICB5PTIxMCAgd2lkdGg9MzAgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTIzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTM4ICAgICAgeD0zOTIgIHk9MTQ2ICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MzkgICAgICB4PTUwICAgeT0yNjcgIHdpZHRoPTExICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT02ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MCAgICAgIHg9MCAgICB5PTAgICAgd2lkdGg9MTcgICBoZWlnaHQ9NDEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0wICAgIHhhZHZhbmNlPTExICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQxICAgICAgeD0xNyAgIHk9MCAgICB3aWR0aD0xNyAgIGhlaWdodD00MSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDIgICAgICB4PTI0MCAgeT0yNDEgIHdpZHRoPTIyICAgaGVpZ2h0PTIzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00MyAgICAgIHg9MTgzICB5PTI0MSAgd2lkdGg9MjQgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD03ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ0ICAgICAgeD0zNyAgIHk9MjY3ICB3aWR0aD0xMyAgIGhlaWdodD0xNyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIyICAgeGFkdmFuY2U9NiAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDUgICAgICB4PTE5NCAgeT0yNjcgIHdpZHRoPTE3ICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00NiAgICAgIHg9MTgyICB5PTI2NyAgd2lkdGg9MTIgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yMyAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTQ3ICAgICAgeD00NzEgIHk9NDEgICB3aWR0aD0yMSAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NDggICAgICB4PTQ4MSAgeT0xNzggIHdpZHRoPTI0ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD00OSAgICAgIHg9MTcxICB5PTE0NiAgd2lkdGg9MTggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUwICAgICAgeD0xODkgIHk9MTQ2ICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTEgICAgICB4PTQzNCAgeT0xNzggIHdpZHRoPTIzICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01MiAgICAgIHg9MjEzICB5PTE0NiAgd2lkdGg9MjYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTUzICAgICAgeD0yMzkgIHk9MTQ2ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTQgICAgICB4PTI2MiAgeT0xNDYgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01NSAgICAgIHg9Mjg1ICB5PTE0NiAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU2ICAgICAgeD00NTcgIHk9MTc4ICB3aWR0aD0yNCAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NTcgICAgICB4PTMwOSAgeT0xNDYgIHdpZHRoPTIzICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD01OCAgICAgIHg9MTcxICB5PTI0MSAgd2lkdGg9MTIgICBoZWlnaHQ9MjUgICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTU5ICAgICAgeD0xNjEgIHk9MjEwICB3aWR0aD0xNCAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9NyAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjAgICAgICB4PTMxMCAgeT0yNDEgIHdpZHRoPTIxICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02MSAgICAgIHg9MCAgICB5PTI2NyAgd2lkdGg9MjIgICBoZWlnaHQ9MTggICB4b2Zmc2V0PS00ICAgeW9mZnNldD05ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTYyICAgICAgeD0zMzEgIHk9MjQxICB3aWR0aD0yMiAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTkgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjMgICAgICB4PTM0NCAgeT0xNDYgIHdpZHRoPTIxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NCAgICAgIHg9MCAgICB5PTQxICAgd2lkdGg9MzUgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTI5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY1ICAgICAgeD02OCAgIHk9MTEzICB3aWR0aD0yOSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjYgICAgICB4PTk3ICAgeT0xMTMgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD02NyAgICAgIHg9Mzk1ICB5PTE3OCAgd2lkdGg9MjcgICBoZWlnaHQ9MzEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTY4ICAgICAgeD0xMjIgIHk9MTEzICB3aWR0aD0yNiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NjkgICAgICB4PTE0OCAgeT0xMTMgIHdpZHRoPTI0ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MCAgICAgIHg9MTcyICB5PTExMyAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTcxICAgICAgeD0xOTUgIHk9MTEzICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzIgICAgICB4PTIyMiAgeT0xMTMgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03MyAgICAgIHg9NDkyICB5PTc5ICAgd2lkdGg9MTIgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc0ICAgICAgeD0yNDkgIHk9MTEzICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzUgICAgICB4PTI3MyAgeT0xMTMgIHdpZHRoPTI2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03NiAgICAgIHg9Mjk5ICB5PTExMyAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTc3ICAgICAgeD0zMjIgIHk9MTEzICB3aWR0aD0zMiAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9NzggICAgICB4PTM1NCAgeT0xMTMgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD03OSAgICAgIHg9MzgxICB5PTExMyAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgwICAgICAgeD00MDkgIHk9MTEzICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODEgICAgICB4PTI5NCAgeT00MSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04MiAgICAgIHg9NDM0ICB5PTExMyAgd2lkdGg9MjYgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTgzICAgICAgeD00NjAgIHk9MTEzICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODQgICAgICB4PTAgICAgeT0xNDYgIHdpZHRoPTI3ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04NSAgICAgIHg9NDg1ICB5PTExMyAgd2lkdGg9MjUgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg2ICAgICAgeD0yNyAgIHk9MTQ2ICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9ODcgICAgICB4PTU1ICAgeT0xNDYgIHdpZHRoPTM2ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD04OCAgICAgIHg9OTEgICB5PTE0NiAgd2lkdGg9MjggICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTg5ICAgICAgeD0xMTkgIHk9MTQ2ICB3aWR0aD0yNyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTAgICAgICB4PTE0NiAgeT0xNDYgIHdpZHRoPTI1ICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05MSAgICAgIHg9MzQgICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9NDAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMSAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTkyICAgICAgeD0wICAgIHk9NzkgICB3aWR0aD0yMSAgIGhlaWdodD0zNCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTMgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTMgICAgICB4PTQ5ICAgeT0wICAgIHdpZHRoPTE1ICAgaGVpZ2h0PTQwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTEgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NCAgICAgIHg9NDg0ICB5PTI0MSAgd2lkdGg9MjEgICBoZWlnaHQ9MjAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk1ICAgICAgeD0yMTEgIHk9MjY3ICB3aWR0aD0yMyAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTI1ICAgeGFkdmFuY2U9MTQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTYgICAgICB4PTEzOSAgeT0yNjcgIHdpZHRoPTE1ICAgaGVpZ2h0PTE0ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD05NyAgICAgIHg9MzYzICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTk4ICAgICAgeD00OSAgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9OTkgICAgICB4PTM4NiAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDAgICAgIHg9NzIgICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwMSAgICAgeD00MDkgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTAyICAgICB4PTk1ICAgeT03OSAgIHdpZHRoPTIwICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDMgICAgIHg9MTE1ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNCAgICAgeD0xMzggIHk9NzkgICB3aWR0aD0yMiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA1ICAgICB4PTQyMiAgeT0xNzggIHdpZHRoPTEyICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDYgICAgIHg9MTM2ICB5PTAgICAgd2lkdGg9MTYgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEwNyAgICAgeD0xNjAgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTA4ICAgICB4PTQ5MiAgeT00MSAgIHdpZHRoPTEyICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMDkgICAgIHg9NDMyICB5PTIxMCAgd2lkdGg9MzIgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTI4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMCAgICAgeD00NjQgIHk9MjEwICB3aWR0aD0yMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTExICAgICB4PTE0NyAgeT0yNDEgIHdpZHRoPTI0ICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTIgICAgIHg9MTgzICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExMyAgICAgeD0yMDYgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE0ICAgICB4PTQ4NiAgeT0yMTAgIHdpZHRoPTE3ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTUgICAgIHg9MCAgICB5PTI0MSAgd2lkdGg9MjMgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExNiAgICAgeD0xNDIgIHk9MjEwICB3aWR0aD0xOSAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTE3ICAgICB4PTIzICAgeT0yNDEgIHdpZHRoPTIyICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMTggICAgIHg9NDUgICB5PTI0MSAgd2lkdGg9MjQgICBoZWlnaHQ9MjYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE2ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTExOSAgICAgeD02OSAgIHk9MjQxICB3aWR0aD0zMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MjQgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIwICAgICB4PTEwMSAgeT0yNDEgIHdpZHRoPTI0ICAgaGVpZ2h0PTI2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjEgICAgIHg9MjI5ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyMiAgICAgeD0xMjUgIHk9MjQxICB3aWR0aD0yMiAgIGhlaWdodD0yNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTYgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTIzICAgICB4PTE1MiAgeT0wICAgIHdpZHRoPTE4ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjQgICAgIHg9MzIyICB5PTQxICAgd2lkdGg9MTIgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTEyNSAgICAgeD0xNzAgIHk9MCAgICB3aWR0aD0xOCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTI2ICAgICB4PTExMyAgeT0yNjcgIHdpZHRoPTI2ICAgaGVpZ2h0PTE1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTIgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xMjcgICAgIHg9NDE5ICB5PTE0NiAgd2lkdGg9MjAgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE0ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2MCAgICAgeD0wICAgIHk9MCAgICB3aWR0aD0wICAgIGhlaWdodD0wICAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTAgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTYxICAgICB4PTMwICAgeT0yMTAgIHdpZHRoPTEyICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjIgICAgIHg9MjUyICB5PTc5ICAgd2lkdGg9MjQgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD01ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2MyAgICAgeD00MzkgIHk9MTQ2ICB3aWR0aD0yNSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY0ICAgICB4PTE3NSAgeT0yMTAgIHdpZHRoPTI5ICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NSAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjUgICAgIHg9NDY0ICB5PTE0NiAgd2lkdGg9MjcgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2NiAgICAgeD0zMzQgIHk9NDEgICB3aWR0aD0xMiAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTY3ICAgICB4PTY0ICAgeT0wICAgIHdpZHRoPTI2ICAgaGVpZ2h0PTQwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNjggICAgIHg9MjM0ICB5PTI2NyAgd2lkdGg9MTkgICBoZWlnaHQ9MTEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0zICAgIHhhZHZhbmNlPTEzICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE2OSAgICAgeD0wICAgIHk9MTc4ICB3aWR0aD0zMSAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTcwICAgICB4PTQ0NiAgeT0yNDEgIHdpZHRoPTE5ICAgaGVpZ2h0PTIxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzEgICAgIHg9MzUzICB5PTI0MSAgd2lkdGg9MjEgICBoZWlnaHQ9MjIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMCAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3MiAgICAgeD02MSAgIHk9MjY3ICB3aWR0aD0yMiAgIGhlaWdodD0xNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEyICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTczICAgICB4PTI1MyAgeT0yNjcgIHdpZHRoPTE3ICAgaGVpZ2h0PTExICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MTQgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzQgICAgIHg9MzEgICB5PTE3OCAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3NSAgICAgeD0yNzAgIHk9MjY3ICB3aWR0aD0yMSAgIGhlaWdodD0xMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc2ICAgICB4PTgzICAgeT0yNjcgIHdpZHRoPTE2ICAgaGVpZ2h0PTE2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xNzcgICAgIHg9MzQwICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MjggICB4b2Zmc2V0PS00ICAgeW9mZnNldD02ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE3OCAgICAgeD0zNzQgIHk9MjQxICB3aWR0aD0xOCAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTc5ICAgICB4PTM5MiAgeT0yNDEgIHdpZHRoPTE4ICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODAgICAgIHg9MTU0ICB5PTI2NyAgd2lkdGg9MTYgICBoZWlnaHQ9MTQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTEwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4MSAgICAgeD0yNzYgIHk9NzkgICB3aWR0aD0yMiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTggICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTgyICAgICB4PTYyICAgeT0xNzggIHdpZHRoPTIxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xNiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODMgICAgIHg9MTcwICB5PTI2NyAgd2lkdGg9MTIgICBoZWlnaHQ9MTIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xMiAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4NCAgICAgeD05OSAgIHk9MjY3ICB3aWR0aD0xNCAgIGhlaWdodD0xNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTI1ICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg1ICAgICB4PTQxMCAgeT0yNDEgIHdpZHRoPTE0ICAgaGVpZ2h0PTIyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODYgICAgIHg9NDY1ICB5PTI0MSAgd2lkdGg9MTkgICBoZWlnaHQ9MjEgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE4NyAgICAgeD00MjQgIHk9MjQxICB3aWR0aD0yMiAgIGhlaWdodD0yMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEwICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTg4ICAgICB4PTgzICAgeT0xNzggIHdpZHRoPTMwICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xODkgICAgIHg9MTEzICB5PTE3OCAgd2lkdGg9MzEgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTI1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5MCAgICAgeD00MiAgIHk9MjEwICB3aWR0aD0zMSAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MjUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTkxICAgICB4PTE0NCAgeT0xNzggIHdpZHRoPTIxICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTIgICAgIHg9MTg4ICB5PTAgICAgd2lkdGg9MjkgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5MyAgICAgeD0yMTcgIHk9MCAgICB3aWR0aD0yOSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk0ICAgICB4PTM1ICAgeT00MSAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTQgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTUgICAgIHg9MTg3ICB5PTQxICAgd2lkdGg9MjkgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMyAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5NiAgICAgeD0zNDYgIHk9NDEgICB3aWR0aD0yOSAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0yICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MTk3ICAgICB4PTI0NiAgeT0wICAgIHdpZHRoPTI5ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0xOTggICAgIHg9MTY1ICB5PTE3OCAgd2lkdGg9MzkgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTMwICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTE5OSAgICAgeD02NCAgIHk9NDEgICB3aWR0aD0yNyAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjAwICAgICB4PTI3NSAgeT0wICAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDEgICAgIHg9Mjk5ICB5PTAgICAgd2lkdGg9MjQgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwMiAgICAgeD05MSAgIHk9NDEgICB3aWR0aD0yNCAgIGhlaWdodD0zOCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS00ICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjAzICAgICB4PTM3NSAgeT00MSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTM2ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTIgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDQgICAgIHg9MzIzICB5PTAgICAgd2lkdGg9MTUgICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwNSAgICAgeD0zMzggIHk9MCAgICB3aWR0aD0xNiAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9OSAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA2ICAgICB4PTExNSAgeT00MSAgIHdpZHRoPTE5ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTQgICB4YWR2YW5jZT05ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMDcgICAgIHg9Mzk5ICB5PTQxICAgd2lkdGg9MTkgICBoZWlnaHQ9MzYgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMiAgIHhhZHZhbmNlPTkgICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIwOCAgICAgeD0yMDQgIHk9MTc4ICB3aWR0aD0yOCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjA5ICAgICB4PTIxNiAgeT00MSAgIHdpZHRoPTI3ICAgaGVpZ2h0PTM3ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTMgICB4YWR2YW5jZT0yMyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTAgICAgIHg9MzU0ICB5PTAgICAgd2lkdGg9MjggICBoZWlnaHQ9MzkgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNSAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxMSAgICAgeD0zODIgIHk9MCAgICB3aWR0aD0yOCAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjEyICAgICB4PTEzNCAgeT00MSAgIHdpZHRoPTI4ICAgaGVpZ2h0PTM4ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTQgICB4YWR2YW5jZT0yMiAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTMgICAgIHg9MjQzICB5PTQxICAgd2lkdGg9MjggICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tMyAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxNCAgICAgeD00MTggIHk9NDEgICB3aWR0aD0yOCAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0yICAgeGFkdmFuY2U9MjIgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE1ICAgICB4PTI2MiAgeT0yNDEgIHdpZHRoPTIzICAgaGVpZ2h0PTIzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OCAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTYgICAgIHg9MjEgICB5PTc5ICAgd2lkdGg9MjggICBoZWlnaHQ9MzQgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTIyICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIxNyAgICAgeD00MTAgIHk9MCAgICB3aWR0aD0yNSAgIGhlaWdodD0zOSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS01ICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjE4ICAgICB4PTQzNSAgeT0wICAgIHdpZHRoPTI1ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0yMSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMTkgICAgIHg9MTYyICB5PTQxICAgd2lkdGg9MjUgICBoZWlnaHQ9MzggICB4b2Zmc2V0PS00ICAgeW9mZnNldD0tNCAgIHhhZHZhbmNlPTIxICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyMCAgICAgeD00NDYgIHk9NDEgICB3aWR0aD0yNSAgIGhlaWdodD0zNiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PS0yICAgeGFkdmFuY2U9MjEgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjIxICAgICB4PTQ2MCAgeT0wICAgIHdpZHRoPTI3ICAgaGVpZ2h0PTM5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9LTUgICB4YWR2YW5jZT0xOSAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjIgICAgIHg9MjMyICB5PTE3OCAgd2lkdGg9MjQgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyMyAgICAgeD0yNTYgIHk9MTc4ICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTkgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI0ICAgICB4PTI5OCAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjUgICAgIHg9MzIxICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyNiAgICAgeD0yODAgIHk9MTc4ICB3aWR0aD0yMyAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjI3ICAgICB4PTczICAgeT0yMTAgIHdpZHRoPTIzICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMjggICAgIHg9MjA0ICB5PTIxMCAgd2lkdGg9MjMgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIyOSAgICAgeD0zNDQgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjMwICAgICB4PTIwNyAgeT0yNDEgIHdpZHRoPTMzICAgaGVpZ2h0PTI1ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9OSAgICB4YWR2YW5jZT0yNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzEgICAgIHg9MzY3ICB5PTc5ICAgd2lkdGg9MjMgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD04ICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzMiAgICAgeD0zOTAgIHk9NzkgICB3aWR0aD0yMyAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjMzICAgICB4PTQxMyAgeT03OSAgIHdpZHRoPTIzICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xNyAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzQgICAgIHg9MzAzICB5PTE3OCAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE3ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzNSAgICAgeD0yMjcgIHk9MjEwICB3aWR0aD0yMyAgIGhlaWdodD0zMCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTQgICAgeGFkdmFuY2U9MTcgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM2ICAgICB4PTQzNiAgeT03OSAgIHdpZHRoPTE2ICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yMzcgICAgIHg9NDUyICB5PTc5ICAgd2lkdGg9MTYgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTggICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTIzOCAgICAgeD00OTEgIHk9MTQ2ICB3aWR0aD0yMCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9OCAgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjM5ICAgICB4PTI1MCAgeT0yMTAgIHdpZHRoPTIwICAgaGVpZ2h0PTMwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NCAgICB4YWR2YW5jZT04ICAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDAgICAgIHg9MzI2ICB5PTE3OCAgd2lkdGg9MjMgICBoZWlnaHQ9MzIgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0yICAgIHhhZHZhbmNlPTE5ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0MSAgICAgeD05NiAgIHk9MjEwICB3aWR0aD0yMiAgIGhlaWdodD0zMSAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTMgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQyICAgICB4PTQ2OCAgeT03OSAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMzICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDMgICAgIHg9MCAgICB5PTExMyAgd2lkdGg9MjQgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0NCAgICAgeD0zNDkgIHk9MTc4ICB3aWR0aD0yNCAgIGhlaWdodD0zMiAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTIgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ1ICAgICB4PTExOCAgeT0yMTAgIHdpZHRoPTI0ICAgaGVpZ2h0PTMxICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDYgICAgIHg9MjcwICB5PTIxMCAgd2lkdGg9MjQgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI0NyAgICAgeD0yODUgIHk9MjQxICB3aWR0aD0yNSAgIGhlaWdodD0yMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTcgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjQ4ICAgICB4PTMxNiAgeT0yMTAgIHdpZHRoPTI0ICAgaGVpZ2h0PTI5ICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9NyAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNDkgICAgIHg9MjQgICB5PTExMyAgd2lkdGg9MjIgICBoZWlnaHQ9MzMgICB4b2Zmc2V0PS00ICAgeW9mZnNldD0xICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1MCAgICAgeD00NiAgIHk9MTEzICB3aWR0aD0yMiAgIGhlaWdodD0zMyAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTggICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjUxICAgICB4PTM3MyAgeT0xNzggIHdpZHRoPTIyICAgaGVpZ2h0PTMyICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MiAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTIgICAgIHg9Mjk0ICB5PTIxMCAgd2lkdGg9MjIgICBoZWlnaHQ9MzAgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTE4ICAgcGFnZT0wICAgIGNobmw9MFxyXG5jaGFyIGlkPTI1MyAgICAgeD05MCAgIHk9MCAgICB3aWR0aD0yMyAgIGhlaWdodD00MCAgIHhvZmZzZXQ9LTQgICB5b2Zmc2V0PTEgICAgeGFkdmFuY2U9MTUgICBwYWdlPTAgICAgY2hubD0wXHJcbmNoYXIgaWQ9MjU0ICAgICB4PTExMyAgeT0wICAgIHdpZHRoPTIzICAgaGVpZ2h0PTQwICAgeG9mZnNldD0tNCAgIHlvZmZzZXQ9MSAgICB4YWR2YW5jZT0xOCAgIHBhZ2U9MCAgICBjaG5sPTBcclxuY2hhciBpZD0yNTUgICAgIHg9MjcxICB5PTQxICAgd2lkdGg9MjMgICBoZWlnaHQ9MzcgICB4b2Zmc2V0PS00ICAgeW9mZnNldD00ICAgIHhhZHZhbmNlPTE1ICAgcGFnZT0wICAgIGNobmw9MFxyXG5rZXJuaW5ncyBjb3VudD01NjBcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD00NyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NzQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MjA4IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTExNiBhbW91bnQ9MVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjEwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjExIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjMwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyNSBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMjIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIyMSBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMTQgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjM1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTE5OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTggYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMDkgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTExIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI4IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5NyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NDYgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg5IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0zOSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD00NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTkzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTY1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD05OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMjcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE5NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTE4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgxIHNlY29uZD04NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDUgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE4NyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjMxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTQ0IHNlY29uZD0zNCBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI1NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI1MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjIwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE3MSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTEwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD00NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjQ2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTEwMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTA5IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTE4NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTUgc2Vjb25kPTExOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MiBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODEgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xNzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjE0IHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIxOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyNyBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjMzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMiBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NzQgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyOCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0NCBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTEwMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xOTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTIzMCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTI0MiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQ0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQyIHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTAzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxNCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjI0IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDYgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTc5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjQyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD03NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTI1NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQ1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0zMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTAxIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTEyMSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQ0IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTY3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD00NiBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjE4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTkyIGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTExMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTE3MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTk3IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTcgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNTMgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTI0NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTExMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NCBhbW91bnQ9LTRcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTg1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE4NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5MyBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDQgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc5IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD04NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTkyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTg0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyNiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MjU1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTk3IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjU1IHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzMgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9NjMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NCBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTExIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD05OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03OSBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk0IHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTAzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTYzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjI5IHNlY29uZD0zOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD02NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMDggc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTI0MSBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD0xMTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5NyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTI0OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyNCBzZWNvbmQ9MzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MjI0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzIgc2Vjb25kPTg0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTE5OCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzMyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQzIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTk5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTY1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIyNiBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEwOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTEzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xOTQgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTE5NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTI1MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjMyIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTIxNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjQ5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTQ0IHNlY29uZD0zOSBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTczIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NiBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE3MSBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTA5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTgxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIxMyBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTg4IHNlY29uZD00NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTE1IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0xNzMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjM0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD00NCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjI2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MiBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xOTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04MiBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NDYgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjI5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0zNCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTk2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MjEzIHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTE5OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MTkzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yNDYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5NCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03NiBzZWNvbmQ9NzEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0OCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTIgc2Vjb25kPTIyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NjUgYW1vdW50PS0zXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0xMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9ODUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yNDMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTk3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNTAgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yNDYgc2Vjb25kPTM5IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTkzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk1IHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTk3IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEwIHNlY29uZD0xOTggYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xMTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTQ2IGFtb3VudD0tNFxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMjUgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9Mzkgc2Vjb25kPTE5NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTcgc2Vjb25kPTg3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD02NSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTExMCBzZWNvbmQ9MzkgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyNSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY2IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTIgc2Vjb25kPTM0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0zNCBhbW91bnQ9LTVcclxua2VybmluZyBmaXJzdD04MSBzZWNvbmQ9MjIxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjMwIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjEyIHNlY29uZD00NiBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjM1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjUyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTExMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MjI4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5MyBzZWNvbmQ9ODQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTk3IHNlY29uZD02MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTYgc2Vjb25kPTEyMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD03MCBzZWNvbmQ9OTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjQzIHNlY29uZD0zOSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD03OSBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTI0MyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MjUzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD00NiBhbW91bnQ9LTNcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xMTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MTAxIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9MjQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yNTMgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0xOTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTk2IHNlY29uZD04OSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjEgc2Vjb25kPTc0IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MTkyIHNlY29uZD0yMjEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMjkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTIzMSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTQgc2Vjb25kPTExOSBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI4IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM5IHNlY29uZD0xOTIgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xOTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTI1MyBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD02OCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQ1IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMTcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0xOTMgc2Vjb25kPTg2IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTI0NSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTM0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yNTEgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIyNyBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjMyIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0yMTYgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTE5NiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTAwIGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD02NSBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTE3IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NyBzZWNvbmQ9MTE5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yNDEgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTQ0IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTIyOCBzZWNvbmQ9MzkgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjUzIHNlY29uZD00NCBhbW91bnQ9LTJcclxua2VybmluZyBmaXJzdD0yMTAgc2Vjb25kPTQ0IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9MTkzIHNlY29uZD0yNTUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTExNCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMTEgc2Vjb25kPTg5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzMiBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjQzIGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTE5NSBzZWNvbmQ9ODcgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTEwMCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjQ2IGFtb3VudD0tMlxyXG5rZXJuaW5nIGZpcnN0PTIxMSBzZWNvbmQ9MTk4IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTIyMSBzZWNvbmQ9NDIgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTM5IGFtb3VudD0tM1xyXG5rZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xNzMgYW1vdW50PS00XHJcbmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0yMjUgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9MjIxIHNlY29uZD0yMzQgYW1vdW50PS0xXHJcbmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTk5IGFtb3VudD0tMVxyXG5rZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9MzQgYW1vdW50PS0yXHJcbmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI1MCBhbW91bnQ9LTFcclxua2VybmluZyBmaXJzdD0yMjUgc2Vjb25kPTM0IGFtb3VudD0tMVxyXG5gO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblByZXNzZWQnLCBoYW5kbGVPblByZXNzICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25SZWxlYXNlZCcsIGhhbmRsZU9uUmVsZWFzZSApO1xyXG5cclxuICBjb25zdCB0ZW1wTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgbGV0IG9sZFBhcmVudDtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlT25QcmVzcyggcCApe1xyXG5cclxuICAgIGNvbnN0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0ZW1wTWF0cml4LmdldEludmVyc2UoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgZm9sZGVyLm1hdHJpeC5wcmVtdWx0aXBseSggdGVtcE1hdHJpeCApO1xyXG4gICAgZm9sZGVyLm1hdHJpeC5kZWNvbXBvc2UoIGZvbGRlci5wb3NpdGlvbiwgZm9sZGVyLnF1YXRlcm5pb24sIGZvbGRlci5zY2FsZSApO1xyXG5cclxuICAgIG9sZFBhcmVudCA9IGZvbGRlci5wYXJlbnQ7XHJcbiAgICBpbnB1dE9iamVjdC5hZGQoIGZvbGRlciApO1xyXG5cclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IHRydWU7XHJcblxyXG4gICAgaW5wdXQuZXZlbnRzLmVtaXQoICdncmFiYmVkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uUmVsZWFzZSggeyBpbnB1dE9iamVjdCwgaW5wdXQgfT17fSApe1xyXG4gICAgY29uc3QgZm9sZGVyID0gZ3JvdXAuZm9sZGVyO1xyXG4gICAgaWYoIGZvbGRlciA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggb2xkUGFyZW50ID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBmb2xkZXIuYmVpbmdNb3ZlZCA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvbGRlci5tYXRyaXgucHJlbXVsdGlwbHkoIGlucHV0T2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICBmb2xkZXIubWF0cml4LmRlY29tcG9zZSggZm9sZGVyLnBvc2l0aW9uLCBmb2xkZXIucXVhdGVybmlvbiwgZm9sZGVyLnNjYWxlICk7XHJcbiAgICBvbGRQYXJlbnQuYWRkKCBmb2xkZXIgKTtcclxuICAgIG9sZFBhcmVudCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAnZ3JhYlJlbGVhc2VkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpbnRlcmFjdGlvbjtcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgRW1pdHRlciBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgY3JlYXRlU2xpZGVyIGZyb20gJy4vc2xpZGVyJztcclxuaW1wb3J0IGNyZWF0ZUNoZWNrYm94IGZyb20gJy4vY2hlY2tib3gnO1xyXG5pbXBvcnQgY3JlYXRlQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcclxuaW1wb3J0IGNyZWF0ZUZvbGRlciBmcm9tICcuL2ZvbGRlcic7XHJcbmltcG9ydCBjcmVhdGVEcm9wZG93biBmcm9tICcuL2Ryb3Bkb3duJztcclxuaW1wb3J0ICogYXMgU0RGVGV4dCBmcm9tICcuL3NkZnRleHQnO1xyXG5pbXBvcnQgKiBhcyBGb250IGZyb20gJy4vZm9udCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEQVRHVUlWUigpe1xyXG5cclxuICAvKlxyXG4gICAgU0RGIGZvbnRcclxuICAqL1xyXG4gIGNvbnN0IHRleHRDcmVhdG9yID0gU0RGVGV4dC5jcmVhdG9yKCk7XHJcblxyXG5cclxuICAvKlxyXG4gICAgTGlzdHMuXHJcbiAgICBJbnB1dE9iamVjdHMgYXJlIHRoaW5ncyBsaWtlIFZJVkUgY29udHJvbGxlcnMsIGNhcmRib2FyZCBoZWFkc2V0cywgZXRjLlxyXG4gICAgQ29udHJvbGxlcnMgYXJlIHRoZSBEQVQgR1VJIHNsaWRlcnMsIGNoZWNrYm94ZXMsIGV0Yy5cclxuICAgIEhpdHNjYW5PYmplY3RzIGFyZSBhbnl0aGluZyByYXljYXN0cyB3aWxsIGhpdC10ZXN0IGFnYWluc3QuXHJcbiAgKi9cclxuICBjb25zdCBpbnB1dE9iamVjdHMgPSBbXTtcclxuICBjb25zdCBjb250cm9sbGVycyA9IFtdO1xyXG4gIGNvbnN0IGhpdHNjYW5PYmplY3RzID0gW107XHJcblxyXG4gIGxldCBtb3VzZUVuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgZnVuY3Rpb24gc2V0TW91c2VFbmFibGVkKCBmbGFnICl7XHJcbiAgICBtb3VzZUVuYWJsZWQgPSBmbGFnO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIFRoZSBkZWZhdWx0IGxhc2VyIHBvaW50ZXIgY29taW5nIG91dCBvZiBlYWNoIElucHV0T2JqZWN0LlxyXG4gICovXHJcbiAgY29uc3QgbGFzZXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7Y29sb3I6MHg1NWFhZmYsIHRyYW5zcGFyZW50OiB0cnVlLCBibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyB9KTtcclxuICBmdW5jdGlvbiBjcmVhdGVMYXNlcigpe1xyXG4gICAgY29uc3QgZyA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xyXG4gICAgZy52ZXJ0aWNlcy5wdXNoKCBuZXcgVEhSRUUuVmVjdG9yMygpICk7XHJcbiAgICBnLnZlcnRpY2VzLnB1c2goIG5ldyBUSFJFRS5WZWN0b3IzKDAsMCwwKSApO1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5MaW5lKCBnLCBsYXNlck1hdGVyaWFsICk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIEEgXCJjdXJzb3JcIiwgZWcgdGhlIGJhbGwgdGhhdCBhcHBlYXJzIGF0IHRoZSBlbmQgb2YgeW91ciBsYXNlci5cclxuICAqL1xyXG4gIGNvbnN0IGN1cnNvck1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjoweDQ0NDQ0NCwgdHJhbnNwYXJlbnQ6IHRydWUsIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nIH0gKTtcclxuICBmdW5jdGlvbiBjcmVhdGVDdXJzb3IoKXtcclxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaCggbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMDA2LCA0LCA0ICksIGN1cnNvck1hdGVyaWFsICk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGdlbmVyaWMgSW5wdXQgdHlwZS5cclxuICAgIFRha2VzIGFueSBUSFJFRS5PYmplY3QzRCB0eXBlIG9iamVjdCBhbmQgdXNlcyBpdHMgcG9zaXRpb25cclxuICAgIGFuZCBvcmllbnRhdGlvbiBhcyBhbiBpbnB1dCBkZXZpY2UuXHJcblxyXG4gICAgQSBsYXNlciBwb2ludGVyIGlzIGluY2x1ZGVkIGFuZCB3aWxsIGJlIHVwZGF0ZWQuXHJcbiAgICBDb250YWlucyBzdGF0ZSBhYm91dCB3aGljaCBJbnRlcmFjdGlvbiBpcyBjdXJyZW50bHkgYmVpbmcgdXNlZCBvciBob3Zlci5cclxuICAqL1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZUlucHV0KCBpbnB1dE9iamVjdCA9IG5ldyBUSFJFRS5Hcm91cCgpICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByYXljYXN0OiBuZXcgVEhSRUUuUmF5Y2FzdGVyKCBuZXcgVEhSRUUuVmVjdG9yMygpLCBuZXcgVEhSRUUuVmVjdG9yMygpICksXHJcbiAgICAgIGxhc2VyOiBjcmVhdGVMYXNlcigpLFxyXG4gICAgICBjdXJzb3I6IGNyZWF0ZUN1cnNvcigpLFxyXG4gICAgICBvYmplY3Q6IGlucHV0T2JqZWN0LFxyXG4gICAgICBwcmVzc2VkOiBmYWxzZSxcclxuICAgICAgZ3JpcHBlZDogZmFsc2UsXHJcbiAgICAgIGV2ZW50czogbmV3IEVtaXR0ZXIoKSxcclxuICAgICAgaW50ZXJhY3Rpb246IHtcclxuICAgICAgICBncmlwOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcHJlc3M6IHVuZGVmaW5lZCxcclxuICAgICAgICBob3ZlcjogdW5kZWZpbmVkXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgLypcclxuICAgIE1vdXNlSW5wdXQgaXMgYSBzcGVjaWFsIGlucHV0IHR5cGUgdGhhdCBpcyBvbiBieSBkZWZhdWx0LlxyXG4gICAgQWxsb3dzIHlvdSB0byBjbGljayBvbiB0aGUgc2NyZWVuIHdoZW4gbm90IGluIFZSIGZvciBkZWJ1Z2dpbmcuXHJcbiAgKi9cclxuICBjb25zdCBtb3VzZUlucHV0ID0gY3JlYXRlTW91c2VJbnB1dCgpO1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVNb3VzZUlucHV0KCl7XHJcbiAgICBjb25zdCBtb3VzZSA9IG5ldyBUSFJFRS5WZWN0b3IyKC0xLC0xKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBtb3VzZS54ID0gKCBldmVudC5jbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGggKSAqIDIgLSAxO1xyXG4gICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xyXG4gICAgfSwgZmFsc2UgKTtcclxuXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlZG93bicsIGZ1bmN0aW9uKCBldmVudCApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gdHJ1ZTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgZnVuY3Rpb24oIGV2ZW50ICl7XHJcbiAgICAgIGlucHV0LnByZXNzZWQgPSBmYWxzZTtcclxuICAgIH0sIGZhbHNlICk7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSBjcmVhdGVJbnB1dCgpO1xyXG4gICAgaW5wdXQubW91c2UgPSBtb3VzZTtcclxuICAgIHJldHVybiBpbnB1dDtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIGZ1bmN0aW9uIHVzZXJzIHJ1biB0byBnaXZlIERBVCBHVUkgYW4gaW5wdXQgZGV2aWNlLlxyXG4gICAgQXV0b21hdGljYWxseSBkZXRlY3RzIGZvciBWaXZlQ29udHJvbGxlciBhbmQgYmluZHMgYnV0dG9ucyArIGhhcHRpYyBmZWVkYmFjay5cclxuXHJcbiAgICBSZXR1cm5zIGEgbGFzZXIgcG9pbnRlciBzbyBpdCBjYW4gYmUgZGlyZWN0bHkgYWRkZWQgdG8gc2NlbmUuXHJcblxyXG4gICAgVGhlIGxhc2VyIHdpbGwgdGhlbiBoYXZlIHR3byBtZXRob2RzOlxyXG4gICAgbGFzZXIucHJlc3NlZCgpLCBsYXNlci5ncmlwcGVkKClcclxuXHJcbiAgICBUaGVzZSBjYW4gdGhlbiBiZSBib3VuZCB0byBhbnkgYnV0dG9uIHRoZSB1c2VyIHdhbnRzLiBVc2VmdWwgZm9yIGJpbmRpbmcgdG9cclxuICAgIGNhcmRib2FyZCBvciBhbHRlcm5hdGUgaW5wdXQgZGV2aWNlcy5cclxuXHJcbiAgICBGb3IgZXhhbXBsZS4uLlxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgZnVuY3Rpb24oKXsgbGFzZXIucHJlc3NlZCggdHJ1ZSApOyB9ICk7XHJcbiAgKi9cclxuICBmdW5jdGlvbiBhZGRJbnB1dE9iamVjdCggb2JqZWN0ICl7XHJcbiAgICBjb25zdCBpbnB1dCA9IGNyZWF0ZUlucHV0KCBvYmplY3QgKTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5hZGQoIGlucHV0LmN1cnNvciApO1xyXG5cclxuICAgIGlucHV0Lmxhc2VyLnByZXNzZWQgPSBmdW5jdGlvbiggZmxhZyApe1xyXG4gICAgICBpbnB1dC5wcmVzc2VkID0gZmxhZztcclxuICAgIH07XHJcblxyXG4gICAgaW5wdXQubGFzZXIuZ3JpcHBlZCA9IGZ1bmN0aW9uKCBmbGFnICl7XHJcbiAgICAgIGlucHV0LmdyaXBwZWQgPSBmbGFnO1xyXG4gICAgfTtcclxuXHJcbiAgICBpbnB1dC5sYXNlci5jdXJzb3IgPSBpbnB1dC5jdXJzb3I7XHJcblxyXG4gICAgaWYoIFRIUkVFLlZpdmVDb250cm9sbGVyICYmIG9iamVjdCBpbnN0YW5jZW9mIFRIUkVFLlZpdmVDb250cm9sbGVyICl7XHJcbiAgICAgIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIG9iamVjdCwgaW5wdXQubGFzZXIucHJlc3NlZCwgaW5wdXQubGFzZXIuZ3JpcHBlZCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0T2JqZWN0cy5wdXNoKCBpbnB1dCApO1xyXG5cclxuICAgIHJldHVybiBpbnB1dC5sYXNlcjtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBIZXJlIGFyZSB0aGUgbWFpbiBkYXQgZ3VpIGNvbnRyb2xsZXIgdHlwZXMuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgbWluID0gMC4wLCBtYXggPSAxMDAuMCApe1xyXG4gICAgY29uc3Qgc2xpZGVyID0gY3JlYXRlU2xpZGVyKCB7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCwgbWluLCBtYXgsXHJcbiAgICAgIGluaXRpYWxWYWx1ZTogb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggc2xpZGVyICk7XHJcbiAgICBoaXRzY2FuT2JqZWN0cy5wdXNoKCAuLi5zbGlkZXIuaGl0c2NhbiApXHJcblxyXG4gICAgcmV0dXJuIHNsaWRlcjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGFkZENoZWNrYm94KCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgY2hlY2tib3ggPSBjcmVhdGVDaGVja2JveCh7XHJcbiAgICAgIHRleHRDcmVhdG9yLCBwcm9wZXJ0eU5hbWUsIG9iamVjdCxcclxuICAgICAgaW5pdGlhbFZhbHVlOiBvYmplY3RbIHByb3BlcnR5TmFtZSBdXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBjaGVja2JveCApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uY2hlY2tib3guaGl0c2NhbiApXHJcblxyXG4gICAgcmV0dXJuIGNoZWNrYm94O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkQnV0dG9uKCBvYmplY3QsIHByb3BlcnR5TmFtZSApe1xyXG4gICAgY29uc3QgYnV0dG9uID0gY3JlYXRlQnV0dG9uKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBidXR0b24gKTtcclxuICAgIGhpdHNjYW5PYmplY3RzLnB1c2goIC4uLmJ1dHRvbi5oaXRzY2FuICk7XHJcbiAgICByZXR1cm4gYnV0dG9uO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvcHRpb25zICl7XHJcbiAgICBjb25zdCBkcm9wZG93biA9IGNyZWF0ZURyb3Bkb3duKHtcclxuICAgICAgdGV4dENyZWF0b3IsIHByb3BlcnR5TmFtZSwgb2JqZWN0LCBvcHRpb25zXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250cm9sbGVycy5wdXNoKCBkcm9wZG93biApO1xyXG4gICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZHJvcGRvd24uaGl0c2NhbiApO1xyXG4gICAgcmV0dXJuIGRyb3Bkb3duO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBBbiBpbXBsaWNpdCBBZGQgZnVuY3Rpb24gd2hpY2ggZGV0ZWN0cyBmb3IgcHJvcGVydHkgdHlwZVxyXG4gICAgYW5kIGdpdmVzIHlvdSB0aGUgY29ycmVjdCBjb250cm9sbGVyLlxyXG5cclxuICAgIERyb3Bkb3duOlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBvYmplY3RUeXBlIClcclxuXHJcbiAgICBTbGlkZXI6XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mTnVtYmVyVHlwZSwgbWluLCBtYXggKVxyXG5cclxuICAgIENoZWNrYm94OlxyXG4gICAgICBhZGQoIG9iamVjdCwgcHJvcGVydHlPZkJvb2xlYW5UeXBlIClcclxuXHJcbiAgICBCdXR0b246XHJcbiAgICAgIGFkZCggb2JqZWN0LCBwcm9wZXJ0eU9mRnVuY3Rpb25UeXBlIClcclxuICAqL1xyXG5cclxuICBmdW5jdGlvbiBhZGQoIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczLCBhcmc0ICl7XHJcblxyXG4gICAgaWYoIG9iamVjdCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIGNvbnNvbGUud2FybiggJ29iamVjdCBpcyB1bmRlZmluZWQnICk7XHJcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBvYmplY3RbIHByb3BlcnR5TmFtZSBdID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgY29uc29sZS53YXJuKCAnbm8gcHJvcGVydHkgbmFtZWQnLCBwcm9wZXJ0eU5hbWUsICdvbiBvYmplY3QnLCBvYmplY3QgKTtcclxuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc09iamVjdCggYXJnMyApIHx8IGlzQXJyYXkoIGFyZzMgKSApe1xyXG4gICAgICByZXR1cm4gYWRkRHJvcGRvd24oIG9iamVjdCwgcHJvcGVydHlOYW1lLCBhcmczICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGlzTnVtYmVyKCBvYmplY3RbIHByb3BlcnR5TmFtZV0gKSApe1xyXG4gICAgICByZXR1cm4gYWRkU2xpZGVyKCBvYmplY3QsIHByb3BlcnR5TmFtZSwgYXJnMywgYXJnNCApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBpc0Jvb2xlYW4oIG9iamVjdFsgcHJvcGVydHlOYW1lXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRDaGVja2JveCggb2JqZWN0LCBwcm9wZXJ0eU5hbWUgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiggaXNGdW5jdGlvbiggb2JqZWN0WyBwcm9wZXJ0eU5hbWUgXSApICl7XHJcbiAgICAgIHJldHVybiBhZGRCdXR0b24oIG9iamVjdCwgcHJvcGVydHlOYW1lICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGFkZCBjb3VsZG4ndCBmaWd1cmUgaXQgb3V0LCBzbyBhdCBsZWFzdCBhZGQgc29tZXRoaW5nIFRIUkVFIHVuZGVyc3RhbmRzXHJcbiAgICByZXR1cm4gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgQ3JlYXRlcyBhIGZvbGRlciB3aXRoIHRoZSBuYW1lLlxyXG5cclxuICAgIEZvbGRlcnMgYXJlIFRIUkVFLkdyb3VwIHR5cGUgb2JqZWN0cyBhbmQgY2FuIGRvIGdyb3VwLmFkZCgpIGZvciBzaWJsaW5ncy5cclxuICAgIEZvbGRlcnMgd2lsbCBhdXRvbWF0aWNhbGx5IGF0dGVtcHQgdG8gbGF5IGl0cyBjaGlsZHJlbiBvdXQgaW4gc2VxdWVuY2UuXHJcbiAgKi9cclxuXHJcbiAgZnVuY3Rpb24gYWRkRm9sZGVyKCBuYW1lICl7XHJcbiAgICBjb25zdCBmb2xkZXIgPSBjcmVhdGVGb2xkZXIoe1xyXG4gICAgICB0ZXh0Q3JlYXRvcixcclxuICAgICAgbmFtZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udHJvbGxlcnMucHVzaCggZm9sZGVyICk7XHJcbiAgICBpZiggZm9sZGVyLmhpdHNjYW4gKXtcclxuICAgICAgaGl0c2Nhbk9iamVjdHMucHVzaCggLi4uZm9sZGVyLmhpdHNjYW4gKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9sZGVyO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8qXHJcbiAgICBQZXJmb3JtIHRoZSBuZWNlc3NhcnkgdXBkYXRlcywgcmF5Y2FzdHMgb24gaXRzIG93biBSQUYuXHJcbiAgKi9cclxuXHJcbiAgY29uc3QgdFBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBjb25zdCB0RGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoIDAsIDAsIC0xICk7XHJcbiAgY29uc3QgdE1hdHJpeCA9IG5ldyBUSFJFRS5NYXRyaXg0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSggdXBkYXRlICk7XHJcblxyXG4gICAgaWYoIG1vdXNlRW5hYmxlZCApe1xyXG4gICAgICBtb3VzZUlucHV0LmludGVyc2VjdGlvbnMgPSBwZXJmb3JtTW91c2VJbnB1dCggaGl0c2Nhbk9iamVjdHMsIG1vdXNlSW5wdXQgKTtcclxuICAgIH1cclxuXHJcbiAgICBpbnB1dE9iamVjdHMuZm9yRWFjaCggZnVuY3Rpb24oIHtib3gsb2JqZWN0LHJheWNhc3QsbGFzZXIsY3Vyc29yfSA9IHt9LCBpbmRleCApe1xyXG4gICAgICBvYmplY3QudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICAgIHRQb3NpdGlvbi5zZXQoMCwwLDApLnNldEZyb21NYXRyaXhQb3NpdGlvbiggb2JqZWN0Lm1hdHJpeFdvcmxkICk7XHJcbiAgICAgIHRNYXRyaXguaWRlbnRpdHkoKS5leHRyYWN0Um90YXRpb24oIG9iamVjdC5tYXRyaXhXb3JsZCApO1xyXG4gICAgICB0RGlyZWN0aW9uLnNldCgwLDAsLTEpLmFwcGx5TWF0cml4NCggdE1hdHJpeCApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICAgICAgcmF5Y2FzdC5zZXQoIHRQb3NpdGlvbiwgdERpcmVjdGlvbiApO1xyXG5cclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNbIDAgXS5jb3B5KCB0UG9zaXRpb24gKTtcclxuXHJcbiAgICAgIC8vICBkZWJ1Zy4uLlxyXG4gICAgICAvLyBsYXNlci5nZW9tZXRyeS52ZXJ0aWNlc1sgMSBdLmNvcHkoIHRQb3NpdGlvbiApLmFkZCggdERpcmVjdGlvbi5tdWx0aXBseVNjYWxhciggMSApICk7XHJcblxyXG4gICAgICBjb25zdCBpbnRlcnNlY3Rpb25zID0gcmF5Y2FzdC5pbnRlcnNlY3RPYmplY3RzKCBoaXRzY2FuT2JqZWN0cywgZmFsc2UgKTtcclxuICAgICAgcGFyc2VJbnRlcnNlY3Rpb25zKCBpbnRlcnNlY3Rpb25zLCBsYXNlciwgY3Vyc29yICk7XHJcblxyXG4gICAgICBpbnB1dE9iamVjdHNbIGluZGV4IF0uaW50ZXJzZWN0aW9ucyA9IGludGVyc2VjdGlvbnM7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBpbnB1dHMgPSBpbnB1dE9iamVjdHMuc2xpY2UoKTtcclxuXHJcbiAgICBpZiggbW91c2VFbmFibGVkICl7XHJcbiAgICAgIGlucHV0cy5wdXNoKCBtb3VzZUlucHV0ICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29udHJvbGxlcnMuZm9yRWFjaCggZnVuY3Rpb24oIGNvbnRyb2xsZXIgKXtcclxuICAgICAgY29udHJvbGxlci51cGRhdGUoIGlucHV0cyApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKXtcclxuICAgIGlmKCBpbnRlcnNlY3Rpb25zLmxlbmd0aCA+IDAgKXtcclxuICAgICAgY29uc3QgZmlyc3RIaXQgPSBpbnRlcnNlY3Rpb25zWyAwIF07XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LnZlcnRpY2VzWyAxIF0uY29weSggZmlyc3RIaXQucG9pbnQgKTtcclxuICAgICAgbGFzZXIudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIGxhc2VyLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xyXG4gICAgICBsYXNlci5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdCb3goKTtcclxuICAgICAgbGFzZXIuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgY3Vyc29yLnBvc2l0aW9uLmNvcHkoIGZpcnN0SGl0LnBvaW50ICk7XHJcbiAgICAgIGN1cnNvci52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGxhc2VyLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgY3Vyc29yLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1Nb3VzZUlucHV0KCBoaXRzY2FuT2JqZWN0cywge2JveCxvYmplY3QscmF5Y2FzdCxsYXNlcixjdXJzb3IsbW91c2V9ID0ge30gKXtcclxuICAgIHJheWNhc3Quc2V0RnJvbUNhbWVyYSggbW91c2UsIGNhbWVyYSApO1xyXG4gICAgY29uc3QgaW50ZXJzZWN0aW9ucyA9IHJheWNhc3QuaW50ZXJzZWN0T2JqZWN0cyggaGl0c2Nhbk9iamVjdHMsIGZhbHNlICk7XHJcbiAgICBwYXJzZUludGVyc2VjdGlvbnMoIGludGVyc2VjdGlvbnMsIGxhc2VyLCBjdXJzb3IgKTtcclxuICAgIHJldHVybiBpbnRlcnNlY3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvKlxyXG4gICAgUHVibGljIG1ldGhvZHMuXHJcbiAgKi9cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGFkZElucHV0T2JqZWN0LFxyXG4gICAgYWRkLFxyXG4gICAgYWRkRm9sZGVyLFxyXG4gICAgc2V0TW91c2VFbmFibGVkXHJcbiAgfTtcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLypcclxuICBTZXQgdG8gZ2xvYmFsIHNjb3BlIGlmIGV4cG9ydGluZyBhcyBhIHN0YW5kYWxvbmUuXHJcbiovXHJcblxyXG5pZiggd2luZG93ICl7XHJcbiAgd2luZG93LkRBVEdVSVZSID0gREFUR1VJVlI7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbiAgQnVuY2ggb2Ygc3RhdGUtbGVzcyB1dGlsaXR5IGZ1bmN0aW9ucy5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGlzTnVtYmVyKG4pIHtcclxuICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0Jvb2xlYW4obil7XHJcbiAgcmV0dXJuIHR5cGVvZiBuID09PSAnYm9vbGVhbic7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oZnVuY3Rpb25Ub0NoZWNrKSB7XHJcbiAgY29uc3QgZ2V0VHlwZSA9IHt9O1xyXG4gIHJldHVybiBmdW5jdGlvblRvQ2hlY2sgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0aW9uVG9DaGVjaykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbi8vICBvbmx5IHt9IG9iamVjdHMgbm90IGFycmF5c1xyXG4vLyAgICAgICAgICAgICAgICAgICAgd2hpY2ggYXJlIHRlY2huaWNhbGx5IG9iamVjdHMgYnV0IHlvdSdyZSBqdXN0IGJlaW5nIHBlZGFudGljXHJcbmZ1bmN0aW9uIGlzT2JqZWN0IChpdGVtKSB7XHJcbiAgcmV0dXJuICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoaXRlbSkgJiYgaXRlbSAhPT0gbnVsbCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQXJyYXkoIG8gKXtcclxuICByZXR1cm4gQXJyYXkuaXNBcnJheSggbyApO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG4gIENvbnRyb2xsZXItc3BlY2lmaWMgc3VwcG9ydC5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGJpbmRWaXZlQ29udHJvbGxlciggaW5wdXQsIGNvbnRyb2xsZXIsIHByZXNzZWQsIGdyaXBwZWQgKXtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VyZG93bicsICgpPT5wcmVzc2VkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0cmlnZ2VydXAnLCAoKT0+cHJlc3NlZCggZmFsc2UgKSApO1xyXG4gIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lciggJ2dyaXBzZG93bicsICgpPT5ncmlwcGVkKCB0cnVlICkgKTtcclxuICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoICdncmlwc3VwJywgKCk9PmdyaXBwZWQoIGZhbHNlICkgKTtcclxuXHJcbiAgY29uc3QgZ2FtZXBhZCA9IGNvbnRyb2xsZXIuZ2V0R2FtZXBhZCgpO1xyXG4gIGZ1bmN0aW9uIHZpYnJhdGUoIHQsIGEgKXtcclxuICAgIGlmKCBnYW1lcGFkICYmIGdhbWVwYWQuaGFwdGljcy5sZW5ndGggPiAwICl7XHJcbiAgICAgIGdhbWVwYWQuaGFwdGljc1sgMCBdLnZpYnJhdGUoIHQsIGEgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NUYXAoKXtcclxuICAgIHNldEludGVydmFsVGltZXMoICh4LHQsYSk9PnZpYnJhdGUoMS1hLCAwLjUpLCAxMCwgMjAgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhcHRpY3NFY2hvKCl7XHJcbiAgICBzZXRJbnRlcnZhbFRpbWVzKCAoeCx0LGEpPT52aWJyYXRlKDQsIDEuMCAqICgxLWEpKSwgMTAwLCA0ICk7XHJcbiAgfVxyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdvbkNvbnRyb2xsZXJIZWxkJywgZnVuY3Rpb24oIGlucHV0ICl7XHJcbiAgICB2aWJyYXRlKCAwLjMsIDAuMyApO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5ldmVudHMub24oICdncmFiYmVkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NUYXAoKTtcclxuICB9KTtcclxuXHJcbiAgaW5wdXQuZXZlbnRzLm9uKCAnZ3JhYlJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3Bpbm5lZCcsIGZ1bmN0aW9uKCl7XHJcbiAgICBoYXB0aWNzVGFwKCk7XHJcbiAgfSk7XHJcblxyXG4gIGlucHV0LmV2ZW50cy5vbiggJ3BpblJlbGVhc2VkJywgZnVuY3Rpb24oKXtcclxuICAgIGhhcHRpY3NFY2hvKCk7XHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldEludGVydmFsVGltZXMoIGNiLCBkZWxheSwgdGltZXMgKXtcclxuICBsZXQgeCA9IDA7XHJcbiAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCl7XHJcbiAgICBjYiggeCwgdGltZXMsIHgvdGltZXMgKTtcclxuICAgIHgrKztcclxuICAgIGlmKCB4Pj10aW1lcyApe1xyXG4gICAgICBjbGVhckludGVydmFsKCBpZCApO1xyXG4gICAgfVxyXG4gIH0sIGRlbGF5ICk7XHJcbiAgcmV0dXJuIGlkO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuaW1wb3J0IEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZUludGVyYWN0aW9uKCBoaXRWb2x1bWUgKXtcclxuICBjb25zdCBldmVudHMgPSBuZXcgRW1pdHRlcigpO1xyXG5cclxuICBsZXQgYW55SG92ZXIgPSBmYWxzZTtcclxuICBsZXQgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuXHJcbiAgbGV0IGhvdmVyID0gZmFsc2U7XHJcbiAgbGV0IGFueUFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICBjb25zdCB0VmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICBjb25zdCBhdmFpbGFibGVJbnB1dHMgPSBbXTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlKCBpbnB1dE9iamVjdHMgKXtcclxuXHJcbiAgICBob3ZlciA9IGZhbHNlO1xyXG4gICAgYW55UHJlc3NpbmcgPSBmYWxzZTtcclxuICAgIGFueUFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0T2JqZWN0cy5mb3JFYWNoKCBmdW5jdGlvbiggaW5wdXQgKXtcclxuXHJcbiAgICAgIGlmKCBhdmFpbGFibGVJbnB1dHMuaW5kZXhPZiggaW5wdXQgKSA8IDAgKXtcclxuICAgICAgICBhdmFpbGFibGVJbnB1dHMucHVzaCggaW5wdXQgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgeyBoaXRPYmplY3QsIGhpdFBvaW50IH0gPSBleHRyYWN0SGl0KCBpbnB1dCApO1xyXG5cclxuICAgICAgaG92ZXIgPSBob3ZlciB8fCBoaXRWb2x1bWUgPT09IGhpdE9iamVjdDtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAncHJlc3NlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAncHJlc3MnLFxyXG4gICAgICAgIGRvd25OYW1lOiAnb25QcmVzc2VkJyxcclxuICAgICAgICBob2xkTmFtZTogJ3ByZXNzaW5nJyxcclxuICAgICAgICB1cE5hbWU6ICdvblJlbGVhc2VkJ1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaG92ZXIsXHJcbiAgICAgICAgaGl0T2JqZWN0LCBoaXRQb2ludCxcclxuICAgICAgICBidXR0b25OYW1lOiAnZ3JpcHBlZCcsXHJcbiAgICAgICAgaW50ZXJhY3Rpb25OYW1lOiAnZ3JpcCcsXHJcbiAgICAgICAgZG93bk5hbWU6ICdvbkdyaXBwZWQnLFxyXG4gICAgICAgIGhvbGROYW1lOiAnZ3JpcHBpbmcnLFxyXG4gICAgICAgIHVwTmFtZTogJ29uUmVsZWFzZUdyaXAnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGV4dHJhY3RIaXQoIGlucHV0ICl7XHJcbiAgICBpZiggaW5wdXQuaW50ZXJzZWN0aW9ucy5sZW5ndGggPD0gMCApe1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGhpdFBvaW50OiB0VmVjdG9yLnNldEZyb21NYXRyaXhQb3NpdGlvbiggaW5wdXQuY3Vyc29yLm1hdHJpeFdvcmxkICkuY2xvbmUoKSxcclxuICAgICAgICBoaXRPYmplY3Q6IHVuZGVmaW5lZCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaGl0UG9pbnQ6IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5wb2ludCxcclxuICAgICAgICBoaXRPYmplY3Q6IGlucHV0LmludGVyc2VjdGlvbnNbIDAgXS5vYmplY3RcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHBlcmZvcm1TdGF0ZUV2ZW50cyh7XHJcbiAgICBpbnB1dCwgaG92ZXIsXHJcbiAgICBoaXRPYmplY3QsIGhpdFBvaW50LFxyXG4gICAgYnV0dG9uTmFtZSwgaW50ZXJhY3Rpb25OYW1lLCBkb3duTmFtZSwgaG9sZE5hbWUsIHVwTmFtZVxyXG4gIH0gPSB7fSApe1xyXG5cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdID09PSB0cnVlICYmIGhpdE9iamVjdCA9PT0gdW5kZWZpbmVkICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyAgaG92ZXJpbmcgYW5kIGJ1dHRvbiBkb3duIGJ1dCBubyBpbnRlcmFjdGlvbnMgYWN0aXZlIHlldFxyXG4gICAgaWYoIGhvdmVyICYmIGlucHV0WyBidXR0b25OYW1lIF0gPT09IHRydWUgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSB1bmRlZmluZWQgKXtcclxuXHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0LFxyXG4gICAgICAgIGxvY2tlZDogZmFsc2VcclxuICAgICAgfTtcclxuICAgICAgZXZlbnRzLmVtaXQoIGRvd25OYW1lLCBwYXlsb2FkICk7XHJcblxyXG4gICAgICBpZiggcGF5bG9hZC5sb2NrZWQgKXtcclxuICAgICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSBpbnRlcmFjdGlvbjtcclxuICAgICAgICBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9IGludGVyYWN0aW9uO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhbnlQcmVzc2luZyA9IHRydWU7XHJcbiAgICAgIGFueUFjdGl2ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGJ1dHRvbiBzdGlsbCBkb3duIGFuZCB0aGlzIGlzIHRoZSBhY3RpdmUgaW50ZXJhY3Rpb25cclxuICAgIGlmKCBpbnB1dFsgYnV0dG9uTmFtZSBdICYmIGlucHV0LmludGVyYWN0aW9uWyBpbnRlcmFjdGlvbk5hbWUgXSA9PT0gaW50ZXJhY3Rpb24gKXtcclxuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgICBpbnB1dCxcclxuICAgICAgICBoaXRPYmplY3QsXHJcbiAgICAgICAgcG9pbnQ6IGhpdFBvaW50LFxyXG4gICAgICAgIGlucHV0T2JqZWN0OiBpbnB1dC5vYmplY3QsXHJcbiAgICAgICAgbG9ja2VkOiBmYWxzZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZXZlbnRzLmVtaXQoIGhvbGROYW1lLCBwYXlsb2FkICk7XHJcblxyXG4gICAgICBhbnlQcmVzc2luZyA9IHRydWU7XHJcblxyXG4gICAgICBpbnB1dC5ldmVudHMuZW1pdCggJ29uQ29udHJvbGxlckhlbGQnICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIGJ1dHRvbiBub3QgZG93biBhbmQgdGhpcyBpcyB0aGUgYWN0aXZlIGludGVyYWN0aW9uXHJcbiAgICBpZiggaW5wdXRbIGJ1dHRvbk5hbWUgXSA9PT0gZmFsc2UgJiYgaW5wdXQuaW50ZXJhY3Rpb25bIGludGVyYWN0aW9uTmFtZSBdID09PSBpbnRlcmFjdGlvbiApe1xyXG4gICAgICBpbnB1dC5pbnRlcmFjdGlvblsgaW50ZXJhY3Rpb25OYW1lIF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIGlucHV0LmludGVyYWN0aW9uLmhvdmVyID0gdW5kZWZpbmVkO1xyXG4gICAgICBldmVudHMuZW1pdCggdXBOYW1lLCB7XHJcbiAgICAgICAgaW5wdXQsXHJcbiAgICAgICAgaGl0T2JqZWN0LFxyXG4gICAgICAgIHBvaW50OiBoaXRQb2ludCxcclxuICAgICAgICBpbnB1dE9iamVjdDogaW5wdXQub2JqZWN0XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzTWFpbkhvdmVyKCl7XHJcblxyXG4gICAgbGV0IG5vTWFpbkhvdmVyID0gdHJ1ZTtcclxuICAgIGZvciggbGV0IGk9MDsgaTxhdmFpbGFibGVJbnB1dHMubGVuZ3RoOyBpKysgKXtcclxuICAgICAgaWYoIGF2YWlsYWJsZUlucHV0c1sgaSBdLmludGVyYWN0aW9uLmhvdmVyICE9PSB1bmRlZmluZWQgKXtcclxuICAgICAgICBub01haW5Ib3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIG5vTWFpbkhvdmVyICl7XHJcbiAgICAgIHJldHVybiBob3ZlcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiggYXZhaWxhYmxlSW5wdXRzLmZpbHRlciggZnVuY3Rpb24oIGlucHV0ICl7XHJcbiAgICAgIHJldHVybiBpbnB1dC5pbnRlcmFjdGlvbi5ob3ZlciA9PT0gaW50ZXJhY3Rpb247XHJcbiAgICB9KS5sZW5ndGggPiAwICl7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcclxuICAgIGhvdmVyaW5nOiBpc01haW5Ib3ZlcixcclxuICAgIHByZXNzaW5nOiAoKT0+YW55UHJlc3NpbmcsXHJcbiAgICB1cGRhdGUsXHJcbiAgICBldmVudHNcclxuICB9O1xyXG5cclxuICByZXR1cm4gaW50ZXJhY3Rpb247XHJcbn0iLCIvKipcclxuKiBkYXQtZ3VpVlIgSmF2YXNjcmlwdCBDb250cm9sbGVyIExpYnJhcnkgZm9yIFZSXHJcbiogaHR0cHM6Ly9naXRodWIuY29tL2RhdGFhcnRzL2RhdC5ndWlWUlxyXG4qXHJcbiogQ29weXJpZ2h0IDIwMTYgRGF0YSBBcnRzIFRlYW0sIEdvb2dsZSBJbmMuXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuKlxyXG4qIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4qIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMgU2hhcmVkTWF0ZXJpYWxzIGZyb20gJy4vc2hhcmVkbWF0ZXJpYWxzJztcclxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gJy4vY29sb3JzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhbGlnbkxlZnQoIG9iaiApe1xyXG4gIGlmKCBvYmogaW5zdGFuY2VvZiBUSFJFRS5NZXNoICl7XHJcbiAgICBvYmouZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XHJcbiAgICBjb25zdCB3aWR0aCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueCAtIG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueTtcclxuICAgIG9iai5nZW9tZXRyeS50cmFuc2xhdGUoIHdpZHRoLCAwLCAwICk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG4gIH1cclxuICBlbHNlIGlmKCBvYmogaW5zdGFuY2VvZiBUSFJFRS5HZW9tZXRyeSApe1xyXG4gICAgb2JqLmNvbXB1dGVCb3VuZGluZ0JveCgpO1xyXG4gICAgY29uc3Qgd2lkdGggPSBvYmouYm91bmRpbmdCb3gubWF4LnggLSBvYmouYm91bmRpbmdCb3gubWF4Lnk7XHJcbiAgICBvYmoudHJhbnNsYXRlKCB3aWR0aCwgMCwgMCApO1xyXG4gICAgcmV0dXJuIG9iajtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQYW5lbCggd2lkdGgsIGhlaWdodCwgZGVwdGggKXtcclxuICBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIHdpZHRoLCBoZWlnaHQsIGRlcHRoICksIFNoYXJlZE1hdGVyaWFscy5QQU5FTCApO1xyXG4gIHBhbmVsLmdlb21ldHJ5LnRyYW5zbGF0ZSggd2lkdGggKiAwLjUsIDAsIDAgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIENvbG9ycy5ERUZBVUxUX0JBQ0sgKTtcclxuICByZXR1cm4gcGFuZWw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250cm9sbGVySURCb3goIGhlaWdodCwgY29sb3IgKXtcclxuICBjb25zdCBwYW5lbCA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIENPTlRST0xMRVJfSURfV0lEVEgsIGhlaWdodCwgQ09OVFJPTExFUl9JRF9ERVBUSCApLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBwYW5lbC5nZW9tZXRyeS50cmFuc2xhdGUoIENPTlRST0xMRVJfSURfV0lEVEggKiAwLjUsIDAsIDAgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggcGFuZWwuZ2VvbWV0cnksIGNvbG9yICk7XHJcbiAgcmV0dXJuIHBhbmVsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRG93bkFycm93KCl7XHJcbiAgY29uc3QgdyA9IDAuMDA5NjtcclxuICBjb25zdCBoID0gMC4wMTY7XHJcbiAgY29uc3Qgc2ggPSBuZXcgVEhSRUUuU2hhcGUoKTtcclxuICBzaC5tb3ZlVG8oMCwwKTtcclxuICBzaC5saW5lVG8oLXcsaCk7XHJcbiAgc2gubGluZVRvKHcsaCk7XHJcbiAgc2gubGluZVRvKDAsMCk7XHJcblxyXG4gIGNvbnN0IGdlbyA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KCBzaCApO1xyXG4gIGdlby50cmFuc2xhdGUoIDAsIC1oICogMC41LCAwICk7XHJcblxyXG4gIHJldHVybiBuZXcgVEhSRUUuTWVzaCggZ2VvLCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMX1dJRFRIID0gMS4wO1xyXG5leHBvcnQgY29uc3QgUEFORUxfSEVJR0hUID0gMC4wODtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0RFUFRIID0gMC4wMDE7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9TUEFDSU5HID0gMC4wMDI7XHJcbmV4cG9ydCBjb25zdCBQQU5FTF9NQVJHSU4gPSAwLjAxNTtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX0xBQkVMX1RFWFRfTUFSR0lOID0gMC4wNjtcclxuZXhwb3J0IGNvbnN0IFBBTkVMX1ZBTFVFX1RFWFRfTUFSR0lOID0gMC4wMjtcclxuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfSURfV0lEVEggPSAwLjAyO1xyXG5leHBvcnQgY29uc3QgQ09OVFJPTExFUl9JRF9ERVBUSCA9IDAuMDAxO1xyXG5leHBvcnQgY29uc3QgQlVUVE9OX0RFUFRIID0gMC4wMTtcclxuZXhwb3J0IGNvbnN0IEZPTERFUl9XSURUSCA9IDEuMDI2O1xyXG5leHBvcnQgY29uc3QgRk9MREVSX0hFSUdIVCA9IDAuMDg7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVJbnRlcmFjdGlvbiBmcm9tICcuL2ludGVyYWN0aW9uJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoIHsgZ3JvdXAsIHBhbmVsIH0gPSB7fSApe1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBwYW5lbCApO1xyXG5cclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvbkdyaXBwZWQnLCBoYW5kbGVPbkdyaXAgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VHcmlwJywgaGFuZGxlT25HcmlwUmVsZWFzZSApO1xyXG5cclxuICBsZXQgb2xkUGFyZW50O1xyXG4gIGxldCBvbGRQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgbGV0IG9sZFJvdGF0aW9uID0gbmV3IFRIUkVFLkV1bGVyKCk7XHJcblxyXG4gIGNvbnN0IHJvdGF0aW9uR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICByb3RhdGlvbkdyb3VwLnNjYWxlLnNldCggMC4zLCAwLjMsIDAuMyApO1xyXG4gIHJvdGF0aW9uR3JvdXAucG9zaXRpb24uc2V0KCAtMC4wMTUsIDAuMDE1LCAwLjAgKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcCggcCApe1xyXG5cclxuICAgIGNvbnN0IHsgaW5wdXRPYmplY3QsIGlucHV0IH0gPSBwO1xyXG5cclxuICAgIGNvbnN0IGZvbGRlciA9IGdyb3VwLmZvbGRlcjtcclxuICAgIGlmKCBmb2xkZXIgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSB0cnVlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvbGRQb3NpdGlvbi5jb3B5KCBmb2xkZXIucG9zaXRpb24gKTtcclxuICAgIG9sZFJvdGF0aW9uLmNvcHkoIGZvbGRlci5yb3RhdGlvbiApO1xyXG5cclxuICAgIGZvbGRlci5wb3NpdGlvbi5zZXQoIDAsMCwwICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uc2V0KCAwLDAsMCApO1xyXG4gICAgZm9sZGVyLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAqIDAuNTtcclxuXHJcbiAgICBvbGRQYXJlbnQgPSBmb2xkZXIucGFyZW50O1xyXG5cclxuICAgIHJvdGF0aW9uR3JvdXAuYWRkKCBmb2xkZXIgKTtcclxuXHJcbiAgICBpbnB1dE9iamVjdC5hZGQoIHJvdGF0aW9uR3JvdXAgKTtcclxuXHJcbiAgICBwLmxvY2tlZCA9IHRydWU7XHJcblxyXG4gICAgZm9sZGVyLmJlaW5nTW92ZWQgPSB0cnVlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGlubmVkJywgaW5wdXQgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZU9uR3JpcFJlbGVhc2UoIHsgaW5wdXRPYmplY3QsIGlucHV0IH09e30gKXtcclxuXHJcbiAgICBjb25zdCBmb2xkZXIgPSBncm91cC5mb2xkZXI7XHJcbiAgICBpZiggZm9sZGVyID09PSB1bmRlZmluZWQgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCBvbGRQYXJlbnQgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIGZvbGRlci5iZWluZ01vdmVkID09PSBmYWxzZSApe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgb2xkUGFyZW50LmFkZCggZm9sZGVyICk7XHJcbiAgICBvbGRQYXJlbnQgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgZm9sZGVyLnBvc2l0aW9uLmNvcHkoIG9sZFBvc2l0aW9uICk7XHJcbiAgICBmb2xkZXIucm90YXRpb24uY29weSggb2xkUm90YXRpb24gKTtcclxuXHJcbiAgICBmb2xkZXIuYmVpbmdNb3ZlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlucHV0LmV2ZW50cy5lbWl0KCAncGluUmVsZWFzZWQnLCBpbnB1dCApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGludGVyYWN0aW9uO1xyXG59IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBTREZTaGFkZXIgZnJvbSAndGhyZWUtYm1mb250LXRleHQvc2hhZGVycy9zZGYnO1xyXG5pbXBvcnQgY3JlYXRlR2VvbWV0cnkgZnJvbSAndGhyZWUtYm1mb250LXRleHQnO1xyXG5pbXBvcnQgcGFyc2VBU0NJSSBmcm9tICdwYXJzZS1ibWZvbnQtYXNjaWknO1xyXG5cclxuaW1wb3J0ICogYXMgRm9udCBmcm9tICcuL2ZvbnQnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hdGVyaWFsKCBjb2xvciApe1xyXG5cclxuICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcclxuICBjb25zdCBpbWFnZSA9IEZvbnQuaW1hZ2UoKTtcclxuICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcbiAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5MaW5lYXJNaXBNYXBMaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5tYWdGaWx0ZXIgPSBUSFJFRS5MaW5lYXJGaWx0ZXI7XHJcbiAgdGV4dHVyZS5nZW5lcmF0ZU1pcG1hcHMgPSB0cnVlO1xyXG5cclxuICAvLyAgYW5kIHdoYXQgYWJvdXQgYW5pc290cm9waWMgZmlsdGVyaW5nP1xyXG5cclxuICByZXR1cm4gbmV3IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsKFNERlNoYWRlcih7XHJcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxyXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICBjb2xvcjogY29sb3IsXHJcbiAgICBtYXA6IHRleHR1cmVcclxuICB9KSk7XHJcbn1cclxuXHJcbmNvbnN0IHRleHRTY2FsZSA9IDAuMDAxMjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdG9yKCl7XHJcblxyXG4gIGNvbnN0IGZvbnQgPSBwYXJzZUFTQ0lJKCBGb250LmZudCgpICk7XHJcblxyXG4gIGNvbnN0IGNvbG9yTWF0ZXJpYWxzID0ge307XHJcblxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVRleHQoIHN0ciwgZm9udCwgY29sb3IgPSAweGZmZmZmZiwgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgICBjb25zdCBnZW9tZXRyeSA9IGNyZWF0ZUdlb21ldHJ5KHtcclxuICAgICAgdGV4dDogc3RyLFxyXG4gICAgICBhbGlnbjogJ2xlZnQnLFxyXG4gICAgICB3aWR0aDogMTAwMCxcclxuICAgICAgZmxpcFk6IHRydWUsXHJcbiAgICAgIGZvbnRcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBjb25zdCBsYXlvdXQgPSBnZW9tZXRyeS5sYXlvdXQ7XHJcblxyXG4gICAgbGV0IG1hdGVyaWFsID0gY29sb3JNYXRlcmlhbHNbIGNvbG9yIF07XHJcbiAgICBpZiggbWF0ZXJpYWwgPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICBtYXRlcmlhbCA9IGNvbG9yTWF0ZXJpYWxzWyBjb2xvciBdID0gY3JlYXRlTWF0ZXJpYWwoIGNvbG9yICk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2goIGdlb21ldHJ5LCBtYXRlcmlhbCApO1xyXG4gICAgbWVzaC5zY2FsZS5tdWx0aXBseSggbmV3IFRIUkVFLlZlY3RvcjMoMSwtMSwxKSApO1xyXG5cclxuICAgIGNvbnN0IGZpbmFsU2NhbGUgPSBzY2FsZSAqIHRleHRTY2FsZTtcclxuXHJcbiAgICBtZXNoLnNjYWxlLm11bHRpcGx5U2NhbGFyKCBmaW5hbFNjYWxlICk7XHJcblxyXG4gICAgbWVzaC5wb3NpdGlvbi55ID0gbGF5b3V0LmhlaWdodCAqIDAuNSAqIGZpbmFsU2NhbGU7XHJcblxyXG4gICAgcmV0dXJuIG1lc2g7XHJcbiAgfVxyXG5cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlKCBzdHIsIHsgY29sb3I9MHhmZmZmZmYsIHNjYWxlPTEuMCB9ID0ge30gKXtcclxuICAgIGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcblxyXG4gICAgbGV0IG1lc2ggPSBjcmVhdGVUZXh0KCBzdHIsIGZvbnQsIGNvbG9yLCBzY2FsZSApO1xyXG4gICAgZ3JvdXAuYWRkKCBtZXNoICk7XHJcbiAgICBncm91cC5sYXlvdXQgPSBtZXNoLmdlb21ldHJ5LmxheW91dDtcclxuXHJcbiAgICBncm91cC51cGRhdGUgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICAgIG1lc2guZ2VvbWV0cnkudXBkYXRlKCBzdHIgKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGNyZWF0ZSxcclxuICAgIGdldE1hdGVyaWFsOiAoKT0+IG1hdGVyaWFsXHJcbiAgfVxyXG5cclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKiBcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKiBcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiogXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBBTkVMID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweGZmZmZmZiwgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMgfSApO1xyXG5leHBvcnQgY29uc3QgTE9DQVRPUiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG5leHBvcnQgY29uc3QgRk9MREVSID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKCB7IGNvbG9yOiAweDAwMDAwMCB9ICk7IiwiLyoqXHJcbiogZGF0LWd1aVZSIEphdmFzY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5IGZvciBWUlxyXG4qIGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRhYXJ0cy9kYXQuZ3VpVlJcclxuKlxyXG4qIENvcHlyaWdodCAyMDE2IERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgSW5jLlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKi9cclxuXHJcbmltcG9ydCBjcmVhdGVUZXh0TGFiZWwgZnJvbSAnLi90ZXh0bGFiZWwnO1xyXG5pbXBvcnQgY3JlYXRlSW50ZXJhY3Rpb24gZnJvbSAnLi9pbnRlcmFjdGlvbic7XHJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tICcuL2NvbG9ycyc7XHJcbmltcG9ydCAqIGFzIExheW91dCBmcm9tICcuL2xheW91dCc7XHJcbmltcG9ydCAqIGFzIFNoYXJlZE1hdGVyaWFscyBmcm9tICcuL3NoYXJlZG1hdGVyaWFscyc7XHJcbmltcG9ydCAqIGFzIEdyYWIgZnJvbSAnLi9ncmFiJztcclxuaW1wb3J0ICogYXMgUGFsZXR0ZSBmcm9tICcuL3BhbGV0dGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2xpZGVyKCB7XHJcbiAgdGV4dENyZWF0b3IsXHJcbiAgb2JqZWN0LFxyXG4gIHByb3BlcnR5TmFtZSA9ICd1bmRlZmluZWQnLFxyXG4gIGluaXRpYWxWYWx1ZSA9IDAuMCxcclxuICBtaW4gPSAwLjAsIG1heCA9IDEuMCxcclxuICBzdGVwID0gMC4xLFxyXG4gIHdpZHRoID0gTGF5b3V0LlBBTkVMX1dJRFRILFxyXG4gIGhlaWdodCA9IExheW91dC5QQU5FTF9IRUlHSFQsXHJcbiAgZGVwdGggPSBMYXlvdXQuUEFORUxfREVQVEhcclxufSA9IHt9ICl7XHJcblxyXG5cclxuICBjb25zdCBTTElERVJfV0lEVEggPSB3aWR0aCAqIDAuNSAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0hFSUdIVCA9IGhlaWdodCAtIExheW91dC5QQU5FTF9NQVJHSU47XHJcbiAgY29uc3QgU0xJREVSX0RFUFRIID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHN0YXRlID0ge1xyXG4gICAgYWxwaGE6IDEuMCxcclxuICAgIHZhbHVlOiBpbml0aWFsVmFsdWUsXHJcbiAgICBzdGVwOiBzdGVwLFxyXG4gICAgdXNlU3RlcDogZmFsc2UsXHJcbiAgICBwcmVjaXNpb246IDEsXHJcbiAgICBsaXN0ZW46IGZhbHNlLFxyXG4gICAgbWluOiBtaW4sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIG9uQ2hhbmdlZENCOiB1bmRlZmluZWQsXHJcbiAgICBvbkZpbmlzaGVkQ2hhbmdlOiB1bmRlZmluZWQsXHJcbiAgICBwcmVzc2luZzogZmFsc2VcclxuICB9O1xyXG5cclxuICBzdGF0ZS5zdGVwID0gZ2V0SW1wbGllZFN0ZXAoIHN0YXRlLnZhbHVlICk7XHJcbiAgc3RhdGUucHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoIHN0YXRlLnN0ZXAgKTtcclxuICBzdGF0ZS5hbHBoYSA9IGdldEFscGhhRnJvbVZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuXHJcbiAgLy8gIGZpbGxlZCB2b2x1bWVcclxuICBjb25zdCByZWN0ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCBTTElERVJfV0lEVEgsIFNMSURFUl9IRUlHSFQsIFNMSURFUl9ERVBUSCApO1xyXG4gIHJlY3QudHJhbnNsYXRlKFNMSURFUl9XSURUSCowLjUsMCwwKTtcclxuICAvLyBMYXlvdXQuYWxpZ25MZWZ0KCByZWN0ICk7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xyXG4gIGhpdHNjYW5NYXRlcmlhbC52aXNpYmxlID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0IGhpdHNjYW5Wb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBoaXRzY2FuTWF0ZXJpYWwgKTtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBoaXRzY2FuVm9sdW1lLnBvc2l0aW9uLnggPSB3aWR0aCAqIDAuNTtcclxuXHJcbiAgLy8gIHNsaWRlckJHIHZvbHVtZVxyXG4gIGNvbnN0IHNsaWRlckJHID0gbmV3IFRIUkVFLk1lc2goIHJlY3QuY2xvbmUoKSwgU2hhcmVkTWF0ZXJpYWxzLlBBTkVMICk7XHJcbiAgQ29sb3JzLmNvbG9yaXplR2VvbWV0cnkoIHNsaWRlckJHLmdlb21ldHJ5LCBDb2xvcnMuU0xJREVSX0JHICk7XHJcbiAgc2xpZGVyQkcucG9zaXRpb24ueiA9IGRlcHRoICogMC41O1xyXG4gIHNsaWRlckJHLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEggKyBMYXlvdXQuUEFORUxfTUFSR0lOO1xyXG5cclxuICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiBDb2xvcnMuREVGQVVMVF9DT0xPUiwgZW1pc3NpdmU6IENvbG9ycy5FTUlTU0lWRV9DT0xPUiB9KTtcclxuICBjb25zdCBmaWxsZWRWb2x1bWUgPSBuZXcgVEhSRUUuTWVzaCggcmVjdC5jbG9uZSgpLCBtYXRlcmlhbCApO1xyXG4gIGhpdHNjYW5Wb2x1bWUuYWRkKCBmaWxsZWRWb2x1bWUgKTtcclxuXHJcbiAgY29uc3QgZW5kTG9jYXRvciA9IG5ldyBUSFJFRS5NZXNoKCBuZXcgVEhSRUUuQm94R2VvbWV0cnkoIDAuMDUsIDAuMDUsIDAuMDUsIDEsIDEsIDEgKSwgU2hhcmVkTWF0ZXJpYWxzLkxPQ0FUT1IgKTtcclxuICBlbmRMb2NhdG9yLnBvc2l0aW9uLnggPSBTTElERVJfV0lEVEg7XHJcbiAgaGl0c2NhblZvbHVtZS5hZGQoIGVuZExvY2F0b3IgKTtcclxuICBlbmRMb2NhdG9yLnZpc2libGUgPSBmYWxzZTtcclxuXHJcbiAgY29uc3QgdmFsdWVMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggc3RhdGUudmFsdWUudG9TdHJpbmcoKSApO1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueCA9IExheW91dC5QQU5FTF9WQUxVRV9URVhUX01BUkdJTiArIHdpZHRoICogMC41O1xyXG4gIHZhbHVlTGFiZWwucG9zaXRpb24ueiA9IGRlcHRoKjI7XHJcbiAgdmFsdWVMYWJlbC5wb3NpdGlvbi55ID0gLTAuMDM7XHJcblxyXG4gIGNvbnN0IGRlc2NyaXB0b3JMYWJlbCA9IHRleHRDcmVhdG9yLmNyZWF0ZSggcHJvcGVydHlOYW1lICk7XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnggPSBMYXlvdXQuUEFORUxfTEFCRUxfVEVYVF9NQVJHSU47XHJcbiAgZGVzY3JpcHRvckxhYmVsLnBvc2l0aW9uLnogPSBkZXB0aDtcclxuICBkZXNjcmlwdG9yTGFiZWwucG9zaXRpb24ueSA9IC0wLjAzO1xyXG5cclxuICBjb25zdCBjb250cm9sbGVySUQgPSBMYXlvdXQuY3JlYXRlQ29udHJvbGxlcklEQm94KCBoZWlnaHQsIENvbG9ycy5DT05UUk9MTEVSX0lEX1NMSURFUiApO1xyXG4gIGNvbnRyb2xsZXJJRC5wb3NpdGlvbi56ID0gZGVwdGg7XHJcblxyXG4gIGNvbnN0IHBhbmVsID0gTGF5b3V0LmNyZWF0ZVBhbmVsKCB3aWR0aCwgaGVpZ2h0LCBkZXB0aCApO1xyXG4gIHBhbmVsLmFkZCggZGVzY3JpcHRvckxhYmVsLCBoaXRzY2FuVm9sdW1lLCBzbGlkZXJCRywgdmFsdWVMYWJlbCwgY29udHJvbGxlcklEICk7XHJcblxyXG4gIGdyb3VwLmFkZCggcGFuZWwgKVxyXG5cclxuICB1cGRhdGVWYWx1ZUxhYmVsKCBzdGF0ZS52YWx1ZSApO1xyXG4gIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlVmFsdWVMYWJlbCggdmFsdWUgKXtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCByb3VuZFRvRGVjaW1hbCggc3RhdGUudmFsdWUsIHN0YXRlLnByZWNpc2lvbiApLnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHZhbHVlTGFiZWwudXBkYXRlKCBzdGF0ZS52YWx1ZS50b1N0cmluZygpICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGVWaWV3KCl7XHJcbiAgICBpZiggc3RhdGUucHJlc3NpbmcgKXtcclxuICAgICAgbWF0ZXJpYWwuY29sb3Iuc2V0SGV4KCBDb2xvcnMuSU5URVJBQ1RJT05fQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIGlmKCBpbnRlcmFjdGlvbi5ob3ZlcmluZygpICl7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkhJR0hMSUdIVF9DT0xPUiApO1xyXG4gICAgICBtYXRlcmlhbC5lbWlzc2l2ZS5zZXRIZXgoIENvbG9ycy5ISUdITElHSFRfRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIG1hdGVyaWFsLmNvbG9yLnNldEhleCggQ29sb3JzLkRFRkFVTFRfQ09MT1IgKTtcclxuICAgICAgbWF0ZXJpYWwuZW1pc3NpdmUuc2V0SGV4KCBDb2xvcnMuRU1JU1NJVkVfQ09MT1IgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVNsaWRlciggYWxwaGEgKXtcclxuICAgIGFscGhhID0gZ2V0Q2xhbXBlZEFscGhhKCBhbHBoYSApO1xyXG4gICAgZmlsbGVkVm9sdW1lLnNjYWxlLnggPSBNYXRoLm1heCggYWxwaGEgKiB3aWR0aCwgMC4wMDAwMDEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZU9iamVjdCggdmFsdWUgKXtcclxuICAgIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gPSB2YWx1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBhbHBoYSApe1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRDbGFtcGVkQWxwaGEoIGFscGhhICk7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbUFscGhhKCBzdGF0ZS5hbHBoYSwgc3RhdGUubWluLCBzdGF0ZS5tYXggKTtcclxuICAgIGlmKCBzdGF0ZS51c2VTdGVwICl7XHJcbiAgICAgIHN0YXRlLnZhbHVlID0gZ2V0U3RlcHBlZFZhbHVlKCBzdGF0ZS52YWx1ZSwgc3RhdGUuc3RlcCApO1xyXG4gICAgfVxyXG4gICAgc3RhdGUudmFsdWUgPSBnZXRDbGFtcGVkVmFsdWUoIHN0YXRlLnZhbHVlLCBzdGF0ZS5taW4sIHN0YXRlLm1heCApO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlzdGVuVXBkYXRlKCl7XHJcbiAgICBzdGF0ZS52YWx1ZSA9IGdldFZhbHVlRnJvbU9iamVjdCgpO1xyXG4gICAgc3RhdGUuYWxwaGEgPSBnZXRBbHBoYUZyb21WYWx1ZSggc3RhdGUudmFsdWUsIHN0YXRlLm1pbiwgc3RhdGUubWF4ICk7XHJcbiAgICBzdGF0ZS5hbHBoYSA9IGdldENsYW1wZWRBbHBoYSggc3RhdGUuYWxwaGEgKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFZhbHVlRnJvbU9iamVjdCgpe1xyXG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoIG9iamVjdFsgcHJvcGVydHlOYW1lIF0gKTtcclxuICB9XHJcblxyXG4gIGdyb3VwLm9uQ2hhbmdlID0gZnVuY3Rpb24oIGNhbGxiYWNrICl7XHJcbiAgICBzdGF0ZS5vbkNoYW5nZWRDQiA9IGNhbGxiYWNrO1xyXG4gICAgcmV0dXJuIGdyb3VwO1xyXG4gIH07XHJcblxyXG4gIGdyb3VwLnN0ZXAgPSBmdW5jdGlvbiggc3RlcCApe1xyXG4gICAgc3RhdGUuc3RlcCA9IHN0ZXA7XHJcbiAgICBzdGF0ZS5wcmVjaXNpb24gPSBudW1EZWNpbWFscyggc3RhdGUuc3RlcCApXHJcbiAgICBzdGF0ZS51c2VTdGVwID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBncm91cC5saXN0ZW4gPSBmdW5jdGlvbigpe1xyXG4gICAgc3RhdGUubGlzdGVuID0gdHJ1ZTtcclxuICAgIHJldHVybiBncm91cDtcclxuICB9O1xyXG5cclxuICBjb25zdCBpbnRlcmFjdGlvbiA9IGNyZWF0ZUludGVyYWN0aW9uKCBoaXRzY2FuVm9sdW1lICk7XHJcbiAgaW50ZXJhY3Rpb24uZXZlbnRzLm9uKCAnb25QcmVzc2VkJywgaGFuZGxlUHJlc3MgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdwcmVzc2luZycsIGhhbmRsZUhvbGQgKTtcclxuICBpbnRlcmFjdGlvbi5ldmVudHMub24oICdvblJlbGVhc2VkJywgaGFuZGxlUmVsZWFzZSApO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVQcmVzcyggcCApe1xyXG4gICAgaWYoIGdyb3VwLnZpc2libGUgPT09IGZhbHNlICl7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuICAgIHAubG9ja2VkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUhvbGQoIHsgcG9pbnQgfSA9IHt9ICl7XHJcbiAgICBpZiggZ3JvdXAudmlzaWJsZSA9PT0gZmFsc2UgKXtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlLnByZXNzaW5nID0gdHJ1ZTtcclxuXHJcbiAgICBmaWxsZWRWb2x1bWUudXBkYXRlTWF0cml4V29ybGQoKTtcclxuICAgIGVuZExvY2F0b3IudXBkYXRlTWF0cml4V29ybGQoKTtcclxuXHJcbiAgICBjb25zdCBhID0gbmV3IFRIUkVFLlZlY3RvcjMoKS5zZXRGcm9tTWF0cml4UG9zaXRpb24oIGZpbGxlZFZvbHVtZS5tYXRyaXhXb3JsZCApO1xyXG4gICAgY29uc3QgYiA9IG5ldyBUSFJFRS5WZWN0b3IzKCkuc2V0RnJvbU1hdHJpeFBvc2l0aW9uKCBlbmRMb2NhdG9yLm1hdHJpeFdvcmxkICk7XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNWYWx1ZSA9IHN0YXRlLnZhbHVlO1xyXG5cclxuICAgIHVwZGF0ZVN0YXRlRnJvbUFscGhhKCBnZXRQb2ludEFscGhhKCBwb2ludCwge2EsYn0gKSApO1xyXG4gICAgdXBkYXRlVmFsdWVMYWJlbCggc3RhdGUudmFsdWUgKTtcclxuICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIHVwZGF0ZU9iamVjdCggc3RhdGUudmFsdWUgKTtcclxuXHJcbiAgICBpZiggcHJldmlvdXNWYWx1ZSAhPT0gc3RhdGUudmFsdWUgJiYgc3RhdGUub25DaGFuZ2VkQ0IgKXtcclxuICAgICAgc3RhdGUub25DaGFuZ2VkQ0IoIHN0YXRlLnZhbHVlICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSZWxlYXNlKCl7XHJcbiAgICBzdGF0ZS5wcmVzc2luZyA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ3JvdXAuaW50ZXJhY3Rpb24gPSBpbnRlcmFjdGlvbjtcclxuICBncm91cC5oaXRzY2FuID0gWyBoaXRzY2FuVm9sdW1lLCBwYW5lbCBdO1xyXG5cclxuICBjb25zdCBncmFiSW50ZXJhY3Rpb24gPSBHcmFiLmNyZWF0ZSggeyBncm91cCwgcGFuZWwgfSApO1xyXG4gIGNvbnN0IHBhbGV0dGVJbnRlcmFjdGlvbiA9IFBhbGV0dGUuY3JlYXRlKCB7IGdyb3VwLCBwYW5lbCB9ICk7XHJcblxyXG4gIGdyb3VwLnVwZGF0ZSA9IGZ1bmN0aW9uKCBpbnB1dE9iamVjdHMgKXtcclxuICAgIGludGVyYWN0aW9uLnVwZGF0ZSggaW5wdXRPYmplY3RzICk7XHJcbiAgICBncmFiSW50ZXJhY3Rpb24udXBkYXRlKCBpbnB1dE9iamVjdHMgKTtcclxuICAgIHBhbGV0dGVJbnRlcmFjdGlvbi51cGRhdGUoIGlucHV0T2JqZWN0cyApO1xyXG5cclxuICAgIGlmKCBzdGF0ZS5saXN0ZW4gKXtcclxuICAgICAgbGlzdGVuVXBkYXRlKCk7XHJcbiAgICAgIHVwZGF0ZVZhbHVlTGFiZWwoIHN0YXRlLnZhbHVlICk7XHJcbiAgICAgIHVwZGF0ZVNsaWRlciggc3RhdGUuYWxwaGEgKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZVZpZXcoKTtcclxuICB9O1xyXG5cclxuICBncm91cC5uYW1lID0gZnVuY3Rpb24oIHN0ciApe1xyXG4gICAgZGVzY3JpcHRvckxhYmVsLnVwZGF0ZSggc3RyICk7XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubWluID0gZnVuY3Rpb24oIG0gKXtcclxuICAgIHN0YXRlLm1pbiA9IG07XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgZ3JvdXAubWF4ID0gZnVuY3Rpb24oIG0gKXtcclxuICAgIHN0YXRlLm1heCA9IG07XHJcbiAgICByZXR1cm4gZ3JvdXA7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59XHJcblxyXG5jb25zdCB0YSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IHRiID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuY29uc3QgdFRvQSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbmNvbnN0IGFUb0IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xyXG5cclxuZnVuY3Rpb24gZ2V0UG9pbnRBbHBoYSggcG9pbnQsIHNlZ21lbnQgKXtcclxuICB0YS5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApO1xyXG4gIHRiLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgY29uc3QgcHJvamVjdGVkID0gdGIucHJvamVjdE9uVmVjdG9yKCB0YSApO1xyXG5cclxuICB0VG9BLmNvcHkoIHBvaW50ICkuc3ViKCBzZWdtZW50LmEgKTtcclxuXHJcbiAgYVRvQi5jb3B5KCBzZWdtZW50LmIgKS5zdWIoIHNlZ21lbnQuYSApLm5vcm1hbGl6ZSgpO1xyXG5cclxuICBjb25zdCBzaWRlID0gdFRvQS5ub3JtYWxpemUoKS5kb3QoIGFUb0IgKSA+PSAwID8gMSA6IC0xO1xyXG5cclxuICBjb25zdCBsZW5ndGggPSBzZWdtZW50LmEuZGlzdGFuY2VUbyggc2VnbWVudC5iICkgKiBzaWRlO1xyXG5cclxuICBsZXQgYWxwaGEgPSBwcm9qZWN0ZWQubGVuZ3RoKCkgLyBsZW5ndGg7XHJcbiAgaWYoIGFscGhhID4gMS4wICl7XHJcbiAgICBhbHBoYSA9IDEuMDtcclxuICB9XHJcbiAgaWYoIGFscGhhIDwgMC4wICl7XHJcbiAgICBhbHBoYSA9IDAuMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsZXJwKG1pbiwgbWF4LCB2YWx1ZSkge1xyXG4gIHJldHVybiAoMS12YWx1ZSkqbWluICsgdmFsdWUqbWF4O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXBfcmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xyXG4gICAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENsYW1wZWRBbHBoYSggYWxwaGEgKXtcclxuICBpZiggYWxwaGEgPiAxICl7XHJcbiAgICByZXR1cm4gMVxyXG4gIH1cclxuICBpZiggYWxwaGEgPCAwICl7XHJcbiAgICByZXR1cm4gMDtcclxuICB9XHJcbiAgcmV0dXJuIGFscGhhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDbGFtcGVkVmFsdWUoIHZhbHVlLCBtaW4sIG1heCApe1xyXG4gIGlmKCB2YWx1ZSA8IG1pbiApe1xyXG4gICAgcmV0dXJuIG1pbjtcclxuICB9XHJcbiAgaWYoIHZhbHVlID4gbWF4ICl7XHJcbiAgICByZXR1cm4gbWF4O1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEltcGxpZWRTdGVwKCB2YWx1ZSApe1xyXG4gIGlmKCB2YWx1ZSA9PT0gMCApe1xyXG4gICAgcmV0dXJuIDE7IC8vIFdoYXQgYXJlIHdlLCBwc3ljaGljcz9cclxuICB9IGVsc2Uge1xyXG4gICAgLy8gSGV5IERvdWcsIGNoZWNrIHRoaXMgb3V0LlxyXG4gICAgcmV0dXJuIE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkvTWF0aC5MTjEwKSkvMTA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BbHBoYSggYWxwaGEsIG1pbiwgbWF4ICl7XHJcbiAgcmV0dXJuIG1hcF9yYW5nZSggYWxwaGEsIDAuMCwgMS4wLCBtaW4sIG1heCApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhRnJvbVZhbHVlKCB2YWx1ZSwgbWluLCBtYXggKXtcclxuICByZXR1cm4gbWFwX3JhbmdlKCB2YWx1ZSwgbWluLCBtYXgsIDAuMCwgMS4wICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFN0ZXBwZWRWYWx1ZSggdmFsdWUsIHN0ZXAgKXtcclxuICBpZiggdmFsdWUgJSBzdGVwICE9IDApIHtcclxuICAgIHJldHVybiBNYXRoLnJvdW5kKCB2YWx1ZSAvIHN0ZXAgKSAqIHN0ZXA7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbnVtRGVjaW1hbHMoeCkge1xyXG4gIHggPSB4LnRvU3RyaW5nKCk7XHJcbiAgaWYgKHguaW5kZXhPZignLicpID4gLTEpIHtcclxuICAgIHJldHVybiB4Lmxlbmd0aCAtIHguaW5kZXhPZignLicpIC0gMTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIDA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcclxuICBjb25zdCB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XHJcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5UbztcclxufSIsIi8qKlxyXG4qIGRhdC1ndWlWUiBKYXZhc2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeSBmb3IgVlJcclxuKiBodHRwczovL2dpdGh1Yi5jb20vZGF0YWFydHMvZGF0Lmd1aVZSXHJcbipcclxuKiBDb3B5cmlnaHQgMjAxNiBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIEluYy5cclxuKlxyXG4qIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4qIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4qXHJcbiogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiovXHJcblxyXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSAnLi9jb2xvcnMnO1xyXG5pbXBvcnQgKiBhcyBTaGFyZWRNYXRlcmlhbHMgZnJvbSAnLi9zaGFyZWRtYXRlcmlhbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVGV4dExhYmVsKCB0ZXh0Q3JlYXRvciwgc3RyLCB3aWR0aCA9IDAuNCwgZGVwdGggPSAwLjAyOSwgZmdDb2xvciA9IDB4ZmZmZmZmLCBiZ0NvbG9yID0gQ29sb3JzLkRFRkFVTFRfQkFDSywgc2NhbGUgPSAxLjAgKXtcclxuXHJcbiAgY29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICBjb25zdCBpbnRlcm5hbFBvc2l0aW9uaW5nID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgZ3JvdXAuYWRkKCBpbnRlcm5hbFBvc2l0aW9uaW5nICk7XHJcblxyXG4gIGNvbnN0IHRleHQgPSB0ZXh0Q3JlYXRvci5jcmVhdGUoIHN0ciwgeyBjb2xvcjogZmdDb2xvciwgc2NhbGUgfSApO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCB0ZXh0ICk7XHJcblxyXG5cclxuICBncm91cC5zZXRTdHJpbmcgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvU3RyaW5nKCkgKTtcclxuICB9O1xyXG5cclxuICBncm91cC5zZXROdW1iZXIgPSBmdW5jdGlvbiggc3RyICl7XHJcbiAgICB0ZXh0LnVwZGF0ZSggc3RyLnRvRml4ZWQoMikgKTtcclxuICB9O1xyXG5cclxuICB0ZXh0LnBvc2l0aW9uLnogPSAwLjAxNVxyXG5cclxuICBjb25zdCBiYWNrQm91bmRzID0gMC4wMTtcclxuICBjb25zdCBtYXJnaW4gPSAwLjAxO1xyXG4gIGNvbnN0IHRvdGFsV2lkdGggPSB3aWR0aDtcclxuICBjb25zdCB0b3RhbEhlaWdodCA9IDAuMDQgKyBtYXJnaW4gKiAyO1xyXG4gIGNvbnN0IGxhYmVsQmFja0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KCB0b3RhbFdpZHRoLCB0b3RhbEhlaWdodCwgZGVwdGgsIDEsIDEsIDEgKTtcclxuICBsYWJlbEJhY2tHZW9tZXRyeS5hcHBseU1hdHJpeCggbmV3IFRIUkVFLk1hdHJpeDQoKS5tYWtlVHJhbnNsYXRpb24oIHRvdGFsV2lkdGggKiAwLjUgLSBtYXJnaW4sIDAsIDAgKSApO1xyXG5cclxuICBjb25zdCBsYWJlbEJhY2tNZXNoID0gbmV3IFRIUkVFLk1lc2goIGxhYmVsQmFja0dlb21ldHJ5LCBTaGFyZWRNYXRlcmlhbHMuUEFORUwgKTtcclxuICBDb2xvcnMuY29sb3JpemVHZW9tZXRyeSggbGFiZWxCYWNrTWVzaC5nZW9tZXRyeSwgYmdDb2xvciApO1xyXG5cclxuICBsYWJlbEJhY2tNZXNoLnBvc2l0aW9uLnkgPSAwLjAzO1xyXG4gIGludGVybmFsUG9zaXRpb25pbmcuYWRkKCBsYWJlbEJhY2tNZXNoICk7XHJcbiAgaW50ZXJuYWxQb3NpdGlvbmluZy5wb3NpdGlvbi55ID0gLXRvdGFsSGVpZ2h0ICogMC41O1xyXG5cclxuICBncm91cC5iYWNrID0gbGFiZWxCYWNrTWVzaDtcclxuXHJcbiAgcmV0dXJuIGdyb3VwO1xyXG59IiwiLypcbiAqXHRAYXV0aG9yIHp6ODUgLyBodHRwOi8vdHdpdHRlci5jb20vYmx1cnNwbGluZSAvIGh0dHA6Ly93d3cubGFiNGdhbWVzLm5ldC96ejg1L2Jsb2dcbiAqXHRAYXV0aG9yIGNlbnRlcmlvbndhcmUgLyBodHRwOi8vd3d3LmNlbnRlcmlvbndhcmUuY29tXG4gKlxuICpcdFN1YmRpdmlzaW9uIEdlb21ldHJ5IE1vZGlmaWVyXG4gKlx0XHR1c2luZyBMb29wIFN1YmRpdmlzaW9uIFNjaGVtZVxuICpcbiAqXHRSZWZlcmVuY2VzOlxuICpcdFx0aHR0cDovL2dyYXBoaWNzLnN0YW5mb3JkLmVkdS9+bWRmaXNoZXIvc3ViZGl2aXNpb24uaHRtbFxuICpcdFx0aHR0cDovL3d3dy5ob2xtZXMzZC5uZXQvZ3JhcGhpY3Mvc3ViZGl2aXNpb24vXG4gKlx0XHRodHRwOi8vd3d3LmNzLnJ1dGdlcnMuZWR1L35kZWNhcmxvL3JlYWRpbmdzL3N1YmRpdi1zZzAwYy5wZGZcbiAqXG4gKlx0S25vd24gSXNzdWVzOlxuICpcdFx0LSBjdXJyZW50bHkgZG9lc24ndCBoYW5kbGUgXCJTaGFycCBFZGdlc1wiXG4gKi9cblxuVEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllciA9IGZ1bmN0aW9uICggc3ViZGl2aXNpb25zICkge1xuXG5cdHRoaXMuc3ViZGl2aXNpb25zID0gKCBzdWJkaXZpc2lvbnMgPT09IHVuZGVmaW5lZCApID8gMSA6IHN1YmRpdmlzaW9ucztcblxufTtcblxuLy8gQXBwbGllcyB0aGUgXCJtb2RpZnlcIiBwYXR0ZXJuXG5USFJFRS5TdWJkaXZpc2lvbk1vZGlmaWVyLnByb3RvdHlwZS5tb2RpZnkgPSBmdW5jdGlvbiAoIGdlb21ldHJ5ICkge1xuXG5cdHZhciByZXBlYXRzID0gdGhpcy5zdWJkaXZpc2lvbnM7XG5cblx0d2hpbGUgKCByZXBlYXRzIC0tID4gMCApIHtcblxuXHRcdHRoaXMuc21vb3RoKCBnZW9tZXRyeSApO1xuXG5cdH1cblxuXHRnZW9tZXRyeS5jb21wdXRlRmFjZU5vcm1hbHMoKTtcblx0Z2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcblxufTtcblxuKCBmdW5jdGlvbigpIHtcblxuXHQvLyBTb21lIGNvbnN0YW50c1xuXHR2YXIgV0FSTklOR1MgPSAhIHRydWU7IC8vIFNldCB0byB0cnVlIGZvciBkZXZlbG9wbWVudFxuXHR2YXIgQUJDID0gWyAnYScsICdiJywgJ2MnIF07XG5cblxuXHRmdW5jdGlvbiBnZXRFZGdlKCBhLCBiLCBtYXAgKSB7XG5cblx0XHR2YXIgdmVydGV4SW5kZXhBID0gTWF0aC5taW4oIGEsIGIgKTtcblx0XHR2YXIgdmVydGV4SW5kZXhCID0gTWF0aC5tYXgoIGEsIGIgKTtcblxuXHRcdHZhciBrZXkgPSB2ZXJ0ZXhJbmRleEEgKyBcIl9cIiArIHZlcnRleEluZGV4QjtcblxuXHRcdHJldHVybiBtYXBbIGtleSBdO1xuXG5cdH1cblxuXG5cdGZ1bmN0aW9uIHByb2Nlc3NFZGdlKCBhLCBiLCB2ZXJ0aWNlcywgbWFwLCBmYWNlLCBtZXRhVmVydGljZXMgKSB7XG5cblx0XHR2YXIgdmVydGV4SW5kZXhBID0gTWF0aC5taW4oIGEsIGIgKTtcblx0XHR2YXIgdmVydGV4SW5kZXhCID0gTWF0aC5tYXgoIGEsIGIgKTtcblxuXHRcdHZhciBrZXkgPSB2ZXJ0ZXhJbmRleEEgKyBcIl9cIiArIHZlcnRleEluZGV4QjtcblxuXHRcdHZhciBlZGdlO1xuXG5cdFx0aWYgKCBrZXkgaW4gbWFwICkge1xuXG5cdFx0XHRlZGdlID0gbWFwWyBrZXkgXTtcblxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHZhciB2ZXJ0ZXhBID0gdmVydGljZXNbIHZlcnRleEluZGV4QSBdO1xuXHRcdFx0dmFyIHZlcnRleEIgPSB2ZXJ0aWNlc1sgdmVydGV4SW5kZXhCIF07XG5cblx0XHRcdGVkZ2UgPSB7XG5cblx0XHRcdFx0YTogdmVydGV4QSwgLy8gcG9pbnRlciByZWZlcmVuY2Vcblx0XHRcdFx0YjogdmVydGV4Qixcblx0XHRcdFx0bmV3RWRnZTogbnVsbCxcblx0XHRcdFx0Ly8gYUluZGV4OiBhLCAvLyBudW1iZXJlZCByZWZlcmVuY2Vcblx0XHRcdFx0Ly8gYkluZGV4OiBiLFxuXHRcdFx0XHRmYWNlczogW10gLy8gcG9pbnRlcnMgdG8gZmFjZVxuXG5cdFx0XHR9O1xuXG5cdFx0XHRtYXBbIGtleSBdID0gZWRnZTtcblxuXHRcdH1cblxuXHRcdGVkZ2UuZmFjZXMucHVzaCggZmFjZSApO1xuXG5cdFx0bWV0YVZlcnRpY2VzWyBhIF0uZWRnZXMucHVzaCggZWRnZSApO1xuXHRcdG1ldGFWZXJ0aWNlc1sgYiBdLmVkZ2VzLnB1c2goIGVkZ2UgKTtcblxuXG5cdH1cblxuXHRmdW5jdGlvbiBnZW5lcmF0ZUxvb2t1cHMoIHZlcnRpY2VzLCBmYWNlcywgbWV0YVZlcnRpY2VzLCBlZGdlcyApIHtcblxuXHRcdHZhciBpLCBpbCwgZmFjZSwgZWRnZTtcblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IHZlcnRpY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRtZXRhVmVydGljZXNbIGkgXSA9IHsgZWRnZXM6IFtdIH07XG5cblx0XHR9XG5cblx0XHRmb3IgKCBpID0gMCwgaWwgPSBmYWNlcy5sZW5ndGg7IGkgPCBpbDsgaSArKyApIHtcblxuXHRcdFx0ZmFjZSA9IGZhY2VzWyBpIF07XG5cblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmEsIGZhY2UuYiwgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmIsIGZhY2UuYywgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcblx0XHRcdHByb2Nlc3NFZGdlKCBmYWNlLmMsIGZhY2UuYSwgdmVydGljZXMsIGVkZ2VzLCBmYWNlLCBtZXRhVmVydGljZXMgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmV3RmFjZSggbmV3RmFjZXMsIGEsIGIsIGMgKSB7XG5cblx0XHRuZXdGYWNlcy5wdXNoKCBuZXcgVEhSRUUuRmFjZTMoIGEsIGIsIGMgKSApO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBtaWRwb2ludCggYSwgYiApIHtcblxuXHRcdHJldHVybiAoIE1hdGguYWJzKCBiIC0gYSApIC8gMiApICsgTWF0aC5taW4oIGEsIGIgKTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gbmV3VXYoIG5ld1V2cywgYSwgYiwgYyApIHtcblxuXHRcdG5ld1V2cy5wdXNoKCBbIGEuY2xvbmUoKSwgYi5jbG9uZSgpLCBjLmNsb25lKCkgXSApO1xuXG5cdH1cblxuXHQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cdC8vIFBlcmZvcm1zIG9uZSBpdGVyYXRpb24gb2YgU3ViZGl2aXNpb25cblx0VEhSRUUuU3ViZGl2aXNpb25Nb2RpZmllci5wcm90b3R5cGUuc21vb3RoID0gZnVuY3Rpb24gKCBnZW9tZXRyeSApIHtcblxuXHRcdHZhciB0bXAgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuXG5cdFx0dmFyIG9sZFZlcnRpY2VzLCBvbGRGYWNlcywgb2xkVXZzO1xuXHRcdHZhciBuZXdWZXJ0aWNlcywgbmV3RmFjZXMsIG5ld1VWcyA9IFtdO1xuXG5cdFx0dmFyIG4sIGwsIGksIGlsLCBqLCBrO1xuXHRcdHZhciBtZXRhVmVydGljZXMsIHNvdXJjZUVkZ2VzO1xuXG5cdFx0Ly8gbmV3IHN0dWZmLlxuXHRcdHZhciBzb3VyY2VFZGdlcywgbmV3RWRnZVZlcnRpY2VzLCBuZXdTb3VyY2VWZXJ0aWNlcztcblxuXHRcdG9sZFZlcnRpY2VzID0gZ2VvbWV0cnkudmVydGljZXM7IC8vIHsgeCwgeSwgen1cblx0XHRvbGRGYWNlcyA9IGdlb21ldHJ5LmZhY2VzOyAvLyB7IGE6IG9sZFZlcnRleDEsIGI6IG9sZFZlcnRleDIsIGM6IG9sZFZlcnRleDMgfVxuXHRcdG9sZFV2cyA9IGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbIDAgXTtcblxuXHRcdHZhciBoYXNVdnMgPSBvbGRVdnMgIT09IHVuZGVmaW5lZCAmJiBvbGRVdnMubGVuZ3RoID4gMDtcblxuXHRcdC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblx0XHQgKlxuXHRcdCAqIFN0ZXAgMDogUHJlcHJvY2VzcyBHZW9tZXRyeSB0byBHZW5lcmF0ZSBlZGdlcyBMb29rdXBcblx0XHQgKlxuXHRcdCAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cdFx0bWV0YVZlcnRpY2VzID0gbmV3IEFycmF5KCBvbGRWZXJ0aWNlcy5sZW5ndGggKTtcblx0XHRzb3VyY2VFZGdlcyA9IHt9OyAvLyBFZGdlID0+IHsgb2xkVmVydGV4MSwgb2xkVmVydGV4MiwgZmFjZXNbXSAgfVxuXG5cdFx0Z2VuZXJhdGVMb29rdXBzKCBvbGRWZXJ0aWNlcywgb2xkRmFjZXMsIG1ldGFWZXJ0aWNlcywgc291cmNlRWRnZXMgKTtcblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICpcdFN0ZXAgMS5cblx0XHQgKlx0Rm9yIGVhY2ggZWRnZSwgY3JlYXRlIGEgbmV3IEVkZ2UgVmVydGV4LFxuXHRcdCAqXHR0aGVuIHBvc2l0aW9uIGl0LlxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHRuZXdFZGdlVmVydGljZXMgPSBbXTtcblx0XHR2YXIgb3RoZXIsIGN1cnJlbnRFZGdlLCBuZXdFZGdlLCBmYWNlO1xuXHRcdHZhciBlZGdlVmVydGV4V2VpZ2h0LCBhZGphY2VudFZlcnRleFdlaWdodCwgY29ubmVjdGVkRmFjZXM7XG5cblx0XHRmb3IgKCBpIGluIHNvdXJjZUVkZ2VzICkge1xuXG5cdFx0XHRjdXJyZW50RWRnZSA9IHNvdXJjZUVkZ2VzWyBpIF07XG5cdFx0XHRuZXdFZGdlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcblxuXHRcdFx0ZWRnZVZlcnRleFdlaWdodCA9IDMgLyA4O1xuXHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAxIC8gODtcblxuXHRcdFx0Y29ubmVjdGVkRmFjZXMgPSBjdXJyZW50RWRnZS5mYWNlcy5sZW5ndGg7XG5cblx0XHRcdC8vIGNoZWNrIGhvdyBtYW55IGxpbmtlZCBmYWNlcy4gMiBzaG91bGQgYmUgY29ycmVjdC5cblx0XHRcdGlmICggY29ubmVjdGVkRmFjZXMgIT0gMiApIHtcblxuXHRcdFx0XHQvLyBpZiBsZW5ndGggaXMgbm90IDIsIGhhbmRsZSBjb25kaXRpb25cblx0XHRcdFx0ZWRnZVZlcnRleFdlaWdodCA9IDAuNTtcblx0XHRcdFx0YWRqYWNlbnRWZXJ0ZXhXZWlnaHQgPSAwO1xuXG5cdFx0XHRcdGlmICggY29ubmVjdGVkRmFjZXMgIT0gMSApIHtcblxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICdTdWJkaXZpc2lvbiBNb2RpZmllcjogTnVtYmVyIG9mIGNvbm5lY3RlZCBmYWNlcyAhPSAyLCBpczogJywgY29ubmVjdGVkRmFjZXMsIGN1cnJlbnRFZGdlICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdG5ld0VkZ2UuYWRkVmVjdG9ycyggY3VycmVudEVkZ2UuYSwgY3VycmVudEVkZ2UuYiApLm11bHRpcGx5U2NhbGFyKCBlZGdlVmVydGV4V2VpZ2h0ICk7XG5cblx0XHRcdHRtcC5zZXQoIDAsIDAsIDAgKTtcblxuXHRcdFx0Zm9yICggaiA9IDA7IGogPCBjb25uZWN0ZWRGYWNlczsgaiArKyApIHtcblxuXHRcdFx0XHRmYWNlID0gY3VycmVudEVkZ2UuZmFjZXNbIGogXTtcblxuXHRcdFx0XHRmb3IgKCBrID0gMDsgayA8IDM7IGsgKysgKSB7XG5cblx0XHRcdFx0XHRvdGhlciA9IG9sZFZlcnRpY2VzWyBmYWNlWyBBQkNbIGsgXSBdIF07XG5cdFx0XHRcdFx0aWYgKCBvdGhlciAhPT0gY3VycmVudEVkZ2UuYSAmJiBvdGhlciAhPT0gY3VycmVudEVkZ2UuYiApIGJyZWFrO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0bXAuYWRkKCBvdGhlciApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHRtcC5tdWx0aXBseVNjYWxhciggYWRqYWNlbnRWZXJ0ZXhXZWlnaHQgKTtcblx0XHRcdG5ld0VkZ2UuYWRkKCB0bXAgKTtcblxuXHRcdFx0Y3VycmVudEVkZ2UubmV3RWRnZSA9IG5ld0VkZ2VWZXJ0aWNlcy5sZW5ndGg7XG5cdFx0XHRuZXdFZGdlVmVydGljZXMucHVzaCggbmV3RWRnZSApO1xuXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhjdXJyZW50RWRnZSwgbmV3RWRnZSk7XG5cblx0XHR9XG5cblx0XHQvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cdFx0ICpcblx0XHQgKlx0U3RlcCAyLlxuXHRcdCAqXHRSZXBvc2l0aW9uIGVhY2ggc291cmNlIHZlcnRpY2VzLlxuXHRcdCAqXG5cdFx0ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblx0XHR2YXIgYmV0YSwgc291cmNlVmVydGV4V2VpZ2h0LCBjb25uZWN0aW5nVmVydGV4V2VpZ2h0O1xuXHRcdHZhciBjb25uZWN0aW5nRWRnZSwgY29ubmVjdGluZ0VkZ2VzLCBvbGRWZXJ0ZXgsIG5ld1NvdXJjZVZlcnRleDtcblx0XHRuZXdTb3VyY2VWZXJ0aWNlcyA9IFtdO1xuXG5cdFx0Zm9yICggaSA9IDAsIGlsID0gb2xkVmVydGljZXMubGVuZ3RoOyBpIDwgaWw7IGkgKysgKSB7XG5cblx0XHRcdG9sZFZlcnRleCA9IG9sZFZlcnRpY2VzWyBpIF07XG5cblx0XHRcdC8vIGZpbmQgYWxsIGNvbm5lY3RpbmcgZWRnZXMgKHVzaW5nIGxvb2t1cFRhYmxlKVxuXHRcdFx0Y29ubmVjdGluZ0VkZ2VzID0gbWV0YVZlcnRpY2VzWyBpIF0uZWRnZXM7XG5cdFx0XHRuID0gY29ubmVjdGluZ0VkZ2VzLmxlbmd0aDtcblxuXHRcdFx0aWYgKCBuID09IDMgKSB7XG5cblx0XHRcdFx0YmV0YSA9IDMgLyAxNjtcblxuXHRcdFx0fSBlbHNlIGlmICggbiA+IDMgKSB7XG5cblx0XHRcdFx0YmV0YSA9IDMgLyAoIDggKiBuICk7IC8vIFdhcnJlbidzIG1vZGlmaWVkIGZvcm11bGFcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBMb29wJ3Mgb3JpZ2luYWwgYmV0YSBmb3JtdWxhXG5cdFx0XHQvLyBiZXRhID0gMSAvIG4gKiAoIDUvOCAtIE1hdGgucG93KCAzLzggKyAxLzQgKiBNYXRoLmNvcyggMiAqIE1hdGguIFBJIC8gbiApLCAyKSApO1xuXG5cdFx0XHRzb3VyY2VWZXJ0ZXhXZWlnaHQgPSAxIC0gbiAqIGJldGE7XG5cdFx0XHRjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gYmV0YTtcblxuXHRcdFx0aWYgKCBuIDw9IDIgKSB7XG5cblx0XHRcdFx0Ly8gY3JlYXNlIGFuZCBib3VuZGFyeSBydWxlc1xuXHRcdFx0XHQvLyBjb25zb2xlLndhcm4oJ2NyZWFzZSBhbmQgYm91bmRhcnkgcnVsZXMnKTtcblxuXHRcdFx0XHRpZiAoIG4gPT0gMiApIHtcblxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICcyIGNvbm5lY3RpbmcgZWRnZXMnLCBjb25uZWN0aW5nRWRnZXMgKTtcblx0XHRcdFx0XHRzb3VyY2VWZXJ0ZXhXZWlnaHQgPSAzIC8gNDtcblx0XHRcdFx0XHRjb25uZWN0aW5nVmVydGV4V2VpZ2h0ID0gMSAvIDg7XG5cblx0XHRcdFx0XHQvLyBzb3VyY2VWZXJ0ZXhXZWlnaHQgPSAxO1xuXHRcdFx0XHRcdC8vIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgPSAwO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG4gPT0gMSApIHtcblxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICdvbmx5IDEgY29ubmVjdGluZyBlZGdlJyApO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG4gPT0gMCApIHtcblxuXHRcdFx0XHRcdGlmICggV0FSTklOR1MgKSBjb25zb2xlLndhcm4oICcwIGNvbm5lY3RpbmcgZWRnZXMnICk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdG5ld1NvdXJjZVZlcnRleCA9IG9sZFZlcnRleC5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKCBzb3VyY2VWZXJ0ZXhXZWlnaHQgKTtcblxuXHRcdFx0dG1wLnNldCggMCwgMCwgMCApO1xuXG5cdFx0XHRmb3IgKCBqID0gMDsgaiA8IG47IGogKysgKSB7XG5cblx0XHRcdFx0Y29ubmVjdGluZ0VkZ2UgPSBjb25uZWN0aW5nRWRnZXNbIGogXTtcblx0XHRcdFx0b3RoZXIgPSBjb25uZWN0aW5nRWRnZS5hICE9PSBvbGRWZXJ0ZXggPyBjb25uZWN0aW5nRWRnZS5hIDogY29ubmVjdGluZ0VkZ2UuYjtcblx0XHRcdFx0dG1wLmFkZCggb3RoZXIgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHR0bXAubXVsdGlwbHlTY2FsYXIoIGNvbm5lY3RpbmdWZXJ0ZXhXZWlnaHQgKTtcblx0XHRcdG5ld1NvdXJjZVZlcnRleC5hZGQoIHRtcCApO1xuXG5cdFx0XHRuZXdTb3VyY2VWZXJ0aWNlcy5wdXNoKCBuZXdTb3VyY2VWZXJ0ZXggKTtcblxuXHRcdH1cblxuXG5cdFx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXHRcdCAqXG5cdFx0ICpcdFN0ZXAgMy5cblx0XHQgKlx0R2VuZXJhdGUgRmFjZXMgYmV0d2VlbiBzb3VyY2UgdmVydGljZXNcblx0XHQgKlx0YW5kIGVkZ2UgdmVydGljZXMuXG5cdFx0ICpcblx0XHQgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXHRcdG5ld1ZlcnRpY2VzID0gbmV3U291cmNlVmVydGljZXMuY29uY2F0KCBuZXdFZGdlVmVydGljZXMgKTtcblx0XHR2YXIgc2wgPSBuZXdTb3VyY2VWZXJ0aWNlcy5sZW5ndGgsIGVkZ2UxLCBlZGdlMiwgZWRnZTM7XG5cdFx0bmV3RmFjZXMgPSBbXTtcblxuXHRcdHZhciB1diwgeDAsIHgxLCB4Mjtcblx0XHR2YXIgeDMgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuXHRcdHZhciB4NCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cdFx0dmFyIHg1ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuXHRcdGZvciAoIGkgPSAwLCBpbCA9IG9sZEZhY2VzLmxlbmd0aDsgaSA8IGlsOyBpICsrICkge1xuXG5cdFx0XHRmYWNlID0gb2xkRmFjZXNbIGkgXTtcblxuXHRcdFx0Ly8gZmluZCB0aGUgMyBuZXcgZWRnZXMgdmVydGV4IG9mIGVhY2ggb2xkIGZhY2VcblxuXHRcdFx0ZWRnZTEgPSBnZXRFZGdlKCBmYWNlLmEsIGZhY2UuYiwgc291cmNlRWRnZXMgKS5uZXdFZGdlICsgc2w7XG5cdFx0XHRlZGdlMiA9IGdldEVkZ2UoIGZhY2UuYiwgZmFjZS5jLCBzb3VyY2VFZGdlcyApLm5ld0VkZ2UgKyBzbDtcblx0XHRcdGVkZ2UzID0gZ2V0RWRnZSggZmFjZS5jLCBmYWNlLmEsIHNvdXJjZUVkZ2VzICkubmV3RWRnZSArIHNsO1xuXG5cdFx0XHQvLyBjcmVhdGUgNCBmYWNlcy5cblxuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGVkZ2UxLCBlZGdlMiwgZWRnZTMgKTtcblx0XHRcdG5ld0ZhY2UoIG5ld0ZhY2VzLCBmYWNlLmEsIGVkZ2UxLCBlZGdlMyApO1xuXHRcdFx0bmV3RmFjZSggbmV3RmFjZXMsIGZhY2UuYiwgZWRnZTIsIGVkZ2UxICk7XG5cdFx0XHRuZXdGYWNlKCBuZXdGYWNlcywgZmFjZS5jLCBlZGdlMywgZWRnZTIgKTtcblxuXHRcdFx0Ly8gY3JlYXRlIDQgbmV3IHV2J3NcblxuXHRcdFx0aWYgKCBoYXNVdnMgKSB7XG5cblx0XHRcdFx0dXYgPSBvbGRVdnNbIGkgXTtcblxuXHRcdFx0XHR4MCA9IHV2WyAwIF07XG5cdFx0XHRcdHgxID0gdXZbIDEgXTtcblx0XHRcdFx0eDIgPSB1dlsgMiBdO1xuXG5cdFx0XHRcdHgzLnNldCggbWlkcG9pbnQoIHgwLngsIHgxLnggKSwgbWlkcG9pbnQoIHgwLnksIHgxLnkgKSApO1xuXHRcdFx0XHR4NC5zZXQoIG1pZHBvaW50KCB4MS54LCB4Mi54ICksIG1pZHBvaW50KCB4MS55LCB4Mi55ICkgKTtcblx0XHRcdFx0eDUuc2V0KCBtaWRwb2ludCggeDAueCwgeDIueCApLCBtaWRwb2ludCggeDAueSwgeDIueSApICk7XG5cblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDMsIHg0LCB4NSApO1xuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MCwgeDMsIHg1ICk7XG5cblx0XHRcdFx0bmV3VXYoIG5ld1VWcywgeDEsIHg0LCB4MyApO1xuXHRcdFx0XHRuZXdVdiggbmV3VVZzLCB4MiwgeDUsIHg0ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIE92ZXJ3cml0ZSBvbGQgYXJyYXlzXG5cdFx0Z2VvbWV0cnkudmVydGljZXMgPSBuZXdWZXJ0aWNlcztcblx0XHRnZW9tZXRyeS5mYWNlcyA9IG5ld0ZhY2VzO1xuXHRcdGlmICggaGFzVXZzICkgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1sgMCBdID0gbmV3VVZzO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coJ2RvbmUnKTtcblxuXHR9O1xuXG59ICkoKTtcbiIsInZhciBzdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gYW5BcnJheVxuXG5mdW5jdGlvbiBhbkFycmF5KGFycikge1xuICByZXR1cm4gKFxuICAgICAgIGFyci5CWVRFU19QRVJfRUxFTUVOVFxuICAgICYmIHN0ci5jYWxsKGFyci5idWZmZXIpID09PSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nXG4gICAgfHwgQXJyYXkuaXNBcnJheShhcnIpXG4gIClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbnVtdHlwZShudW0sIGRlZikge1xuXHRyZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcidcblx0XHQ/IG51bSBcblx0XHQ6ICh0eXBlb2YgZGVmID09PSAnbnVtYmVyJyA/IGRlZiA6IDApXG59IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkdHlwZSkge1xuICBzd2l0Y2ggKGR0eXBlKSB7XG4gICAgY2FzZSAnaW50OCc6XG4gICAgICByZXR1cm4gSW50OEFycmF5XG4gICAgY2FzZSAnaW50MTYnOlxuICAgICAgcmV0dXJuIEludDE2QXJyYXlcbiAgICBjYXNlICdpbnQzMic6XG4gICAgICByZXR1cm4gSW50MzJBcnJheVxuICAgIGNhc2UgJ3VpbnQ4JzpcbiAgICAgIHJldHVybiBVaW50OEFycmF5XG4gICAgY2FzZSAndWludDE2JzpcbiAgICAgIHJldHVybiBVaW50MTZBcnJheVxuICAgIGNhc2UgJ3VpbnQzMic6XG4gICAgICByZXR1cm4gVWludDMyQXJyYXlcbiAgICBjYXNlICdmbG9hdDMyJzpcbiAgICAgIHJldHVybiBGbG9hdDMyQXJyYXlcbiAgICBjYXNlICdmbG9hdDY0JzpcbiAgICAgIHJldHVybiBGbG9hdDY0QXJyYXlcbiAgICBjYXNlICdhcnJheSc6XG4gICAgICByZXR1cm4gQXJyYXlcbiAgICBjYXNlICd1aW50OF9jbGFtcGVkJzpcbiAgICAgIHJldHVybiBVaW50OENsYW1wZWRBcnJheVxuICB9XG59XG4iLCIvKmVzbGludCBuZXctY2FwOjAqL1xudmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuVmVydGV4RGF0YVxuZnVuY3Rpb24gZmxhdHRlblZlcnRleERhdGEgKGRhdGEsIG91dHB1dCwgb2Zmc2V0KSB7XG4gIGlmICghZGF0YSkgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBzcGVjaWZ5IGRhdGEgYXMgZmlyc3QgcGFyYW1ldGVyJylcbiAgb2Zmc2V0ID0gKyhvZmZzZXQgfHwgMCkgfCAwXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgQXJyYXkuaXNBcnJheShkYXRhWzBdKSkge1xuICAgIHZhciBkaW0gPSBkYXRhWzBdLmxlbmd0aFxuICAgIHZhciBsZW5ndGggPSBkYXRhLmxlbmd0aCAqIGRpbVxuXG4gICAgLy8gbm8gb3V0cHV0IHNwZWNpZmllZCwgY3JlYXRlIGEgbmV3IHR5cGVkIGFycmF5XG4gICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG91dHB1dCA9IG5ldyAoZHR5cGUob3V0cHV0IHx8ICdmbG9hdDMyJykpKGxlbmd0aCArIG9mZnNldClcbiAgICB9XG5cbiAgICB2YXIgZHN0TGVuZ3RoID0gb3V0cHV0Lmxlbmd0aCAtIG9mZnNldFxuICAgIGlmIChsZW5ndGggIT09IGRzdExlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzb3VyY2UgbGVuZ3RoICcgKyBsZW5ndGggKyAnICgnICsgZGltICsgJ3gnICsgZGF0YS5sZW5ndGggKyAnKScgK1xuICAgICAgICAnIGRvZXMgbm90IG1hdGNoIGRlc3RpbmF0aW9uIGxlbmd0aCAnICsgZHN0TGVuZ3RoKVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBrID0gb2Zmc2V0OyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkaW07IGorKykge1xuICAgICAgICBvdXRwdXRbaysrXSA9IGRhdGFbaV1bal1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFvdXRwdXQgfHwgdHlwZW9mIG91dHB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIG5vIG91dHB1dCwgY3JlYXRlIGEgbmV3IG9uZVxuICAgICAgdmFyIEN0b3IgPSBkdHlwZShvdXRwdXQgfHwgJ2Zsb2F0MzInKVxuICAgICAgaWYgKG9mZnNldCA9PT0gMCkge1xuICAgICAgICBvdXRwdXQgPSBuZXcgQ3RvcihkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0ID0gbmV3IEN0b3IoZGF0YS5sZW5ndGggKyBvZmZzZXQpXG4gICAgICAgIG91dHB1dC5zZXQoZGF0YSwgb2Zmc2V0KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzdG9yZSBvdXRwdXQgaW4gZXhpc3RpbmcgYXJyYXlcbiAgICAgIG91dHB1dC5zZXQoZGF0YSwgb2Zmc2V0KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGlsZShwcm9wZXJ0eSkge1xuXHRpZiAoIXByb3BlcnR5IHx8IHR5cGVvZiBwcm9wZXJ0eSAhPT0gJ3N0cmluZycpXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtdXN0IHNwZWNpZnkgcHJvcGVydHkgZm9yIGluZGV4b2Ygc2VhcmNoJylcblxuXHRyZXR1cm4gbmV3IEZ1bmN0aW9uKCdhcnJheScsICd2YWx1ZScsICdzdGFydCcsIFtcblx0XHQnc3RhcnQgPSBzdGFydCB8fCAwJyxcblx0XHQnZm9yICh2YXIgaT1zdGFydDsgaTxhcnJheS5sZW5ndGg7IGkrKyknLFxuXHRcdCcgIGlmIChhcnJheVtpXVtcIicgKyBwcm9wZXJ0eSArJ1wiXSA9PT0gdmFsdWUpJyxcblx0XHQnICAgICAgcmV0dXJuIGknLFxuXHRcdCdyZXR1cm4gLTEnXG5cdF0uam9pbignXFxuJykpXG59IiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCJ2YXIgd29yZFdyYXAgPSByZXF1aXJlKCd3b3JkLXdyYXBwZXInKVxudmFyIHh0ZW5kID0gcmVxdWlyZSgneHRlbmQnKVxudmFyIGZpbmRDaGFyID0gcmVxdWlyZSgnaW5kZXhvZi1wcm9wZXJ0eScpKCdpZCcpXG52YXIgbnVtYmVyID0gcmVxdWlyZSgnYXMtbnVtYmVyJylcblxudmFyIFhfSEVJR0hUUyA9IFsneCcsICdlJywgJ2EnLCAnbycsICduJywgJ3MnLCAncicsICdjJywgJ3UnLCAnbScsICd2JywgJ3cnLCAneiddXG52YXIgTV9XSURUSFMgPSBbJ20nLCAndyddXG52YXIgQ0FQX0hFSUdIVFMgPSBbJ0gnLCAnSScsICdOJywgJ0UnLCAnRicsICdLJywgJ0wnLCAnVCcsICdVJywgJ1YnLCAnVycsICdYJywgJ1knLCAnWiddXG5cblxudmFyIFRBQl9JRCA9ICdcXHQnLmNoYXJDb2RlQXQoMClcbnZhciBTUEFDRV9JRCA9ICcgJy5jaGFyQ29kZUF0KDApXG52YXIgQUxJR05fTEVGVCA9IDAsIFxuICAgIEFMSUdOX0NFTlRFUiA9IDEsIFxuICAgIEFMSUdOX1JJR0hUID0gMlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZUxheW91dChvcHQpIHtcbiAgcmV0dXJuIG5ldyBUZXh0TGF5b3V0KG9wdClcbn1cblxuZnVuY3Rpb24gVGV4dExheW91dChvcHQpIHtcbiAgdGhpcy5nbHlwaHMgPSBbXVxuICB0aGlzLl9tZWFzdXJlID0gdGhpcy5jb21wdXRlTWV0cmljcy5iaW5kKHRoaXMpXG4gIHRoaXMudXBkYXRlKG9wdClcbn1cblxuVGV4dExheW91dC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3B0KSB7XG4gIG9wdCA9IHh0ZW5kKHtcbiAgICBtZWFzdXJlOiB0aGlzLl9tZWFzdXJlXG4gIH0sIG9wdClcbiAgdGhpcy5fb3B0ID0gb3B0XG4gIHRoaXMuX29wdC50YWJTaXplID0gbnVtYmVyKHRoaXMuX29wdC50YWJTaXplLCA0KVxuXG4gIGlmICghb3B0LmZvbnQpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdXN0IHByb3ZpZGUgYSB2YWxpZCBiaXRtYXAgZm9udCcpXG5cbiAgdmFyIGdseXBocyA9IHRoaXMuZ2x5cGhzXG4gIHZhciB0ZXh0ID0gb3B0LnRleHR8fCcnIFxuICB2YXIgZm9udCA9IG9wdC5mb250XG4gIHRoaXMuX3NldHVwU3BhY2VHbHlwaHMoZm9udClcbiAgXG4gIHZhciBsaW5lcyA9IHdvcmRXcmFwLmxpbmVzKHRleHQsIG9wdClcbiAgdmFyIG1pbldpZHRoID0gb3B0LndpZHRoIHx8IDBcblxuICAvL2NsZWFyIGdseXBoc1xuICBnbHlwaHMubGVuZ3RoID0gMFxuXG4gIC8vZ2V0IG1heCBsaW5lIHdpZHRoXG4gIHZhciBtYXhMaW5lV2lkdGggPSBsaW5lcy5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbGluZSkge1xuICAgIHJldHVybiBNYXRoLm1heChwcmV2LCBsaW5lLndpZHRoLCBtaW5XaWR0aClcbiAgfSwgMClcblxuICAvL3RoZSBwZW4gcG9zaXRpb25cbiAgdmFyIHggPSAwXG4gIHZhciB5ID0gMFxuICB2YXIgbGluZUhlaWdodCA9IG51bWJlcihvcHQubGluZUhlaWdodCwgZm9udC5jb21tb24ubGluZUhlaWdodClcbiAgdmFyIGJhc2VsaW5lID0gZm9udC5jb21tb24uYmFzZVxuICB2YXIgZGVzY2VuZGVyID0gbGluZUhlaWdodC1iYXNlbGluZVxuICB2YXIgbGV0dGVyU3BhY2luZyA9IG9wdC5sZXR0ZXJTcGFjaW5nIHx8IDBcbiAgdmFyIGhlaWdodCA9IGxpbmVIZWlnaHQgKiBsaW5lcy5sZW5ndGggLSBkZXNjZW5kZXJcbiAgdmFyIGFsaWduID0gZ2V0QWxpZ25UeXBlKHRoaXMuX29wdC5hbGlnbilcblxuICAvL2RyYXcgdGV4dCBhbG9uZyBiYXNlbGluZVxuICB5IC09IGhlaWdodFxuICBcbiAgLy90aGUgbWV0cmljcyBmb3IgdGhpcyB0ZXh0IGxheW91dFxuICB0aGlzLl93aWR0aCA9IG1heExpbmVXaWR0aFxuICB0aGlzLl9oZWlnaHQgPSBoZWlnaHRcbiAgdGhpcy5fZGVzY2VuZGVyID0gbGluZUhlaWdodCAtIGJhc2VsaW5lXG4gIHRoaXMuX2Jhc2VsaW5lID0gYmFzZWxpbmVcbiAgdGhpcy5feEhlaWdodCA9IGdldFhIZWlnaHQoZm9udClcbiAgdGhpcy5fY2FwSGVpZ2h0ID0gZ2V0Q2FwSGVpZ2h0KGZvbnQpXG4gIHRoaXMuX2xpbmVIZWlnaHQgPSBsaW5lSGVpZ2h0XG4gIHRoaXMuX2FzY2VuZGVyID0gbGluZUhlaWdodCAtIGRlc2NlbmRlciAtIHRoaXMuX3hIZWlnaHRcbiAgICBcbiAgLy9sYXlvdXQgZWFjaCBnbHlwaFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lLCBsaW5lSW5kZXgpIHtcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0XG4gICAgdmFyIGVuZCA9IGxpbmUuZW5kXG4gICAgdmFyIGxpbmVXaWR0aCA9IGxpbmUud2lkdGhcbiAgICB2YXIgbGFzdEdseXBoXG4gICAgXG4gICAgLy9mb3IgZWFjaCBnbHlwaCBpbiB0aGF0IGxpbmUuLi5cbiAgICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICAgIHZhciBnbHlwaCA9IHNlbGYuZ2V0R2x5cGgoZm9udCwgaWQpXG4gICAgICBpZiAoZ2x5cGgpIHtcbiAgICAgICAgaWYgKGxhc3RHbHlwaCkgXG4gICAgICAgICAgeCArPSBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpXG5cbiAgICAgICAgdmFyIHR4ID0geFxuICAgICAgICBpZiAoYWxpZ24gPT09IEFMSUdOX0NFTlRFUikgXG4gICAgICAgICAgdHggKz0gKG1heExpbmVXaWR0aC1saW5lV2lkdGgpLzJcbiAgICAgICAgZWxzZSBpZiAoYWxpZ24gPT09IEFMSUdOX1JJR0hUKVxuICAgICAgICAgIHR4ICs9IChtYXhMaW5lV2lkdGgtbGluZVdpZHRoKVxuXG4gICAgICAgIGdseXBocy5wdXNoKHtcbiAgICAgICAgICBwb3NpdGlvbjogW3R4LCB5XSxcbiAgICAgICAgICBkYXRhOiBnbHlwaCxcbiAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICBsaW5lOiBsaW5lSW5kZXhcbiAgICAgICAgfSkgIFxuXG4gICAgICAgIC8vbW92ZSBwZW4gZm9yd2FyZFxuICAgICAgICB4ICs9IGdseXBoLnhhZHZhbmNlICsgbGV0dGVyU3BhY2luZ1xuICAgICAgICBsYXN0R2x5cGggPSBnbHlwaFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vbmV4dCBsaW5lIGRvd25cbiAgICB5ICs9IGxpbmVIZWlnaHRcbiAgICB4ID0gMFxuICB9KVxuICB0aGlzLl9saW5lc1RvdGFsID0gbGluZXMubGVuZ3RoO1xufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5fc2V0dXBTcGFjZUdseXBocyA9IGZ1bmN0aW9uKGZvbnQpIHtcbiAgLy9UaGVzZSBhcmUgZmFsbGJhY2tzLCB3aGVuIHRoZSBmb250IGRvZXNuJ3QgaW5jbHVkZVxuICAvLycgJyBvciAnXFx0JyBnbHlwaHNcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gbnVsbFxuICB0aGlzLl9mYWxsYmFja1RhYkdseXBoID0gbnVsbFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm5cblxuICAvL3RyeSB0byBnZXQgc3BhY2UgZ2x5cGhcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgJ20nIG9yICd3JyBnbHlwaHNcbiAgLy90aGVuIGZhbGwgYmFjayB0byB0aGUgZmlyc3QgZ2x5cGggYXZhaWxhYmxlXG4gIHZhciBzcGFjZSA9IGdldEdseXBoQnlJZChmb250LCBTUEFDRV9JRCkgXG4gICAgICAgICAgfHwgZ2V0TUdseXBoKGZvbnQpIFxuICAgICAgICAgIHx8IGZvbnQuY2hhcnNbMF1cblxuICAvL2FuZCBjcmVhdGUgYSBmYWxsYmFjayBmb3IgdGFiXG4gIHZhciB0YWJXaWR0aCA9IHRoaXMuX29wdC50YWJTaXplICogc3BhY2UueGFkdmFuY2VcbiAgdGhpcy5fZmFsbGJhY2tTcGFjZUdseXBoID0gc3BhY2VcbiAgdGhpcy5fZmFsbGJhY2tUYWJHbHlwaCA9IHh0ZW5kKHNwYWNlLCB7XG4gICAgeDogMCwgeTogMCwgeGFkdmFuY2U6IHRhYldpZHRoLCBpZDogVEFCX0lELCBcbiAgICB4b2Zmc2V0OiAwLCB5b2Zmc2V0OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwXG4gIH0pXG59XG5cblRleHRMYXlvdXQucHJvdG90eXBlLmdldEdseXBoID0gZnVuY3Rpb24oZm9udCwgaWQpIHtcbiAgdmFyIGdseXBoID0gZ2V0R2x5cGhCeUlkKGZvbnQsIGlkKVxuICBpZiAoZ2x5cGgpXG4gICAgcmV0dXJuIGdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBUQUJfSUQpIFxuICAgIHJldHVybiB0aGlzLl9mYWxsYmFja1RhYkdseXBoXG4gIGVsc2UgaWYgKGlkID09PSBTUEFDRV9JRCkgXG4gICAgcmV0dXJuIHRoaXMuX2ZhbGxiYWNrU3BhY2VHbHlwaFxuICByZXR1cm4gbnVsbFxufVxuXG5UZXh0TGF5b3V0LnByb3RvdHlwZS5jb21wdXRlTWV0cmljcyA9IGZ1bmN0aW9uKHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKSB7XG4gIHZhciBsZXR0ZXJTcGFjaW5nID0gdGhpcy5fb3B0LmxldHRlclNwYWNpbmcgfHwgMFxuICB2YXIgZm9udCA9IHRoaXMuX29wdC5mb250XG4gIHZhciBjdXJQZW4gPSAwXG4gIHZhciBjdXJXaWR0aCA9IDBcbiAgdmFyIGNvdW50ID0gMFxuICB2YXIgZ2x5cGhcbiAgdmFyIGxhc3RHbHlwaFxuXG4gIGlmICghZm9udC5jaGFycyB8fCBmb250LmNoYXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogc3RhcnQsXG4gICAgICBlbmQ6IHN0YXJ0LFxuICAgICAgd2lkdGg6IDBcbiAgICB9XG4gIH1cblxuICBlbmQgPSBNYXRoLm1pbih0ZXh0Lmxlbmd0aCwgZW5kKVxuICBmb3IgKHZhciBpPXN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB2YXIgaWQgPSB0ZXh0LmNoYXJDb2RlQXQoaSlcbiAgICB2YXIgZ2x5cGggPSB0aGlzLmdldEdseXBoKGZvbnQsIGlkKVxuXG4gICAgaWYgKGdseXBoKSB7XG4gICAgICAvL21vdmUgcGVuIGZvcndhcmRcbiAgICAgIHZhciB4b2ZmID0gZ2x5cGgueG9mZnNldFxuICAgICAgdmFyIGtlcm4gPSBsYXN0R2x5cGggPyBnZXRLZXJuaW5nKGZvbnQsIGxhc3RHbHlwaC5pZCwgZ2x5cGguaWQpIDogMFxuICAgICAgY3VyUGVuICs9IGtlcm5cblxuICAgICAgdmFyIG5leHRQZW4gPSBjdXJQZW4gKyBnbHlwaC54YWR2YW5jZSArIGxldHRlclNwYWNpbmdcbiAgICAgIHZhciBuZXh0V2lkdGggPSBjdXJQZW4gKyBnbHlwaC53aWR0aFxuXG4gICAgICAvL3dlJ3ZlIGhpdCBvdXIgbGltaXQ7IHdlIGNhbid0IG1vdmUgb250byB0aGUgbmV4dCBnbHlwaFxuICAgICAgaWYgKG5leHRXaWR0aCA+PSB3aWR0aCB8fCBuZXh0UGVuID49IHdpZHRoKVxuICAgICAgICBicmVha1xuXG4gICAgICAvL290aGVyd2lzZSBjb250aW51ZSBhbG9uZyBvdXIgbGluZVxuICAgICAgY3VyUGVuID0gbmV4dFBlblxuICAgICAgY3VyV2lkdGggPSBuZXh0V2lkdGhcbiAgICAgIGxhc3RHbHlwaCA9IGdseXBoXG4gICAgfVxuICAgIGNvdW50KytcbiAgfVxuICBcbiAgLy9tYWtlIHN1cmUgcmlnaHRtb3N0IGVkZ2UgbGluZXMgdXAgd2l0aCByZW5kZXJlZCBnbHlwaHNcbiAgaWYgKGxhc3RHbHlwaClcbiAgICBjdXJXaWR0aCArPSBsYXN0R2x5cGgueG9mZnNldFxuXG4gIHJldHVybiB7XG4gICAgc3RhcnQ6IHN0YXJ0LFxuICAgIGVuZDogc3RhcnQgKyBjb3VudCxcbiAgICB3aWR0aDogY3VyV2lkdGhcbiAgfVxufVxuXG4vL2dldHRlcnMgZm9yIHRoZSBwcml2YXRlIHZhcnNcbjtbJ3dpZHRoJywgJ2hlaWdodCcsIFxuICAnZGVzY2VuZGVyJywgJ2FzY2VuZGVyJyxcbiAgJ3hIZWlnaHQnLCAnYmFzZWxpbmUnLFxuICAnY2FwSGVpZ2h0JyxcbiAgJ2xpbmVIZWlnaHQnIF0uZm9yRWFjaChhZGRHZXR0ZXIpXG5cbmZ1bmN0aW9uIGFkZEdldHRlcihuYW1lKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUZXh0TGF5b3V0LnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGdldDogd3JhcHBlcihuYW1lKSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn1cblxuLy9jcmVhdGUgbG9va3VwcyBmb3IgcHJpdmF0ZSB2YXJzXG5mdW5jdGlvbiB3cmFwcGVyKG5hbWUpIHtcbiAgcmV0dXJuIChuZXcgRnVuY3Rpb24oW1xuICAgICdyZXR1cm4gZnVuY3Rpb24gJytuYW1lKycoKSB7JyxcbiAgICAnICByZXR1cm4gdGhpcy5fJytuYW1lLFxuICAgICd9J1xuICBdLmpvaW4oJ1xcbicpKSkoKVxufVxuXG5mdW5jdGlvbiBnZXRHbHlwaEJ5SWQoZm9udCwgaWQpIHtcbiAgaWYgKCFmb250LmNoYXJzIHx8IGZvbnQuY2hhcnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBudWxsXG5cbiAgdmFyIGdseXBoSWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gIGlmIChnbHlwaElkeCA+PSAwKVxuICAgIHJldHVybiBmb250LmNoYXJzW2dseXBoSWR4XVxuICByZXR1cm4gbnVsbFxufVxuXG5mdW5jdGlvbiBnZXRYSGVpZ2h0KGZvbnQpIHtcbiAgZm9yICh2YXIgaT0wOyBpPFhfSEVJR0hUUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IFhfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldE1HbHlwaChmb250KSB7XG4gIGZvciAodmFyIGk9MDsgaTxNX1dJRFRIUy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpZCA9IE1fV0lEVEhTW2ldLmNoYXJDb2RlQXQoMClcbiAgICB2YXIgaWR4ID0gZmluZENoYXIoZm9udC5jaGFycywgaWQpXG4gICAgaWYgKGlkeCA+PSAwKSBcbiAgICAgIHJldHVybiBmb250LmNoYXJzW2lkeF1cbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBnZXRDYXBIZWlnaHQoZm9udCkge1xuICBmb3IgKHZhciBpPTA7IGk8Q0FQX0hFSUdIVFMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaWQgPSBDQVBfSEVJR0hUU1tpXS5jaGFyQ29kZUF0KDApXG4gICAgdmFyIGlkeCA9IGZpbmRDaGFyKGZvbnQuY2hhcnMsIGlkKVxuICAgIGlmIChpZHggPj0gMCkgXG4gICAgICByZXR1cm4gZm9udC5jaGFyc1tpZHhdLmhlaWdodFxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGdldEtlcm5pbmcoZm9udCwgbGVmdCwgcmlnaHQpIHtcbiAgaWYgKCFmb250Lmtlcm5pbmdzIHx8IGZvbnQua2VybmluZ3MubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiAwXG5cbiAgdmFyIHRhYmxlID0gZm9udC5rZXJuaW5nc1xuICBmb3IgKHZhciBpPTA7IGk8dGFibGUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIga2VybiA9IHRhYmxlW2ldXG4gICAgaWYgKGtlcm4uZmlyc3QgPT09IGxlZnQgJiYga2Vybi5zZWNvbmQgPT09IHJpZ2h0KVxuICAgICAgcmV0dXJuIGtlcm4uYW1vdW50XG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZ2V0QWxpZ25UeXBlKGFsaWduKSB7XG4gIGlmIChhbGlnbiA9PT0gJ2NlbnRlcicpXG4gICAgcmV0dXJuIEFMSUdOX0NFTlRFUlxuICBlbHNlIGlmIChhbGlnbiA9PT0gJ3JpZ2h0JylcbiAgICByZXR1cm4gQUxJR05fUklHSFRcbiAgcmV0dXJuIEFMSUdOX0xFRlRcbn0iLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gdG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBzaG91bGRVc2VOYXRpdmUoKSB7XG5cdHRyeSB7XG5cdFx0aWYgKCFPYmplY3QuYXNzaWduKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZWN0IGJ1Z2d5IHByb3BlcnR5IGVudW1lcmF0aW9uIG9yZGVyIGluIG9sZGVyIFY4IHZlcnNpb25zLlxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDExOFxuXHRcdHZhciB0ZXN0MSA9IG5ldyBTdHJpbmcoJ2FiYycpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gV2UgZG9uJ3QgZXhwZWN0IGFueSBvZiB0aGUgYWJvdmUgdG8gdGhyb3csIGJ1dCBiZXR0ZXIgdG8gYmUgc2FmZS5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG91bGRVc2VOYXRpdmUoKSA/IE9iamVjdC5hc3NpZ24gOiBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciB0byA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzeW1ib2xzO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IE9iamVjdChhcmd1bWVudHNbc10pO1xuXG5cdFx0Zm9yICh2YXIga2V5IGluIGZyb20pIHtcblx0XHRcdGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGZyb20sIGtleSkpIHtcblx0XHRcdFx0dG9ba2V5XSA9IGZyb21ba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHBhcnNlQk1Gb250QXNjaWkoZGF0YSkge1xuICBpZiAoIWRhdGEpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIHByb3ZpZGVkJylcbiAgZGF0YSA9IGRhdGEudG9TdHJpbmcoKS50cmltKClcblxuICB2YXIgb3V0cHV0ID0ge1xuICAgIHBhZ2VzOiBbXSxcbiAgICBjaGFyczogW10sXG4gICAga2VybmluZ3M6IFtdXG4gIH1cblxuICB2YXIgbGluZXMgPSBkYXRhLnNwbGl0KC9cXHJcXG4/fFxcbi9nKVxuXG4gIGlmIChsaW5lcy5sZW5ndGggPT09IDApXG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBkYXRhIGluIEJNRm9udCBmaWxlJylcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmVEYXRhID0gc3BsaXRMaW5lKGxpbmVzW2ldLCBpKVxuICAgIGlmICghbGluZURhdGEpIC8vc2tpcCBlbXB0eSBsaW5lc1xuICAgICAgY29udGludWVcblxuICAgIGlmIChsaW5lRGF0YS5rZXkgPT09ICdwYWdlJykge1xuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmlkICE9PSAnbnVtYmVyJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYWxmb3JtZWQgZmlsZSBhdCBsaW5lICcgKyBpICsgJyAtLSBuZWVkcyBwYWdlIGlkPU4nKVxuICAgICAgaWYgKHR5cGVvZiBsaW5lRGF0YS5kYXRhLmZpbGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hbGZvcm1lZCBmaWxlIGF0IGxpbmUgJyArIGkgKyAnIC0tIG5lZWRzIHBhZ2UgZmlsZT1cInBhdGhcIicpXG4gICAgICBvdXRwdXQucGFnZXNbbGluZURhdGEuZGF0YS5pZF0gPSBsaW5lRGF0YS5kYXRhLmZpbGVcbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXJzJyB8fCBsaW5lRGF0YS5rZXkgPT09ICdrZXJuaW5ncycpIHtcbiAgICAgIC8vLi4uIGRvIG5vdGhpbmcgZm9yIHRoZXNlIHR3byAuLi5cbiAgICB9IGVsc2UgaWYgKGxpbmVEYXRhLmtleSA9PT0gJ2NoYXInKSB7XG4gICAgICBvdXRwdXQuY2hhcnMucHVzaChsaW5lRGF0YS5kYXRhKVxuICAgIH0gZWxzZSBpZiAobGluZURhdGEua2V5ID09PSAna2VybmluZycpIHtcbiAgICAgIG91dHB1dC5rZXJuaW5ncy5wdXNoKGxpbmVEYXRhLmRhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtsaW5lRGF0YS5rZXldID0gbGluZURhdGEuZGF0YVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gc3BsaXRMaW5lKGxpbmUsIGlkeCkge1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXHQrL2csICcgJykudHJpbSgpXG4gIGlmICghbGluZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHZhciBzcGFjZSA9IGxpbmUuaW5kZXhPZignICcpXG4gIGlmIChzcGFjZSA9PT0gLTEpIFxuICAgIHRocm93IG5ldyBFcnJvcihcIm5vIG5hbWVkIHJvdyBhdCBsaW5lIFwiICsgaWR4KVxuXG4gIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBzcGFjZSlcblxuICBsaW5lID0gbGluZS5zdWJzdHJpbmcoc3BhY2UgKyAxKVxuICAvL2NsZWFyIFwibGV0dGVyXCIgZmllbGQgYXMgaXQgaXMgbm9uLXN0YW5kYXJkIGFuZFxuICAvL3JlcXVpcmVzIGFkZGl0aW9uYWwgY29tcGxleGl0eSB0byBwYXJzZSBcIiAvID0gc3ltYm9sc1xuICBsaW5lID0gbGluZS5yZXBsYWNlKC9sZXR0ZXI9W1xcJ1xcXCJdXFxTK1tcXCdcXFwiXS9naSwgJycpICBcbiAgbGluZSA9IGxpbmUuc3BsaXQoXCI9XCIpXG4gIGxpbmUgPSBsaW5lLm1hcChmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5tYXRjaCgoLyhcIi4qP1wifFteXCJcXHNdKykrKD89XFxzKnxcXHMqJCkvZykpXG4gIH0pXG5cbiAgdmFyIGRhdGEgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZHQgPSBsaW5lW2ldXG4gICAgaWYgKGkgPT09IDApIHtcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMF0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpID09PSBsaW5lLmxlbmd0aCAtIDEpIHtcbiAgICAgIGRhdGFbZGF0YS5sZW5ndGggLSAxXS5kYXRhID0gcGFyc2VEYXRhKGR0WzBdKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhW2RhdGEubGVuZ3RoIC0gMV0uZGF0YSA9IHBhcnNlRGF0YShkdFswXSlcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIGtleTogZHRbMV0sXG4gICAgICAgIGRhdGE6IFwiXCJcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgdmFyIG91dCA9IHtcbiAgICBrZXk6IGtleSxcbiAgICBkYXRhOiB7fVxuICB9XG5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICBvdXQuZGF0YVt2LmtleV0gPSB2LmRhdGE7XG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBwYXJzZURhdGEoZGF0YSkge1xuICBpZiAoIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIFwiXCJcblxuICBpZiAoZGF0YS5pbmRleE9mKCdcIicpID09PSAwIHx8IGRhdGEuaW5kZXhPZihcIidcIikgPT09IDApXG4gICAgcmV0dXJuIGRhdGEuc3Vic3RyaW5nKDEsIGRhdGEubGVuZ3RoIC0gMSlcbiAgaWYgKGRhdGEuaW5kZXhPZignLCcpICE9PSAtMSlcbiAgICByZXR1cm4gcGFyc2VJbnRMaXN0KGRhdGEpXG4gIHJldHVybiBwYXJzZUludChkYXRhLCAxMClcbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRMaXN0KGRhdGEpIHtcbiAgcmV0dXJuIGRhdGEuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApXG4gIH0pXG59IiwidmFyIGR0eXBlID0gcmVxdWlyZSgnZHR5cGUnKVxudmFyIGFuQXJyYXkgPSByZXF1aXJlKCdhbi1hcnJheScpXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKVxuXG52YXIgQ1cgPSBbMCwgMiwgM11cbnZhciBDQ1cgPSBbMiwgMSwgM11cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVRdWFkRWxlbWVudHMoYXJyYXksIG9wdCkge1xuICAgIC8vaWYgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhbiBvdXRwdXQgYXJyYXlcbiAgICBpZiAoIWFycmF5IHx8ICEoYW5BcnJheShhcnJheSkgfHwgaXNCdWZmZXIoYXJyYXkpKSkge1xuICAgICAgICBvcHQgPSBhcnJheSB8fCB7fVxuICAgICAgICBhcnJheSA9IG51bGxcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ251bWJlcicpIC8vYmFja3dhcmRzLWNvbXBhdGlibGVcbiAgICAgICAgb3B0ID0geyBjb3VudDogb3B0IH1cbiAgICBlbHNlXG4gICAgICAgIG9wdCA9IG9wdCB8fCB7fVxuXG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb3B0LnR5cGUgPT09ICdzdHJpbmcnID8gb3B0LnR5cGUgOiAndWludDE2J1xuICAgIHZhciBjb3VudCA9IHR5cGVvZiBvcHQuY291bnQgPT09ICdudW1iZXInID8gb3B0LmNvdW50IDogMVxuICAgIHZhciBzdGFydCA9IChvcHQuc3RhcnQgfHwgMCkgXG5cbiAgICB2YXIgZGlyID0gb3B0LmNsb2Nrd2lzZSAhPT0gZmFsc2UgPyBDVyA6IENDVyxcbiAgICAgICAgYSA9IGRpclswXSwgXG4gICAgICAgIGIgPSBkaXJbMV0sXG4gICAgICAgIGMgPSBkaXJbMl1cblxuICAgIHZhciBudW1JbmRpY2VzID0gY291bnQgKiA2XG5cbiAgICB2YXIgaW5kaWNlcyA9IGFycmF5IHx8IG5ldyAoZHR5cGUodHlwZSkpKG51bUluZGljZXMpXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwgbnVtSW5kaWNlczsgaSArPSA2LCBqICs9IDQpIHtcbiAgICAgICAgdmFyIHggPSBpICsgc3RhcnRcbiAgICAgICAgaW5kaWNlc1t4ICsgMF0gPSBqICsgMFxuICAgICAgICBpbmRpY2VzW3ggKyAxXSA9IGogKyAxXG4gICAgICAgIGluZGljZXNbeCArIDJdID0gaiArIDJcbiAgICAgICAgaW5kaWNlc1t4ICsgM10gPSBqICsgYVxuICAgICAgICBpbmRpY2VzW3ggKyA0XSA9IGogKyBiXG4gICAgICAgIGluZGljZXNbeCArIDVdID0gaiArIGNcbiAgICB9XG4gICAgcmV0dXJuIGluZGljZXNcbn0iLCJ2YXIgY3JlYXRlTGF5b3V0ID0gcmVxdWlyZSgnbGF5b3V0LWJtZm9udC10ZXh0JylcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJylcbnZhciBjcmVhdGVJbmRpY2VzID0gcmVxdWlyZSgncXVhZC1pbmRpY2VzJylcbnZhciBidWZmZXIgPSByZXF1aXJlKCd0aHJlZS1idWZmZXItdmVydGV4LWRhdGEnKVxudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG52YXIgdmVydGljZXMgPSByZXF1aXJlKCcuL2xpYi92ZXJ0aWNlcycpXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL2xpYi91dGlscycpXG5cbnZhciBCYXNlID0gVEhSRUUuQnVmZmVyR2VvbWV0cnlcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGVUZXh0R2VvbWV0cnkgKG9wdCkge1xuICByZXR1cm4gbmV3IFRleHRHZW9tZXRyeShvcHQpXG59XG5cbmZ1bmN0aW9uIFRleHRHZW9tZXRyeSAob3B0KSB7XG4gIEJhc2UuY2FsbCh0aGlzKVxuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJykge1xuICAgIG9wdCA9IHsgdGV4dDogb3B0IH1cbiAgfVxuXG4gIC8vIHVzZSB0aGVzZSBhcyBkZWZhdWx0IHZhbHVlcyBmb3IgYW55IHN1YnNlcXVlbnRcbiAgLy8gY2FsbHMgdG8gdXBkYXRlKClcbiAgdGhpcy5fb3B0ID0gYXNzaWduKHt9LCBvcHQpXG5cbiAgLy8gYWxzbyBkbyBhbiBpbml0aWFsIHNldHVwLi4uXG4gIGlmIChvcHQpIHRoaXMudXBkYXRlKG9wdClcbn1cblxuaW5oZXJpdHMoVGV4dEdlb21ldHJ5LCBCYXNlKVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgaWYgKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0ID0geyB0ZXh0OiBvcHQgfVxuICB9XG5cbiAgLy8gdXNlIGNvbnN0cnVjdG9yIGRlZmF1bHRzXG4gIG9wdCA9IGFzc2lnbih7fSwgdGhpcy5fb3B0LCBvcHQpXG5cbiAgaWYgKCFvcHQuZm9udCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3Qgc3BlY2lmeSBhIHsgZm9udCB9IGluIG9wdGlvbnMnKVxuICB9XG5cbiAgdGhpcy5sYXlvdXQgPSBjcmVhdGVMYXlvdXQob3B0KVxuXG4gIC8vIGdldCB2ZWMyIHRleGNvb3Jkc1xuICB2YXIgZmxpcFkgPSBvcHQuZmxpcFkgIT09IGZhbHNlXG5cbiAgLy8gdGhlIGRlc2lyZWQgQk1Gb250IGRhdGFcbiAgdmFyIGZvbnQgPSBvcHQuZm9udFxuXG4gIC8vIGRldGVybWluZSB0ZXh0dXJlIHNpemUgZnJvbSBmb250IGZpbGVcbiAgdmFyIHRleFdpZHRoID0gZm9udC5jb21tb24uc2NhbGVXXG4gIHZhciB0ZXhIZWlnaHQgPSBmb250LmNvbW1vbi5zY2FsZUhcblxuICAvLyBnZXQgdmlzaWJsZSBnbHlwaHNcbiAgdmFyIGdseXBocyA9IHRoaXMubGF5b3V0LmdseXBocy5maWx0ZXIoZnVuY3Rpb24gKGdseXBoKSB7XG4gICAgdmFyIGJpdG1hcCA9IGdseXBoLmRhdGFcbiAgICByZXR1cm4gYml0bWFwLndpZHRoICogYml0bWFwLmhlaWdodCA+IDBcbiAgfSlcblxuICAvLyBwcm92aWRlIHZpc2libGUgZ2x5cGhzIGZvciBjb252ZW5pZW5jZVxuICB0aGlzLnZpc2libGVHbHlwaHMgPSBnbHlwaHNcblxuICAvLyBnZXQgY29tbW9uIHZlcnRleCBkYXRhXG4gIHZhciBwb3NpdGlvbnMgPSB2ZXJ0aWNlcy5wb3NpdGlvbnMoZ2x5cGhzKVxuICB2YXIgdXZzID0gdmVydGljZXMudXZzKGdseXBocywgdGV4V2lkdGgsIHRleEhlaWdodCwgZmxpcFkpXG4gIHZhciBpbmRpY2VzID0gY3JlYXRlSW5kaWNlcyh7XG4gICAgY2xvY2t3aXNlOiB0cnVlLFxuICAgIHR5cGU6ICd1aW50MTYnLFxuICAgIGNvdW50OiBnbHlwaHMubGVuZ3RoXG4gIH0pXG5cbiAgLy8gdXBkYXRlIHZlcnRleCBkYXRhXG4gIGJ1ZmZlci5pbmRleCh0aGlzLCBpbmRpY2VzLCAxLCAndWludDE2JylcbiAgYnVmZmVyLmF0dHIodGhpcywgJ3Bvc2l0aW9uJywgcG9zaXRpb25zLCAyKVxuICBidWZmZXIuYXR0cih0aGlzLCAndXYnLCB1dnMsIDIpXG5cbiAgLy8gdXBkYXRlIG11bHRpcGFnZSBkYXRhXG4gIGlmICghb3B0Lm11bHRpcGFnZSAmJiAncGFnZScgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgLy8gZGlzYWJsZSBtdWx0aXBhZ2UgcmVuZGVyaW5nXG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoJ3BhZ2UnKVxuICB9IGVsc2UgaWYgKG9wdC5tdWx0aXBhZ2UpIHtcbiAgICB2YXIgcGFnZXMgPSB2ZXJ0aWNlcy5wYWdlcyhnbHlwaHMpXG4gICAgLy8gZW5hYmxlIG11bHRpcGFnZSByZW5kZXJpbmdcbiAgICBidWZmZXIuYXR0cih0aGlzLCAncGFnZScsIHBhZ2VzLCAxKVxuICB9XG59XG5cblRleHRHZW9tZXRyeS5wcm90b3R5cGUuY29tcHV0ZUJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5ib3VuZGluZ1NwaGVyZSA9PT0gbnVsbCkge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUgPSBuZXcgVEhSRUUuU3BoZXJlKClcbiAgfVxuXG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUucmFkaXVzID0gMFxuICAgIHRoaXMuYm91bmRpbmdTcGhlcmUuY2VudGVyLnNldCgwLCAwLCAwKVxuICAgIHJldHVyblxuICB9XG4gIHV0aWxzLmNvbXB1dGVTcGhlcmUocG9zaXRpb25zLCB0aGlzLmJvdW5kaW5nU3BoZXJlKVxuICBpZiAoaXNOYU4odGhpcy5ib3VuZGluZ1NwaGVyZS5yYWRpdXMpKSB7XG4gICAgY29uc29sZS5lcnJvcignVEhSRUUuQnVmZmVyR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk6ICcgK1xuICAgICAgJ0NvbXB1dGVkIHJhZGl1cyBpcyBOYU4uIFRoZSAnICtcbiAgICAgICdcInBvc2l0aW9uXCIgYXR0cmlidXRlIGlzIGxpa2VseSB0byBoYXZlIE5hTiB2YWx1ZXMuJylcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnkucHJvdG90eXBlLmNvbXB1dGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYm91bmRpbmdCb3ggPT09IG51bGwpIHtcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gbmV3IFRIUkVFLkJveDMoKVxuICB9XG5cbiAgdmFyIGJib3ggPSB0aGlzLmJvdW5kaW5nQm94XG4gIHZhciBwb3NpdGlvbnMgPSB0aGlzLmF0dHJpYnV0ZXMucG9zaXRpb24uYXJyYXlcbiAgdmFyIGl0ZW1TaXplID0gdGhpcy5hdHRyaWJ1dGVzLnBvc2l0aW9uLml0ZW1TaXplXG4gIGlmICghcG9zaXRpb25zIHx8ICFpdGVtU2l6ZSB8fCBwb3NpdGlvbnMubGVuZ3RoIDwgMikge1xuICAgIGJib3gubWFrZUVtcHR5KClcbiAgICByZXR1cm5cbiAgfVxuICB1dGlscy5jb21wdXRlQm94KHBvc2l0aW9ucywgYmJveClcbn1cbiIsInZhciBpdGVtU2l6ZSA9IDJcbnZhciBib3ggPSB7IG1pbjogWzAsIDBdLCBtYXg6IFswLCAwXSB9XG5cbmZ1bmN0aW9uIGJvdW5kcyAocG9zaXRpb25zKSB7XG4gIHZhciBjb3VudCA9IHBvc2l0aW9ucy5sZW5ndGggLyBpdGVtU2l6ZVxuICBib3gubWluWzBdID0gcG9zaXRpb25zWzBdXG4gIGJveC5taW5bMV0gPSBwb3NpdGlvbnNbMV1cbiAgYm94Lm1heFswXSA9IHBvc2l0aW9uc1swXVxuICBib3gubWF4WzFdID0gcG9zaXRpb25zWzFdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgdmFyIHggPSBwb3NpdGlvbnNbaSAqIGl0ZW1TaXplICsgMF1cbiAgICB2YXIgeSA9IHBvc2l0aW9uc1tpICogaXRlbVNpemUgKyAxXVxuICAgIGJveC5taW5bMF0gPSBNYXRoLm1pbih4LCBib3gubWluWzBdKVxuICAgIGJveC5taW5bMV0gPSBNYXRoLm1pbih5LCBib3gubWluWzFdKVxuICAgIGJveC5tYXhbMF0gPSBNYXRoLm1heCh4LCBib3gubWF4WzBdKVxuICAgIGJveC5tYXhbMV0gPSBNYXRoLm1heCh5LCBib3gubWF4WzFdKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVCb3ggPSBmdW5jdGlvbiAocG9zaXRpb25zLCBvdXRwdXQpIHtcbiAgYm91bmRzKHBvc2l0aW9ucylcbiAgb3V0cHV0Lm1pbi5zZXQoYm94Lm1pblswXSwgYm94Lm1pblsxXSwgMClcbiAgb3V0cHV0Lm1heC5zZXQoYm94Lm1heFswXSwgYm94Lm1heFsxXSwgMClcbn1cblxubW9kdWxlLmV4cG9ydHMuY29tcHV0ZVNwaGVyZSA9IGZ1bmN0aW9uIChwb3NpdGlvbnMsIG91dHB1dCkge1xuICBib3VuZHMocG9zaXRpb25zKVxuICB2YXIgbWluWCA9IGJveC5taW5bMF1cbiAgdmFyIG1pblkgPSBib3gubWluWzFdXG4gIHZhciBtYXhYID0gYm94Lm1heFswXVxuICB2YXIgbWF4WSA9IGJveC5tYXhbMV1cbiAgdmFyIHdpZHRoID0gbWF4WCAtIG1pblhcbiAgdmFyIGhlaWdodCA9IG1heFkgLSBtaW5ZXG4gIHZhciBsZW5ndGggPSBNYXRoLnNxcnQod2lkdGggKiB3aWR0aCArIGhlaWdodCAqIGhlaWdodClcbiAgb3V0cHV0LmNlbnRlci5zZXQobWluWCArIHdpZHRoIC8gMiwgbWluWSArIGhlaWdodCAvIDIsIDApXG4gIG91dHB1dC5yYWRpdXMgPSBsZW5ndGggLyAyXG59XG4iLCJtb2R1bGUuZXhwb3J0cy5wYWdlcyA9IGZ1bmN0aW9uIHBhZ2VzIChnbHlwaHMpIHtcbiAgdmFyIHBhZ2VzID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDEpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgaWQgPSBnbHlwaC5kYXRhLnBhZ2UgfHwgMFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICAgIHBhZ2VzW2krK10gPSBpZFxuICB9KVxuICByZXR1cm4gcGFnZXNcbn1cblxubW9kdWxlLmV4cG9ydHMudXZzID0gZnVuY3Rpb24gdXZzIChnbHlwaHMsIHRleFdpZHRoLCB0ZXhIZWlnaHQsIGZsaXBZKSB7XG4gIHZhciB1dnMgPSBuZXcgRmxvYXQzMkFycmF5KGdseXBocy5sZW5ndGggKiA0ICogMilcbiAgdmFyIGkgPSAwXG4gIGdseXBocy5mb3JFYWNoKGZ1bmN0aW9uIChnbHlwaCkge1xuICAgIHZhciBiaXRtYXAgPSBnbHlwaC5kYXRhXG4gICAgdmFyIGJ3ID0gKGJpdG1hcC54ICsgYml0bWFwLndpZHRoKVxuICAgIHZhciBiaCA9IChiaXRtYXAueSArIGJpdG1hcC5oZWlnaHQpXG5cbiAgICAvLyB0b3AgbGVmdCBwb3NpdGlvblxuICAgIHZhciB1MCA9IGJpdG1hcC54IC8gdGV4V2lkdGhcbiAgICB2YXIgdjEgPSBiaXRtYXAueSAvIHRleEhlaWdodFxuICAgIHZhciB1MSA9IGJ3IC8gdGV4V2lkdGhcbiAgICB2YXIgdjAgPSBiaCAvIHRleEhlaWdodFxuXG4gICAgaWYgKGZsaXBZKSB7XG4gICAgICB2MSA9ICh0ZXhIZWlnaHQgLSBiaXRtYXAueSkgLyB0ZXhIZWlnaHRcbiAgICAgIHYwID0gKHRleEhlaWdodCAtIGJoKSAvIHRleEhlaWdodFxuICAgIH1cblxuICAgIC8vIEJMXG4gICAgdXZzW2krK10gPSB1MFxuICAgIHV2c1tpKytdID0gdjFcbiAgICAvLyBUTFxuICAgIHV2c1tpKytdID0gdTBcbiAgICB1dnNbaSsrXSA9IHYwXG4gICAgLy8gVFJcbiAgICB1dnNbaSsrXSA9IHUxXG4gICAgdXZzW2krK10gPSB2MFxuICAgIC8vIEJSXG4gICAgdXZzW2krK10gPSB1MVxuICAgIHV2c1tpKytdID0gdjFcbiAgfSlcbiAgcmV0dXJuIHV2c1xufVxuXG5tb2R1bGUuZXhwb3J0cy5wb3NpdGlvbnMgPSBmdW5jdGlvbiBwb3NpdGlvbnMgKGdseXBocykge1xuICB2YXIgcG9zaXRpb25zID0gbmV3IEZsb2F0MzJBcnJheShnbHlwaHMubGVuZ3RoICogNCAqIDIpXG4gIHZhciBpID0gMFxuICBnbHlwaHMuZm9yRWFjaChmdW5jdGlvbiAoZ2x5cGgpIHtcbiAgICB2YXIgYml0bWFwID0gZ2x5cGguZGF0YVxuXG4gICAgLy8gYm90dG9tIGxlZnQgcG9zaXRpb25cbiAgICB2YXIgeCA9IGdseXBoLnBvc2l0aW9uWzBdICsgYml0bWFwLnhvZmZzZXRcbiAgICB2YXIgeSA9IGdseXBoLnBvc2l0aW9uWzFdICsgYml0bWFwLnlvZmZzZXRcblxuICAgIC8vIHF1YWQgc2l6ZVxuICAgIHZhciB3ID0gYml0bWFwLndpZHRoXG4gICAgdmFyIGggPSBiaXRtYXAuaGVpZ2h0XG5cbiAgICAvLyBCTFxuICAgIHBvc2l0aW9uc1tpKytdID0geFxuICAgIHBvc2l0aW9uc1tpKytdID0geVxuICAgIC8vIFRMXG4gICAgcG9zaXRpb25zW2krK10gPSB4XG4gICAgcG9zaXRpb25zW2krK10gPSB5ICsgaFxuICAgIC8vIFRSXG4gICAgcG9zaXRpb25zW2krK10gPSB4ICsgd1xuICAgIHBvc2l0aW9uc1tpKytdID0geSArIGhcbiAgICAvLyBCUlxuICAgIHBvc2l0aW9uc1tpKytdID0geCArIHdcbiAgICBwb3NpdGlvbnNbaSsrXSA9IHlcbiAgfSlcbiAgcmV0dXJuIHBvc2l0aW9uc1xufVxuIiwidmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZVNERlNoYWRlciAob3B0KSB7XG4gIG9wdCA9IG9wdCB8fCB7fVxuICB2YXIgb3BhY2l0eSA9IHR5cGVvZiBvcHQub3BhY2l0eSA9PT0gJ251bWJlcicgPyBvcHQub3BhY2l0eSA6IDFcbiAgdmFyIGFscGhhVGVzdCA9IHR5cGVvZiBvcHQuYWxwaGFUZXN0ID09PSAnbnVtYmVyJyA/IG9wdC5hbHBoYVRlc3QgOiAwLjAwMDFcbiAgdmFyIHByZWNpc2lvbiA9IG9wdC5wcmVjaXNpb24gfHwgJ2hpZ2hwJ1xuICB2YXIgY29sb3IgPSBvcHQuY29sb3JcbiAgdmFyIG1hcCA9IG9wdC5tYXBcblxuICAvLyByZW1vdmUgdG8gc2F0aXNmeSByNzNcbiAgZGVsZXRlIG9wdC5tYXBcbiAgZGVsZXRlIG9wdC5jb2xvclxuICBkZWxldGUgb3B0LnByZWNpc2lvblxuICBkZWxldGUgb3B0Lm9wYWNpdHlcblxuICByZXR1cm4gYXNzaWduKHtcbiAgICB1bmlmb3Jtczoge1xuICAgICAgb3BhY2l0eTogeyB0eXBlOiAnZicsIHZhbHVlOiBvcGFjaXR5IH0sXG4gICAgICBtYXA6IHsgdHlwZTogJ3QnLCB2YWx1ZTogbWFwIHx8IG5ldyBUSFJFRS5UZXh0dXJlKCkgfSxcbiAgICAgIGNvbG9yOiB7IHR5cGU6ICdjJywgdmFsdWU6IG5ldyBUSFJFRS5Db2xvcihjb2xvcikgfVxuICAgIH0sXG4gICAgdmVydGV4U2hhZGVyOiBbXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyxcbiAgICAgICdhdHRyaWJ1dGUgdmVjNCBwb3NpdGlvbjsnLFxuICAgICAgJ3VuaWZvcm0gbWF0NCBwcm9qZWN0aW9uTWF0cml4OycsXG4gICAgICAndW5pZm9ybSBtYXQ0IG1vZGVsVmlld01hdHJpeDsnLFxuICAgICAgJ3ZhcnlpbmcgdmVjMiB2VXY7JyxcbiAgICAgICd2b2lkIG1haW4oKSB7JyxcbiAgICAgICd2VXYgPSB1djsnLFxuICAgICAgJ2dsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG1vZGVsVmlld01hdHJpeCAqIHBvc2l0aW9uOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpLFxuICAgIGZyYWdtZW50U2hhZGVyOiBbXG4gICAgICAnI2lmZGVmIEdMX09FU19zdGFuZGFyZF9kZXJpdmF0aXZlcycsXG4gICAgICAnI2V4dGVuc2lvbiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgOiBlbmFibGUnLFxuICAgICAgJyNlbmRpZicsXG4gICAgICAncHJlY2lzaW9uICcgKyBwcmVjaXNpb24gKyAnIGZsb2F0OycsXG4gICAgICAndW5pZm9ybSBmbG9hdCBvcGFjaXR5OycsXG4gICAgICAndW5pZm9ybSB2ZWMzIGNvbG9yOycsXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgbWFwOycsXG4gICAgICAndmFyeWluZyB2ZWMyIHZVdjsnLFxuXG4gICAgICAnZmxvYXQgYWFzdGVwKGZsb2F0IHZhbHVlKSB7JyxcbiAgICAgICcgICNpZmRlZiBHTF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMnLFxuICAgICAgJyAgICBmbG9hdCBhZndpZHRoID0gbGVuZ3RoKHZlYzIoZEZkeCh2YWx1ZSksIGRGZHkodmFsdWUpKSkgKiAwLjcwNzEwNjc4MTE4NjU0NzU3OycsXG4gICAgICAnICAjZWxzZScsXG4gICAgICAnICAgIGZsb2F0IGFmd2lkdGggPSAoMS4wIC8gMzIuMCkgKiAoMS40MTQyMTM1NjIzNzMwOTUxIC8gKDIuMCAqIGdsX0ZyYWdDb29yZC53KSk7JyxcbiAgICAgICcgICNlbmRpZicsXG4gICAgICAnICByZXR1cm4gc21vb3Roc3RlcCgwLjUgLSBhZndpZHRoLCAwLjUgKyBhZndpZHRoLCB2YWx1ZSk7JyxcbiAgICAgICd9JyxcblxuICAgICAgJ3ZvaWQgbWFpbigpIHsnLFxuICAgICAgJyAgdmVjNCB0ZXhDb2xvciA9IHRleHR1cmUyRChtYXAsIHZVdik7JyxcbiAgICAgICcgIGZsb2F0IGFscGhhID0gYWFzdGVwKHRleENvbG9yLmEpOycsXG4gICAgICAnICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBvcGFjaXR5ICogYWxwaGEpOycsXG4gICAgICBhbHBoYVRlc3QgPT09IDBcbiAgICAgICAgPyAnJ1xuICAgICAgICA6ICcgIGlmIChnbF9GcmFnQ29sb3IuYSA8ICcgKyBhbHBoYVRlc3QgKyAnKSBkaXNjYXJkOycsXG4gICAgICAnfSdcbiAgICBdLmpvaW4oJ1xcbicpXG4gIH0sIG9wdClcbn1cbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnZmxhdHRlbi12ZXJ0ZXgtZGF0YScpXG52YXIgd2FybmVkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzLmF0dHIgPSBzZXRBdHRyaWJ1dGVcbm1vZHVsZS5leHBvcnRzLmluZGV4ID0gc2V0SW5kZXhcblxuZnVuY3Rpb24gc2V0SW5kZXggKGdlb21ldHJ5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gMVxuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAndWludDE2J1xuXG4gIHZhciBpc1I2OSA9ICFnZW9tZXRyeS5pbmRleCAmJiB0eXBlb2YgZ2VvbWV0cnkuc2V0SW5kZXggIT09ICdmdW5jdGlvbidcbiAgdmFyIGF0dHJpYiA9IGlzUjY5ID8gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKCdpbmRleCcpIDogZ2VvbWV0cnkuaW5kZXhcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGlmIChpc1I2OSkgZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdpbmRleCcsIG5ld0F0dHJpYilcbiAgICBlbHNlIGdlb21ldHJ5LmluZGV4ID0gbmV3QXR0cmliXG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlIChnZW9tZXRyeSwga2V5LCBkYXRhLCBpdGVtU2l6ZSwgZHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBpdGVtU2l6ZSAhPT0gJ251bWJlcicpIGl0ZW1TaXplID0gM1xuICBpZiAodHlwZW9mIGR0eXBlICE9PSAnc3RyaW5nJykgZHR5cGUgPSAnZmxvYXQzMidcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiZcbiAgICBBcnJheS5pc0FycmF5KGRhdGFbMF0pICYmXG4gICAgZGF0YVswXS5sZW5ndGggIT09IGl0ZW1TaXplKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0ZWQgdmVydGV4IGFycmF5IGhhcyB1bmV4cGVjdGVkIHNpemU7IGV4cGVjdGVkICcgK1xuICAgICAgaXRlbVNpemUgKyAnIGJ1dCBmb3VuZCAnICsgZGF0YVswXS5sZW5ndGgpXG4gIH1cblxuICB2YXIgYXR0cmliID0gZ2VvbWV0cnkuZ2V0QXR0cmlidXRlKGtleSlcbiAgdmFyIG5ld0F0dHJpYiA9IHVwZGF0ZUF0dHJpYnV0ZShhdHRyaWIsIGRhdGEsIGl0ZW1TaXplLCBkdHlwZSlcbiAgaWYgKG5ld0F0dHJpYikge1xuICAgIGdlb21ldHJ5LmFkZEF0dHJpYnV0ZShrZXksIG5ld0F0dHJpYilcbiAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGUgKGF0dHJpYiwgZGF0YSwgaXRlbVNpemUsIGR0eXBlKSB7XG4gIGRhdGEgPSBkYXRhIHx8IFtdXG4gIGlmICghYXR0cmliIHx8IHJlYnVpbGRBdHRyaWJ1dGUoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkpIHtcbiAgICAvLyBjcmVhdGUgYSBuZXcgYXJyYXkgd2l0aCBkZXNpcmVkIHR5cGVcbiAgICBkYXRhID0gZmxhdHRlbihkYXRhLCBkdHlwZSlcbiAgICBpZiAoYXR0cmliICYmICF3YXJuZWQpIHtcbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLndhcm4oW1xuICAgICAgICAnQSBXZWJHTCBidWZmZXIgaXMgYmVpbmcgdXBkYXRlZCB3aXRoIGEgbmV3IHNpemUgb3IgaXRlbVNpemUsICcsXG4gICAgICAgICdob3dldmVyIFRocmVlSlMgb25seSBzdXBwb3J0cyBmaXhlZC1zaXplIGJ1ZmZlcnMuXFxuVGhlIG9sZCBidWZmZXIgbWF5ICcsXG4gICAgICAgICdzdGlsbCBiZSBrZXB0IGluIG1lbW9yeS5cXG4nLFxuICAgICAgICAnVG8gYXZvaWQgbWVtb3J5IGxlYWtzLCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHlvdSBkaXNwb3NlICcsXG4gICAgICAgICd5b3VyIGdlb21ldHJpZXMgYW5kIGNyZWF0ZSBuZXcgb25lcywgb3Igc3VwcG9ydCB0aGUgZm9sbG93aW5nIFBSIGluIFRocmVlSlM6XFxuJyxcbiAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tcmRvb2IvdGhyZWUuanMvcHVsbC85NjMxJ1xuICAgICAgXS5qb2luKCcnKSk7XG4gICAgfVxuICAgIGF0dHJpYiA9IG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUoZGF0YSwgaXRlbVNpemUpXG4gICAgYXR0cmliLm5lZWRzVXBkYXRlID0gdHJ1ZVxuICAgIHJldHVybiBhdHRyaWJcbiAgfSBlbHNlIHtcbiAgICAvLyBjb3B5IGRhdGEgaW50byB0aGUgZXhpc3RpbmcgYXJyYXlcbiAgICBmbGF0dGVuKGRhdGEsIGF0dHJpYi5hcnJheSlcbiAgICBhdHRyaWIubmVlZHNVcGRhdGUgPSB0cnVlXG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vLyBUZXN0IHdoZXRoZXIgdGhlIGF0dHJpYnV0ZSBuZWVkcyB0byBiZSByZS1jcmVhdGVkLFxuLy8gcmV0dXJucyBmYWxzZSBpZiB3ZSBjYW4gcmUtdXNlIGl0IGFzLWlzLlxuZnVuY3Rpb24gcmVidWlsZEF0dHJpYnV0ZSAoYXR0cmliLCBkYXRhLCBpdGVtU2l6ZSkge1xuICBpZiAoYXR0cmliLml0ZW1TaXplICE9PSBpdGVtU2l6ZSkgcmV0dXJuIHRydWVcbiAgaWYgKCFhdHRyaWIuYXJyYXkpIHJldHVybiB0cnVlXG4gIHZhciBhdHRyaWJMZW5ndGggPSBhdHRyaWIuYXJyYXkubGVuZ3RoXG4gIGlmIChBcnJheS5pc0FycmF5KGRhdGEpICYmIEFycmF5LmlzQXJyYXkoZGF0YVswXSkpIHtcbiAgICAvLyBbIFsgeCwgeSwgeiBdIF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aCAqIGl0ZW1TaXplXG4gIH0gZWxzZSB7XG4gICAgLy8gWyB4LCB5LCB6IF1cbiAgICByZXR1cm4gYXR0cmliTGVuZ3RoICE9PSBkYXRhLmxlbmd0aFxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuIiwidmFyIG5ld2xpbmUgPSAvXFxuL1xudmFyIG5ld2xpbmVDaGFyID0gJ1xcbidcbnZhciB3aGl0ZXNwYWNlID0gL1xccy9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZXh0LCBvcHQpIHtcbiAgICB2YXIgbGluZXMgPSBtb2R1bGUuZXhwb3J0cy5saW5lcyh0ZXh0LCBvcHQpXG4gICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnN1YnN0cmluZyhsaW5lLnN0YXJ0LCBsaW5lLmVuZClcbiAgICB9KS5qb2luKCdcXG4nKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5saW5lcyA9IGZ1bmN0aW9uIHdvcmR3cmFwKHRleHQsIG9wdCkge1xuICAgIG9wdCA9IG9wdHx8e31cblxuICAgIC8vemVybyB3aWR0aCByZXN1bHRzIGluIG5vdGhpbmcgdmlzaWJsZVxuICAgIGlmIChvcHQud2lkdGggPT09IDAgJiYgb3B0Lm1vZGUgIT09ICdub3dyYXAnKSBcbiAgICAgICAgcmV0dXJuIFtdXG5cbiAgICB0ZXh0ID0gdGV4dHx8JydcbiAgICB2YXIgd2lkdGggPSB0eXBlb2Ygb3B0LndpZHRoID09PSAnbnVtYmVyJyA/IG9wdC53aWR0aCA6IE51bWJlci5NQVhfVkFMVUVcbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1heCgwLCBvcHQuc3RhcnR8fDApXG4gICAgdmFyIGVuZCA9IHR5cGVvZiBvcHQuZW5kID09PSAnbnVtYmVyJyA/IG9wdC5lbmQgOiB0ZXh0Lmxlbmd0aFxuICAgIHZhciBtb2RlID0gb3B0Lm1vZGVcblxuICAgIHZhciBtZWFzdXJlID0gb3B0Lm1lYXN1cmUgfHwgbW9ub3NwYWNlXG4gICAgaWYgKG1vZGUgPT09ICdwcmUnKVxuICAgICAgICByZXR1cm4gcHJlKG1lYXN1cmUsIHRleHQsIHN0YXJ0LCBlbmQsIHdpZHRoKVxuICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGdyZWVkeShtZWFzdXJlLCB0ZXh0LCBzdGFydCwgZW5kLCB3aWR0aCwgbW9kZSlcbn1cblxuZnVuY3Rpb24gaWR4T2YodGV4dCwgY2hyLCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIGlkeCA9IHRleHQuaW5kZXhPZihjaHIsIHN0YXJ0KVxuICAgIGlmIChpZHggPT09IC0xIHx8IGlkeCA+IGVuZClcbiAgICAgICAgcmV0dXJuIGVuZFxuICAgIHJldHVybiBpZHhcbn1cblxuZnVuY3Rpb24gaXNXaGl0ZXNwYWNlKGNocikge1xuICAgIHJldHVybiB3aGl0ZXNwYWNlLnRlc3QoY2hyKVxufVxuXG5mdW5jdGlvbiBwcmUobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgbGluZXMgPSBbXVxuICAgIHZhciBsaW5lU3RhcnQgPSBzdGFydFxuICAgIGZvciAodmFyIGk9c3RhcnQ7IGk8ZW5kICYmIGk8dGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hyID0gdGV4dC5jaGFyQXQoaSlcbiAgICAgICAgdmFyIGlzTmV3bGluZSA9IG5ld2xpbmUudGVzdChjaHIpXG5cbiAgICAgICAgLy9JZiB3ZSd2ZSByZWFjaGVkIGEgbmV3bGluZSwgdGhlbiBzdGVwIGRvd24gYSBsaW5lXG4gICAgICAgIC8vT3IgaWYgd2UndmUgcmVhY2hlZCB0aGUgRU9GXG4gICAgICAgIGlmIChpc05ld2xpbmUgfHwgaT09PWVuZC0xKSB7XG4gICAgICAgICAgICB2YXIgbGluZUVuZCA9IGlzTmV3bGluZSA/IGkgOiBpKzFcbiAgICAgICAgICAgIHZhciBtZWFzdXJlZCA9IG1lYXN1cmUodGV4dCwgbGluZVN0YXJ0LCBsaW5lRW5kLCB3aWR0aClcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobWVhc3VyZWQpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxpbmVTdGFydCA9IGkrMVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaW5lc1xufVxuXG5mdW5jdGlvbiBncmVlZHkobWVhc3VyZSwgdGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgsIG1vZGUpIHtcbiAgICAvL0EgZ3JlZWR5IHdvcmQgd3JhcHBlciBiYXNlZCBvbiBMaWJHRFggYWxnb3JpdGhtXG4gICAgLy9odHRwczovL2dpdGh1Yi5jb20vbGliZ2R4L2xpYmdkeC9ibG9iL21hc3Rlci9nZHgvc3JjL2NvbS9iYWRsb2dpYy9nZHgvZ3JhcGhpY3MvZzJkL0JpdG1hcEZvbnRDYWNoZS5qYXZhXG4gICAgdmFyIGxpbmVzID0gW11cblxuICAgIHZhciB0ZXN0V2lkdGggPSB3aWR0aFxuICAgIC8vaWYgJ25vd3JhcCcgaXMgc3BlY2lmaWVkLCB3ZSBvbmx5IHdyYXAgb24gbmV3bGluZSBjaGFyc1xuICAgIGlmIChtb2RlID09PSAnbm93cmFwJylcbiAgICAgICAgdGVzdFdpZHRoID0gTnVtYmVyLk1BWF9WQUxVRVxuXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kICYmIHN0YXJ0IDwgdGV4dC5sZW5ndGgpIHtcbiAgICAgICAgLy9nZXQgbmV4dCBuZXdsaW5lIHBvc2l0aW9uXG4gICAgICAgIHZhciBuZXdMaW5lID0gaWR4T2YodGV4dCwgbmV3bGluZUNoYXIsIHN0YXJ0LCBlbmQpXG5cbiAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBzdGFydCBvZiBsaW5lXG4gICAgICAgIHdoaWxlIChzdGFydCA8IG5ld0xpbmUpIHtcbiAgICAgICAgICAgIGlmICghaXNXaGl0ZXNwYWNlKCB0ZXh0LmNoYXJBdChzdGFydCkgKSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgc3RhcnQrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kZXRlcm1pbmUgdmlzaWJsZSAjIG9mIGdseXBocyBmb3IgdGhlIGF2YWlsYWJsZSB3aWR0aFxuICAgICAgICB2YXIgbWVhc3VyZWQgPSBtZWFzdXJlKHRleHQsIHN0YXJ0LCBuZXdMaW5lLCB0ZXN0V2lkdGgpXG5cbiAgICAgICAgdmFyIGxpbmVFbmQgPSBzdGFydCArIChtZWFzdXJlZC5lbmQtbWVhc3VyZWQuc3RhcnQpXG4gICAgICAgIHZhciBuZXh0U3RhcnQgPSBsaW5lRW5kICsgbmV3bGluZUNoYXIubGVuZ3RoXG5cbiAgICAgICAgLy9pZiB3ZSBoYWQgdG8gY3V0IHRoZSBsaW5lIGJlZm9yZSB0aGUgbmV4dCBuZXdsaW5lLi4uXG4gICAgICAgIGlmIChsaW5lRW5kIDwgbmV3TGluZSkge1xuICAgICAgICAgICAgLy9maW5kIGNoYXIgdG8gYnJlYWsgb25cbiAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKHRleHQuY2hhckF0KGxpbmVFbmQpKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBsaW5lRW5kLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsaW5lRW5kID09PSBzdGFydCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXh0U3RhcnQgPiBzdGFydCArIG5ld2xpbmVDaGFyLmxlbmd0aCkgbmV4dFN0YXJ0LS1cbiAgICAgICAgICAgICAgICBsaW5lRW5kID0gbmV4dFN0YXJ0IC8vIElmIG5vIGNoYXJhY3RlcnMgdG8gYnJlYWssIHNob3cgYWxsLlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXh0U3RhcnQgPSBsaW5lRW5kXG4gICAgICAgICAgICAgICAgLy9lYXQgd2hpdGVzcGFjZSBhdCBlbmQgb2YgbGluZVxuICAgICAgICAgICAgICAgIHdoaWxlIChsaW5lRW5kID4gc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1doaXRlc3BhY2UodGV4dC5jaGFyQXQobGluZUVuZCAtIG5ld2xpbmVDaGFyLmxlbmd0aCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgbGluZUVuZC0tXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lRW5kID49IHN0YXJ0KSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbWVhc3VyZSh0ZXh0LCBzdGFydCwgbGluZUVuZCwgdGVzdFdpZHRoKVxuICAgICAgICAgICAgbGluZXMucHVzaChyZXN1bHQpXG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQgPSBuZXh0U3RhcnRcbiAgICB9XG4gICAgcmV0dXJuIGxpbmVzXG59XG5cbi8vZGV0ZXJtaW5lcyB0aGUgdmlzaWJsZSBudW1iZXIgb2YgZ2x5cGhzIHdpdGhpbiBhIGdpdmVuIHdpZHRoXG5mdW5jdGlvbiBtb25vc3BhY2UodGV4dCwgc3RhcnQsIGVuZCwgd2lkdGgpIHtcbiAgICB2YXIgZ2x5cGhzID0gTWF0aC5taW4od2lkdGgsIGVuZC1zdGFydClcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogc3RhcnQsXG4gICAgICAgIGVuZDogc3RhcnQrZ2x5cGhzXG4gICAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iXX0=
